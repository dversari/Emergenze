/*
 * Schema delle vie ottiche viste dall'alto, con le sedi di lesione (lato sinistro)
 * e il difetto del campo visivo corrispondente (campo dell'occhio sinistro a sinistra, destro a destra).
 */

type Difetto = 'tutto-sx' | 'bitemporale' | 'dx' | 'sup-dx' | 'inf-dx' | 'dx-macula'

const LESIONI: { n: number; sede: string; difetto: Difetto; nome: string; cause: string }[] = [
  { n: 1, sede: 'Retina o nervo ottico', difetto: 'tutto-sx', nome: 'Cecità monoculare (RAPD)', cause: 'Occlusione dell’arteria centrale, neurite ottica, neuropatia ischemica, arterite' },
  { n: 2, sede: 'Chiasma', difetto: 'bitemporale', nome: 'Emianopsia bitemporale', cause: 'Adenoma ipofisario, apoplessia ipofisaria, craniofaringioma' },
  { n: 3, sede: 'Tratto ottico', difetto: 'dx', nome: 'Emianopsia omonima controlaterale', cause: 'Ictus, tumore, trauma' },
  { n: 4, sede: 'Radiazioni temporali (ansa di Meyer)', difetto: 'sup-dx', nome: 'Quadrantopsia superiore omonima', cause: 'Ictus o lesione del lobo temporale' },
  { n: 5, sede: 'Radiazioni parietali', difetto: 'inf-dx', nome: 'Quadrantopsia inferiore omonima', cause: 'Ictus o lesione del lobo parietale' },
  { n: 6, sede: 'Corteccia occipitale', difetto: 'dx-macula', nome: 'Emianopsia omonima con risparmio maculare', cause: 'Ictus della cerebrale posteriore. Bilaterale: cecità corticale con pupille normali' },
]

function Campo({ cx, cy, r, tipo }: { cx: number; cy: number; r: number; tipo: 'tutto' | 'sx' | 'dx' | 'sup-dx' | 'inf-dx' | 'nessuno' }) {
  const nero = '#2b2522'
  let d = ''
  if (tipo === 'tutto') d = `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`
  if (tipo === 'dx') d = `M${cx},${cy - r} A${r},${r} 0 0 1 ${cx},${cy + r}Z`
  if (tipo === 'sx') d = `M${cx},${cy - r} A${r},${r} 0 0 0 ${cx},${cy + r}Z`
  if (tipo === 'sup-dx') d = `M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 0 1 ${cx + r},${cy}Z`
  if (tipo === 'inf-dx') d = `M${cx},${cy} L${cx + r},${cy} A${r},${r} 0 0 1 ${cx},${cy + r}Z`
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#8a8077" strokeWidth={1} />
      {d && <path d={d} fill={nero} />}
      <path d={`M${cx - r},${cy} H${cx + r} M${cx},${cy - r} V${cy + r}`} stroke="#c9c1b8" strokeWidth={0.5} />
    </g>
  )
}

function CampiDifetto({ difetto }: { difetto: Difetto }) {
  const sx = difetto === 'tutto-sx' ? 'tutto' : difetto === 'bitemporale' ? 'sx' : difetto === 'sup-dx' ? 'sup-dx' : difetto === 'inf-dx' ? 'inf-dx' : 'dx'
  const dx = difetto === 'tutto-sx' ? 'nessuno' : difetto === 'bitemporale' ? 'dx' : difetto === 'sup-dx' ? 'sup-dx' : difetto === 'inf-dx' ? 'inf-dx' : 'dx'
  return (
    <svg viewBox="0 0 64 28" className="w-20 h-9 shrink-0" aria-hidden="true">
      <Campo cx={14} cy={14} r={12} tipo={sx} />
      <Campo cx={50} cy={14} r={12} tipo={dx} />
      {difetto === 'dx-macula' && <><circle cx={14} cy={14} r={3.2} fill="#fff" /><circle cx={50} cy={14} r={3.2} fill="#fff" /></>}
    </svg>
  )
}

