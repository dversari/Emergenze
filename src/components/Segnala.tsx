import { useState } from 'react'

/*
 * Modulo per segnalare errori e suggerimenti: va alla Edge Function Supabase «emergenze-segnala»,
 * che salva nella tabella emergenze_segnalazioni. Nessun indirizzo email visibile nell'app.
 */
const URL_FUNZIONE = 'https://djruxnduelhzxkomxvcb.supabase.co/functions/v1/emergenze-segnala'

export default function Segnala({ etichetta = '✎ Segnala un errore o un suggerimento', className = '' }: { etichetta?: string; className?: string }) {
  const [aperto, setAperto] = useState(false)
  const [tipo, setTipo] = useState<'errore' | 'suggerimento' | 'altro'>('errore')
  const [testo, setTesto] = useState('')
  const [nome, setNome] = useState('')
  const [contatto, setContatto] = useState('')
  const [sito, setSito] = useState('')
  const [stato, setStato] = useState<'pronto' | 'invio' | 'fatto' | string>('pronto')

  const invia = async () => {
    setStato('invio')
    try {
      const res = await fetch(URL_FUNZIONE, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, testo, nome, contatto, sito, pagina: location.hash || '/' }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error ?? `Errore ${res.status}`)
      setStato('fatto'); setTesto('')
    } catch (e) { setStato((e as Error).message || 'Invio non riuscito') }
  }

  return (
    <>
      <button onClick={() => { setAperto(true); setStato('pronto') }} className={className || 'rounded-full bg-verde text-white text-[13px] font-extrabold px-4 py-2.5 active:opacity-80'}>{etichetta}</button>
      {aperto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setAperto(false)}>
          <div className="bg-carta w-full max-w-lg rounded-t-[22px] sm:rounded-[22px] p-4 pb-[calc(16px+env(safe-area-inset-bottom))] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {stato === 'fatto' ? (
              <div className="text-center py-4">
                <p className="text-3xl">🙏</p>
                <p className="font-black text-lg mt-1">Ricevuto, grazie!</p>
                <p className="text-sm text-tenue mt-1">Ogni segnalazione viene letta. Le correzioni compaiono nella versione successiva.</p>
                <button onClick={() => setAperto(false)} className="mt-4 rounded-full bg-verde text-white font-bold px-5 py-2">Chiudi</button>
              </div>
            ) : (
              <>
                <p className="font-black text-lg">Segnala</p>
                <p className="text-[12.5px] text-tenue leading-snug">Errori di dosi o di testo, cose che mancano, protocolli di Prato da aggiungere. Niente dati dei pazienti.</p>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-sabbia border border-linea mt-3 text-[13px] font-bold">
                  {(['errore', 'suggerimento', 'altro'] as const).map((t) => (
                    <button key={t} onClick={() => setTipo(t)} className={`rounded-lg py-1.5 capitalize ${tipo === t ? 'bg-carta shadow-card' : 'text-tenue'}`}>{t}</button>
                  ))}
                </div>
                <textarea value={testo} onChange={(e) => setTesto(e.target.value)} rows={5} maxLength={4000}
                  placeholder={tipo === 'errore' ? 'Dove (PDTA, scheda…) e cosa non va' : 'Cosa aggiungeresti o cambieresti'}
                  className="mt-2 w-full rounded-xl border border-linea px-3 py-2 text-base" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome (facoltativo)" className="rounded-xl border border-linea px-3 py-2 text-sm" />
                  <input value={contatto} onChange={(e) => setContatto(e.target.value)} placeholder="Email o tel. (facoltativo)" className="rounded-xl border border-linea px-3 py-2 text-sm" />
                </div>
                <input value={sito} onChange={(e) => setSito(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                {stato !== 'pronto' && stato !== 'invio' && <p className="text-sm text-bordeaux mt-2">{stato}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setAperto(false)} className="flex-1 rounded-full border border-linea-forte py-2.5 font-bold text-tenue">Annulla</button>
                  <button onClick={invia} disabled={testo.trim().length < 5 || stato === 'invio'}
                    className="flex-1 rounded-full bg-verde text-white py-2.5 font-extrabold disabled:opacity-40">{stato === 'invio' ? 'Invio…' : 'Invia'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
