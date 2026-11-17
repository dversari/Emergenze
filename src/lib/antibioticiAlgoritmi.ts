/*
 * Algoritmi di terapia antibiotica empirica nel paziente con sepsi o shock settico, per focolaio.
 * Struttura a decisioni (shock, fattori di rischio MDR/ESBL/Pseudomonas/MRSA/Listeria) integrata con
 * Surviving Sepsis Campaign 2021, ATS/IDSA CAP 2019 (+ ATS 2025), IDSA/ATS HAP-VAP 2016, IDSA cUTI 2025,
 * WSES/SIS intra-addominali, IDSA cute 2014, ESCMID meningite 2016 e IDSA ascesso cerebrale,
 * ESCMID/IDSA Gram-negativi resistenti 2024, resistenze ARS Toscana 2024.
 * Dosi per funzione renale normale: la PRIMA dose sempre piena.
 */
import type { Nodo } from './algoritmi'

export interface AlgoritmoAb { titolo: string; nota?: string; nodi: Nodo[] }

const RIVALUTA: Nodo = { tipo: 'esito', titolo: 'Rivalutare entro 48 h', righe: ['Colture, clinica, procalcitonina: ridurre lo spettro, togliere l’anti-MRSA se colture e tampone nasale negativi, passare a os, fissare lo stop.'] }

const FDR_MDR = [
  'Ricovero > 2 giorni negli ultimi 12 mesi',
  'Antibiotici negli ultimi 90 giorni (soprattutto chinoloni e carbapenemi)',
  'Infezione o colonizzazione nota da germi multiresistenti',
  'Charlson ≥ 5; cortisonici a lungo termine',
  'Provenienza da RSA o lungodegenza',
]

const FDR_ESBL = [
  'ESBL noto (infezione o colonizzazione)',
  'Betalattamici o chinoloni negli ultimi 60 giorni',
  'Chirurgia addominale o urologica/ginecologica negli ultimi 30–60 giorni',
  'IVU ricorrenti, catetere vescicale a permanenza',
  'Immunodepressione, diabete',
  'RSA o lungodegenza; ricovero > 72 h',
  'Viaggio nel Sud-Est asiatico (o India) negli ultimi 6 mesi',
]

const CARBA_SHOCK = 'Meropenem 2 g ev in 30 min, poi 2 g ogni 8 h in infusione di 3–4 h'
const CARBA = 'Meropenem 1 g ev ogni 8 h (prima dose in 30 min, poi in infusione di 3 h)'
const PIPTAZO = 'Piperacillina/tazobactam 4,5 g ev: prima dose in 30 min, poi ogni 6 h in infusione di 4 h'
const ANTI_MRSA = 'Linezolid 600 mg ev ogni 12 h, oppure vancomicina carico 25 mg/kg (70 kg: 2 g), poi 2 g/24 h in infusione continua o 15 mg/kg ogni 12 h'
const CASPO = 'Caspofungina 70 mg ev il primo giorno, poi 50 mg/die (70 mg/die se > 80 kg)'

/** Dentro un ramo, le sotto-decisioni diventano riquadri in sequenza con l'esito nel titolo (su telefono i rami annidati non ci stanno). */
function appiattisci(nodi: Nodo[], dentroRamo = false): Nodo[] {
  return nodi.flatMap((n): Nodo[] => {
    if (n.tipo !== 'rami') return [n]
    if (!dentroRamo) return [{ tipo: 'rami', rami: n.rami.map((r) => ({ ...r, nodi: appiattisci(r.nodi, true) })) }]
    return n.rami.flatMap((r) => appiattisci(r.nodi, true).map((x, i) =>
      x.tipo !== 'rami' && i === 0 ? { ...x, titolo: `${r.etichetta} → ${x.titolo}` } : x))
  })
}

