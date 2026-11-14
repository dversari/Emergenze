import { useState } from 'react'
import { supabase } from '../lib/riservati'

/** Riquadro di accesso per le sezioni riservate (account del Cruscotto). */
export default function AccessoRiservato() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState<string | null>(null)
  const [attesa, setAttesa] = useState(false)
  const entra = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttesa(true); setErrore(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setAttesa(false)
    if (error) setErrore('Accesso non riuscito.')
  }
  return (
    <form onSubmit={entra} className="card flex flex-col gap-2">
      <p className="font-extrabold">🔒 Sezione riservata</p>
      <p className="text-[13px] text-tenue leading-snug">I documenti aziendali non sono pubblici.</p>
      <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {errore && <p className="text-sm text-bordeaux">{errore}</p>}
      <button disabled={!email || !password || attesa} className="mt-1 w-full rounded-full bg-verde text-white py-3 font-extrabold disabled:opacity-40">{attesa ? 'Verifica…' : 'Entra'}</button>
    </form>
  )
}
