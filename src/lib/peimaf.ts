/*
 * PEIMAF del Santo Stefano: ruoli della catena di comando (tape SISmax, Allegato 2 al PS.DRO.62 rev. 1)
 * con chi li ricopre e colore della pettorina (DOC.DS.03 rev. 3, cap. 7), e triage di massa
 * della scheda sanitaria regionale (Allegato 2 al DOC.DS.03).
 */

export interface Ruolo {
  sigla: string
  nome: string
  radio: string
  /** colore del bordo del tape = colore della pettorina */
  colore: string
  pettorina: string
  chi: string
  compiti: string[]
  /** azioni da svolgere PRIMA di quelle convenzionali, in regime NBCRe */
  nbcre?: string[]
}

export const RUOLI: Ruolo[] = [
  {
    sigla: 'DSS-H', nome: 'Direttore dei soccorsi sanitari in ospedale', radio: 'Delta Hotel', colore: '#e30613', pettorina: 'rossa',
    chi: 'Medico referente clinico in turno; designato dal Direttore della Medicina d’urgenza (sostituti: vicedirettore → medico fuori turno → capoturno flussista o il più esperto di maxiemergenza).',
    compiti: [
      'Informa e attiva il Direttore e il Coordinatore infermieristico del PS/DEA.',
      'Attiva la linea di gestione prevista dal PEIMAF del PS.',
      'Nomina il Referente triage (RT), il Direttore delle attività clinico-assistenziali (DCA), il Direttore della diagnostica (DD), il Referente squadre trasporto (RST) e il Referente infermieristico (RI).',
      'Informa la SO di Anestesia e Rianimazione, sale operatorie comprese, dell’attivazione del PEIMAF.',
      'Assicura i contatti con l’Unità di crisi aziendale o zonale (se attivata).',
      'Si raccorda con l’Unità di crisi (Direttore DEU, Direttore Rete ospedaliera, Direttore Dipartimento infermieristico) per attivare professionisti di altre strutture, se previsto dal piano di presidio.',
      'Dichiara quanti pazienti, divisi per intensità di cure, il PS può accogliere in quel momento.',
      'Dichiara la piena operatività dell’assetto PEIMAF.',
      'Concerta con l’Unità di crisi il ricovero altrove dei pazienti che il presidio non può ricoverare.',
    ],
    nbcre: [
      'Attiva la linea di gestione NBCRe e si accerta che il personale indossi i DPI adatti alla sostanza contaminante e all’attività svolta.',
      'Fa creare cancelli agli ingressi del PS (con il servizio di sicurezza del presidio), separando l’utenza ordinaria da quella della maxiemergenza NBCRe.',
      'Fa configurare i corridoi di decontaminazione, dove previsti.',
      'Si accerta che la Centrale 118 invii le strutture per la decontaminazione, indicando le zone per il montaggio delle tensostrutture.',
      'Contaminazione radioattiva: chiede il supporto tecnico (all’inizio alla Centrale 118, per l’invio dei Vigili del fuoco) per monitorare la radioattività all’interno della struttura.',
    ],
  },
  {
    sigla: 'DCA', nome: 'Direttore delle attività clinico-assistenziali', radio: 'Delta Charlie', colore: '#00a651', pettorina: 'verde',
    chi: 'Medico del PS/DEA (referente in turno).',
    compiti: [
      'Nomina i referenti delle aree di trattamento ad alta, media e bassa intensità.',
      'Distribuisce il personale nelle aree secondo le necessità.',
      'Concorda con i referenti delle aree: i pazienti dimissibili subito (dimissione protetta), quelli ricoverabili velocemente, l’eventuale separazione del percorso ordinario da quello della maxiemergenza.',
      'Assicura la «noria» dei pazienti (triage → aree di trattamento → reparti) con squadre di trasporto dedicate.',
      'Concorda con il Bed manager di presidio l’assegnazione dei posti letto; comunica al DSS-H se i posti letto mancano.',
      'Monitora le scorte di sangue ed emoderivati.',
    ],
    nbcre: [
      'Nomina il Referente della decontaminazione.',
      'Assegna le squadre di decontaminazione insieme al Referente infermieristico.',
      'Contatta il Centro antiveleni per le informazioni sanitarie sul contaminante.',
      'Stabilisce e chiede al DSS-H la quantità di antidoti necessaria.',
      'Stabilisce con il DSS-H e il Servizio di prevenzione la categoria dei DPI da usare.',
    ],
  },
  {
    sigla: 'DD', nome: 'Direttore della diagnostica', radio: 'Delta Delta', colore: '#f2e600', pettorina: 'gialla',
    chi: 'Medico radiologo referente clinico in turno.',
    compiti: [
      'Blocca l’attività ordinaria.',
      'Attiva il personale reperibile e non in turno che serve (medici, infermieri, TSRM, OSS).',
      'Rende pienamente operativa la diagnostica (ecografia, radiologia tradizionale, TC).',
      'Comunica al DCA quali servizi di diagnostica sono stati attivati.',
      'Chiede al Referente infermieristico gli infermieri necessari ai servizi attivati.',
      'Chiede al Referente squadre trasporto il personale per un flusso continuo tra diagnostica e aree di trattamento.',
    ],
  },
  {
    sigla: 'RI', nome: 'Referente infermieristico', radio: 'Romeo India', colore: '#00aeef', pettorina: 'azzurra',
    chi: 'Infermiere referente in turno nel PS/DEA.',
    compiti: [
      'Concorda con il DCA il numero di infermieri e OSS necessari.',
      'Si assicura che il personale non in turno venga richiamato a cascata, anche tramite personale non sanitario.',
      'Assicura farmaci e materiali sanitari nelle aree di trattamento.',
      'Predispone e distribuisce il materiale aggiuntivo PEIMAF (sanitario e non).',
      'Individua il punto di incontro degli infermieri e degli OSS che arrivano al DEA.',
      'Concorda con il Referente triage lo spostamento di personale per potenziare il triage.',
    ],
    nbcre: [
      'Predispone e distribuisce i DPI per la vestizione del personale addetto alla decontaminazione.',
      'Allestisce la zona di vestizione e svestizione delle squadre DECO.',
    ],
  },
  {
    sigla: 'RT', nome: 'Referente triage', radio: 'Romeo Tango', colore: '#ec008c', pettorina: 'rosa (rosa/viola in NBCRe)',
    chi: 'Infermiere referente del triage in turno.',
    compiti: [
      'Allestisce le aree di triage: kit triage FAST, cancelleria, materiale per la valutazione sanitaria.',
      'Assegna gli infermieri ai punti di triage, d’accordo con il Referente infermieristico.',
      'Si coordina con la Centrale 118 sull’arrivo dei feriti per codice colore di priorità.',
      'Chiede al Referente squadre trasporto le squadre per un flusso continuo tra triage e aree di trattamento.',
    ],
    nbcre: [
      'Allestisce i corridoi di decontaminazione e si accerta che il personale indossi i DPI adeguati.',
      'Decide le priorità di decontaminazione separando chi cammina da chi non cammina.',
      'Predispone le postazioni di triage FAST all’uscita del corridoio di decontaminazione.',
      'Ispeziona le vittime all’uscita del corridoio: decontaminazione riuscita o nuovo passaggio in zona DECO.',
      'Organizza la decontaminazione del personale, inviandolo alla decontaminazione tecnica a fine turno in zona DECO.',
    ],
  },
  {
    sigla: 'RST', nome: 'Referente squadre trasporto', radio: 'Romeo Sierra', colore: '#9d9d9c', pettorina: 'grigia',
    chi: 'Personale ausiliario.',
    compiti: [
      'Si accerta che sia attivato il personale dedicato, anche di altri reparti.',
      'Individua un mezzo di comunicazione con le squadre.',
      'Dà a ogni squadra un identificativo (nome o numero).',
      'Divide le squadre: triage → aree di trattamento; aree di trattamento → diagnostica; aree di trattamento → reparti.',
      'Coordina gli spostamenti dei pazienti con DCA, RT e DD.',
    ],
  },
]

