import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/*
 * Timer e registro per l'arresto cardiaco (ERC 2025, ALS adulto).
 * Lo stato resta sul telefono (localStorage), così un ricaricamento non perde l'ACR in corso.
 * Nessun dato del paziente: solo eventi e orari.
 */

type Ritmo = 'defibrillabile' | 'non-defibrillabile' | 'rosc' | null
interface Evento { t: number; testo: string; tipo?: 'shock' | 'adrenalina' | 'amiodarone' | 'ritmo' | 'altro' | 'rosc' }
interface Stato {
  inizio: number | null
  fine: number | null
  ciclo: number | null // inizio del ciclo di 2 minuti
  ritmo: Ritmo
  eventi: Evento[]
  spunte: string[]
}

const CHIAVE = 'emergenze.acr'
const CICLO = 120_000
const vuoto: Stato = { inizio: null, fine: null, ciclo: null, ritmo: null, eventi: [], spunte: [] }

function carica(): Stato {
  try { return { ...vuoto, ...JSON.parse(localStorage.getItem(CHIAVE) ?? '{}') } } catch { return vuoto }
}

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
const ora = (t: number) => new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const CAUSE: [string, string][] = [
  ['Ipossia', 'Ossigeno 100%, ventilazione efficace, controllo del tubo (capnografia).'],
  ['Ipovolemia', 'Liquidi in bolo, emorragia (trasfusione, controllo del sanguinamento).'],
  ['Ipo/iperkaliemia, metaboliche', 'EGA; iperkaliemia: calcio, insulina-glucosio, bicarbonato; ipoglicemia.'],
  ['Ipo/ipertermia', 'Temperatura centrale; ipotermia: riscaldamento, ECMO.'],
  ['Trombosi coronarica', 'Ritmo defibrillabile ricorrente, STEMI prima dell’arresto → emodinamica (massaggiatore meccanico).'],
  ['Trombosi polmonare (EP)', 'Trombolisi durante la RCP, poi continuare 60–90 min.'],
  ['Tamponamento cardiaco', 'Ecografia; pericardiocentesi.'],
  ['Pneumotorace iperteso', 'Decompressione/toracostomia bilaterale se trauma.'],
  ['Tossici', 'Anamnesi; antidoti (bicarbonato nei triciclici, emulsione lipidica negli anestetici locali); Centro Antiveleni.'],
]

const ROSC = [
  'ABCDE; via aerea sicura, capnografia',
  'SpO₂ 94–98%, PaCO₂ normale',
  'PAS > 100 mmHg (PAM ≥ 65), noradrenalina se serve',
  'ECG a 12 derivazioni: STEMI → coronarografia immediata',
  'EGA, elettroliti, glicemia (evitare ipo/iperglicemia)',
  'Ecocardio; cercare e trattare la causa',
  'Controllo della temperatura: evitare la febbre (> 37,7 °C) per 72 h',
  'TC encefalo/torace se la causa non è chiara',
  'Rianimatore; destinazione (UTIC/terapia intensiva/emodinamica)',
]

const INTERVENTI = ['Accesso IV', 'Accesso IO', 'IOT', 'Sovraglottico', 'Capnografia', 'Ecografia', 'Massaggiatore meccanico', 'Piastre antero-posteriori', 'Cambio compressore']
const ALTRI_FARMACI = ['Calcio cloruro 10% 10 mL', 'Bicarbonato 8,4% 50 mL', 'Magnesio 2 g', 'Lidocaina 100 mg', 'Trombolisi', 'Glucosio 33% 50 mL']

/** Beep con WebAudio (serve un primo tocco dell'utente per sbloccare l'audio). */
function useSuono() {
  const ctx = useRef<AudioContext | null>(null)
  const sblocca = useCallback(() => {
    try { ctx.current ??= new AudioContext(); void ctx.current.resume() } catch { /* niente audio */ }
  }, [])
  const beep = useCallback((freq = 880, dur = 0.12, quante = 1) => {
    const c = ctx.current
    if (!c) return
    for (let i = 0; i < quante; i++) {
      const o = c.createOscillator(); const g = c.createGain()
      o.frequency.value = freq; o.type = 'square'
      const t0 = c.currentTime + i * (dur + 0.08)
      g.gain.setValueAtTime(0.25, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
      o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur)
    }
  }, [])
  return { sblocca, beep }
}

