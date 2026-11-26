// App Emergenze: cambi turno segnati dai colleghi dalla riga di comando della scheda Turni.
// Stesso PIN della rubrica (emergenze_config.pin_rubrica_sha256) e stesso blocco dei PIN errati (emergenze_accessi).
// Nessun login: ogni cambio è subito valido, resta nel registro (emergenze_cambi) con autore dichiarato,
// ora e hash dell'indirizzo, e chiunque abbia il PIN può annullarlo (annullato_il / annullato_autore).
// Un trigger (emergenze_cambi_verso_turni) riporta i cambi che riguardano VR nella tabella turni del Cruscotto
// e avvia la sincronizzazione con il calendario iCloud.
// Deploy con verify_jwt disattivato (l'app non ha login).
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
const MAX_CAMBI_ORA = 30
const TURNI = new Set(['m', 'p', 'n', 'nn', 'rm', 'rp', 'rn'])
const SIGLA = /^[A-Z]{2,3}$/

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

type Cambio = { mese: string; g: number; t: string; i: number; da: string; a: string; pos?: string | null }
type Riga = Cambio & { id: number; gruppo: string; annullato_il: string | null }

Deno.serve(async (req) => {
  const h = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: h })
  const out = (status: number, corpo: unknown) => new Response(JSON.stringify(corpo), { status, headers: { ...h, 'Content-Type': 'application/json' } })
  try {
    if (req.method !== 'POST') return out(405, { error: 'Metodo non consentito' })
    const c = await req.json().catch(() => ({}))
    const ip = await ipHash(req)
    const unOraFa = new Date(Date.now() - 3600_000).toISOString()

    // PIN
    const { count: mie } = await admin.from('emergenze_accessi').select('id', { count: 'exact', head: true }).eq('esito', 'pin errato').eq('ip_hash', ip).gte('creata_il', unOraFa)
    if ((mie ?? 0) >= MAX_PER_IP) return out(429, { error: 'Troppi PIN errati da questo dispositivo: riprova tra un’ora' })
    const { count: tutte } = await admin.from('emergenze_accessi').select('id', { count: 'exact', head: true }).eq('esito', 'pin errato').gte('creata_il', unOraFa)
    if ((tutte ?? 0) >= MAX_GLOBALE) return out(429, { error: 'Troppi tentativi in questo momento: riprova tra un’ora' })
    const { data: cfg } = await admin.from('emergenze_config').select('valore').eq('chiave', 'pin_rubrica_sha256').single()
    const ok = !!cfg?.valore && typeof c.pin === 'string' && uguali(await sha256(c.pin.trim()), cfg.valore)
    if (!ok) {
      await admin.from('emergenze_accessi').insert({ esito: 'pin errato', ip_hash: ip })
      return out(401, { error: 'PIN errato' })
    }
    const autore = typeof c.autore === 'string' && SIGLA.test(c.autore.trim().toUpperCase()) ? c.autore.trim().toUpperCase() : null

    if (c.azione === 'aggiungi') {
      const { count: recenti } = await admin.from('emergenze_cambi').select('id', { count: 'exact', head: true }).eq('ip_hash', ip).gte('creato_il', unOraFa)
      if ((recenti ?? 0) >= MAX_CAMBI_ORA) return out(429, { error: 'Troppi cambi segnati da questo dispositivo nell’ultima ora' })
      const cambi: Cambio[] = Array.isArray(c.cambi) ? c.cambi : []
      if (cambi.length < 1 || cambi.length > 8) return out(400, { error: 'Richiesta non valida' })
      for (const x of cambi) {
        if (typeof x?.mese !== 'string' || !/^\d{4}-\d{2}$/.test(x.mese) || !Number.isInteger(x.g) || !TURNI.has(x.t) || !Number.isInteger(x.i)
          || typeof x.da !== 'string' || typeof x.a !== 'string' || !SIGLA.test(x.da) || !SIGLA.test(x.a) || x.da === x.a
          || (x.pos != null && !/^[A-Z0-9]{1,3}$/.test(String(x.pos)))) return out(400, { error: 'Cambio non valido' })
      }
      // Chi cede deve risultare in quel turno (prospetto + cambi già registrati)
      const mesi = [...new Set(cambi.map((x) => x.mese))]
      const { data: righe } = await admin.from('emergenze_turni').select('mese, dati').in('mese', mesi)
      const { data: app } = await admin.from('emergenze_cambi').select('g, t, da, a, mese').in('mese', mesi).is('annullato_il', null)
      for (const x of cambi) {
        const r = righe?.find((y) => y.mese === x.mese)
        const giorno = r?.dati?.giorni?.find((y: { g: number }) => y.g === x.g)
        if (!giorno) return out(400, { error: `Nessun prospetto per il ${x.g}/${x.mese.slice(5)}` })
        const presenti = new Set<string>(String(giorno[x.t] ?? '').split(' ').filter(Boolean).map((s) => s.replace(/[*~]/g, '')))
        for (const y of [...(r?.dati?.cambi ?? []), ...(app ?? []).filter((z) => z.mese === x.mese)]) if (y.g === x.g && y.t === x.t) { presenti.delete(y.da); presenti.add(y.a) }
        if (!presenti.has(x.da)) return out(409, { error: `${x.da} non risulta in quel turno il ${x.g}/${x.mese.slice(5)}: ricarica la pagina` })
      }
      const gruppo = crypto.randomUUID()
      const { error } = await admin.from('emergenze_cambi').insert(cambi.map((x) => ({ mese: x.mese, g: x.g, t: x.t, i: x.i, da: x.da, a: x.a, pos: x.pos ?? null, gruppo, autore, ip_hash: ip })))
      if (error) return out(500, { error: error.message })
      return out(200, { ok: true, gruppo })
    }

    if (c.azione === 'annulla') {
      if (typeof c.gruppo !== 'string') return out(400, { error: 'Richiesta non valida' })
      const { data: mieRighe } = await admin.from('emergenze_cambi').select('id, gruppo, mese, g, t, i, da, a, annullato_il').eq('gruppo', c.gruppo)
      const righe = (mieRighe ?? []) as Riga[]
      if (!righe.length) return out(404, { error: 'Cambio non trovato' })
      if (righe.every((r) => r.annullato_il)) return out(200, { ok: true })
      // Non si annulla un cambio se, dopo, chi è subentrato ha già ceduto lo stesso turno ad altri
      const ultimo = Math.max(...righe.map((r) => r.id))
      const { data: dopo } = await admin.from('emergenze_cambi').select('mese, g, t, da').in('mese', [...new Set(righe.map((r) => r.mese))]).is('annullato_il', null).gt('id', ultimo)
      for (const r of righe) {
        if ((dopo ?? []).some((d) => d.mese === r.mese && d.g === r.g && d.t === r.t && d.da === r.a))
          return out(409, { error: `${r.a} ha già ceduto di nuovo quel turno: annulla prima il cambio successivo` })
      }
      const { error } = await admin.from('emergenze_cambi').update({ annullato_il: new Date().toISOString(), annullato_autore: autore }).eq('gruppo', c.gruppo).is('annullato_il', null)
      if (error) return out(500, { error: error.message })
      return out(200, { ok: true })
    }

    return out(400, { error: 'Azione sconosciuta' })
  } catch (e) {
    return out(500, { error: (e as Error).message })
  }
})
