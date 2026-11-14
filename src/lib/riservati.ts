/**
 * Documenti ASL riservati: i PDF non sono più pubblicati con l'app ma stanno nel bucket privato
 * «emergenze-docs» di Supabase, leggibile solo dall'account di Daniele (policy RLS sull'utente).
 * Stesso progetto Supabase del Cruscotto: se il browser ha già la sessione del Cruscotto (stessa
 * origine dversari.github.io), vale anche qui; altrimenti si entra con email e password.
 */
import { createClient, type Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const supabase = createClient(
  'https://djruxnduelhzxkomxvcb.supabase.co',
  'sb_publishable_S-vVpxC7mH1uTslpggycMg_ihIrdAJr',
  { auth: { persistSession: true, autoRefreshToken: true } },
)

const PREFISSO = 'docs/asl/'
export const riservato = (file: string) => file.startsWith(PREFISSO)

/** Scarica un documento riservato e restituisce un URL blob: (o lancia un errore). */
export async function urlRiservato(file: string): Promise<string> {
  const { data, error } = await supabase.storage.from('emergenze-docs').download(file.slice(PREFISSO.length))
  if (error || !data) throw error ?? new Error('Documento non disponibile')
  return URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
}

/** Sessione corrente (null = non autenticato, undefined = verifica in corso). */
export function useSessione(): Session | null | undefined {
  const [s, setS] = useState<Session | null | undefined>(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setS(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, sess) => setS(sess))
    return () => data.subscription.unsubscribe()
  }, [])
  return s
}
