import { useState } from 'react'
import Monogramma from '../components/Monogramma'
import Segnala from '../components/Segnala'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

/* Disegnini a tratto, nei colori dell'app. */
const T = { fill: 'none', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function Giglio() {
  // Il «lirio»: un giglio il cui stelo è una traccia ECG.
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden>
      <path d="M8 118 H62 l8 -10 l7 22 l10 -66 l9 76 l7 -22 h10" {...T} strokeWidth={3} className="stroke-bordeaux" />
      <path d="M113 118 C118 104 120 92 121 78" {...T} strokeWidth={3} className="stroke-verde" />
      <path d="M113 118 H212" {...T} strokeWidth={3} className="stroke-bordeaux" strokeDasharray="1 7" />
      <path d="M121 100 C132 96 140 98 146 104 C138 108 128 108 121 100 Z" className="fill-verde3 stroke-verde" strokeWidth={2} />
      {/* petali */}
      <path d="M121 78 C104 70 92 52 96 26 C110 36 121 54 121 78 Z" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} />
      <path d="M121 78 C138 70 150 52 146 26 C132 36 121 54 121 78 Z" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} />
      <path d="M121 78 C112 58 112 34 121 14 C130 34 130 58 121 78 Z" className="fill-oro3 stroke-verde-scuro" strokeWidth={2.4} />
      <path d="M121 76 L114 44 M121 76 L121 38 M121 76 L128 44" {...T} strokeWidth={1.6} className="stroke-oro" />
      <circle cx="114" cy="42" r="2.6" className="fill-oro" /><circle cx="121" cy="36" r="2.6" className="fill-oro" /><circle cx="128" cy="42" r="2.6" className="fill-oro" />
      {/* croce */}
      <g transform="translate(176 22)">
        <rect x="-15" y="-15" width="30" height="30" rx="8" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={2} />
        <path d="M0 -8 V8 M-8 0 H8" {...T} strokeWidth={4} className="stroke-bordeaux" />
      </g>
      <path d="M28 40 q6 -8 12 0 q6 8 12 0" {...T} strokeWidth={2} className="stroke-oro2" />
      <path d="M186 70 q5 -6 10 0 q5 6 10 0" {...T} strokeWidth={2} className="stroke-oro2" />
    </svg>
  )
}

