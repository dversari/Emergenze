import { MANOVRE, type Manovra, type Passo, type Posa } from '../lib/manovre'

export const idManovra = (id: string) => `man-${id}`

/** Apre la scheda della manovra e ci scorre sopra. */
export function apriManovra(id: string) {
  const el = document.getElementById(idManovra(id)) as HTMLDetailsElement | null
  if (!el) return
  el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const S = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const sdraiato = (p: Posa) => p !== 'seduto' && p !== 'seduto-flesso'

/** Corpo in vista laterale sul lettino. */
function Corpo({ posa }: { posa: Posa }) {
  const lettino = (x1: number, x2: number) => (
    <>
      <rect x={x1} y={80} width={x2 - x1} height={7} rx={2} className="fill-oro3 stroke-oro" strokeWidth={1.5} />
      <path d={`M${x1 + 6} 87 v14 M${x2 - 6} 87 v14`} {...S} strokeWidth={2} className="stroke-oro" />
    </>
  )
  const tratto = { ...S, strokeWidth: 7, className: 'stroke-verde-scuro' }
  switch (posa) {
    case 'seduto':
    case 'seduto-flesso': {
      const flesso = posa === 'seduto-flesso'
      return (
        <g>
          {lettino(10, 92)}
          <path d="M52 78 L52 42 M52 78 L84 78 L86 104" {...tratto} />
          <path d="M52 50 L70 64" {...S} strokeWidth={5} className="stroke-verde-scuro" />
          <circle cx={flesso ? 58 : 52} cy={flesso ? 32 : 28} r={10} className="fill-carta stroke-verde-scuro" strokeWidth={3} />
        </g>
      )
    }
    case 'supino':
      return (
        <g>
          {lettino(14, 146)}
          <path d="M40 74 L120 74 L140 74" {...tratto} />
          <rect x={16} y={70} width={16} height={8} rx={3} className="fill-sabbia stroke-linea-forte" strokeWidth={1} />
          <circle cx={28} cy={64} r={10} className="fill-carta stroke-verde-scuro" strokeWidth={3} />
        </g>
      )
    case 'supino-iperesteso':
      return (
        <g>
          {lettino(36, 150)}
          <path d="M46 74 L126 74 L146 74 M46 74 L34 82" {...tratto} />
          <circle cx={24} cy={88} r={10} className="fill-carta stroke-verde-scuro" strokeWidth={3} />
          <path d="M14 70 a22 22 0 0 0 4 24" {...S} strokeWidth={1.6} strokeDasharray="3 3" className="stroke-bordeaux" />
          <text x={2} y={66} className="fill-bordeaux text-[8px] font-bold">20°</text>
        </g>
      )
    case 'fianco-dx':
    case 'fianco-sx':
      return (
        <g>
          {lettino(14, 146)}
          <path d="M40 72 L104 72 L120 58 L140 70" {...tratto} />
          <circle cx={28} cy={66} r={10} className="fill-carta stroke-verde-scuro" strokeWidth={3} />
          <text x={14} y={30} className="fill-verde text-[10px] font-extrabold">{posa === 'fianco-dx' ? 'sul fianco DESTRO' : 'sul fianco SINISTRO'}</text>
        </g>
      )
    case 'prono':
      return (
        <g>
          {lettino(14, 146)}
          <path d="M40 74 L140 74 M44 74 L40 60" {...tratto} />
          <circle cx={30} cy={56} r={10} className="fill-carta stroke-verde-scuro" strokeWidth={3} />
          <text x={14} y={30} className="fill-verde text-[10px] font-extrabold">PRONO</text>
        </g>
      )
  }
}

/** Testa vista dall'alto (seduto) o dai piedi del lettino (sdraiato), orecchie D/S. */
function Testa({ posa, naso }: { posa: Posa; naso: number }) {
  const giu = sdraiato(posa)
  const angD = giu ? naso - 90 : naso + 90
  const pt = (ang: number, r: number) => {
    const a = ((ang - 90) * Math.PI) / 180
    return [Math.cos(a) * r, Math.sin(a) * r]
  }
  const [dx, dy] = pt(angD, 21)
  const [sx, sy] = pt(angD + 180, 21)
  return (
    <g transform="translate(206 52)">
      <circle r={30} className="fill-sabbia" />
      {giu && <path d="M-30 34 H30" {...S} strokeWidth={3} className="stroke-oro" />}
      {giu && <text x={0} y={44} textAnchor="middle" className="fill-oro text-[7px] font-bold">pavimento</text>}
      {!giu && <text x={0} y={44} textAnchor="middle" className="fill-tenue text-[7px] font-bold">vista dall’alto</text>}
      <g transform={`rotate(${naso})`}>
        <path d="M-6 -17 L0 -26 L6 -17 Z" className="fill-bordeaux" />
        <circle r={18} className="fill-carta stroke-verde-scuro" strokeWidth={2.5} />
        <circle cx={-6} cy={-9} r={2} className="fill-verde-scuro" />
        <circle cx={6} cy={-9} r={2} className="fill-verde-scuro" />
      </g>
      <circle cx={dx} cy={dy} r={6} className="fill-verde stroke-verde-scuro" strokeWidth={1} />
      <text x={dx} y={dy + 2.6} textAnchor="middle" className="fill-white text-[7.5px] font-black">D</text>
      <circle cx={sx} cy={sy} r={6} className="fill-oro2 stroke-oro" strokeWidth={1} />
      <text x={sx} y={sy + 2.6} textAnchor="middle" className="fill-white text-[7.5px] font-black">S</text>
    </g>
  )
}

function Vignetta({ p, n }: { p: Passo; n: number }) {
  return (
    <figure className="shrink-0 w-[250px] rounded-2xl border border-linea bg-carta p-2 snap-start">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-5 h-5 rounded-full bg-verde text-white text-[11px] font-black flex items-center justify-center">{n}</span>
        {p.rapido && <span className="text-[10px] font-extrabold uppercase text-white bg-bordeaux rounded-full px-1.5 py-0.5">rapido</span>}
        {p.tempo && <span className="ml-auto text-[10px] font-extrabold text-bordeaux">⏱ {p.tempo}</span>}
      </div>
      <svg viewBox="0 0 240 108" className="w-full h-auto" aria-hidden>
        <Corpo posa={p.posa} />
        <Testa posa={p.posa} naso={p.naso} />
      </svg>
      <figcaption className="text-[12.5px] leading-snug mt-1">{p.testo}</figcaption>
    </figure>
  )
}

function SchedaManovra({ m }: { m: Manovra }) {
  return (
    <details id={idManovra(m.id)} className="rounded-2xl border border-linea bg-fondo overflow-hidden group scroll-mt-24">
      <summary className="px-3 py-2.5 cursor-pointer list-none flex items-center gap-2">
        <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 text-white ${m.tipo === 'diagnostica' ? 'bg-oro' : 'bg-verde'}`}>
          {m.tipo === 'diagnostica' ? 'diagnosi' : 'terapia'}
        </span>
        <span className="font-bold text-[14.5px] leading-tight flex-1">{m.nome}</span>
        <span className="text-tenue transition-transform group-open:rotate-90">›</span>
      </summary>
      <div className="px-3 pb-3">
        <p className="text-[12px] text-tenue mb-2">{m.indicazione}</p>
        <div className="flex gap-2 overflow-x-auto snap-x pb-1 -mx-1 px-1">
          {m.passi.map((p, i) => <Vignetta key={i} p={p} n={i + 1} />)}
        </div>
        {m.passi.length > 1 && <p className="text-[10.5px] text-tenue mt-1">Scorri i passi verso sinistra →</p>}
        {m.esito && <p className="text-[12.5px] leading-snug mt-2 rounded-xl bg-verde3 px-3 py-2">{m.esito}</p>}
      </div>
    </details>
  )
}

/** Manovre illustrate per la vertigine. */
export default function Manovre({ ids }: { ids: string[] }) {
  const voci = ids.map((id) => MANOVRE.find((m) => m.id === id)).filter((m): m is Manovra => !!m)
  return (
    <section className="card">
      <p className="etichetta">Manovre illustrate</p>
      <p className="text-[12px] text-tenue leading-snug mt-0.5 mb-2.5">
        Lato destro (il sinistro è speculare). Il cerchio a destra mostra la testa: vista dall’alto da seduto, dai piedi del lettino da sdraiato; D e S sono le orecchie, la punta rossa è il naso.
      </p>
      <div className="flex flex-col gap-2">
        {voci.map((m) => <SchedaManovra key={m.id} m={m} />)}
      </div>
    </section>
  )
}
