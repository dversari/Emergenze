// App Emergenze: domande sul testo completo di una linea guida.
// L'app non ha login: l'accesso è protetto da un PIN, da un limite di domande al giorno
// e dallo stesso tetto di spesa mensile dell'assistente del Cruscotto (tabella ai_spesa).
//
// Segreti (Supabase → Edge Functions → Secrets):
//   ANTHROPIC_API_KEY                      già presente (Cruscotto)
//   EMERGENZE_PIN                          PIN chiesto dall'app
//   AI_BUDGET_MENSILE_USD                  facoltativo, condiviso con l'assistente
//   DROPBOX_APP_KEY, DROPBOX_REFRESH_TOKEN già presenti: servono per i PDF messi in Dropbox
//
// Testo completo: si carica una volta e resta in emergenze_testi. Ordine di ricerca:
//   1. Dropbox /Documents/Emergenze/Linee guida/<fonte>.pdf (se c'è, vince sempre)
//   2. PDF ad accesso libero (archivi universitari; PDF oltre ~8 MB esauriscono la memoria della funzione)
//   3. pagina della rivista letta con lo strumento web_fetch di Claude
import { createClient } from 'npm:@supabase/supabase-js@2'
import { extractText, getDocumentProxy } from 'npm:unpdf@1'

// ---------- Fonti ----------
interface Fonte { titolo: string; pdf?: string; web?: string }
const FONTI: Record<string, Fonte> = {
  'esc-fa-2024': { titolo: '2024 ESC Guidelines for the management of atrial fibrillation', web: 'https://academic.oup.com/eurheartj/article/45/36/3314/7738779' },
  'esc-sc-2026': { titolo: '2026 ESC Guidelines for the management of heart failure', web: 'https://academic.oup.com/eurheartj/article/47/38/5346/8766302' },
  'esc-ep-2019': { titolo: '2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism', pdf: 'https://access.archive-ouverte.unige.ch/access/metadata/cca775c8-e559-4abd-b219-8af74d4c1a02/download' },
  'aha-ep-2026': { titolo: '2026 AHA/ACC Guideline for the Evaluation and Management of Acute Pulmonary Embolism in Adults' },
  'esc-sca-2023': { titolo: '2023 ESC Guidelines for the management of acute coronary syndromes', web: 'https://academic.oup.com/eurheartj/article/44/38/3720/7243210' },
  'aha-sca-2025': { titolo: '2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes' },
}
const CARTELLA_DROPBOX = '/Documents/Emergenze/Linee guida'
const MAX_CARATTERI = 600_000 // ~150k token: oltre si tronca
const DOMANDE_AL_GIORNO = 40

// ---------- Modelli (prezzi $/milione di token, come nell'assistente del Cruscotto) ----------
interface Prezzi { input: number; output: number; soglia?: number; inputOltre?: number; outputOltre?: number }
const MODELLI: Record<string, { id: string; prezzi: Prezzi }> = {
  'claude-haiku': { id: 'claude-haiku-5-5', prezzi: { input: 0.1, output: 0.5, soglia: 100_000, inputOltre: 0.5, outputOltre: 2.5 } },
  'claude-sonnet': { id: 'claude-sonnet-5-5', prezzi: { input: 2, output: 10 } },
}
const ORDINE = ['claude-haiku', 'claude-sonnet']

interface Uso { input_tokens?: number; output_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number }
function costo(nome: string, u: Uso): number {
  const p = MODELLI[nome].prezzi
  const nuovi = u.input_tokens ?? 0, scritti = u.cache_creation_input_tokens ?? 0, letti = u.cache_read_input_tokens ?? 0
  const totale = nuovi + scritti + letti
  const oltre = p.soglia !== undefined && totale > p.soglia
  const pi = oltre ? p.inputOltre ?? p.input : p.input
  const po = oltre ? p.outputOltre ?? p.output : p.output
  return (nuovi * pi + scritti * pi * 1.25 + letti * pi * 0.1 + (u.output_tokens ?? 0) * po) / 1e6
}

