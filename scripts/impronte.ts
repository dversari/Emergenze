/*
 * Stampa l'impronta attuale delle card revisionate (o di quelle passate come argomento, es. linee-guida/colica-renale).
 * Uso: npm run impronte [-- chiave ...]. Copiare il valore in REVISIONI (src/lib/riconoscimenti.ts) quando si registra una revisione.
 */
import { LINEE_GUIDA } from '../src/lib/lineeGuida'
import { ALGORITMI } from '../src/lib/algoritmi'
import { PROCEDURE, SEDAZIONE } from '../src/lib/schede'
import { PERCORSI } from '../src/lib/percorsi'
import { DIMISSIONI } from '../src/lib/dimissioni'
import { ANAMNESI } from '../src/lib/anamnesi'
import { DIETE } from '../src/lib/diete'
import { CONDIZIONI, FARMACI } from '../src/lib/antibiotici'
import { REVISIONI, impronta, statoRevisione } from '../src/lib/riconoscimenti'

const per: Record<string, (id: string) => unknown> = {
  'linee-guida': (id) => { const l = LINEE_GUIDA.find((x) => x.id === id); return l && { l, alg: ALGORITMI[id] ?? null } },
  procedure: (id) => PROCEDURE.find((x) => x.id === id),
  sedazione: (id) => SEDAZIONE.find((x) => x.id === id),
  percorsi: (id) => PERCORSI.find((x) => x.id === id),
  dimissione: (id) => DIMISSIONI.find((x) => x.id === id),
  anamnesi: (id) => ANAMNESI.find((x) => x.id === id),
  dieta: (id) => DIETE.find((x) => x.id === id),
  antibiotici: (id) => CONDIZIONI.find((x) => x.id === id),
  farmaci: (id) => FARMACI.find((x) => x.id === id),
}

const chiavi = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(REVISIONI)
for (const k of chiavi) {
  const [pagina, id] = k.split('/')
  const c = per[pagina]?.(id)
  if (!c) { console.log(`${k}: card non trovata`); continue }
  const st = statoRevisione(k, c)
  console.log(`${k}: ${impronta(c)}${st ? `  (${st.stato})` : ''}`)
}
