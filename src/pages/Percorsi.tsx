import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PaginaSchede from '../components/PaginaSchede'
import { PERCORSI } from '../lib/percorsi'

/** Percorsi in evidenza in cima alla pagina: un tocco apre le loro schede. */
const PRIORITARI = [
  { gruppo: 'Codice Rosa', titolo: 'Codice Rosa', testo: 'Violenza: accoglienza, prove, profilassi, rete antiviolenza', icona: '♀', colore: 'bg-[#f7e3ea] border-[#e7b9c9] text-[#8a2347]', attivo: 'bg-[#8a2347] border-[#8a2347] text-white' },
  { gruppo: 'Maxiemergenza', titolo: 'Maxiemergenza', testo: 'PEIMAF, assetto del DEA, NBCRe, triage di massa', icona: '⚠', colore: 'bg-[#fbeee0] border-[#ecc9a2] text-[#8a4a12]', attivo: 'bg-[#8a4a12] border-[#8a4a12] text-white' },
] as const

/** Adempimenti medico-legali, percorsi protetti, sanità pubblica; Codice Rosa e Maxiemergenza in evidenza. */
export default function Percorsi() {
  const [params] = useSearchParams()
  const apri = params.get('apri')
  const gruppoApri = PERCORSI.find((s) => s.id === apri)?.gruppo
  const [scelto, setScelto] = useState<string | null>(PRIORITARI.some((p) => p.gruppo === gruppoApri) ? gruppoApri! : null)
  useEffect(() => { if (gruppoApri && PRIORITARI.some((p) => p.gruppo === gruppoApri)) setScelto(gruppoApri) }, [gruppoApri])
  const prio = new Set<string>(PRIORITARI.map((p) => p.gruppo))
  const sel = PRIORITARI.find((p) => p.gruppo === scelto)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2.5">
        {PRIORITARI.map((p) => {
          const on = scelto === p.gruppo
          return (
            <button key={p.gruppo} onClick={() => setScelto(on ? null : p.gruppo)} aria-expanded={on}
              className={`rounded-2xl border-2 p-3 text-left shadow-[var(--shadow-card)] transition-colors ${on ? p.attivo : p.colore}`}>
              <span className="flex items-center gap-2"><span className="text-2xl leading-none">{p.icona}</span><span className="min-w-0 font-display text-[16px] font-extrabold leading-tight">{p.titolo}</span><span className="ml-auto shrink-0 text-sm">{on ? '▴' : '▾'}</span></span>
              <span className={`mt-1 block text-[12px] leading-snug ${on ? 'text-white/85' : 'opacity-80'}`}>{p.testo}</span>
            </button>
          )
        })}
      </div>
      {sel && (
        <div className="rounded-2xl border-2 border-linea p-2.5">
          <PaginaSchede key={sel.gruppo} sezione="percorsi" schede={PERCORSI.filter((s) => s.gruppo === sel.gruppo)} segnaposto="" senzaCerca senzaGruppi />
        </div>
      )}
      <div className="rounded-2xl border border-[#e6d5b0] bg-[#f6eedd] px-4 py-3 text-[13px] leading-snug text-[#7a5a17]">
        <b>Bozza.</b> Riferimenti normativi nazionali; modulistica e passaggi operativi vanno allineati alle procedure aziendali. Il PEIMAF segue la procedura aziendale PS.DRO.62.
      </div>
      <PaginaSchede sezione="percorsi" schede={PERCORSI.filter((s) => !prio.has(s.gruppo))} segnaposto="Cerca un percorso…" />
    </div>
  )
}
