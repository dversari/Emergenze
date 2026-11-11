import type { Nodo, Ramo, Tono } from '../lib/algoritmi'
import { Evidenzia } from './PaginaSchede'

const STILE: Record<Tono, string> = {
  avvio: 'bg-verde-scuro text-white border-verde-scuro',
  passo: 'bg-carta border-linea-forte',
  decisione: 'bg-oro3 border-oro2 text-center',
  allarme: 'bg-bordeaux3 border-bordeaux2',
  terapia: 'bg-verde3 border-verde2',
  esito: 'bg-verde text-white border-verde',
  nota: 'bg-sabbia border-linea border-dashed',
}
const ICONA: Partial<Record<Tono, string>> = { decisione: '◆', allarme: '!', terapia: '℞', esito: '✓' }

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
        <p className={`font-extrabold leading-tight ${piccolo ? 'text-[13px]' : 'text-[15px]'} ${n.tipo === 'allarme' ? 'text-bordeaux' : ''}`}>{n.titolo}</p>
      </div>
      {n.righe && (
        <ul className={`mt-1.5 flex flex-col gap-1 ${piccolo ? 'text-[12px]' : 'text-[13px]'} leading-snug ${scuro ? 'text-white/90' : ''}`}>
          {n.righe.map((r, i) => (
            <li key={i} className="flex gap-1.5">
              <span className={`mt-[7px] w-1 h-1 rounded-full shrink-0 ${scuro ? 'bg-white/70' : 'bg-tenue'}`} />
              <span>{scuro ? r : <Evidenzia t={r} />}</span>
            </li>
          ))}
        </ul>
      )}
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
export default function Algoritmo({ titolo, nota, nodi }: { titolo: string; nota?: string; nodi: Nodo[] }) {
  return (
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
  )
}
