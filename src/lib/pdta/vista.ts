/*
 * PDTA disturbi della vista e diplopia in PS. Indirizzo oculistico o neurologico.
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>
const OGGI = '2026-11-22'

export const LG_VISTA: LineaGuida[] = [
  {
    id: 'disturbi-visivi',
    titolo: 'Disturbi della vista e diplopia',
    ente: 'AHA 2021 · ESO 2025 · RCOphth',
    anno: 2026,
    area: 'Oculistica · Neurologia',
    fonte: { etichetta: 'Mac Grory et al., Stroke 2021 (AHA, occlusione dell’arteria centrale della retina)', url: 'https://doi.org/10.1161/STR.0000000000000366' },
    controllata: OGGI,
    vediAnche: [
      { etichetta: 'Ictus ischemico acuto', to: '/linee-guida/ictus' },
      { etichetta: 'TIA', to: '/linee-guida/tia' },
      { etichetta: 'Arterite temporale', to: '/linee-guida/arterite-temporale' },
      { etichetta: 'Occhio rosso', to: '/linee-guida/occhio-rosso' },
      { etichetta: 'Cefalea acuta', to: '/linee-guida/cefalea' },
      { etichetta: 'Vertigine', to: '/linee-guida/vertigine' },
      { etichetta: 'Miastenia', to: '/linee-guida/miastenia' },
      { etichetta: 'Guillain-Barré e Miller Fisher', to: '/linee-guida/guillain-barre' },
      { etichetta: 'Alcoli tossici (metanolo)', to: '/linee-guida/alcoli-tossici' },
      { etichetta: 'Emergenza ipertensiva (PRES)', to: '/linee-guida/emergenza-ipertensiva' },
      { etichetta: 'Rubrica: Oculistica, Neurologia', to: '/rubrica' },
    ],
    approfondimenti: [
      { etichetta: 'Ryan et al., NEJM 2026 (TenCRAOS)', url: 'https://doi.org/10.1056/NEJMoa2508515', nota: 'Tenecteplase entro 4,5 h nell’occlusione dell’arteria centrale della retina: nessun beneficio sulla vista rispetto all’aspirina, più eventi avversi.' },
      { etichetta: 'ESO 2025, linea guida sui disturbi visivi dopo ictus', url: 'https://doi.org/10.1177/23969873251314693', nota: 'Screening visivo in tutti gli ictus; occlusione retinica come ictus oculare.' },
    ],
    inBreve: [
      'Tre domande: vede meno, vede doppio o vede luci? Un occhio o entrambi (coprire un occhio alla volta)? Da quando, ed è passato?',
      'Visus di ogni occhio, pupille con riflesso afferente relativo (RAPD), campo visivo per confronto di ogni occhio separato, motilità oculare. Senza visus misurato non c’è valutazione.',
      'Calo visivo monoculare improvviso e indolore = occlusione dell’arteria centrale della retina fino a prova contraria: è un ictus. Percorso ictus, oculista subito, VES e PCR se > 50 anni (arterite).',
      'Amaurosi fugace (perdita monoculare transitoria) = TIA: stesso percorso, studio carotideo urgente.',
      'Emianopsia omonima (stessa metà del campo nei due occhi) = lesione dietro il chiasma, quasi sempre ictus: codice ictus se nei tempi.',
      'Emianopsia bitemporale con cefalea improvvisa = apoplessia ipofisaria: TC/RM, idrocortisone, neurochirurgo.',
      'Fosfeni e «mosche» nuove in un occhio, soprattutto con un velo o una tenda = distacco di retina: oculista entro 24 h, subito se c’è la tenda.',
      'Scotoma scintillante a zig-zag in entrambi gli occhi, che si allarga in 5–60 min e passa = aura emicranica. Prima aura dopo i 50 anni, solo fenomeni negativi, esordio improvviso o durata atipica: trattare come TIA.',
      'Diplopia: se scompare coprendo uno dei due occhi è binoculare (nervi cranici, tronco, giunzione, orbita). Se resta con l’altro occhio coperto è monoculare (problema dell’occhio, ambulatoriale).',
      'Paralisi del III con pupilla dilatata = aneurisma della comunicante posteriore fino a prova contraria: angio-TC subito.',
    ],
    sezioni: [
      {
        titolo: 'Esame in 5 minuti',
        punti: [
          'Visus di ogni occhio con gli occhiali: ottotipo, tabella da vicino o, se molto basso, conta dita, movimento della mano, percezione della luce. Il foro stenopeico che migliora il visus indica un difetto di rifrazione.',
          'Pupille: diametro, reazione, test della torcia alternata. RAPD = lesione del nervo ottico o retinica estesa (non la cataratta, non le lesioni corticali).',
          'Campo visivo per confronto, un occhio alla volta, nei 4 quadranti: monoculare, bitemporale, omonimo, altitudinale (metà superiore o inferiore).',
          'Desaturazione del rosso (un oggetto rosso appare sbiadito da un occhio): neurite ottica.',
          'Motilità e cover test: in quale direzione la diplopia peggiora, orizzontale o verticale; ptosi, proptosi, nistagmo.',
          'Fundus con oftalmoscopio o ecografia oculare: distacco di retina, emorragia vitreale, diametro della guaina del nervo ottico > 5,5–6 mm (ipertensione endocranica).',
          'PA, glicemia, ECG (fibrillazione atriale), NIHSS, palpazione delle temporali, soffi carotidei.',
        ],
      },
      {
        titolo: 'Calo visivo di un occhio',
        punti: [
          'Improvviso, indolore, profondo, con RAPD: occlusione dell’arteria centrale della retina (fondo pallido con macchia rosso ciliegia). È un ictus oculare: neurologo e imaging come nell’ictus (TC con angio-TC; RM se possibile: infarti cerebrali silenti frequenti), ECG, ecodoppler carotideo; oculista subito.',
          'Trombolisi: non raccomandata di routine. Nel trial TenCRAOS il tenecteplase entro 4,5 h non ha migliorato la vista rispetto all’aspirina 300 mg e ha dato più eventi avversi (una emorragia cerebrale fatale).',
          'Aspirina 300 mg dopo aver escluso emorragia e, oltre i 50 anni, l’arterite (VES, PCR, piastrine; claudicatio mandibolare, cefalea temporale). Sospetta arterite: steroide subito (PDTA arterite).',
          'Occlusione venosa centrale: calo più graduale, fondo con emorragie diffuse; oculista entro 24 h; controllare PA, glicemia, emocromo.',
          'Neuropatia ottica ischemica anteriore: al risveglio, difetto altitudinale, papilla edematosa, > 50 anni con fattori vascolari; escludere sempre l’arterite.',
          'Emorragia vitreale: «pioggia nera» improvvisa, diabetico o anticoagulato; ecografia; oculista entro 24 h.',
          'Con dolore: neurite ottica (giovane, dolore ai movimenti oculari, colori spenti, RAPD) → oculista e neurologo, RM encefalo e orbite; glaucoma acuto o cheratite → PDTA occhio rosso; endoftalmite dopo iniezioni intravitreali o chirurgia → oculista subito.',
          'Oscuramenti di pochi secondi con i cambi di posizione + cefalea: papilledema da ipertensione endocranica (fundus, ecografia della guaina, TC/RM e angio-RM venosa per trombosi dei seni).',
        ],
      },
      {
        titolo: 'Disturbi di entrambi gli occhi e del campo visivo',
        punti: [
          'Emianopsia omonima: tratto ottico, radiazioni o corteccia occipitale controlaterale. Ictus della cerebrale posteriore fino a prova contraria: codice ictus; un’emianopsia è un deficit invalidante e può giustificare la trombolisi. Il paziente spesso dice solo «non vedo bene» o urta gli oggetti da un lato.',
          'Quadrantopsia superiore: lobo temporale; inferiore: lobo parietale.',
          'Emianopsia bitemporale: chiasma. Con cefalea improvvisa, vomito, oftalmoplegia, ipotensione: apoplessia ipofisaria → idrocortisone (Flebocortid) 100 mg ev, TC poi RM, neurochirurgo (Careggi), endocrinologo.',
          'Cecità bilaterale con pupille normali (cecità corticale): ictus del territorio basilare o di entrambe le cerebrali posteriori, PRES (PA alta, eclampsia, immunosoppressori, chemioterapia), ipoglicemia, stato post-critico. Il paziente può negare di essere cieco (sindrome di Anton).',
          'Cecità bilaterale con pupille dilatate e acidosi: metanolo.',
          'Altri tossici: digossina (visione gialla), sildenafil (visione bluastra), chinino (cecità con pupille fisse), etambutolo.',
        ],
      },
      {
        titolo: 'Luci: fosfeni e scotomi',
        punti: [
          'Lampi in un occhio + mosche volanti nuove: distacco posteriore del vitreo o rottura retinica → oculista entro 24 h. Velo o tenda che avanza, o calo del visus: distacco di retina → oculista subito.',
          'Aura emicranica tipica: zig-zag luminosi in entrambi gli occhi (persistono a occhi chiusi), che si espandono in 5–60 min e lasciano uno scotoma; poi spesso cefalea. Storia di episodi uguali: dimissione al curante.',
          'Da trattare come TIA: prima aura dopo i 50 anni, aura senza fenomeni positivi (solo buio), esordio improvviso invece che progressivo, durata < 5 min o > 60 min, sempre dallo stesso lato, deficit associati.',
          'Luci colorate rotonde o elementari ripetitive, brevi, sempre dallo stesso lato: crisi occipitale → EEG, neurologo.',
          'Allucinazioni visive complesse in anziano con calo visivo e critica conservata: sindrome di Charles Bonnet (benigna).',
        ],
      },
      {
        titolo: 'Diplopia',
        punti: [
          'Monoculare (resta coprendo l’altro occhio, migliora col foro stenopeico): rifrazione, cataratta, cornea → oculista ambulatoriale.',
          'Binoculare: definire quale muscolo o nervo. III: occhio in basso e in fuori, ptosi, ± midriasi. IV: diplopia verticale che peggiora guardando in basso (scale), testa inclinata. VI: diplopia orizzontale che peggiora guardando lontano e di lato.',
          'III con pupilla dilatata o paralisi parziale o dolore: aneurisma → angio-TC subito, neurochirurgo.',
          'III completo con pupilla risparmiata, VI o IV isolati in > 50 anni vascolopatico: probabile microvascolare, ma serve comunque imaging (RM o angio-TC) e VES/PCR per l’arterite.',
          'VI (anche bilaterale) con cefalea: ipertensione endocranica, trombosi dei seni, trauma.',
          'Più nervi dallo stesso lato + dolore o proptosi: seno cavernoso (trombosi, fistola carotido-cavernosa con occhio rosso e soffio, apoplessia ipofisaria).',
          'Ptosi e diplopia che variano e peggiorano a fine giornata, pupille normali: miastenia (test del ghiaccio sulla palpebra).',
          'Con atassia e areflessia: Miller Fisher. Discendente, simmetrica, con midriasi e disfagia: botulismo. Con atassia, confusione e nistagmo in alcolista: Wernicke (tiamina subito).',
          'Oftalmoplegia internucleare (un occhio non adduce, l’altro ha nistagmo in abduzione) o skew deviation con vertigine: lesione del tronco → percorso ictus.',
          'Dopo trauma: frattura del pavimento dell’orbita con muscolo intrappolato (sguardo in alto bloccato, nausea, bradicardia) → TC orbite, chirurgo maxillo-facciale urgente. Proptosi dolente, febbre, dolore ai movimenti: cellulite orbitaria → TC, antibiotico ev, oculista e ORL.',
        ],
      },
      {
        titolo: 'A chi indirizzare',
        punti: [
          'Oculista subito: occlusione dell’arteria centrale (insieme al percorso ictus), distacco di retina con tenda o visus calato, glaucoma acuto, endoftalmite, trauma penetrante, ustione chimica, cellulite orbitaria con calo visivo, arterite con disturbi visivi.',
          'Oculista entro 24 h: lampi e mosche nuove, emorragia vitreale, occlusione venosa, neurite ottica, neuropatia ischemica senza sospetto di arterite.',
          'Neurologo e imaging urgenti: emianopsia, amaurosi fugace, cecità corticale, papilledema, diplopia binoculare con segni d’allarme, aura atipica.',
          'Neurochirurgo: III con pupilla, apoplessia ipofisaria. Trasferimento a Careggi secondo i percorsi.',
          'Ambulatoriale (curante e oculista): diplopia monoculare, calo graduale, mosche vecchie e stabili, aura tipica già nota.',
        ],
      },
      {
        titolo: 'Dimissione',
        punti: [
          'Al curante per competenza, proseguimento delle cure ed eventuali accertamenti a sua discrezione; si allega richiesta per visita oculistica con la priorità indicata.',
          'Diplopia: niente guida finché persiste; benda su un occhio a giorni alterni per i sintomi.',
          'Tornare subito se compaiono un velo o una tenda, calo della vista, nuova diplopia, debolezza, difficoltà a parlare, cefalea violenta.',
        ],
      },
    ],
    aggiornamenti: [
      { data: OGGI, testo: 'Nuovo PDTA. Occlusione retinica: trombolisi non raccomandata di routine dopo TenCRAOS (NEJM 2026); schema delle vie ottiche con i difetti del campo.' },
    ],
  },
]

export const ALG_VISTA: Alg = {
  'disturbi-visivi': {
    titolo: 'Algoritmo disturbi della vista',
    nota: 'Coprire un occhio alla volta: è la domanda che orienta tutto.',
    nodi: [
      { tipo: 'avvio', titolo: 'Disturbo visivo acuto', righe: ['Da quando? È passato? Dolore? Altri deficit?'] },
      { tipo: 'checklist', titolo: 'Esame in 5 minuti', righe: ['Visus di ogni occhio', 'Pupille e RAPD', 'Campo visivo per confronto, un occhio alla volta', 'Motilità, cover test, ptosi', 'Fundus o ecografia oculare', 'PA, glicemia, ECG, NIHSS; > 50 anni: VES e PCR'], vedi: 'Esame in 5 minuti' },
      { tipo: 'decisione', titolo: 'Che cosa vede?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Vede meno', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Un occhio o entrambi?' },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'Un occhio', tono: 'neutro', nodi: [
                      { tipo: 'allarme', titolo: 'Transitorio: amaurosi fugace = TIA', righe: ['Percorso TIA, studio carotideo urgente.'], vai: [{ etichetta: 'TIA', to: '/linee-guida/tia' }] },
                      { tipo: 'allarme', titolo: 'Improvviso, indolore, RAPD: occlusione arteria centrale', righe: ['Percorso ictus + oculista subito.', 'Niente trombolisi di routine; aspirina 300 mg.', '> 50 anni: VES/PCR, arterite?'], vai: [{ etichetta: 'Ictus', to: '/linee-guida/ictus' }, { etichetta: 'Arterite', to: '/linee-guida/arterite-temporale' }], vedi: 'Calo visivo di un occhio' },
                      { tipo: 'terapia', titolo: 'Con dolore', righe: ['Neurite ottica, glaucoma acuto, cheratite, endoftalmite.'], vai: [{ etichetta: 'Occhio rosso', to: '/linee-guida/occhio-rosso' }] },
                    ],
                  },
                  {
                    etichetta: 'Entrambi', tono: 'neutro', nodi: [
                      { tipo: 'allarme', titolo: 'Emianopsia omonima: ictus', righe: ['Codice ictus se nei tempi.'], vai: [{ etichetta: 'Ictus', to: '/linee-guida/ictus' }] },
                      { tipo: 'allarme', titolo: 'Bitemporale + cefalea: apoplessia ipofisaria', righe: ['Flebocortid 100 mg ev, TC/RM, neurochirurgo.'] },
                      { tipo: 'allarme', titolo: 'Cecità con pupille normali', righe: ['Basilare/cerebrali posteriori, PRES, ipoglicemia, post-critico.', 'Pupille dilatate + acidosi: metanolo.'], vai: [{ etichetta: 'Emergenza ipertensiva', to: '/linee-guida/emergenza-ipertensiva' }, { etichetta: 'Alcoli tossici', to: '/linee-guida/alcoli-tossici' }] },
                    ],
                  },
                ],
              },
            ],
          },
          {
            etichetta: 'Vede doppio', tono: 'neutro', nodi: [
              { tipo: 'decisione', titolo: 'Coprendo un occhio la diplopia sparisce?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'No: monoculare', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Problema oculare', righe: ['Rifrazione, cataratta, cornea.', 'Oculista ambulatoriale.'] }] },
                  {
                    etichetta: 'Sì: binoculare', tono: 'no', nodi: [
                      { tipo: 'checklist', titolo: 'Segni d’allarme', righe: ['III con pupilla dilatata o dolore → angio-TC subito', 'Altri deficit, atassia, vertigine, INO → percorso ictus', 'Cefalea, papilledema, VI → ipertensione endocranica', 'Più nervi, proptosi, dolore → seno cavernoso / orbita', 'Ptosi variabile → miastenia', '> 50 anni → VES/PCR'], vedi: 'Diplopia' },
                      { tipo: 'esito', titolo: 'Nessun allarme, nervo isolato in vascolopatico', righe: ['Imaging comunque (RM o angio-TC), neurologo.', 'Niente guida; benda alternata.'] },
                    ],
                  },
                ],
              },
            ],
          },
          {
            etichetta: 'Vede luci', tono: 'neutro', nodi: [
              { tipo: 'decisione', titolo: 'Un occhio o entrambi (persistono a occhi chiusi)?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Un occhio: lampi + mosche', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Rottura o distacco di retina', righe: ['Oculista entro 24 h.', 'Tenda o calo del visus: subito.'] }] },
                  {
                    etichetta: 'Entrambi: zig-zag', tono: 'si', nodi: [
                      { tipo: 'decisione', titolo: 'Aura tipica?', righe: ['Si allarga in 5–60 min, poi passa; episodi uguali in passato.'] },
                      { tipo: 'esito', titolo: 'Sì: aura emicranica', righe: ['Dimissione al curante.'], vai: [{ etichetta: 'Cefalea', to: '/linee-guida/cefalea' }] },
                      { tipo: 'allarme', titolo: 'No (prima dopo i 50, solo buio, improvvisa, < 5 o > 60 min)', righe: ['Trattare come TIA.'], vai: [{ etichetta: 'TIA', to: '/linee-guida/tia' }] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