// ---------- Utilità ----------
const ORIGINI = new Set(['https://dversari.github.io', 'http://127.0.0.1:5173', 'http://localhost:5173'])
function cors(req: Request): Record<string, string> {
  const o = req.headers.get('origin') ?? ''
  return {
    'Access-Control-Allow-Origin': ORIGINI.has(o) ? o : 'https://dversari.github.io',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}
class Errore extends Error {
  constructor(public status: number, msg: string) { super(msg) }
}
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const meseCorrente = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' }).slice(0, 7)
const LIMITE = Number(Deno.env.get('AI_BUDGET_MENSILE_USD') ?? 20)

function pinValido(pin: unknown): boolean {
  const atteso = Deno.env.get('EMERGENZE_PIN') ?? ''
  if (!atteso || typeof pin !== 'string') return false
  const a = new TextEncoder().encode(pin), b = new TextEncoder().encode(atteso)
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0)
  return diff === 0
}

async function registra(riga: { fonte?: string; domanda?: string; modello?: string; usd?: number; esito: string }) {
  const { error } = await admin.from('emergenze_domande').insert(riga)
  if (error) console.error('emergenze_domande', error.message)
}
async function registraSpesa(nome: string, usd: number, u: Uso) {
  const i = (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0)
  const { error } = await admin.rpc('registra_spesa_ai', { p_mese: meseCorrente(), p_modello: nome, p_usd: usd, p_in: i, p_out: u.output_tokens ?? 0 })
  if (error) console.error('registra_spesa_ai', error.message)
}

async function controlli() {
  const da = new Date(Date.now() - 3600_000).toISOString()
  const { count: errati } = await admin.from('emergenze_domande').select('id', { count: 'exact', head: true })
    .eq('esito', 'pin errato').gte('creata_il', da)
  if ((errati ?? 0) >= 10) throw new Errore(429, 'Troppi PIN errati: riprova tra un’ora')
}

async function controlliSpesa() {
  const oggi = new Date(Date.now() - 24 * 3600_000).toISOString()
  const { count } = await admin.from('emergenze_domande').select('id', { count: 'exact', head: true })
    .eq('esito', 'ok').gte('creata_il', oggi)
  if ((count ?? 0) >= DOMANDE_AL_GIORNO) throw new Errore(429, `Limite di ${DOMANDE_AL_GIORNO} domande nelle 24 ore raggiunto`)
  const { data, error } = await admin.from('ai_spesa').select('usd').eq('mese', meseCorrente())
  if (error) throw new Errore(500, error.message)
  const speso = (data ?? []).reduce((a, r) => a + Number(r.usd), 0)
  if (speso >= LIMITE) throw new Errore(402, `Tetto di spesa AI del mese raggiunto (${speso.toFixed(2)} $ su ${LIMITE} $)`)
}

// ---------- Claude ----------
const TRANSITORI = new Set([408, 409, 429, 500, 502, 503, 504, 529])
async function claude(corpo: Record<string, unknown>) {
  const chiave = Deno.env.get('ANTHROPIC_API_KEY')
  if (!chiave) throw new Errore(503, 'ANTHROPIC_API_KEY non configurata')
  const tentativi: string[] = []
  for (const nome of ORDINE) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': chiave, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ ...corpo, model: MODELLI[nome].id }),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok) {
      const usd = costo(nome, j.usage ?? {})
      await registraSpesa(nome, usd, j.usage ?? {})
      return { j, nome, usd }
    }
    tentativi.push(`${nome}: ${j?.error?.message ?? res.status}`)
    if (!TRANSITORI.has(res.status)) break
  }
  throw new Errore(502, 'Claude non ha risposto: ' + tentativi.join(' | '))
}

// ---------- Caricamento del testo completo ----------
let tokenDropbox: { valore: string; scade: number } | null = null
async function accessoDropbox(): Promise<string | null> {
  const appKey = Deno.env.get('DROPBOX_APP_KEY'), refresh = Deno.env.get('DROPBOX_REFRESH_TOKEN')
  if (!appKey || !refresh) return null
  if (tokenDropbox && tokenDropbox.scade > Date.now() + 60_000) return tokenDropbox.valore
  const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST', body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: appKey }),
  })
  const j = await res.json()
  if (!res.ok) return null
  tokenDropbox = { valore: j.access_token, scade: Date.now() + j.expires_in * 1000 }
  return tokenDropbox.valore
}

