/*
 * Funghi tossici principali (Italia centrale): tavole schematiche con i caratteri di riconoscimento.
 * Servono a orientarsi e a fare le domande giuste: l'identificazione la fa il micologo (Ispettorato micologico ASL, tramite CAV).
 * Fonti: Ministero della Salute, schede dei funghi tossici; CAV Niguarda/Pavia; Goldfrank 11ª ed.
 */

export type FormaCappello = 'convesso' | 'umbonato' | 'campana' | 'conico' | 'imbuto' | 'piano' | 'depresso' | 'cervello' | 'boleto'
export type Parte = 'cappello' | 'lamelle' | 'pori' | 'anello' | 'volva' | 'gambo' | 'base' | 'cortina'

export interface Disegno {
  scala?: number
  cappello: { forma: FormaCappello; larghezza: number; altezza: number; colore: string; colore2: string; colore3?: string; verruche?: string; squame?: string; fibrille?: boolean; solchi?: boolean; inchiostro?: boolean; involuto?: boolean }
  sotto: { tipo: 'lamelle' | 'pori'; colore: string; decorrenti?: boolean }
  gambo: { colore: string; altezza: number; spessore: number; forma?: 'dritto' | 'flessuoso' | 'panciuto'; bulbo?: boolean; reticolo?: string; fasce?: string; blu?: boolean; baseGialla?: boolean }
  anello?: { colore: string; tipo: 'gonna' | 'fugace' | 'anellino'; striato?: boolean }
  volva?: { colore: string; tipo: 'sacco' | 'cercini' | 'orlo' }
  cortina?: boolean
  cespitoso?: boolean
  legno?: boolean
}

export interface Specie {
  id: string
  nome: string
  comune: string
  sindrome: string
  disegno: Disegno
  etichette: { parte: Parte; testo: string }[]
  riconoscimento: string[]
  confusione: string
  habitat: string
}

