import { Link } from 'react-router-dom'

type Modulo = { to: string; titolo: string; descr: string; pdta?: { to: string; etichetta: string } }

const MODULI: Modulo[] = [
  {
    to: '/modulo-trasfusione',
    titolo: 'Richiesta di sangue e emocomponenti',
    descr: 'Modulo aziendale 2019 (SOC Immunoematologia Prato-Pistoia). Struttura DEA, centro di costo 8981C. Compilabile e stampabile.',
    pdta: { to: '/linee-guida/anemia-acuta', etichetta: 'PDTA anemia acuta' },
  },
  {
    to: '/modulo-trasferimento',
    titolo: 'Trasferimento di emergenza (118)',
    descr: 'Allegato 1 alla PA.A118.01: sintesi clinica, GCS e classe di Ehrenwerth per il trasporto. Compilabile e stampabile.',
  },
]

export default function Moduli() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold">Moduli</h1>
      <p className="text-sm text-tenue">Si compilano qui (anche incollando da FirstAid) e si stampano. I dati del paziente non vengono salvati.</p>
      <div className="grid gap-3 lg:grid-cols-2">
        {MODULI.map((m) => (
          <div key={m.to} className="rounded-2xl border border-linea bg-white p-4 shadow-[var(--shadow-card)]">
            <Link to={m.to} className="block">
              <div className="text-[17px] font-bold text-testo">🖨︎ {m.titolo}</div>
              <div className="mt-1 text-sm text-tenue">{m.descr}</div>
            </Link>
            <div className="mt-3 flex gap-2 text-sm">
              <Link to={m.to} className="rounded-xl bg-verde px-3 py-1.5 font-bold text-white">Apri il modulo</Link>
              {m.pdta && <Link to={m.pdta.to} className="rounded-xl border border-linea px-3 py-1.5 font-bold text-tenue">{m.pdta.etichetta}</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
