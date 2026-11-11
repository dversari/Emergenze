import { createContext, useContext, useState } from 'react'
import type { Nodo, Ramo, Tono } from '../lib/algoritmi'
import { Link } from 'react-router-dom'
import { Evidenzia } from './PaginaSchede'
import { apriManovra } from './Manovre'
import { manovra } from '../lib/manovre'
import { useConRitorno } from '../lib/ritorno'

/** Score citati nel testo → calcolatore corrispondente. */
const SCORE: [RegExp, string][] = [
  [/CHA₂DS₂-VA/, 'cha2ds2va'],
  [/HAS-BLED/, 'hasbled'],
  [/HEART( score)?/, 'heart'],
  [/Wells( EP)?/, 'wells-ep'],
  [/PERC/, 'perc'],
  [/sPESI/, 'spesi'],
  [/Cockcroft-Gault/, 'cockcroft'],
  [/GCS/, 'gcs'],
  [/CURB-65/, 'curb65'],
  [/Glasgow-Blatchford/, 'gbs'],
  [/BISAP/, 'bisap'],
  [/ICH score/, 'ich'],
  [/ADD-RS/, 'addrs'],
  [/TWIST/, 'twist'],
  [/ABCD²/, 'abcd2'],
  [/CIWA-Ar|CIWA/, 'ciwa'],
  [/4AT/, '4at'],
  [/Canadian Syncope Risk Score/, 'csrs'],
  [/regola di Ottawa per ESA|Ottawa/, 'ottawa-esa'],
]
const RE_SCORE = new RegExp(`(${SCORE.map(([r]) => r.source).join('|')})`, 'g')

/** Testo con score cliccabili (aprono il calcolatore) e farmaci evidenziati. */
function Testo({ t, scuro }: { t: string; scuro?: boolean }) {
  const ritorno = useConRitorno()
  const parti = t.split(RE_SCORE).filter((p) => p !== undefined)
  return (
    <>
      {parti.map((p, i) => {
        const hit = SCORE.find(([r]) => new RegExp(`^(${r.source})$`).test(p))
        if (hit) {
          return (
            <Link key={i} to={`/calcolatori?apri=${hit[1]}`} state={ritorno.state} onClick={ritorno.onClick}
              className={`inline-block font-bold rounded-full px-1.5 leading-[1.35] underline-offset-2 ${scuro ? 'bg-white/20 text-white' : 'bg-verde text-white'}`}>
              {p}&nbsp;↗
            </Link>
          )
        }
        return scuro ? <span key={i}>{p}</span> : <Evidenzia key={i} t={p} />
      })}
    </>
  )
}

const STILE: Record<Tono, string> = {
  avvio: 'bg-verde-scuro text-white border-verde-scuro',
  passo: 'bg-carta border-linea-forte',
  decisione: 'bg-oro3 border-oro2 text-center',
  allarme: 'bg-bordeaux3 border-bordeaux2',
  terapia: 'bg-verde3 border-verde2',
  esito: 'bg-verde text-white border-verde',
  nota: 'bg-sabbia border-linea border-dashed',
  checklist: 'bg-carta border-verde2',
}
const ICONA: Partial<Record<Tono, string>> = { decisione: '◆', allarme: '!', terapia: '℞', esito: '✓', checklist: '☑' }

