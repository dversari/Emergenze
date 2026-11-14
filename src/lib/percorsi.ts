/*
 * «Percorsi»: adempimenti medico-legali, percorsi protetti, sanità pubblica, maxiemergenza.
 * BOZZA: riferimenti normativi nazionali; i dettagli operativi vanno allineati alle procedure
 * aziendali dell'ASL Toscana Centro (PEIMAF dal PS.DRO.62 rev. 1).
 */
import type { Scheda } from './schede'

export const PERCORSI: Scheda[] = [
  // ─── Medico-legale ───
  {
    id: 'referto', nome: 'Referto all’autorità giudiziaria', gruppo: 'Medico-legale', urgente: true,
    sintesi: 'Obbligatorio per i delitti procedibili d’ufficio: entro 48 h, subito se c’è pericolo nel ritardo.',
    fonte: 'Art. 365 c.p., art. 334 c.p.p.',
    blocchi: [
      { titolo: 'Quando', righe: [
        'Ogni volta che si presta assistenza in casi che possono presentare i caratteri di un delitto procedibile d’ufficio.',
        'Esempi: lesioni gravi o gravissime (malattia > 40 giorni, pericolo di vita, indebolimento permanente di un senso o organo), lesioni da arma, lesioni stradali gravi o gravissime, infortuni sul lavoro con lesioni gravi o morte, maltrattamenti in famiglia, atti persecutori con lesioni, violenza su minori o incapaci, tentato omicidio, morte violenta o sospetta, aborto clandestino, cessione di stupefacenti con danno.',
        'Le lesioni lievi (fino a 40 giorni) sono di norma a querela della persona offesa, salvo aggravanti (es. arma, contesto familiare, persona incapace): nel dubbio, fare il referto.',
        'Non è dovuto se esporrebbe la persona assistita a procedimento penale (es. paziente che si è fatto male commettendo un reato).',
      ] },
      { titolo: 'Come', numerato: true, righe: [
        'Modulo aziendale di referto (verificare dove si trova in FirstAid / modulistica DEA).',
        'Contenuto: generalità del paziente (se note), luogo, giorno e ora dell’intervento, circostanze, descrizione obiettiva delle lesioni, mezzo che le ha prodotte (se noto), prognosi, eventuali persone presenti che possono riferire.',
        'Descrivere, non interpretare: sede, forma, dimensioni, colore delle lesioni; foto con consenso secondo procedura.',
        'Invio al PM presso la Procura o all’ufficiale di polizia giudiziaria più vicino (posto di polizia del PS): entro 48 h; subito se c’è pericolo nel ritardo.',
        'Copia nella documentazione; annotare in cartella che il referto è stato fatto.',
        'Più medici sullo stesso caso: possono firmare un unico referto.',
      ] },
    ],
  },
  {
    id: 'inail', nome: 'Infortunio sul lavoro (INAIL)', gruppo: 'Medico-legale',
    sintesi: 'Certificato medico di infortunio trasmesso per via telematica da chi presta la prima assistenza; anche in itinere.',
    fonte: 'DPR 1124/1965 art. 53; D.lgs 151/2015',
    blocchi: [
      { titolo: 'Quando', righe: [
        'Lesione da causa violenta in occasione di lavoro, compreso il tragitto casa–lavoro (in itinere), per lavoratori assicurati INAIL (dipendenti, parasubordinati, alcuni autonomi, studenti in alcune attività).',
        'Anche malattia professionale sospetta: certificato di malattia professionale e denuncia/segnalazione secondo normativa.',
      ] },
      { titolo: 'Come', numerato: true, righe: [
        'Raccogliere: datore di lavoro, mansione, luogo, data e ora, dinamica riferita dal paziente.',
        'Compilare il certificato medico di infortunio con diagnosi, prognosi (giorni) e se la prognosi è riservata.',
        'Trasmissione telematica all’INAIL secondo la procedura del PS (FirstAid / portale INAIL); consegnare copia al lavoratore con il numero identificativo per il datore di lavoro.',
        'Infortunio grave (lesioni gravi o gravissime, morte) o con possibile violazione di norme di sicurezza: anche referto all’autorità giudiziaria.',
        'Prognosi successive: dal medico curante o dall’INAIL.',
      ] },
    ],
  },
  {
    id: 'decesso', nome: 'Constatazione di decesso in PS', gruppo: 'Medico-legale',
    sintesi: 'Accertamento con ECG continuo per almeno 20 minuti; morte violenta o sospetta: salma a disposizione dell’autorità giudiziaria.',
    fonte: 'Legge 578/1993; DM 11 aprile 2008; DPR 285/1990',
    blocchi: [
      { titolo: 'Accertamento (criteri cardiaci)', numerato: true, righe: [
        'Assenza di attività elettrica cardiaca documentata con ECG continuo per non meno di 20 minuti (tracciato da allegare/conservare).',
        'Annotare in cartella ora di inizio e fine registrazione e ora del decesso.',
        'Comunicazione ai familiari in luogo riservato; offrire di vedere il defunto.',
      ] },
      { titolo: 'Documenti', righe: [
        'Scheda ISTAT di morte (causa iniziale, intermedia, finale; condizioni concomitanti).',
        'Avviso al medico necroscopo/Direzione sanitaria secondo procedura per la visita necroscopica e il periodo di osservazione.',
        'Possibile donazione di tessuti (cornee, ecc.): segnalare al coordinamento aziendale trapianti anche dopo arresto cardiaco.',
      ] },
      { titolo: 'Morte violenta o sospetta', righe: [
        'Traumi, intossicazioni, morte improvvisa inspiegata di giovane, sospetto di maltrattamento, infortunio sul lavoro, morte in custodia.',
        'Non rimuovere tubi, cannule, cateteri, indumenti; non lavare la salma; conservare oggetti e materiali.',
        'Referto/comunicazione all’autorità giudiziaria; la salma resta a disposizione dell’AG (niente riscontro diagnostico ospedaliero senza autorizzazione).',
      ] },
    ],
  },
  {
    id: 'rifiuto-cure', nome: 'Rifiuto delle cure, dimissione contro parere, allontanamento', gruppo: 'Medico-legale',
    sintesi: 'Il paziente capace può rifiutare qualunque trattamento: verificare la capacità, informare, documentare. Allontanamento: procedura aziendale IO.DRO.72.',
    fonte: 'Legge 219/2017; IO.DRO.72 rev. 2 (25/3/2025) ASL Toscana Centro',
    link: [
      { etichetta: '📄 IO.DRO.72 (procedura)', href: 'docs/asl/IO.DRO.72-allontanamento-dimissione-contro-parere.pdf', primario: true },
      { etichetta: '✎ Compila il modulo di dimissione contro parere', href: '/modulo-dimissione-contro-parere' },
      { etichetta: '📄 Modulo originale', href: 'docs/asl/IO.DRO.72-allegato-1-modulo-dimissione-contro-parere.pdf' },
    ],
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Valutare la capacità decisionale: capisce le informazioni, le trattiene, le valuta, comunica una scelta (escludere intossicazione, delirium, ipoglicemia, trauma cranico).',
        'Spiegare in modo comprensibile diagnosi sospetta, rischi concreti del rifiuto (compreso il rischio di morte se reale), alternative possibili.',
        'Offrire soluzioni parziali: esami di base, terapia orale, controllo a breve, rientro in qualunque momento.',
        'Far firmare il modulo di dimissione contro parere / rifiuto; se rifiuta di firmare: annotarlo con un testimone (infermiere).',
        'Documentare in cartella: capacità, informazioni date, domande del paziente, scelta, eventuali familiari presenti.',
        'Consegnare comunque la lettera di dimissione con le indicazioni e i segni d’allarme.',
      ] },
      { titolo: 'Se non è capace', righe: [
        'Pericolo imminente per la salute: trattamento in stato di necessità (art. 54 c.p.), coinvolgendo i familiari e, se esiste, l’amministratore di sostegno o il fiduciario.',
        'Disturbo psichico con rifiuto delle cure: valutare TSO.',
      ] },
      { titolo: 'Allontanamento spontaneo (IO.DRO.72)', numerato: true, righe: [
        'In PS la procedura vale dopo il triage per i pazienti con capacità di autodeterminazione non piena (demenza, disturbi psichiatrici, intossicati, sedati, alterazione dello stato mentale, rischio suicidario, malattie contagiose, TSO).',
        'Preallarme subito: cercare con la vigilanza nel setting e nelle aree vicine (bagni, ambulatori, scale, uscite, ascensori); avvisare i reparti vicini e la guardia giurata.',
        'Allarme: avvisare vigilanza, direttore e coordinatore, Centrale 118 (può intercettarlo e portarlo altrove), familiari, autorità che ha disposto il TSO, forze dell’ordine (persona scomparsa, L. 203/2012).',
        'Annotare in cartella data, ora, circostanze e chi è stato avvisato, con firma.',
        'Ritrovato: registrarlo e avvisare tutti quelli contattati. Non ritrovato dopo 24 h: chiusura con causale «dimissione volontaria».',
      ] },
    ],
  },
  {
    id: 'alcol-cds', nome: 'Alcol e droghe su richiesta della polizia (Codice della strada)', gruppo: 'Medico-legale',
    sintesi: 'Dopo incidente stradale gli organi di polizia possono chiedere alla struttura gli accertamenti per alcol e stupefacenti.',
    fonte: 'Artt. 186 e 187 Codice della strada',
    blocchi: [
      { titolo: 'Passaggi', righe: [
        'Richiesta scritta (verbale) degli organi di polizia stradale, con generalità del conducente e ora dell’incidente.',
        'Informare il paziente dello scopo del prelievo e chiedere il consenso; il rifiuto va documentato e comunicato alla polizia (le conseguenze sono a carico del conducente).',
        'Prelievo con la catena di custodia prevista dalla procedura aziendale/laboratorio (provette dedicate, sigilli, verbale).',
        'Prelievi già eseguiti per motivi clinici: i risultati possono essere richiesti dall’autorità secondo le regole sulla documentazione sanitaria.',
        'Verificare la procedura aziendale per modulistica e laboratorio di riferimento.',
      ] },
    ],
  },

  // ─── Codice Rosa (in evidenza in cima alla pagina) ───
  {
    id: 'codice-rosa', nome: 'Accoglienza e valutazione del rischio', gruppo: 'Codice Rosa', urgente: true,
    sintesi: 'Attivazione al triage, stanza Rosa, mai sola né con il presunto autore; cure, documentazione, valutazione del rischio.',
    fonte: 'Rete regionale Codice Rosa (DGR Toscana); Legge 69/2019 «Codice rosso»',
    blocchi: [
      { titolo: 'Accoglienza', numerato: true, righe: [
        'Codice di priorità adeguato e attivazione del percorso Codice Rosa al triage; stanza Rosa dedicata, la persona non resta sola né con il presunto autore.',
        'Domande dirette e non giudicanti, senza la presenza di accompagnatori; interprete professionale se serve (non familiari).',
        'Valutazione del rischio di recidiva/letalità con lo strumento previsto dal percorso (minacce di morte, strangolamento, armi, escalation, gravidanza, figli coinvolti).',
        'Cure delle lesioni prima di tutto; documentazione accurata: sede, forma, dimensioni, colore; foto con consenso e righello.',
        'Minori coinvolti o testimoni di violenza: segnalazione obbligatoria (referto/Procura minori).',
      ] },
    ],
  },
  {
    id: 'codice-rosa-sessuale', nome: 'Violenza sessuale: prove e profilassi', gruppo: 'Codice Rosa', urgente: true,
    sintesi: 'Ginecologo del percorso, kit prove con catena di custodia, profilassi IST/HIV/HBV e contraccezione d’emergenza.',
    link: [{ etichetta: 'Profilassi post-esposizione', href: '/linee-guida/pep-hiv-hbv' }],
    blocchi: [
      { titolo: 'Prove', righe: [
        'Ginecologo (o urologo/chirurgo) del percorso; kit per la raccolta delle prove; non far lavare né urinare prima dei prelievi se possibile.',
        'Indumenti in buste di carta separate, sigillate ed etichettate; catena di custodia.',
        'Prelievi tossicologici (sangue e urine) se sospetta sostanza (GHB, benzodiazepine, alcol): prima possibile.',
      ] },
      { titolo: 'Profilassi', righe: [
        'HIV: PEP entro 72 h (meglio entro 2–4 h). HBV: vaccino ± immunoglobuline se non immune.',
        'IST: ceftriaxone 500 mg im + doxiciclina 100 mg × 2 per 7 giorni + metronidazolo 2 g.',
        'Contraccezione d’emergenza (levonorgestrel entro 72 h, ulipristal entro 120 h).',
      ] },
    ],
  },
  {
    id: 'codice-rosa-dopo', nome: 'Referto, rete antiviolenza e dimissione protetta', gruppo: 'Codice Rosa',
    sintesi: 'Referto se procedibile d’ufficio, informazione sulla querela, centro antiviolenza, 1522; dimissione solo in sicurezza.',
    link: [{ etichetta: 'Referto all’AG', href: '/percorsi?apri=referto' }, { etichetta: '☎ 1522', href: 'tel:1522' }],
    blocchi: [
      { titolo: 'Dopo', righe: [
        'Referto all’autorità giudiziaria se il reato è procedibile d’ufficio (maltrattamenti, minori, lesioni gravi, atti persecutori con lesioni, ecc.); negli altri casi informare la persona della possibilità di querela.',
        'Contatto con il centro antiviolenza (rubrica) e, se necessario, ospitalità protetta; servizi sociali.',
        'Dimissione solo in sicurezza: dove va, con chi; numero 1522 (antiviolenza e stalking, 24 h).',
        'Annotare in cartella in modo oggettivo, con le parole della persona tra virgolette.',
      ] },
    ],
  },
  // ─── Percorsi protetti ───
  {
    id: 'tso', nome: 'TSO e ASO (trattamento e accertamento sanitario obbligatorio)', gruppo: 'Percorsi protetti',
    sintesi: 'TSO per malattia mentale: tre condizioni insieme, proposta + convalida di due medici, ordinanza del sindaco.',
    fonte: 'Legge 180/1978; Legge 833/1978 artt. 33–35',
    blocchi: [
      { titolo: 'Condizioni (tutte e tre)', righe: [
        'Alterazioni psichiche tali da richiedere urgenti interventi terapeutici.',
        'Rifiuto degli interventi da parte del paziente.',
        'Impossibilità di adottare tempestive e idonee misure sanitarie extraospedaliere.',
        'Non si fa TSO per patologie organiche (delirium, intossicazione, trauma): lì vale lo stato di necessità.',
      ] },
      { titolo: 'Iter', numerato: true, righe: [
        'Escludere cause organiche (glicemia, intossicazioni, trauma, infezione) e chiamare lo psichiatra di guardia.',
        'Proposta motivata di TSO da parte di un medico.',
        'Convalida da parte di un medico della struttura pubblica (di norma lo psichiatra).',
        'Ordinanza del Sindaco del comune in cui si trova il paziente, entro 48 h dalla convalida; notifica al Giudice tutelare entro 48 h.',
        'Ricovero in SPDC; durata 7 giorni, prorogabile con comunicazione al Sindaco.',
        'Esecuzione con la Polizia municipale; il personale sanitario si occupa delle cure.',
      ] },
      { titolo: 'ASO', righe: [
        'Accertamento sanitario obbligatorio: quando non è possibile visitare il paziente che rifiuta, per verificare se servono le condizioni del TSO; proposta medica e ordinanza del Sindaco.',
        'Nell’attesa, in pericolo immediato per sé o altri: stato di necessità e sedazione secondo la scheda «Paziente agitato».',
      ] },
    ],
  },

  // ─── Sanità pubblica ───
  {
    id: 'notifica-infettive', nome: 'Notifica delle malattie infettive', gruppo: 'Sanità pubblica', urgente: true,
    sintesi: 'Scheda unica regionale (DM 7 marzo 2022), anche per il solo sospetto: entro 12 h o 48 h secondo la malattia, per email all’Igiene pubblica di Prato.',
    fonte: 'Scheda unica di segnalazione delle malattie infettive, Regione Toscana (prot. AOOGRT 0623609 dell’1/8/2025); modulo PDF editabile inviato dal DEU ASL TC il 15/1/2026',
    link: [
      { etichetta: '✎ Compila la scheda nell’app', href: '/modulo-notifica', primario: true },
      { etichetta: '📄 Scheda originale (PDF)', href: 'docs/asl/scheda-notifica-malattie-infettive-2026.pdf' },
      { etichetta: '✉ Invia all’Igiene pubblica', href: 'mailto:malattieinfettiveigiene.prato@uslcentro.toscana.it,infezionicorrelate.prato@uslcentro.toscana.it?subject=Notifica%20malattia%20infettiva' },
      { etichetta: '📄 Indirizzi Igiene pubblica (Toscana)', href: 'docs/asl/indirizzi-segnalazione-malattie-infettive-2026.pdf' },
      { etichetta: 'Documenti ASL', href: '/documenti' },
    ],
    blocchi: [
      { titolo: 'Come', numerato: true, righe: [
        'Si notifica il caso SOSPETTO o CONFERMATO: non aspettare la conferma di laboratorio.',
        'Compilare la scheda unica (PDF editabile): malattia, dati anagrafici e recapiti, inizio sintomi, viaggi, ricovero, gravidanza, vaccinazione, criteri diagnostici (clinici, epidemiologici, laboratorio), origine del contagio, comunità frequentate (scuola, RSA), sospetta origine alimentare, altre persone coinvolte, dati del medico.',
        'Firmare (autografa o digitale) e inviare per email a malattieinfettiveigiene.prato@uslcentro.toscana.it e infezionicorrelate.prato@uslcentro.toscana.it.',
        'Malattie entro 12 h fuori orario e casi gravi (meningococco, morbillo, febbri emorragiche, rabbia, botulismo, difterite…): oltre alla scheda, telefonare all’Igiene pubblica reperibile (rubrica) per la profilassi dei contatti.',
        'Sospetta tossinfezione alimentare: raccogliere feci/vomito PRIMA di antibiotici e disinfettanti.',
        'Annotare in cartella data e ora dell’invio.',
      ] },
      { titolo: '☎ Entro 12 ore', righe: [
        'Antrace · Botulismo* · Chikungunya* · Colera · Dengue* · Difterite · Encefalite virale da zecche* · Encefalite virale trasmessa da artropodi* · Epatite A · Febbre emorragica virale · Febbre gialla · Febbre West Nile*',
        'Influenza grave* · Influenza aviaria* · Legionellosi* · Malaria* · Malattia batterica invasiva (meningococco, pneumococco, emofilo)* · Creutzfeldt-Jakob* · Morbillo* · Peste · Poliomielite* · Rabbia',
        'Rosolia* · Rosolia congenita* · Rosolia in gravidanza* · MERS-CoV* · Tetano · Tifo esantematico · Tossinfezioni alimentari · Trichinellosi · Vaiolo · Mpox* · Varicella · Zika* · Zika congenita*',
      ] },
      { titolo: '✉ Entro 48 ore', righe: [
        'Borreliosi · Brucellosi · Criptosporidiosi · Dermatofitosi · Echinococcosi · Epatiti B, C, D, E e altre acute · Febbre Q · Febbre tifoide e paratifoide · Giardiasi · Herpes zoster',
        'Infezione correlata all’assistenza (ICA)* · Chlamydia · Gonorrea · Campylobacter · STEC/VTEC compresa SEU · Enterobatteri produttori di carbapenemasi (CPE)* · Yersinia · Salmonella',
        'Lebbra · Leishmaniosi cutanea e viscerale · Leptospirosi · Linfogranuloma venereo · Listeriosi · Meningiti virali · Micobatteriosi non tubercolare* · Parotite · Pediculosi e ftiriasi · Pertosse · Psittacosi · Rickettsiosi',
        'Scabbia · Scarlattina · Shigellosi · Sifilide e sifilide congenita · Toxoplasmosi e toxoplasmosi congenita · Tubercolosi* · Tularemia · Altro (specificare)',
        '* = sorveglianza speciale (schede aggiuntive dedicate, di solito curate da Malattie infettive/Igiene pubblica).',
      ] },
    ],
  },
  {
    id: 'isolamento', nome: 'Isolamento: quali precauzioni per quale infezione', gruppo: 'Sanità pubblica',
    sintesi: 'Tabella aziendale con precauzioni da contatto, droplet o respiratorie, materiale infettante e durata per ogni germe o malattia.',
    fonte: 'PA.DRO.01 rev. 3, tabella 5.5 (ASL Toscana Centro); nota Direzione Rete Ospedaliera 3/2/2025 sui tamponi',
    link: [
      { etichetta: '📄 PA.DRO.01', href: 'docs/asl/PA.DRO.01-paziente-colonizzato.pdf', primario: true },
      { etichetta: '📄 Nota tamponi 2025', href: 'docs/asl/nota-tamponi-virus-respiratori-2025.pdf' },
    ],
    blocchi: [
      { titolo: 'In PS', righe: [
        'Precauzioni standard sempre, per tutti: igiene delle mani, guanti/camice/mascherina se rischio di contatto con liquidi biologici.',
        'Senza stanza singola: isolamento di coorte (stesso germe) o funzionale (distanza ≥ 1 m, tenda, materiale dedicato).',
        'Avvisare il reparto e il personale del trasporto delle precauzioni prima del trasferimento.',
        'Tampone per virus respiratori solo se il sospetto è fondato e cambia prognosi o terapia; sempre, anche senza sintomi, nei pazienti da ricoverare in oncologia o oncoematologia.',
      ] },
    ],
  },
  {
    id: 'ebola', nome: 'Sospetta Ebola (malattia da virus Ebola) in PS', gruppo: 'Sanità pubblica', urgente: true,
    sintesi: 'Febbre ≥ 38,6 °C + sintomi e soggiorno in RDC/Uganda (o contatto con caso) nei 21 giorni: isolamento subito, DPI, infettivologo, trasferimento a Careggi.',
    fonte: 'Istruzione di lavoro aziendale ASL TC (giugno 2026); Circolare Min. Salute 4258 del 29/5/2026; nota Direzione Sanitaria 1/6/2026',
    link: [
      { etichetta: '📄 Istruzione di lavoro Ebola', href: 'docs/asl/istruzione-lavoro-ebola.pdf', primario: true },
      { etichetta: 'Vestizione NBCR illustrata', href: '/procedure?apri=nbcr-vestizione' },
      { etichetta: 'Svestizione NBCR illustrata', href: '/procedure?apri=nbcr-svestizione' },
      { etichetta: '📄 DPI: elenco aziendale', href: 'docs/asl/ebola-dpi-vestizione-svestizione.pdf' },
      { etichetta: '📄 Comunicazione DS 1/6/2026', href: 'docs/asl/comunicazione-ebola-giugno-2026.pdf' },
      { etichetta: '☎ Spallanzani 06 551701', href: 'tel:+3906551701' },
    ],
    blocchi: [
      { titolo: 'Caso sospetto', righe: [
        'Criterio clinico: febbre ≥ 38,6 °C + almeno uno tra cefalea intensa, vomito, diarrea, dolore addominale, emorragie inspiegate, insufficienza multiorgano (o morte improvvisa inspiegata).',
        'Criterio epidemiologico (21 giorni prima dei sintomi): soggiorno in area del focolaio (RDC, Uganda; aree aggiornate su ECDC) o contatto con caso probabile/confermato.',
        'Sospetto = clinico + epidemiologico, oppure esposizione ad alto rischio + qualunque sintomo (anche febbre di qualsiasi grado).',
        'Alto rischio: contatto entro 1 m senza DPI con caso sintomatico, liquidi biologici, puntura/mucose, riti funebri, rapporti non protetti fino a 3 mesi dalla guarigione, contatto con pipistrelli/primati o carne di selvaggina.',
      ] },
      { titolo: 'Triage e isolamento', numerato: true, righe: [
        'Infermiere di triage: camice tipo 4B, guanti lunghi, visiera; mascherina chirurgica e guanti al paziente.',
        'Accompagnare subito nel locale di isolamento a 2 m di distanza, senza contatto; la porta la apre l’operatore. Cartello «Accesso vietato – caso sospetto agente biologico».',
        'Capoturno: avvisa Direzione medica di presidio e Direttore DEA, attiva la ditta di decontaminazione, individua chi farà la vestizione NBCR.',
        'Area di svestizione davanti al locale (guanti, gel, telini, contenitori rifiuti infetti, disinfettante).',
        'Annotare tutte le persone presenti nelle aree interessate (tracciamento dei contatti).',
      ] },
      { titolo: 'Valutazione e trasferimento', numerato: true, righe: [
        'Entrare solo con DPI NBCR completi; pianificare prima con l’infettivologo per ridurre gli accessi.',
        'Parametri, temperatura, esame clinico, anamnesi epidemiologica (paesi, date, esposizioni, esordio).',
        'Infettivologo di riferimento: per Prato (Malattie Infettive 2) il medico di guardia/reperibile delle Malattie Infettive del San Jacopo di Pistoia.',
        'Grave: intervento solo con NBCR, area sgomberata, poi consulenza infettivologica.',
        'Diagnostica solo bedside (POCT, eco, RX portatile); niente campioni nei percorsi ordinari. Prelievo per Spallanzani solo su indicazione dell’infettivologo, previo accordo telefonico (06 551701, h24), triplo involucro; trasporto campione SVS (CO 0586 888888).',
        'Sospetto ad alto rischio stabilizzato: trasferimento a Careggi (adulti; Meyer i bambini) dopo contatto con il referente regionale (SOD Malattie Infettive e Tropicali AOUC); trasporto in biocontenimento 118/Protezione civile.',
        'Paziente portato dal 118 instabile: PS preallertato, camera calda sgombra, percorso interdetto, équipe già vestita.',
        'Notifica immediata (12 h) e avviso a Igiene pubblica; decontaminazione e sanificazione di ambienti e percorsi.',
      ] },
      { titolo: 'Senza sintomi', righe: [
        'Viaggiatore asintomatico dalle aree colpite: non accedere in ospedale; domicilio, isolamento se indicato e contatto immediato con Igiene pubblica.',
      ] },
    ],
  },
  {
    id: 'scabbia', nome: 'Scabbia in PS', gruppo: 'Sanità pubblica',
    sintesi: 'Sospetto se ≥ 2 criteri su 3 (prurito notturno, sedi tipiche, familiari con gli stessi sintomi); precauzioni da contatto, isolamento solo nella forma crostosa (norvegese); notifica entro 48 h.',
    fonte: 'PA.STDS.07 rev. 0 (18/12/2024) ASL Toscana Centro, SOSD Infezioni correlate all’assistenza',
    link: [
      { etichetta: '📄 PA.STDS.07', href: 'docs/asl/PA.STDS.07-scabbia.pdf', primario: true },
      { etichetta: '📄 All. 1: check list triage', href: 'docs/asl/PA.STDS.07-allegato-1.pdf' },
      { etichetta: '📄 All. 2: misure in ospedale', href: 'docs/asl/PA.STDS.07-allegato-2.pdf' },
      { etichetta: '📄 All. 3: misure a domicilio', href: 'docs/asl/PA.STDS.07-allegato-3.pdf' },
      { etichetta: '✎ Testo di dimissione', href: '/dimissioni?apri=scabbia' },
    ],
    blocchi: [
      { titolo: 'In PS', righe: [
        'Check list di triage (allegato 1), paziente con sintomi cutanei: 1) prurito intenso nelle ore notturne? 2) prurito localizzato a mani/piedi, regione ombelicale, area genitale, glutei, ascelle, areole? 3) stessi sintomi in altri componenti del nucleo familiare?',
        'Almeno due criteri positivi = sospetto di scabbia → isolamento funzionale da subito; altrimenti prosegue l’iter diagnostico.',
        'Operatori: guanti e camice monouso a maniche lunghe per ogni contatto con cute e biancheria; igiene delle mani prima e dopo. Cuffia e mascherina non servono.',
        'Isolamento da contatto in stanza singola per 24 h solo nella scabbia crostosa (norvegese); negli altri casi precauzioni standard e da contatto.',
        'Biancheria del paziente in sacco chiuso; effetti letterecci in sacco idrosolubile dentro sacco rosso, senza scuotere; materassi e cuscini come «materiale infetto».',
      ] },
      { titolo: 'Terapia (adulto)', righe: [
        'Permetrina 5% crema su tutto il corpo dal collo in giù (mani, unghie, pieghe), lasciata 8–12 h; ripetere dopo 7 giorni. È la prima linea.',
        'Ivermectina 200 µg/kg per bocca (70 kg: 14 mg) in dose unica, ripetuta dopo 7–14 giorni; nella forma crostosa associata alla terapia topica.',
        'Trattare insieme i contatti stretti (conviventi, partner); lavare indumenti e lenzuola a ≥ 60 °C o chiuderli in un sacco per 72 h.',
        'Notifica entro 48 h (scheda unica).',
      ] },
    ],
  },
  {
    id: 'morsi-animali', nome: 'Morso di animale: segnalazione veterinaria', gruppo: 'Sanità pubblica',
    sintesi: 'Morso di cane o gatto: segnalazione al Servizio veterinario dell’ASL per l’osservazione dell’animale.',
    blocchi: [
      { titolo: 'Passaggi', righe: [
        'Raccogliere: specie, proprietario/recapiti, luogo, stato vaccinale dell’animale, animale randagio o selvatico.',
        'Segnalazione al Servizio veterinario della ASL (modulo/procedura aziendale); osservazione dell’animale per 10 giorni.',
        'Rischio rabbia (pipistrelli, animali importati o da zone endemiche, morso all’estero): anche Igiene pubblica/Malattie infettive.',
        'Terapia della ferita e profilassi antitetanica: vedi PDTA «Ferite e morsi».',
      ] },
    ],
  },
  {
    id: 'esposizione-operatore', nome: 'Infortunio biologico dell’operatore', gruppo: 'Sanità pubblica',
    sintesi: 'Puntura o schizzo con materiale biologico: lavare, testare fonte ed esposto, PEP se indicata entro poche ore, denuncia di infortunio.',
    blocchi: [
      { titolo: 'Passaggi', numerato: true, righe: [
        'Lavare con acqua e sapone (mucose: acqua/SF); non spremere.',
        'Prelievo all’esposto (HIV, HBV, HCV, anti-HBs) e alla fonte con consenso.',
        'Valutazione della profilassi (HIV entro 2–4 h, HBV entro 24 h): vedi PDTA «Profilassi post-esposizione».',
        'Segnalazione al medico competente e denuncia di infortunio sul lavoro secondo la procedura aziendale.',
      ] },
    ],
  },

  // ─── Maxiemergenza ───
  {
    id: 'peimaf', nome: 'PEIMAF: allarme, comando e prime azioni', gruppo: 'Maxiemergenza', urgente: true,
    sintesi: 'Piano per il massiccio afflusso di feriti al Santo Stefano. Lo attiva il Direttore sanitario aziendale; in PS il medico che riceve l’allarme fa da DSS-H finché il direttore della Medicina d’urgenza non lo designa. Prima ora di giorno: al massimo 14 pazienti (2 codici 1, 4 codici 2, 8 codici 3).',
    fonte: 'PS.DRO.62 rev. 1 (09/08/2023) ASL Toscana Centro, PO Santo Stefano; DOC.DS.03 rev. 3 (Piano aziendale maxiemergenza) e modulo METHANE TPX 5956',
    link: [
      { etichetta: '☎ Numeri maxiemergenza (Rubrica)', href: '/rubrica?cerca=maxiemergenza', primario: true },
      { etichetta: 'Ruoli e schede di azione', href: '/percorsi?apri=peimaf-ruoli' },
      { etichetta: 'Assetto del DEA', href: '/percorsi?apri=peimaf-dea' },
      { etichetta: 'PEIMAF NBCRe', href: '/percorsi?apri=peimaf-nbcr' },
      { etichetta: 'Triage di massa', href: '/percorsi?apri=maxiemergenza' },
      { etichetta: '📄 PS.DRO.62 (procedura)', href: 'docs/asl/PS.DRO.62-PEIMAF-Santo-Stefano.pdf' },
      { etichetta: '📄 Modulo METHANE', href: 'docs/asl/DOC.DS.03-allegato-1-modulo-METHANE.pdf' },
      { etichetta: '📄 DOC.DS.03 (piano aziendale)', href: 'docs/asl/DOC.DS.03-piano-aziendale-maxiemergenza.pdf' },
    ],
    blocchi: [
      { titolo: 'Da dove arriva la notizia', righe: [
        'Centrale 118: chiama la linea dedicata del PS (telefono analogico con suoneria diversa e spia luminosa) o la radio del PS (canale 16 regionale, sempre accesa). Numero e selettiva in Rubrica.',
        'Autopresentazione di molti feriti: il triage avvisa SUBITO la Centrale 118, la Direzione medica di presidio e il Coordinatore maxiemergenze.',
        'Emergenza interna all’ospedale: la notizia arriva dalla Direzione medica di presidio o dalla Centrale 118.',
      ] },
      { titolo: 'Livelli', righe: [
        'Attivazione preventiva: evento prevedibile (allerta meteo, epidemie, grandi eventi); di norma comunicata alla Direzione medica di presidio.',
        'Preallarme: la Centrale 118 avvisa il medico del PS per verificare quanti pazienti l’ospedale può ricevere davvero.',
        'Allarme / attivazione definitiva: massiccio afflusso confermato. Il PEIMAF lo attiva il Direttore sanitario aziendale dopo la dichiarazione di maxiemergenza.',
        'Gravità secondo la Centrale (modulo METHANE): livello 1 = 10–30 feriti, livello 2 = 30–100, livello 3 = oltre 100.',
      ] },
      { titolo: 'Cosa farsi dire dalla Centrale 118', numerato: true, righe: [
        'Natura dell’evento (convenzionale o NBCRe) e luogo esatto.',
        'Numero stimato di vittime.',
        'Tempo stimato di arrivo dei primi pazienti.',
        'Tipo prevalente di lesioni (traumi, ustioni, intossicati, contaminati).',
        'Altri ospedali coinvolti.',
        'Se sono attivate l’Unità di crisi aziendale e/o quella zonale.',
        'Annotare ora della chiamata e recapito di ritorno; se il canale lo consente, pericoli, vie di accesso e punto di raccolta.',
      ] },
      { titolo: 'Allarme: liberare il PS (subito)', numerato: true, righe: [
        'Ricoverare o assegnare alla specialistica i pazienti già in PS che hanno un posto (seguendo le schede di azione).',
        'Dimettere i dimissibili ancora in corso di accertamenti con programma di post-ricovero o con indicazione a rientrare.',
        'Allontanare dalle sale d’attesa i codici 4 e 5 con i loro accompagnatori, spiegando il motivo; cartello all’ingresso «Maxiemergenza in atto».',
        'Il portiere, avvisato dalla Direzione medica di presidio, annuncia all’interfono «Attenzione, maxiemergenza in atto».',
        'Riallestire il DEA secondo l’assetto PEIMAF (card «Assetto del DEA»).',
      ] },
      { titolo: 'Catena di comando', righe: [
        'DSS-H (Direttore dei soccorsi sanitari in ospedale, pettorina rossa): coordina i soccorsi in ospedale. Lo designa il Direttore della Medicina d’urgenza; se non è presente o raggiungibile, nell’ordine: vicedirettore → medico fuori turno del PS → medico capoturno (flussista) o il medico in turno più esperto di maxiemergenza.',
        'Il DSS-H nomina subito: DCA (medico, verde), DD (radiologo, gialla), RI (infermiere, azzurra), RT (infermiere di triage, rosa), RST (ausiliario, grigia). Compiti di ciascuno nella card «Ruoli e schede di azione» (tape SISmax).',
        'Comunicazioni tra i ruoli via radio, con la dotazione della Control Room fornita dall’Area tecnica di presidio.',
        'Avvisare la Control Room che si usa la porta d’emergenza n. 58 dell’Open space, per far tacitare l’allarme.',
        'Unità sanitaria di crisi zonale (coordinata dal Direttore della Direzione medica di presidio): Medicina d’urgenza, gestione infermieristica, Rianimazione, 118 Prato, Area tecnica, Farmacia, Prevenzione (PISLL), Zona-distretto, SePP. Elenco dei reperibili della Direzione sanitaria in portineria e in Control Room. Concorda con le Forze dell’ordine il controllo degli accessi all’ospedale.',
      ] },
      { titolo: 'Capacità della prima ora', righe: [
        'Di giorno: al massimo 14 pazienti, cioè 2 codici 1, 4 codici 2, 8 codici 3.',
        'Stima da ridurre di notte, nei mesi estivi e se il PS è già sovraffollato: comunicarlo alla Centrale 118 in fase di preallarme.',
        'Fattori che la limitano: postazioni per codici maggiori, sale operatorie d’urgenza con équipe, letti monitorati, ecografia ed Rx per la prima valutazione, TC e sangue subito disponibili, personale reclutabile.',
      ] },
      { titolo: 'Personale', righe: [
        'Restano in servizio tutti gli smontanti, che si sommano ai montanti.',
        'Il personale in pronta disponibilità viene convocato dalla Direzione infermieristica e dalla Direzione medica di presidio.',
        'Internisti, chirurghi, ortopedici e rianimatori in turno vengono destinati al PS: prima di scendere avvisano il reperibile del proprio reparto.',
        'Servizi diagnostici e degenze specialistiche si mettono a disposizione per le consulenze; squadre di trasporto dedicate.',
        'TSRM: attivazione con il percorso di chiamata dei reperibili.',
        'In una seconda fase smontano i trattenuti, sostituiti dal personale non in servizio al momento dell’evento.',
      ] },
      { titolo: 'Aree speciali', righe: [
        'Area nera: sosta salme, fino a 8 vittime; oltre, Sala multiculto e/o Cappella, presidiate.',
        'Informazioni ai parenti: hall principale, davanti alle scale mobili (sedie e transenne a cura del gestore), con personale per il supporto psicologico garantito dalla Direzione medica di presidio.',
        'Comunicati stampa: Sala del Cembalo.',
        'Unità di crisi: Sala Magnolfi, 1° piano della Palazzina dei servizi; chiavi in Control Room (piano terra della stessa palazzina).',
      ] },
      { titolo: 'Oltre la prima ora e fine', righe: [
        'Se l’evento si prolunga, Direzione medica e Direzione infermieristica (in Unità di crisi zonale) bloccano o rimodulano nell’ordine: ambulatori e Day Service, chirurgia programmata, sale operatorie.',
        'La fine della maxiemergenza la dichiara la Direzione medica di presidio, sulla base delle notizie di PS, 118, Prefettura e Protezione civile; poi si scioglie l’Unità di crisi zonale e si torna all’attività ordinaria.',
        'Registrazione dei pazienti: First Aid Web e scheda di triage regionale (Allegato 2 al DOC.DS.03).',
        'Copie cartacee del piano: bancone del triage, Control Room, segreteria amministrativa del DEA.',
      ] },
    ],
  },
  {
    id: 'peimaf-ruoli', nome: 'PEIMAF: ruoli e schede di azione (tape SISmax)', gruppo: 'Maxiemergenza', urgente: true,
    sintesi: 'Sei ruoli, ciascuno con pettorina e tape del suo colore: DSS-H rosso, DCA verde, DD giallo, RI azzurro, RT rosa, RST grigio. In NBCRe alcuni ruoli hanno azioni da fare prima di quelle convenzionali.',
    fonte: 'PS.DRO.62 rev. 1, Allegato 2 (tape SISmax); DOC.DS.03 rev. 3, cap. 7 (chi ricopre il ruolo, pettorine)',
    link: [
      { etichetta: '📄 Tape SISmax originali', href: 'docs/asl/PS.DRO.62-allegato-2-tape-SISmax.pdf', primario: true },
      { etichetta: 'Allarme e comando', href: '/percorsi?apri=peimaf' },
    ],
    blocchi: [
      { titolo: 'Come si usano', righe: [
        'Il DSS-H prende il proprio tape e la pettorina rossa, poi consegna tape e pettorina a ciascun referente che nomina.',
        'Ogni referente spunta le azioni del proprio tape; le comunicazioni passano per il DSS-H (piramide della comunicazione), via radio con le sigle Delta Hotel, Delta Charlie, Delta Delta, Romeo India, Romeo Tango, Romeo Sierra.',
        'In un presidio piccolo una persona può ricoprire più ruoli (es. DSS-H e DCA), senza togliere l’assistenza.',
      ] },
    ],
  },
  {
    id: 'peimaf-dea', nome: 'PEIMAF: assetto del DEA e accessi', gruppo: 'Maxiemergenza', urgente: true,
    sintesi: 'Il DEA si divide in due: area maxiemergenza (sale rossa e arancio, triage, sala gessi, sala rosa) e area per l’emergenza ordinaria (Open space e OBI). Radiologia e TC del PS solo per la maxiemergenza.',
    fonte: 'PS.DRO.62 rev. 1 (09/08/2023), par. 9–10 e Allegati 3–4 (piantine e cartellonistica)',
    link: [
      { etichetta: '📄 Piantine (Allegato 3)', href: 'docs/asl/PS.DRO.62-allegato-3-piantine.pdf' },
      { etichetta: '📄 Cartellonistica (Allegato 4)', href: 'docs/asl/PS.DRO.62-allegato-4-cartellonistica.pdf' },
      { etichetta: 'Allarme e comando', href: '/percorsi?apri=peimaf' },
      { etichetta: 'PEIMAF NBCRe', href: '/percorsi?apri=peimaf-nbcr' },
    ],
    blocchi: [
      { titolo: 'Area maxiemergenza', righe: [
        'Sala rossa: 2 postazioni → codici 1 e 2.',
        'Sala arancio: 6 postazioni → codici 1 e 2.',
        'Triage interno, sala gessi, sala rosa → codici 3 e codici minori.',
        'Triage esterno → codici minori che arrivano a piedi.',
        'Sala d’attesa del PS: cassa di espansione per i pazienti della maxiemergenza a bassa intensità.',
        'Radiologia del DEA e TC del PS: solo pazienti della maxiemergenza.',
        'Triage come di consueto: triage interno per i barellati, triage esterno per chi arriva da solo.',
      ] },
      { titolo: 'Area emergenza ordinaria', righe: [
        'I pazienti ordinari che si trovano nell’area destinata alla maxiemergenza si spostano in Open space e OBI.',
        'Open space, area monitor: codici 1 e 2 ordinari in arrivo.',
        'OBI (ex HDU): pazienti già valutati che hanno bisogno del monitor.',
        'Open space senza monitor, corridoi paralleli, box C e box D: pazienti già valutati, stabili, senza ossigeno.',
        'Triage dell’ordinario allestito nell’ex sala 1 dell’Open space; postazione con PC e carrello dell’emergenza nel box D.',
        'Cassa di espansione: corridoi verso OBI e Psichiatria (solo pazienti stabili, senza ossigeno).',
        'Medico di riferimento dell’area: ex stanza visita medico-pediatrica.',
        'Diagnostica: radiologia ordinaria e TC 128, raggiunte dal corridoio in uscita dall’OBI.',
      ] },
      { titolo: 'Accessi in maxiemergenza convenzionale', righe: [
        'Barellati della maxiemergenza: camera calda → triage interno.',
        'Barellati ordinari: porta d’emergenza dell’Open space → triage nell’ex stanza 1.',
        'Deambulanti della maxiemergenza: sala d’attesa → triage esterno.',
        'Deambulanti ordinari: uscita d’emergenza dell’Open space → triage nell’ex stanza 1.',
        'Far sgombrare il parcheggio del PS per le manovre dei mezzi di soccorso.',
        'Avvisare la Control Room che si usa la porta d’emergenza n. 58 dell’Open space, per far tacitare l’allarme.',
      ] },
      { titolo: 'Cartellonistica', righe: [
        'Cartelli rossi «Maxiemergenza» (frecce per pedoni e ambulanze) e «Ingresso maxiemergenza»; cartelli gialli «Ordinari» (2 con freccia avanti, 1 con freccia a destra) e 1 «Ingresso ordinari».',
        'Posizioni dei cartelli e percorsi delle ambulanze nelle tavole qui sotto.',
      ] },
    ],
  },
  {
    id: 'peimaf-nbcr', nome: 'PEIMAF NBCRe: contaminati e decontaminazione', gruppo: 'Maxiemergenza', urgente: true,
    sintesi: 'Evento nucleare, biologico, chimico, radiologico o esplosivo: stessa catena di comando, accessi diversi. Stanza di decontaminazione per un paziente alla volta, con accesso separato dalla camera calda.',
    fonte: 'PS.DRO.62 rev. 1 (09/08/2023), par. 11',
    link: [
      { etichetta: 'Vestizione NBCR illustrata', href: '/procedure?apri=nbcr-vestizione', primario: true },
      { etichetta: 'Svestizione NBCR illustrata', href: '/procedure?apri=nbcr-svestizione' },
      { etichetta: 'Antidoti e consulenze', href: '/procedure?apri=nbcr-antidoti' },
      { etichetta: 'Ruoli NBCRe', href: '/percorsi?apri=peimaf-ruoli' },
      { etichetta: '📄 Piantine (Allegato 3)', href: 'docs/asl/PS.DRO.62-allegato-3-piantine.pdf' },
    ],
    blocchi: [
      { titolo: 'Accessi (diversi dal convenzionale)', righe: [
        'Deambulanti della maxiemergenza: camera calda → direttamente in stanza di decontaminazione → triage interno.',
        'Barellati della maxiemergenza: sala d’attesa → triage esterno.',
        'Pazienti ordinari: come nel convenzionale (porta e uscita d’emergenza dell’Open space → triage nell’ex stanza 1).',
        'Far sgombrare subito il parcheggio del PS.',
      ] },
      { titolo: 'Stanza di decontaminazione', numerato: true, righe: [
        'Un OSS del PS prende le chiavi della stanza Maxiemergenze nel primo cassetto del bancone del triage.',
        'Nella stanza c’è l’armadio con tute, maschere, cerotto e calzature per chi esegue la decontaminazione.',
        'Vestizione degli addetti secondo la sequenza NBCR prima di toccare il paziente.',
        'Un paziente alla volta; nessun contaminato entra nel DEA prima della decontaminazione.',
      ] },
      { titolo: 'Se i contaminati sono molti', righe: [
        'L’Unità di crisi aziendale può attivare, tramite la SOC Coordinamento maxiemergenze, la tenda DECO montata e gestita dalla Protezione civile.',
        'Per altri DPI si passa dalla stessa via.',
        'Catena di comando, DSS-H e aree speciali come nel PEIMAF convenzionale; i ruoli hanno azioni NBCRe da fare per prime (card «Ruoli e schede di azione»).',
      ] },
      { titolo: 'Vestizione e svestizione (tape SISmax)', righe: [
        'Vestizione: sottotuta → tuta fino ai fianchi → stivali → braccia nelle maniche con linguetta al pollice → primo paio di guanti in lattice sigillati alla tuta → cerniera fino allo sterno → maschera senza filtro (antiappannante, prova di tenuta) → cappuccio e cerniere fino al collo → nastro tra maschera e tuta → secondo paio di guanti cat. 3 sigillati → filtro avvitato dopo aver tolto i sigilli → controllo visivo e ingresso in Area arancio.',
        'Svestizione (con l’operatore DECO): nastro della maschera → stivali nei contenitori → guanti cat. 3 sfilati dall’operatore DECO → cerniera e cappuccio aperti toccando solo l’esterno → tuta sfilata fino al tronco, poi gli arti inferiori restando con i piedi dentro la tuta → un passo in Area gialla → maschera tolta dal filtro con un unico movimento all’indietro → secondo paio di guanti → DPI e rifiuti nei contenitori → doccia.',
        'Tempi: DECO primaria 5 min, secondaria 5 min, deambulanti 5 min, non deambulanti 20 min.',
      ] },
    ],
  },
  {
    id: 'maxiemergenza', nome: 'Maxiemergenza: triage di massa (START e FAST)', gruppo: 'Maxiemergenza',
    sintesi: 'Scheda sanitaria regionale: START all’ingresso (T1 rosso, T2 giallo, T3 verde, T4 blu), FAST per la rivalutazione e l’uscita. Una scheda per paziente, che lo identifica e registra le manovre.',
    fonte: 'DOC.DS.03 rev. 3 (09/02/2022), par. 6.2.2 e 6.3.6, Allegato 2 (scheda sanitaria PMA); PS.DRO.62 rev. 1',
    link: [
      { etichetta: '📄 Scheda di triage regionale', href: 'docs/asl/DOC.DS.03-allegato-2-scheda-triage.pdf', primario: true },
      { etichetta: 'PEIMAF: allarme e comando', href: '/percorsi?apri=peimaf' },
    ],
    blocchi: [
      { titolo: 'Principi', righe: [
        'Obiettivo: il massimo beneficio per il maggior numero di persone, non il massimo per il singolo.',
        'Solo manovre salvavita durante il triage: apertura delle vie aeree, controllo delle emorragie (tourniquet), posizione laterale.',
        'Triage START all’arrivo (primario sul posto, secondario all’ingresso del PMA o del PS); FAST per rivalutare e al momento dell’uscita/trasferimento.',
        'Ogni paziente ha la sua scheda regionale (identificazione, manovre, destinazione) ed è registrato su First Aid Web; ritriage continuo.',
        'NBCRe: triage dopo la decontaminazione, alle postazioni FAST all’uscita del corridoio DECO (card «PEIMAF NBCRe»).',
      ] },
    ],
  },
]
