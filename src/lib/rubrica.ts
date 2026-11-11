/**
 * Rubrica telefonica del PS di Prato: interni ed esterni, raggruppati per specialità.
 * Trascritta dalle foto dei fogli affissi: le voci segnate vanno verificate.
 * I numeri NON sono nel codice (il repository è pubblico): stanno in Supabase e si scaricano con il PIN.
 *
 * Formato dei numeri (stringa separata da spazi; prefisso + numero esterno vengono uniti):
 *   ?  lettura incerta    !  formato anomalo    ~  ricostruito da notazione abbreviata
 *   +  aggiunto a penna   x davanti = barrato sul foglio
 * Opzioni: g: true = specialista di guardia (in evidenza); n = nota.
 */
export type Tono = 'verde' | 'bordeaux' | 'oro' | 'tenue'
export interface Categoria { id: string; nome: string; tono: Tono; parole: string }
export type Riga = [string, string, { g?: 1; n?: string }?]

export interface Numero {
  n: string; cifre: string; esterno: boolean
  incerto: boolean; anomalo: boolean; ricostruito: boolean; penna: boolean; barrato: boolean
}
export interface Voce { id: string; cat: string; nome: string; numeri: Numero[]; guardia: boolean; nota: string }

export const CATEGORIE: Categoria[] = [
  { id: 'ps', nome: 'Pronto Soccorso · HDU (OBI incluso)', tono: 'bordeaux', parole: 'dea triage obi hdu bed manager capoturno' },
  { id: 'neuro', nome: 'Neurologia · Neurochirurgia · Stroke', tono: 'verde', parole: 'nrch nch neuroradiologo interventistica trombectomia neuro ictus stroke cervello eeg angio cto neurorianimazione' },
  { id: 'cardio', nome: 'Cardiologia · Cardiochirurgia', tono: 'bordeaux', parole: 'cuore utic emodinamica stemi pmk holter' },
  { id: 'anest', nome: 'Anestesia · Rianimazione', tono: 'verde', parole: 'rianimatore anestesista intensiva subintensiva' },
  { id: 'chir', nome: 'Chirurgia · Vascolare · Toracica · Ustioni', tono: 'oro', parole: 'chirurgo sala operatoria ustionati pisa' },
  { id: 'orto', nome: 'Ortopedia', tono: 'oro', parole: 'ortopedico gessi frattura' },
  { id: 'rad', nome: 'Radiologia · Diagnostica', tono: 'verde', parole: 'rx tac tc rmn eco ecografia nucleare doppler interventista' },
  { id: 'med', nome: 'Medicina interna · AMA · Guardie mediche', tono: 'verde', parole: 'internista medicina guardia polo ama' },
  { id: 'geri', nome: 'Geriatria', tono: 'oro', parole: 'geriatra anziano dh' },
  { id: 'nefro', nome: 'Nefrologia · Dialisi', tono: 'oro', parole: 'rene nefrologo dialisi' },
  { id: 'pneumo', nome: 'Pneumologia', tono: 'verde', parole: 'polmone pneumologo' },
  { id: 'gastro', nome: 'Gastroenterologia · Endoscopia', tono: 'oro', parole: 'gastro endoscopista egds colonscopia' },
  { id: 'infett', nome: 'Malattie infettive', tono: 'verde', parole: 'infettivologo covid' },
  { id: 'onco', nome: 'Oncologia · Ematologia', tono: 'bordeaux', parole: 'oncologo ematologo' },
  { id: 'gin', nome: 'Ginecologia · Ostetricia', tono: 'bordeaux', parole: 'ginecologo ostetrica sala parto gravidanza' },
  { id: 'ped', nome: 'Pediatria · Neonatologia · Meyer', tono: 'oro', parole: 'pediatra neonato bambino meyer' },
  { id: 'uro', nome: 'Urologia', tono: 'verde', parole: 'urologo' },
  { id: 'orl', nome: 'ORL · Maxillo-facciale', tono: 'verde', parole: 'otorino orecchio maxillofacciale' },
  { id: 'ocul', nome: 'Oculistica', tono: 'verde', parole: 'occhio oculista' },
  { id: 'psi', nome: 'Psichiatria · Dipendenze', tono: 'bordeaux', parole: 'psichiatra spdc vop serd tso' },
  { id: 'tox', nome: 'Tossicologia · Antiveleni', tono: 'oro', parole: 'cav veleni intossicazione funghi' },
  { id: 'amb', nome: 'Ambulatori specialistici', tono: 'verde', parole: 'dermatologia allergologia reumatologia' },
  { id: 'lab', nome: 'Laboratorio · Trasfusionale · Anatomia patologica', tono: 'bordeaux', parole: 'sangue emoteca analisi' },
  { id: 'osp', nome: 'Altri ospedali e DEA', tono: 'tenue', parole: 'careggi pistoia torregalli aouc' },
  { id: 'terr', nome: '118 · Trasporti · Territorio', tono: 'oro', parole: 'ambulanza trasferimento seus antiviolenza cure intermedie' },
  { id: 'serv', nome: 'Centralino e servizi ospedalieri', tono: 'tenue', parole: 'centralino vigilanza ced mediazione interprete direzione' },
  { id: 'dub', nome: 'Annotazioni non attribuite', tono: 'oro', parole: '' },
]

/** Dati grezzi della rubrica: arrivano dalla Edge Function «emergenze-rubrica» dopo il PIN (non stanno nel codice pubblico). */
export type DatiRubrica = Record<string, Riga[]>