async function pdfDaDropbox(fonte: string): Promise<Uint8Array | null> {
  const token = await accessoDropbox()
  if (!token) return null
  const res = await fetch('https://content.dropboxapi.com/2/files/download', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Dropbox-API-Arg': JSON.stringify({ path: `${CARTELLA_DROPBOX}/${fonte}.pdf` }) },
  })
  if (!res.ok) { await res.body?.cancel(); return null }
  return new Uint8Array(await res.arrayBuffer())
}

async function testoDaPdf(dati: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(dati)
  const { text } = await extractText(pdf, { mergePages: true })
  return (Array.isArray(text) ? text.join('\n') : text).replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

async function testoDaWeb(url: string) {
  const { j, nome, usd } = await claude({
    max_tokens: 256,
    tools: [{ type: 'web_fetch_20250910', name: 'web_fetch', max_uses: 1, allowed_domains: [new URL(url).hostname] }],
    tool_choice: { type: 'tool', name: 'web_fetch' },
    messages: [{ role: 'user', content: `Recupera con web_fetch il testo completo di questa pagina: ${url}\nPoi rispondi solo "OK".` }],
  })
  for (const b of j.content ?? []) {
    if (b.type === 'web_fetch_tool_result') {
      const c = b.content
      if (c?.type === 'web_fetch_tool_result_error') throw new Errore(502, 'La rivista non ha dato il testo: ' + c.error_code)
      const src = c?.content?.source
      if (src?.type === 'text' && src.data) return { testo: String(src.data), nome, usd }
      if (src?.type === 'base64' && src.media_type === 'application/pdf')
        return { testo: await testoDaPdf(Uint8Array.from(atob(src.data), (ch) => ch.charCodeAt(0))), nome, usd }
    }
  }
  const tipi = (j.content ?? []).map((b: { type: string }) => b.type).join(', ')
  throw new Errore(502, `La pagina della rivista non è stata letta (risposta: ${tipi || 'vuota'}, stop: ${j.stop_reason})`)
}

/** Le pagine della rivista contengono la bibliografia con i link «Google Scholar, Crossref…»: si toglie, dimezza i token. */
function pulisci(t: string): string {
  const i = t.indexOf('References 1 ')
  return (i > 0 ? t.slice(0, i) : t).replace(/ (Google Scholar|Crossref|Search ADS|PubMed|WorldCat)/g, '')
}

async function caricaTesto(fonte: string, forza = false): Promise<{ testo: string; origine: string }> {
  if (!forza) {
    const { data } = await admin.from('emergenze_testi').select('testo, origine').eq('fonte', fonte).maybeSingle()
    if (data) return data
  }
  const f = FONTI[fonte]
  let testo = '', origine = ''
  const daDropbox = await pdfDaDropbox(fonte)
  if (daDropbox) { testo = await testoDaPdf(daDropbox); origine = 'dropbox' }
  else if (f.pdf) {
    const res = await fetch(f.pdf, { headers: { 'User-Agent': 'Mozilla/5.0 (Emergenze personal app)' } })
    if (!res.ok) throw new Errore(502, `PDF non scaricabile (HTTP ${res.status})`)
    testo = await testoDaPdf(new Uint8Array(await res.arrayBuffer())); origine = 'pdf'
  } else if (f.web) {
    testo = pulisci((await testoDaWeb(f.web)).testo); origine = 'web'
  } else {
    throw new Errore(404, `Testo completo non disponibile: metti il PDF in Dropbox come "${CARTELLA_DROPBOX}/${fonte}.pdf"`)
  }
  if (testo.length < 5000) throw new Errore(502, 'Testo troppo corto: probabilmente la fonte non è accessibile')
  testo = testo.slice(0, MAX_CARATTERI)
  await admin.from('emergenze_testi').upsert({ fonte, origine, caratteri: testo.length, testo, aggiornato_il: new Date().toISOString() })
  return { testo, origine }
}

// ---------- Domanda ----------
const SISTEMA =
  'Sei un consulente per un medico di pronto soccorso italiano. Rispondi in italiano, in modo breve e pratico, ' +
  'basandoti SOLO sul testo della linea guida fornito. Per ogni affermazione indica la sezione o la tabella e, ' +
  'se presenti, classe di raccomandazione e livello di evidenza. Riporta dosi e soglie esattamente come nel testo. ' +
  'Se la risposta non è nel testo, dillo chiaramente e non usare conoscenze esterne; puoi aggiungere una riga separata ' +
  'che inizia con "Fuori dal testo:" solo se serve a evitare un errore clinico. ' +
  'Testo semplice: niente markdown (asterischi, cancelletti, tabelle); per gli elenchi usa righe che iniziano con un trattino.'

interface Turno { role: 'user' | 'assistant'; content: string }
async function rispondi(fonte: string, domanda: string, storia: Turno[]) {
  const { testo, origine } = await caricaTesto(fonte)
  const messages: unknown[] = []
  const precedenti = storia.slice(-6).filter((t) => (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string')
  const primo = [
    { type: 'document', source: { type: 'text', media_type: 'text/plain', data: testo }, title: FONTI[fonte].titolo, cache_control: { type: 'ephemeral' } },
  ]
  if (precedenti.length && precedenti[0].role === 'user') {
    messages.push({ role: 'user', content: [...primo, { type: 'text', text: precedenti[0].content.slice(0, 2000) }] })
    for (const t of precedenti.slice(1)) messages.push({ role: t.role, content: t.content.slice(0, 4000) })
    if ((messages.at(-1) as Turno).role === 'user') messages.push({ role: 'assistant', content: '…' })
    messages.push({ role: 'user', content: domanda })
  } else {
    messages.push({ role: 'user', content: [...primo, { type: 'text', text: domanda }] })
  }
  const { j, nome, usd } = await claude({ max_tokens: 1500, system: SISTEMA, messages })
  const risposta = (j.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n').trim()
  return { risposta: risposta || 'Nessuna risposta.', modello: nome, usd, origine }
}

// ---------- Server ----------
Deno.serve(async (req) => {
  const h = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: h })
  const out = (status: number, corpo: unknown) =>
    new Response(JSON.stringify(corpo), { status, headers: { ...h, 'Content-Type': 'application/json' } })
  let fonte = '', domanda = ''
  try {
    if (req.method !== 'POST') throw new Errore(405, 'Metodo non consentito')
    const corpo = await req.json().catch(() => ({}))
    fonte = String(corpo.fonte ?? '')
    domanda = String(corpo.domanda ?? '').trim().slice(0, 2000)
    // Senza PIN: quali testi completi sono già caricati (nessun contenuto, nessun costo).
    if (corpo.azione === 'stato') {
      const { data } = await admin.from('emergenze_testi').select('fonte, origine, caratteri, aggiornato_il')
      return out(200, { fonti: data ?? [] })
    }
    // Senza PIN: primo caricamento di un testo (si fa una sola volta, poi resta in cache).
    if (corpo.azione === 'carica' && corpo.forza !== true) {
      if (!FONTI[fonte]) throw new Errore(400, 'Linea guida sconosciuta')
      await controlliSpesa()
      const { testo, origine } = await caricaTesto(fonte)
      await registra({ fonte, esito: 'caricato ' + origine })
      return out(200, { ok: true, origine, caratteri: testo.length })
    }

    await controlli()
    if (!pinValido(corpo.pin)) {
      await registra({ fonte, esito: 'pin errato' })
      throw new Errore(401, 'PIN errato')
    }
    if (corpo.azione === 'verifica') return out(200, { ok: true })
    if (!FONTI[fonte]) throw new Errore(400, 'Linea guida sconosciuta')

    if (corpo.azione === 'carica') {
      await controlliSpesa()
      const { testo, origine } = await caricaTesto(fonte, true)
      await registra({ fonte, esito: 'ricaricato ' + origine })
      return out(200, { ok: true, origine, caratteri: testo.length })
    }

    if (!domanda) throw new Errore(400, 'Domanda vuota')
    await controlliSpesa()
    const r = await rispondi(fonte, domanda, Array.isArray(corpo.storia) ? corpo.storia : [])
    await registra({ fonte, domanda, modello: r.modello, usd: r.usd, esito: 'ok' })
    return out(200, r)
  } catch (e) {
    const status = e instanceof Errore ? e.status : 500
    if (status !== 401) await registra({ fonte, domanda, esito: 'errore: ' + (e as Error).message.slice(0, 300) })
    return out(status, { error: (e as Error).message })
  }
})