/** Apre la sezione (details) del riassunto con quel titolo e ci scorre sopra. */
export const idSezione = (t: string) => 'sez-' + t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')
function apriSezione(titolo: string) {
  const el = document.getElementById(idSezione(titolo)) as HTMLDetailsElement | null
  if (!el) return
  el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Freccia verticale tra due blocchi. */
function Freccia({ corta }: { corta?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${corta ? 'h-4' : 'h-6'}`} aria-hidden>
      <div className="w-0.5 flex-1 bg-linea-forte" />
      <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-linea-forte" />
    </div>
  )
}

function Blocco({ n, piccolo }: { n: Extract<Nodo, { titolo: string }>; piccolo?: boolean }) {
  const dosi = useContext(SezioneDosi)
  const testo = [n.titolo, ...(n.righe ?? [])].join(' ')
  const vedi = n.vedi ?? (dosi && ['terapia', 'allarme', 'checklist', 'passo'].includes(n.tipo) && RE_DOSE.test(testo) ? sezionePerNodo(testo, dosi) : undefined)
  const scuro = n.tipo === 'avvio' || n.tipo === 'esito'
  return (
    <div className={`rounded-2xl border-[1.5px] ${piccolo ? 'px-2.5 py-2' : 'px-3.5 py-3'} ${STILE[n.tipo]}`}>
      {n.tempo && (
        <span className={`inline-block mb-1.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full px-2 py-0.5 ${scuro ? 'bg-white/20 text-white' : 'bg-bordeaux text-white'}`}>
          ⏱ {n.tempo}
        </span>
      )}
      <div className={`flex items-start gap-2 ${n.tipo === 'decisione' ? 'justify-center' : ''}`}>
        {ICONA[n.tipo] && (
          <span className={`shrink-0 font-black ${n.tipo === 'allarme' ? 'w-5 h-5 rounded-full bg-bordeaux text-white text-xs flex items-center justify-center mt-px' : n.tipo === 'decisione' ? 'text-oro' : ''}`}>
            {ICONA[n.tipo]}
          </span>
        )}
        <p className={`font-extrabold leading-tight ${piccolo ? 'text-[13px]' : 'text-[15px]'} ${n.tipo === 'allarme' ? 'text-bordeaux' : ''}`}><Testo t={n.titolo} scuro={scuro} /></p>
      </div>
      {n.righe && n.tipo === 'checklist' && <Spunte righe={n.righe} piccolo={piccolo} />}
      {n.righe && n.tipo !== 'checklist' && (
        <ul className={`mt-1.5 flex flex-col gap-1 ${piccolo ? 'text-[12px]' : 'text-[13px]'} leading-snug ${scuro ? 'text-white/90' : ''}`}>
          {n.righe.map((r, i) => (
            <li key={i} className="flex gap-1.5">
              <span className={`mt-[7px] w-1 h-1 rounded-full shrink-0 ${scuro ? 'bg-white/70' : 'bg-tenue'}`} />
              <span><Testo t={r} scuro={scuro} /></span>
            </li>
          ))}
        </ul>
      )}
      {n.vai && <Vai voci={n.vai} scuro={scuro} />}
      {n.manovre && (
        <div className="flex flex-wrap gap-1 mt-2">
          {n.manovre.map((id) => (
            <button key={id} onClick={() => apriManovra(id)}
              className="text-[11px] font-bold rounded-full px-2 py-1 bg-oro text-white">
              ▶ {manovra(id)?.nome.replace(/ \(.*\)$/, '') ?? id}
            </button>
          ))}
        </div>
      )}
      {vedi && (
        <button onClick={() => apriSezione(vedi)}
          className={`mt-2 text-[11.5px] font-bold rounded-full px-2.5 py-1 ${scuro ? 'bg-white/20 text-white' : 'bg-verde text-white'}`}>
          ↓ sezione «{vedi}»
        </button>
      )}
    </div>
  )
}

function Spunte({ righe, piccolo }: { righe: string[]; piccolo?: boolean }) {
  const [fatte, setFatte] = useState<number[]>([])
  return (
    <ul className={`mt-1.5 flex flex-col gap-1 ${piccolo ? 'text-[12px]' : 'text-[13px]'} leading-snug`}>
      {righe.map((r, i) => {
        const ok = fatte.includes(i)
        return (
          <li key={i}>
            <label className="flex gap-2 items-start">
              <input type="checkbox" checked={ok} onChange={() => setFatte((f) => (ok ? f.filter((x) => x !== i) : [...f, i]))} className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[#2f6b4f]" />
              <span className={ok ? 'line-through text-tenue' : ''}><Testo t={r} /></span>
            </label>
          </li>
        )
      })}
      {fatte.length > 0 && <li className="text-[10.5px] text-tenue">{fatte.length}/{righe.length} fatte</li>}
    </ul>
  )
}

function Vai({ voci, scuro }: { voci: { etichetta: string; to: string }[]; scuro?: boolean }) {
  const r = useConRitorno()
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {voci.map((v) => (
        <Link key={v.to} to={v.to} state={r.state} onClick={r.onClick}
          className={`text-[11px] font-bold rounded-full px-2 py-1 ${scuro ? 'bg-white/20 text-white' : 'bg-verde-scuro text-white'}`}>
          {v.etichetta} →
        </Link>
      ))}
    </div>
  )
}

const CHIP = { si: 'bg-verde text-white', no: 'bg-bordeaux text-white', neutro: 'bg-oro text-white' }

function Rami({ rami }: { rami: Ramo[] }) {
  const affiancati = rami.length === 2
  return (
    <div className={affiancati ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
      {rami.map((r) => (
        <div key={r.etichetta} className={affiancati ? 'flex flex-col' : 'rounded-2xl border border-linea bg-fondo p-2'}>
          <div className={`flex ${affiancati ? 'justify-center' : ''}`}>
            <span className={`text-[11px] font-extrabold uppercase tracking-wide rounded-full px-3 py-1 ${CHIP[r.tono ?? 'neutro']}`}>{r.etichetta}</span>
          </div>
          <Freccia corta />
          <Sequenza nodi={r.nodi} piccolo />
          {r.fine && (
            <div className="flex flex-col items-center mt-1">
              <div className="w-0.5 h-3 bg-linea-forte" />
              <span className="text-[10.5px] font-bold text-tenue border border-linea-forte rounded-md px-2 py-0.5 bg-carta">■ fine: {r.fine}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Sequenza({ nodi, piccolo }: { nodi: Nodo[]; piccolo?: boolean }) {
  return (
    <div className="flex flex-col">
      {nodi.map((n, i) => (
        <div key={i}>
          {i > 0 && <Freccia corta={piccolo} />}
          {n.tipo === 'rami' ? <Rami rami={n.rami} /> : <Blocco n={n} piccolo={piccolo} />}
        </div>
      ))}
    </div>
  )
}

/** Diagramma a blocchi verticale con diramazioni. */
/** Sezione con le dosi del PDTA: usata come «↓ sezione» automatico nei nodi di terapia senza `vedi`. */
const SezioneDosi = createContext<{ titolo: string; punti: string[] }[] | undefined>(undefined)
const RE_DOSE = /\d[\d.,]*\s*(mg|UI|µg|g\b|mL|mEq)/
const parole = (t: string) => new Set(t.toLowerCase().match(/[a-zàèéìòù-]{7,}/g) ?? [])
/** Sezione del riassunto che condivide più parole lunghe (farmaci, procedure) con il nodo. */
function sezionePerNodo(testo: string, sezioni: { titolo: string; punti: string[] }[]) {
  const p = parole(testo)
  let migliore: string | undefined; let max = 1
  for (const s of sezioni) {
    const q = parole(s.titolo + ' ' + s.punti.join(' '))
    let n = 0; p.forEach((w) => { if (q.has(w)) n++ })
    if (n > max) { max = n; migliore = s.titolo }
  }
  return migliore
}

export default function Algoritmo({ titolo, nota, nodi, sezioni }: { titolo: string; nota?: string; nodi: Nodo[]; sezioni?: { titolo: string; punti: string[] }[] }) {
  return (
    <SezioneDosi.Provider value={sezioni}>
    <section className="card">
      <p className="etichetta">Algoritmo</p>
      <h3 className="font-extrabold text-lg leading-tight mt-0.5">{titolo}</h3>
      {nota && <p className="text-[12px] text-tenue leading-snug mt-1 mb-3">{nota}</p>}
      <Sequenza nodi={nodi} />
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 text-[10.5px] text-tenue">
        <span><span className="text-oro font-black">◆</span> decisione</span>
        <span><span className="text-bordeaux font-black">!</span> priorità/allarme</span>
        <span><span className="font-black text-verde">℞</span> terapia</span>
        <span><span className="font-black text-verde">✓</span> esito</span>
      </div>
    </section>
    </SezioneDosi.Provider>
  )
}
