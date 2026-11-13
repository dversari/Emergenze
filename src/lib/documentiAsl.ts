/*
 * Documenti aziendali originali (ASL Toscana Centro / Regione Toscana) pubblicati in public/docs.
 * Ogni voce: file, struttura che lo ha emesso, data, e le schede dell'app che lo usano.
 */
export interface DocumentoAsl {
  id: string
  titolo: string
  codice?: string
  ente: string
  data: string
  area: string
  file: string
  descr: string
  usatoIn?: { etichetta: string; to: string }[]
}

export const DOCUMENTI_ASL: DocumentoAsl[] = [
  {
    id: 'notifica-malattie-infettive',
    titolo: 'Scheda unica di segnalazione delle malattie infettive',
    codice: 'DM 7/3/2022 · prot. AOOGRT 0623609',
    ente: 'Regione Toscana · DEU ASL Toscana Centro',
    data: '15/1/2026',
    area: 'Sanità pubblica',
    file: 'docs/asl/scheda-notifica-malattie-infettive-2026.pdf',
    descr: 'PDF editabile con i tempi di segnalazione (12 h / 48 h / sorveglianza speciale) e gli indirizzi email di invio dell’Igiene pubblica di Prato.',
    usatoIn: [{ etichetta: 'Percorsi: notifica', to: '/percorsi?apri=notifica-infettive' }],
  },
  {
    id: 'regolamento-formazione',
    titolo: 'Regolamento della formazione',
    codice: 'DOC.STDA.02',
    ente: 'ASL Toscana Centro',
    data: 'rev. 0, 2026',
    area: 'Formazione',
    file: 'docs/regolamento-formazione-2026.pdf',
    descr: 'Regole aziendali per la formazione e l’aggiornamento del personale.',
    usatoIn: [{ etichetta: 'Formazione', to: '/formazione/regole' }],
  },
  {
    id: 'faq-formazione',
    titolo: 'FAQ sul regolamento della formazione',
    ente: 'ASL Toscana Centro',
    data: '24/8/2026',
    area: 'Formazione',
    file: 'docs/faq-regolamento-formazione-2026.pdf',
    descr: 'Domande frequenti sul regolamento della formazione.',
    usatoIn: [{ etichetta: 'Formazione', to: '/formazione/regole' }],
  },
]
