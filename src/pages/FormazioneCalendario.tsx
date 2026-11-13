import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CHIAVE_PIN, leggi, scarica } from './Rubrica'
import { chiaveSalvata, decifra, PinRiunioni } from './Riunioni'

/*
 * Calendario mensile della formazione: dati cifrati in public/r/formazione.bin (stessa chiave delle Riunioni,
 * consegnata dopo il PIN). I cognomi sono mostrati come sigle (tabella «sigle» nel file); senza sigla resta il cognome.
 */
type Evento = { g: number; tipo: string; titolo: string; quando?: string; dove?: string; persone?: string[]; nota?: string }
type Dati = { sigle: Record<string, string>; mesi: Record<string, Evento[]> }

const MESI = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const GIORNI = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const TIPI: Record<string, { nome: string; c: string; dot: string }> = {
  corso: { nome: 'Corso', c: 'bg-[#e6eee8] text-[#2c5a40] border-[#bcd3c3]', dot: 'bg-[#4f8a66]' },
  sim: { nome: 'Simulazione', c: 'bg-[#e8eff7] text-[#24476d] border-[#b9cbe0]', dot: 'bg-[#4a74a3]' },
  esercitazione: { nome: 'Esercitazione', c: 'bg-[#f3ece0] text-[#6b5a3a] border-[#e0d2b8]', dot: 'bg-[#b08b4f]' },
  convegno: { nome: 'Convegno', c: 'bg-[#efe8f3] text-[#5b3d6e] border-[#d6c6e1]', dot: 'bg-[#8a63a3]' },
  mm: { nome: 'M&M', c: 'bg-[#f5e6e8] text-[#7a2e3b] border-[#e3c3c8]', dot: 'bg-[#a8485a]' },
}
const tipo = (t: string) => TIPI[t] ?? TIPI.corso
const CHIAVE_SIGLA = 'emergenze.turni.sigla'

