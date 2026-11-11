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
  vie?: 'maschera' | 'avanzata'
  mcc?: 'manuale' | 'lucas'
  /** ritmo defibrillabile scelto, shock non ancora erogato */
  attesaShock?: boolean
}

const CHIAVE = 'emergenze.acr'
const CICLO = 120_000
const vuoto: Stato = { inizio: null, fine: null, ciclo: null, ritmo: null, eventi: [], spunte: [], vie: 'maschera', mcc: 'manuale' }

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
  const attivo = inCorso && s.ritmo !== 'rosc'
  const totale = s.inizio ? (s.fine ?? adesso) - s.inizio : 0
  const trascorsoCiclo = s.ciclo && attivo ? adesso - s.ciclo : 0
  const restaCiclo = CICLO - trascorsoCiclo
  const scaduto = !!s.ciclo && attivo && !s.attesaShock && restaCiclo <= 0
  const [analisiManuale, setAnalisiManuale] = useState(false)
  const mostraAnalisi = attivo && !s.attesaShock && (scaduto || analisiManuale)

  const conta = (tipo: Evento['tipo']) => s.eventi.filter((e) => e.tipo === tipo).length
  const shock = conta('shock')
  const adr = s.eventi.filter((e) => e.tipo === 'adrenalina')
  const amioEv = s.eventi.filter((e) => e.tipo === 'amiodarone')
  const amioMg = amioEv.reduce((t, e) => t + Number(e.testo.match(/\d+/)?.[0] ?? 0), 0)
  const analisi = conta('ritmo')
  const ultimaAdr = adr.length ? adr[adr.length - 1].t : null
  const daAdr = ultimaAdr ? adesso - ultimaAdr : null
  const maiNonDefib = s.eventi.some((e) => e.tipo === 'ritmo' && e.testo.includes('PEA'))

  // adrenalina: indicata subito nei non defibrillabili, dopo il 3° shock nei defibrillabili, poi ogni 3–5 min
  const adrIndicata = maiNonDefib || shock >= 3
  const adrStato: 'attesa' | 'ora' | 'ritardo' | 'conto' | 'non' =
    !adrIndicata ? 'non'
    : daAdr === null ? 'ora'
    : daAdr >= 300000 ? 'ritardo'
    : daAdr >= 180000 ? 'ora'
    : 'conto'
  const amioDovuta = shock >= 5 && amioMg < 450 ? 150 : shock >= 3 && amioMg < 300 ? 300 : 0

  // allarmi sonori: preavviso a 15 s, fine ciclo ripetuto ogni 4 s finché non si sceglie il ritmo, adrenalina dovuta
  useEffect(() => {
    if (!s.ciclo || !attivo || s.attesaShock) return
    if (restaCiclo <= 15000 && restaCiclo > 14000 && avvisato.current !== -s.ciclo) {
      avvisato.current = -s.ciclo; beep(660, 0.1, 2)
    }
    if (restaCiclo <= 0 && Math.floor(-restaCiclo / 4000) !== avvisato.current) {
      avvisato.current = Math.floor(-restaCiclo / 4000); beep(880, 0.18, 3)
      try { navigator.vibrate?.([300, 100, 300, 100, 300]) } catch { /* */ }
    }
  }, [restaCiclo, s.ciclo, attivo, s.attesaShock, beep])
  const avvisoAdr = useRef<number | null>(null)
  useEffect(() => {
    if (!attivo || adrStato !== 'ora' || !ultimaAdr || avvisoAdr.current === ultimaAdr) return
    avvisoAdr.current = ultimaAdr; beep(520, 0.15, 2)
  }, [adrStato, ultimaAdr, attivo, beep])

  const aggiungi = (testo: string, tipo: Evento['tipo'] = 'altro', extra: Partial<Stato> = {}) => {
    setS((p) => ({ ...p, ...extra, eventi: [...p.eventi, { t: Date.now(), testo, tipo }] }))
    setMsg(testo); setTimeout(() => setMsg(''), 1500)
  }

  const avvia = () => {
    sblocca()
    const t = Date.now()
    setS({ ...vuoto, inizio: t, ciclo: t, eventi: [{ t, testo: 'Inizio RCP', tipo: 'altro' }] })
  }
  const sceltaRitmo = (r: Exclude<Ritmo, null>) => {
    sblocca(); setAnalisiManuale(false)
    const n = analisi + 1
    if (r === 'rosc') return aggiungi(`Analisi ${n}: polso presente → ROSC`, 'rosc', { ritmo: 'rosc', ciclo: null, attesaShock: false })
    if (r === 'defibrillabile') return aggiungi(`Analisi ${n}: FV/TV senza polso (defibrillabile)`, 'ritmo', { ritmo: r, attesaShock: true })
    aggiungi(`Analisi ${n}: PEA/asistolia (non defibrillabile)`, 'ritmo', { ritmo: r, ciclo: Date.now(), attesaShock: false })
  }
  const eroga = () => aggiungi(`Shock n. ${shock + 1}`, 'shock', { ciclo: Date.now(), attesaShock: false })
  const senzaShock = () => aggiungi('Shock non erogato: riprende RCP', 'altro', { ciclo: Date.now(), attesaShock: false })
  const ripresa = () => aggiungi('Nuovo arresto: ripresa RCP', 'altro', { ritmo: null, ciclo: Date.now() })
  const cambiaVie = (v: 'maschera' | 'avanzata') => v !== s.vie && aggiungi(v === 'avanzata' ? 'Via aerea avanzata: compressioni continue' : 'Ventilazione con maschera: 30:2', 'altro', { vie: v })
  const cambiaMcc = (m: 'manuale' | 'lucas') => m !== s.mcc && aggiungi(m === 'lucas' ? 'Massaggiatore meccanico (LUCAS) avviato' : 'Compressioni manuali', 'altro', { mcc: m })
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
      `Durata ${mmss(totale)} · analisi ${analisi} · shock ${shock} · adrenalina ${adr.length} mg · amiodarone ${amioMg} mg`,
      '',
      ...righe,
      cause.length ? `\nCause reversibili valutate: ${cause.join(', ')}` : '',
    ].join('\n')
  }, [s, totale, shock, adr.length, amioMg, analisi])

  const copia = async () => {
    try { await navigator.clipboard.writeText(testoRegistro); setMsg('Registro copiato') } catch { setMsg('Copia non riuscita') }
    setTimeout(() => setMsg(''), 1500)
  }
  const condividi = async () => { try { await navigator.share({ title: 'Registro ACR', text: testoRegistro }) } catch { /* annullato */ } }

  const btn = 'rounded-2xl font-extrabold active:scale-[0.98] transition'
  const continue_ = s.vie === 'avanzata'
  const lucas = s.mcc === 'lucas'

  if (!s.inizio) {
    return (
      <div className="flex flex-col gap-3 lg:max-w-3xl lg:mx-auto lg:w-full">
        <section className="card text-center">
          <p className="etichetta">Arresto cardiaco · ERC 2025</p>
          <h2 className="font-black text-2xl mt-1">Timer ACR</h2>
          <p className="text-[13px] text-tenue mt-1">Ciclo di 2 minuti con allarme per ritmo e polso, percorso defibrillabile/non defibrillabile, adrenalina con conto alla rovescia, registro da copiare in cartella.</p>
          <button onClick={avvia} className={`${btn} mt-4 w-full py-6 text-2xl bg-bordeaux text-white`}>▶ INIZIA RCP</button>
          <p className="text-[11px] text-tenue mt-2">Tieni il telefono con il volume alto: l’allarme del ciclo suona e vibra finché non scegli il ritmo.</p>
        </section>
      </div>
    )
  }

  const percorso = s.ritmo === 'defibrillabile' ? 'defib' : s.ritmo === 'non-defibrillabile' ? 'nondefib' : null

  return (
    <div className="flex flex-col gap-2.5 lg:max-w-3xl lg:mx-auto">
      {msg && <div className="fixed bottom-[96px] lg:bottom-8 left-1/2 lg:left-[calc(50%+7rem)] -translate-x-1/2 z-40 max-w-[90vw] text-center rounded-full bg-verde-scuro text-white text-sm font-bold px-4 py-2 shadow-lg">✓ {msg}</div>}

      {/* ─── ALLARME: analisi del ritmo e del polso ─── */}
      {mostraAnalisi && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3">
          <div className={`w-full max-w-lg rounded-3xl p-4 shadow-2xl ${scaduto ? 'bg-bordeaux text-white' : 'bg-carta'}`}>
            <p className={`text-center font-black text-[26px] leading-tight ${scaduto ? 'animate-pulse' : ''}`}>
              {s.ritmo === null ? 'ANALIZZA IL RITMO' : 'STOP: RITMO E POLSO'}
            </p>
            <p className={`text-center text-[13px] mt-1 ${scaduto ? 'text-white/85' : 'text-tenue'}`}>
              {s.ritmo === null ? 'Piastre collegate, pausa < 10 s.' : `Ciclo finito da ${mmss(-restaCiclo)} · pausa < 10 s, cambio compressore.`}
            </p>
            <div className="grid gap-2 mt-3">
              <button onClick={() => sceltaRitmo('defibrillabile')} className={`${btn} py-4 bg-white text-bordeaux border-4 border-bordeaux text-lg leading-tight`}>
                ⚡ DEFIBRILLABILE<br /><span className="text-[13px] font-bold">FV / TV senza polso</span>
              </button>
              <button onClick={() => sceltaRitmo('non-defibrillabile')} className={`${btn} py-4 bg-white text-oro border-4 border-oro text-lg leading-tight`}>
                NON DEFIBRILLABILE<br /><span className="text-[13px] font-bold">PEA / asistolia · niente shock</span>
              </button>
              {s.ritmo !== null && (
                <button onClick={() => sceltaRitmo('rosc')} className={`${btn} py-3 bg-verde text-white leading-tight`}>
                  ♥ Ritmo organizzato CON POLSO → ROSC
                </button>
              )}
            </div>
            {analisiManuale && !scaduto && (
              <button onClick={() => setAnalisiManuale(false)} className="w-full mt-2 text-sm font-bold text-tenue py-2">Annulla</button>
            )}
          </div>
        </div>
      )}

      {/* ─── ADESSO ─── */}
      {attivo && (
        <section className={`card !p-0 overflow-hidden border-2 ${percorso === 'defib' ? '!border-bordeaux' : percorso === 'nondefib' ? '!border-oro' : ''}`}>
          <div className={`px-3 py-1.5 text-white text-[12px] font-black uppercase tracking-wide flex items-center ${percorso === 'defib' ? 'bg-bordeaux' : percorso === 'nondefib' ? 'bg-oro' : 'bg-verde-scuro'}`}>
            <span className="flex-1">{percorso === 'defib' ? '⚡ Percorso DEFIBRILLABILE · FV/TV' : percorso === 'nondefib' ? 'Percorso NON DEFIBRILLABILE · PEA/asistolia' : 'Ritmo non ancora analizzato'}</span>
            <span className="tabular-nums">tot {mmss(totale)}</span>
          </div>

          {s.attesaShock ? (
            <div className="p-3">
              <p className="font-black text-2xl text-bordeaux leading-tight">⚡ SHOCK ADESSO</p>
              <p className="text-[13px] mt-0.5">Compressioni durante la carica · tutti lontani · ossigeno via. Dopo lo shock riprendi SUBITO le compressioni, senza controllare il polso.</p>
              <button onClick={eroga} className={`${btn} mt-2 w-full py-5 text-2xl bg-bordeaux text-white`}>⚡ SHOCK EROGATO ({shock + 1}°)</button>
              <button onClick={senzaShock} className="w-full mt-1.5 text-[12px] font-bold text-tenue py-1.5">Shock non erogato (ritmo cambiato): riprendi RCP</button>
            </div>
          ) : (
            <div className="p-3">
              <p className="etichetta">Adesso</p>
              <p className="font-black text-[22px] leading-tight mt-0.5">
                {lucas ? 'LUCAS in funzione' : continue_ ? 'Compressioni CONTINUE' : 'Compressioni 30 : 2'}
              </p>
              <p className="text-[13px] text-tenue leading-snug">
                {lucas
                  ? (continue_ ? 'Ventila 10/min senza pause.' : 'Pausa per 2 ventilazioni ogni 30 compressioni.')
                  : continue_ ? '100–120/min, profondità 5–6 cm · ventila 10/min senza fermarti.' : '100–120/min, profondità 5–6 cm · 30 compressioni, 2 ventilazioni.'}
              </p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-[12px] font-bold text-tenue leading-tight">Prossima analisi<br />ritmo e polso tra</p>
                <p className={`font-black text-6xl tabular-nums leading-none ${restaCiclo < 15000 ? 'text-bordeaux animate-pulse' : ''}`}>{mmss(restaCiclo)}</p>
              </div>
              <div className="h-2 rounded-full bg-sabbia mt-2 overflow-hidden">
                <div className={`h-full ${restaCiclo < 15000 ? 'bg-bordeaux' : 'bg-verde'}`} style={{ width: `${Math.min(100, (trascorsoCiclo / CICLO) * 100)}%` }} />
              </div>
              {restaCiclo < 15000 && <p className="text-[12.5px] font-bold text-bordeaux mt-1">Preparati: {percorso === 'defib' ? 'carica il defibrillatore durante le compressioni' : 'prossimo compressore pronto'}.</p>}
              {s.ritmo === null ? (
                <div className="mt-3 rounded-2xl bg-verde-scuro text-white p-2.5">
                  <p className="font-black text-[15px] leading-tight">Collega le piastre e analizza il ritmo appena possibile:</p>
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    <button onClick={() => sceltaRitmo('defibrillabile')} className={`${btn} py-3 bg-white text-bordeaux leading-tight`}>⚡ DEFIBRILLABILE<br /><span className="text-[11px]">FV / TV senza polso</span></button>
                    <button onClick={() => sceltaRitmo('non-defibrillabile')} className={`${btn} py-3 bg-white text-oro leading-tight`}>NON DEFIBRILL.<br /><span className="text-[11px]">PEA / asistolia</span></button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { sblocca(); setAnalisiManuale(true) }} className="w-full mt-2 text-[12px] font-bold rounded-full py-1.5 border border-linea-forte text-tenue">Analizza il ritmo adesso</button>
              )}
            </div>
          )}

          {/* modalità */}
          <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
            <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-xl bg-sabbia border border-linea text-[11.5px] font-bold">
              <button onClick={() => cambiaVie('maschera')} className={`rounded-lg py-1.5 ${!continue_ ? 'bg-carta shadow-card' : 'text-tenue'}`}>Maschera 30:2</button>
              <button onClick={() => cambiaVie('avanzata')} className={`rounded-lg py-1.5 ${continue_ ? 'bg-carta shadow-card' : 'text-tenue'}`}>IOT/SGA continue</button>
            </div>
            <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-xl bg-sabbia border border-linea text-[11.5px] font-bold">
              <button onClick={() => cambiaMcc('manuale')} className={`rounded-lg py-1.5 ${!lucas ? 'bg-carta shadow-card' : 'text-tenue'}`}>Manuale</button>
              <button onClick={() => cambiaMcc('lucas')} className={`rounded-lg py-1.5 ${lucas ? 'bg-carta shadow-card' : 'text-tenue'}`}>LUCAS</button>
            </div>
          </div>
        </section>
      )}

      {/* ─── Farmaci con conto alla rovescia ─── */}
      {attivo && (
        <section className="grid grid-cols-2 gap-2">
          <button onClick={() => aggiungi(`Adrenalina 1 mg (n. ${adr.length + 1})`, 'adrenalina')}
            className={`${btn} p-3 text-left leading-tight ${
              adrStato === 'ritardo' ? 'bg-bordeaux text-white animate-pulse'
              : adrStato === 'ora' ? 'bg-oro text-white animate-pulse'
              : adrStato === 'conto' ? 'bg-verde3 text-verde-scuro'
              : 'bg-sabbia text-tenue border border-linea'}`}>
            <span className="block text-[11px] font-black uppercase tracking-wide opacity-90">Adrenalina 1 mg</span>
            <span className="block font-black text-[26px] tabular-nums mt-0.5">
              {adrStato === 'conto' ? mmss(180000 - (daAdr ?? 0)) : adrStato === 'non' ? '—' : 'ORA'}
            </span>
            <span className="block text-[11.5px] font-bold mt-0.5">
              {adrStato === 'non' ? (shock < 3 ? `dopo il 3° shock (ora ${shock})` : '')
                : adrStato === 'conto' ? `prossima tra · ultima ${mmss(daAdr ?? 0)} fa`
                : adrStato === 'ritardo' ? `in ritardo · ultima ${mmss(daAdr ?? 0)} fa`
                : daAdr === null ? (maiNonDefib ? 'non defibrillabile: subito' : 'dopo il 3° shock') : `ultima ${mmss(daAdr)} fa`}
            </span>
            <span className="block text-[10.5px] font-bold mt-1 opacity-80">tocca quando somministrata · fatte {adr.length}</span>
          </button>
          <button onClick={() => aggiungi(`Amiodarone ${amioDovuta || (amioMg < 300 ? 300 : 150)} mg`, 'amiodarone')}
            className={`${btn} p-3 text-left leading-tight ${amioDovuta ? 'bg-bordeaux text-white animate-pulse' : 'bg-sabbia text-tenue border border-linea'}`}>
            <span className="block text-[11px] font-black uppercase tracking-wide opacity-90">Amiodarone</span>
            <span className="block font-black text-[26px] mt-0.5">{amioDovuta ? `${amioDovuta} mg` : amioMg >= 450 ? 'fatto' : '—'}</span>
            <span className="block text-[11.5px] font-bold mt-0.5">
              {amioDovuta === 300 ? 'ORA: dopo il 3° shock (2 fiale)' : amioDovuta === 150 ? 'ORA: dopo il 5° shock (1 fiala)' : percorso === 'nondefib' && shock === 0 ? 'non indicato (non defibrillabile)' : '300 mg dopo il 3° shock, 150 dopo il 5°'}
            </span>
            <span className="block text-[10.5px] font-bold mt-1 opacity-80">tocca quando somministrato · totale {amioMg} mg</span>
          </button>
        </section>
      )}

      {/* ─── Fatto finora ─── */}
      <section className="card !p-3">
        <p className="etichetta mb-1.5">Fatto finora · dalle {ora(s.inizio)}</p>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            ['Durata', mmss(totale)],
            ['Analisi', String(analisi)],
            ['Shock', String(shock)],
            ['Adrenal.', `${adr.length} mg`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-sabbia py-2">
              <p className="font-black text-xl tabular-nums leading-none">{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-tenue mt-1">{k}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-2 text-[11px] font-bold">
          <span className="rounded-full px-2 py-0.5 bg-verde3 text-verde-scuro">Amiodarone {amioMg} mg</span>
          <span className="rounded-full px-2 py-0.5 bg-verde3 text-verde-scuro">{continue_ ? 'Via aerea avanzata' : 'Maschera 30:2'}</span>
          <span className="rounded-full px-2 py-0.5 bg-verde3 text-verde-scuro">{lucas ? 'LUCAS' : 'Compressioni manuali'}</span>
          {INTERVENTI.filter((i) => s.eventi.some((e) => e.testo === i)).map((i) => (
            <span key={i} className="rounded-full px-2 py-0.5 bg-sabbia border border-linea">✓ {i}</span>
          ))}
        </div>
      </section>

      {/* ─── Promemoria del percorso ─── */}
      {attivo && percorso && (
        <section className={`card !p-3 border-l-4 ${percorso === 'defib' ? '!border-l-bordeaux' : '!border-l-oro'}`}>
          <p className="etichetta mb-1">{percorso === 'defib' ? 'Defibrillabile: cosa prevede' : 'Non defibrillabile: cosa prevede'}</p>
          <ul className="text-[12.5px] leading-snug flex flex-col gap-0.5">
            {percorso === 'defib' ? (
              <>
                <li>• Shock a ogni analisi se FV/TV persiste, poi subito 2 min di RCP.</li>
                <li>• Dopo il 3° shock: adrenalina 1 mg + amiodarone 300 mg; adrenalina poi ogni 3–5 min.</li>
                <li>• Dopo il 5° shock: amiodarone 150 mg. Dopo 3 shock: piastre antero-posteriori.</li>
                <li>• FV refrattaria: pensare a coronarografia con LUCAS, cause reversibili.</li>
              </>
            ) : (
              <>
                <li>• Niente shock. Adrenalina 1 mg SUBITO, poi ogni 3–5 min.</li>
                <li>• Cercare e trattare le cause reversibili (4H · 4T), ecografia durante le pause.</li>
                <li>• A ogni analisi: se diventa FV/TV → percorso defibrillabile.</li>
              </>
            )}
          </ul>
        </section>
      )}

      {/* ─── Altri farmaci e interventi ─── */}
      {attivo && (
        <section className="card !p-3">
          <div className="flex items-center mb-1.5">
            <p className="etichetta flex-1">Altri farmaci e interventi</p>
            <button onClick={() => { sblocca(); setMetronomo((m) => !m) }}
              className={`text-[11.5px] font-extrabold rounded-full px-3 py-1.5 ${metronomo ? 'bg-bordeaux text-white' : 'bg-sabbia border border-linea'}`}>
              ♩ Metronomo 110 {metronomo ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {ALTRI_FARMACI.map((f) => (
              <button key={f} onClick={() => aggiungi(f)} className="text-[11.5px] font-bold rounded-full px-2.5 py-1.5 bg-verde3 text-verde-scuro">{f}</button>
            ))}
            {INTERVENTI.filter((i) => i !== 'Massaggiatore meccanico').map((f) => (
              <button key={f} onClick={() => aggiungi(f)} className="text-[11.5px] font-bold rounded-full px-2.5 py-1.5 bg-sabbia border border-linea">{f}</button>
            ))}
          </div>
        </section>
      )}

      {/* post-ROSC */}
      {inCorso && s.ritmo === 'rosc' && (
        <section className="card !p-3 border-2 !border-verde">
          <p className="font-black text-xl text-verde">♥ ROSC</p>
          <p className="etichetta mb-1.5 mt-1">Dopo il ROSC</p>
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
              <span className={e.tipo === 'shock' ? 'text-bordeaux font-bold' : e.tipo === 'adrenalina' || e.tipo === 'amiodarone' ? 'text-verde font-bold' : e.tipo === 'ritmo' ? 'font-bold' : ''}>{e.testo}</span>
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