export default function Acr() {
  const [s, setS] = useState<Stato>(carica)
  const [adesso, setAdesso] = useState(Date.now())
  const [metronomo, setMetronomo] = useState(false)
  const [msg, setMsg] = useState('')
  const { sblocca, beep } = useSuono()
  const avvisato = useRef<number | null>(null)

  useEffect(() => { try { localStorage.setItem(CHIAVE, JSON.stringify(s)) } catch { /* pieno */ } }, [s])

  // orologio
  useEffect(() => {
    const id = setInterval(() => setAdesso(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  // schermo acceso durante l'ACR
  useEffect(() => {
    if (!s.inizio || s.fine) return
    let lock: WakeLockSentinel | null = null
    const chiedi = async () => { try { lock = await navigator.wakeLock?.request('screen') } catch { /* non supportato */ } }
    void chiedi()
    const vis = () => { if (document.visibilityState === 'visible') void chiedi() }
    document.addEventListener('visibilitychange', vis)
    return () => { document.removeEventListener('visibilitychange', vis); void lock?.release() }
  }, [s.inizio, s.fine])

  // metronomo 110/min
  useEffect(() => {
    if (!metronomo) return
    const id = setInterval(() => beep(1200, 0.03), 60000 / 110)
    return () => clearInterval(id)
  }, [metronomo, beep])

  const inCorso = !!s.inizio && !s.fine
  const totale = s.inizio ? (s.fine ?? adesso) - s.inizio : 0
  const trascorsoCiclo = s.ciclo && inCorso && s.ritmo !== 'rosc' ? adesso - s.ciclo : 0
  const restaCiclo = CICLO - trascorsoCiclo
  const scaduto = !!s.ciclo && inCorso && s.ritmo !== 'rosc' && restaCiclo <= 0

  // allarme a fine ciclo (una volta per ciclo) e preavviso a 15 s
  useEffect(() => {
    if (!s.ciclo || !inCorso || s.ritmo === 'rosc') return
    if (restaCiclo <= 15000 && restaCiclo > 14000 && avvisato.current !== -s.ciclo) {
      avvisato.current = -s.ciclo; beep(660, 0.1, 1)
    }
    if (restaCiclo <= 0 && avvisato.current !== s.ciclo) {
      avvisato.current = s.ciclo; beep(880, 0.18, 3)
      try { navigator.vibrate?.([300, 100, 300, 100, 300]) } catch { /* */ }
    }
  }, [restaCiclo, s.ciclo, s.ritmo, inCorso, beep])

  const conta = (tipo: Evento['tipo']) => s.eventi.filter((e) => e.tipo === tipo).length
  const shock = conta('shock')
  const adr = s.eventi.filter((e) => e.tipo === 'adrenalina')
  const amio = conta('amiodarone')
  const ultimaAdr = adr.length ? adr[adr.length - 1].t : null
  const daAdr = ultimaAdr ? adesso - ultimaAdr : null

  const aggiungi = (testo: string, tipo: Evento['tipo'] = 'altro', extra: Partial<Stato> = {}) => {
    setS((p) => ({ ...p, ...extra, eventi: [...p.eventi, { t: Date.now(), testo, tipo }] }))
    setMsg(testo); setTimeout(() => setMsg(''), 1500)
  }

  const avvia = () => {
    sblocca()
    const t = Date.now()
    setS({ ...vuoto, inizio: t, ciclo: t, eventi: [{ t, testo: 'Inizio RCP', tipo: 'altro' }] })
  }
  const ritmo = (r: Exclude<Ritmo, null>, etichetta: string) => {
    sblocca()
    if (r === 'rosc') return aggiungi('ROSC', 'rosc', { ritmo: 'rosc', ciclo: null })
    aggiungi(`Ritmo: ${etichetta}`, 'ritmo', { ritmo: r, ciclo: r === 'non-defibrillabile' ? Date.now() : s.ciclo })
  }
  const eroga = () => aggiungi(`Shock n. ${shock + 1}`, 'shock', { ciclo: Date.now() })
  const ripresa = () => aggiungi('Nuovo arresto: ripresa RCP', 'altro', { ritmo: null, ciclo: Date.now() })
  const termina = () => {
    if (!confirm('Terminare l’ACR? Il registro resta consultabile.')) return
    aggiungi('Fine rianimazione', 'altro', { fine: Date.now() })
  }
  const nuovo = () => {
    if (s.inizio && !confirm('Cancellare il registro e iniziare un nuovo ACR?')) return
    setS(vuoto); setMetronomo(false)
  }
  const spunta = (k: string) => setS((p) => ({ ...p, spunte: p.spunte.includes(k) ? p.spunte.filter((x) => x !== k) : [...p.spunte, k] }))

  const testoRegistro = useMemo(() => {
    if (!s.inizio) return ''
    const righe = s.eventi.map((e) => `${ora(e.t)}  (+${mmss(e.t - s.inizio!)})  ${e.testo}`)
    const cause = s.spunte.filter((k) => k.startsWith('H:')).map((k) => k.slice(2))
    return [
      `ACR — inizio ${new Date(s.inizio).toLocaleString('it-IT')}`,
      `Durata ${mmss(totale)} · shock ${shock} · adrenalina ${adr.length} mg · amiodarone ${s.eventi.filter((e) => e.tipo === 'amiodarone').map((e) => e.testo.match(/\d+/)?.[0]).join('+') || 0} mg`,
      '',
      ...righe,
      cause.length ? `\nCause reversibili valutate: ${cause.join(', ')}` : '',
    ].join('\n')
  }, [s, totale, shock, adr.length])

  const copia = async () => {
    try { await navigator.clipboard.writeText(testoRegistro); setMsg('Registro copiato') } catch { setMsg('Copia non riuscita') }
    setTimeout(() => setMsg(''), 1500)
  }
  const condividi = async () => { try { await navigator.share({ title: 'Registro ACR', text: testoRegistro }) } catch { /* annullato */ } }

  // cosa fare adesso (ERC 2025)
  const promemoria: { testo: string; urgente?: boolean }[] = []
  if (inCorso && s.ritmo !== 'rosc') {
    if (s.ritmo === 'non-defibrillabile' && adr.length === 0) promemoria.push({ testo: 'Adrenalina 1 mg ev/io SUBITO (ritmo non defibrillabile)', urgente: true })
    if (s.ritmo === 'defibrillabile' && shock >= 3 && adr.length === 0) promemoria.push({ testo: 'Dopo il 3° shock: adrenalina 1 mg + amiodarone 300 mg', urgente: true })
    if (shock >= 3 && amio === 0 && s.ritmo === 'defibrillabile' && adr.length > 0) promemoria.push({ testo: 'Amiodarone 300 mg (dopo il 3° shock)', urgente: true })
    if (shock >= 5 && amio === 1) promemoria.push({ testo: 'Dopo il 5° shock: amiodarone 150 mg', urgente: true })
    if (daAdr !== null && daAdr >= 180000) promemoria.push({ testo: `Adrenalina: ${daAdr >= 300000 ? 'in ritardo' : 'possibile'} (ultima ${mmss(daAdr)} fa, ogni 3–5 min)`, urgente: daAdr >= 300000 })
    if (shock >= 3) promemoria.push({ testo: 'Dopo 3 shock: considerare le piastre in posizione antero-posteriore' })
    promemoria.push({ testo: 'Compressioni di qualità, cambio compressore a ogni analisi, capnografia, cause reversibili' })
  }

  const btn = 'rounded-2xl font-extrabold active:scale-[0.98] transition'

  if (!s.inizio) {
    return (
      <div className="flex flex-col gap-3 lg:max-w-3xl lg:mx-auto lg:w-full">
        <section className="card text-center">
          <p className="etichetta">Arresto cardiaco · ERC 2025</p>
          <h2 className="font-black text-2xl mt-1">Timer ACR</h2>
          <p className="text-[13px] text-tenue mt-1">Ciclo di 2 minuti con allarme, shock, farmaci con promemoria, metronomo, cause reversibili, registro da copiare in cartella.</p>
          <button onClick={avvia} className={`${btn} mt-4 w-full py-6 text-2xl bg-bordeaux text-white`}>▶ INIZIA RCP</button>
          <p className="text-[11px] text-tenue mt-2">Tieni il telefono con il volume alto: l’allarme del ciclo suona e vibra.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 lg:max-w-3xl lg:mx-auto">
      {/* tempi */}
      <section className={`card !p-3 ${scaduto ? 'bg-bordeaux text-white animate-pulse' : ''}`}>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${scaduto ? 'text-white/80' : 'text-tenue'}`}>Totale · dalle {ora(s.inizio)}</p>
            <p className="font-black text-3xl tabular-nums leading-none mt-0.5">{mmss(totale)}</p>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-bold uppercase tracking-wide ${scaduto ? 'text-white/80' : 'text-tenue'}`}>
              {s.ritmo === 'rosc' ? 'ROSC' : s.fine ? 'Terminato' : scaduto ? 'ANALISI DEL RITMO' : 'Ciclo RCP'}
            </p>
            <p className={`font-black text-5xl tabular-nums leading-none mt-0.5 ${!scaduto && restaCiclo < 15000 && inCorso && s.ritmo !== 'rosc' ? 'text-bordeaux' : ''}`}>
              {s.ritmo === 'rosc' || s.fine ? '—' : scaduto ? mmss(-restaCiclo) : mmss(restaCiclo)}
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-2 text-[12px] font-bold">
          <span>⚡ {shock}</span><span>💉 adr {adr.length}{daAdr !== null ? ` · ${mmss(daAdr)} fa` : ''}</span><span>amio {amio}</span>
          {s.ritmo && <span className="ml-auto">{s.ritmo === 'defibrillabile' ? 'FV/TV' : s.ritmo === 'rosc' ? 'ROSC' : 'PEA/asistolia'}</span>}
        </div>
      </section>

      {msg && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-verde-scuro text-white text-sm font-bold px-4 py-2 shadow-lg">✓ {msg}</div>}

      {inCorso && s.ritmo !== 'rosc' && (
        <>
          {/* ritmo */}
          <section className="card !p-3">
            <p className="etichetta mb-1.5">Analisi del ritmo</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => ritmo('defibrillabile', 'FV/TV senza polso')} className={`${btn} py-3 text-sm ${s.ritmo === 'defibrillabile' ? 'bg-bordeaux text-white' : 'bg-bordeaux3 text-bordeaux'}`}>FV / TV</button>
              <button onClick={() => ritmo('non-defibrillabile', 'PEA/asistolia')} className={`${btn} py-3 text-sm ${s.ritmo === 'non-defibrillabile' ? 'bg-oro text-white' : 'bg-oro3 text-oro'}`}>PEA / asist.</button>
              <button onClick={() => ritmo('rosc', 'ROSC')} className={`${btn} py-3 text-sm bg-verde3 text-verde-scuro`}>ROSC</button>
            </div>
            {s.ritmo === 'defibrillabile' && (
              <button onClick={eroga} className={`${btn} mt-2 w-full py-4 text-xl bg-bordeaux text-white`}>⚡ SHOCK EROGATO ({shock + 1}°)</button>
            )}
            {s.ritmo === 'non-defibrillabile' && (
              <button onClick={() => aggiungi('Nuovo ciclo RCP', 'altro', { ciclo: Date.now() })} className={`${btn} mt-2 w-full py-3 bg-oro text-white`}>↻ Riprendi RCP, nuovo ciclo</button>
            )}
          </section>

          {/* promemoria */}
          {promemoria.length > 0 && (
            <section className="card !p-3">
              <p className="etichetta mb-1.5">Adesso</p>
              <ul className="flex flex-col gap-1">
                {promemoria.map((p) => (
                  <li key={p.testo} className={`text-[13px] leading-snug rounded-xl px-2.5 py-1.5 ${p.urgente ? 'bg-bordeaux text-white font-bold' : 'bg-sabbia'}`}>{p.testo}</li>
                ))}
              </ul>
            </section>
          )}

          {/* farmaci */}
          <section className="card !p-3">
            <p className="etichetta mb-1.5">Farmaci</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => aggiungi(`Adrenalina 1 mg (n. ${adr.length + 1})`, 'adrenalina')}
                className={`${btn} py-3 text-sm leading-tight ${daAdr !== null && daAdr >= 240000 ? 'bg-oro text-white' : 'bg-verde text-white'}`}>
                Adrenalina 1 mg<br /><span className="text-[11px] font-bold opacity-90">{adr.length} · {daAdr !== null ? mmss(daAdr) : '—'}</span>
              </button>
              <button onClick={() => aggiungi('Amiodarone 300 mg', 'amiodarone')} className={`${btn} py-3 text-sm leading-tight bg-verde3 text-verde-scuro`}>Amiodarone 300 mg<br /><span className="text-[11px] font-bold">2 fiale</span></button>
              <button onClick={() => aggiungi('Amiodarone 150 mg', 'amiodarone')} className={`${btn} py-3 text-sm leading-tight bg-verde3 text-verde-scuro`}>Amiodarone 150 mg<br /><span className="text-[11px] font-bold">1 fiala</span></button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {ALTRI_FARMACI.map((f) => (
                <button key={f} onClick={() => aggiungi(f)} className="text-[11.5px] font-bold rounded-full px-2.5 py-1.5 bg-sabbia border border-linea">{f}</button>
              ))}
            </div>
          </section>

          {/* interventi */}
          <section className="card !p-3">
            <div className="flex items-center mb-1.5">
              <p className="etichetta flex-1">Interventi</p>
              <button onClick={() => { sblocca(); setMetronomo((m) => !m) }}
                className={`text-[11.5px] font-extrabold rounded-full px-3 py-1.5 ${metronomo ? 'bg-bordeaux text-white' : 'bg-sabbia border border-linea'}`}>
                ♩ Metronomo 110 {metronomo ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {INTERVENTI.map((f) => (
                <button key={f} onClick={() => aggiungi(f)} className="text-[11.5px] font-bold rounded-full px-2.5 py-1.5 bg-sabbia border border-linea">{f}</button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* post-ROSC */}
      {inCorso && s.ritmo === 'rosc' && (
        <section className="card !p-3">
          <p className="etichetta mb-1.5">Dopo il ROSC</p>
          <ul className="flex flex-col gap-1">
            {ROSC.map((r) => {
              const k = 'R:' + r
              return (
                <li key={r}>
                  <label className="flex gap-2 items-start text-[13px] leading-snug">
                    <input type="checkbox" checked={s.spunte.includes(k)} onChange={() => spunta(k)} className="mt-0.5 w-5 h-5 accent-[var(--color-verde)]" />
                    <span className={s.spunte.includes(k) ? 'line-through text-tenue' : ''}>{r}</span>
                  </label>
                </li>
              )
            })}
          </ul>
          <button onClick={ripresa} className={`${btn} mt-3 w-full py-3 bg-bordeaux text-white`}>Nuovo arresto: riprendi RCP</button>
        </section>
      )}

      {/* cause reversibili */}
      {inCorso && (
        <details className="card !p-0 overflow-hidden group">
          <summary className="px-4 py-3 list-none cursor-pointer flex items-center">
            <span className="font-bold flex-1">Cause reversibili (4H · 4T)</span>
            <span className="text-[12px] font-bold text-verde mr-2">{s.spunte.filter((k) => k.startsWith('H:')).length}/{CAUSE.length}</span>
            <span className="text-tenue group-open:rotate-90 transition-transform">›</span>
          </summary>
          <ul className="px-4 pb-3 flex flex-col gap-1.5">
            {CAUSE.map(([c, cosa]) => {
              const k = 'H:' + c
              return (
                <li key={c}>
                  <label className="flex gap-2 items-start text-[13px] leading-snug">
                    <input type="checkbox" checked={s.spunte.includes(k)} onChange={() => spunta(k)} className="mt-0.5 w-5 h-5 shrink-0" />
                    <span><b>{c}</b> — <span className="text-tenue">{cosa}</span></span>
                  </label>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      {/* registro */}
      <section className="card !p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <p className="etichetta flex-1">Registro</p>
          <button onClick={copia} className="text-[11.5px] font-bold rounded-full px-2.5 py-1 bg-verde text-white">Copia</button>
          {'share' in navigator && <button onClick={condividi} className="text-[11.5px] font-bold rounded-full px-2.5 py-1 border border-verde text-verde">Condividi</button>}
        </div>
        <ol className="flex flex-col-reverse gap-0.5 text-[12.5px] tabular-nums max-h-64 overflow-y-auto">
          {s.eventi.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-tenue w-[62px] shrink-0">{ora(e.t)}</span>
              <span className="text-tenue w-[44px] shrink-0">+{mmss(e.t - s.inizio!)}</span>
              <span className={e.tipo === 'shock' ? 'text-bordeaux font-bold' : e.tipo === 'adrenalina' || e.tipo === 'amiodarone' ? 'text-verde font-bold' : ''}>{e.testo}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex gap-2">
        {inCorso && <button onClick={termina} className={`${btn} flex-1 py-3 border border-linea-forte text-tenue`}>Termina ACR</button>}
        <button onClick={nuovo} className={`${btn} flex-1 py-3 border border-linea-forte text-tenue`}>Nuovo ACR</button>
      </div>
      <p className="text-[10.5px] text-tenue px-1">Strumento di registrazione e promemoria (ERC 2025): non sostituisce il giudizio del team leader.</p>
    </div>
  )
}
