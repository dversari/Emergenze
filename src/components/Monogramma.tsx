/** Monogramma «D» di Daniele: D maiuscola con un piccolo giglio che nasce dall'asta. */
export default function Monogramma({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Monogramma D">
      <circle cx="50" cy="50" r="46" className="fill-carta stroke-bordeaux" strokeWidth={3} />
      <circle cx="50" cy="50" r="40" fill="none" className="stroke-bordeaux2" strokeWidth={1} />
      <path d="M36 28 L36 74 M28 28 L44 28 M28 74 L44 74" fill="none" className="stroke-verde-scuro" strokeWidth={6} strokeLinecap="square" />
      <path d="M36 28 L48 28 C68 28 76 40 76 51 C76 62 68 74 48 74 L36 74" fill="none" className="stroke-verde-scuro" strokeWidth={6} strokeLinejoin="round" />
      <path d="M36 28 C36 20 38 16 40 13 C43 17 44 21 41 26" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={1.6} />
      <path d="M36 28 C33 22 30 20 27 19 C28 23 31 26 35 28" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={1.6} />
    </svg>
  )
}
