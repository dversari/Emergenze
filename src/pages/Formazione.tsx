import { Link } from 'react-router-dom'
import { DISEGNI } from './Home'

/*
 * Formazione: pagina di raccolta con tre schede (regole, calendario mensile, programmi dei corsi).
 */
const SCHEDE = [
  { to: '/formazione/regole', icona: 'formazione', titolo: 'Regole', testo: 'Regolamento 2026 in breve: codici di timbratura, rimborsi, FAD.' },
  { to: '/formazione/calendario', icona: 'calendario', titolo: 'Calendario mensile', testo: 'Corsi giorno per giorno e chi partecipa. 🔒' },
  { to: '/formazione/programmi', icona: 'programmi', titolo: 'Programmi dei corsi', testo: 'Contenuti, durata e materiale di ogni corso.' },
]

export const CORSI = [
  { nome: 'ACLS e simulazione ACLS', tipo: 'Rianimazione' },
  { nome: 'PALS', tipo: 'Rianimazione pediatrica' },
  { nome: 'ATLS', tipo: 'Trauma' },
  { nome: 'TBST', tipo: 'Trauma' },
  { nome: 'PHAM', tipo: 'Pediatria' },
  { nome: 'Cadaver lab', tipo: 'Procedure' },
  { nome: 'NBCR', tipo: 'Maxi-emergenze' },
  { nome: 'Corso decontaminazione', tipo: 'Maxi-emergenze' },
  { nome: 'PEIMAF', tipo: 'Maxi-emergenze' },
  { nome: 'Codice rosa', tipo: 'Violenza' },
  { nome: 'Simulazione relazionale', tipo: 'Comunicazione' },
  { nome: 'Corso delirium', tipo: 'Geriatria' },
  { nome: 'Corso vertigini', tipo: 'Neurologia' },
  { nome: 'Ecografia (Winfocus): PoCUS dolore toracico, ecografia toracica, blocchi nervosi', tipo: 'Ecografia' },
  { nome: 'Morbilità e mortalità (M&M)', tipo: 'Audit' },
]

export function Programmi() {
  return (
    <div className="flex flex-col gap-3 lg:max-w-5xl lg:mx-auto w-full">
      <div>
        <Link to="/formazione" className="text-sm font-bold text-verde">← Formazione</Link>
        <h1 className="mt-1 text-2xl font-black leading-tight">Programmi dei corsi</h1>
        <p className="mt-1 text-[13px] text-tenue">I programmi verranno aggiunti man mano. Per ora l’elenco dei corsi presenti nel calendario.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CORSI.map((c) => (
          <div key={c.nome} className="rounded-2xl border border-linea bg-white p-3 shadow-[var(--shadow-card)]">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wide text-tenue">{c.tipo}</p>
            <p className="mt-0.5 text-[15px] font-black leading-tight">{c.nome}</p>
            <p className="mt-1.5 text-[12px] text-tenue">Programma da inserire</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Formazione() {
  return (
    <div className="flex flex-col gap-3 lg:max-w-5xl lg:mx-auto w-full">
      <div>
        <p className="etichetta !text-oro">PS Prato · ASL Toscana Centro</p>
        <h1 className="text-2xl font-black leading-tight">Formazione</h1>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {SCHEDE.map((s) => (
          <Link key={s.to} to={s.to} className="flex items-center gap-3 rounded-2xl border border-linea bg-white p-4 shadow-[var(--shadow-card)] active:bg-sabbia/40 sm:flex-col sm:items-start">
            <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" aria-hidden>{DISEGNI[s.icona]}</svg>
            <span className="min-w-0">
              <span className="block text-[17px] font-black leading-tight">{s.titolo}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-tenue">{s.testo}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