export default function VieOttiche() {
  const V = '#2f6b4f', B = '#7b3f4a'
  const marca = (n: number, x: number, y: number) => (
    <g key={n}>
      <circle cx={x} cy={y} r={7} fill="#c0392b" stroke="#fff" strokeWidth={1.2} />
      <text x={x} y={y + 3.3} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">{n}</text>
    </g>
  )
  return (
    <section className="card flex flex-col gap-3">
      <div>
        <p className="etichetta">Vie ottiche e difetti del campo</p>
        <p className="text-[12px] text-tenue leading-snug">Lesioni a sinistra. Nei cerchi il campo visivo come lo vede il paziente: occhio sinistro a sinistra, destro a destra; nero = non vede.</p>
      </div>
      <svg viewBox="0 0 240 274" className="w-full max-w-sm self-center h-auto" role="img" aria-label="Schema delle vie ottiche con 6 sedi di lesione">
        {/* occhi */}
        <circle cx={70} cy={30} r={19} fill="#fbfaf5" stroke="#3b3430" strokeWidth={1.2} />
        <circle cx={170} cy={30} r={19} fill="#fbfaf5" stroke="#3b3430" strokeWidth={1.2} />
        <circle cx={70} cy={13} r={6} fill="#5d7f9c" /><circle cx={170} cy={13} r={6} fill="#5d7f9c" />
        <text x={46} y={33} textAnchor="end" fontSize={8} fill="#6b625a">occhio sx</text>
        <text x={194} y={33} fontSize={8} fill="#6b625a">occhio dx</text>
        {/* fibre: occhio sinistro verde, destro bordeaux */}
        <path d="M58,44 L112,98 L84,140" fill="none" stroke={V} strokeWidth={2.4} />
        <path d="M80,46 L120,98 L156,140" fill="none" stroke={V} strokeWidth={2.4} strokeDasharray="5 2.5" />
        <path d="M182,44 L128,98 L156,140" fill="none" stroke={B} strokeWidth={2.4} />
        <path d="M160,46 L120,98 L84,140" fill="none" stroke={B} strokeWidth={2.4} strokeDasharray="5 2.5" />
        <text x={150} y={101} fontSize={7.5} fontWeight={700} fill="#3b3430">chiasma</text>
        {/* corpi genicolati */}
        <ellipse cx={84} cy={142} rx={8} ry={5} fill="#d9cfc2" stroke="#3b3430" strokeWidth={1} />
        <ellipse cx={156} cy={142} rx={8} ry={5} fill="#d9cfc2" stroke="#3b3430" strokeWidth={1} />
        {/* radiazioni */}
        {[[84, 'M84,147 C40,165 50,215 104,236'], [84, 'M84,147 C80,190 90,222 106,236'], [156, 'M156,147 C200,165 190,215 136,236'], [156, 'M156,147 C160,190 150,222 134,236']].map(([, d], i) => (
          <path key={i} d={d as string} fill="none" stroke="#8a8077" strokeWidth={1.8} />
        ))}
        {/* corteccia occipitale */}
        <path d="M70,240 Q120,262 170,240" fill="none" stroke="#3b3430" strokeWidth={5} strokeLinecap="round" opacity={0.25} />
        <path d="M120,236 V256" stroke="#fff" strokeWidth={3} />
        <text x={120} y={268} textAnchor="middle" fontSize={7.5} fill="#6b625a">corteccia occipitale</text>
        <text x={44} y={200} textAnchor="end" fontSize={7} fill="#6b625a">Meyer</text>
        {marca(1, 91, 70)}
        {marca(2, 120, 98)}
        {marca(3, 92, 124)}
        {marca(4, 52, 176)}
        {marca(5, 86, 192)}
        {marca(6, 96, 244)}
      </svg>
      <div className="flex gap-3 text-[11px] text-tenue justify-center">
        <span className="inline-flex items-center gap-1"><span className="w-4 h-0.5 bg-verde inline-block" />fibre occhio sx</span>
        <span className="inline-flex items-center gap-1"><span className="w-4 h-0.5 bg-bordeaux inline-block" />fibre occhio dx</span>
        <span>tratteggio = fibre nasali, incrociano</span>
      </div>
      <ul className="flex flex-col">
        {LESIONI.map((l) => (
          <li key={l.n} className="flex items-center gap-2.5 py-2 border-t border-linea">
            <span className="w-6 h-6 rounded-full bg-[#c0392b] text-white text-xs font-extrabold flex items-center justify-center shrink-0">{l.n}</span>
            <CampiDifetto difetto={l.difetto} />
            <div className="min-w-0">
              <p className="text-[13px] font-bold leading-tight">{l.nome}</p>
              <p className="text-[11px] text-tenue leading-snug">{l.sede} · {l.cause}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
