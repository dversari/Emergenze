/*
 * Manovre per la vertigine, illustrate passo per passo (disegni originali dell'app).
 * Ogni passo: posizione del corpo (vista laterale) e testa vista dall'alto (da seduto)
 * o dai piedi del lettino (da sdraiato), con le orecchie segnate D/S.
 * naso: angolo sullo schermo in gradi, 0 = verso l'alto dello schermo, positivo in senso orario.
 * Le versioni descritte sono per il lato DESTRO; per il sinistro sono speculari.
 */

export type Posa = 'seduto' | 'seduto-flesso' | 'supino' | 'supino-iperesteso' | 'fianco-dx' | 'fianco-sx' | 'prono'

export interface Passo { posa: Posa; naso: number; testo: string; tempo?: string; rapido?: boolean }
export interface Manovra { id: string; nome: string; tipo: 'diagnostica' | 'terapeutica'; indicazione: string; passi: Passo[]; esito?: string }

export const MANOVRE: Manovra[] = [
  {
    id: 'dix-hallpike', nome: 'Dix-Hallpike (destra)', tipo: 'diagnostica',
    indicazione: 'Canale semicircolare posteriore. Ripetere a sinistra se negativa.',
    passi: [
      { posa: 'seduto', naso: 45, testo: 'Seduto sul lettino, testa ruotata di 45° a destra.' },
      { posa: 'supino-iperesteso', naso: -45, testo: 'Portarlo rapidamente supino, testa fuori dal bordo estesa di 20°, sempre ruotata a destra. Osservare gli occhi.', tempo: '30–60 s', rapido: true },
      { posa: 'seduto', naso: 0, testo: 'Rimetterlo seduto: il nistagmo può invertirsi.' },
    ],
    esito: 'Positiva: dopo pochi secondi nistagmo torsionale (polo superiore verso l’orecchio in basso) e verticale verso l’alto, dura < 60 s, si esaurisce ripetendo → VPPB canale posteriore destro.',
  },
  {
    id: 'roll-test', nome: 'Supine roll test (Pagnini-McClure)', tipo: 'diagnostica',
    indicazione: 'Canale semicircolare laterale. Farlo prima della Dix-Hallpike (STANDING).',
    passi: [
      { posa: 'supino', naso: 0, testo: 'Supino, testa flessa di 30° (cuscino), naso verso il soffitto.' },
      { posa: 'supino', naso: -90, testo: 'Ruotare rapidamente la testa di 90° a destra. Osservare.', tempo: '30–60 s', rapido: true },
      { posa: 'supino', naso: 0, testo: 'Tornare al centro e attendere che passi.' },
      { posa: 'supino', naso: 90, testo: 'Ruotare rapidamente la testa di 90° a sinistra. Osservare.', tempo: '30–60 s', rapido: true },
    ],
    esito: 'Nistagmo orizzontale geotropo (batte verso il pavimento) in entrambe le rotazioni: lato malato = quello con nistagmo più forte. Apogeotropo (batte verso il soffitto): lato malato = quello con nistagmo più debole.',
  },
  {
    id: 'hit', nome: 'Head impulse test', tipo: 'diagnostica',
    indicazione: 'Solo con nistagmo spontaneo (sindrome vestibolare acuta).',
    passi: [
      { posa: 'seduto', naso: 0, testo: 'Seduto di fronte; il paziente fissa il naso dell’esaminatore, che gli tiene la testa con le due mani.' },
      { posa: 'seduto', naso: 20, testo: 'Rotazione rapida e breve (10–20°) verso destra, imprevedibile. Guardare gli occhi.', rapido: true },
      { posa: 'seduto', naso: -20, testo: 'Ripetere verso sinistra.', rapido: true },
    ],
    esito: 'Patologico: gli occhi si spostano con la testa e poi una saccade riporta lo sguardo sul bersaglio → deficit vestibolare periferico da quel lato. Normale con nistagmo spontaneo → sospetto centrale.',
  },
  {
    id: 'epley', nome: 'Epley (canale posteriore destro)', tipo: 'terapeutica',
    indicazione: 'VPPB del canale posteriore destro (Dix-Hallpike destra positiva).',
    passi: [
      { posa: 'seduto', naso: 45, testo: 'Seduto, testa ruotata di 45° a destra.' },
      { posa: 'supino-iperesteso', naso: -45, testo: 'Supino come nella Dix-Hallpike destra, testa estesa fuori dal bordo.', tempo: '30–60 s', rapido: true },
      { posa: 'supino-iperesteso', naso: 45, testo: 'Ruotare la testa di 90° verso sinistra, mantenendo l’estensione.', tempo: '30–60 s' },
      { posa: 'fianco-sx', naso: 135, testo: 'Girare il paziente sul fianco sinistro, testa ruotata ancora: naso verso il pavimento.', tempo: '30–60 s' },
      { posa: 'seduto-flesso', naso: 0, testo: 'Rimetterlo seduto lentamente, mento flesso.' },
    ],
    esito: 'Ripetibile nella stessa seduta se la Dix-Hallpike resta positiva.',
  },
  {
    id: 'semont', nome: 'Semont (canale posteriore destro)', tipo: 'terapeutica',
    indicazione: 'Alternativa all’Epley per il canale posteriore destro.',
    passi: [
      { posa: 'seduto', naso: -45, testo: 'Seduto sul bordo del lettino, testa ruotata di 45° a sinistra (lato sano).' },
      { posa: 'fianco-dx', naso: -45, testo: 'Coricarlo rapidamente sul fianco destro: il naso guarda in alto.', tempo: '1–2 min', rapido: true },
      { posa: 'fianco-sx', naso: 135, testo: 'Ribaltarlo rapidamente di 180° sul fianco sinistro senza cambiare la rotazione della testa: naso verso il pavimento.', tempo: '1–2 min', rapido: true },
      { posa: 'seduto', naso: 0, testo: 'Rimetterlo seduto lentamente.' },
    ],
  },
  {
    id: 'gufoni-geo', nome: 'Gufoni geotropo (laterale destro)', tipo: 'terapeutica',
    indicazione: 'VPPB del canale laterale destro, nistagmo geotropo.',
    passi: [
      { posa: 'seduto', naso: 0, testo: 'Seduto sul bordo del lettino, testa dritta.' },
      { posa: 'fianco-sx', naso: 90, testo: 'Coricarlo rapidamente sul fianco SANO (sinistro).', tempo: '1–2 min', rapido: true },
      { posa: 'fianco-sx', naso: 135, testo: 'Ruotare rapidamente la testa di 45° verso il pavimento.', tempo: '2 min', rapido: true },
      { posa: 'seduto', naso: 0, testo: 'Rimetterlo seduto lentamente.' },
    ],
  },
  {
    id: 'gufoni-apo', nome: 'Gufoni apogeotropo (laterale destro)', tipo: 'terapeutica',
    indicazione: 'VPPB del canale laterale destro, nistagmo apogeotropo.',
    passi: [
      { posa: 'seduto', naso: 0, testo: 'Seduto sul bordo del lettino, testa dritta.' },
      { posa: 'fianco-dx', naso: -90, testo: 'Coricarlo rapidamente sul fianco MALATO (destro).', tempo: '1–2 min', rapido: true },
      { posa: 'fianco-dx', naso: -45, testo: 'Ruotare rapidamente la testa di 45° verso il soffitto.', tempo: '2 min', rapido: true },
      { posa: 'seduto', naso: 0, testo: 'Rimetterlo seduto lentamente.' },
    ],
  },
  {
    id: 'lempert', nome: 'Lempert / barbecue (laterale destro, geotropo)', tipo: 'terapeutica',
    indicazione: 'Alternativa al Gufoni nel canale laterale destro geotropo: rotazioni di 90° verso il lato sano.',
    passi: [
      { posa: 'supino', naso: -90, testo: 'Supino, testa ruotata di 90° verso il lato malato (destra).', tempo: '30–60 s' },
      { posa: 'supino', naso: 0, testo: 'Testa al centro, naso al soffitto.', tempo: '30–60 s' },
      { posa: 'supino', naso: 90, testo: 'Testa ruotata di 90° a sinistra.', tempo: '30–60 s' },
      { posa: 'prono', naso: 180, testo: 'Girare il corpo prono, naso verso il pavimento (appoggiato sui gomiti).', tempo: '30–60 s' },
      { posa: 'seduto', naso: 0, testo: 'Rimetterlo seduto passando dal fianco.' },
    ],
  },
]

export const manovra = (id: string) => MANOVRE.find((m) => m.id === id)