export const SPECIE: Specie[] = [
  {
    id: 'amanita-phalloides', nome: 'Amanita phalloides', comune: 'Tignosa verdognola', sindrome: 'falloidea',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 46, altezza: 40, colore: '#a3ad72', colore2: '#6e7a43', fibrille: true },
      sotto: { tipo: 'lamelle', colore: '#fbfaf4' },
      gambo: { colore: '#f1f1e4', altezza: 92, spessore: 8, bulbo: true, fasce: '#c9d0a8' },
      anello: { colore: '#fbfaf4', tipo: 'gonna', striato: true },
      volva: { colore: '#fbfaf4', tipo: 'sacco' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Cappello verde-oliva (anche giallastro o quasi bianco), fibrille radiali' },
      { parte: 'lamelle', testo: 'Lamelle sempre bianche' },
      { parte: 'anello', testo: 'Anello bianco a gonna' },
      { parte: 'volva', testo: 'Volva bianca a sacco: scavare alla base!' },
    ],
    riconoscimento: ['Lamelle bianche + anello + volva a sacco: la triade delle amanite mortali.', 'Il colore varia molto: non fidarsi del verde.', 'La volva resta spesso nel terreno se il fungo è strappato: chiedere com’è stato raccolto.'],
    confusione: 'Prataioli (lamelle rosa o brune, niente volva), colombine verdi (Russula virescens: niente anello né volva), ovuli chiusi.',
    habitat: 'Boschi di latifoglie (querce, castagni, faggi), estate–autunno. Responsabile della maggior parte dei decessi.',
  },
  {
    id: 'amanita-verna', nome: 'Amanita verna e A. virosa', comune: 'Tignose bianche', sindrome: 'falloidea',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 42, altezza: 38, colore: '#f6f5ee', colore2: '#e5e1cf' },
      sotto: { tipo: 'lamelle', colore: '#ffffff' },
      gambo: { colore: '#f7f6f0', altezza: 96, spessore: 7, bulbo: true },
      anello: { colore: '#ffffff', tipo: 'gonna' },
      volva: { colore: '#ffffff', tipo: 'sacco' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Tutta bianca' },
      { parte: 'lamelle', testo: 'Lamelle bianche' },
      { parte: 'anello', testo: 'Anello' },
      { parte: 'volva', testo: 'Volva a sacco' },
    ],
    riconoscimento: ['Fungo interamente bianco con anello e volva.', 'Stesse amatossine della falloide.', 'A. verna in primavera, A. virosa in autunno (più a nord).'],
    confusione: 'Prataioli bianchi, Leucoagaricus; da chiuse con vesce e ovoli buoni (l’ovolo buono, tagliato, mostra il giallo).',
    habitat: 'Boschi di latifoglie; A. verna da aprile a giugno.',
  },
  {
    id: 'lepiota', nome: 'Lepiota piccole (L. brunneoincarnata, L. helveola…)', comune: 'Lepiote piccole', sindrome: 'falloidea',
    disegno: {
      scala: 0.72,
      cappello: { forma: 'umbonato', larghezza: 40, altezza: 24, colore: '#efe2d8', colore2: '#9b6553', squame: '#8b5848' },
      sotto: { tipo: 'lamelle', colore: '#fbf7f2' },
      gambo: { colore: '#efe3da', altezza: 80, spessore: 5, fasce: '#a77565' },
      anello: { colore: '#e9d8cd', tipo: 'fugace' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Piccola (< 6–8 cm), squame rosate-brune su fondo chiaro, centro scuro' },
      { parte: 'anello', testo: 'Anello fugace' },
      { parte: 'gambo', testo: 'Gambo con fasce brune' },
    ],
    riconoscimento: ['Regola pratica: non raccogliere lepiote con cappello sotto i 10 cm.', 'Contengono amatossine: quadro falloideo.'],
    confusione: 'Mazza di tamburo giovane (Macrolepiota procera: molto più grande, anello scorrevole).',
    habitat: 'Prati, giardini, parchi, margini dei boschi; estate–autunno.',
  },
  {
    id: 'galerina', nome: 'Galerina marginata', comune: 'Galerina', sindrome: 'falloidea',
    disegno: {
      scala: 0.62,
      cappello: { forma: 'convesso', larghezza: 34, altezza: 26, colore: '#cc8b42', colore2: '#9b5d27' },
      sotto: { tipo: 'lamelle', colore: '#b98a58' },
      gambo: { colore: '#b38a5e', altezza: 86, spessore: 5, fasce: '#7d5a35' },
      anello: { colore: '#8a6a40', tipo: 'anellino' },
      cespitoso: true, legno: true,
    },
    etichette: [
      { parte: 'cappello', testo: 'Bruno-fulvo, 2–4 cm, schiarisce asciugando' },
      { parte: 'anello', testo: 'Anellino bruno' },
      { parte: 'base', testo: 'A ciuffi su legno morto' },
    ],
    riconoscimento: ['Piccola, bruna, a ciuffi sul legno: aspetto banale.', 'Contiene amatossine.'],
    confusione: 'Chiodini (Armillaria), famigliola mutabile (Kuehneromyces): raccolti insieme per errore.',
    habitat: 'Su ceppaie e legno di conifere e latifoglie, tutto l’anno nelle stagioni miti.',
  },
  {
    id: 'amanita-muscaria', nome: 'Amanita muscaria', comune: 'Ovolo malefico', sindrome: 'panterinica',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 50, altezza: 36, colore: '#d8382c', colore2: '#a8201a', verruche: '#fbf5e6' },
      sotto: { tipo: 'lamelle', colore: '#fffdf6' },
      gambo: { colore: '#fbf8ee', altezza: 92, spessore: 8, bulbo: true },
      anello: { colore: '#fffdf6', tipo: 'gonna' },
      volva: { colore: '#fbf5e6', tipo: 'cercini' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Rosso con verruche bianche (la pioggia le lava via)' },
      { parte: 'lamelle', testo: 'Lamelle bianche' },
      { parte: 'anello', testo: 'Anello bianco' },
      { parte: 'volva', testo: 'Bulbo con anelli di verruche (cercini)' },
    ],
    riconoscimento: ['Inconfondibile se intatta; lavata dalla pioggia resta un cappello rosso-arancio liscio.', 'Lamelle e gambo bianchi, bulbo con cercini.'],
    confusione: 'Ovolo buono (Amanita caesarea): lamelle e gambo gialli, volva bianca a sacco.',
    habitat: 'Boschi di betulle, abeti, pini, castagni; estate–autunno.',
  },
  {
    id: 'amanita-pantherina', nome: 'Amanita pantherina', comune: 'Tignosa bruna', sindrome: 'panterinica',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 44, altezza: 32, colore: '#8e6c46', colore2: '#5a4127', verruche: '#fbf8f0' },
      sotto: { tipo: 'lamelle', colore: '#fffdf6' },
      gambo: { colore: '#f8f5ec', altezza: 88, spessore: 7, bulbo: true },
      anello: { colore: '#fffdf6', tipo: 'gonna' },
      volva: { colore: '#fbf8f0', tipo: 'orlo' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Bruno con verruche bianche, orlo striato' },
      { parte: 'anello', testo: 'Anello liscio, non striato sopra' },
      { parte: 'volva', testo: 'Bulbo con orlo netto «a bicchiere»' },
    ],
    riconoscimento: ['Più tossica della muscaria.', 'Carne bianca che non arrossa.'],
    confusione: 'Tignosa vinata (Amanita rubescens: carne che arrossa) e A. spissa (anello striato, verruche grigie).',
    habitat: 'Boschi di latifoglie e conifere; estate–autunno.',
  },
  {
    id: 'inocybe', nome: 'Inocybe erubescens (e altre Inocybe)', comune: 'Inocibe', sindrome: 'muscarinica',
    disegno: {
      scala: 0.8,
      cappello: { forma: 'umbonato', larghezza: 38, altezza: 30, colore: '#e7d6bf', colore2: '#b78a66', fibrille: true },
      sotto: { tipo: 'lamelle', colore: '#c7b199' },
      gambo: { colore: '#efe3d2', altezza: 78, spessore: 6 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Conico-umbonato, fibrilloso, spesso spaccato al margine' },
      { parte: 'lamelle', testo: 'Lamelle grigio-brunastre' },
      { parte: 'gambo', testo: 'Arrossa al tocco (I. erubescens); niente anello' },
    ],
    riconoscimento: ['Piccolo-medio, colori smorti, fibre radiali sul cappello.', 'Muscarina: sintomi colinergici entro 15–60 min.'],
    confusione: 'Prugnolo (Calocybe gambosa) in primavera, gambesecche.',
    habitat: 'Boschi di latifoglie, parchi; primavera–autunno.',
  },
  {
    id: 'clitocybe', nome: 'Clitocybe bianche (C. dealbata, C. rivulosa)', comune: 'Clitocibe bianche', sindrome: 'muscarinica',
    disegno: {
      scala: 0.72,
      cappello: { forma: 'imbuto', larghezza: 38, altezza: 30, colore: '#efebe2', colore2: '#d8d2c3' },
      sotto: { tipo: 'lamelle', colore: '#f4f0e7', decorrenti: true },
      gambo: { colore: '#f1ede3', altezza: 50, spessore: 5 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Piccola, bianca, a imbuto, come infarinata' },
      { parte: 'lamelle', testo: 'Lamelle che scendono sul gambo' },
      { parte: 'base', testo: 'Nei prati, spesso in cerchi' },
    ],
    riconoscimento: ['Bianche, piccole, nei prati e nei giardini.', 'Muscarina in quantità elevata.'],
    confusione: 'Gambesecche (Marasmius oreades) negli stessi cerchi, prugnolo (Calocybe gambosa).',
    habitat: 'Prati, pascoli, giardini; estate–autunno.',
  },
  {
    id: 'cortinarius', nome: 'Cortinarius orellanus e C. rubellus', comune: 'Cortinari', sindrome: 'orellanica',
    disegno: {
      scala: 0.85,
      cappello: { forma: 'umbonato', larghezza: 40, altezza: 28, colore: '#cc6a30', colore2: '#9a461c', fibrille: true },
      sotto: { tipo: 'lamelle', colore: '#b65e2b' },
      gambo: { colore: '#d9a066', altezza: 80, spessore: 7 },
      cortina: true,
    },
    etichette: [
      { parte: 'cappello', testo: 'Arancio-fulvo, asciutto, fibrilloso' },
      { parte: 'lamelle', testo: 'Lamelle color ruggine' },
      { parte: 'cortina', testo: 'Cortina (velo a ragnatela) nei giovani' },
      { parte: 'gambo', testo: 'Gambo fulvo, senza anello' },
    ],
    riconoscimento: ['Colore «ruggine» di cappello e lamelle.', 'Sintomi renali dopo giorni: chiedere dei pasti della settimana precedente.'],
    confusione: 'Finferli (Cantharellus: pieghe, non lamelle) e altri cortinari.',
    habitat: 'Boschi di latifoglie e conifere, terreni acidi; tarda estate–autunno.',
  },
  {
    id: 'gyromitra', nome: 'Gyromitra esculenta', comune: 'Falsa spugnola', sindrome: 'giromitrica',
    disegno: {
      scala: 0.9,
      cappello: { forma: 'cervello', larghezza: 42, altezza: 46, colore: '#7f3d23', colore2: '#4f2412' },
      sotto: { tipo: 'lamelle', colore: '#7f3d23' },
      gambo: { colore: '#efe5d9', altezza: 52, spessore: 12 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Cappello «a cervello», bruno-rossastro: circonvoluzioni, non alveoli' },
      { parte: 'gambo', testo: 'Gambo biancastro, tozzo, cavo' },
    ],
    riconoscimento: ['Spugnola vera: alveoli a nido d’ape. Falsa spugnola: pieghe a cervello.', 'Giromitrina → monometilidrazina: convulsioni (piridossina).'],
    confusione: 'Spugnole (Morchella).',
    habitat: 'Boschi di conifere, terreni sabbiosi; primavera.',
  },
  {
    id: 'coprinopsis', nome: 'Coprinopsis atramentaria', comune: 'Coprino atramentario', sindrome: 'coprinica',
    disegno: {
      scala: 0.85,
      cappello: { forma: 'campana', larghezza: 26, altezza: 46, colore: '#b0aaa0', colore2: '#7d776d', colore3: '#2a2725', solchi: true, inchiostro: true },
      sotto: { tipo: 'lamelle', colore: '#3a3633' },
      gambo: { colore: '#f4f1ea', altezza: 78, spessore: 6 },
      cespitoso: true,
    },
    etichette: [
      { parte: 'cappello', testo: 'Grigio, a campana, solcato' },
      { parte: 'lamelle', testo: 'Lamelle che si sciolgono in liquido nero' },
      { parte: 'gambo', testo: 'Gambo bianco; a ciuffi' },
    ],
    riconoscimento: ['Tossico solo con l’alcol (anche nei 3 giorni successivi): effetto antabuse.'],
    confusione: 'Coprino chiomato (Coprinus comatus: bianco a squame, commestibile da giovane).',
    habitat: 'Prati, orti, ceppaie interrate; primavera–autunno.',
  },
  {
    id: 'psilocybe', nome: 'Psilocybe semilanceata', comune: 'Psilocibe', sindrome: 'psicotropa',
    disegno: {
      scala: 0.62,
      cappello: { forma: 'conico', larghezza: 20, altezza: 30, colore: '#cfae70', colore2: '#8c6b37' },
      sotto: { tipo: 'lamelle', colore: '#594652' },
      gambo: { colore: '#e9dcc4', altezza: 104, spessore: 3, forma: 'flessuoso' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Piccolo, conico, con punta (papilla)' },
      { parte: 'lamelle', testo: 'Lamelle bruno-violacee' },
      { parte: 'gambo', testo: 'Gambo lungo, sottile, flessuoso' },
    ],
    riconoscimento: ['Di solito assunto volontariamente.', 'Psilocibina: allucinazioni entro 30–60 min.'],
    confusione: 'Altri piccoli funghi bruni dei prati (anche Galerina, Conocybe tossiche).',
    habitat: 'Pascoli concimati; autunno.',
  },
  {
    id: 'entoloma', nome: 'Entoloma sinuatum (E. lividum)', comune: 'Entoloma livido', sindrome: 'gastroenterica',
    disegno: {
      cappello: { forma: 'piano', larghezza: 54, altezza: 26, colore: '#cdc5b6', colore2: '#a69c8a' },
      sotto: { tipo: 'lamelle', colore: '#e5c39c' },
      gambo: { colore: '#f2eee5', altezza: 74, spessore: 10 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Grande (fino a 20 cm), grigio-avorio, lucido' },
      { parte: 'lamelle', testo: 'Lamelle giallastre, poi rosa' },
      { parte: 'gambo', testo: 'Odore di farina; niente anello' },
    ],
    riconoscimento: ['Gastroenterite violenta, a volte con epatite lieve.'],
    confusione: 'Prugnolo (Calocybe gambosa), Clitocybe nebularis, Lepista.',
    habitat: 'Boschi di latifoglie (querce, faggi); estate–autunno.',
  },
  {
    id: 'omphalotus', nome: 'Omphalotus olearius', comune: 'Fungo dell’olivo', sindrome: 'gastroenterica',
    disegno: {
      scala: 0.8,
      cappello: { forma: 'imbuto', larghezza: 40, altezza: 30, colore: '#e2791d', colore2: '#b85710' },
      sotto: { tipo: 'lamelle', colore: '#f29a2c', decorrenti: true },
      gambo: { colore: '#dc7a26', altezza: 60, spessore: 7 },
      cespitoso: true, legno: true,
    },
    etichette: [
      { parte: 'cappello', testo: 'Arancio vivo, a imbuto' },
      { parte: 'lamelle', testo: 'Lamelle vere, fitte, decorrenti (il finferlo ha pieghe)' },
      { parte: 'base', testo: 'A cespi su ceppi di olivo e quercia' },
    ],
    riconoscimento: ['Cresce a ciuffi sul legno, il finferlo singolo nel terreno.'],
    confusione: 'Finferlo (Cantharellus cibarius).',
    habitat: 'Ceppaie di olivo, quercia, castagno; estate–autunno.',
  },
  {
    id: 'rubroboletus', nome: 'Rubroboletus satanas', comune: 'Porcino malefico', sindrome: 'gastroenterica',
    disegno: {
      cappello: { forma: 'boleto', larghezza: 52, altezza: 36, colore: '#dcd8c9', colore2: '#b5b09d' },
      sotto: { tipo: 'pori', colore: '#d23a2a' },
      gambo: { colore: '#d9573c', altezza: 70, spessore: 13, forma: 'panciuto', reticolo: '#9e1f15', blu: true },
    },
    etichette: [
      { parte: 'cappello', testo: 'Biancastro-grigio' },
      { parte: 'pori', testo: 'Pori rossi (non lamelle)' },
      { parte: 'gambo', testo: 'Gambo panciuto, rosso, con reticolo' },
      { parte: 'base', testo: 'Al taglio vira al blu' },
    ],
    riconoscimento: ['Boleto con pori rossi e gambo rosso reticolato: da evitare.'],
    confusione: 'Porcini (Boletus edulis e affini: pori bianchi o gialli, non virano).',
    habitat: 'Boschi di latifoglie su calcare; estate.',
  },
  {
    id: 'agaricus-xanthodermus', nome: 'Agaricus xanthodermus', comune: 'Prataiolo giallescente', sindrome: 'gastroenterica',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 44, altezza: 30, colore: '#f5f2eb', colore2: '#d9d3c4' },
      sotto: { tipo: 'lamelle', colore: '#c49091' },
      gambo: { colore: '#f6f3ec', altezza: 78, spessore: 8, bulbo: true, baseGialla: true },
      anello: { colore: '#ffffff', tipo: 'gonna' },
    },
    etichette: [
      { parte: 'cappello', testo: 'Bianco, ingiallisce se sfregato' },
      { parte: 'lamelle', testo: 'Lamelle rosa, poi bruno-scure' },
      { parte: 'anello', testo: 'Anello ampio' },
      { parte: 'base', testo: 'Base gialla al taglio; odore di inchiostro' },
    ],
    riconoscimento: ['Il giallo intenso alla base del gambo tagliato e l’odore di fenolo.'],
    confusione: 'Prataiolo (Agaricus campestris, A. arvensis).',
    habitat: 'Prati, giardini, parchi; estate–autunno.',
  },
  {
    id: 'tricholoma-equestre', nome: 'Tricholoma equestre', comune: 'Agarico equestre', sindrome: 'rabdomiolitica',
    disegno: {
      cappello: { forma: 'convesso', larghezza: 44, altezza: 28, colore: '#d9c33b', colore2: '#9c8b38' },
      sotto: { tipo: 'lamelle', colore: '#ecd94a' },
      gambo: { colore: '#e6d460', altezza: 68, spessore: 9 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Giallo, centro brunastro' },
      { parte: 'lamelle', testo: 'Lamelle giallo zolfo' },
      { parte: 'gambo', testo: 'Gambo giallo, senza anello' },
    ],
    riconoscimento: ['Un tempo ritenuto commestibile; tossico dopo pasti ripetuti (rabdomiolisi). Vendita vietata in Italia.'],
    confusione: 'Altri tricolomi gialli.',
    habitat: 'Pinete su sabbia; autunno.',
  },
  {
    id: 'paxillus', nome: 'Paxillus involutus', comune: 'Paxillo involuto', sindrome: 'paxillica',
    disegno: {
      cappello: { forma: 'depresso', larghezza: 46, altezza: 24, colore: '#9c7c52', colore2: '#6e5230', involuto: true },
      sotto: { tipo: 'lamelle', colore: '#c7a26a', decorrenti: true },
      gambo: { colore: '#a98b62', altezza: 62, spessore: 8 },
    },
    etichette: [
      { parte: 'cappello', testo: 'Bruno, margine arrotolato verso l’interno' },
      { parte: 'lamelle', testo: 'Lamelle decorrenti, si macchiano di bruno al tocco' },
    ],
    riconoscimento: ['Un tempo consumato: emolisi immunomediata dopo pasti ripetuti.'],
    confusione: 'Altri funghi bruni a lamelle decorrenti.',
    habitat: 'Boschi di betulle e conifere, terreni acidi; estate–autunno.',
  },
]

export const specie = (id: string) => SPECIE.find((s) => s.id === id)
export const specieDi = (sindrome: string) => SPECIE.filter((s) => s.sindrome === sindrome)
