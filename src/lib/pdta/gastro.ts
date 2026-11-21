/*
 * PDTA gastroenterologici aggiuntivi. Dosi per adulto di 70 kg.
 */
import type { LineaGuida } from '../lineeGuida'
import type { Nodo } from '../algoritmi'

type Alg = Record<string, { titolo: string; nota?: string; nodi: Nodo[] }>
const OGGI = '2026-11-21'

export const LG_GASTRO: LineaGuida[] = [
  {
    id: 'diarrea-cronica',
    titolo: 'Diarrea cronica',
    ente: 'BSG 2018 · BSG IBD 2025 · ESMO 2022',
    anno: 2025,
    area: 'Gastroenterologia',
    fonte: { etichetta: 'Arasaradnam et al., Gut 2018 (BSG, diarrea cronica nell’adulto, 3ª ed.)', url: 'https://doi.org/10.1136/gutjnl-2017-315909' },
    controllata: OGGI,
    vediAnche: [
      { etichetta: 'Antibiotici: C. difficile', to: '/antibiotici?apri=cdiff' },
      { etichetta: 'Antibiotici: enterocolite', to: '/antibiotici?apri=enterocolite' },
      { etichetta: 'Ischemia mesenterica', to: '/linee-guida/ischemia-mesenterica' },
      { etichetta: 'Dieta: colon irritabile', to: '/dimissioni/diete?apri=colon-irritabile' },
      { etichetta: 'Dieta: sospetta celiachia', to: '/dimissioni/diete?apri=celiachia-sospetta' },
      { etichetta: 'Dieta: intolleranza al lattosio', to: '/dimissioni/diete?apri=lattosio' },
      { etichetta: 'Rubrica: Gastroenterologia', to: '/rubrica' },
    ],
    approfondimenti: [
      { etichetta: 'Moran et al., Gut 2025 (BSG, malattie infiammatorie intestinali)', url: 'https://doi.org/10.1136/gutjnl-2024-334395', nota: 'Colite acuta grave: criteri, steroide ev, rivalutazione al 3° giorno.' },
      { etichetta: 'Haanen et al., Ann Oncol 2022 (ESMO, tossicità da immunoterapia)', url: 'https://doi.org/10.1016/j.annonc.2022.10.001', nota: 'Diarrea/colite da inibitori dei checkpoint: gradi e terapia.' },
    ],
    inBreve: [
      'Diarrea cronica: feci più molli (Bristol 5–7) o più frequenti da più di 4 settimane. Escludere prima l’incontinenza e la falsa diarrea da fecaloma (anziano, allettato, oppioidi): esplorazione rettale.',
      'In PS servono tre cose: valutare disidratazione e disionie (K, Mg, creatinina, acidosi); riconoscere le cause che non possono aspettare; decidere fra ricovero, accesso rapido dallo specialista o dimissione al curante.',
      'Cause che non possono aspettare: colite acuta grave (rettocolite o Crohn), C. difficile, colite da immunoterapia, colite ischemica, megacolon tossico, tossicità da farmaci (colchicina, litio, digossina, metformina con acidosi lattica).',
      'Colite acuta grave (Truelove-Witts): ≥ 6 scariche al giorno con sangue + almeno uno fra FC > 90, T > 37,8 °C, Hb < 10,5 g/dL, VES > 30 o PCR > 30 mg/L → ricovero, steroide ev, eparina profilattica.',
      'Segni d’allarme (colonscopia in tempi brevi): esordio dopo i 50 anni, sangue nelle feci, calo di peso, diarrea notturna, anemia o carenza di ferro, massa addominale o rettale, familiarità per tumore del colon o malattia infiammatoria.',
      'Stabile e senza allarmi: dimissione al curante con gli esami di primo livello allegati. Niente antibiotico empirico.',
      'Mai loperamide (Imodium) se sangue, febbre, colite sospetta o C. difficile: rischio di megacolon.',
    ],
    sezioni: [
      {
        titolo: 'Esami in PS e ricovero',
        punti: [
          'Sangue: emocromo, PCR, creatinina, Na, K, Cl, Mg, glicemia, EGA (acidosi metabolica a gap normale = perdita di bicarbonato con le feci); lattati se dolore sproporzionato; TSH.',
          'Feci: ricerca di C. difficile (tossina/PCR) se ≥ 3 scariche non formate in 24 h e antibiotico o ricovero nelle ultime 12 settimane, inibitori di pompa, età > 65 o immunodepressione. Coprocoltura e parassiti (antigene Giardia) se viaggio, immunodepressione, sangue o febbre.',
          'RX addome se distensione o colite grave: colon trasverso > 5,5–6 cm = megacolon. TC con contrasto se dolore importante, peritonismo, sospetta perforazione, ascesso o ischemia.',
          'Ricovero se: colite acuta grave; megacolon (dilatazione + tossicità sistemica); C. difficile grave (leucociti > 15.000/mm³ o creatinina > 1,5 mg/dL) o fulminante (ipotensione, ileo, megacolon); insufficienza renale acuta o disionie gravi; colite da immunoterapia di grado ≥ 3; immunodepresso con sintomi sistemici; anziano fragile che non si idrata per bocca.',
        ],
      },
      {
        titolo: 'Cause da cercare con l’anamnesi',
        punti: [
          'Farmaci (la causa più trascurata): metformina, inibitori di pompa, SSRI, FANS, olmesartan (enteropatia simil-celiaca), colchicina (diarrea + citopenia = tossicità, urgente), magnesio e antiacidi, lassativi (anche non dichiarati), antibiotici, digossina, litio, levotiroxina in eccesso, inibitori dei checkpoint immunitari (anche mesi dopo l’ultima dose), capecitabina, micofenolato, acarbosio, dolcificanti (sorbitolo, mannitolo).',
          'Infiammatorie: rettocolite ulcerosa e Crohn (sangue, muco, tenesmo, lesioni perianali, manifestazioni articolari o cutanee); colite microscopica (donna > 50 anni, diarrea acquosa anche notturna, FANS, inibitori di pompa, SSRI); colite ischemica (anziano vasculopatico, dolore e poi sangue).',
          'Malassorbimento: celiachia; insufficienza pancreatica (feci grasse e maleodoranti, alcol, pancreatite cronica, diabete); diarrea da acidi biliari (dopo colecistectomia o resezione ileale); sovracrescita batterica; intolleranza al lattosio.',
          'Altro: ipertiroidismo, diabete con neuropatia autonomica, tumore del colon, carcinoide (vampate), esiti chirurgici (resezioni, chirurgia bariatrica), radioterapia pelvica, HIV.',
          'Colon irritabile con diarrea: diagnosi di esclusione; niente sintomi notturni, niente segni d’allarme, esami di primo livello normali.',
        ],
      },
      {
        titolo: 'Colite acuta grave (rettocolite o Crohn del colon)',
        punti: [
          'Ricovero in Gastroenterologia; chirurgo informato fin dal primo giorno.',
          'Metilprednisolone (Urbason) 60 mg/die ev (es. 20 mg ogni 8 h) oppure idrocortisone (Flebocortid) 100 mg ev ogni 6 h.',
          'Enoxaparina (Clexane) 4.000 UI sc/die anche se c’è sangue nelle feci: il rischio trombotico è alto.',
          'Liquidi, potassio (tenerlo > 4 mmol/L) e magnesio; emazie se Hb < 8 g/dL.',
          'Sospendere FANS, oppioidi, anticolinergici e antidiarroici. Escludere C. difficile; il CMV lo cerca il gastroenterologo sulle biopsie.',
          'RX addome all’ingresso: colon trasverso > 5,5 cm = megacolon tossico → chirurgo subito.',
          'Al 3° giorno (criteri di Oxford): > 8 scariche, oppure 3–8 con PCR > 45 mg/L → terapia di salvataggio (infliximab o ciclosporina) o colectomia.',
        ],
      },
      {
        titolo: 'Colite da immunoterapia (inibitori dei checkpoint)',
        punti: [
          'Sospettarla in chi fa o ha fatto anti-PD-1, anti-PD-L1 o anti-CTLA-4 (nivolumab, pembrolizumab, atezolizumab, ipilimumab…), anche mesi dopo. Escludere C. difficile e infezioni; avvisare l’oncologo.',
          'Grado 1 (< 4 scariche al giorno oltre il basale): idratazione, terapia sintomatica, contatto con l’oncologo.',
          'Grado 2 (4–6 oltre il basale): l’oncologo sospende l’immunoterapia; prednisone (Deltacortene 25 mg) 1 mg/kg = 70 mg per bocca (circa 3 compresse); se non migliora in 72 h passare all’ev.',
          'Grado 3–4 (≥ 7 oltre il basale, sangue, dolore, febbre o pericolo di vita): ricovero, metilprednisolone (Urbason) 1–2 mg/kg/die = 70–140 mg ev; senza risposta in 72 h infliximab o vedolizumab (gastroenterologo).',
        ],
      },
      {
        titolo: 'Dimissione e richieste',
        punti: [
          'Al curante per competenza, proseguimento delle cure ed eventuali accertamenti a sua discrezione.',
          'Si allega richiesta per: emocromo, ferritina, vitamina B12, folati, PCR, TSH, anticorpi anti-transglutaminasi IgA con IgA totali (a dieta libera, senza togliere il glutine prima dell’esame), calprotectina fecale; coprocoltura e ricerca di parassiti se viaggio o esposizione; elastasi fecale se feci grasse.',
          'Calprotectina < 50 µg/g: infiammazione intestinale improbabile. Valori alti: visita gastroenterologica e colonscopia.',
          'Con segni d’allarme: richiesta di visita gastroenterologica o colonscopia con priorità breve (B).',
          'Loperamide (Imodium cp 2 mg) solo se diarrea acquosa, senza sangue né febbre, con colite esclusa: 2 compresse, poi 1 dopo ogni scarica, massimo 8 al giorno.',
          'Tornare se sangue nelle feci, febbre, dolore in aumento, vomito, capogiri o urine scarse.',
        ],
      },
    ],
    aggiornamenti: [
      { data: OGGI, testo: 'Nuovo PDTA. BSG 2018 resta l’ultima edizione sulla diarrea cronica; colite acuta grave da BSG IBD 2025; colite da immunoterapia da ESMO 2022.' },
    ],
  },
]