const DISEGNI: Record<string, ReactNode> = {
  calcolatori: (
    <>
      <rect x="14" y="8" width="36" height="48" rx="7" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} />
      <rect x="20" y="14" width="24" height="10" rx="2.5" className="fill-verde3 stroke-verde" strokeWidth={1.8} />
      <path d="M24 19 h4 l2 -3 l3 6 l2 -3 h5" {...T} strokeWidth={1.6} className="stroke-bordeaux" />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={23 + c * 9} cy={33 + r * 8} r="2.6" className={r === 2 && c === 2 ? 'fill-bordeaux' : 'fill-oro2'} />))}
    </>
  ),
  antibiotici: (
    <>
      <g transform="rotate(-35 32 32)">
        <path d="M14 32 a10 10 0 0 1 10 -10 h8 v20 h-8 a10 10 0 0 1 -10 -10 Z" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={2.4} />
        <path d="M32 22 h8 a10 10 0 0 1 0 20 h-8 Z" className="fill-verde3 stroke-verde" strokeWidth={2.4} />
      </g>
      <circle cx="50" cy="48" r="6" className="fill-oro3 stroke-oro" strokeWidth={2} />
      <path d="M50 40 v-3 M57 46 h3 M44 54 l-2 2 M56 54 l2 2" {...T} strokeWidth={1.8} className="stroke-oro" />
    </>
  ),
  procedure: (
    <>
      <g transform="rotate(-40 32 32)">
        <rect x="14" y="26" width="28" height="12" rx="2.5" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} />
        <path d="M42 32 h14 M8 32 h6 M8 27 v10" {...T} className="stroke-verde-scuro" />
        <rect x="16" y="28" width="14" height="8" rx="1.5" className="fill-bordeaux3" />
        <path d="M22 26 v4 M28 26 v4 M34 26 v4" {...T} strokeWidth={1.6} className="stroke-verde" />
      </g>
      <path d="M46 50 q3 5 0 8 q-3 -3 0 -8 Z" className="fill-bordeaux stroke-bordeaux" strokeWidth={1.2} />
    </>
  ),
  sedazione: (
    <>
      <path d="M38 10 a20 20 0 1 0 16 30 a16 16 0 1 1 -16 -30 Z" className="fill-oro3 stroke-oro" strokeWidth={2.4} />
      <path d="M44 14 h7 l-7 8 h7 M50 26 h5 l-5 6 h5" {...T} strokeWidth={1.8} className="stroke-verde" />
      <rect x="36" y="40" width="12" height="18" rx="3" className="fill-carta stroke-verde-scuro" strokeWidth={2.2} />
      <path d="M36 46 h12" {...T} strokeWidth={1.6} className="stroke-verde-scuro" />
      <rect x="39" y="49" width="6" height="6" rx="1" className="fill-verde3" />
    </>
  ),
  'linee-guida': (
    <>
      <path d="M32 16 C24 11 14 11 8 14 V52 C14 49 24 49 32 54 C40 49 50 49 56 52 V14 C50 11 40 11 32 16 Z" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} />
      <path d="M32 16 V54" {...T} strokeWidth={2} className="stroke-verde-scuro" />
      <path d="M12 32 h5 l2 -5 l3 11 l3 -14 l3 8 h4" {...T} strokeWidth={1.8} className="stroke-bordeaux" />
      <path d="M38 24 h12 M38 31 h12 M38 38 h9" {...T} strokeWidth={1.8} className="stroke-oro2" />
    </>
  ),
  anamnesi: (
    <>
      <path d="M16 8 v16 a12 12 0 0 0 24 0 V8" {...T} className="stroke-verde-scuro" />
      <path d="M28 36 v8 a10 10 0 0 0 20 0 v-6" {...T} className="stroke-verde-scuro" />
      <circle cx="48" cy="33" r="6" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={2.4} />
      <circle cx="16" cy="8" r="2.5" className="fill-oro" /><circle cx="40" cy="8" r="2.5" className="fill-oro" />
    </>
  ),
  dimissioni: (
    <>
      <path d="M10 30 L32 12 L54 30" {...T} className="stroke-verde-scuro" />
      <path d="M16 26 V54 H48 V26" className="fill-carta stroke-verde-scuro" strokeWidth={2.4} strokeLinejoin="round" />
      <rect x="27" y="38" width="10" height="16" rx="2" className="fill-oro3 stroke-oro" strokeWidth={2} />
      <path d="M32 22 c-3 -4 -9 -1 -6 4 l6 5 l6 -5 c3 -5 -3 -8 -6 -4 Z" className="fill-bordeaux stroke-bordeaux" strokeWidth={1} />
    </>
  ),
  rubrica: (
    <>
      <path d="M18 12 c-6 2 -8 8 -6 14 c5 14 14 23 28 28 c6 2 12 0 14 -6 l-9 -8 l-6 4 c-7 -3 -12 -8 -15 -15 l4 -6 Z" className="fill-verde3 stroke-verde-scuro" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M40 10 a14 14 0 0 1 14 14 M40 17 a7 7 0 0 1 7 7" {...T} strokeWidth={2} className="stroke-bordeaux" />
    </>
  ),
}

const PAGINE = [
  { id: 'rubrica', to: '/rubrica', nome: 'Rubrica', testo: 'Numeri interni ed esterni' },
  { id: 'linee-guida', to: '/linee-guida', nome: 'PDTA', testo: 'Percorsi, linee guida, algoritmi' },
  { id: 'calcolatori', to: '/calcolatori', nome: 'Calcolatori', testo: 'Score, clearance, elettroliti' },
  { id: 'antibiotici', to: '/antibiotici', nome: 'Antibiotici', testo: 'Empirica toscana, fiale, rene' },
  { id: 'procedure', to: '/procedure', nome: 'Procedure', testo: 'Passaggi e schemi disegnati' },
  { id: 'sedazione', to: '/sedazione', nome: 'Sedazione', testo: 'Schemi per 70 kg' },
  { id: 'anamnesi', to: '/anamnesi', nome: 'Cartella', testo: 'Anamnesi ed EO per sintomo' },
  { id: 'dimissioni', to: '/dimissioni', nome: 'Dimissione', testo: 'Testi pronti da adattare' },
]

const AVVERTENZE = [
  'Non è approvata da nessuno: né dall’ASL, né dalla Regione, né dal Ministero, né dal primario (che forse non sa nemmeno che esiste). È un quaderno di appunti con l’ambizione di un’app.',
  'Chi la usa lo fa sotto la propria responsabilità. Le dosi sono per un adulto di 70 kg che, statisticamente, non è il paziente che hai davanti.',
  'Non sostituisce lo studio: le linee guida originali, i protocolli aziendali e la scheda tecnica vanno letti da sé. Questa serve a ricordare, non a imparare.',
  'Se qualcosa non torna, hanno ragione la scheda tecnica e il buon senso (e quasi sempre il collega più anziano).',
]

