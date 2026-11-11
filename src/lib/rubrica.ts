/**
 * Rubrica telefonica del PS di Prato: interni ed esterni, raggruppati per specialità.
 * Trascritta dalle foto dei fogli affissi: le voci segnate vanno verificate.
 *
 * Formato dei numeri (stringa separata da spazi; prefisso + numero esterno vengono uniti):
 *   ?  lettura incerta    !  formato anomalo    ~  ricostruito da notazione abbreviata
 *   +  aggiunto a penna   x davanti = barrato sul foglio
 * Opzioni: g: true = specialista di guardia (in evidenza); n = nota.
 */
export type Tono = 'verde' | 'bordeaux' | 'oro' | 'tenue'
export interface Categoria { id: string; nome: string; tono: Tono; parole: string }
type Riga = [string, string, { g?: 1; n?: string }?]

export interface Numero {
  n: string; cifre: string; esterno: boolean
  incerto: boolean; anomalo: boolean; ricostruito: boolean; penna: boolean; barrato: boolean
}
export interface Voce { id: string; cat: string; nome: string; numeri: Numero[]; guardia: boolean; nota: string }

export const CATEGORIE: Categoria[] = [
  { id: 'ps', nome: 'Pronto Soccorso · HDU · OBI', tono: 'bordeaux', parole: 'dea triage obi hdu bed manager capoturno' },
  { id: 'neuro', nome: 'Neurologia · Neurochirurgia · Stroke', tono: 'verde', parole: 'nrch nch neuro ictus stroke cervello eeg angio cto neurorianimazione' },
  { id: 'cardio', nome: 'Cardiologia · Cardiochirurgia', tono: 'bordeaux', parole: 'cuore utic emodinamica stemi pmk holter' },
  { id: 'anest', nome: 'Anestesia · Rianimazione', tono: 'verde', parole: 'rianimatore anestesista intensiva subintensiva' },
  { id: 'chir', nome: 'Chirurgia · Vascolare · Toracica · Ustioni', tono: 'oro', parole: 'chirurgo sala operatoria ustionati pisa' },
  { id: 'orto', nome: 'Ortopedia', tono: 'oro', parole: 'ortopedico gessi frattura' },
  { id: 'rad', nome: 'Radiologia · Diagnostica', tono: 'verde', parole: 'rx tac tc rmn eco ecografia nucleare doppler interventista' },
  { id: 'med', nome: 'Medicina interna · Guardie mediche', tono: 'verde', parole: 'internista medicina guardia polo ama' },
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

const D: Record<string, Riga[]> = {
ps:[
 ['Triage interno','1702'],['Triage esterno','1727'],['Flusso 1','1714'],['Flusso 2','1752'],
 ['Sala rossa','1721 1722'],['Corridoio triage','1749'],['Sala arancio','1753'],['Sala rosa','1736'],['Sala 5','1735'],
 ['Stanza briefing','1739'],['Open – postazione infermieri 1','1731'],['Open – postazione infermieri 2','1738'],['Open – postazione infermieri 3','1737'],
 ['Open – postazione medico 1','1740'],['Open – postazione medico 2','1715'],['Stanza ordini','1728 1742'],
 ['Capoturno medico / dott.ssa Lombardi','4736 4204',{ g: 1 }],['Capoturno infermieristico','1169',{ g: 1 }],
 ['Dott. Baldini','4685'],['Coordinatore infermieristico PS','1741'],['Coordinatore infermieristico 3° piano','1751'],['GPA PS','1704'],
 ['Bed manager','4024 4885 4624 4675',{n:'Numeri presenti su fogli diversi'}],['Accoglienza amministrativi','1729 1730'],
 ['HDU – postazione medico','1746'],['HDU – postazione infermieri 1','1743'],['HDU – postazione infermieri 2','1744'],['HDU COVID','1734'],
 ['OBI – bancone accoglienza','2200'],['OBI – bancone infermieri','2202'],['OBI – team A','2211 2203'],['OBI – team B','2208 2210'],['OBI – team C','2207 2205'],['Coordinatore infermieristico OBI','2206']
],
neuro:[
 ['Neurologo di guardia per PS / OBI','4029',{ g: 1 }],['Neurologo di guardia per ospedale','4737',{ g: 1 }],
 ['Neurologo – altri recapiti','4700 4701'],['Neurologia / stroke – reparto','4202'],['Elettrofisiologo – portatile','1625'],
 ['Ambulatorio elettrofisiologia – EEG','1442'],['Ambulatorio neurologia – botox','1429'],
 ['Neurochirurgo (Careggi)','331 6225069',{ g: 1 }],['Neurochirurgo interventista','348 6527779',{ g: 1 }],
 ['Neurochirurgia Careggi','055 7947530 055 7947885~'],['Neurochirurgia – fax','055 7947756'],
 ['Stroke team Careggi','055 7947665',{ g: 1 }],['Sala angiografica Careggi','055 79472892! 055 7946949',{n:'Primo numero con una cifra in più'}],['Sala angiografica – fax','055 7947087'],
 ['Neurorianimazione CTO','055 7948419 055 7948416~']
],
cardio:[
 ['Cardiologo di guardia','4731 6273+ 4870',{ g: 1 }],['UTIC','3732 3733 3766'],['Cardiologia – reparto','x3772'],
 ['Emodinamica','3760'],['Elettrofisiologia','3761'],['PMK','1409'],['Test da sforzo','1410'],['Holter ECG','1415'],
 ['Cardiochirurgo (Careggi)','349 2229724',{ g: 1 }]
],
anest:[
 ['Anestesista di guardia','4734',{ g: 1 }],['Rianimatore di guardia','4735 2222 6248 4871',{ g: 1 }],['Anestesista per ostetricia','4873',{ g: 1 }],
 ['Rianimazione – reparto','3712 3702'],['Subintensiva','3762']
],
chir:[
 ['Chirurgo di guardia','4730 6228 4874',{ g: 1 }],['Chirurgo vascolare di guardia','3664',{ g: 1 }],['Ambulatorio chirurgia vascolare','1437'],
 ['Chirurgia – settore 1','3250'],['Settore 1, 2° piano – infermieri','3250'],['Chirurgia – settore 2','3300'],
 ['Settore 2, 2° piano – medici','3308 3311 3224'],['Settore 2, 2° piano – infermieri','3300 3301'],['Sala operatoria','3600'],
 ['Chirurgo vascolare Torregalli','055 6932038',{ g: 1, n:'Solo giorno'}],['Chirurgo toracico','335 7914233',{ g: 1 }],
 ['Chirurgia toracica – visite ambulatoriali','055 7947943 055 7947856'],
 ['Centro ustioni Pisa','050 996894 050 996966'],['Ambulatorio ustioni Pisa','050 996594'],['Centro ustioni Pisa – fax','050 995239']
],
orto:[['Ortopedico di guardia PS','4877',{ g: 1 }],['Sala gessi','1726'],['Ortopedia – reparto','3301 3302 3300']],
rad:[
 ['Radiologo di guardia','4732 1830 1848',{ g: 1 }],['Ecografia','1724 1826',{n:'1724 annotato “eco immagini”'}],['TAC','1826 1843'],['RMN','1823'],
 ['Angiologia Doppler','1820'],['Medicina nucleare','1874 1866 1867 1891 1861 1876'],['Coordinatore medicina nucleare','x1837? 1406 1870'],
 ['Radiologo interventista Careggi','347 6619120',{ g: 1 }],['Radiologo interventista Torregalli – dott. Falchini','333 6191285',{ g: 1 }]
],
med:[
 ['Guardia polo 1 (Polo 1 + 2A, area medica)','4738',{ g: 1 }],['Guardia polo 2 / Medicina 1','4742',{ g: 1 }],
 ['Medico AMA','4001'],['Medicina 1 – reparto','4410 4411 4412'],
 ['Medicina 2 (8–20)','4738'],['Medicina 2 – medico','6224'],['Medicina 2 – reparto','4310 4311 4312'],
 ['Medicina 2A','4724'],['Medicina 2A – reparto NOP','4212'],['Medicina 3','4889'],['Medicina 3 – reparto onco/reu/nefro','3402'],
 ['Day service medico / DS internistico','4876'],['GPA AMA','1168'],
 ['Settore 6, 2° piano – medici','1173 3510',{n:'Specialità non indicata sul foglio'}],['Settore 6, 2° piano – infermieri','3502 3503']],
geri:[['Geriatra di guardia','4007',{ g: 1 }],['Geriatria','6223 4057?'],['Geriatria – reparto','2302 4206'],['DH geriatrico','2610']],
nefro:[['Nefrologo di guardia','1621',{ g: 1 }],['Nefrologia','6250'],['Dialisi','1224']],
pneumo:[['Pneumologo di guardia','4009',{ g: 1 }],['Pneumologia – guardia','6346'],['Pneumologia – stanza','4630'],['Pneumologia – ambulatorio','1425 1426 4009+']],
gastro:[['Gastroenterologo / endoscopista','4006 1611 3469+',{ g: 1 }],['Sala endoscopica','1602 1603'],['Gastroenterologia Careggi','348 8511849?']],
infett:[['Infettivologo di guardia','4733',{ g: 1 }],['Malattie infettive – reparto','6221 3208 3220'],['COVID 1 – medico','3256'],['Malattie infettive Pistoia','0573 351562 0573 351511']],
onco:[['Oncologo di guardia','4008',{ g: 1 }],['Oncologia – reparto','6227 2764'],['Ematologia','2226 2752 2758',{n:'Annotazione in alto: “2226 / 2754?”'}]],
gin:[
 ['Ginecologo di guardia','4881 4875 6208',{ g: 1 }],['Ostetricia','4875 4881'],['Sala parto','6229'],
 ['Fast track ginecologico','2423 2403+ 1741?'],['Ginecologia – reparto','2402'],['Ginecologia – aggiunta','4741?',{n:'Accanto a 4875'}]
],
ped:[
 ['Pediatra di guardia','4879',{ g: 1, n:'Altre cifre a matita non decifrabili'}],['Neonatologo di guardia','4878',{ g: 1 }],['Pediatria PS','1745'],
 ['DEA Meyer','055 5662421'],['Meyer – centralino','055 56621'],['Laboratorio Meyer','331 8509388'],['Laboratorio Meyer – fax','055 7949559'],
 ['Referente Meyer (nome poco leggibile)','329 6705556? 320 4374576?']
],
uro:[['Urologo di guardia','1604 6215 4625?',{ g: 1, n:'1604 ripetuto a penna'}]],
orl:[['Otorino di guardia','4880 6333',{ g: 1 }],['Ambulatorio ORL','1885'],['Chirurgo maxillo-facciale','348 0116570',{ g: 1 }]],
ocul:[['Oculista PS','1416 1420',{ g: 1 }],['Oculista Careggi','055 7947260',{ g: 1 }]],
psi:[
 ['Psichiatra di guardia','6232',{ g: 1 }],['VOP – visite psichiatriche urgenti','1507 1504 1510 1506'],['VOP – esterni','0574 807900 0574 8079007!'],
 ['Psichiatria – reparto','3202 3203 3229'],['SERD','7400 7401 7425? 7429+',{n:'Due annotazioni diverse unite'}],
 ['Villa Fiorita','0574 4891502! 393 8018572']
],
tox:[
 ['Tossicologia Careggi','055 7947819 055 7946238 055 7947817',{ g: 1 }],['Laboratorio urgenze tossicologiche','055 7947262 055 7949529 055 794939…!',{n:'Ultimo numero tagliato'}],
 ['Tossicologia – reparto','055 7947844 055 7947481'],['Tossicologia in gravidanza','055 7946859'],['Micologo (intossicazione da funghi)','339 6507700?']
],
amb:[['Dermatologia','7333 7335'],['Allergologia','7344 7339'],['Reumatologia','4648 1209+'],['Reumatologia – ambulatorio','7578 7579']],
lab:[
 ['Laboratorio urgenze','3812 3822 3828 3826'],['Laboratorio – medico','1165'],['Laboratorio – annotazione','4407+',{n:'Manoscritto vicino a 3812'}],
 ['Trasfusionale','1391'],['Trasfusionale – ambulatorio','1380 1383'],['Microbiologia Careggi','055 7945120'],['Anatomia patologica – dott. Ferrucci?','0574 807802?']
],
osp:[
 ['DEA Careggi','055 7947243 055 7947235~ 055 7947088~'],['Centralino Careggi','055 794111'],['Ispettore AOUC','055 7947292'],
 ['DEA Pistoia','0573 351750'],['Torregalli – centralino','055 69321']
],
terr:[
 ['Centrale 118','800 118118'],['Centrale 118 – trasferimenti','055 227677430!',{n:'12 cifre: un numero fisso italiano ne ha al massimo 11, verificare'}],['Coordinatore infermieristico trasferimenti','1750 340 3141601'],
 ['SEUS','800 010622?',{n:'Manoscritto sopra un numero barrato'}],['SEUS – altro recapito','0573 573180?'],['SEUS – centrale operativa','0571 1833792'],
 ['Cure intermedie','7363 7309 7355 7685+ 7749+'],['CoDeCaSa','347 0749988?'],
 ['Medicina del lavoro','0574 805506 0574 805507~ 0574 805508~'],
 ['La Nara (antiviolenza)','0574 34472'],['Numero antiviolenza (H24)','1522'],['Melagrana','0574 660311']
],
serv:[
 ['Centralino','1300 1301 1302'],['Securitas','1163'],['Vigilanza','4739'],
 ['Medico di direzione','1614+'],['CED','5101'],['CED – assistenza informatica','800 800567'],['Portantini','4026'],
 ['Amministrativi','2201+'],['Stanza steward, 3° piano','4010+'],['Progetto PASS','4740'],
 ['Mediazione cinese','3227'],['Mediazione urdu','1166'],['Mediazione farsi – Alessandra','338 6755057']
],
dub:[
 ['2ª foto, sotto Medicina 2A (forse Torregalli)','055 6932111?'],['2ª foto, accanto al chirurgo toracico','223?'],
 ['3ª foto, vicino a elettrofisiologia','3871?'],['4ª foto, foglio sullo sfondo','055 7678…!'],['4ª foto, riquadro “CdC…”','8881…?'],['4ª foto, parte bassa','1881?']
]};

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

export const VOCI: Voce[] = CATEGORIE.flatMap((c) =>
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
