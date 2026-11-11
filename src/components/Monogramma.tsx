/** Monogramma «DV» di Daniele Versari: D verde e V bordeaux affiancate in un cerchio. */
export default function Monogramma({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Monogramma DV">
      <circle cx="50" cy="50" r="47" className="fill-carta stroke-bordeaux" strokeWidth={3.5} />
      <path d="M19 29 L19 71 L29 71 C43 71 50 62 50 50 C50 38 43 29 29 29 Z" fill="none" className="stroke-verde-scuro" strokeWidth={8} strokeLinejoin="round" />
      <path d="M55 29 L68 71 L81 29" fill="none" className="stroke-bordeaux" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
