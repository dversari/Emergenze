/** Figure del PEIMAF: schede di azione per ruolo (tape SISmax), piantine e cartellonistica, triage START/FAST. */
import { useState } from 'react'
import { CODICI_T, FAST, RUOLI, TEMPI_DECO } from '../lib/peimaf'

const base = import.meta.env.BASE_URL

function Tavole({ tavole }: { tavole: { file: string; titolo: string; nota?: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {tavole.map((t) => (
        <figure key={t.file} className="overflow-hidden rounded-xl border border-linea bg-white">
          <a href={`${base}img/peimaf/${t.file}`} target="_blank" rel="noreferrer" title="Apri a schermo intero">
            <img src={`${base}img/peimaf/${t.file}`} alt={t.titolo} loading="lazy" className="block w-full" />
          </a>
          <figcaption className="border-t border-linea px-3 py-1.5 text-[12px] leading-snug">
            <b>{t.titolo}</b>{t.nota && <span className="text-tenue"> · {t.nota}</span>}
            <span className="text-tenue"> · tocca per ingrandire</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export function FiguraRuoli() {
  const [nbcre, setNbcre] = useState(false)
  const [aperto, setAperto] = useState<string | null>('DSS-H')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 rounded-xl bg-sabbia p-1 text-[13px] font-bold">
        {[false, true].map((v) => (
          <button key={String(v)} onClick={() => setNbcre(v)}
            className={`flex-1 rounded-lg py-1.5 ${nbcre === v ? 'bg-white shadow-sm text-testo' : 'text-tenue'}`}>
            {v ? 'NBCRe (prima delle convenzionali)' : 'Convenzionale'}
          </button>
        ))}
      </div>
      {RUOLI.filter((r) => !nbcre || r.nbcre).map((r) => {
        const voci = nbcre ? r.nbcre! : r.compiti
        const su = aperto === r.sigla
        return (
          <div key={r.sigla} className="overflow-hidden rounded-xl bg-white" style={{ border: `3px solid ${r.colore}` }}>
            <button onClick={() => setAperto(su ? null : r.sigla)} className="flex w-full items-center gap-2 px-3 py-2 text-left">
              <span className="min-w-[3.4rem] rounded-md px-1.5 py-0.5 text-center text-[13px] font-black" style={{ background: r.colore, color: r.sigla === 'DD' ? '#1f2b26' : '#fff' }}>{r.sigla}</span>
              <span className="flex-1 leading-tight">
                <span className="block text-[13.5px] font-extrabold">{r.nome}</span>
                <span className="block text-[11.5px] text-tenue">Radio «{r.radio}» · pettorina {r.pettorina}</span>
              </span>
              <span className="text-tenue">{su ? '−' : '+'}</span>
            </button>
            {su && (
              <div className="border-t border-linea px-3 py-2">
                <p className="mb-1.5 text-[12px] leading-snug text-tenue"><b>Chi:</b> {r.chi}</p>
                <ul className="flex flex-col gap-1">
                  {voci.map((v) => <li key={v} className="flex gap-1.5 text-[13px] leading-snug"><span className="mt-[1px] text-tenue">☐</span><span>{v}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        )
      })}
      <p className="text-[12px] leading-snug text-tenue">
        Piramide della comunicazione: il DSS-H al vertice parla con tutti (DD, RI, DCA, RT, RST); i cinque referenti comunicano anche tra loro. Sul tape c’è uno spazio «Numeri utili» da compilare al momento.
      </p>
      {nbcre && (
        <div className="rounded-xl border border-linea bg-white px-3 py-2">
          <p className="text-[13px] font-extrabold">Tempi di decontaminazione</p>
          <div className="mt-1 grid grid-cols-2 gap-x-3 text-[13px]">
            {TEMPI_DECO.map(([a, b]) => <div key={a} className="contents"><span>{a}</span><b className="text-right">{b}</b></div>)}
          </div>
        </div>
      )}
    </div>
  )
}

export const FiguraDea = () => (
  <Tavole tavole={[
    { file: 'aree-convenzionale.webp', titolo: 'Aree del PS in maxiemergenza convenzionale', nota: 'rosa = maxiemergenza, giallo = ordinaria; TGE/TGI = triage esterno/interno' },
    { file: 'accessi-convenzionale.webp', titolo: 'Accessi in maxiemergenza convenzionale', nota: 'rosso barellati maxi, blu deambulanti maxi, giallo deambulanti ordinari, verde barellati ordinari' },
    { file: 'cartelli-maxiemergenza.webp', titolo: 'Cartelli maxiemergenza' },
    { file: 'cartelli-ordinari.webp', titolo: 'Cartelli emergenza ordinaria (quantità)' },
    { file: 'percorsi-ambulanze-convenzionale.webp', titolo: 'Percorsi delle ambulanze, convenzionale' },
    { file: 'posizionamento-convenzionale.webp', titolo: 'Dove vanno i cartelli, convenzionale' },
  ]} />
)

export const FiguraNbcre = () => (
  <Tavole tavole={[
    { file: 'accessi-nbcre.webp', titolo: 'Accessi in maxiemergenza NBCRe', nota: 'rosso deambulanti maxi, blu barellati maxi, giallo deambulanti ordinari, verde barellati ordinari' },
    { file: 'percorsi-ambulanze-nbcre.webp', titolo: 'Percorsi delle ambulanze, NBCRe' },
    { file: 'posizionamento-nbcre.webp', titolo: 'Dove vanno i cartelli, NBCRe' },
  ]} />
)

function Nodo({ testo, si, no }: { testo: string; si: string; no?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px]">
      <span className="w-40 shrink-0 rounded-lg border border-linea bg-white px-2 py-1 font-bold">{testo}</span>
      <span className="text-tenue">→</span>
      <span className="min-w-[6.5rem] leading-tight">{si}{no && <><br /><span className="text-tenue">{no}</span></>}</span>
    </div>
  )
}

export function FiguraTriageMassa() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-1.5">
        {CODICI_T.map((c) => (
          <div key={c.codice} className="rounded-lg px-1.5 py-1.5 text-center" style={{ background: c.colore, color: c.testo === 'bianco' ? '#fff' : '#26418f' }}>
            <div className="text-lg font-black leading-none">{c.codice}</div>
            <div className="mt-0.5 text-[10.5px] font-bold leading-tight">{c.significato}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl border border-linea bg-sabbia p-2">
        <p className="text-[12.5px] font-extrabold">START (scheda regionale)</p>
        <Nodo testo="Può camminare?" si="Sì → T3" no="No ↓" />
        <Nodo testo="Respira?" si="Sì ↓" no="No: disostruisci → ancora no T4, sì T1" />
        <Nodo testo="FR > 30?" si="Sì → T1" no="No ↓" />
        <Nodo testo="Polso radiale presente?" si="Sì ↓" no="No → T1" />
        <Nodo testo="Esegue ordini semplici?" si="Sì → T2" no="No → T1" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-linea bg-white">
        <p className="px-2 pt-2 text-[12.5px] font-extrabold">FAST (rivalutazione e triage in uscita)</p>
        <table className="mt-1 w-full text-[12px]">
          <thead><tr className="text-tenue"><th className="px-2 py-1 text-left font-bold">Parametro</th><th className="px-1 font-bold">Non critici</th><th className="px-1 font-bold">Sub critici</th><th className="px-1 font-bold">Critici</th></tr></thead>
          <tbody>
            {FAST.map(([p, a, b, c]) => (
              <tr key={p} className="border-t border-linea"><td className="px-2 py-1 font-bold">{p}</td><td className="px-1 text-center">{a}</td><td className="px-1 text-center">{b}</td><td className="px-1 text-center font-bold text-bordeaux">{c}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="px-2 py-1.5 text-[11px] leading-snug text-tenue">Soglie trascritte dalla scheda sanitaria regionale (Allegato 2 al DOC.DS.03), con le colonne come stampate.</p>
      </div>
    </div>
  )
}
