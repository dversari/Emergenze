/** Monogramma «DV» di Daniele Versari, tratto a mano: D corsiva verde con occhiello, V bordeaux con ricciolo, svolazzo sotto. */
export default function Monogramma({ size = 40, className = '' }: { size?: number; className?: string }) {
  const tratto = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Monogramma DV">
      <circle cx="50" cy="50" r="47" className="fill-carta stroke-bordeaux" strokeWidth={3} />
      {/* D: asta inclinata, pancia ampia, occhiello in basso */}
      <path d="M38 24 C35 38 32 54 29 70" {...tratto} className="stroke-verde-scuro" strokeWidth={7} />
      <path d="M20 31 C34 20 60 20 64 40 C68 60 48 74 30 71 C22 70 18 64 24 61 C29 58 33 64 29 70" {...tratto} className="stroke-verde-scuro" strokeWidth={4.5} />
      {/* V: attacco a ricciolo, punta bassa, risalita con svolazzo */}
      <path d="M52 37 C52 30 60 29 61 36 C62 46 63 58 64 70 C70 56 77 42 84 32 C87 27 82 24 79 29" {...tratto} className="stroke-bordeaux" strokeWidth={5} />
      {/* svolazzo sotto */}
      <path d="M22 81 C38 75 58 86 80 77" {...tratto} className="stroke-oro" strokeWidth={2.5} />
    </svg>
  )
}
