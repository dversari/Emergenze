import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RitornoCtx, useConRitorno } from '../lib/ritorno'
import { CAV_FIRENZE } from '../lib/lineeGuida'
import { sindrome, type Icona } from '../lib/sindromiTossiche'
import { IconaSindrome } from '../components/IconeTossiche'
import {
  ALCOL, EFFETTI, INTERAZIONI, SOMMA, cercaFarmaci, farmaco,
  type Effetto, type Farmaco,
} from '../lib/ingestione'

type Unita = 'cp' | 'mL' | 'mg' | 'UI'
interface Riga { uid: string; id: string; n: string; unita: Unita; forza: string; rp: boolean }
interface Stato { peso: string; ora: string; alcol: boolean; righe: Riga[]; altri: string }

const CHIAVE = 'emergenze.ingestione'
const vuoto: Stato = { peso: '70', ora: '', alcol: false, righe: [], altri: '' }
const num = (s: string) => { const v = parseFloat(s.replace(',', '.')); return Number.isFinite(v) ? v : NaN }
const fmt = (v: number) => (Math.round(v * 100) / 100).toLocaleString('it-IT')

function LinkR(props: React.ComponentProps<typeof Link>) {
  const r = useConRitorno()
  return <Link {...props} state={r.state} onClick={r.onClick} />
}

/** Componenti effettivi di una riga (le associazioni si scompongono). */
function componenti(r: Riga): { f: Farmaco; mg: number | null; rp: boolean }[] {
  const f = farmaco(r.id)
  if (!f) return []
  const n = num(r.n)
  if (f.componenti) return f.componenti.map((c) => ({ f: farmaco(c.id)!, mg: Number.isFinite(n) ? n * c.mg : null, rp: r.rp }))
  let mg: number | null = null
  if (r.unita === 'mg') mg = n
  else if (r.unita === 'cp' || r.unita === 'mL') mg = n * num(r.forza)
  return [{ f, mg: mg !== null && Number.isFinite(mg) ? mg : null, rp: r.rp }]
}

function corrisponde(chiave: string, f: Farmaco | typeof ALCOL) {
  if (chiave === f.id) return true
  if (chiave.startsWith('classe:') && 'classe' in f) return f.classe.includes(chiave.slice(7))
  return false
}