export const ALG_GASTRO: Alg = {
  'diarrea-cronica': {
    titolo: 'Algoritmo diarrea cronica',
    nota: 'BSG 2018, BSG IBD 2025, ESMO 2022.',
    nodi: [
      { tipo: 'avvio', titolo: 'Diarrea da più di 4 settimane', righe: ['Escludere incontinenza e falsa diarrea da fecaloma: esplorazione rettale.'] },
      { tipo: 'checklist', titolo: 'Subito', righe: ['Parametri, peso, segni di disidratazione', 'Emocromo, PCR, creatinina, Na, K, Cl, Mg, EGA', 'Farmaci (nuovi, dosi, immunoterapia), viaggi, antibiotici recenti', 'Sangue nelle feci? Sintomi notturni? Calo di peso?'] },
      { tipo: 'decisione', titolo: 'Instabile, disidratazione grave, IRA, disionie gravi?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'allarme', titolo: 'Stabilizzare e ricoverare', righe: ['Cristalloidi, K e Mg; poi cercare la causa come sotto.'], vedi: 'Esami in PS e ricovero' }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'passo', titolo: 'Proseguire' }] },
        ],
      },
      { tipo: 'decisione', titolo: 'Sangue, febbre o quadro colitico?', righe: ['Tenesmo, dolore, scariche notturne, PCR alta.'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Contesto?' },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'Malattia infiammatoria nota o sospetta', tono: 'neutro', nodi: [
                      { tipo: 'decisione', titolo: 'Truelove-Witts: ≥ 6 scariche con sangue + 1 criterio?', righe: ['FC > 90, T > 37,8 °C, Hb < 10,5, VES > 30 o PCR > 30.'] },
                      { tipo: 'allarme', titolo: 'Se sì: colite acuta grave', righe: ['Ricovero, Urbason 60 mg/die ev, Clexane 4.000 UI sc, K > 4.', 'RX addome: trasverso > 5,5 cm → chirurgo.', 'Se no: gastroenterologo a breve.'], vedi: 'Colite acuta grave (rettocolite o Crohn del colon)' },
                    ],
                  },
                  { etichetta: 'Antibiotico o ricovero recente', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'C. difficile', righe: ['Tossina/PCR; sospendere l’antibiotico se possibile.', 'Grave/fulminante: ricovero, chirurgo se megacolon.'], vai: [{ etichetta: 'Antibiotici: C. difficile', to: '/antibiotici?apri=cdiff' }] }] },
                  { etichetta: 'Immunoterapia oncologica', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Colite da checkpoint', righe: ['Oncologo. G2: prednisone 70 mg per bocca.', 'G3–4: ricovero, Urbason 70–140 mg ev.'], vedi: 'Colite da immunoterapia (inibitori dei checkpoint)' }] },
                  { etichetta: 'Anziano vasculopatico, dolore', tono: 'neutro', nodi: [{ tipo: 'allarme', titolo: 'Colite ischemica / ischemia mesenterica', righe: ['Lattati, angio-TC, chirurgo.'], vai: [{ etichetta: 'Ischemia mesenterica', to: '/linee-guida/ischemia-mesenterica' }] }] },
                ],
              },
            ],
          },
          {
            etichetta: 'No: acquosa', tono: 'si', nodi: [
              { tipo: 'checklist', titolo: 'Cercare', righe: ['Farmaci (metformina, PPI, SSRI, magnesio, lassativi, olmesartan)', 'Colchicina: se citopenia → tossicità, urgente', 'Ipertiroidismo, diabete, esiti chirurgici', 'Viaggio o immunodepressione → coprocoltura e parassiti'], vedi: 'Cause da cercare con l’anamnesi' },
            ],
          },
        ],
      },
      { tipo: 'decisione', titolo: 'Segni d’allarme?', righe: ['Esordio > 50 anni, sangue, calo di peso, notturna, anemia/sideropenia, massa, familiarità.'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'esito', titolo: 'Gastroenterologo / colonscopia priorità B', righe: ['Con gli esami di primo livello.'] }] },
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Dimissione al curante', righe: ['Si allega richiesta per: emocromo, ferritina, B12, folati, PCR, TSH, anti-tTG IgA + IgA totali, calprotectina.', 'Loperamide solo se acquosa e colite esclusa.'], vedi: 'Dimissione e richieste' }] },
        ],
      },
    ],
  },
}
