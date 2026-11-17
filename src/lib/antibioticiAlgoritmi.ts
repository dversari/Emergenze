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

/* ───────────── Forme senza sepsi (in alto nella card) ───────────── */


const NON_GRAVI_GREZZI: Record<string, AlgoritmoAb> = {
  cap: {
    titolo: 'Polmonite comunitaria senza sepsi',
    nota: 'CURB-65 o PSI per decidere dove curarla.',
    nodi: [
      { tipo: 'avvio', titolo: 'CAP senza sepsi' },
      { tipo: 'decisione', titolo: 'Può essere curata a domicilio?', righe: ['CURB-65 0–1, saturazione e assunzione per os conservate, supporto a casa'] },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'Domicilio', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Comorbidità?', righe: ['BPCO, cuore, rene, fegato, diabete, alcol, neoplasia'] },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'No', nodi: [{ tipo: 'terapia', titolo: 'Amoxicillina', righe: ['Amoxicillina 1 g os ogni 8 h', 'Alternative: doxiciclina 100 mg ogni 12 h; claritromicina 500 mg ogni 12 h'] }] },
                  { etichetta: 'Sì', nodi: [{ tipo: 'terapia', titolo: 'Amoxicillina/clavulanato + macrolide', righe: ['Amoxicillina/clavulanato 875/125 mg os ogni 8 h + claritromicina 500 mg ogni 12 h (o doxiciclina)', 'Alternativa: levofloxacina 500 mg os ogni 24 h da sola'] }] },
                ],
              },
            ],
          },
          {
            etichetta: 'Ricovero', tono: 'no', nodi: [{
              tipo: 'terapia', titolo: 'Ceftriaxone + macrolide', righe: [
                'Ceftriaxone 1–2 g ev ogni 24 h + claritromicina 500 mg ev ogni 12 h (o azitromicina 500 mg ev ogni 24 h)',
                'Rischio Pseudomonas: piperacillina/tazobactam al posto del ceftriaxone; rischio MRSA: + linezolid o vancomicina',
                'Allergia grave: levofloxacina 500 mg ev ogni 12 h',
              ],
            }],
          },
        ],
      },
      { tipo: 'esito', titolo: 'Durata 5 giorni (almeno 3 se stabile)' },
    ],
  },

  hap: {
    titolo: 'Polmonite nosocomiale senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'HAP non grave', righe: ['Esordio ≥ 48 h dopo il ricovero; nessun antibiotico ev negli ultimi 90 giorni.'] },
      { tipo: 'terapia', titolo: 'Un anti-Pseudomonas', righe: ['Piperacillina/tazobactam 4,5 g ev ogni 6 h', 'Oppure cefepime 2 g ev ogni 8 h o levofloxacina 500 mg ev ogni 12 h'] },
      { tipo: 'decisione', titolo: 'Rischio MRSA?', righe: ['MRSA noto, reparto con MRSA > 20%'] },
      { tipo: 'terapia', titolo: 'Se sì: + linezolid 600 mg ogni 12 h o vancomicina' },
      { tipo: 'esito', titolo: 'Durata 7 giorni' },
    ],
  },

  bpco: {
    titolo: 'Riacutizzazione di BPCO',
    nodi: [
      { tipo: 'avvio', titolo: 'Riacutizzazione di BPCO' },
      { tipo: 'decisione', titolo: 'Espettorato purulento + più dispnea o più espettorato, oppure NIV/intubazione?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Niente antibiotico', righe: ['Broncodilatatori, cortisonico.'] }] },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Rischio Pseudomonas?', righe: ['FEV1 < 30%, bronchiectasie, isolamento precedente'] },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'No', nodi: [{ tipo: 'terapia', titolo: 'Amoxicillina/clavulanato', righe: ['875/125 mg os ogni 12 h', 'Alternative: doxiciclina 100 mg ogni 12 h; claritromicina 500 mg ogni 12 h'] }] },
                  { etichetta: 'Sì', nodi: [{ tipo: 'terapia', titolo: 'Chinolone', righe: ['Ciprofloxacina 750 mg os ogni 12 h o levofloxacina 500 mg os ogni 12 h'] }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'esito', titolo: 'Durata 5 giorni' },
    ],
  },

  faringite: {
    titolo: 'Faringotonsillite',
    nodi: [
      { tipo: 'avvio', titolo: 'Mal di gola' },
      { tipo: 'decisione', titolo: 'Centor/McIsaac ≥ 2–3?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Sintomatici, niente test né antibiotico' }] },
          {
            etichetta: 'Sì', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Test rapido o coltura positivi?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'No', nodi: [{ tipo: 'esito', titolo: 'Niente antibiotico' }] },
                  { etichetta: 'Sì', nodi: [{ tipo: 'terapia', titolo: 'Amoxicillina 10 giorni', righe: ['Amoxicillina 1 g os ogni 24 h (o 500 mg ogni 12 h); aderenza incerta: benzatina 1.200.000 UI im', 'Allergia non grave: cefalexina 500 mg ogni 12 h', 'Allergia grave: claritromicina 250 mg ogni 12 h (10 giorni) o azitromicina 500 mg/die (5 giorni)'] }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'allarme', titolo: 'Trisma, voce «a patata», asimmetria: ascesso peritonsillare → ORL' },
    ],
  },

  cistite: {
    titolo: 'Cistite',
    nodi: [
      { tipo: 'avvio', titolo: 'Disuria, pollachiuria, urgenza', righe: ['Senza febbre né dolore al fianco (altrimenti pielonefrite).'] },
      { tipo: 'decisione', titolo: 'Chi è il paziente?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Donna non gravida', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Fosfomicina o nitrofurantoina', righe: ['Fosfomicina 3 g os dose singola', 'Oppure nitrofurantoina 100 mg os ogni 6 h per 5 giorni', 'Niente chinoloni, cotrimossazolo, amoxicillina/clavulanato in empirica (resistenze in Toscana)'] }] },
          { etichetta: 'Gravida', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Fosfomicina o cefalexina', righe: ['Fosfomicina 3 g dose singola, o cefalexina 500 mg ogni 8 h per 5–7 giorni', 'Sempre urinocoltura e controllo dopo'] }] },
          { etichetta: 'Uomo', tono: 'no', nodi: [{ tipo: 'terapia', titolo: '7 giorni secondo urinocoltura', righe: ['Nitrofurantoina o cotrimossazolo', 'Febbre o dolore perineale: prostatite'] }] },
        ],
      },
    ],
  },

  pielonefrite: {
    titolo: 'Pielonefrite senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre, dolore al fianco ± sintomi urinari', righe: ['Urinocoltura (ed emocolture se ricovero).'] },
      { tipo: 'decisione', titolo: 'Può essere curata a domicilio?', righe: ['Assume per os, nessun vomito, nessuna ostruzione, non gravida, supporto a casa'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Domicilio', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone in PS, poi os', righe: ['Ceftriaxone 1 g ev o im in PS', 'Poi cefixima 400 mg os ogni 24 h, o secondo antibiogramma (chinoloni solo se sensibile)', 'Controllo dal curante con l’urinocoltura'] }] },
          {
            etichetta: 'Ricovero', tono: 'no', nodi: [
              { tipo: 'decisione', titolo: 'Fattori di rischio ESBL ≥ 2?', righe: FDR_ESBL },
              {
                tipo: 'rami', rami: [
                  { etichetta: '0–1', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone', righe: ['Ceftriaxone 1–2 g ev ogni 24 h'] }] },
                  { etichetta: '≥ 2', nodi: [{ tipo: 'terapia', titolo: 'Ertapenem', righe: ['Ertapenem 1 g ev ogni 24 h'] }] },
                ],
              },
            ],
          },
        ],
      },
      { tipo: 'esito', titolo: 'Durata 7 giorni se risposta rapida' },
    ],
  },

  prostatite: {
    titolo: 'Prostatite acuta senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'Febbre, disuria, dolore perineale', righe: ['Niente massaggio prostatico; ritenzione: catetere.'] },
      { tipo: 'decisione', titolo: 'Può essere curata a domicilio?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Domicilio', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Chinolone os', righe: ['Levofloxacina 500 mg os ogni 24 h o ciprofloxacina 500 mg ogni 12 h, secondo antibiogramma', 'Alternativa: cotrimossazolo 800/160 mg ogni 12 h'] }] },
          { etichetta: 'Ricovero', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone', righe: ['Ceftriaxone 2 g ev ogni 24 h; rischio ESBL: piperacillina/tazobactam o meropenem'] }] },
        ],
      },
      { tipo: 'esito', titolo: 'Durata 2–4 settimane' },
    ],
  },

  orchiepididimite: {
    titolo: 'Orchiepididimite',
    nodi: [
      { tipo: 'allarme', titolo: 'Escludere la torsione (eco-doppler)' },
      { tipo: 'decisione', titolo: 'Probabile causa?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'IST (< 35 anni)', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone + doxiciclina', righe: ['Ceftriaxone 500 mg im dose singola + doxiciclina 100 mg ogni 12 h per 10 giorni', 'Rapporti anali insertivi: levofloxacina al posto della doxiciclina'] }] },
          { etichetta: 'Enterici (> 35 anni, procedure urologiche)', tono: 'neutro', nodi: [{ tipo: 'terapia', titolo: 'Levofloxacina', righe: ['500 mg os ogni 24 h per 10 giorni (o secondo urinocoltura)'] }] },
        ],
      },
    ],
  },

  enterocolite: {
    titolo: 'Gastroenterite ed enterocolite',
    nodi: [
      { tipo: 'avvio', titolo: 'Diarrea acuta' },
      { tipo: 'decisione', titolo: 'Antibiotici o ricovero recenti?' },
      { tipo: 'terapia', titolo: 'Se sì: cercare C. difficile (vedi scheda)' },
      { tipo: 'decisione', titolo: 'Da trattare?', righe: ['Febbre alta o sangue con quadro sistemico, immunodepressione, anziano con comorbidità, protesi vascolari, diarrea del viaggiatore grave'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'esito', titolo: 'Idratazione, niente antibiotico', righe: ['Sangue senza febbre o focolaio (STEC): mai antibiotici.'] }] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Azitromicina', righe: ['1 g os dose singola o 500 mg/die per 3 giorni', 'Alternativa: ciprofloxacina 500 mg ogni 12 h per 3 giorni'] }] },
        ],
      },
    ],
  },

  cdiff: {
    titolo: 'Colite da C. difficile',
    nodi: [
      { tipo: 'avvio', titolo: 'Diarrea con test C. difficile positivo', righe: ['Sospendere l’antibiotico responsabile; niente antidiarroici.'] },
      { tipo: 'decisione', titolo: 'Fulminante?', righe: ['Ipotensione, shock, ileo, megacolon'] },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Fidaxomicina o vancomicina os', righe: ['Fidaxomicina 200 mg ogni 12 h (preferita; recidiva: sempre)', 'Oppure vancomicina 125 mg os ogni 6 h', 'Durata 10 giorni'] }] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Vancomicina os alte dosi + metronidazolo ev', righe: ['Vancomicina 500 mg ogni 6 h per os o SNG (+ clistere se ileo) + metronidazolo 500 mg ev ogni 8 h', 'Chirurgo'] }] },
        ],
      },
    ],
  },

  diverticolite: {
    titolo: 'Diverticolite senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'Diverticolite confermata all’imaging' },
      { tipo: 'decisione', titolo: 'Complicata (ascesso, perforazione)?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Immunodepressione, comorbidità importanti, PCR > 140, leucociti > 15.000, febbre persistente?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'No', nodi: [{ tipo: 'esito', titolo: 'Senza antibiotico', righe: ['Paracetamolo, alimentazione secondo tolleranza, controllo a 2–3 giorni.'] }] },
                  { etichetta: 'Sì', nodi: [{ tipo: 'terapia', titolo: 'Amoxicillina/clavulanato os', righe: ['875/125 mg ogni 8 h; allergia: ciprofloxacina + metronidazolo'] }] },
                ],
              },
            ],
          },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Ricovero, antibiotico ev', righe: ['Amoxicillina/clavulanato 2,2 g ev ogni 8 h, o ceftriaxone 2 g + metronidazolo 500 mg ogni 8 h', 'Ascesso ≥ 3–4 cm: drenaggio percutaneo'] }] },
        ],
      },
    ],
  },

  appendicite: {
    titolo: 'Appendicite',
    nodi: [
      { tipo: 'avvio', titolo: 'Appendicite' },
      { tipo: 'decisione', titolo: 'Complicata (perforata, ascesso, peritonite)?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Profilassi preoperatoria', righe: ['Cefazolina 2 g + metronidazolo 500 mg ev, o amoxicillina/clavulanato 2,2 g ev, in dose singola', 'Gestione conservativa: amoxicillina/clavulanato 2,2 g ev ogni 8 h, poi os (7–10 giorni)'] }] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Terapia', righe: ['Amoxicillina/clavulanato 2,2 g ev ogni 8 h, o ceftriaxone 2 g + metronidazolo', '4 giorni dopo il controllo della fonte'] }] },
        ],
      },
    ],
  },

  colecistite: {
    titolo: 'Colecistite e colangite senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'Colecistite o colangite', righe: ['Grado secondo Tokyo 2018.'] },
      { tipo: 'decisione', titolo: 'Legata all’assistenza (stent, anastomosi bilio-digestiva)?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone + metronidazolo', righe: ['Ceftriaxone 2 g ev ogni 24 h + metronidazolo 500 mg ogni 8 h', 'Rischio ESBL: ertapenem 1 g/die'] }] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Piperacillina/tazobactam', righe: ['4,5 g ev ogni 6 h (+ vancomicina per l’enterococco)'] }] },
        ],
      },
      { tipo: 'allarme', titolo: 'Colangite: drenaggio biliare (CPRE)' },
    ],
  },

  peritonite: {
    titolo: 'Infezione intra-addominale senza sepsi',
    nodi: [
      { tipo: 'avvio', titolo: 'Infezione intra-addominale complicata, stabile', righe: ['Controllo della fonte comunque necessario.'] },
      { tipo: 'decisione', titolo: 'Comunitaria senza fattori di rischio ESBL?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone + metronidazolo', righe: ['Ceftriaxone 2 g ev ogni 24 h + metronidazolo 500 mg ogni 8 h, o amoxicillina/clavulanato 2,2 g ogni 8 h'] }] },
          { etichetta: 'No', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Piperacillina/tazobactam o ertapenem', righe: ['Piperacillina/tazobactam 4,5 g ogni 6 h; ESBL noto: ertapenem 1 g/die (meropenem se Pseudomonas)'] }] },
        ],
      },
      { tipo: 'esito', titolo: '4 giorni dopo il controllo della fonte' },
    ],
  },

  pbs: {
    titolo: 'Peritonite batterica spontanea',
    nodi: [
      { tipo: 'avvio', titolo: 'Cirrotico con ascite', righe: ['Paracentesi diagnostica: neutrofili ≥ 250/mm³.'] },
      { tipo: 'decisione', titolo: 'Nosocomiale o in profilassi con chinoloni?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'No', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Ceftriaxone', righe: ['2 g ev ogni 24 h'] }] },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Piperacillina/tazobactam', righe: ['4,5 g ev ogni 6 h; ESBL o shock: meropenem'] }] },
        ],
      },
      { tipo: 'terapia', titolo: 'Albumina 1,5 g/kg il giorno 1 e 1 g/kg il giorno 3' },
      { tipo: 'esito', titolo: 'Paracentesi di controllo a 48 h' },
    ],
  },

  cellulite: {
    titolo: 'Cellulite, erisipela, ascesso',
    nodi: [
      { tipo: 'avvio', titolo: 'Infezione cutanea senza sepsi', righe: ['Segnare i margini.'] },
      { tipo: 'decisione', titolo: 'Purulenta (ascesso)?' },
      {
        tipo: 'rami', rami: [
          {
            etichetta: 'No', tono: 'si', nodi: [
              { tipo: 'decisione', titolo: 'Domicilio?' },
              {
                tipo: 'rami', rami: [
                  { etichetta: 'Sì', nodi: [{ tipo: 'terapia', titolo: 'Cefalexina o amoxicillina/clavulanato', righe: ['Cefalexina 500 mg os ogni 6 h o amoxicillina/clavulanato 875/125 mg ogni 8 h', 'Erisipela tipica: amoxicillina 1 g ogni 8 h', 'Allergia: clindamicina 300–450 mg ogni 6–8 h'] }] },
                  { etichetta: 'No', nodi: [{ tipo: 'terapia', titolo: 'Cefazolina ev', righe: ['Cefazolina 2 g ev ogni 8 h o amoxicillina/clavulanato 2,2 g ogni 8 h', 'Allergia: clindamicina 600 mg ev ogni 8 h'] }] },
                ],
              },
            ],
          },
          { etichetta: 'Sì', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Incisione e drenaggio', righe: ['Antibiotico se esteso o febbre: cotrimossazolo forte 1–2 cp ogni 12 h o doxiciclina 100 mg ogni 12 h'] }] },
        ],
      },
      { tipo: 'nota', titolo: 'Morso', righe: ['Amoxicillina/clavulanato 875/125 mg ogni 12 h per 3–5 giorni (profilassi) o 7–14 (infezione).'] },
      { tipo: 'esito', titolo: 'Durata 5 giorni, prolungare se non migliora' },
    ],
  },

  neutropenia: {
    titolo: 'Neutropenia febbrile',
    nodi: [
      { tipo: 'avvio', titolo: 'Neutrofili < 500 + febbre', righe: ['Antibiotico entro 1 h, emocolture da periferica e da CVC.'] },
      { tipo: 'decisione', titolo: 'MASCC ≥ 21 e stabile?' },
      {
        tipo: 'rami', rami: [
          { etichetta: 'Sì (basso rischio)', tono: 'si', nodi: [{ tipo: 'terapia', titolo: 'Domicilio, os', righe: ['Ciprofloxacina 750 mg ogni 12 h + amoxicillina/clavulanato 875/125 mg ogni 12 h'] }] },
          { etichetta: 'No (alto rischio)', tono: 'no', nodi: [{ tipo: 'terapia', titolo: 'Anti-Pseudomonas ev', righe: ['Piperacillina/tazobactam 4,5 g ogni 6 h o cefepime 2 g ogni 8 h', 'Instabile o ESBL noto: meropenem ± amikacina', '+ vancomicina se instabile, CVC, cute, polmonite, MRSA noto'] }] },
        ],
      },
    ],
  },
}

export const ALGORITMI_NON_GRAVI: Record<string, AlgoritmoAb> = Object.fromEntries(
  Object.entries(NON_GRAVI_GREZZI).map(([k, v]) => [k, { ...v, nodi: appiattisci(v.nodi) }]),
)

/** Quale algoritmo di sepsi mostrare sotto, per condizione. */
const SEPSI_DI: Record<string, string> = {
  prostatite: 'pielonefrite', diverticolite: 'peritonite', appendicite: 'peritonite', colecistite: 'peritonite', pbs: 'peritonite', cellulite: 'fascite',
}
export const algoritmoSepsi = (id: string) => ALGORITMI_ANTIBIOTICI[SEPSI_DI[id] ?? id]
