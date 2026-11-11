/*
 * Algoritmi visivi delle linee guida (diagramma a blocchi verticale).
 * STEMI: ESC 2023 + ACC/AHA 2025, adattato a un PS con emodinamica h24 (Prato): solo PCI primaria, niente fibrinolisi.
 * Dosi per adulto di 70 kg con il numero di fiale/compresse; verificare i formati in reparto.
 */

export type Tono = 'avvio' | 'passo' | 'decisione' | 'allarme' | 'terapia' | 'esito' | 'nota' | 'checklist'

export type Nodo =
  | { tipo: Tono; titolo: string; righe?: string[]; tempo?: string; /** titolo di una sezione del riassunto da aprire */ vedi?: string; /** id delle manovre illustrate (lib/manovre) */ manovre?: string[]; /** collegamenti ad altre pagine dell'app, con ritorno */ vai?: { etichetta: string; to: string }[] }
  | { tipo: 'rami'; rami: Ramo[] }

/** fine: il ramo termina qui (non prosegue nel flusso principale). */
export interface Ramo { etichetta: string; tono?: 'si' | 'no' | 'neutro'; nodi: Nodo[]; fine?: string }

export const ALGORITMI: Record<string, { titolo: string; nota?: string; nodi: Nodo[] }> = {
  otite: {
    titolo: 'Algoritmo otalgia',
    nota: 'AAO-HNS 2014, NICE NG91. Adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore all’orecchio', righe: ['Otoscopia, padiglione, mastoide, nervo facciale, linfonodi, ATM e denti (dolore riferito).'] },
      { tipo: 'decisione', titolo: 'Dove sta il problema?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Condotto', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Otite esterna', righe: ['Dolore al trago e alla trazione del padiglione.'] },
              { tipo: 'terapia', titolo: 'Gocce 7 giorni', righe: ['Chinolonico ± cortisone; analgesia. Antibiotico per bocca solo se cellulite o diabete/immunodepresso.'] },
            ],
          },
          {
            etichetta: 'Timpano', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Otite media', righe: ['Timpano estroflesso, opaco, arrossato; otorrea se perforato.'] },
              { tipo: 'terapia', titolo: 'Analgesia ± amoxicillina', righe: ['Amoxicillina (Zimox) 1 g ogni 8 h per 5–7 giorni se grave o non migliora in 3 giorni.'] },
            ],
          },
          {
            etichetta: 'Normale', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Dolore riferito', righe: ['Denti, ATM, faringe, collo; zoster (vescicole).'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Segni di complicanza?', righe: ['Gonfiore dietro l’orecchio, padiglione spostato, paralisi del facciale, vertigine, cefalea con febbre, anziano diabetico con dolore notturno e granulazioni.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'TC e ORL', righe: ['Mastoidite, otite necrotizzante, complicanze intracraniche: antibiotico ev.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Dimissione', vai: [{ etichetta: 'Otite esterna', to: '/dimissioni?apri=otite-esterna' }, { etichetta: 'Otite media', to: '/dimissioni?apri=otite-media' }] }] },
        ],
      },
    ],
  },
  sinusite: {
    titolo: 'Algoritmo rinosinusite acuta',
    nota: 'EPOS 2020. Adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Congestione, rinorrea, dolore facciale, iposmia' },
      { tipo: 'decisione', titolo: 'Segni di complicanza?', righe: ['Edema o arrossamento periorbitario, diplopia, calo del visus, proptosi, cefalea intensa, meningismo, deficit, confusione.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'TC con contrasto, ORL e oculista', righe: ['Ceftriaxone (Rocefin) 2 g ev ± metronidazolo (Flagyl) 500 mg ogni 8 h; ricovero.'] }], fine: 'ricovero' },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'decisione', titolo: 'Batterica probabile? (≥ 3 criteri)', righe: ['Secrezione purulenta, dolore locale forte, febbre > 38 °C, PCR/VES alte, peggioramento dopo un miglioramento.'] }] },
        ],
      },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Sintomatica', righe: ['Lavaggi nasali, mometasone spray (Nasonex), analgesici. Senza antibiotico.'] }] },
          { etichetta: 'Sì', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Antibiotico', righe: ['Amoxicillina/clavulanato (Augmentin) 875/125 mg ogni 12 h per 5–7 giorni + terapia sintomatica.'] }] },
        ],
      },
      { tipo: 'esito', titolo: 'Dimissione', vai: [{ etichetta: 'Dimissione sinusite', to: '/dimissioni?apri=sinusite' }] },
    ],
  },
  'paralisi-bell': {
    titolo: 'Algoritmo paralisi del facciale',
    nota: 'AAO-HNS 2013. Adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Asimmetria del viso acuta', righe: ['Ora di esordio; vescicole; otalgia; altri sintomi neurologici.'], vai: [{ etichetta: 'Anamnesi', to: '/anamnesi?apri=paralisi-faciale' }] },
      { tipo: 'decisione', titolo: 'Corruga la fronte dal lato colpito?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì (fronte risparmiata)', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Centrale: percorso ictus', righe: ['NIHSS, glicemia, TC.'], vai: [{ etichetta: 'Codice ictus', to: '/linee-guida/ictus' }] }], fine: 'codice ictus' },
          { etichetta: 'No (tutta l’emifaccia)', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Periferica' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Segni d’allarme o altra causa?', righe: ['Altri nervi cranici o deficit, bilaterale, esordio lento, massa parotidea, otite o otorrea, trauma, vescicole (Ramsay Hunt).'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'passo', titolo: 'Causa specifica', righe: ['TC/RM, ORL o neurologo. Ramsay Hunt: cortisone + valaciclovir (Zelitrex) 1 g ogni 8 h per 7 giorni.'] }] },
          {
            etichetta: 'No: Bell', tono: 'si', nodi: [
              { tipo: 'terapia', titolo: 'Prednisone entro 72 h', righe: ['Prednisone (Deltacortene) 60 mg per 5 giorni, poi scalare in 5 giorni.', 'Forma grave: valaciclovir come opzione.'] },
            ],
          },
        ],
      },
      { tipo: 'checklist', titolo: 'Occhio', righe: ['Lacrime artificiali ogni 1–2 h', 'Gel oftalmico e occlusione la notte', 'Oculista se dolore, rossore, calo del visus'] },
      { tipo: 'esito', titolo: 'Dimissione; ORL/neurologo se non migliora in 3 mesi', vai: [{ etichetta: 'Dimissione Bell', to: '/dimissioni?apri=paralisi-bell' }] },
    ],
  },
  'occhio-rosso': {
    titolo: 'Algoritmo occhio rosso',
    nota: 'AAO PPP. Visus sempre misurato.',
    nodi: [
      { tipo: 'avvio', titolo: 'Occhio rosso', righe: ['Visus, pupilla, fluoresceina, eversione palpebra.'], vai: [{ etichetta: 'Anamnesi', to: '/anamnesi?apri=occhio-rosso' }] },
      { tipo: 'decisione', titolo: 'Ustione chimica?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Irrigare subito', righe: ['Almeno 30 min fino a pH 7–7,5, poi oculista.'] }], fine: 'oculista' },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'decisione', titolo: 'Segni d’allarme?', righe: ['Calo del visus, dolore vero, fotofobia, iperemia perilimbare, pupilla anomala, cornea opaca, trauma penetrante, lenti a contatto con lesione, zoster V1.'] }] },
        ],
      },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Oculista urgente', righe: ['Pupilla media fissa e cornea opaca = glaucoma acuto: acetazolamide (Diamox) 500 mg ev/os + timololo (Timoptol) 0,5% 1 goccia.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Probabile congiuntivite o emorragia sottocongiuntivale', righe: ['Purulenta: tobramicina (Tobral) collirio. Virale: igiene e lacrime. Allergica: ketotifene (Zaditen).'] },
            ],
          },
        ],
      },
      { tipo: 'esito', titolo: 'Dimissione', vai: [{ etichetta: 'Congiuntivite', to: '/dimissioni?apri=congiuntivite' }, { etichetta: 'Corpo estraneo', to: '/dimissioni?apri=corpo-estraneo-occhio' }] },
    ],
  },
  orchiepididimite: {
    titolo: 'Algoritmo scroto acuto',
    nota: 'EAU 2025. Adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore scrotale acuto', righe: ['Ora di esordio; vomito; trauma; sintomi urinari; rapporti a rischio.'], vai: [{ etichetta: 'Anamnesi', to: '/anamnesi?apri=scroto' }] },
      { tipo: 'decisione', titolo: 'Torsione possibile? (TWIST)', righe: ['Esordio improvviso, vomito, testicolo alto/orizzontale, cremasterico assente.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'TWIST ≥ 5 o dubbio', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Urologo subito', tempo: '< 6 h', righe: ['Esplorazione chirurgica; l’ecodoppler non deve ritardare.'] }], fine: 'sala operatoria' },
          { etichetta: 'Basso', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Probabile orchiepididimite', righe: ['Esame urine, urinocoltura, test per gonococco e clamidia; ecodoppler se dubbio.'] }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Origine probabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sessuale', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone + doxiciclina', righe: ['Ceftriaxone (Rocefin) 1 g im + doxiciclina (Bassado) 100 mg ogni 12 h per 10–14 giorni.'] }] },
          { etichetta: 'Urinaria', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Chinolonico', righe: ['Levofloxacina (Tavanic) 500 mg al giorno per 10 giorni.'] }] },
        ],
      },
      { tipo: 'esito', titolo: 'Dimissione; ricovero se sepsi o ascesso', vai: [{ etichetta: 'Dimissione', to: '/dimissioni?apri=orchiepididimite' }, { etichetta: 'Antibiotici', to: '/antibiotici?apri=orchiepididimite' }] },
    ],
  },
  'infezione-urinaria': {
    titolo: 'Algoritmo infezioni urinarie',
    nota: 'EAU 2025. Adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sintomi urinari ± febbre', righe: ['Disuria, pollachiuria, urgenza, dolore sovrapubico; febbre, dolore al fianco, brividi.'] },
      { tipo: 'decisione', titolo: 'Quadro?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Cistite donna', tono: 'si', nodi: [
              { tipo: 'terapia', titolo: 'Senza coltura', righe: ['Fosfomicina (Monuril) 3 g dose unica o nitrofurantoina (Neofuradantin) 100 mg ogni 12 h per 5 giorni.'] },
            ],
          },
          {
            etichetta: 'Uomo', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Complicata', righe: ['Urinocoltura; 7 giorni. Febbre/dolore perineale → prostatite.'], vai: [{ etichetta: 'Prostatite', to: '/antibiotici?apri=prostatite' }] },
            ],
          },
          {
            etichetta: 'Febbre e fianco', tono: 'no', nodi: [
              { tipo: 'passo', titolo: 'Pielonefrite', righe: ['Urinocoltura (± emocolture), creatinina, PCR; ecografia se colica, calcoli, monorene o non risponde.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Pielonefrite: sepsi, vomito, ostruzione, gravidanza?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Ricovero', righe: ['Ceftriaxone 2 g ev; idronefrosi infetta → urologo per drenaggio.'], vai: [{ etichetta: 'Sepsi', to: '/linee-guida/sepsi' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Domicilio', righe: ['Ciprofloxacina (Ciproxin) 500 mg ogni 12 h per 7 giorni, o ceftriaxone 1–2 g poi orale secondo coltura.'], vai: [{ etichetta: 'Dimissione pielonefrite', to: '/dimissioni?apri=pielonefrite' }] }] },
        ],
      },
      { tipo: 'nota', titolo: 'Batteriuria asintomatica', righe: ['Non trattare (salvo gravidanza o procedure urologiche); non spiega da sola febbre o confusione nell’anziano.'] },
    ],
  },
  'gastrite-dispepsia': {
    titolo: 'Algoritmo dolore epigastrico / dispepsia',
    nota: 'ACG/CAG 2017.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore o bruciore epigastrico' },
      { tipo: 'checklist', titolo: 'Escludere', righe: ['SCA: ECG, troponina se dubbio (HEART)', 'Colica biliare, colecistite (Murphy, eco)', 'Pancreatite (lipasi)', 'Ulcera perforata (addome acuto, aria libera)', 'Aneurisma aortico (> 60 anni, eco)'] },
      { tipo: 'decisione', titolo: 'Segni d’allarme o ≥ 60 anni con sintomi nuovi?', righe: ['Sanguinamento, anemia, calo di peso, disfagia, vomito persistente, massa, ittero.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sanguinamento', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA emorragia digestiva', vai: [{ etichetta: 'Emorragia digestiva', to: '/linee-guida/emorragia-digestiva' }] }] },
          { etichetta: 'Altri allarmi', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Gastroscopia', righe: ['Urgente o programmata secondo il quadro.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Inibitore di pompa', righe: ['Pantoprazolo (Pantorc) 40 mg per 4–8 settimane; test per H. pylori dal curante; stop FANS.'], vai: [{ etichetta: 'Dimissione gastrite', to: '/dimissioni?apri=gastrite' }] }] },
        ],
      },
    ],
  },
  reflusso: {
    titolo: 'Algoritmo reflusso gastroesofageo',
    nota: 'ACG 2022.',
    nodi: [
      { tipo: 'avvio', titolo: 'Pirosi, rigurgito, dolore retrosternale' },
      { tipo: 'decisione', titolo: 'Dolore toracico?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'passo', titolo: 'Prima escludere la causa cardiaca', righe: ['ECG, troponina, HEART.'], vai: [{ etichetta: 'NSTE-SCA', to: '/linee-guida/nste-sca' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Sintomi tipici' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Allarme?', righe: ['Disfagia, odinofagia, sanguinamento, anemia, calo di peso, vomito ricorrente; bolo impattato.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Gastroscopia', righe: ['Urgente se bolo impattato (non deglutisce la saliva) o sanguinamento.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Inibitore di pompa 8 settimane', righe: ['Pantoprazolo (Pantorc) 40 mg 30–60 min prima della colazione; alginato (Gaviscon) al bisogno; stile di vita.'], vai: [{ etichetta: 'Dimissione reflusso', to: '/dimissioni?apri=reflusso' }] }] },
        ],
      },
    ],
  },
  'trauma-maggiore': {
    titolo: 'Algoritmo trauma maggiore',
    nota: 'Linea guida europea 2023, ATLS. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Trauma maggiore', righe: ['Team in sala, preallerta emoteca, timer dall’ora del trauma.'] },
      {
        tipo: 'checklist', titolo: '<C>ABCDE',
        righe: [
          '<C> Emorragia esterna: compressione, laccio emostatico',
          'A Vie aeree + rachide cervicale in linea',
          'B Torace: pneumotorace iperteso → decompressione; emotorace → drenaggio',
          'C Due accessi grossi o intraossea; eFAST; fascia pelvica se bacino sospetto',
          'D GCS, pupille, glicemia',
          'E Esporre, riscaldare',
        ],
        vai: [{ etichetta: 'Decompressione', to: '/procedure?apri=decompressione' }, { etichetta: 'Drenaggio', to: '/procedure?apri=tubo' }, { etichetta: 'Intraossea', to: '/procedure?apri=io' }],
      },
      { tipo: 'decisione', titolo: 'Shock emorragico?', righe: ['PAS < 90, FC > 120, shock index > 1, lattato alto, eFAST positiva.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Rianimazione emostatica',
                righe: [
                  'Acido tranexamico (Tranex) 1 g in 10 min entro 3 h, poi 1 g in 8 h.',
                  'Emazie e plasma presto; fibrinogeno 3–4 g se < 1,5 g/L; calcio.',
                  'PAS 80–90 (PAM ≥ 80 se trauma cranico grave).',
                  'Antagonizzare gli anticoagulanti.',
                ],
              },
              { tipo: 'allarme', titolo: 'Controllo dell’emorragia', righe: ['Non risponde: sala operatoria o radiologia interventistica senza TC.', 'Risponde: TC total body.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'TC total body', righe: ['Se meccanismo ad alta energia o lesioni multiple.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'GCS ≤ 8 o vie aeree a rischio?' },
      {
        tipo: 'allarme', titolo: 'Intubazione',
        righe: ['Evitare ipossia e ipotensione; normocapnia. Segni di erniazione: neurochirurgo di Careggi.'],
        vai: [{ etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }],
      },
      { tipo: 'esito', titolo: 'Destinazione', righe: ['Sala operatoria, terapia intensiva o trasferimento al trauma center (Careggi).'] },
    ],
  },
  'post-rosc': {
    titolo: 'Algoritmo dopo la ROSC',
    nota: 'ERC-ESICM 2025. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ritorno del circolo', righe: ['Annotare l’ora nel timer ACR.'], vai: [{ etichetta: 'Timer ACR', to: '/acr' }] },
      {
        tipo: 'checklist', titolo: 'A-B: vie aeree e respiro',
        righe: ['Intubazione se in coma', 'Ossigeno 100% poi SpO₂ 94–98%', 'Normocapnia (EtCO₂ e EGA)', 'Volume corrente 6–8 mL/kg (420–560 mL)'],
      },
      {
        tipo: 'checklist', titolo: 'C: circolo',
        righe: ['Accesso arterioso', 'PAS > 100 o PAM > 60–65', 'Liquidi, noradrenalina 2,5 mL/h (2 fiale da 2 mg in 50 mL)', 'ECG a 12 derivazioni', 'Eco al letto'],
      },
      { tipo: 'decisione', titolo: 'Causa cardiaca probabile?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'STEMI', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Coronarografia subito', righe: ['Emodinamica di Prato.'], vai: [{ etichetta: 'STEMI', to: '/linee-guida/stemi' }] }],
          },
          {
            etichetta: 'Sì, senza ST', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Coronarografia urgente', righe: ['Se instabile o alta probabilità di occlusione; altrimenti con il cardiologo.'] }],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'TC encefalo e torace', righe: ['Emorragia cerebrale, embolia polmonare, dissezione.'] }],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'D-E: cervello e resto',
        righe: [
          'Temperatura ≤ 37,5 °C per 72 h (niente febbre)',
          'Glicemia 140–180 mg/dL',
          'Crisi epilettiche: trattare, EEG',
          'Sedazione e analgesia',
          'Niente prognosi in PS',
        ],
      },
      { tipo: 'esito', titolo: 'Terapia intensiva o emodinamica' },
    ],
  },
  'oppioidi-benzodiazepine': {
    titolo: 'Algoritmo coma da oppioidi o benzodiazepine',
    nota: 'AHA 2023. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sopore con respiro lento o miosi', righe: ['Glicemia capillare subito. Cercare: trauma, co-ingestioni, paracetamolo.'] },
      { tipo: 'decisione', titolo: 'Respira (FR ≥ 10, SpO₂ ok)?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Ventilare con pallone e maschera', righe: ['Naloxone (Narcan) 0,4 mg ev/im (1 fiala); ripetere fino a 2 mg e oltre per oppioidi sintetici.', 'Arresto: ALS.'], vai: [{ etichetta: 'Timer ACR', to: '/acr' }] },
            ],
          },
          {
            etichetta: 'Sì ma lento', tono: 'neutro', nodi: [
              { tipo: 'terapia', titolo: 'Naloxone a piccole dosi', righe: ['0,04–0,1 mg ev ogni 2–3 min (fiala da 0,4 mg in 10 mL: 1–2,5 mL) fino a FR ≥ 10.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Risponde al naloxone?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Osservazione 2–4 h', righe: ['Recidiva o oppioide a lunga durata: infusione con 2/3 della dose efficace ogni ora.'] }] },
          {
            etichetta: 'No', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Probabili benzodiazepine o altro', righe: ['Supporto respiratorio. Flumazenil (Anexate) 0,2 mg ev solo se nessun rischio di convulsioni (non abituato, niente triciclici, niente epilessia).'] },
            ],
          },
        ],
      },
      { tipo: 'esito', titolo: 'Tossicologia, valutazione psichiatrica se intenzionale', vai: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }] },
    ],
  },
  monossido: {
    titolo: 'Algoritmo intossicazione da monossido di carbonio',
    nota: 'ACEP 2017, UHMS.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sospetto CO', righe: ['Cefalea, nausea, vertigini, sincope; più persone coinvolte; braciere, stufa, caldaia, incendio.'] },
      { tipo: 'terapia', titolo: 'Ossigeno 100% subito', righe: ['Maschera con reservoir 15 L/min o ventilazione.'] },
      { tipo: 'checklist', titolo: 'Esami', righe: ['EGA con COHb e lattati (il saturimetro sbaglia)', 'ECG e troponina', 'Test di gravidanza', 'Esame neurologico'] },
      { tipo: 'decisione', titolo: 'Criteri per l’iperbarica?', righe: ['Perdita di coscienza, deficit neurologici, COHb > 25% (> 15% in gravidanza), ischemia miocardica, acidosi grave.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Tossicologia e centro iperbarico', righe: ['Incendio con coma/lattato alto: idrossocobalamina (Cyanokit) 5 g in 15 min.'], vai: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Ossigeno fino a COHb < 3% e asintomatico', righe: ['Avvisare dei sintomi neurologici tardivi; verificare la sorgente prima del rientro a casa.'] }] },
        ],
      },
    ],
  },
  digossina: {
    titolo: 'Algoritmo intossicazione da digossina',
    nota: 'AHA 2023.',
    nodi: [
      { tipo: 'avvio', titolo: 'In terapia con digossina e sintomi', righe: ['Nausea, disturbi visivi, confusione, bradicardia, aritmie.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Monitor ECG', 'Digossinemia (≥ 6 h dall’ultima dose)', 'K, Mg, creatinina', 'Sospendere digossina e farmaci che la aumentano (amiodarone, verapamil)'] },
      { tipo: 'decisione', titolo: 'Criteri per gli anticorpi antidigossina?', righe: ['Aritmie pericolose, K > 5,0 nell’acuta, ipoperfusione d’organo, arresto.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'DigiFab', righe: ['Acuta/arresto: 10 flaconi. Cronica: 3–6 flaconi. Tramite Tossicologia di Careggi.'], vai: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Supporto', righe: ['Correggere K e Mg; atropina se bradicardia; monitor.'] }] },
        ],
      },
    ],
  },
  'astinenza-alcolica': {
    titolo: 'Algoritmo astinenza alcolica',
    nota: 'ASAM 2020. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ultimo bicchiere da 6–96 h', righe: ['Tremore, sudorazione, ansia, tachicardia, allucinazioni, convulsioni.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Glicemia', 'Tiamina (Benerva) 200 mg ev prima del glucosio', 'Escludere trauma cranico, infezione, encefalopatia epatica, altre sostanze', 'Mg, K, fosforo'] },
      { tipo: 'decisione', titolo: 'CIWA-Ar?' },
      {
        tipo: 'rami', rami: [
          { etichetta: '< 10', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Lieve', righe: ['Supporto; ricontrollo CIWA ogni 4 h.'] }] },
          { etichetta: '10–18', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Diazepam (Valium) 10–20 mg', righe: ['Per bocca o ev; ripetere ogni 1–2 h finché CIWA < 10.'] }] },
          { etichetta: '≥ 19 o DT', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Grave', righe: ['Diazepam 10–20 mg ev ogni 5–10 min fino a sedazione leggera. Refrattario: terapia intensiva (fenobarbital o propofol).'] }] },
        ],
      },
      { tipo: 'nota', titolo: 'Wernicke?', righe: ['Confusione, atassia, oftalmoplegia: tiamina 500 mg ev 3 volte al giorno.'] },
    ],
  },
  meningite: {
    titolo: 'Algoritmo sospetta meningite batterica',
    nota: 'NICE 2024, ESCMID. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre + cefalea, rigidità, alterazione della coscienza o petecchie', righe: ['Emocolture subito.'] },
      { tipo: 'decisione', titolo: 'TC prima della rachicentesi?', righe: ['Deficit focali, crisi nuove, GCS < 10, immunodepressione grave, papilledema.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Prima terapia, poi TC', tempo: '≤ 60 min', righe: ['Desametasone + antibiotico subito, poi TC e rachicentesi se sicura.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Rachicentesi subito', tempo: '≤ 60 min', righe: ['Se non eseguibile entro pochi minuti: terapia prima.'], vai: [{ etichetta: 'Rachicentesi', to: '/procedure?apri=rachicentesi' }] },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Terapia',
        righe: [
          'Desametasone (Soldesam) 10 mg ev prima o con l’antibiotico, poi ogni 6 h.',
          'Ceftriaxone (Rocefin) 2 g ev ogni 12 h.',
          '> 50 anni o immunodepresso: + ampicillina (Amplital) 2 g ogni 4 h.',
          'Encefalite sospetta: + aciclovir (Zovirax) 700 mg ev ogni 8 h.',
        ],
        vai: [{ etichetta: 'Antibiotici: meningite', to: '/antibiotici?apri=meningite' }],
      },
      { tipo: 'checklist', titolo: 'Dopo', righe: ['Shock: PDTA sepsi', 'Isolamento respiratorio per 24 h se meningococco possibile', 'Igiene pubblica per la profilassi dei contatti', 'Malattie infettive / terapia intensiva'], vai: [{ etichetta: 'Sepsi', to: '/linee-guida/sepsi' }] },
    ],
  },
  cefalea: {
    titolo: 'Algoritmo cefalea acuta',
    nota: 'ACEP 2019. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Cefalea in PS', righe: ['PA, temperatura, esame neurologico, fundus se possibile.'] },
      { tipo: 'decisione', titolo: 'Segni d’allarme?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Esordio improvviso', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA ESA', righe: ['Regola di Ottawa per ESA, TC.'], vai: [{ etichetta: 'ESA', to: '/linee-guida/esa' }] }] },
          { etichetta: 'Febbre, meningismo', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA meningite', vai: [{ etichetta: 'Meningite', to: '/linee-guida/meningite' }] }] },
          { etichetta: 'Altri', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'TC encefalo ± angio', righe: ['Deficit, > 50 anni nuova, anticoagulante, tumore, immunodepresso, Valsalva, gravidanza, papilledema.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Probabile primaria' }] },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Terapia',
        righe: [
          'Metoclopramide (Plasil) 10 mg ev in 15 min.',
          '± ketorolac (Toradol) 30 mg ev o paracetamolo 1 g ev.',
          'Emicrania: desametasone (Soldesam) 8–10 mg ev contro le recidive.',
          'Grappolo: ossigeno 12–15 L/min per 15 min.',
          'Evitare gli oppioidi.',
        ],
      },
      { tipo: 'esito', titolo: 'Dimissione se risolta e senza segni d’allarme', vai: [{ etichetta: 'Dimissione cefalea', to: '/dimissioni?apri=cefalea' }] },
    ],
  },
  delirium: {
    titolo: 'Algoritmo delirium',
    nota: 'NICE CG103 (2023).',
    nodi: [
      { tipo: 'avvio', titolo: 'Confusione acuta o fluttuante', righe: ['4AT: ≥ 4 probabile delirium.'] },
      {
        tipo: 'checklist', titolo: 'Cause (cercarle tutte)',
        righe: [
          'Glicemia, SpO₂, temperatura',
          'Infezione (urine, polmone, cute)',
          'Farmaci nuovi o sospesi (anticolinergici, oppioidi, benzodiazepine)',
          'Ritenzione urinaria, fecaloma, dolore',
          'Disidratazione, Na, Ca, creatinina',
          'Astinenza da alcol o benzodiazepine',
          'Ictus, trauma cranico (TC se dubbio)',
        ],
      },
      { tipo: 'terapia', titolo: 'Senza farmaci', righe: ['Orientamento, familiari, occhiali e apparecchi acustici, luce, niente contenzioni, niente spostamenti inutili.'] },
      { tipo: 'decisione', titolo: 'Agitazione pericolosa o grave sofferenza?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Aloperidolo (Serenase) 0,5–1 mg', righe: ['Ev o im, ripetibile dopo 30–60 min; max 5 mg/die. Parkinson/Lewy: quetiapina 12,5–25 mg per bocca.'], vai: [{ etichetta: 'Sedazione: agitato', to: '/sedazione?apri=agitato' }] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Solo misure non farmacologiche' }] },
        ],
      },
    ],
  },
  sincope: {
    titolo: 'Algoritmo sincope',
    nota: 'ESC 2018.',
    nodi: [
      { tipo: 'avvio', titolo: 'Perdita di coscienza transitoria', righe: ['Era sincope? Escludere crisi epilettica, trauma cranico, intossicazione, ipoglicemia.'] },
      { tipo: 'checklist', titolo: 'A tutti', righe: ['Anamnesi (prodromi, posizione, sforzo, palpitazioni)', 'PA sdraiato e in piedi a 3 min', 'ECG a 12 derivazioni', 'Glicemia; test di gravidanza'] },
      { tipo: 'decisione', titolo: 'Causa grave evidente?', righe: ['Aritmia, SCA, embolia polmonare, dissezione, emorragia (digestiva, extrauterina, aneurisma).'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'PDTA della causa' }], fine: 'trattare la causa' },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'decisione', titolo: 'Rischio (ESC, Canadian Syncope Risk Score)' }] },
        ],
      },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Basso', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Dimissione', vai: [{ etichetta: 'Vasovagale', to: '/dimissioni?apri=sincope-vasovagale' }, { etichetta: 'Ortostatica', to: '/dimissioni?apri=sincope-ortostatica' }] }] },
          { etichetta: 'Intermedio', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Osservazione con monitor', righe: ['Fino a 6 h, troponina, eco; percorso ambulatoriale rapido.'] }] },
          { etichetta: 'Alto', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Monitor e ricovero', righe: ['Cardiologo; telemetria; eco.'] }] },
        ],
      },
    ],
  },
  extrauterina: {
    titolo: 'Algoritmo sospetta gravidanza extrauterina',
    nota: 'NICE NG126 (2023).',
    nodi: [
      { tipo: 'avvio', titolo: 'Donna in età fertile con dolore addominale, perdite ematiche, sincope o shock', righe: ['Test di gravidanza subito.'] },
      { tipo: 'decisione', titolo: 'Positivo e instabile (o liquido libero abbondante)?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Emorragia', righe: ['Due accessi grossi, emoderivati, acido tranexamico non di routine; ginecologo di guardia per la sala subito.'], vai: [{ etichetta: 'Rubrica: ginecologia', to: '/rubrica' }] },
            ],
            fine: 'sala operatoria',
          },
          {
            etichetta: 'No, stabile', tono: 'si', nodi: [
              { tipo: 'checklist', titolo: 'Esami', righe: ['β-hCG quantitativa', 'Emocromo, gruppo e Rh', 'Ecografia transvaginale (ginecologo)'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Ecografia?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Gravidanza intrauterina', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Extrauterina molto improbabile' }] },
          { etichetta: 'Sede sconosciuta', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'β-hCG a 48 h con il ginecologo', righe: ['Istruzioni chiare per il ritorno.'] }] },
          { etichetta: 'Extrauterina', tono: 'no', nodi: [{ tipo: 'passo', titolo: 'Metotrexato, chirurgia o attesa', righe: ['Decide il ginecologo; anti-D 250 UI se Rh negativo e chirurgia.'], vedi: 'Trattamento (decide il ginecologo)' }] },
        ],
      },
    ],
  },
  preeclampsia: {
    titolo: 'Algoritmo preeclampsia / eclampsia',
    nota: 'NICE NG133 (2023). Magnesio solfato fiale da 1 g/10 mL.',
    nodi: [
      { tipo: 'avvio', titolo: 'Gravidanza ≥ 20 settimane o puerperio con PA ≥ 140/90', righe: ['Cefalea, disturbi visivi, dolore epigastrico, edemi, dispnea? Proteinuria? Ginecologo di guardia.'], vai: [{ etichetta: 'Rubrica: ginecologia', to: '/rubrica' }] },
      { tipo: 'decisione', titolo: 'Convulsioni?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Eclampsia', righe: ['Fianco sinistro, ossigeno. Magnesio solfato 4 g ev in 5–15 min (4 fiale), poi 1 g/h. Recidiva: altri 2 g.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'PA ≥ 160/110 o segni di gravità?' },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Abbassare la PA entro 1 h', tempo: '≤ 60 min',
        righe: ['Labetalolo (Trandate) 20 mg ev, poi 40 e 80 mg ogni 10 min (max 300 mg).', 'Asma: nifedipina (Adalat) 10 mg per bocca.', 'Obiettivo ≤ 135/85.'],
      },
      { tipo: 'terapia', titolo: 'Magnesio solfato nella forma grave', righe: ['4 g ev in 5–15 min, poi 1 g/h per 24 h.'] },
      {
        tipo: 'checklist', titolo: 'Monitoraggio',
        righe: ['PA ogni 15 min', 'Riflessi rotulei, FR, SpO₂ ogni ora', 'Catetere e diuresi; liquidi 80 mL/h', 'Esami: emocromo, transaminasi, LDH, creatinina, coagulazione', 'Tossicità: calcio gluconato 10% 10 mL'],
      },
      { tipo: 'esito', titolo: 'Ostetricia: il parto è la cura definitiva' },
    ],
  },
  'emorragia-cerebrale': {
    titolo: 'Algoritmo emorragia cerebrale spontanea',
    nota: 'AHA/ASA 2022. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'TC: emorragia intraparenchimale', righe: ['GCS, NIHSS, ora di esordio, farmaci (anticoagulanti, antiaggreganti) e ora dell’ultima dose.'] },
      {
        tipo: 'checklist', titolo: 'Subito',
        righe: [
          'Vie aeree: GCS ≤ 8 o vomito/aspirazione → intubazione',
          'Angio-TC (spot sign, malformazioni)',
          'Esami: emocromo, PT/INR, aPTT, fibrinogeno, creatinina, gruppo',
          'Testa a 30°, glicemia 80–180, temperatura',
          'ICH score per descrivere la gravità (non per limitare le cure)',
        ],
        vai: [{ etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }],
      },
      { tipo: 'decisione', titolo: 'Anticoagulato?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Dicumarolico', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'PCC + vitamina K', righe: ['INR ≥ 2: PCC 25–50 UI/kg (4–7 flaconi da 500 UI) + vitamina K (Konakion) 10 mg ev.'], vedi: 'Antagonizzare (70 kg)' },
            ],
          },
          {
            etichetta: 'DOAC', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'Antidoto', righe: ['Dabigatran (Pradaxa): idarucizumab (Praxbind) 5 g ev. Anti-Xa: PCC 50 UI/kg = 7 flaconi da 500 UI.'], vedi: 'Antagonizzare (70 kg)' },
            ],
          },
          {
            etichetta: 'No / antiaggregante', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Niente piastrine', righe: ['Salvo intervento neurochirurgico.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'PAS 150–220?' },
      {
        tipo: 'terapia', titolo: 'PAS 140 (130–150) entro 1 h', tempo: 'inizio ≤ 2 h',
        righe: ['Labetalolo (Trandate) 10–20 mg ev ogni 10 min o urapidil (Ebrantil) 10–25 mg ev, poi infusione. Gradualmente, senza oscillazioni; mai PAS < 130.'],
        vedi: 'Pressione arteriosa (70 kg)',
      },
      { tipo: 'decisione', titolo: 'Cerebellare con compressione, idrocefalo, effetto massa, peggioramento?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Neurochirurgo di Careggi subito', righe: ['Evacuazione o derivazione ventricolare.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Stroke unit / terapia intensiva', righe: ['TC di controllo entro 24 h o se peggiora.'] }] },
        ],
      },
    ],
  },
  esa: {
    titolo: 'Algoritmo cefalea improvvisa / emorragia subaracnoidea',
    nota: 'AHA/ASA 2023. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Cefalea improvvisa, al massimo in < 1 h', righe: ['Vigile? Applicare la regola di Ottawa per ESA.'] },
      { tipo: 'decisione', titolo: 'Ottawa negativa (nessun criterio)?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'ESA esclusa clinicamente', righe: ['Cercare altre cause.'] }], fine: 'altre cause' },
          { etichetta: 'No o non applicabile', tono: 'no', nodi: [{ tipo: 'passo', titolo: 'TC encefalo senza contrasto' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'TC?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sangue', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'ESA', righe: ['Angio-TC; neurochirurgia di Careggi.'] }] },
          { etichetta: 'Negativa ≤ 6 h', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'ESA esclusa', righe: ['Se TC di ultima generazione letta da radiologo esperto.'] }] },
          { etichetta: 'Negativa > 6 h', tono: 'neutro', nodi: [{ tipo: 'passo', titolo: 'Rachicentesi o angio-TC', righe: ['Rachicentesi almeno 12 h dall’esordio: xantocromia.'] }] },
        ],
      },
      {
        tipo: 'checklist', titolo: 'ESA confermata',
        righe: [
          'GCS ≤ 8 o vie aeree non protette → intubazione',
          'Antagonizzare gli anticoagulanti',
          'Nimodipina (Nimotop) 60 mg per bocca (2 cp da 30 mg) ogni 4 h',
          'PA controllata evitando ipotensione (spesso PAS < 160)',
          'Analgesia (paracetamolo 1 g ev, oppioide a basse dosi), antiemetico',
          'Idrocefalo con peggioramento → derivazione ventricolare',
          'No acido tranexamico, no antiepilettici in profilassi',
        ],
        vai: [{ etichetta: 'Anticoagulato che sanguina', to: '/linee-guida/anticoagulato-sanguinamento' }],
      },
      { tipo: 'esito', titolo: 'Trasferimento alla neurochirurgia di Careggi', righe: ['Comunicare GCS, deficit motorio (WFNS), ora di esordio, terapie.'] },
    ],
  },
  'anticoagulato-sanguinamento': {
    titolo: 'Algoritmo sanguinamento in anticoagulante',
    nota: 'ACC 2020. Dosi per 70 kg.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Paziente in anticoagulante che sanguina',
        righe: ['Quale farmaco, dose, ora dell’ultima assunzione, creatinina; antiaggreganti associati.'],
      },
      { tipo: 'decisione', titolo: 'Sanguinamento maggiore?', righe: ['Instabile, sede critica, Hb ↓ ≥ 2 g/dL, ≥ 2 unità di emazie.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Non maggiore', righe: ['Emostasi locale, sospensione temporanea, niente antidoto. Riprendere quando l’emostasi è ottenuta.'] },
            ],
            fine: 'nessun antidoto',
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'checklist', titolo: 'Maggiore: insieme',
                righe: [
                  'Sospendere anticoagulante e antiaggreganti',
                  'Due accessi grossi, prelievi (emocromo, PT/INR, aPTT, fibrinogeno, creatinina, gruppo)',
                  'Emostasi locale / endoscopia / chirurgia / radiologia interventistica',
                  'Trasfusione; carbone attivo se ultima dose < 2–4 h',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Quale anticoagulante?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Dicumarolico', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'PCC + vitamina K', righe: ['PCC 25–50 UI/kg secondo INR (4–7 flaconi da 500 UI) + vitamina K (Konakion) 5–10 mg ev lenta.'] }] },
          { etichetta: 'Dabigatran', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Idarucizumab 5 g ev', righe: ['2 flaconi da 2,5 g; dialisi se non disponibile.'] }] },
          { etichetta: 'Anti-Xa', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'PCC 50 UI/kg = 7 flaconi da 500 UI', righe: ['Apixaban (Eliquis), rivaroxaban (Xarelto), edoxaban (Lixiana).'] }] },
          { etichetta: 'Eparine', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Protamina', righe: ['1 mg ogni 100 UI di eparina (ultime 2–3 h) o per mg di enoxaparina (< 8 h); max 50 mg.'] }] },
        ],
      },
      {
        tipo: 'esito', titolo: 'Dopo l’emostasi',
        righe: ['Rivalutare indicazione e ripresa con lo specialista: digestivo spesso in 1–2 settimane, intracranico ≥ 4 settimane.'],
      },
    ],
  },
  'nste-sca': {
    titolo: 'Algoritmo dolore toracico senza sopraslivellamento ST',
    nota: 'ESC 2023. Dosi per 70 kg. Prato ha l’emodinamica.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore toracico sospetto', righe: ['ECG entro 10 min. STEMI o equivalente → PDTA STEMI.'], vai: [{ etichetta: 'STEMI', to: '/linee-guida/stemi' }] },
      { tipo: 'decisione', titolo: 'Rischio molto alto?', righe: ['Shock/instabilità, dolore refrattario, aritmie maligne o arresto, complicanze meccaniche, scompenso acuto, ST sopraslivellato intermittente.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Coronarografia immediata', tempo: '< 2 h', righe: ['ASA 250 mg ev (mezzo flacone di Flectadol 500) o 300 mg per bocca; eparina 5.000–7.000 UI ev (1–1,4 mL della fiala 25.000 UI/5 mL). Emodinamista subito.'] },
            ],
            fine: 'emodinamica',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Troponina hs 0/1 h (o 0/2 h)', righe: ['Diagnosi differenziale: dissezione, embolia, pericardite. Eco al letto.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Troponina' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Esclusa', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'Infarto escluso', righe: ['HEART per decidere la dimissione e il percorso ambulatoriale.'], vai: [{ etichetta: 'Dimissione dolore toracico', to: '/dimissioni?apri=dolore-toracico' }] },
            ],
          },
          {
            etichetta: 'Zona grigia', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Terzo prelievo a 3 h', righe: ['Eco; rivalutazione clinica.'] },
            ],
          },
          {
            etichetta: 'Confermata', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'NSTEMI: rischio alto', righe: ['Coronarografia entro 24 h.'] },
            ],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'Terapia NSTEMI',
        righe: [
          'ASA 150–300 mg per bocca',
          'Enoxaparina (Clexane) 70 mg sc ogni 12 h (o fondaparinux (Arixtra) 2,5 mg se coronarografia non precoce)',
          'P2Y12: decidere col cardiologo (non di routine se coronarografia < 24 h)',
          'Nitrati se dolore/ipertensione; metoprololo (Lopresor) 5 mg ev se tachicardico e iperteso senza scompenso',
          'Monitor ECG; ossigeno solo se SpO₂ < 90%',
        ],
      },
    ],
  },
  'dissezione-aortica': {
    titolo: 'Algoritmo sindrome aortica acuta',
    nota: 'ESC 2024. Dosi per 70 kg.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dolore toracico, dorsale o addominale sospetto', righe: ['Calcolare l’ADD-RS; eco al letto (flap, versamento pericardico, insufficienza aortica, radice dilatata).'] },
      { tipo: 'decisione', titolo: 'ADD-RS?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '0–1', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'D-dimero', righe: ['< 500 ng/mL: improbabile, cercare altre cause. Positivo → angio-TC.'] },
            ],
          },
          {
            etichetta: '2–3', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Angio-TC aorta subito' },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Mentre si conferma',
        righe: [
          '1. Analgesia: morfina 2–4 mg ev o fentanil (Fentanest) 50 µg.',
          '2. FC ≤ 60: labetalolo (Trandate) 20 mg ev poi 20–80 mg ogni 10 min o infusione; metoprololo (Lopresor) 5 mg ev in alternativa.',
          '3. Poi PAS 100–120: urapidil (Ebrantil) 10–25 mg ev poi infusione.',
          'Niente ASA, eparina o fibrinolitici.',
        ],
        vedi: 'Farmaci (70 kg)',
      },
      { tipo: 'decisione', titolo: 'Tipo?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'A (ascendente)', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Cardiochirurgia di Careggi', righe: ['Trasferimento immediato.'] }] },
          {
            etichetta: 'B (discendente)', tono: 'neutro', nodi: [
              { tipo: 'decisione', titolo: 'Complicata?', righe: ['Malperfusione, rottura, dolore o ipertensione refrattari, espansione rapida.'] },
              { tipo: 'passo', titolo: 'Sì: chirurgo vascolare per endoprotesi. No: terapia medica in terapia intensiva.' },
            ],
          },
        ],
      },
      {
        tipo: 'nota', titolo: 'Ipotensione',
        righe: ['Pensare a tamponamento, rottura, insufficienza aortica acuta. Drenaggio pericardico solo di piccoli volumi se la chirurgia non è subito disponibile.'],
        vai: [{ etichetta: 'Pericardiocentesi', to: '/procedure?apri=pericardiocentesi' }],
      },
    ],
  },
  asma: {
    titolo: 'Algoritmo asma acuto',
    nota: 'GINA 2025. Dosi per adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Dispnea con broncospasmo', righe: ['Gravità: parola, posizione, FR, FC, SpO₂, PEF. Anafilassi? → adrenalina im.'], vai: [{ etichetta: 'Anafilassi', to: '/linee-guida/anafilassi' }] },
      { tipo: 'decisione', titolo: 'Segni di pericolo di vita?', righe: ['Sopore, confusione, torace silente, bradicardia, ipotensione.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Rianimatore', righe: ['Salbutamolo (Broncovaleas) + ipratropio (Atem) continui, metilprednisolone (Solu-Medrol) 40 mg ev, magnesio 2 g ev; intubazione da esperto (ketamina).'], vai: [{ etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'checklist', titolo: 'Prima ora',
                righe: [
                  'Salbutamolo (Broncovaleas) 4–10 puff con distanziatore o 2,5–5 mg nebulizzato ogni 20 min',
                  'Grave: ipratropio (Atem) 0,5 mg nebulizzato ogni 20 min',
                  'Ossigeno per SpO₂ 93–95%',
                  'Prednisone (Deltacortene) 50 mg per bocca (o metilprednisolone (Solu-Medrol) 40 mg ev)',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Dopo 1 h: grave e senza risposta?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Magnesio solfato 2 g ev (2 fiale da 1 g) in 20 min', righe: ['Continuare salbutamolo (Broncovaleas); EGA; RX se sospetto pneumotorace; ricovero.'] }] },
          { etichetta: 'No, migliorato', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Dimissione se PEF > 60–80%, SpO₂ > 94%', righe: ['Prednisone (Deltacortene) 5–7 giorni, cortisone inalatorio iniziato o aumentato, controllo entro 2–7 giorni.'] }] },
        ],
      },
    ],
  },
  bpco: {
    titolo: 'Algoritmo BPCO riacutizzata',
    nota: 'GOLD 2026. Dosi per adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'BPCO con dispnea, tosse o espettorato aumentati', righe: ['EGA, RX torace, ECG, troponina e BNP se dubbio, D-dimero se sospetto embolia.'] },
      {
        tipo: 'checklist', titolo: 'Escludere ciò che la imita',
        righe: ['Polmonite', 'Scompenso', 'Embolia polmonare', 'Pneumotorace', 'SCA o aritmia'],
      },
      {
        tipo: 'terapia', titolo: 'Terapia',
        righe: [
          'Ossigeno per SpO₂ 88–92%.',
          'Salbutamolo (Broncovaleas) 2,5–5 mg + ipratropio (Atem) 0,5 mg nebulizzati (con aria se ipercapnico).',
          'Prednisone (Deltacortene) 40 mg per 5 giorni.',
          'Antibiotico se espettorato purulento + più volume o dispnea, o se ventilato.',
        ],
        vai: [{ etichetta: 'Antibiotici: BPCO', to: '/antibiotici?apri=bpco' }],
      },
      { tipo: 'decisione', titolo: 'EGA: pH ≤ 7,35 e PaCO₂ ≥ 45?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'NIV', righe: ['IPAP 12–15, EPAP 4–5; EGA dopo 1 h. Fallimento o controindicazioni → intubazione.'], vedi: 'Ventilazione e destinazione' },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Rivalutare', righe: ['Ricovero se dispnea grave, mancata risposta, insufficienza respiratoria, comorbidità; altrimenti dimissione.'], vai: [{ etichetta: 'Dimissione BPCO', to: '/dimissioni?apri=bpco' }] },
            ],
          },
        ],
      },
    ],
  },
  bradicardia: {
    titolo: 'Algoritmo bradicardia',
    nota: 'ERC 2025. Dosi per adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'FC bassa', righe: ['ABCDE, ossigeno, accesso venoso, ECG a 12 derivazioni, K, digossinemia se in terapia.'] },
      { tipo: 'decisione', titolo: 'Segni di pericolo?', righe: ['Shock, sincope, ischemia miocardica, scompenso.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'Atropina 0,5 mg ev', righe: ['Ripetere ogni 3–5 min fino a 3 mg. Inutile nel BAV avanzato a QRS largo.'] },
              { tipo: 'decisione', titolo: 'Risposta?' },
              {
                tipo: 'allarme', titolo: 'No: farmaci e pacing',
                righe: ['Isoprenalina 5 µg/min (0,2 mg in 50 mL: 75 mL/h) o adrenalina 2–10 µg/min (1 mg in 50 mL: 6–30 mL/h).', 'Pacing transcutaneo come ponte; cardiologo per il transvenoso.'],
                vai: [{ etichetta: 'Pacing', to: '/procedure?apri=pacing' }],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Rischio di asistolia?', righe: ['BAV Mobitz II, BAV completo a QRS largo, pause > 3 s, asistolia recente.'] },
              { tipo: 'passo', titolo: 'Sì: monitor e cardiologo per il pacing. No: osservare e cercare la causa.' },
            ],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'Cause da correggere',
        righe: [
          'Iperkaliemia → calcio gluconato',
          'Beta-bloccanti/calcio-antagonisti → glucagone (GlucaGen), calcio (Tossicologia)',
          'Digossina (Lanoxin) → anticorpi antidigossina',
          'IMA inferiore → coronarografia',
          'Ipotermia, ipotiroidismo, ipertensione endocranica',
        ],
        vai: [{ etichetta: 'Iperkaliemia', to: '/linee-guida/iperkaliemia' }, { etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }],
      },
    ],
  },
  tachicardia: {
    titolo: 'Algoritmo tachicardia con polso',
    nota: 'ERC 2025. Dosi per adulto.',
    nodi: [
      { tipo: 'avvio', titolo: 'FC alta con polso', righe: ['ABCDE, ossigeno, accesso venoso, ECG a 12 derivazioni, elettroliti.'] },
      { tipo: 'decisione', titolo: 'Segni di pericolo?', righe: ['Shock, sincope, ischemia miocardica, scompenso.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Cardioversione sincronizzata',
                righe: ['In sedazione, fino a 3 tentativi. FA: energia massima; flutter/TPSV 70–120 J; TV 120–150 J.', 'Fallisce: amiodarone (Cordarone) 300 mg in 10–20 min e ritentare.'],
                vai: [{ etichetta: 'Sedazione procedurale', to: '/sedazione?apri=procedurale' }],
              },
            ],
            fine: 'poi amiodarone (Cordarone) 900 mg/24 h',
          },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'decisione', titolo: 'QRS stretto o largo? Regolare?' }] },
        ],
      },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Stretto regolare', tono: 'neutro', nodi: [
              { tipo: 'terapia', titolo: 'Vagale, poi adenosina', righe: ['Valsalva modificata; adenosina (Krenosin) 6 → 12 → 18 mg in bolo rapido. Flutter: controllo della frequenza.'], vedi: 'Farmaci (70 kg)' },
            ],
          },
          {
            etichetta: 'Stretto irregolare', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Probabile FA', righe: ['Beta-bloccante o diltiazem; amiodarone (Cordarone)/digossina (Lanoxin) se scompenso.'], vai: [{ etichetta: 'Fibrillazione atriale', to: '/linee-guida/fibrillazione-atriale' }] },
            ],
          },
          {
            etichetta: 'Largo regolare', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: 'Considerarla TV', righe: ['Amiodarone (Cordarone) 300 mg in 10–60 min o cardioversione elettiva. Adenosina (Krenosin) solo se aberranza nota.'] },
            ],
          },
          {
            etichetta: 'Largo irregolare', tono: 'no', nodi: [
              { tipo: 'passo', titolo: 'FA con blocco di branca, FA preeccitata o torsione', righe: ['Preeccitata: no adenosina (Krenosin), digossina (Lanoxin), verapamil (Isoptin), diltiazem → cardioversione. Torsione: magnesio solfato 2 g ev (2 fiale da 1 g) in 10 min.'] },
            ],
          },
        ],
      },
    ],
  },
  sepsi: {
    titolo: 'Algoritmo sepsi — prima ora',
    nota: 'SSC 2026. Dosi per 70 kg; verificare formati e diluizioni in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Sospetta infezione + NEWS2 ≥ 5 (o SIRS, o segni di disfunzione d’organo)',
        righe: ['Ipotensione, tachipnea, confusione, oliguria, cute marezzata, refill > 3 s, lattato > 2.'],
      },
      { tipo: 'decisione', titolo: 'Sepsi probabile/certa o possibile shock?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Antibiotico entro 1 ora', tempo: '≤ 60 min', vai: [{ etichetta: 'Antibiotici: sepsi', to: '/antibiotici?apri=sepsi' }] },
            ],
          },
          {
            etichetta: 'Solo possibile, senza shock', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Indagini rapide', tempo: '≤ 3 h', righe: ['Se l’infezione resta probabile: antibiotico entro 3 ore.'] },
            ],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'Pacchetto della prima ora',
        righe: [
          'Lattato (ripetere entro 2–4 h se > 2)',
          'Emocolture × 2 prima dell’antibiotico, senza ritardarlo',
          'Antibiotico ad ampio spettro; beta-lattamici in infusione prolungata dopo il carico',
          'Cristalloidi bilanciati 30 mL/kg ≈ 2.100 mL in 3 h se PAS < 90, PAM < 65 o lattato ≥ 4 (boli da 500 mL con rivalutazione)',
          'Noradrenalina se l’ipotensione persiste durante/dopo i liquidi, anche da vena periferica',
          'Cercare la fonte (eco, TC) e programmarne il controllo entro 6 h',
        ],
      },
      { tipo: 'decisione', titolo: 'Shock settico? (vasopressori per PAM ≥ 65 e lattato > 2 nonostante i liquidi)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Shock',
                righe: [
                  'Noradrenalina: 2 fiale da 2 mg in SF fino a 50 mL (80 µg/mL), da 0,05 µg/kg/min ≈ 2,5 mL/h.',
                  'PAM obiettivo 65 (60–65 se ≥ 65 anni).',
                  'Idrocortisone (Flebocortid) 50 mg ev ogni 6 h.',
                  'Accesso arterioso, catetere vescicale, rianimatore.',
                ],
              },
            ],
            fine: 'terapia intensiva',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Rivalutare',
                righe: ['Refill, diuresi, stato mentale, lattato. Altri liquidi solo se rispondono (sollevamento passivo degli arti).'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Dopo',
        righe: ['De-escalation con colture/antibiogramma; togliere i liquidi in eccesso dopo la stabilizzazione; destinazione adeguata.'],
      },
    ],
  },
  ictus: {
    titolo: 'Algoritmo codice ictus',
    nota: 'AHA/ASA 2026. Dosi per 70 kg. Trombectomia: Careggi.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Deficit neurologico acuto',
        righe: ['Ora dell’ultima volta visto in benessere: ____ (testimone).'],
      },
      {
        tipo: 'checklist', titolo: 'Primi 10 minuti',
        righe: [
          'Glicemia capillare (< 50: correggere e rivalutare)',
          'PA, SpO₂ > 94%, ECG, accesso venoso × 2',
          'NIHSS e peso',
          'Anticoagulanti: farmaco e ora dell’ultima dose',
          'Neurologo avvisato; TC + angio-TC (e perfusione se fuori finestra)',
          'Esami: emocromo, coagulazione, creatinina (non aspettarli per la TC)',
        ],
      },
      { tipo: 'decisione', titolo: 'TC: emorragia?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Emorragia cerebrale', righe: ['Antagonizzare l’anticoagulante; PAS 130–150; neurochirurgo.'] },
            ],
            fine: 'percorso emorragia',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Da quanto?' },
            ],
          },
        ],
      },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '≤ 4,5 h', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Trombolisi se deficit invalidante',
                righe: [
                  'Tenecteplase (Metalyse) 0,25 mg/kg = 17,5 mg in bolo (3,5 mL del flacone da 50 mg ricostituito in 10 mL, 5 mg/mL)',
                  'oppure alteplase (Actilyse) 0,9 mg/kg = 63 mg (6,3 mg bolo + 56,7 mg in 60 min)',
                  'PA < 185/110 prima, < 180/105 per 24 h',
                ],
                vedi: 'Controindicazioni principali',
              },
            ],
          },
          {
            etichetta: '4,5–24 h o esordio ignoto', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Imaging avanzato',
                righe: [
                  '4,5–9 h / al risveglio: trombolisi se penombra alla perfusione o mismatch DWI-FLAIR.',
                  'Fino a 24 h: trombectomia se occlusione di grosso vaso e tessuto salvabile.',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Occlusione di grosso vaso all’angio-TC?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Trombectomia', righe: ['Contatto immediato con la neuroradiologia di Careggi; non aspettare l’effetto della trombolisi.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'Stroke unit', righe: ['Controlli neuro e PA; deglutizione prima di bere/mangiare.'] },
            ],
          },
        ],
      },
    ],
  },
  chetoacidosi: {
    titolo: 'Algoritmo chetoacidosi / stato iperosmolare',
    nota: 'Consenso ADA/EASD/JBDS 2024. Dosi per 70 kg.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Iperglicemia o diabete noto con malessere',
        righe: ['Glicemia, β-idrossibutirrato, EGA venoso (pH, bicarbonati, K), Na, creatinina, osmolalità.'],
      },
      { tipo: 'decisione', titolo: 'Quale quadro?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'DKA', tono: 'no', nodi: [
              { tipo: 'passo', titolo: 'D + K + A', righe: ['Glicemia ≥ 200 o diabete noto; β-OHB ≥ 3; pH < 7,3 e/o HCO₃ < 18.'] },
            ],
          },
          {
            etichetta: 'HHS', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Iperosmolare', righe: ['Glicemia ≥ 600; osmolalità efficace > 300; β-OHB < 3; pH ≥ 7,3.'] },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: '1 · Liquidi',
        righe: ['SF 0,9% o Ringer 1–1,5 L nella prima ora (boli da 250 mL se anziano/cardiopatico), poi 250–500 mL/h.'],
      },
      { tipo: 'decisione', titolo: '2 · Potassio' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'K < 3,5', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Niente insulina', righe: ['KCl 10–20 mEq/h con monitor fino a K ≥ 3,5.'] },
            ],
          },
          {
            etichetta: 'K 3,5–5', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Insulina', righe: ['KCl 10–20 mEq per litro di liquidi.'] },
            ],
          },
          {
            etichetta: 'K > 5', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Insulina', righe: ['Niente potassio; ricontrollo ogni 1–2 h.'] },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: '3 · Insulina ev a dose fissa',
        righe: [
          'Actrapid 50 UI in 50 mL di SF (1 UI/mL).',
          'DKA: 0,1 U/kg/h = 7 mL/h. HHS: 0,05 U/kg/h = 3,5 mL/h (solo se la glicemia non scende con i liquidi).',
          'Glicemia < 250: glucosata 5–10% e insulina a 0,05 U/kg/h (3,5 mL/h).',
          'Euglicemica da SGLT2-inibitori: glucosata subito.',
        ],
      },
      {
        tipo: 'checklist', titolo: 'Ogni ora / ogni 2–4 ore',
        righe: [
          'Glicemia capillare ogni ora',
          'β-OHB, pH, HCO₃, K ogni 2–4 h',
          'Bilancio idrico; catetere se oligoanuria',
          'HHS: glicemia ↓ ≤ 90–120 mg/dL/h, Na ↓ ≤ 10 mmol/L/24 h',
          'Causa scatenante cercata (infezione, ECG/troponina, lipasi)',
        ],
      },
      {
        tipo: 'esito', titolo: 'Risoluzione',
        righe: ['DKA: β-OHB < 0,6 e pH ≥ 7,3 o HCO₃ ≥ 18. HHS: osmolalità < 300, glicemia < 250, diuresi > 0,5 mL/kg/h, coscienza migliorata. Insulina basale sottocute 1–2 h prima di sospendere l’infusione.'],
      },
    ],
  },
  iperkaliemia: {
    titolo: 'Algoritmo iperkaliemia',
    nota: 'UK Kidney Association 2023. Dosi per adulto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'K ≥ 5,5 mmol/L',
        righe: ['Escludere emolisi (ricontrollo su EGA). ECG a 12 derivazioni e monitor se ≥ 6,0.'],
      },
      { tipo: 'decisione', titolo: 'Alterazioni ECG? (T alte, PR lungo, P assenti, QRS largo, bradicardia, ritmo sinusoidale)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: '1 · Proteggere il cuore',
                righe: ['Calcio gluconato 10% 30 mL = 3 fiale in 10 min; ripetere se l’ECG non migliora. Arresto: calcio cloruro 10% 10 mL.'],
                vai: [{ etichetta: 'Timer ACR', to: '/acr' }],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Niente calcio', righe: ['Passare a spostare ed eliminare il potassio.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Gravità' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '≥ 6,0', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: '2 · Spostare il potassio',
                righe: [
                  'Insulina rapida 10 UI + 25 g di glucosio (250 mL glucosata 10% o 50 mL al 50%) in 15 min.',
                  'Glicemia < 126: poi glucosata 10% 50 mL/h per 5 h.',
                  'Salbutamolo (Broncovaleas) 10–20 mg nebulizzato (2–4 mL della soluzione 5 mg/mL).',
                ],
              },
              {
                tipo: 'terapia', titolo: '3 · Eliminare il potassio',
                righe: ['Kayexalate 15 g per bocca o 30 g per clistere (lento; Lokelma preferito ma non disponibile). Bicarbonato se acidosi. Furosemide (Lasix) se diuresi conservata. Dialisi se refrattaria.'],
              },
            ],
          },
          {
            etichetta: '5,5–5,9', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Lieve', righe: ['Niente terapia acuta; cercare e rimuovere la causa (farmaci, insufficienza renale).'] },
            ],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'Monitoraggio',
        righe: [
          'Glicemia a 0, 15, 30, 60 min, poi ogni ora fino a 6 h',
          'K a 1, 2, 4, 6 e 24 h (obiettivo < 6 entro 2 h)',
          'Farmaci sospesi: ACE-i/sartani, antialdosteronici, FANS, trimetoprim, K',
          'Nefrologo se K ≥ 6,5 dopo il trattamento o insufficienza renale grave',
        ],
      },
    ],
  },
  iponatriemia: {
    titolo: 'Algoritmo iponatriemia',
    nota: 'Linea guida europea 2014. NaCl 3%: vedi la preparazione nelle sezioni.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Na < 135 mmol/L',
        righe: ['Osmolalità plasmatica, glicemia: escludere pseudo-iponatriemia e iperglicemia.'],
      },
      { tipo: 'decisione', titolo: 'Sintomi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Gravi', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'NaCl 3% 150 mL in 20 min', tempo: 'subito',
                righe: [
                  'Vomito, convulsioni, sopore, coma, arresto.',
                  'Ricontrollare il sodio e ripetere fino a 2 volte, finché +5 mmol/L o sintomi migliorati.',
                  'Poi stop alla NaCl 3% e cercare la causa.',
                ],
                vedi: 'Preparare la NaCl 3%',
              },
            ],
          },
          {
            etichetta: 'Moderati', tono: 'neutro', nodi: [
              { tipo: 'passo', titolo: 'Un bolo di 150 mL di NaCl 3%', righe: ['Nausea, confusione, cefalea. Poi causa; obiettivo +5 mmol/L in 24 h.'] },
            ],
          },
          {
            etichetta: 'Lievi o assenti', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Inquadrare la causa', righe: ['Osmolalità urinaria, sodio urinario, volemia.'], vedi: 'Inquadramento (senza sintomi gravi)' },
            ],
          },
        ],
      },
      {
        tipo: 'checklist', titolo: 'Sicurezza',
        righe: [
          'Na dopo ogni bolo, poi a 6, 12, 24 h',
          'Limite: +10 mmol/L nelle prime 24 h (+8 se alcolismo, malnutrizione, ipokaliemia, cirrosi, Na ≤ 120)',
          'Ipercorrezione: sospendere, glucosata 5% e/o desmopressina 2 µg ev, con specialista',
          'Diuresi abbondante improvvisa = rischio di ipercorrezione',
        ],
      },
    ],
  },
  'stato-di-male': {
    titolo: 'Algoritmo stato di male convulsivo',
    nota: 'ACEP 2024, ESETT. Dosi per 70 kg.',
    nodi: [
      {
        tipo: 'checklist', titolo: '0–5 min: stabilizzare', tempo: '0–5 min',
        righe: [
          'Posizione laterale, aspirazione, ossigeno, SpO₂, monitor',
          'Glicemia capillare (< 70: tiamina 100 mg ev poi glucosio 33% 50 mL)',
          'Accesso venoso; esami: elettroliti con Ca e Mg, emocromo, funzione epatica e renale, CK, tossicologico, livelli dei farmaci',
          'Ora di inizio della crisi',
        ],
      },
      {
        tipo: 'terapia', titolo: '5 min: benzodiazepina a dose piena', tempo: '5–20 min',
        righe: [
          'Diazepam (Valium) 10 mg ev = 1 fiala in 2 min, ripetibile una volta dopo 5 min.',
          'Senza vena: midazolam (Ipnovel) 10 mg im (2 fiale da 5 mg) o diazepam (Valium) rettale 10 mg (Micropam).',
        ],
      },
      { tipo: 'decisione', titolo: 'Ancora crisi dopo 2 dosi?' },
      {
        tipo: 'terapia', titolo: '20 min: seconda linea (efficacia simile)', tempo: '20–40 min',
        righe: [
          'Levetiracetam (Keppra) 60 mg/kg = 4.200 mg (8,4 fiale da 500 mg) in 100 mL SF in 10 min',
          'oppure valproato (Depakin) 40 mg/kg = 2.800 mg (7 flaconi da 400 mg) in 10 min',
          'oppure fenitoina (Dintoina) 20 mg/kg = 1.400 mg ≤ 50 mg/min con monitor',
        ],
        vedi: 'Farmaci (70 kg)',
      },
      { tipo: 'decisione', titolo: 'Ancora crisi?' },
      {
        tipo: 'allarme', titolo: '40 min: refrattario', tempo: '> 40 min',
        righe: [
          'Intubazione e anestetico in infusione (propofol (Diprivan) o midazolam (Ipnovel)), rianimatore, EEG continuo.',
          'Si può aggiungere un secondo farmaco di seconda linea.',
        ],
        vai: [{ etichetta: 'Sedazione: intubazione', to: '/sedazione?apri=intubazione' }],
      },
      {
        tipo: 'checklist', titolo: 'Cause da cercare',
        righe: [
          'Sospensione o livelli bassi degli antiepilettici',
          'Ipoglicemia, iponatriemia, ipocalcemia, ipomagnesemia',
          'Alcol (astinenza), tossici (triciclici, isoniazide → piridossina)',
          'Eclampsia: magnesio solfato 4 g ev (4 fiale da 1 g)',
          'TC encefalo; rachicentesi se febbre (antibiotico prima se ritardata)',
        ],
      },
    ],
  },
  anafilassi: {
    titolo: 'Algoritmo anafilassi',
    nota: 'Resuscitation Council UK 2021. Adulto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Esordio acuto con problemi A, B o C',
        righe: ['A: gonfiore di gola o lingua, stridore, raucedine. B: dispnea, sibili, SpO₂ bassa. C: ipotensione, shock, sincope. Di solito con ponfi o angioedema (non sempre).'],
      },
      {
        tipo: 'allarme', titolo: 'Adrenalina 0,5 mg im subito', tempo: 'subito',
        righe: ['0,5 mL della fiala da 1 mg/mL, coscia anterolaterale. Chiamare aiuto, rimuovere l’allergene.'],
      },
      {
        tipo: 'checklist', titolo: 'Insieme',
        righe: [
          'Sdraiato con gambe sollevate (seduto se dispnea; mai in piedi)',
          'Ossigeno ad alti flussi; monitor, SpO₂, PA',
          'Accesso venoso; cristalloidi 500–1.000 mL in bolo se ipoteso',
          'Salbutamolo (Broncovaleas) nebulizzato se broncospasmo',
        ],
      },
      { tipo: 'decisione', titolo: 'Dopo 5 min: problemi A, B, C persistono?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'terapia', titolo: '2ª dose di adrenalina 0,5 mg im', righe: ['Altro bolo di liquidi.'] },
              {
                tipo: 'allarme', titolo: 'Ancora? Anafilassi refrattaria',
                righe: [
                  'Adrenalina 1 mg in 100 mL SF: 35–70 mL/h, titolare (esperto, terapia intensiva).',
                  'Beta-bloccati: glucagone (GlucaGen) 1–2 mg ev.',
                  'Stridore: adrenalina nebulizzata 5 mg; intubazione precoce.',
                  'Arresto: ALS.',
                ],
                vai: [{ etichetta: 'Timer ACR', to: '/acr' }],
                vedi: 'Forma refrattaria (70 kg)',
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Dopo la stabilizzazione',
                righe: ['Antistaminico solo per i sintomi cutanei. Triptasi subito e a 1–2 h.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Osservazione e dimissione',
        righe: ['≥ 6 h dopo la risoluzione se 2 dosi; ≥ 12 h se grave. 2 autoiniettori, istruzioni, visita allergologica.'],
        vedi: 'Osservazione e dimissione',
      },
    ],
  },
  paracetamolo: {
    titolo: 'Algoritmo intossicazione acuta da paracetamolo',
    nota: 'Australia/NZ 2019. Dosi per 70 kg. Sentire sempre la Tossicologia di Careggi.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Ingestione di paracetamolo',
        righe: ['Quanto (g e mg/kg), quando, formulazione (rilascio modificato?), altre sostanze, intenzionale?'],
        vai: [{ etichetta: 'Rubrica: Tossicologia', to: '/rubrica' }],
      },
      { tipo: 'decisione', titolo: '≥ 10 g o ≥ 200 mg/kg?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Rischio basso', righe: ['Niente antidoto; valutazione psichiatrica se intenzionale.'] }],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'passo', titolo: 'Carbone attivo 50 g', righe: ['Entro 2 h (entro 4 h se ≥ 30 g o rilascio modificato), se vigile e collaborante.'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Orario noto e assunzione unica, rilascio immediato?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Paracetamolemia a 4 h (o appena possibile)',
                righe: ['Sopra la linea 150 mg/L a 4 h → N-acetilcisteina (Hidonac). Arrivo dopo 8 h: iniziare subito, poi decidere col dosaggio.'],
                vedi: 'Linea di trattamento del nomogramma',
              },
            ],
          },
          {
            etichetta: 'No', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'N-acetilcisteina subito', righe: ['Orario ignoto, assunzioni ripetute, rilascio modificato.'] },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'N-acetilcisteina a due sacche',
        righe: [
          '200 mg/kg = 14 g (Hidonac: 70 mL = 2,8 fiale da 5 g/25 mL) in 500 mL glucosata 5% in 4 h',
          'poi 100 mg/kg = 7 g (35 mL = 1,4 fiale) in 1.000 mL in 16 h',
          'Massiva (≥ 30 g o livello > doppio della linea): 2ª sacca 14 g in 16 h',
        ],
        vedi: 'N-acetilcisteina (70 kg)',
      },
      {
        tipo: 'checklist', titolo: 'Fine infusione',
        righe: [
          'Paracetamolemia, ALT, INR, creatinina, EGA con lattati',
          'Stop se paracetamolo < 20 mg/L e ALT normali o in calo; altrimenti continuare alla velocità della 2ª sacca',
          'Criteri di gravità → epatologo/centro trapianti',
          'Valutazione psichiatrica se intenzionale',
        ],
      },
    ],
  },
  vertigine: {
    titolo: 'Algoritmo STANDING per la vertigine acuta',
    nota: 'Vanni et al. (Careggi), integrato con GRACE-3 2023. Le figure delle manovre sono nei link «Approfondimenti» qui sotto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Vertigine o instabilità acuta',
        righe: [
          'Prima: glicemia, PA e FC (anche in ortostatismo), ECG; esame neurologico.',
          'Deficit focali, cefalea improvvisa o dolore al collo (dissezione), ipoacusia improvvisa: percorso ictus.',
        ],
      },
      { tipo: 'decisione', titolo: '1 · Nistagmo spontaneo, posizionale o assente? (sguardo primario e 4 direzioni, meglio con Frenzel)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Spontaneo', tono: 'no', nodi: [
              {
                tipo: 'decisione', titolo: '2 · Direzione',
              },
              {
                tipo: 'allarme', titolo: 'Centrale se',
                righe: ['Cambia direzione con lo sguardo, è verticale o torsionale puro.'],
              },
              {
                tipo: 'passo', titolo: 'Unidirezionale orizzontale-torsionale → 3 · Head impulse test',
                righe: [
                  'Patologico (saccade di correzione) → periferico: neurite vestibolare.',
                  'Normale → centrale (ictus) fino a prova contraria.',
                  'Skew presente o ipoacusia nuova (finger rub) → centrale.',
                ],
                manovre: ['hit'],
              },
            ],
          },
          {
            etichetta: 'Posizionale', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Supine roll test, poi Dix-Hallpike',
                righe: [
                  'Dix-Hallpike: nistagmo torsionale-verticale verso l’alto, latenza breve, < 60 s, esauribile → VPPB canale posteriore.',
                  'Roll test: orizzontale geotropo o apogeotropo → VPPB canale laterale.',
                  'Atipico (verticale verso il basso persistente, senza vertigine, non esauribile, non cambia con le manovre) → centrale.',
                ],
                manovre: ['roll-test', 'dix-hallpike'],
              },
            ],
          },
          {
            etichetta: 'Nistagmo assente', tono: 'neutro', nodi: [
              {
                tipo: 'decisione', titolo: '4 · Stazione eretta e marcia (staNdinG)',
              },
              {
                tipo: 'passo', titolo: 'Valutazione',
                righe: [
                  'Non sta in piedi o non cammina senza appoggio (atassia) → centrale.',
                  'Cammina da solo → non centrale (cause otolitiche, presincope, ortostatismo, farmaci, ansia).',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Sospetto centrale?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Percorso ictus',
                righe: [
                  'Dentro la finestra terapeutica: codice ictus (angio-TC).',
                  'La TC senza contrasto non esclude l’ischemia del circolo posteriore: RM con diffusione (falsi negativi nelle prime 48 h).',
                  'Neurologo; ricovero.',
                ],
              },
            ],
            fine: 'percorso ictus',
          },
          {
            etichetta: 'No: periferico', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Terapia',
                righe: [
                  'VPPB canale posteriore: Epley (o Semont).',
                  'VPPB canale laterale geotropo: Gufoni sul fianco sano o Lempert (barbecue); apogeotropo: Gufoni sul fianco malato.',
                  'Neurite vestibolare: prednisone (Deltacortene) 50–60 mg/die per 5 giorni a scalare (da considerare), sintomatici per 2–3 giorni (metoclopramide (Plasil) 10 mg ev = 1 fiala; ondansetron (Zofran) 4 mg), mobilizzazione precoce.',
                  'Niente sedativi vestibolari prolungati.',
                ],
                manovre: ['epley', 'semont', 'gufoni-geo', 'gufoni-apo', 'lempert'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Dimissione',
        righe: [
          'Cammina da solo, beve, sintomi controllati: dimissione con indicazioni (scheda Dimissioni: VPPB).',
          'Vertigine episodica spontanea con fattori di rischio vascolare: considerare TIA (angio-TC o angio-RM, GRACE-3).',
        ],
        vai: [{ etichetta: 'Dimissione VPPB', to: '/dimissioni?apri=vppb' }],
      },
    ],
  },
  'colica-renale': {
    titolo: 'Algoritmo colica renale',
    nota: 'EAU 2026. Dosi per 70 kg; verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore al fianco colico',
        righe: ['Età > 60 anni senza calcolosi nota: escludere l’aneurisma dell’aorta (eco al letto). Donna fertile: β-hCG.'],
      },
      {
        tipo: 'terapia', titolo: 'Analgesia subito',
        righe: [
          'Ketorolac 30 mg ev = 1 fiala, oppure diclofenac 75 mg = 1 fiala, oppure metamizolo 1–2 g ev; + paracetamolo 1 g ev.',
          'FANS no se insufficienza renale, rene unico, terzo trimestre, ulcera attiva.',
          'Seconda scelta: morfina 2–4 mg ev ripetibile. Antiemetico se vomito.',
        ],
      },
      {
        tipo: 'passo', titolo: 'Esami',
        righe: [
          'Urine, creatinina, PCR, emocromo; urinocoltura se febbre o leucocituria.',
          'Ecografia; TC a basse dosi senza contrasto se resta il dubbio.',
        ],
      },
      { tipo: 'decisione', titolo: 'Febbre/sepsi con ostruzione, anuria, rene unico ostruito, insufficienza renale o dolore incontrollabile?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Urologo: decompressione urgente',
                righe: ['Stent ureterale o nefrostomia percutanea. Sepsi: emocolture e urinocoltura, poi antibiotico (scheda Antibiotici: pielonefrite).'],
                vai: [{ etichetta: 'Antibiotici: pielonefrite', to: '/antibiotici?apri=pielonefrite' }],
              },
            ],
            fine: 'ricovero',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Dimensione e sede del calcolo' },
              {
                tipo: 'passo', titolo: 'Gestione',
                righe: [
                  '< 5 mm: espulsione spontanea probabile; analgesia.',
                  '5–10 mm uretere distale: + alfa-litico (tamsulosina 0,4 mg la sera, off-label) ± cortisone (uso locale).',
                  '> 10 mm o prossimale: urologo.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Dimissione',
        righe: ['Dolore controllato, beve, niente febbre: dimissione (scheda Dimissioni: colica renale) con controllo urologico/ecografico se non espulso in 4–6 settimane.'],
        vai: [{ etichetta: 'Dimissione colica renale', to: '/dimissioni?apri=colica-renale' }],
      },
    ],
  },
  'colica-biliare': {
    titolo: 'Algoritmo dolore biliare',
    nota: 'Tokyo 2018 e WSES 2020.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore in ipocondrio destro o epigastrio',
        righe: ['ECG (infarto inferiore), lipasi, bilirubina, transaminasi, ALP/GGT, PCR, emocromo; ecografia.'],
      },
      {
        tipo: 'terapia', titolo: 'Analgesia',
        righe: ['Ketorolac 30 mg ev = 1 fiala (o diclofenac 75 mg) ± paracetamolo 1 g ev; oppioide se necessario.'],
      },
      { tipo: 'decisione', titolo: 'Che quadro è?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Colica semplice', tono: 'si', nodi: [
              {
                tipo: 'esito', titolo: 'Dolore < 6 h, risolto, senza febbre, esami normali',
                righe: ['Dimissione con dieta povera di grassi e visita chirurgica per colecistectomia programmata.'],
              },
            ],
          },
          {
            etichetta: 'Colecistite', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Murphy +, febbre/PCR/leucocitosi, ecografia tipica',
                righe: [
                  'Gravità Tokyo: III disfunzione d’organo; II GB > 18.000, massa, > 72 h, complicanze locali; I altrimenti.',
                  'Digiuno, liquidi, antibiotico (scheda Antibiotici), chirurgo.',
                  'Colecistectomia laparoscopica precoce; non operabile/instabile: drenaggio percutaneo.',
                ],
                vai: [{ etichetta: 'Antibiotici: colecistite', to: '/antibiotici?apri=colecistite' }],
              },
            ],
          },
          {
            etichetta: 'Colangite', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Febbre + ittero/colestasi + dolore',
                righe: ['Emocolture, antibiotico subito, drenaggio biliare (CPRE): urgente se grave (ipotensione, confusione, insufficienza d’organo).'],
              },
            ],
          },
          {
            etichetta: 'Pancreatite biliare', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Lipasi > 3 volte il limite',
                righe: ['Percorso pancreatite; CPRE solo se colangite; colecistectomia nello stesso ricovero se lieve.'],
              },
            ],
          },
        ],
      },
    ],
  },
  pancreatite: {
    titolo: 'Algoritmo pancreatite acuta',
    nota: 'ACG 2024. Dosi per 70 kg.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore epigastrico a sbarra',
        righe: ['Diagnosi: 2 su 3 tra dolore tipico, lipasi > 3 volte il limite, imaging. TC subito solo se la diagnosi è incerta.'],
      },
      {
        tipo: 'passo', titolo: 'Esami e gravità',
        righe: [
          'Emocromo/ematocrito, urea, creatinina, elettroliti, calcio, trigliceridi, funzione epatica, PCR, EGA con lattati; ecografia addominale.',
          'BISAP; SIRS persistente, urea in aumento, ematocrito alto = rischio.',
        ],
      },
      {
        tipo: 'terapia', titolo: 'Liquidi e terapia',
        righe: [
          'Ringer lattato 1,5 mL/kg/h ≈ 100 mL/h; bolo di 10 mL/kg ≈ 700 mL se ipovolemico.',
          'Rivalutare entro 6 h e nelle 24–48 h: diuresi, urea, ematocrito, segni vitali; evitare il sovraccarico.',
          'Analgesia adeguata (anche oppioidi). Niente antibiotici profilattici.',
          'Lieve: dieta orale solida povera di grassi appena tollera (24–48 h).',
        ],
      },
      { tipo: 'decisione', titolo: 'Origine e complicanze' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Colangite', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'CPRE urgente', righe: ['Antibiotico; gastroenterologo/endoscopista.'] },
            ],
          },
          {
            etichetta: 'Insufficienza d’organo', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Terapia intensiva', righe: ['Insufficienza respiratoria, renale o circolatoria; > 48 h = forma grave.'] },
            ],
          },
          {
            etichetta: 'Lieve biliare', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'Ricovero breve', righe: ['Colecistectomia nello stesso ricovero.'] },
            ],
          },
        ],
      },
    ],
  },
  'emorragia-digestiva': {
    titolo: 'Algoritmo emorragia digestiva',
    nota: 'ESGE 2021 (non varicosa) e 2022 (varici). Dosi per 70 kg; verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Ematemesi, vomito caffeano, melena o ematochezia',
        righe: ['Due accessi venosi grossi, emocromo, gruppo e prove crociate, coagulazione, urea, creatinina, lattati.'],
      },
      { tipo: 'decisione', titolo: 'Instabile? (ipotensione, shock index FC/PAS > 1)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Rianimazione',
                righe: [
                  'Cristalloidi; emazie (protocollo trasfusionale massivo se necessario).',
                  'Protezione delle vie aeree se ematemesi massiva o coscienza alterata.',
                  'Endoscopista subito; anticoagulante: antagonizzare.',
                ],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Stratificare',
                righe: ['Glasgow-Blatchford ≤ 1: dimissione con endoscopia ambulatoriale.', 'Trasfusione restrittiva: Hb ≤ 7 g/dL (≤ 8 se cardiopatia).'],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Cirrosi o sospette varici?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì: varicosa', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Subito',
                righe: [
                  'Terlipressina (Glypressin) 2 mg ev = 2 fiale da 1 mg ogni 4 h (poi 1 mg ogni 4 h), oppure somatostatina 250 µg in bolo + 250–500 µg/h.',
                  'Ceftriaxone 1 g ev/die fino a 7 giorni.',
                  'Eritromicina 250 mg ev 30–120 min prima dell’endoscopia.',
                  'Endoscopia (legatura) entro 12 h; Hb obiettivo 7–9, evitare la sovratrasfusione.',
                  'Refrattaria: sonda di Sengstaken o stent esofageo come ponte alla TIPS.',
                ],
              },
            ],
          },
          {
            etichetta: 'No: non varicosa', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Terapia',
                righe: [
                  'Pantoprazolo/esomeprazolo 80 mg ev = 2 fiale da 40 mg, poi 8 mg/h o 40 mg ogni 12 h.',
                  'Eritromicina 250 mg ev se sanguinamento importante.',
                  'Endoscopia entro 24 h dopo la stabilizzazione.',
                  'Niente sondino di routine; niente acido tranexamico.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'nota', titolo: 'Emorragia bassa',
        righe: ['Ematochezia con instabilità: considerare una fonte alta (EGDS); angio-TC per localizzare, poi embolizzazione o endoscopia. Stabile: colonscopia nel ricovero.'],
      },
    ],
  },
  pericardite: {
    titolo: 'Algoritmo pericardite acuta',
    nota: 'ESC 2025. Dosi per 70 kg.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore toracico pleuritico, migliora seduto in avanti',
        righe: ['ECG, troponina, PCR, emocromo, creatinina, RX torace, ecocardio. Escludere SCA, dissezione, EP.'],
      },
      { tipo: 'decisione', titolo: 'Almeno 2 tra: dolore tipico, sfregamento, ST↑ diffuso o PR↓, versamento?' },
      { tipo: 'decisione', titolo: 'Tamponamento? (ipotensione, turgore giugulare, polso paradosso, collasso delle sezioni destre)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Pericardiocentesi urgente', righe: ['Liquidi in attesa.'], vai: [{ etichetta: 'Procedura: pericardiocentesi', to: '/procedure?apri=pericardiocentesi' }] },
            ],
            fine: 'UTIC',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Criteri di rischio: ne basta 1, maggiore o minore → ricovero',
                righe: [
                  'Maggiori: febbre > 38 °C, esordio subacuto, versamento > 20 mm, mancata risposta ai FANS dopo 1 settimana.',
                  'Minori: troponina alta (miopericardite), immunodepressione, trauma, anticoagulanti orali.',
                ],
                vedi: 'Criteri di rischio',
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Terapia',
        righe: [
          'Ibuprofene 600 mg ogni 8 h per 1–2 settimane poi a scalare (o aspirina 750–1000 mg ogni 8 h) + IPP.',
          'Colchicina 0,5 mg ogni 12 h (una volta al giorno se < 70 kg) per 3 mesi.',
          'Riposo fisico fino alla remissione. Cortisone solo in seconda linea.',
        ],
      },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '≥ 1 criterio', tono: 'no', nodi: [
              { tipo: 'esito', titolo: 'Ricovero', righe: ['Ricerca della causa; miopericardite: monitoraggio e percorso miocardite.'] },
            ],
          },
          {
            etichetta: 'Nessun criterio', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'Domicilio', righe: ['Controllo a 1 settimana con PCR.'] },
            ],
          },
        ],
      },
    ],
  },
  miocardite: {
    titolo: 'Algoritmo sospetta miocardite',
    nota: 'ESC 2025.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore toracico, dispnea, palpitazioni o sincope con troponina alta',
        righe: ['Spesso dopo infezione virale; anche da farmaci (inibitori dei checkpoint, vaccini a mRNA, clozapina).'],
      },
      {
        tipo: 'passo', titolo: 'ECG, troponina seriata, NT-proBNP, PCR, ecocardio; monitor continuo',
      },
      { tipo: 'decisione', titolo: 'Possibile sindrome coronarica acuta?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Escluderla prima', righe: ['Percorso SCA: coronarografia o angio-TC coronarica.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'passo', titolo: 'Risonanza cardiaca', righe: ['Esame centrale, il prima possibile (criteri di Lake Louise).'] },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Alto rischio? FE ridotta, scompenso, aritmie ventricolari, BAV avanzato, shock' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'UTIC / centro di riferimento', righe: ['Fulminante: supporto meccanico, biopsia endomiocardica, terapia specifica.'] },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'Ricovero monitorato', righe: ['Riposo fisico; colchicina se componente pericarditica; follow-up con ECG entro 6 mesi.'] },
            ],
          },
        ],
      },
    ],
  },
  polmonite: {
    titolo: 'Algoritmo polmonite comunitaria',
    nota: 'ATS 2025 con ATS/IDSA 2019. Antibiotici: vedi la scheda collegata.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Febbre, tosse, dispnea, crepitii',
        righe: ['RX torace o ecografia polmonare; SpO₂/EGA, emocromo, PCR, urea, creatinina, lattati; test per virus respiratori.'],
      },
      { tipo: 'decisione', titolo: 'CAP grave? Shock con vasopressori o ventilazione, oppure ≥ 3 criteri minori ATS' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Terapia intensiva',
                righe: [
                  'Emocolture ed espettorato prima, poi antibiotico subito (ceftriaxone + macrolide; Pseudomonas/MRSA se fattori di rischio).',
                  'Antigeni urinari. Idrocortisone (Flebocortid) 200 mg/die se non influenza.',
                ],
                vai: [{ etichetta: 'Antibiotici: CAP', to: '/antibiotici?apri=cap' }],
              },
            ],
            fine: 'terapia intensiva',
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Dove curarla',
                righe: ['CURB-65 0–1 e SpO₂ buona, beve, assistito a casa: domicilio. 2: ricovero breve o osservazione. ≥ 3: ricovero.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Domicilio', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Antibiotico per bocca',
                righe: [
                  'Senza comorbidità: amoxicillina 1 g ogni 8 h.',
                  'Con comorbidità: amoxicillina/clavulanato + macrolide (o doxiciclina).',
                  'Virus positivo senza comorbidità: si può non dare l’antibiotico.',
                  'Durata: almeno 3 giorni e stabilità clinica.',
                ],
              },
            ],
          },
          {
            etichetta: 'Ricovero', tono: 'neutro', nodi: [
              {
                tipo: 'terapia', titolo: 'Antibiotico ev',
                righe: [
                  'Ceftriaxone 1–2 g + claritromicina (o azitromicina).',
                  'Niente cortisone se non grave.',
                  'Influenza: oseltamivir.',
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  'fibrillazione-atriale': {
    titolo: 'Algoritmo FA in PS',
    nota: 'ESC 2024 (percorso AF-CARE). Dosi per 70 kg con il numero di fiale/compresse: verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'FA all’ECG (QRS stretti, RR irregolari, assenza di onde P)',
        righe: ['Monitor, accesso venoso, elettroliti (K, Mg), TSH, creatinina, troponina se dolore. Ecocardio al letto (FE, valvole, VD).'],
      },
      { tipo: 'decisione', titolo: 'Instabile? (shock, ischemia in atto, edema polmonare, sincope)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Cardioversione elettrica sincronizzata subito',
                righe: [
                  'In sedazione (scheda Sedazione), bifasica, energia elevata fin dal primo shock.',
                  'Eparina subito (non attendere 3 settimane di OAC).',
                  'FA pre-eccitata (QRS larghi, irregolari, molto veloci): sempre elettrica, niente farmaci nodali.',
                ],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Cercare la causa',
                righe: ['Infezione, disidratazione, ipertiroidismo, alcol, EP, SCA, scompenso, elettroliti, farmaci.'],
              },
              {
                tipo: 'terapia', titolo: 'Controllo della frequenza (obiettivo FC < 110)',
                righe: [
                  'FE > 40%: metoprololo (Lopresor) 2,5–5 mg ev in 2 min (½–1 fiala da 5 mg/5 mL), ripetibile fino a 15 mg; oppure diltiazem 0,25 mg/kg (≈ 18 mg) ev in 5 min.',
                  'FE ≤ 40% o scompenso: digossina (Lanoxin) 0,5 mg ev = 1 fiala da 0,5 mg/2 mL; beta-bloccante a basse dosi con cautela; amiodarone (Cordarone) se refrattaria.',
                  'Niente diltiazem/verapamil (Isoptin) se FE ≤ 40%.',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Esordio certo < 24 h, oppure OAC efficace da ≥ 3 settimane, oppure ETE senza trombi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Cardioversione possibile',
                righe: [
                  'Prima: iniziare l’anticoagulante (EBPM o DOAC).',
                  'In alternativa: attesa vigile con solo controllo della frequenza e rivalutazione entro 48 h (spesso cardioverte da sola).',
                ],
              },
            ],
          },
          {
            etichetta: 'No / incerto', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Niente cardioversione elettiva',
                righe: [
                  'Controllo della frequenza e anticoagulazione.',
                  'Cardioversione dopo ≥ 3 settimane di OAC efficace o dopo ETE.',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Cardiopatia strutturale? (FE ridotta, IVS marcata, coronaropatia)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              {
                tipo: 'terapia', titolo: 'Farmacologica',
                righe: [
                  'Flecainide (Almarytm) 2 mg/kg ev in 10 min (≈ 140 mg = 14 mL della fiala da 150 mg/15 mL; max 150 mg) o 300 mg per bocca = 3 cp da 100 mg.',
                  'Propafenone (Rytmonorm) 2 mg/kg ev in 10 min (≈ 140 mg = 2 fiale da 70 mg/20 mL) o 600 mg per bocca = 2 cp da 300 mg.',
                  'Con flecainide (Almarytm)/propafenone (Rytmonorm) associare un nodale (rischio di flutter 1:1).',
                ],
              },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Amiodarone o elettrica',
                righe: [
                  'Amiodarone (Cordarone) 300 mg = 2 fiale da 150 mg in 250 mL di glucosata 5% in 30–60 min, poi 900–1200 mg nelle 24 h. Conversione lenta (ore).',
                  'Oppure cardioversione elettrica sincronizzata.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Anticoagulazione',
        righe: [
          'Dopo qualunque cardioversione: OAC per almeno 4 settimane, poi secondo CHA₂DS₂-VA.',
          'CHA₂DS₂-VA ≥ 2 raccomandata; = 1 da considerare; 0 nessuna. DOAC preferiti (AVK solo con protesi meccaniche o stenosi mitralica moderata-severa).',
          'Dosi ridotte dei DOAC solo con i criteri della scheda tecnica (CrCl con Cockcroft-Gault). HAS-BLED alto: correggere i fattori, non è un motivo per non anticoagulare.',
        ],
      },
      {
        tipo: 'esito', titolo: 'Dimissione o ricovero',
        righe: [
          'Dimissione se stabile, frequenza controllata, causa non grave, anticoagulazione impostata: controllo cardiologico.',
          'Ricovero se scompenso, ischemia, causa da trattare, frequenza non controllata.',
        ],
      },
    ],
  },
  'scompenso-cardiaco': {
    titolo: 'Algoritmo scompenso decompensato ed edema polmonare acuto',
    nota: 'ESC 2026. Dosi per 70 kg con il numero di fiale; le diluizioni per pompa sono esempi: verificare formati e protocolli del reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dispnea con sospetto scompenso',
        righe: ['Ortopnea, crepitii, edemi, turgore giugulare, aumento di peso; EPA: dispnea improvvisa, schiuma, sudorazione, ipertensione.'],
      },
      {
        tipo: 'passo', titolo: 'Subito', tempo: 'primi minuti',
        righe: [
          'Paziente seduto; PA, FC, SpO₂, FR, temperatura; ECG.',
          'EGA con lattati; troponina, NT-proBNP, creatinina, elettroliti, emocromo, glicemia.',
          'Ecografia polmonare (linee B, versamento) ed ecocardio al letto (FE, VD, valvole, versamento pericardico, vena cava).',
          'NT-proBNP < 300 pg/mL (BNP < 100) esclude lo scompenso; > 5000 pg/mL = rischio molto alto.',
        ],
      },
      { tipo: 'decisione', titolo: 'Insufficienza respiratoria o shock?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Respiratoria', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ossigeno e CPAP',
                righe: [
                  'Ossigeno solo se SpO₂ < 90% (a chi non è ipossiemico nuoce).',
                  'CPAP/NIV il prima possibile se distress, FR > 25 o SpO₂ < 90% (es. CPAP 7,5–10 cmH₂O, FiO₂ per SpO₂ 92–96%).',
                  'Cautela se ipoteso o scompenso destro.',
                  'Intubazione se peggiora nonostante NIV.',
                ],
              },
            ],
          },
          {
            etichetta: 'Shock', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'PAS < 90 con ipoperfusione',
                righe: [
                  'Noradrenalina: 2 fiale da 2 mg in SF fino a 50 mL (80 µg/mL), da 0,05 µg/kg/min ≈ 2,5 mL/h.',
                  'Dobutamina se bassa portata: 1 fiala da 250 mg in SF fino a 50 mL (5 mg/mL), 2,5–5 µg/kg/min = 2–4 mL/h (in beta-bloccati meglio levosimendan).',
                  'Bolo di liquidi solo se non congesto.',
                  'Shock team; da STEMI → emodinamica.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'allarme', titolo: 'Fattore scatenante da trattare subito (CHAMPIT)',
        righe: [
          'C: sindrome coronarica acuta → percorso STEMI/NSTE.',
          'H: emergenza ipertensiva → EPA ipertensivo (sotto).',
          'A: aritmia (FA rapida, TV, bradicardia).',
          'M: causa meccanica acuta (rottura, insufficienza valvolare acuta, endocardite).',
          'P: embolia polmonare.',
          'I: infezione. T: tamponamento.',
        ],
      },
      { tipo: 'decisione', titolo: 'Profilo clinico' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'EPA ipertensivo (PAS > 140)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ridistribuzione più che sovraccarico',
                righe: [
                  'CPAP subito.',
                  'Nitroglicerina in pompa: 10 fiale da 5 mg/1,5 mL (50 mg = 15 mL) + 35 mL di SF = 50 mL (1 mg/mL). Partire da 10–20 µg/min (0,6–1,2 mL/h), aumentare ogni 3–5 min fino a 100–200 µg/min (6–12 mL/h), finché PAS ≥ 110 mmHg.',
                  'In attesa della pompa: isosorbide dinitrato (Carvasin) 5 mg sublinguale.',
                  'Furosemide (Lasix) a dose bassa (es. 40 mg ev = 2 fiale da 20 mg): spesso il paziente non è in sovraccarico.',
                  'Niente morfina di routine (solo distress grave refrattario).',
                ],
              },
            ],
          },
          {
            etichetta: 'Caldo-umido', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Congesto, ben perfuso (il più frequente)',
                righe: ['Decongestione con diuretico (sotto); nitroglicerina se PAS > 110 e congestione polmonare.'],
              },
            ],
          },
          {
            etichetta: 'Freddo-umido', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Congesto e ipoperfuso',
                righe: ['Se PAS < 90: inotropo/vasopressore prima, poi diuretico. Se PA conservata: vasodilatatore cauto e diuretico.'],
              },
            ],
          },
          {
            etichetta: 'Freddo-secco', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Ipoperfuso, non congesto',
                righe: ['Bolo cauto di liquidi (250 mL SF), rivalutare; inotropo se persiste ipoperfusione.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Decongestione: furosemide ev',
        righe: [
          'Mai trattato: furosemide (Lasix) 40 mg ev = 2 fiale da 20 mg/2 mL.',
          'Già in diuretico: il doppio della dose orale abituale ev (es. 50 mg/die per bocca → 100 mg ev = 5 fiale da 20 mg o 10 mL della fiala da 250 mg/25 mL). Più alta se insufficienza renale cronica.',
          'Bolo o infusione continua: equivalenti.',
          'Catetere o misura precisa della diuresi; liquidi assunti meno della diuresi.',
        ],
      },
      { tipo: 'decisione', titolo: 'Risposta adeguata? Na urinario ≥ 70 mEq/L a 2 h oppure diuresi ≥ 100 mL/h nelle prime 6 h' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Proseguire',
                righe: ['Ripetere la dose ogni 12 h fino alla decongestione. Controllare K, Mg, creatinina: un piccolo aumento della creatinina è accettabile.'],
              },
            ],
          },
          {
            etichetta: 'No', tono: 'no', nodi: [
              {
                tipo: 'terapia', titolo: 'Potenziare',
                righe: [
                  'Raddoppiare la dose ev di furosemide (Lasix).',
                  'Aggiungere (IIa) acetazolamide 500 mg ev = 1 fiala da 500 mg una volta al giorno, oppure idroclorotiazide per bocca 25 mg (eGFR > 50), 50 mg (20–50), 100 mg (< 20).',
                  'Massimo abituale 600 mg/die di furosemide (Lasix).',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'nota', titolo: 'Da non dimenticare',
        righe: [
          'Non sospendere beta-bloccante, ACE-i/ARNI, MRA se non in caso di shock, ipotensione sintomatica, iperkaliemia o insufficienza renale grave.',
          'Profilassi antitrombotica (EBPM). SGLT2-inibitore da iniziare dopo la stabilizzazione.',
        ],
      },
      {
        tipo: 'esito', titolo: 'Destinazione',
        righe: [
          'UTIC/sub-intensiva: NIV che non si stacca, inotropi o vasopressori, shock, SCA, aritmie gravi.',
          'Reparto: risposta al diuretico, stabile.',
        ],
      },
    ],
  },
  'embolia-polmonare': {
    titolo: 'Algoritmo embolia polmonare',
    nota: 'ESC 2019 con le categorie AHA/ACC 2026 (A–E) tra parentesi. Dosi per 70 kg; verificare i formati in reparto.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Sospetta embolia polmonare',
        righe: ['Dispnea, dolore pleuritico, sincope, tachicardia, emottisi, ipossiemia non spiegata; fattori di rischio TEV.'],
      },
      { tipo: 'decisione', titolo: 'Ipotensione persistente, shock o arresto?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì: alto rischio (E)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Eco al letto',
                righe: ['VD dilatato/disfunzionante con paziente instabile: basta per trattare se la TC non è possibile subito.'],
              },
              {
                tipo: 'terapia', titolo: 'Trattamento immediato',
                righe: [
                  'Eparina non frazionata 80 U/kg ≈ 5.600 UI ev in bolo (≈ 1,1 mL della fiala da 25.000 UI/5 mL), poi 18 U/kg/h ≈ 1.250 UI/h.',
                  'Trombolisi: alteplase (Actilyse) 100 mg in 2 h (10 mg in bolo + 90 mg) = 2 flaconi da 50 mg; regime accelerato 0,6 mg/kg in 15 min (≈ 42 mg, max 50 mg).',
                  'Controindicata o fallita: catetere o chirurgia (team PERT).',
                  'Noradrenalina se ipoteso; liquidi al massimo 500 mL; evitare intubazione e sedazione profonda se possibile.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Arresto cardiaco da EP',
                righe: ['Trombolisi durante la RCP; poi continuare la rianimazione 60–90 minuti. ECMO se disponibile.'],
              },
            ],
            fine: 'terapia intensiva / UTIC',
          },
          {
            etichetta: 'No: stabile', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Probabilità clinica',
                righe: ['Wells EP (o Ginevra); se la probabilità è bassa, PERC.'],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Paziente stabile: quanto è probabile l’EP?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Bassa / improbabile', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'PERC → D-dimero',
                righe: [
                  'Probabilità molto bassa e PERC negativo: EP esclusa senza esami.',
                  'Altrimenti D-dimero con soglia per età dopo i 50 anni (età × 10 µg/L).',
                  'Negativo: EP esclusa. Positivo: angio-TC.',
                ],
              },
            ],
          },
          {
            etichetta: 'Alta / probabile', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Angio-TC direttamente',
                righe: [
                  'Niente D-dimero.',
                  'Anticoagulare in attesa se il rischio emorragico lo consente.',
                  'Controindicazione al mezzo di contrasto: scintigrafia V/Q o eco-doppler degli arti (TVP = trattare).',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'EP confermata: gravità (sPESI, VD a TC/eco, troponina)' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Basso rischio (A–B)', tono: 'si', nodi: [
              {
                tipo: 'esito', titolo: 'Domicilio possibile',
                righe: ['sPESI 0 (o Hestia negativo), VD normale, troponina normale, anticoagulante disponibile e controllo programmato.'],
              },
            ],
          },
          {
            etichetta: 'Intermedio-basso (C)', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Ricovero in reparto',
                righe: ['sPESI ≥ 1 oppure solo uno tra VD alterato e troponina alta. EBPM.'],
              },
            ],
          },
          {
            etichetta: 'Intermedio-alto (C3–D)', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Ricovero monitorato',
                righe: [
                  'VD alterato e troponina alta, o ipotensione transitoria/lattati alti (D).',
                  'Eparina non frazionata se è probabile la trombolisi; team PERT.',
                  'Trombolisi non di routine: «di salvataggio» se l’emodinamica peggiora.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Anticoagulazione (paziente stabile)',
        righe: [
          'Enoxaparina (Clexane) 1 mg/kg ogni 12 h: 70 mg sc = 1 siringa da 7.000 UI/0,7 mL ogni 12 h (CrCl < 30: una volta al giorno).',
          'Oppure DOAC: apixaban (Eliquis) 10 mg ogni 12 h per 7 giorni (2 cp da 5 mg), poi 5 mg ogni 12 h; rivaroxaban (Xarelto) 15 mg ogni 12 h per 21 giorni, poi 20 mg al giorno.',
          'Eparina non frazionata solo se instabile, se è probabile la trombolisi o con insufficienza renale grave.',
          'Durata: almeno 3 mesi.',
        ],
      },
    ],
  },
  stemi: {
    titolo: 'Algoritmo STEMI — PS con emodinamica h24',
    nota: 'ESC 2023 e ACC/AHA 2025. Prato ha l’emodinamica h24: la strategia è sempre la PCI primaria, la fibrinolisi non è prevista.',
    nodi: [
      {
        tipo: 'avvio', titolo: 'Dolore toracico o equivalente ischemico',
        righe: [
          'Equivalenti: dispnea, sincope, epigastralgia, sudorazione, arresto cardiaco.',
          'Anziani, donne, diabetici: sintomi spesso atipici.',
        ],
      },
      {
        tipo: 'passo', titolo: 'ECG a 12 derivazioni', tempo: '≤ 10 min',
        righe: [
          'Monitor, defibrillatore a portata di mano, accesso venoso (lasciare libero il polso destro per l’accesso radiale).',
          'Prelievo: troponina hs, emocromo, coagulazione, creatinina, elettroliti. Se lo STEMI è già evidente non aspettare il risultato.',
          'ST↑ inferiore → registrare V3R–V4R. ST↓ V1–V3 → registrare V7–V9.',
          'Confronto con ECG precedenti; ecocardio al letto (acinesia regionale, versamento, valvole).',
        ],
      },
      { tipo: 'decisione', titolo: 'ST sopraslivellato o equivalente di STEMI?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'si', nodi: [
              {
                tipo: 'passo', titolo: 'Criteri ECG',
                righe: [
                  'ST↑ al punto J in ≥ 2 derivazioni contigue: ≥ 1 mm; in V2–V3 ≥ 2 mm (uomo ≥ 40 anni), ≥ 2,5 mm (uomo < 40), ≥ 1,5 mm (donna).',
                  'V7–V9 ≥ 0,5 mm (infarto posteriore); V3R–V4R ≥ 0,5 mm (ventricolo destro).',
                  'Equivalenti: blocco di branca sinistro o destro o ritmo da pacemaker con sintomi ischemici in atto (Sgarbossa); onde T iperacute; pattern di de Winter.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Prima degli antitrombotici: è una dissezione?',
                righe: [
                  'Dolore lacerante o dorsale, PA asimmetrica > 20 mmHg, deficit di polso o neurologico, soffio diastolico, mediastino slargato, versamento pericardico → ecocardio e angio-TC.',
                  'Altri simulatori: pericardite, Takotsubo, ripolarizzazione precoce, aneurisma ventricolare, iperkaliemia.',
                ],
              },
            ],
          },
          {
            etichetta: 'No / dubbio', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'NSTE-SCA o dolore da definire',
                righe: [
                  'ECG ogni 15–30 min se il dolore persiste o cambia.',
                  'Troponina hs 0/1 h (o 0/2 h). HEART score.',
                ],
              },
              {
                tipo: 'allarme', titolo: 'Rischio molto alto → coronarografia immediata (< 2 h): stesso percorso dello STEMI',
                righe: [
                  'Instabilità emodinamica o shock, dolore refrattario, aritmie maligne o arresto cardiaco, complicanze meccaniche, scompenso acuto da ischemia.',
                  'ST↓ > 1 mm in ≥ 6 derivazioni con ST↑ in aVR e/o V1 (malattia del tronco o trivasale), ST↓ ricorrente dinamico.',
                ],
              },
              {
                tipo: 'nota', titolo: 'NSTEMI confermato (troponina) → coronarografia entro 24 h; altrimenti percorso dolore toracico.',
              },
            ],
            fine: 'percorso NSTE-SCA',
          },
        ],
      },
      {
        tipo: 'allarme', titolo: 'STEMI: attivare subito l’emodinamica (PCI primaria)', tempo: 'diagnosi → filo ≤ 60 min',
        righe: [
          'Chiamare cardiologo/emodinamista di guardia appena posta la diagnosi, senza aspettare la troponina.',
          '≤ 90 min se il paziente arriva da un ospedale senza emodinamica.',
          'Annotare gli orari: esordio dei sintomi, primo contatto, ECG diagnostico, attivazione, arrivo in sala.',
        ],
      },
      { tipo: 'decisione', titolo: 'Da quanto sono iniziati i sintomi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: '≤ 12 ore', tono: 'si', nodi: [
              { tipo: 'esito', titolo: 'PCI primaria', righe: ['Sempre (classe I).'] },
            ],
          },
          {
            etichetta: '12–48 ore', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'PCI primaria',
                righe: [
                  'Sempre se dolore persistente, instabilità emodinamica o aritmie gravi (classe I).',
                  'Se asintomatico: PCI primaria da considerare (IIa).',
                ],
              },
            ],
          },
          {
            etichetta: '> 48 ore, asintomatico', tono: 'no', nodi: [
              {
                tipo: 'passo', titolo: 'Niente PCI urgente dell’arteria occlusa',
                righe: ['Coronarografia programmata durante il ricovero; terapia come NSTE-SCA.'],
              },
            ],
          },
        ],
      },
      {
        tipo: 'terapia', titolo: 'Terapia in PS, in attesa della sala (70 kg)',
        righe: [
          'Aspirina 250 mg ev = ½ flacone da 500 mg (o 150–300 mg per bocca, masticata), se non già data dal 118.',
          'Eparina non frazionata 5.000 UI ev in bolo (70–100 U/kg) = 1 mL della fiala da 25.000 UI/5 mL. Se il paziente assume anticoagulanti orali: dose da concordare con l’emodinamista.',
          'Inibitore P2Y12 deciso con l’emodinamista (il pretrattamento «può essere considerato»): prasugrel (Efient) 60 mg = 6 cp da 10 mg (non se ictus/TIA pregresso; mantenimento 5 mg se ≥ 75 anni o < 60 kg); ticagrelor (Brilique) 180 mg = 2 cp da 90 mg; clopidogrel (Plavix) 600 mg = 8 cp da 75 mg se anticoagulante orale o alto rischio emorragico.',
          'Dolore: morfina 2–4 mg ev (fiala 10 mg/1 mL in 10 mL di SF: 2–4 mL), ripetibile ogni 5–10 min; oppure fentanil (Fentanest) 50 µg ev = 1 mL della fiala da 100 µg/2 mL. Gli oppioidi rallentano l’effetto degli antiaggreganti orali.',
          'Isosorbide dinitrato (Carvasin) 5 mg sublinguale se PAS > 90 mmHg; no se infarto del ventricolo destro o inibitori della PDE5 nelle 24–48 h. Nitroglicerina in infusione se ipertensione o scompenso.',
          'Ossigeno solo se SpO₂ < 90%.',
          'Nausea: ondansetron (Zofran) 4 mg ev = 1 fiala da 4 mg/2 mL.',
          'Metoprololo (Lopresor) 5 mg ev (1 fiala da 5 mg/5 mL), ripetibile fino a 15 mg: da considerare solo se PAS > 120 mmHg e nessun segno di scompenso (meglio decidere con l’emodinamista).',
        ],
      },
      { tipo: 'decisione', titolo: 'Complicanze in attesa della sala?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Shock cardiogeno', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'PAS < 90 mmHg con ipoperfusione',
                righe: [
                  'Noradrenalina in infusione (0,05–0,5 µg/kg/min); niente nitrati e beta-bloccanti.',
                  'Ecocardio: rottura del setto o di parete, insufficienza mitralica acuta, infarto del ventricolo destro.',
                  'Intubazione se necessaria; supporto meccanico da valutare in emodinamica.',
                ],
              },
            ],
          },
          {
            etichetta: 'Arresto cardiaco rianimato', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'ROSC',
                righe: [
                  'ST↑ persistente → coronarografia immediata.',
                  'Senza ST↑ ed emodinamicamente stabile → niente coronarografia immediata di routine: decisione caso per caso.',
                  'PAM ≥ 65 mmHg, SpO₂ 94–98%, normocapnia, evitare la febbre.',
                ],
              },
            ],
          },
          {
            etichetta: 'FV / TV', tono: 'no', nodi: [
              {
                tipo: 'allarme', titolo: 'Aritmie ventricolari',
                righe: [
                  'Senza polso: defibrillazione e ALS; amiodarone (Cordarone) 300 mg ev = 2 fiale da 150 mg/3 mL dopo il 3° shock.',
                  'TV con polso: cardioversione sincronizzata se instabile; altrimenti amiodarone (Cordarone) 300 mg in 20–60 min.',
                  'Potassio > 4 mmol/L, magnesio > 2 mg/dL.',
                ],
              },
            ],
          },
          {
            etichetta: 'Bradicardia / BAV', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Frequente nell’inferiore',
                righe: [
                  'Atropina 0,5 mg ev = 1 fiala, ogni 3–5 min fino a 3 mg.',
                  'Inefficace → pacing transcutaneo (scheda Procedure).',
                ],
                vai: [{ etichetta: 'Pacing transcutaneo', to: '/procedure?apri=pacing' }],
              },
            ],
          },
          {
            etichetta: 'Ventricolo destro', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Inferiore con ST↑ in V4R',
                righe: [
                  'Niente nitrati, niente diuretici, cautela con la morfina.',
                  'Ipotensione con polmoni liberi: boli di 250 mL di SF.',
                ],
              },
            ],
          },
          {
            etichetta: 'Edema polmonare', tono: 'neutro', nodi: [
              {
                tipo: 'passo', titolo: 'Scompenso acuto',
                righe: [
                  'Furosemide (Lasix) 40 mg ev = 2 fiale da 20 mg.',
                  'Nitroglicerina in infusione se PAS > 110 mmHg; CPAP.',
                ],
              },
            ],
          },
        ],
      },
      {
        tipo: 'esito', titolo: 'Trasferimento in sala di emodinamica',
        righe: [
          'Monitor e defibrillatore, accompagnato da medico/infermiere.',
          'Niente iniezioni intramuscolari. Consegnare ECG, orari e farmaci somministrati.',
        ],
      },
    ],
  },
}
