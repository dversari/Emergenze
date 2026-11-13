/*
 * Riconoscimenti delle card: revisione tra pari (cerchio con le sigle) e impianto aziendale (scudo ASL).
 *
 * Chiave di una card: «<pagina>/<id>», es. 'linee-guida/colica-renale', 'percorsi/ebola', 'procedure/nbcr-vestizione',
 * 'dimissione/scabbia', 'anamnesi/trauma-cranico', 'antibiotici/pielonefrite', 'modulo/trasfusione'.
 *
 * REVISIONE: ogni voce porta l'impronta del contenuto revisionato. Se la card viene modificata dopo,
 * l'impronta non coincide più e il simbolo diventa grigio («modificata dopo la revisione»).
 * Per registrare una revisione: aggiungere la voce qui sotto e calcolare l'impronta con `npm run impronte`.
 *
 * AZIENDALE: deriva da `usatoIn` dei DOCUMENTI_ASL più le voci di AZIENDALI qui sotto
 * (id di un documento in Docs ASL, oppure riferimento libero se il documento non è ancora caricato).
 */
import { DOCUMENTI_ASL, type DocumentoAsl } from './documentiAsl'

/** Sigle dei colleghi (come nei turni). */
export const REVISORI: Record<string, string> = {
  VR: 'Daniele Versari', BN: 'Banchelli', DC: 'De Curtis', CG: 'Caruso', GR: 'Grassi', LO: 'Longo', CL: 'Casalini',
  MT: 'Matteuzzi', EB: 'Bosco', PT: 'Pollastri', MN: 'Monda', AB: 'Ambrosio', CH: 'Chiellini', GA: 'Galarducci',
  GE: 'Geri', MI: 'Meoni', AP: 'Poggi',
}

export interface Revisione {
  sigla: keyof typeof REVISORI | string
  /** AAAA-MM-GG */
  data: string
  /** 'ok' = revisione conclusa; 'aperta' = commenti ancora da integrare */
  esito: 'ok' | 'aperta'
  nota?: string
  /** impronta del contenuto al momento della revisione (npm run impronte) */
  impronta?: string
}

export const REVISIONI: Record<string, Revisione[]> = {
  'linee-guida/colica-renale': [
    { sigla: 'VR', data: '2026-11-13', esito: 'ok', nota: 'Tolto il metamizolo; dosi del cortisone (prednisone 25 mg/die per 10 giorni).', impronta: '273acd8f' },
  ],
}

type RifLibero = { titolo: string; codice?: string; data?: string; nota?: string }
type Rif = string | RifLibero

/** Card di impianto aziendale non collegate (o non solo) tramite `usatoIn` dei documenti. */
export const AZIENDALI: Record<string, Rif[]> = {
  'linee-guida/trauma-cranico': [{ titolo: 'PDTA aziendale del trauma cranico lieve (PS Prato)', nota: 'Documento non ancora in Docs ASL.' }],
  'dimissione/trauma-cranico': [{ titolo: 'PDTA aziendale del trauma cranico lieve: osservazione domiciliare', nota: 'Documento non ancora in Docs ASL.' }],
  'dimissione/trauma-cranico-tao': [{ titolo: 'PDTA aziendale del trauma cranico lieve: paziente in terapia anticoagulante', nota: 'Documento non ancora in Docs ASL.' }],
  'anamnesi/trauma-cranico': [{ titolo: 'PDTA aziendale del trauma cranico lieve', nota: 'Documento non ancora in Docs ASL.' }],
  'percorsi/isolamento': ['colonizzato', 'tamponi-respiratori'],
  'dimissione/scabbia': ['scabbia', 'scabbia-all3'],
  'procedure/nbcr-vestizione': ['ebola-dpi'],
  'procedure/nbcr-svestizione': ['ebola-dpi'],
  'modulo/trasfusione': [{ titolo: 'Richiesta di sangue e emocomponenti', codice: 'SOC Immunoematologia Prato-Pistoia', data: '2019' }],
  'modulo/trasferimento': [{ titolo: 'Trasferimento di emergenza: Allegato 1', codice: 'PA.A118.01' }],
  'modulo/notifica': ['notifica-malattie-infettive', 'indirizzi-segnalazione'],
  'modulo/dimissione-contro-parere': ['io-dro-72-all1', 'io-dro-72'],
}

/** '/percorsi?apri=ebola' → 'percorsi/ebola'; '/linee-guida/x' → 'linee-guida/x'. */
export function chiaveDaRotta(to: string): string {
  const [percorso, query = ''] = to.replace(/^\//, '').split('?')
  const apri = new URLSearchParams(query).get('apri')
  return apri ? `${percorso}/${apri}` : percorso
}

export type DocRif = { doc?: DocumentoAsl } & RifLibero

/** Documenti aziendali alla base di una card (vuoto se non è di impianto aziendale). */
export function aziendale(chiave: string): DocRif[] {
  const out: DocRif[] = []
  const visti = new Set<string>()
  const aggiungiDoc = (d: DocumentoAsl) => {
    if (visti.has(d.id)) return
    visti.add(d.id)
    out.push({ doc: d, titolo: d.titolo, codice: d.codice, data: d.data })
  }
  for (const d of DOCUMENTI_ASL) if (d.usatoIn?.some((u) => chiaveDaRotta(u.to) === chiave)) aggiungiDoc(d)
  for (const r of AZIENDALI[chiave] ?? []) {
    if (typeof r === 'string') { const d = DOCUMENTI_ASL.find((x) => x.id === r); if (d) aggiungiDoc(d) }
    else out.push(r)
  }
  return out
}

/** Impronta FNV-1a (8 caratteri esadecimali) del contenuto di una card. */
export function impronta(contenuto: unknown): string {
  const s = JSON.stringify(contenuto) ?? ''
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

export type StatoRevisione = 'revisionata' | 'aperta' | 'superata'

/** Stato complessivo: «superata» se il contenuto è cambiato dopo l'ultima revisione conclusa. */
export function statoRevisione(chiave: string, contenuto?: unknown): { stato: StatoRevisione; voci: Revisione[]; attuale: string } | null {
  const voci = REVISIONI[chiave]
  if (!voci?.length) return null
  const attuale = contenuto === undefined ? '' : impronta(contenuto)
  const concluse = voci.filter((v) => v.esito === 'ok')
  const ultima = concluse.sort((a, b) => b.data.localeCompare(a.data))[0]
  const superata = !!ultima && contenuto !== undefined && !!ultima.impronta && ultima.impronta !== attuale
  const stato: StatoRevisione = voci.some((v) => v.esito === 'aperta') ? 'aperta' : superata ? 'superata' : 'revisionata'
  return { stato, voci, attuale }
}

export type Filtro = 'tutte' | 'revisionate' | 'aziendali'
export const passaFiltro = (f: Filtro, chiave: string, contenuto?: unknown) =>
  f === 'tutte' ? true : f === 'aziendali' ? aziendale(chiave).length > 0 : statoRevisione(chiave, contenuto)?.stato === 'revisionata'