/** Tempi della decontaminazione (tape «Svestizione NBCRe»). */
export const TEMPI_DECO = [
  ['DECO primaria', '5 minuti'],
  ['DECO secondaria', '5 minuti'],
  ['Deambulanti', '5 minuti'],
  ['Non deambulanti', '20 minuti'],
] as const

/** Codici della scheda sanitaria regionale (kit triage Regione Toscana). */
export const CODICI_T = [
  { codice: 'T1', colore: '#e30613', testo: 'bianco', nome: 'Rosso', significato: 'Priorità immediata' },
  { codice: 'T2', colore: '#ffed00', testo: 'blu', nome: 'Giallo', significato: 'Priorità differibile' },
  { codice: 'T3', colore: '#3aaa35', testo: 'blu', nome: 'Verde', significato: 'Minore: cammina' },
  { codice: 'T4', colore: '#26418f', testo: 'bianco', nome: 'Blu', significato: 'Non respira dopo disostruzione delle vie aeree' },
] as const

/** Triage FAST (triage in uscita / rivalutazione), soglie come stampate sulla scheda regionale. */
export const FAST: [string, string, string, string][] = [
  ['Pervietà delle vie aeree', '', '', 'no'],
  ['Frequenza respiratoria', '> 25', '', '< 9'],
  ['Saturimetria', '', '90–94%', '< 90%'],
  ['Emorragia importante', '', '', 'sì'],
  ['Frequenza cardiaca', '> 130', '', ''],
  ['PA sistolica', '', '< 100', ''],
  ['AVPU', 'V non lateralizzato', '', 'P–U, V lateralizzato'],
]