export default function FormazioneCalendario() {
  const [chiave, setChiave] = useState<string | null>(chiaveSalvata)
  const [dati, setDati] = useState<Dati | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [mese, setMese] = useState<string | null>(null)
  const [giorno, setGiorno] = useState<number | null>(null)
  const mia = (() => { try { return localStorage.getItem(CHIAVE_SIGLA) ?? '' } catch { return '' } })()

  useEffect(() => {
    const p = leggi(CHIAVE_PIN)
    if (p) scarica(p).then(() => setChiave(chiaveSalvata())).catch(() => {})
  }, [])
  useEffect(() => {
    if (!chiave) return
    decifra(chiave, 'formazione.bin').then((b) => {
      const d: Dati = JSON.parse(new TextDecoder().decode(b))
      setDati(d)
      const oggi = new Date().toISOString().slice(0, 7)
      const elenco = Object.keys(d.mesi).sort()
      setMese((m) => m ?? (elenco.includes(oggi) ? oggi : elenco[elenco.length - 1] ?? oggi))
    }).catch(() => setErr('Impossibile leggere il calendario: riprova con la rete attiva.'))
  }, [chiave])

  const mesi = useMemo(() => Object.keys(dati?.mesi ?? {}).sort(), [dati])
  const eventi = useMemo(() => (dati && mese ? dati.mesi[mese] ?? [] : []), [dati, mese])
  const sigla = (c: string) => dati?.sigle[c] ?? c
  const mio = (e: Evento) => !!mia && (e.persone ?? []).some((p) => sigla(p).toUpperCase() === mia)

  if (!chiave) {
    if (leggi(CHIAVE_PIN)) return <p className="card text-tenue">Aggiorno i dati…</p>
    return <PinRiunioni fatto={() => setChiave(chiaveSalvata())} titolo="Calendario della formazione" testo="Contiene i nomi dei colleghi" />
  }

  const [a, m] = (mese ?? '2026-01').split('-').map(Number)
  const primo = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7
  const nGiorni = new Date(Date.UTC(a, m, 0)).getUTCDate()
  const celle = [...Array(primo).fill(null), ...Array.from({ length: nGiorni }, (_, i) => i + 1)]
  const oggi = new Date(); const eOggi = (g: number) => oggi.getFullYear() === a && oggi.getMonth() + 1 === m && oggi.getDate() === g
  const delGiorno = (g: number) => eventi.filter((e) => e.g === g)
  const lista = giorno ? delGiorno(giorno) : eventi
  const i = mese ? mesi.indexOf(mese) : -1

  return (
    <div className="flex flex-col gap-3 lg:max-w-5xl lg:mx-auto w-full">
      <div>
        <Link to="/formazione" className="text-sm font-bold text-verde">← Formazione</Link>
        <h1 className="mt-1 text-2xl font-black leading-tight">Calendario della formazione</h1>
        <p className="text-[13px] text-tenue">Corsi e partecipanti. {mia ? <>In giallo i corsi con la tua sigla ({mia}).</> : <>Imposta la tua sigla nella pagina Turni per evidenziare i tuoi corsi.</>}</p>
      </div>
      {err && <p className="card text-bordeaux">{err}</p>}
      {!dati && !err && <p className="card text-tenue">Carico…</p>}
      {dati && mese && (
        <>
          <div className="flex items-center gap-2">
            <button disabled={i <= 0} onClick={() => { setMese(mesi[i - 1]); setGiorno(null) }} className="rounded-full border border-linea px-3 py-1 font-black disabled:opacity-30">‹</button>
            <p className="flex-1 text-center text-lg font-black">{MESI[m - 1]} {a}</p>
            <button disabled={i >= mesi.length - 1} onClick={() => { setMese(mesi[i + 1]); setGiorno(null) }} className="rounded-full border border-linea px-3 py-1 font-black disabled:opacity-30">›</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(TIPI).map(([k, t]) => <span key={k} className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${t.c}`}>{t.nome}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {GIORNI.map((d, k) => <p key={k} className={`text-center text-[11px] font-extrabold ${k > 4 ? 'text-bordeaux' : 'text-tenue'}`}>{d}</p>)}
            {celle.map((g, k) => {
              if (!g) return <div key={k} />
              const ev = delGiorno(g)
              const sel = giorno === g
              return (
                <button key={k} onClick={() => setGiorno(sel ? null : g)}
                  className={`flex min-h-14 flex-col items-stretch rounded-lg border p-1 text-left lg:min-h-28 ${sel ? 'border-verde ring-2 ring-verde/40' : 'border-linea'} ${ev.some(mio) ? 'bg-[#fff6c9]' : ev.length ? 'bg-white' : 'bg-transparent'}`}>
                  <span className={`text-[12px] font-black ${eOggi(g) ? 'self-start rounded-full bg-verde px-1.5 text-white' : k % 7 > 4 ? 'text-bordeaux' : ''}`}>{g}</span>
                  <span className="mt-0.5 flex flex-wrap gap-0.5 lg:hidden">{ev.map((e, j) => <span key={j} className={`h-1.5 w-1.5 rounded-full ${tipo(e.tipo).dot}`} />)}</span>
                  <span className="mt-0.5 hidden flex-col gap-0.5 lg:flex">
                    {ev.map((e, j) => <span key={j} className={`truncate rounded border px-1 text-[10.5px] font-bold leading-tight ${tipo(e.tipo).c}`}>{e.titolo}</span>)}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="etichetta">{giorno ? `${giorno} ${MESI[m - 1].toLowerCase()}` : `Tutto ${MESI[m - 1].toLowerCase()}`}</p>
            {giorno && <button onClick={() => setGiorno(null)} className="text-[13px] font-bold text-verde">Mostra tutto il mese</button>}
          </div>
          <div className="flex flex-col gap-1.5">
            {lista.length === 0 && <p className="card text-tenue">Nessun corso.</p>}
            {lista.map((e, j) => (
              <div key={j} className={`flex gap-3 rounded-2xl border p-3 ${mio(e) ? 'border-[#e6cf62] bg-[#fff6c9]' : 'border-linea bg-white'}`}>
                <span className="flex w-10 shrink-0 flex-col items-center leading-none">
                  <span className="text-[19px] font-black">{e.g}</span>
                  <span className="text-[10px] font-bold uppercase text-tenue">{['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'][(primo + e.g - 1) % 7]}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-extrabold uppercase ${tipo(e.tipo).c}`}>{tipo(e.tipo).nome}</span>
                  <span className="mt-1 block text-[15px] font-black leading-tight">{e.titolo}</span>
                  <span className="block text-[13px] text-tenue">{[e.quando, e.dove, e.nota].filter(Boolean).join(' · ')}</span>
                  {(e.persone ?? []).length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {(e.persone ?? []).map((p) => <span key={p} className={`rounded-md px-1.5 py-0.5 text-[12px] font-extrabold ${sigla(p).toUpperCase() === mia ? 'bg-[#f5d94a]' : 'bg-sabbia'}`}>{sigla(p)}</span>)}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
