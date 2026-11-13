import PaginaSchede from '../components/PaginaSchede'
import { PERCORSI } from '../lib/percorsi'

/** Adempimenti medico-legali, percorsi protetti, sanità pubblica, maxiemergenza. */
export default function Percorsi() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-[#e6d5b0] bg-[#f6eedd] px-4 py-3 text-[13px] leading-snug text-[#7a5a17]">
        <b>Bozza.</b> Riferimenti normativi nazionali; modulistica e passaggi operativi vanno allineati alle procedure aziendali. PEIMAF e maxiemergenza in attesa del protocollo aziendale.
      </div>
      <PaginaSchede sezione="percorsi" schede={PERCORSI} segnaposto="Cerca un percorso…" />
    </div>
  )
}
