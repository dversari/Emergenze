// App Emergenze (DEA-LIRIO): rubrica telefonica, turni del PS e riunioni protetti da PIN.
// I numeri stanno in emergenze_rubrica (una riga, jsonb), i turni in emergenze_turni (una riga per mese);
// i cambi segnati dai colleghi nell'app in emergenze_cambi (registro, restituito per mese come «registro»);
// il PIN è salvato come SHA-256 in emergenze_config (chiave pin_rubrica_sha256).
// Riunioni/comunicazioni: file cifrati (AES-256-GCM) pubblicati con l'app; la chiave (emergenze_config.chiave_riunioni)
// viene consegnata solo dopo il PIN.
// Blocco tentativi: 10 PIN errati in un'ora dallo stesso indirizzo bloccano solo quell'indirizzo;
// oltre 100 errati in un'ora in totale si blocca tutto (difesa da attacchi da molti indirizzi).
// L'IP non viene salvato in chiaro: solo un hash.
import { createClient } from 'npm:@supabase/supabase-js@2'

const ORIGINI = new Set(['https://dversari.github.io', 'http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:5199'])
function cors(req: Request): Record<string, string> {
  const o = req.headers.get('origin') ?? ''
  return {
    'Access-Control-Allow-Origin': ORIGINI.has(o) ? o : 'https://dversari.github.io',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const MAX_PER_IP = 10
const MAX_GLOBALE = 100

async function sha256(t: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}
function uguali(a: string, b: string) {
  let d = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  return d === 0
}
async function ipHash(req: Request) {
  const ip = (req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? 'sconosciuto').trim()
  return (await sha256('emergenze-ip:' + ip)).slice(0, 32)
}

Deno.serve(async (req) => {
  const h = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: h })
  const out = (status: number, corpo: unknown) => new Response(JSON.stringify(corpo), { status, headers: { ...h, 'Content-Type': 'application/json' } })
  try {
    if (req.method !== 'POST') return out(405, { error: 'Metodo non consentito' })
    const c = await req.json().catch(() => ({}))
    const ip = await ipHash(req)
    const da = new Date(Date.now() - 3600_000).toISOString()
    const { count: mie } = await admin.from('emergenze_accessi').select('id', { count: 'exact', head: true }).eq('esito', 'pin errato').eq('ip_hash', ip).gte('creata_il', da)
    if ((mie ?? 0) >= MAX_PER_IP) return out(429, { error: 'Troppi PIN errati da questo dispositivo: riprova tra un’ora' })
    const { count: tutte } = await admin.from('emergenze_accessi').select('id', { count: 'exact', head: true }).eq('esito', 'pin errato').gte('creata_il', da)
    if ((tutte ?? 0) >= MAX_GLOBALE) return out(429, { error: 'Troppi tentativi in questo momento: riprova tra un’ora' })
    const { data: cfg } = await admin.from('emergenze_config').select('chiave, valore').in('chiave', ['pin_rubrica_sha256', 'chiave_riunioni'])
    const val = (k: string) => cfg?.find((r) => r.chiave === k)?.valore as string | undefined
    const pinHash = val('pin_rubrica_sha256')
    const ok = !!pinHash && typeof c.pin === 'string' && uguali(await sha256(c.pin.trim()), pinHash)
    if (!ok) {
      await admin.from('emergenze_accessi').insert({ esito: 'pin errato', ip_hash: ip })
      return out(401, { error: 'PIN errato' })
    }
    const { data, error } = await admin.from('emergenze_rubrica').select('dati, aggiornato_il').eq('id', 1).single()
    if (error) return out(500, { error: error.message })
    // Turni: dal mese precedente in poi, con il registro dei cambi segnati nell'app
    const d = new Date(); d.setUTCMonth(d.getUTCMonth() - 1)
    const dal = d.toISOString().slice(0, 7)
    const { data: turni } = await admin.from('emergenze_turni').select('mese, dati, aggiornato_il').gte('mese', dal).order('mese')
    const { data: cambi } = await admin.from('emergenze_cambi')
      .select('id, gruppo, mese, g, t, i, da, a, autore, creato_il, annullato_il, annullato_autore').gte('mese', dal).order('id')
    const conRegistro = (turni ?? []).map((m) => ({ ...m, registro: (cambi ?? []).filter((x) => x.mese === m.mese) }))
    await admin.from('emergenze_accessi').insert({ esito: 'ok', ip_hash: ip })
    return out(200, { dati: data.dati, aggiornato_il: data.aggiornato_il, turni: conRegistro, riunioni: val('chiave_riunioni') ?? null })
  } catch (e) {
    return out(500, { error: (e as Error).message })
  }
})