export default function Ingestione() {
  const [s, setS] = useState<Stato>(() => {
    try { return { ...vuoto, ...JSON.parse(sessionStorage.getItem(CHIAVE) ?? '{}') } } catch { return vuoto }
  })
  useEffect(() => { try { sessionStorage.setItem(CHIAVE, JSON.stringify(s)) } catch { /* */ } }, [s])
  const [q, setQ] = useState('')
  const [copiato, setCopiato] = useState(false)
  const trovati = cercaFarmaci(q)
  const peso = num(s.peso)

  const aggiungi = (f: Farmaco) => {
    const unita: Unita = f.ui ? 'UI' : 'cp'
    setS((x) => ({ ...x, righe: [...x.righe, { uid: Math.random().toString(36).slice(2), id: f.id, n: '', unita, forza: String(f.dosaggi?.[0] ?? ''), rp: false }] }))
    setQ('')
  }
  const cambia = (uid: string, p: Partial<Riga>) => setS((x) => ({ ...x, righe: x.righe.map((r) => (r.uid === uid ? { ...r, ...p } : r)) }))
  const togli = (uid: string) => setS((x) => ({ ...x, righe: x.righe.filter((r) => r.uid !== uid) }))

  // Sostanze effettive (componenti delle associazioni sommati)
  const sostanze = useMemo(() => {
    const m = new Map<string, { f: Farmaco; mg: number | null; rp: boolean; ui?: number }>()
    for (const r of s.righe) {
      for (const c of componenti(r)) {
        const prima = m.get(c.f.id)
        if (c.f.ui) {
          const v = num(r.n)
          m.set(c.f.id, { f: c.f, mg: null, rp: false, ui: (prima?.ui ?? 0) + (Number.isFinite(v) ? v : 0) })
        } else {
          m.set(c.f.id, { f: c.f, mg: prima ? (prima.mg ?? 0) + (c.mg ?? 0) || null : c.mg, rp: (prima?.rp ?? false) || c.rp })
        }
      }
    }
    return [...m.values()]
  }, [s.righe])

  const tutti: (Farmaco | typeof ALCOL)[] = [...sostanze.map((x) => x.f), ...(s.alcol ? [ALCOL] : [])]

  // Effetti condivisi
  const perEffetto = new Map<Effetto, string[]>()
  for (const f of tutti) for (const e of f.effetti) perEffetto.set(e, [...(perEffetto.get(e) ?? []), f.nome])
  const effettiOrdinati = [...perEffetto.entries()].sort((a, b) => b[1].length - a[1].length)
  const sommati = effettiOrdinati.filter(([e, l]) => l.length >= 2 && SOMMA[e])

  // Interazioni specifiche
  const specifiche = INTERAZIONI.flatMap((i) => {
    const A = tutti.filter((f) => i.a.some((k) => corrisponde(k, f)))
    if (!A.length) return []
    if (i.b.includes('*')) return [{ testo: i.testo, chi: A.map((f) => f.nome) }]
    const B = tutti.filter((f) => i.b.some((k) => corrisponde(k, f)) && !A.includes(f))
    if (!B.length) return []
    return [{ testo: i.testo, chi: [...new Set([...A, ...B].map((f) => f.nome))] }]
  })

  // Carbone, monitoraggio, rilascio prolungato
  const oreDa = s.ora ? (() => {
    const [h, m] = s.ora.split(':').map(Number)
    const ora = new Date(); const t = new Date(); t.setHours(h, m, 0, 0)
    if (t > ora) t.setDate(t.getDate() - 1)
    return (ora.getTime() - t.getTime()) / 3600000
  })() : null
  const noCarbone = sostanze.filter((x) => x.f.carbone === 'no').map((x) => x.f.nome)
  const ripetuto = sostanze.filter((x) => x.f.carbone === 'ripetuto').map((x) => x.f.nome)
  const rp = sostanze.filter((x) => x.rp).map((x) => x.f.nome)
  const monitor = [...new Set([
    ...effettiOrdinati.map(([e]) => EFFETTI[e].monitor),
    ...sostanze.flatMap((x) => x.f.monitorare),
  ])]
  const dialisi = sostanze.filter((x) => x.f.dialisi).map((x) => `${x.f.nome}: ${x.f.dialisi!.replace(/\.$/, "")}`)
  const sindromi = [...new Set(sostanze.map((x) => x.f.sindrome).filter(Boolean) as string[])]

  const riepilogo = [
    `Intossicazione volontaria – ${Number.isFinite(peso) ? `peso ${fmt(peso)} kg` : 'peso ?'}${s.ora ? `, assunzione alle ${s.ora}${oreDa !== null ? ` (${fmt(Math.round(oreDa * 10) / 10)} h fa)` : ''}` : ', ora ignota'}`,
    ...s.righe.map((r) => {
      const f = farmaco(r.id)!
      const q = r.unita === 'mg' ? `${r.n || '?'} mg totali` : r.unita === 'UI' ? `${r.n || '?'} UI` : f.componenti ? `${r.n || '?'} cp` : `${r.n || '?'} ${r.unita} da ${r.forza} mg${r.unita === 'mL' ? '/mL' : ''}`
      return `- ${f.nome}${f.commerciali[0] ? ` (${f.commerciali[0]})` : ''}: ${q}${r.rp ? ', rilascio prolungato' : ''}`
    }),
    ...sostanze.filter((x) => x.mg !== null && !x.f.ui).map((x) => `  ${x.f.nome} totale ${fmt(x.mg!)} mg${Number.isFinite(peso) && peso > 0 ? ` (${fmt(x.mg! / peso)} mg/kg)` : ''}`),
    ...(s.alcol ? ['- Alcol'] : []),
    ...(s.altri.trim() ? [`- Altro: ${s.altri.trim()}`] : []),
  ].join('\n')

  const copia = async () => {
    try { await navigator.clipboard.writeText(riepilogo); setCopiato(true); setTimeout(() => setCopiato(false), 1500) } catch { /* */ }
  }

  return (
    <RitornoCtx.Provider value="Ingestione multipla">
      <div className="flex flex-col gap-3">
        <Link to="/linee-guida/tossicologia" className="text-sm text-tenue">‹ Tossicologia</Link>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-bordeaux font-bold">Tossicologia · strumento</p>
          <h2 className="font-extrabold text-2xl tracking-tight leading-tight">Ingestione di farmaci</h2>
          <p className="text-sm text-tenue">Inserisci cosa ha preso: effetti attesi, cosa monitorare, interazioni e terapia per ogni farmaco. La gravità del caso si definisce con il CAV.</p>
        </div>

        <a href={CAV_FIRENZE.tel} className="card !py-3 flex items-center justify-between gap-3 bg-bordeaux text-white no-underline">
          <span><span className="block text-[11px] font-bold uppercase tracking-wide opacity-80">Centro antiveleni di Firenze · 24 h</span><span className="text-lg font-extrabold">{CAV_FIRENZE.numero}</span></span>
          <span className="rounded-full bg-white text-bordeaux font-extrabold text-sm px-4 py-2">Chiama</span>
        </a>

        {/* ——— Maschera */}
        <section className="card flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm font-bold">Peso (kg)
              <input inputMode="decimal" value={s.peso} onChange={(e) => setS({ ...s, peso: e.target.value })} className="rounded-xl border border-linea bg-carta px-3 py-2 font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold">Ora dell’assunzione
              <input type="time" value={s.ora} onChange={(e) => setS({ ...s, ora: e.target.value })} className="rounded-xl border border-linea bg-carta px-3 py-2 font-normal" />
            </label>
          </div>
          {oreDa !== null && <p className="text-xs text-tenue -mt-1">Trascorse circa <b>{fmt(Math.round(oreDa * 10) / 10)} h</b>.</p>}

          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Aggiungi farmaco (principio attivo o nome commerciale)…"
              className="w-full rounded-xl border-2 border-bordeaux2/50 bg-carta px-3 py-2.5" />
            {trovati.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-linea bg-carta shadow-lg overflow-hidden">
                {trovati.map((f) => (
                  <li key={f.id}>
                    <button onClick={() => aggiungi(f)} className="w-full text-left px-3 py-2 hover:bg-sabbia border-b border-linea last:border-0">
                      <b>{f.nome}</b>{f.commerciali.length > 0 && <span className="text-tenue"> ({f.commerciali.join(', ')})</span>}
                      <span className="block text-[11px] text-tenue">{f.classe}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {q.trim().length >= 2 && trovati.length === 0 && (
              <p className="text-xs text-tenue mt-1">Non in archivio: scrivilo in «Altro» qui sotto e chiedi al CAV.</p>
            )}
          </div>

          {s.righe.length > 0 && (
            <ul className="flex flex-col gap-2">
              {s.righe.map((r) => {
                const f = farmaco(r.id)!
                const tot = componenti(r)
                return (
                  <li key={r.uid} className="rounded-xl bg-sabbia px-3 py-2.5 flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 min-w-0 leading-tight"><b className="text-bordeaux">{f.nome}</b>{f.commerciali[0] && <span className="text-tenue text-sm"> ({f.commerciali.join(', ')})</span>}</p>
                      <button onClick={() => togli(r.uid)} className="text-tenue text-lg leading-none px-1" aria-label="Rimuovi">×</button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <input inputMode="decimal" value={r.n} onChange={(e) => cambia(r.uid, { n: e.target.value })} placeholder="quantità"
                        className="w-24 rounded-lg border border-linea bg-carta px-2 py-1.5" />
                      {f.componenti ? <span>compresse</span> : f.ui ? <span>UI</span> : (
                        <>
                          <select value={r.unita} onChange={(e) => {
                            const u = e.target.value as Unita
                            cambia(r.uid, { unita: u, forza: u === 'mL' ? String(f.mgMl ?? '') : u === 'cp' ? String(f.dosaggi?.[0] ?? '') : r.forza })
                          }} className="rounded-lg border border-linea bg-carta px-2 py-1.5">
                            <option value="cp">compresse</option>
                            <option value="mL">mL (gocce/sciroppo)</option>
                            <option value="mg">mg totali</option>
                          </select>
                          {r.unita !== 'mg' && (
                            <>
                              <span>da</span>
                              <input inputMode="decimal" value={r.forza} onChange={(e) => cambia(r.uid, { forza: e.target.value })}
                                list={`dos-${r.uid}`} className="w-20 rounded-lg border border-linea bg-carta px-2 py-1.5" />
                              <span>{r.unita === 'mL' ? 'mg/mL' : 'mg'}</span>
                              {r.unita === 'cp' && f.dosaggi && <datalist id={`dos-${r.uid}`}>{f.dosaggi.map((d) => <option key={d} value={d} />)}</datalist>}
                            </>
                          )}
                        </>
                      )}
                      {!f.ui && (
                        <label className="flex items-center gap-1 ml-auto text-xs">
                          <input type="checkbox" checked={r.rp} onChange={(e) => cambia(r.uid, { rp: e.target.checked })} />rilascio prolungato
                        </label>
                      )}
                    </div>
                    {r.unita === 'mL' && <p className="text-[11px] text-tenue -mt-1">Gocce → mL: di solito 20 gtt/mL, ma alcuni contagocce differiscono (es. Rivotril 25 gtt/mL): verifica sul foglietto.</p>}
                    {tot.some((c) => c.mg !== null) && (
                      <p className="text-xs text-testo/80">
                        {tot.filter((c) => c.mg !== null).map((c) => `${c.f.nome} ${fmt(c.mg!)} mg${Number.isFinite(peso) && peso > 0 ? ` (${fmt(c.mg! / peso)} mg/kg)` : ''}`).join(' · ')}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={s.alcol} onChange={(e) => setS({ ...s, alcol: e.target.checked })} />Anche alcol
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold">Altro (non in archivio, droghe, prodotti)
            <input value={s.altri} onChange={(e) => setS({ ...s, altri: e.target.value })} className="rounded-xl border border-linea bg-carta px-3 py-2 font-normal" />
          </label>

          <div className="flex gap-2">
            <button onClick={copia} disabled={!s.righe.length} className="flex-1 rounded-full bg-verde text-white font-bold text-sm px-4 py-2 disabled:opacity-40">{copiato ? 'Copiato ✓' : 'Copia riepilogo per il CAV'}</button>
            <button onClick={() => { setS(vuoto); setQ('') }} className="rounded-full border border-linea text-sm font-bold px-4 py-2">Azzera</button>
          </div>
        </section>

        {tutti.length > 0 && (
          <>
            {/* ——— Sindromi attese */}
            {sindromi.length > 0 && (
              <section className="flex flex-wrap gap-2">
                {sindromi.map((id) => {
                  const sd = sindrome(id)
                  return sd ? (
                    <LinkR key={id} to={`/linee-guida/tossicologia?apri=${id}`} className="flex items-center gap-2 rounded-full bg-bordeaux3 text-bordeaux font-bold text-sm pl-1.5 pr-3 py-1 no-underline">
                      <IconaSindrome id={id as Icona} className="w-7 h-7" />{sd.nome}
                    </LinkR>
                  ) : null
                })}
              </section>
            )}

            {/* ——— Effetti attesi */}
            <section className="card">
              <p className="etichetta mb-2">Effetti attesi, per sistema</p>
              <ul className="flex flex-col gap-1.5">
                {effettiOrdinati.map(([e, chi]) => (
                  <li key={e} className="text-sm leading-snug flex gap-2">
                    <span className={`mt-0.5 shrink-0 rounded-full px-2 text-[11px] font-extrabold ${chi.length >= 2 ? 'bg-bordeaux text-white' : 'bg-sabbia text-tenue'}`}>{chi.length}</span>
                    <span><b>{EFFETTI[e].nome}</b>: {chi.join(', ')}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ——— Interazioni */}
            {(sommati.length > 0 || specifiche.length > 0) && (
              <section className="card border-bordeaux2 bg-bordeaux3/40">
                <p className="etichetta mb-2 !text-bordeaux">Interazioni</p>
                <ul className="flex flex-col gap-2.5">
                  {specifiche.map((i) => (
                    <li key={i.testo} className="text-sm leading-snug">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-bordeaux">{i.chi.join(' + ')}</span>{i.testo}
                    </li>
                  ))}
                  {sommati.map(([e, chi]) => (
                    <li key={e} className="text-sm leading-snug">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-bordeaux">{EFFETTI[e].nome} · {chi.join(' + ')}</span>{SOMMA[e]}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ——— Cosa fare subito */}
            <section className="card">
              <p className="etichetta mb-2">Da fare</p>
              <ul className="flex flex-col gap-1.5 text-sm leading-snug">
                <li><b>Sempre:</b> ECG, glicemia, EGA, elettroliti, creatinina, paracetamolemia ed etanolemia (co-ingestioni nascoste), test di gravidanza nelle donne in età fertile.</li>
                {sostanze.length > 0 && (
                  <li><b>Carbone attivo 50 g</b> se vigile o con vie aeree protette, di regola entro 1–2 h{oreDa !== null ? ` (ora: ${fmt(Math.round(oreDa * 10) / 10)} h)` : ''}.
                    {noCarbone.length > 0 && <> Non adsorbe: {noCarbone.join(', ')}.</>}
                    {ripetuto.length > 0 && <> Dosi ripetute utili per: {ripetuto.join(', ')}.</>}
                  </li>
                )}
                {rp.length > 0 && <li><b>Rilascio prolungato</b> ({rp.join(', ')}): sintomi tardivi, osservazione ≥ 24 h; valutare irrigazione intestinale col CAV.</li>}
                {dialisi.length > 0 && <li><b>Dialisi possibile:</b> {dialisi.join('; ')}. Avvisare presto il nefrologo se peggiora.</li>}
                <li><b>Intenzionale:</b> sorveglianza continua e valutazione psichiatrica a stabilizzazione.</li>
              </ul>
            </section>

            <section className="card">
              <p className="etichetta mb-2">Monitoraggio</p>
              <ul className="flex flex-col gap-1 text-sm leading-snug">
                {monitor.map((m) => <li key={m} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-verde shrink-0" />{m}</li>)}
              </ul>
            </section>

            {/* ——— Schede per farmaco */}
            <section className="flex flex-col gap-2">
              <p className="etichetta px-1">Farmaco per farmaco</p>
              {sostanze.map(({ f, mg, ui, rp: r }) => (
                <details key={f.id} className="card !p-0 overflow-hidden group">
                  <summary className="px-4 py-3 cursor-pointer list-none flex items-center gap-2">
                    <span className="flex-1 min-w-0">
                      <span className="font-extrabold text-bordeaux">{f.nome}</span>
                      {f.commerciali[0] && <span className="text-tenue text-sm"> ({f.commerciali.join(', ')})</span>}
                      <span className="block text-xs text-tenue">{f.classe}{mg !== null ? ` · ${fmt(mg)} mg` : ''}{ui ? ` · ${fmt(ui)} UI` : ''}{r ? ' · rilascio prolungato' : ''}</span>
                    </span>
                    <span className="text-tenue transition-transform group-open:rotate-90">›</span>
                  </summary>
                  <div className="px-4 pb-4 border-t border-linea flex flex-col gap-2.5 pt-3 text-sm leading-snug">
                    <div><p className="etichetta mb-1">Cosa aspettarsi</p><ul className="flex flex-col gap-1">{f.aspettarsi.map((a) => <li key={a} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bordeaux shrink-0" />{a}</li>)}</ul></div>
                    <p><b>Tempi:</b> {f.tempi}</p>
                    <div><p className="etichetta mb-1">Monitorare</p><ul className="flex flex-col gap-1">{f.monitorare.map((a) => <li key={a} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-oro shrink-0" />{a}</li>)}</ul></div>
                    <div><p className="etichetta mb-1">Terapia (70 kg)</p><ul className="flex flex-col gap-1">{f.terapia.map((a) => <li key={a} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-verde shrink-0" />{a}</li>)}</ul></div>
                    <p><b>Carbone:</b> {f.carbone === 'no' ? 'non utile' : f.carbone === 'ripetuto' ? 'sì, anche a dosi ripetute' : 'sì'}{f.notaCarbone ? ` – ${f.notaCarbone}` : ''}{f.dialisi ? ` · Dialisi: ${f.dialisi}` : ''}</p>
                    {f.pdta && <LinkR to={f.pdta.to} className="self-start text-xs font-semibold rounded-full px-3 py-1.5 bg-verde text-white no-underline">PDTA {f.pdta.etichetta} →</LinkR>}
                  </div>
                </details>
              ))}
            </section>
          </>
        )}

        <p className="text-[11px] text-tenue px-1 leading-snug">
          Elenco non esaustivo: le interazioni sono calcolate sugli effetti principali di ogni farmaco e non sostituiscono il parere del CAV. Fonti: Goldfrank’s Toxicologic Emergencies, 11ª ed.; Lavonas et al., Circulation 2023 (AHA); raccomandazioni EXTRIP. I dati inseriti restano solo in questa scheda del browser.
        </p>
      </div>
    </RitornoCtx.Provider>
  )
}