function Avvertenze({ compatte }: { compatte?: boolean }) {
  return (
    <ul className={`flex flex-col ${compatte ? 'gap-1.5 text-[12.5px]' : 'gap-2 text-[13.5px]'} leading-snug`}>
      {AVVERTENZE.map((a) => (
        <li key={a} className="flex gap-2"><span className="text-bordeaux font-black">!</span><span>{a}</span></li>
      ))}
    </ul>
  )
}

const IN_DIVENIRE = 'DEA-LIRIO è un cantiere aperto: cresce turno dopo turno. Errori, dosi da correggere, protocolli di Prato che mancano, idee: segnalali, ogni contributo viene letto e finisce nella versione successiva.'

/** Schermata iniziale. */
export default function Home() {
  const [avvisi, setAvvisi] = useState(false)
  return (
    <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start lg:max-w-6xl lg:mx-auto">
      <div className="flex flex-col gap-2.5 lg:gap-4">
        <section className="card !p-0 overflow-hidden">
          <div className="bg-sabbia px-4 pt-2 flex justify-center">
            <div className="aspect-[22/15] h-[clamp(48px,13svh,180px)] lg:h-[230px]"><Giglio /></div>
          </div>
          <div className="px-4 pt-2 pb-3 lg:px-6 lg:pb-5 flex items-end gap-3">
            <div className="flex-1">
              <h2 className="font-black text-[28px] lg:text-[40px] leading-none tracking-tight text-verde-scuro">
                DEA<span className="text-bordeaux">-</span>LIRIO
              </h2>
              <p className="mt-1 text-[13.5px] lg:text-[16px] leading-snug">
                Algoritmi, calcolatori e numeri utili per sopravvivere al Pronto Soccorso di Prato.
              </p>
            </div>
            <Monogramma size={46} className="shrink-0 hidden lg:block" />
          </div>
        </section>

        <section className="hidden lg:block card">
          <p className="etichetta mb-2 !text-bordeaux">Avvertenze semiserie (ma serie)</p>
          <Avvertenze />
        </section>
      </div>

      <div className="flex flex-col gap-2.5 lg:gap-4">
        <section className="grid grid-cols-2 gap-2 lg:gap-3">
          {PAGINE.map((p) => (
            <Link key={p.id} to={p.to} className="card !p-2 lg:!p-3 !rounded-2xl flex items-center gap-2 lg:gap-3 active:bg-sabbia lg:hover:border-verde2">
              <svg viewBox="0 0 64 64" className="w-10 h-10 lg:w-12 lg:h-12 shrink-0" aria-hidden>{DISEGNI[p.id]}</svg>
              <div className="min-w-0">
                <p className="font-extrabold text-[14px] lg:text-[16px] leading-tight">{p.nome}</p>
                <p className="text-[10.5px] lg:text-[12px] text-tenue leading-tight">{p.testo}</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="hidden lg:flex card flex-col gap-3">
          <p className="etichetta !text-verde">Lavori in corso</p>
          <p className="text-[13.5px] leading-snug">{IN_DIVENIRE}</p>
          <div className="flex items-center gap-3">
            <Segnala />
            <span className="ml-auto flex items-center gap-2 text-[11.5px] text-tenue">a cura di <Monogramma size={34} /></span>
          </div>
        </section>

        {/* telefono: tutto in una schermata, avvertenze e segnalazioni in una riga */}
        <div className="lg:hidden flex items-center gap-2 px-1">
          <Monogramma size={30} />
          <button onClick={() => setAvvisi(true)} className="text-[12px] font-bold text-bordeaux underline underline-offset-2">Avvertenze</button>
          <span className="text-tenue text-[12px]">·</span>
          <Segnala etichetta="Segnala errori e idee" className="text-[12px] font-bold text-verde underline underline-offset-2" />
        </div>
      </div>

      {avvisi && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setAvvisi(false)}>
          <div className="bg-carta w-full max-w-lg rounded-t-[22px] p-4 pb-[calc(16px+env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-2"><Monogramma size={34} /><p className="font-black text-lg">Avvertenze semiserie (ma serie)</p></div>
            <Avvertenze compatte />
            <p className="etichetta mt-3 mb-1 !text-verde">Lavori in corso</p>
            <p className="text-[12.5px] leading-snug">{IN_DIVENIRE}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setAvvisi(false)} className="flex-1 rounded-full border border-linea-forte py-2.5 font-bold text-tenue">Ho capito</button>
              <Segnala etichetta="Segnala" className="flex-1 rounded-full bg-verde text-white py-2.5 font-extrabold" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
