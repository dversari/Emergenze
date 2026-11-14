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
    id: 'peimaf', titolo: 'Piano di emergenza intraospedaliera per massiccio afflusso di feriti (PEIMAF) nell’Ospedale S. Stefano di Prato', codice: 'PS.DRO.62 rev. 1', ente: 'ASL Toscana Centro · SOC DSPO Santo Stefano', data: '09/08/2023', area: 'Maxiemergenza',
    file: 'docs/asl/PS.DRO.62-PEIMAF-Santo-Stefano.pdf',
    descr: 'Attivazione e fasi, catena di comando (DSS-H), capacità della prima ora (14 pazienti), riorganizzazione del DEA, accessi convenzionali e NBCRe, aree speciali, reclutamento del personale. Revisione prevista entro 3 anni (08/2026). L’Allegato 1 (cellulari dell’Unità di crisi zonale) non è pubblicato: i numeri sono in Rubrica.',
    usatoIn: [
      { etichetta: 'PEIMAF: allarme e comando', to: '/percorsi?apri=peimaf' },
      { etichetta: 'PEIMAF: assetto del DEA', to: '/percorsi?apri=peimaf-dea' },
      { etichetta: 'PEIMAF NBCRe', to: '/percorsi?apri=peimaf-nbcr' },
    ],
  },
  {
    id: 'peimaf-all2', titolo: 'PS.DRO.62 · Allegato 2: tape SISmax (schede di azione per ruolo)', ente: 'ASL Toscana Centro', data: '09/08/2023', area: 'Maxiemergenza',
    file: 'docs/asl/PS.DRO.62-allegato-2-tape-SISmax.pdf', descr: 'DSS-H, DCA, DD, RI, RT, RST in assetto convenzionale e NBCRe; vestizione e svestizione NBCRe; piramide della comunicazione.',
    usatoIn: [{ etichetta: 'PEIMAF: ruoli', to: '/percorsi?apri=peimaf-ruoli' }],
  },
  {
    id: 'peimaf-all3', titolo: 'PS.DRO.62 · Allegato 3: piantine di accesso al DEA (convenzionale e NBCRe)', ente: 'ASL Toscana Centro', data: '09/08/2023', area: 'Maxiemergenza',
    file: 'docs/asl/PS.DRO.62-allegato-3-piantine.pdf', descr: 'Riorganizzazione delle aree del PS e percorsi di barellati e deambulanti, maxiemergenza e ordinari.',
    usatoIn: [{ etichetta: 'PEIMAF: assetto del DEA', to: '/percorsi?apri=peimaf-dea' }, { etichetta: 'PEIMAF NBCRe', to: '/percorsi?apri=peimaf-nbcr' }],
  },
  {
    id: 'peimaf-all4', titolo: 'PS.DRO.62 · Allegato 4: cartellonistica e percorsi maxiemergenza', ente: 'ASL Toscana Centro', data: '09/08/2023', area: 'Maxiemergenza',
    file: 'docs/asl/PS.DRO.62-allegato-4-cartellonistica.pdf', descr: 'Cartelli per maxiemergenza e ordinari, percorsi delle ambulanze e posizionamento dei cartelli (convenzionale e NBCRe).',
    usatoIn: [{ etichetta: 'PEIMAF: assetto del DEA', to: '/percorsi?apri=peimaf-dea' }, { etichetta: 'PEIMAF NBCRe', to: '/percorsi?apri=peimaf-nbcr' }],
  },
  {
    id: 'doc-ds-03', titolo: 'Piano aziendale per la gestione degli eventi di maxiemergenza', codice: 'DOC.DS.03 rev. 3', ente: 'ASL Toscana Centro · SOC Maxiemergenze ed eventi a carattere straordinario', data: '09/02/2022', area: 'Maxiemergenza',
    file: 'docs/asl/DOC.DS.03-piano-aziendale-maxiemergenza.pdf', descr: 'Piano aziendale: Unità di crisi, Centrali 118, triage START/FAST, PMA, eventi NBCRe e decontaminazione, PEIMAF (ruoli e pettorine), PEVAC, grandi eventi, fragilità.',
    usatoIn: [{ etichetta: 'PEIMAF: allarme e comando', to: '/percorsi?apri=peimaf' }, { etichetta: 'PEIMAF: ruoli', to: '/percorsi?apri=peimaf-ruoli' }, { etichetta: 'Triage di massa', to: '/percorsi?apri=maxiemergenza' }],
  },
  {
    id: 'doc-ds-03-all1', titolo: 'DOC.DS.03 · Allegato 1: modulo raccolta dati METHANE', codice: 'TPX 5956', ente: 'SOC Coordinamento maxiemergenze', data: '14/02/2022', area: 'Maxiemergenza',
    file: 'docs/asl/DOC.DS.03-allegato-1-modulo-METHANE.pdf', descr: 'PDF compilabile: ente chiamante, localizzazione, tipo di evento, pericoli, accessi, livello (1: 10–30 feriti; 2: 30–100; 3: oltre 100), convenzionale o NBCR.',
    usatoIn: [{ etichetta: 'PEIMAF: allarme e comando', to: '/percorsi?apri=peimaf' }],
  },
  {
    id: 'doc-ds-03-all2', titolo: 'DOC.DS.03 · Allegato 2: scheda sanitaria PMA (kit triage regionale)', ente: 'Regione Toscana · Sistema integrato sanità in maxiemergenza', data: '09/02/2022', area: 'Maxiemergenza',
    file: 'docs/asl/DOC.DS.03-allegato-2-scheda-triage.pdf', descr: 'Scheda con triage START (territorio e PMA), ABCDE, monitoraggio, triage FAST, destinazione; cartellini T1–T4.',
    usatoIn: [{ etichetta: 'Triage di massa', to: '/percorsi?apri=maxiemergenza' }],
  },
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
    id: 'indirizzi-segnalazione', titolo: 'Indirizzi per la segnalazione delle malattie infettive (Toscana)', ente: 'Regione Toscana', data: '7/1/2026', area: 'Sanità pubblica',
    file: 'docs/asl/indirizzi-segnalazione-malattie-infettive-2026.pdf',
    descr: 'Email delle UF Igiene pubblica per zona (Pratese: malattieinfettiveigiene.prato@; Pistoiese e Val di Nievole: segnalazioni.malattieinfettive.pistoia@).',
    usatoIn: [{ etichetta: 'Percorsi: notifica', to: '/percorsi?apri=notifica-infettive' }],
  },
  {
    id: 'decreto-16355', titolo: 'Decreto dirigenziale RT n. 16355/2025: approvazione della scheda unica', codice: 'DD 16355 del 24/7/2025', ente: 'Regione Toscana', data: '24/7/2025', area: 'Sanità pubblica',
    file: 'docs/asl/decreto-rt-16355-2025-scheda-unica.pdf',
    descr: 'Atto regionale che approva la scheda unica di segnalazione delle malattie infettive.',
    usatoIn: [{ etichetta: 'Percorsi: notifica', to: '/percorsi?apri=notifica-infettive' }],
  },
  {
    id: 'arbovirosi-2026', titolo: 'Circolare arbovirosi, stagione vettoriale 2026', codice: 'Min. Salute prot. 1510 del 28/4/2026', ente: 'Ministero della Salute', data: '28/4/2026', area: 'Sanità pubblica',
    file: 'docs/asl/circolare-arbovirosi-2026.pdf',
    descr: 'Prevenzione, sorveglianza e risposta ad arbovirosi (Dengue, Chikungunya, Zika, West Nile…); inoltrata dal DEU il 2/9/2026 per i casi autoctoni di Dengue in Toscana.',
    usatoIn: [{ etichetta: 'PDTA arbovirosi', to: '/linee-guida/arbovirosi' }],
  },
  {
    id: 'caso-dengue', titolo: 'Definizione di caso di Dengue', ente: 'Piano nazionale arbovirosi', data: '2026', area: 'Sanità pubblica',
    file: 'docs/asl/definizione-caso-dengue.pdf', descr: 'Criteri clinici, di laboratorio ed epidemiologici; caso possibile, probabile, confermato.',
    usatoIn: [{ etichetta: 'PDTA arbovirosi', to: '/linee-guida/arbovirosi' }],
  },
  {
    id: 'caso-chikungunya', titolo: 'Definizione di caso di Chikungunya', ente: 'Piano nazionale arbovirosi', data: '2025', area: 'Sanità pubblica',
    file: 'docs/asl/definizione-caso-chikungunya.pdf', descr: 'Inviata dalla Regione il 4/11/2025 per i casi di rientro da Cuba (Chikungunya, Dengue, Oropouche).',
    usatoIn: [{ etichetta: 'PDTA arbovirosi', to: '/linee-guida/arbovirosi' }],
  },
  {
    id: 'ebola-istruzione', titolo: 'Piano di gestione e controllo dell’infezione da virus Ebola negli ospedali ASL TC', codice: 'Istruzione di lavoro', ente: 'ASL Toscana Centro · Direzione Rete Ospedaliera', data: '23/6/2026', area: 'Biocontenimento',
    file: 'docs/asl/istruzione-lavoro-ebola.pdf', descr: 'Definizioni di caso, stratificazione del rischio, gestione in PS del paziente in autopresentazione o dal 118, trasferimento a Careggi/Meyer. Versione finale inviata prima del format aziendale.',
    usatoIn: [{ etichetta: 'Percorsi: Ebola', to: '/percorsi?apri=ebola' }],
  },
  {
    id: 'ebola-dpi', titolo: 'DPI NBCR per agenti biologici di classe 4: vestizione e svestizione', ente: 'ASL Toscana Centro', data: '2026', area: 'Biocontenimento',
    file: 'docs/asl/ebola-dpi-vestizione-svestizione.pdf', descr: 'Elenco dei DPI e sequenza di vestizione/svestizione per Ebola in PS e NBCR.',
    usatoIn: [{ etichetta: 'Percorsi: Ebola', to: '/percorsi?apri=ebola' }],
  },
  {
    id: 'ebola-comunicazione', titolo: 'Avviso relativo a malattia da virus Ebola', ente: 'Direzione Sanitaria ASL TC', data: '1/6/2026', area: 'Biocontenimento',
    file: 'docs/asl/comunicazione-ebola-giugno-2026.pdf', descr: 'Triage dei rientri da RDC/Uganda con sintomi; strutture di riferimento di Area Vasta.',
    usatoIn: [{ etichetta: 'Percorsi: Ebola', to: '/percorsi?apri=ebola' }],
  },
  {
    id: 'hantavirus-3680', titolo: 'Infezione da virus Andes (hantavirus): casi sospetti, probabili e confermati', codice: 'Circolare Min. Salute n. 3680 del 15/5/2026', ente: 'Ministero della Salute', data: '15/5/2026', area: 'Biocontenimento',
    file: 'docs/asl/circolare-3680-hantavirus-andes.pdf', descr: 'Gestione dei casi legati al focolaio sulla nave MV Hondius (maggio 2026).',
  },
  {
    id: 'hantavirus-regioni', titolo: 'Circolare hantavirus alle Regioni', codice: 'Min. Salute prot. 3482 dell’11/5/2026', ente: 'Ministero della Salute', data: '11/5/2026', area: 'Biocontenimento',
    file: 'docs/asl/circolare-hantavirus-regioni.pdf', descr: 'Indicazioni iniziali; richiamata anche dall’istruzione Ebola per il trasporto dei campioni.',
  },
  {
    id: 'hantavirus-rt', titolo: 'Nota della Regione Toscana sull’hantavirus', ente: 'Regione Toscana', data: '12/5/2026', area: 'Biocontenimento',
    file: 'docs/asl/circolare-trasmissione-hantavirus.pdf', descr: 'Trasmissione della circolare ministeriale alle Aziende.',
  },
  {
    id: 'campioni-alto-rischio', titolo: 'Invio di campioni per malattie infettive altamente contagiose', ente: 'Ministero della Salute (allegato 1)', data: '2026', area: 'Biocontenimento',
    file: 'docs/asl/hantavirus-procedure-invio-campioni.pdf', descr: 'Tipologia dei campioni, triplo involucro, trasporto e consegna al laboratorio di riferimento.',
  },
  {
    id: 'pdta-trauma-cranico', titolo: 'Protocollo aziendale per la gestione del trauma cranico lieve', codice: 'PDTA', ente: 'ASL Toscana Centro · Dipartimento Emergenza Urgenza', data: '25/5/2026', area: 'PDTA clinici',
    file: 'docs/asl/PDTA-trauma-cranico-lieve.pdf', descr: 'Definizione e classificazione (GCS 14–15), criteri e tempi della TC (entro 1 h / entro 8 h), anticoagulati e antiaggregati, osservazione e dimissione. Inviato dal DEU il 25/5/2026.',
    usatoIn: [
      { etichetta: 'PDTA trauma cranico', to: '/linee-guida/trauma-cranico' },
      { etichetta: 'Cartella: trauma cranico', to: '/anamnesi?apri=trauma-cranico' },
      { etichetta: 'Dimissione trauma cranico', to: '/dimissioni?apri=trauma-cranico' },
      { etichetta: 'Dimissione in anticoagulante', to: '/dimissioni?apri=trauma-cranico-tao' },
    ],
  },
  {
    id: 'pdta-trauma-cranico-schema-tc', titolo: 'PDTA trauma cranico · Schema 3: indicazione alla TC cranio nel trauma cranico lieve', ente: 'ASL Toscana Centro · Dipartimento Emergenza Urgenza', data: '25/5/2026', area: 'PDTA clinici',
    file: 'docs/asl/PDTA-trauma-cranico-schema-TC.pdf', descr: 'Flow chart della gestione del trauma cranico lieve (GCS 14–15) e dei criteri per la TC.',
    usatoIn: [
      { etichetta: 'PDTA trauma cranico', to: '/linee-guida/trauma-cranico' },
      { etichetta: 'Cartella: trauma cranico', to: '/anamnesi?apri=trauma-cranico' },
    ],
  },
  {
    id: 'pdta-trauma-cranico-osservazione', titolo: 'PDTA trauma cranico · Protocollo di osservazione domiciliare', ente: 'ASL Toscana Centro · Dipartimento Emergenza Urgenza', data: '25/5/2026', area: 'PDTA clinici',
    file: 'docs/asl/PDTA-trauma-cranico-osservazione-domiciliare.pdf', descr: 'Foglio informativo per i pazienti dimessi dopo trauma cranico e per chi li assiste: sintomi attesi e segni per tornare in PS.',
    usatoIn: [
      { etichetta: 'PDTA trauma cranico', to: '/linee-guida/trauma-cranico' },
      { etichetta: 'Dimissione trauma cranico', to: '/dimissioni?apri=trauma-cranico' },
      { etichetta: 'Dimissione in anticoagulante', to: '/dimissioni?apri=trauma-cranico-tao' },
    ],
  },
  {
    id: 'scabbia', titolo: 'Gestione del paziente con scabbia sospetta o conclamata in ambiente ospedaliero', codice: 'PA.STDS.07 rev. 0', ente: 'ASL Toscana Centro · SOSD Infezioni correlate all’assistenza', data: '18/12/2024', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/PA.STDS.07-scabbia.pdf', descr: 'Procedura aziendale: definizioni, isolamento, terapia, notifica entro 48 h. Allegati: check list di triage, misure in ospedale e in comunità.',
    usatoIn: [{ etichetta: 'Percorsi: scabbia', to: '/percorsi?apri=scabbia' }],
  },
  {
    id: 'scabbia-all1', titolo: 'PA.STDS.07 · Allegato 1: criteri di isolamento in PS (check list triage)', ente: 'ASL Toscana Centro', data: '18/12/2024', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/PA.STDS.07-allegato-1.pdf', descr: 'Flow chart di triage: isolamento se ≥ 2 criteri.', usatoIn: [{ etichetta: 'Percorsi: scabbia', to: '/percorsi?apri=scabbia' }],
  },
  {
    id: 'scabbia-all2', titolo: 'PA.STDS.07 · Allegato 2: misure di controllo in ospedale', ente: 'ASL Toscana Centro', data: '18/12/2024', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/PA.STDS.07-allegato-2.pdf', descr: 'DPI, isolamento, biancheria, effetti letterecci, ambiente.', usatoIn: [{ etichetta: 'Percorsi: scabbia', to: '/percorsi?apri=scabbia' }],
  },
  {
    id: 'scabbia-all3', titolo: 'PA.STDS.07 · Allegato 3: misure di controllo in comunità', ente: 'ASL Toscana Centro', data: '18/12/2024', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/PA.STDS.07-allegato-3.pdf', descr: 'Indicazioni per il domicilio (da consegnare alla dimissione).', usatoIn: [{ etichetta: 'Percorsi: scabbia', to: '/percorsi?apri=scabbia' }],
  },
  {
    id: 'colonizzato', titolo: 'Gestione del paziente colonizzato/infetto in ambiente ospedaliero', codice: 'PA.DRO.01', ente: 'ASL Toscana Centro · Rete Ospedaliera', data: '2025', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/PA.DRO.01-paziente-colonizzato.pdf', descr: 'Precauzioni standard, da contatto, droplet e aerea per germi multiresistenti e infezioni trasmissibili.',
  },
  {
    id: 'tamponi-respiratori', titolo: 'Integrazioni sui tamponi per malattie respiratorie virali', ente: 'Direzione Rete Ospedaliera ASL TC', data: '3/2/2025', area: 'Infezioni correlate all’assistenza',
    file: 'docs/asl/nota-tamponi-virus-respiratori-2025.pdf', descr: 'Tampone per virus respiratori se sospetto fondato; sempre, anche senza sintomi, nei ricoveri oncologici/oncoematologici.',
  },
  {
    id: 'io-dro-72', titolo: 'Allontanamento e dimissione dei pazienti contro il parere sanitario', codice: 'IO.DRO.72 rev. 2', ente: 'ASL Toscana Centro · Rete Ospedaliera', data: '25/3/2025', area: 'Medico-legale',
    file: 'docs/asl/IO.DRO.72-allontanamento-dimissione-contro-parere.pdf', descr: 'Pazienti a rischio, fasi di preallarme, allarme, ricerca e chiusura; dimissione contro il parere medico.',
    usatoIn: [{ etichetta: 'Percorsi: rifiuto cure', to: '/percorsi?apri=rifiuto-cure' }],
  },
  {
    id: 'io-dro-72-all1', titolo: 'IO.DRO.72 · Allegato 1: modulo di dimissione contro il parere medico', ente: 'ASL Toscana Centro', data: '25/3/2025', area: 'Medico-legale',
    file: 'docs/asl/IO.DRO.72-allegato-1-modulo-dimissione-contro-parere.pdf', descr: 'Modulo da far firmare al paziente.',
    usatoIn: [{ etichetta: 'Percorsi: rifiuto cure', to: '/percorsi?apri=rifiuto-cure' }],
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