function leggiNumeri(s: string): Numero[] {
  const t = s.split(' ')
  const out: Numero[] = []
  for (let i = 0; i < t.length; i++) {
    let a = t[i]
    if (/^0\d{1,3}$|^[38]\d{2}$/.test(a) && t[i + 1] && !t[i + 1].startsWith('x')) a = a + ' ' + t[++i]
    const o: Numero = { n: '', cifre: '', esterno: false, incerto: false, anomalo: false, ricostruito: false, penna: false, barrato: false }
    if (a.startsWith('x')) { o.barrato = true; a = a.slice(1) }
    while (/[?!~+]$/.test(a)) {
      const m = a.slice(-1); a = a.slice(0, -1)
      if (m === '?') o.incerto = true
      if (m === '!') o.anomalo = true
      if (m === '~') o.ricostruito = true
      if (m === '+') o.penna = true
    }
    o.n = a
    o.cifre = a.replace(/\D/g, '')
    o.esterno = a.includes(' ') || o.cifre === '1522' || (o.cifre.length > 5 && !o.anomalo)
    out.push(o)
  }
  return out
}

export const costruisciVoci = (D: DatiRubrica): Voce[] => CATEGORIE.flatMap((c) =>
  (D[c.id] ?? []).map(([nome, num, opz], i) => ({
    id: `${c.id}-${i}`, cat: c.id, nome, numeri: leggiNumeri(num), guardia: !!opz?.g, nota: opz?.n ?? '',
  })),
)

export const ICONE: Record<string, string> = {
 ps:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
 neuro:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h0a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
 cardio:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/><path d="M5.5 12H9l1.5-2.5 2 4.5 1.5-2h4.5"/>',
 anest:'<path d="M18 2l4 4M16 4l4 4M19 5l-9 9M8 12l4 4M6 14l4 4-3 3-4-4 3-3zM3 21l2-2"/>',
 chir:'<path d="M4 20 15 9M15 9l4-4 1 1-3 5-2-2z"/><path d="M4 20l3-1"/><circle cx="7" cy="7" r="2.5"/><path d="M9 9l3 3"/>',
 orto:'<path d="M8.5 3.5a2.5 2.5 0 0 0-3.5 3.5l.5.5-1 1a2.5 2.5 0 0 0 3.5 3.5l1-1 4 4-1 1a2.5 2.5 0 0 0 3.5 3.5l1-1 .5.5a2.5 2.5 0 0 0 3.5-3.5l-.5-.5 1-1A2.5 2.5 0 0 0 17 9.5l-1 1-4-4 1-1A2.5 2.5 0 0 0 9.5 2l-1 1.5z"/>',
 rad:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 7v10M9 9h6M8.5 12h7M9 15h6"/>',
 med:'<path d="M5 3v6a4 4 0 0 0 8 0V3"/><path d="M9 13v2a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="11" r="2"/>',
 geri:'<circle cx="11" cy="4.5" r="2"/><path d="M11 7v6l-3 7M11 13l3 7M8 10l3-2 3 2"/><path d="M17 10v10"/>',
 nefro:'<path d="M15 4c3 0 5 3 5 7s-2 9-5 9-3-3-3-5 1-3 1-4-1-1-1-3 1-4 3-4z"/><path d="M12 12H6a2 2 0 0 1-2-2V4"/>',
 pneumo:'<path d="M12 3v8M12 11l-3 2M12 11l3 2"/><path d="M9 7C6 7 3 12 3 17c0 2 1 3 3 3 2 0 3-2 3-4V7zM15 7c3 0 6 5 6 10 0 2-1 3-3 3-2 0-3-2-3-4V7z"/>',
 gastro:'<path d="M9 3v4a3 3 0 0 0 3 3h2a4 4 0 0 1 4 4v1a6 6 0 0 1-6 6H8a3 3 0 0 1 0-6h3"/>',
 infett:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"/>',
 onco:'<path d="M12 3c-2.5 0-4 2-4 4 0 3 4 7 4 7s4-4 4-7c0-2-1.5-4-4-4z"/><path d="M10 13l-4 8M14 13l4 8"/>',
 gin:'<circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/>',
 ped:'<circle cx="12" cy="7" r="3"/><path d="M9 21v-5l-3-3 3-2h6l3 2-3 3v5"/>',
 uro:'<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
 orl:'<path d="M7 9a5 5 0 1 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 .5"/><path d="M10 9.5a2 2 0 1 1 4 0c0 1.5-2 2-2 3.5"/>',
 ocul:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 psi:'<path d="M9 21v-3H7a2 2 0 0 1-2-2v-3l-2-1 2-3a7 7 0 0 1 14 1c0 3-2 5-3 6v5"/><path d="M11 8a2 2 0 0 1 3 2c0 1-1 1.5-1 2"/>',
 tox:'<path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
 amb:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
 lab:'<path d="M12 3s-5 6-5 10a5 5 0 0 0 10 0c0-4-5-10-5-10z"/>',
 osp:'<path d="M4 21V8l8-5 8 5v13"/><path d="M10 21v-5h4v5M12 8v4M10 10h4"/>',
 terr:'<path d="M3 16V8a1 1 0 0 1 1-1h10v9M14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M8 10v3M6.5 11.5h3"/>',
 serv:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 dub:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01"/>'
};