const GREZZI: Record<string, AlgoritmoAb> = {
  sepsi: {
    titolo: 'Sepsi o shock settico senza focolaio evidente',
    nota: 'Antibiotico entro 1 h se shock (entro 3 h se sepsi possibile senza shock), dopo 2 set di emocolture.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi o shock senza focolaio noto', righe: ['Comunitaria o nosocomiale.'] },
      { tipo: 'decisione', titolo: 'Ricoverato da più di 48 h?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'neutro', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio MDR ≥ 2?', righe: FDR_MDR },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: '0–1', tono: 'si', nodi: [{
                      tipo: 'terapia', titolo: 'Piperacillina/tazobactam ± anti-MRSA', righe: [
                        PIPTAZO,
                        '+ anti-MRSA se shock o rischio MRSA (MRSA noto, CVC, dialisi, lesioni cutanee): ' + ANTI_MRSA,
                        'Allergia a penicilline/cefalosporine: meropenem al posto della piperacillina/tazobactam.',
                        'Giovane, comunitaria, petecchie (meningococco): ceftriaxone 2 g ev ogni 12 h.',
                      ],
                    }],
                  },
                  { etichetta: '≥ 2', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Come il nosocomiale (ramo «Sì»)' }] },
                ],
              },
            ],
          },
          {
            etichetta: 'Sì (o ≥ 2 fattori MDR)', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Carbapenemico + anti-MRSA', righe: [
                CARBA_SHOCK,
                '+ ' + ANTI_MRSA,
                'Rischio Candida (CVC, nutrizione parenterale, chirurgia addominale recente, colonizzazione multisito, antibiotici ampi prolungati): + ' + CASPO,
                'Colonizzazione nota da CRE o Acinetobacter resistente: vedi le schede dedicate.',
              ],
            }],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  pielonefrite: {
    titolo: 'Sepsi o shock a partenza urinaria',
    nota: 'Urinocoltura ed emocolture prima. Ostruzione (calcolo, idronefrosi): drenaggio urgente.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi a verosimile partenza urinaria', righe: ['Eco o TC per escludere ostruzione e ascesso.'] },
      { tipo: 'decisione', titolo: 'Shock settico?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio ESBL ≥ 2?', righe: FDR_ESBL },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: '0–1', tono: 'si', nodi: [{
                      tipo: 'terapia', titolo: 'Piperacillina/tazobactam', righe: [
                        PIPTAZO,
                        'Stabile, comunitaria, nessun fattore: ceftriaxone 2 g ev ogni 24 h.',
                        'Amoxicillina/clavulanato: non in empirica (E. coli urinario resistente nel 32% in Toscana).',
                        'Allergia: meropenem.',
                      ],
                    }],
                  },
                  {
                    etichetta: '≥ 2', tono: 'no', nodi: [{
                      tipo: 'terapia', titolo: 'Carbapenemico', righe: [CARBA, 'Stabile, senza rischio Pseudomonas: ertapenem 1 g ev ogni 24 h.'],
                    }],
                  },
                ],
              },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Carbapenemico + vancomicina', righe: [
                CARBA_SHOCK + ' (o imipenem 1 g, poi 500 mg ogni 6 h in 3 h)',
                '+ vancomicina (enterococco): carico 25 mg/kg, poi 15 mg/kg ogni 12 h secondo i livelli',
                'Eventuale amikacina 15–20 mg/kg ev in dose singola.',
              ],
            }],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  cap: {
    titolo: 'Polmonite comunitaria con sepsi',
    nota: 'Emocolture, espettorato, antigeni urinari per pneumococco e Legionella. Pneumonia Panel se disponibile.',
    nodi: [
      { tipo: 'avvio', titolo: 'CAP con sepsi o shock' },
      { tipo: 'decisione', titolo: 'Shock settico?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio Pseudomonas?', righe: ['BPCO grave o bronchiectasie', 'Immunodepressione', 'Pseudomonas isolato negli ultimi 12 mesi', 'Ricovero con antibiotici ev negli ultimi 90 giorni', 'Diabete scompensato'] },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'No', tono: 'si', nodi: [{
                      tipo: 'terapia', titolo: 'Ceftriaxone + azitromicina', righe: [
                        'Ceftriaxone 2 g ev ogni 24 h + azitromicina 500 mg ev ogni 24 h',
                        'Ab ingestis senza ascesso né empiema: nessuna copertura anaerobi aggiuntiva.',
                        'Allergia: meropenem + azitromicina (o levofloxacina 750 mg/die da sola).',
                      ],
                    }],
                  },
                  {
                    etichetta: 'Sì', tono: 'no', nodi: [{
                      tipo: 'terapia', titolo: 'Piperacillina/tazobactam + azitromicina', righe: [PIPTAZO, '+ azitromicina 500 mg ev ogni 24 h', 'Allergia: meropenem + azitromicina.'],
                    }],
                  },
                ],
              },
              { tipo: 'decisione', titolo: 'Fattori di rischio MRSA?', righe: ['MRSA noto negli ultimi 12 mesi', 'Ricovero > 2 giorni negli ultimi 90', 'Dialisi cronica, RSA', 'Polmonite necrotizzante o post-influenzale'] },
              { tipo: 'terapia', titolo: 'Se sì: aggiungere linezolid 600 mg ev ogni 12 h (o vancomicina)' },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Shock: copertura secondo i fattori di rischio', righe: [
                'Senza fattori di rischio Pseudomonas o ESBL: ceftriaxone 2 g ev ogni 24 h + azitromicina 500 mg ev ogni 24 h',
                'Con fattori di rischio Pseudomonas o ESBL: ' + CARBA_SHOCK + ' + azitromicina',
                '+ linezolid 600 mg ev ogni 12 h (o vancomicina) se fattori di rischio MRSA',
                '+ idrocortisone 200 mg/die ev (ATS 2025; non se influenza).',
              ],
            }],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  hap: {
    titolo: 'Polmonite nosocomiale (HAP/VAP) con sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'HAP o VAP', righe: ['Esordio ≥ 48 h dopo il ricovero (VAP: ≥ 48 h dall’intubazione). Aspirato tracheale o BAL prima dell’antibiotico.'] },
      { tipo: 'decisione', titolo: 'Shock, ventilazione o antibiotici ev negli ultimi 90 giorni?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [{
              tipo: 'terapia', titolo: 'Un anti-Pseudomonas', righe: [
                PIPTAZO + ' (o cefepime 2 g ev ogni 8 h)',
                'Pseudomonas MDR noto: ceftolozano/tazobactam 3 g ev ogni 8 h.',
                '+ anti-MRSA se MRSA noto o reparto con MRSA > 20%: ' + ANTI_MRSA,
                'Allergia: meropenem.',
              ],
            }],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Due anti-Pseudomonas + anti-MRSA', righe: [
                CARBA_SHOCK + ' (o piperacillina/tazobactam o cefepime)',
                '+ amikacina 15–20 mg/kg ev ogni 24 h (o levofloxacina 750 mg ev ogni 24 h)',
                '+ ' + ANTI_MRSA,
              ],
            }],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  peritonite: {
    titolo: 'Sepsi a partenza addominale',
    nota: 'L’antibiotico non sostituisce il controllo rapido della fonte (chirurgia o drenaggio percutaneo).',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi o shock a sospetta partenza addominale', righe: ['TC addome; chirurgo subito.'] },
      { tipo: 'decisione', titolo: 'Legata all’assistenza?', righe: ['Postoperatoria, ricovero recente, RSA'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio ESBL?', righe: FDR_ESBL },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'No', tono: 'si', nodi: [{
                      tipo: 'terapia', titolo: 'Piperacillina/tazobactam', righe: [
                        'Piperacillina/tazobactam 4,5 g ev in 30 min, poi 4,5 g ogni 6 h in 4 h',
                        'Senza shock e non grave: ceftriaxone 2 g ogni 24 h + metronidazolo 500 mg ogni 8 h, o amoxicillina/clavulanato 2,2 g ogni 8 h.',
                        'Allergia: meropenem.',
                      ],
                    }],
                  },
                  {
                    etichetta: 'Sì', tono: 'no', nodi: [{
                      tipo: 'terapia', titolo: 'Carbapenemico + anti-enterococco', righe: [CARBA + '; 2 g se shock', '+ ' + ANTI_MRSA],
                    }],
                  },
                ],
              },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Carbapenemico + anti-enterococco', righe: [CARBA_SHOCK, '+ ' + ANTI_MRSA, 'Colonizzazione da VRE: linezolid.'],
            }],
          },
        ],
      },
      { tipo: 'nota', titolo: 'Postoperatoria o perforazione (soprattutto gastro-duodenale), immunodepressione, colonizzazione da Candida', righe: ['+ ' + CASPO] },
      { tipo: 'allarme', titolo: 'Controllo rapido della fonte' },
      RIVALUTA,
    ],
  },

  fascite: {
    titolo: 'Sepsi da cute e tessuti molli',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi a verosimile partenza cutanea' },
      { tipo: 'decisione', titolo: 'Fascite necrotizzante?', righe: ['Dolore sproporzionato, rapida progressione, bolle, crepitio, anestesia cutanea, shock'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio MDR ≥ 2?', righe: FDR_MDR },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: '0–1', tono: 'si', nodi: [{
                      tipo: 'terapia', titolo: 'Betalattamico + anti-MRSA', righe: [
                        'Amoxicillina/clavulanato 2,2 g ev ogni 8 h o piperacillina/tazobactam 4,5 g ogni 6 h',
                        '+ daptomicina 10 mg/kg/die, o linezolid 600 mg ogni 12 h, o vancomicina (2ª scelta: cotrimossazolo 800/160 mg ev ogni 12 h)',
                        'Allergia: meropenem + daptomicina o linezolid (o tigeciclina 100 mg, poi 50 mg ogni 12 h).',
                      ],
                    }],
                  },
                  {
                    etichetta: '≥ 2', tono: 'no', nodi: [{
                      tipo: 'terapia', titolo: 'Carbapenemico + anti-MRSA', righe: [CARBA + '; 2 g se shock', '+ daptomicina 10 mg/kg/die o linezolid 600 mg ogni 12 h'],
                    }],
                  },
                ],
              },
              { tipo: 'allarme', titolo: 'Ascesso o raccolta: drenaggio rapido' },
            ],
          },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'allarme', titolo: 'Chirurgo subito: debridement' },
              {
                tipo: 'terapia', titolo: 'Ampio spettro + antitossina + anti-MRSA', righe: [
                  'Meropenem 2 g ev, poi 2 g ogni 8 h in 3–4 h (anche nell’allergico) oppure piperacillina/tazobactam 4,5 g ogni 6 h',
                  '+ clindamicina 900 mg ev ogni 8 h per le prime 48–72 h (antitossina)',
                  '+ linezolid 600 mg ogni 12 h (anche antitossina) o daptomicina 10 mg/kg/die o vancomicina',
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'nota', titolo: 'Stabile, germe sensibile, nessuna indicazione chirurgica', righe: ['Valutare dalbavancina o oritavancina in dose singola per dimissione precoce (infettivologo).'] },
      RIVALUTA,
    ],
  },

  meningite: {
    titolo: 'Meningoencefalite con sepsi',
    nota: 'Desametasone e antibiotico entro 1 h; se TC o rachicentesi ritardano, non aspettarle (emocolture prima).',
    nodi: [
      { tipo: 'avvio', titolo: 'Sospetta meningoencefalite' },
      { tipo: 'decisione', titolo: 'Postchirurgica (NCH, ORL), trauma cranico, derivazione ventricolare?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Sì', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Anti-Pseudomonas + anti-MRSA', righe: [
                'Meropenem 2 g ev ogni 8 h in 3 h (o cefepime 2 g ogni 8 h o ceftazidime 2 g ogni 8 h)',
                '+ linezolid 600 mg ev ogni 12 h o vancomicina (carico 25 mg/kg, valle 15–20 mg/L)',
              ],
            }],
          },
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Liquor torbido o quadro batterico?' },
              {
                tipo: 'rami', rami: [
                  {
                    etichetta: 'Sì', tono: 'no', nodi: [{
                      tipo: 'terapia', titolo: 'Desametasone + ceftriaxone ± ampicillina', righe: [
                        'Desametasone 10 mg ev (0,15 mg/kg) ogni 6 h per 4 giorni, prima o con la prima dose di antibiotico',
                        '+ ceftriaxone 2 g ev ogni 12 h',
                        '+ ampicillina 2 g ev ogni 4 h se ≥ 1 fattore di rischio Listeria: età > 50 anni; alcolismo, gravidanza, diabete, immunosoppressori, neoplasia o altra immunodepressione',
                        'Allergia: meropenem 2 g ev ogni 8 h (copre anche Listeria).',
                      ],
                    }],
                  },
                  {
                    etichetta: 'No (limpido: sospetta encefalite)', tono: 'neutro', nodi: [{
                      tipo: 'terapia', titolo: 'Aciclovir + ceftriaxone ± ampicillina', righe: [
                        'Aciclovir 10 mg/kg ev ogni 8 h (70 kg: 750 mg = 3 fiale)',
                        '+ ceftriaxone 2 g ev ogni 12 h (finché non è esclusa l’eziologia batterica)',
                        '+ ampicillina 2 g ev ogni 4 h se fattori di rischio Listeria',
                        'Allergia: meropenem + aciclovir.',
                      ],
                    }],
                  },
                ],
              },
            ],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  'ascesso-cerebrale': {
    titolo: 'Ascesso cerebrale',
    nota: 'TC/RM con contrasto; neurochirurgo (Careggi) per aspirazione o drenaggio; emocolture.',
    nodi: [
      { tipo: 'avvio', titolo: 'Ascesso cerebrale' },
      { tipo: 'decisione', titolo: 'Origine?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Primario (otogeno, sinusale, dentario, ematogeno)', tono: 'si', nodi: [{
              tipo: 'terapia', titolo: 'Ceftriaxone + metronidazolo', righe: ['Ceftriaxone 2 g ev ogni 12 h + metronidazolo 500 mg ev ogni 8 h', 'Allergia: meropenem 2 g ev ogni 8 h da solo.'],
            }],
          },
          {
            etichetta: 'Post-traumatico', tono: 'neutro', nodi: [{
              tipo: 'terapia', titolo: '+ anti-stafilococco', righe: ['Ceftriaxone 2 g ogni 12 h + metronidazolo 500 mg ogni 8 h + linezolid 600 mg ogni 12 h (o vancomicina)', 'Allergia: meropenem 2 g ogni 8 h + linezolid o vancomicina.'],
            }],
          },
          {
            etichetta: 'Postchirurgico', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Anti-Pseudomonas + anti-MRSA', righe: ['Meropenem 2 g ogni 8 h (o cefepime o ceftazidime 2 g ogni 8 h) + linezolid 600 mg ogni 12 h (o vancomicina)'],
            }],
          },
        ],
      },
      RIVALUTA,
    ],
  },

  cre: {
    titolo: 'Colonizzazione nota da enterobatteri produttori di carbapenemasi',
    nota: 'Consulenza infettivologica subito: il tipo di carbapenemasi (dal referto o dal test rapido) decide il farmaco.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi in paziente colonizzato da CRE' },
      { tipo: 'decisione', titolo: 'Quale carbapenemasi?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'KPC', tono: 'neutro', nodi: [{
              tipo: 'terapia', titolo: 'Ceftazidime/avibactam', righe: [
                'Ceftazidime/avibactam 2,5 g ev ogni 8 h in 2 h',
                'Oppure meropenem/vaborbactam 4 g ogni 8 h o imipenem/relebactam 1,25 g ogni 6 h (preferibili se focolaio polmonare)',
                'Shock: ± fosfomicina ev 4 g ogni 6 h, o gentamicina 5 mg/kg/die, o amikacina 15 mg/kg/die',
                '+ linezolid (o vancomicina, se non si usano aminoglicosidi)',
              ],
            }],
          },
          {
            etichetta: 'OXA-48', tono: 'neutro', nodi: [{
              tipo: 'terapia', titolo: 'Ceftazidime/avibactam', righe: [
                'Ceftazidime/avibactam 2,5 g ev ogni 8 h in 2 h (2ª scelta cefiderocol 2 g ogni 8 h)',
                'Shock: ± fosfomicina ev o aminoglicoside',
                '+ linezolid (o vancomicina)',
              ],
            }],
          },
          {
            etichetta: 'MBL (NDM, VIM)', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Ceftazidime/avibactam + aztreonam', righe: [
                'Ceftazidime/avibactam 2,5 g ogni 8 h + aztreonam 2 g ogni 8 h, in contemporanea',
                '2ª scelta (secondo epidemiologia): cefiderocol 2 g ogni 8 h in 3 h',
                'Shock: ± fosfomicina ev o colistina',
                '+ linezolid',
              ],
            }],
          },
        ],
      },
      { tipo: 'nota', titolo: 'Allergia a penicilline/cefalosporine', righe: ['KPC: meropenem/vaborbactam o imipenem/relebactam + fosfomicina o aminoglicoside. OXA-48 e MBL: colistina 9 MU, poi 4,5 MU ogni 12 h + fosfomicina (+ aztreonam se MBL: rischio crociato solo con il ceftazidime).'] },
      RIVALUTA,
    ],
  },

  crab: {
    titolo: 'Colonizzazione nota da Acinetobacter baumannii resistente ai carbapenemi',
    nota: 'Consulenza infettivologica subito.',
    nodi: [
      { tipo: 'avvio', titolo: 'Sepsi in paziente colonizzato da CRAB' },
      {
        tipo: 'terapia', titolo: 'Ampicillina/sulbactam ad alte dosi + secondo farmaco', righe: [
          'Ampicillina/sulbactam 9 g ev ogni 8 h in infusione di 4 h (o continua)',
          '+ cefiderocol 2 g ogni 8 h in 3 h; 2ª scelta: colistina 9 MU, poi 4,5 MU ogni 12 h, o fosfomicina ev 4 g ogni 6 h, o tigeciclina 200 mg, poi 100 mg ogni 12 h',
          '+ linezolid 600 mg ogni 12 h (o vancomicina, se non si usa colistina)',
        ],
      },
      { tipo: 'nota', titolo: 'Allergia a penicilline/cefalosporine', righe: ['Colistina + fosfomicina ev o tigeciclina + linezolid.'] },
      RIVALUTA,
    ],
  },
}

export const ALGORITMI_ANTIBIOTICI: Record<string, AlgoritmoAb> = Object.fromEntries(
  Object.entries(GREZZI).map(([k, v]) => [k, { ...v, nodi: appiattisci(v.nodi) }]),
)
