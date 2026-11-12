import { useEffect, useId, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

/*
 * Ecografia bedside: per ogni esame le scansioni (sonda sul corpo), un'immagine facsimile
 * (disegno che imita l'ecografia: settore, speckle, strutture anecogene/iperecogene) e il referto standard.
 */

// ─── Immagine «ecografica» facsimile ───
type Lab = { x: number; y: number; t: string; a?: 'start' | 'middle' | 'end' }
function Us({ tipo, children, etichetta, lab }: { tipo: 'convex' | 'lineare' | 'settoriale'; children: ReactNode; etichetta?: string; lab?: Lab[] }) {
  const id = useId().replace(/:/g, '')
  const settore = tipo === 'convex'
    ? 'M70 18 A90 90 0 0 1 170 18 L226 170 A200 200 0 0 1 14 170 Z'
    : tipo === 'settoriale' ? 'M114 8 L126 8 L222 150 A180 180 0 0 1 18 150 Z'
    : 'M40 10 H200 V172 H40 Z'
  return (
    <svg viewBox="0 0 240 180" className="w-full rounded-xl bg-black">
      <defs>
        <filter id={`sp${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85 1.6" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.25" />
        </filter>
        <filter id={`sf${id}`}><feGaussianBlur stdDeviation="1.6" /></filter>
        <radialGradient id={`tg${id}`} cx="50%" cy="0%" r="110%">
          <stop offset="0" stopColor="#bcbcbc" /><stop offset="0.55" stopColor="#6a6a6a" /><stop offset="1" stopColor="#1c1c1c" />
        </radialGradient>
        <clipPath id={`cl${id}`}><path d={settore} /></clipPath>
      </defs>
      <g clipPath={`url(#cl${id})`}>
        <rect width="240" height="180" fill={`url(#tg${id})`} opacity="0.55" />
        <g filter={`url(#sf${id})`}>{children}</g>
        <rect width="240" height="180" filter={`url(#sp${id})`} opacity="0.55" style={{ mixBlendMode: 'multiply' }} />
        <rect width="240" height="180" filter={`url(#sp${id})`} opacity="0.18" />
      </g>
      {/* scala di profondità e marcatore della sonda */}
      {[30, 60, 90, 120, 150].map((y) => <path key={y} d={`M232 ${y} h5`} stroke="#9a9a9a" strokeWidth="1" />)}
      <circle cx={tipo === 'convex' ? 72 : tipo === 'settoriale' ? 108 : 46} cy="8" r="3" fill="#8fd0ff" />
      {lab?.map((l, i) => (
        <text key={i} x={l.x} y={l.y} fontSize="11" fontWeight="800" textAnchor={l.a ?? 'middle'} fill="#ffe08a" stroke="#000" strokeWidth="2.5" paintOrder="stroke">{l.t}</text>
      ))}
      {etichetta && <text x="6" y="174" fontSize="9" fill="#cfcfcf" fontFamily="ui-monospace,monospace">{etichetta}</text>}
    </svg>
  )
}
const nero = '#050505', grigio = (v: number) => `rgb(${v},${v},${v})`


/** Rene longitudinale in stile ecografico: corticale grigia, piramidi scure, seno centrale iperecogeno. */
function Rene({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-66 0 C-66 -26 -36 -34 0 -33 C36 -34 66 -26 66 0 C66 24 40 34 0 32 C-22 31 -18 16 -36 22 C-56 28 -66 16 -66 0 Z" fill={grigio(150)} />
      <path d="M-60 0 C-60 -22 -34 -28 0 -27 C34 -28 60 -22 60 0 C60 20 38 28 0 26 C-20 25 -18 12 -36 17 C-52 22 -60 13 -60 0 Z" fill={grigio(88)} />
      {[-40, -20, 0, 20, 40].map((px, i) => <ellipse key={i} cx={px} cy={i % 2 ? 15 : -16} rx="8" ry="6" fill={grigio(48)} />)}
      <path d="M-44 -2 C-30 -10 -10 -6 0 -9 C14 -12 32 -6 44 -2 C30 6 12 2 0 6 C-14 10 -30 4 -44 -2 Z" fill={grigio(215)} />
    </g>
  )
}

// ─── Sagome anatomiche con le posizioni della sonda (dx del paziente = sinistra del disegno) ───
type Sonda = { x: number; y: number; r?: number; n: string; lineare?: boolean; dietro?: boolean; lx?: number; ly?: number }
const PELLE = 'fill-[#f3e3d6] stroke-[#b48a70]'
const REPERE = 'stroke-[#c9a58c]'

function Sonde({ sonde }: { sonde: Sonda[] }) {
  return (
    <>
      {sonde.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r ?? 0})`} opacity={s.dietro ? 0.55 : 1}>
          <rect x={s.lineare ? -10 : -8} y="-4" width={s.lineare ? 20 : 16} height="8" rx={s.lineare ? 2 : 4} className="fill-[#2f6652]" strokeDasharray={s.dietro ? '2 2' : undefined} stroke={s.dietro ? '#1f4a3a' : 'none'} />
          <circle cx={s.lineare ? -7.5 : -5.5} cy="0" r="1.6" fill="#8fd0ff" />
        </g>
      ))}
      {sonde.map((s, i) => (
        <g key={`n${i}`}>
          <circle cx={s.x + (s.lx ?? 13)} cy={s.y + (s.ly ?? -10)} r="7" className="fill-[#7b3f4a]" stroke="#fff" strokeWidth="1.2" />
          <text x={s.x + (s.lx ?? 13)} y={s.y + (s.ly ?? -10) + 3.2} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">{s.n}</text>
        </g>
      ))}
    </>
  )
}
const Lati = ({ y }: { y: number }) => (
  <g fontSize="8" fontWeight="700" className="fill-[#9b8a7e]"><text x="8" y={y}>dx</text><text x="192" y={y} textAnchor="end">sx</text></g>
)

function Tronco({ sonde }: { sonde: Sonda[] }) {
  return (
    <svg viewBox="0 0 200 215" className="w-full rounded-xl bg-carta border border-linea">
      <g className={PELLE} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M58 66 C45 72 41 88 39 106 L33 160 C32 170 44 171 45 162 L53 110 C55 98 59 88 62 82 Z" />
        <path d="M142 66 C155 72 159 88 161 106 L167 160 C168 170 156 171 155 162 L147 110 C145 98 141 88 138 82 Z" />
        <path d="M91 40 L91 54 C77 56 63 58 56 66 C52 84 56 104 60 122 C62 140 60 158 62 178 L138 178 C140 158 138 140 140 122 C144 104 148 84 144 66 C137 58 123 56 109 54 L109 40 Z" />
        <ellipse cx="100" cy="24" rx="16" ry="19" />
        <path d="M62 178 L138 178 L136 196 C122 202 110 206 100 206 C90 206 78 202 64 196 Z" className="fill-[#e8d3c3]" />
      </g>
      <g fill="none" strokeWidth="1.1" strokeLinecap="round" className={REPERE}>
        <path d="M70 66 Q85 70 97 64 M130 66 Q115 70 103 64" />
        <path d="M100 64 V112" strokeDasharray="2 2" />
        <path d="M100 113 Q84 126 66 134 M100 113 Q116 126 134 134" />
        <path d="M70 182 L94 200 M130 182 L106 200" />
      </g>
      <circle cx="100" cy="150" r="1.8" className="fill-[#b48a70]" />
      <circle cx="80" cy="92" r="1.5" className="fill-[#c9a58c]" /><circle cx="120" cy="92" r="1.5" className="fill-[#c9a58c]" />
      <Lati y={208} />
      <Sonde sonde={sonde} />
    </svg>
  )
}

function Gambe({ sonde }: { sonde: Sonda[] }) {
  return (
    <svg viewBox="0 0 200 240" className="w-full rounded-xl bg-carta border border-linea">
      <g className={PELLE} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M54 6 L146 6 L148 36 C150 60 146 84 138 112 C134 130 132 146 132 158 C132 178 128 200 126 222 L130 232 L108 232 L108 222 C106 196 106 174 104 156 C104 130 104 96 101 66 L99 66 C96 96 96 130 96 156 C94 174 94 196 92 222 L92 232 L70 232 L74 222 C72 200 68 178 68 158 C68 146 66 130 62 112 C54 84 50 60 52 36 Z" />
      </g>
      <g fill="none" strokeWidth="1.1" strokeLinecap="round" className={REPERE}>
        <path d="M58 16 L92 44 M142 16 L108 44" />
        <ellipse cx="84" cy="160" rx="9" ry="7" /><ellipse cx="116" cy="160" rx="9" ry="7" />
        <path d="M84 44 C86 80 88 112 90 138" strokeDasharray="1.5 3" className="stroke-[#3d6fb0]" strokeWidth="2" />
      </g>
      <text x="100" y="12" textAnchor="middle" fontSize="7" className="fill-[#9b8a7e]">legamento inguinale</text>
      <Lati y={236} />
      <Sonde sonde={sonde} />
    </svg>
  )
}

function Collo({ sonde }: { sonde: Sonda[] }) {
  return (
    <svg viewBox="0 0 200 215" className="w-full rounded-xl bg-carta border border-linea">
      <g className={PELLE} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M76 92 L74 150 C56 156 30 160 14 172 L10 215 L190 215 L186 172 C170 160 144 156 126 150 L124 92 Z" />
        <ellipse cx="100" cy="56" rx="38" ry="46" />
      </g>
      <g fill="none" strokeWidth="1.3" strokeLinecap="round" className={REPERE}>
        <path d="M72 92 C78 116 88 136 96 156 M128 92 C122 116 112 136 104 156" />
        <path d="M40 172 Q70 176 96 158 M160 172 Q130 176 104 158" />
        <path d="M94 112 Q100 118 106 112" />
      </g>
      <text x="60" y="128" fontSize="7" textAnchor="end" className="fill-[#9b8a7e]">SCM</text>
      <Lati y={208} />
      <Sonde sonde={sonde} />
    </svg>
  )
}

// ─── Le ecografie ───
type Eco = { id: string; nome: string; sottotitolo: string; tono: string; sonda: string; scansioni: string[]; corpo: ReactNode; immagine: ReactNode; didascalia: string; referto: string; galleria?: { tit: string; img: ReactNode }[]; punti?: { titolo: string; righe: string[] }; fonti?: { etichetta: string; url: string }[] }

const ECO: Eco[] = [
  {
    id: 'cus', nome: 'CUS – compressione venosa estesa', sottotitolo: 'Sospetta TVP: dalla femorale comune alla triforcazione', tono: 'border-l-[#3d6fb0]', sonda: 'Lineare',
    scansioni: ['Femorale comune sotto il legamento inguinale, giunzione safeno-femorale', 'Biforcazione femorale comune → femorale (superficiale) e profonda', 'Femorale a metà coscia (faccia mediale)', 'Femorale distale nel canale degli adduttori (Hunter)', 'Poplitea nel cavo popliteo (paziente prono o ginocchio flesso)', 'Triforcazione: tronco tibio-peroniero', 'Sonda trasversale, comprimere ogni 1–2 cm lungo tutto il decorso, non solo nei punti'],
    corpo: <Gambe sonde={[{ x: 82, y: 50, n: '1', lineare: true, lx: -20, ly: -2 }, { x: 85, y: 72, n: '2', lineare: true, lx: -20, ly: 0 }, { x: 87, y: 100, n: '3', lineare: true, lx: -20, ly: 0 }, { x: 89, y: 128, n: '4', lineare: true, lx: -20, ly: 0 }, { x: 84, y: 166, n: '5', lineare: true, dietro: true, lx: -20, ly: 2 }, { x: 86, y: 186, n: '6', lineare: true, dietro: true, lx: -20, ly: 4 }]} />,
    immagine: (
      <div className="grid grid-cols-2 gap-1.5">
        <Us tipo="lineare" etichetta="FEM senza compr.">
          <rect x="40" y="10" width="160" height="40" fill={grigio(120)} />
          <circle cx="96" cy="86" r="17" fill={nero} stroke={grigio(230)} strokeWidth="4" />
          <ellipse cx="140" cy="92" rx="26" ry="20" fill={nero} />
        </Us>
        <Us tipo="lineare" etichetta="con compressione">
          <rect x="40" y="10" width="160" height="34" fill={grigio(120)} />
          <circle cx="96" cy="80" r="16" fill={nero} stroke={grigio(230)} strokeWidth="4" />
          <path d="M114 88 Q140 84 166 88" stroke={grigio(190)} strokeWidth="3" fill="none" />
        </Us>
      </div>
    ),
    didascalia: 'Arteria rotonda con parete brillante; vena accanto, ovale e nera. Comprimendo, la vena normale si chiude completamente (segno di normalità); se resta aperta o contiene materiale ecogeno = TVP.',
    referto: `ECOGRAFIA VENOSA BEDSIDE CON COMPRESSIONE ESTESA – ARTO INFERIORE [DX/SX]
Vena femorale comune, giunzione safeno-femorale, vena femorale profonda all'origine, vena femorale per tutto il decorso fino al canale degli adduttori, vena poplitea e triforcazione completamente comprimibili, senza materiale ecogeno endoluminale.
Conclusione: non segni ecografici di trombosi venosa profonda prossimale nei segmenti esaminati.
[Se positivo: vena [femorale comune / poplitea] non comprimibile, con materiale ecogeno endoluminale [occludente / non occludente]: reperto compatibile con TVP.]
Esame mirato bedside: non esplora le vene del polpaccio né sostituisce l'ecocolordoppler completo; [ripetere a 5–7 giorni se D-dimero elevato e sospetto persistente].`,
  },
  {
    id: 'addome', nome: 'Addome bedside', sottotitolo: 'Reni, colecisti, aorta, vescica, liquido libero', tono: 'border-l-[#c0621a]', sonda: 'Convex',
    scansioni: ['Ipocondrio/fianco dx: fegato, colecisti, rene dx (Morison)', 'Fianco sx: milza, rene sx (più alto e posteriore)', 'Epigastrio: aorta prossimale in trasversale, diametro esterno-esterno', 'Periombelicale: aorta distale fino alla biforcazione', 'Sovrapubica: vescica (volume, globo)'],
    corpo: <Tronco sonde={[{ x: 66, y: 134, n: '1', r: 75, lx: -16, ly: -8 }, { x: 135, y: 124, n: '2', r: -75, lx: 16, ly: -8 }, { x: 100, y: 124, n: '3', r: 0, lx: 0, ly: -13 }, { x: 100, y: 160, n: '4', lx: 15, ly: 0 }, { x: 100, y: 188, n: '5', lx: 15, ly: 0 }]} />,
    immagine: (
      <Us tipo="convex" etichetta="RENE DX longitudinale">
        <path d="M0 0 H240 V86 Q120 70 0 92 Z" fill={grigio(125)} />
        <Rene x={122} y={120} s={1.05} />
      </Us>
    ),
    didascalia: 'Rene: corticale grigia, seno centrale bianco. Idronefrosi = seno aperto da aree nere ramificate. Liquido libero = striscia nera tra fegato e rene. Aorta > 3 cm = aneurisma.',
    referto: `ECOGRAFIA ADDOMINALE BEDSIDE (POCUS)
Reni: dimensioni nei limiti, non dilatazione delle cavità calico-pieliche [dx/sx]. [Idronefrosi [lieve / moderata / grave] a [dx/sx].]
Colecisti: [distesa, a pareti sottili, non calcoli / calcoli multipli con cono d'ombra, parete [ispessita ... mm], Murphy ecografico [positivo/negativo], [falda pericolecistica]].
Aorta addominale: calibro massimo [... cm] (esterno-esterno), [non dilatazioni aneurismatiche].
Vescica: [repleta / globo vescicale, volume stimato ... mL / vuota con catetere in sede].
Non versamento libero in Morison, perisplenico e nello scavo pelvico.
Esame mirato bedside, non sostitutivo dell'ecografia addominale completa.`,
  },
  {
    id: 'collo', nome: 'Vasi del collo', sottotitolo: 'Carotide e giugulare interna', tono: 'border-l-[#7b3f4a]', sonda: 'Lineare',
    scansioni: ['Trasversale dalla clavicola all’angolo della mandibola, lungo lo sternocleidomastoideo', 'Giugulare: comprimere (trombosi) e valutare il calibro con il respiro', 'Carotide comune: pervietà, flap, placche; longitudinale per confermare'],
    corpo: <Collo sonde={[{ x: 82, y: 124, n: '1', lineare: true, lx: -20, ly: 0 }]} />,
    immagine: (
      <Us tipo="lineare" etichetta="COLLO DX trasversale">
        <path d="M40 10 H200 V48 Q120 66 40 44 Z" fill={grigio(110)} />
        <circle cx="96" cy="104" r="20" fill={nero} stroke={grigio(225)} strokeWidth="4" />
        <ellipse cx="146" cy="84" rx="30" ry="18" fill={nero} />
        <ellipse cx="70" cy="150" rx="24" ry="10" fill={grigio(150)} />
      </Us>
    ),
    didascalia: 'Sotto lo sternocleidomastoideo: carotide comune rotonda, parete spessa e brillante (pulsa); giugulare interna laterale, più grande, ovale, comprimibile (varia con il respiro).',
    referto: `ECOGRAFIA BEDSIDE DEI VASI DEL COLLO [DX/SX]
Vena giugulare interna pervia, completamente comprimibile, senza materiale endoluminale; calibro [normale / turgida senza variazioni respiratorie / collassata].
Arteria carotide comune pervia, pulsatile, [non flap intimale, non ispessimenti parietali significativi / placca [...]].
Conclusione: [non segni di trombosi giugulare né alterazioni carotidee grossolane].
Esame mirato bedside, non sostitutivo dell'ecocolordoppler dei tronchi sovraortici.`,
  },
  {
    id: 'cuore', nome: 'Cuore (FoCUS)', sottotitolo: 'Shock, dispnea, ACR: funzione, VD, pericardio, cava', tono: 'border-l-[#b3261e]', sonda: 'Phased array (settoriale)',
    scansioni: ['1 Parasternale asse lungo: 3°–4° spazio a sinistra dello sterno, marcatore verso la spalla destra', '1b Parasternale asse corto: ruotare di 90° (marcatore verso la spalla sinistra), livello dei papillari', '2 Apicale 4 camere: itto (5° spazio, ascellare anteriore), marcatore a sinistra; ruotando in senso antiorario di circa 60° → apicale 2 camere (VS e AS)', '3 Sottocostale 4 camere: sotto lo xifoide, sonda piatta verso la spalla sinistra (la finestra dell’ACR)', '4 Vena cava inferiore: dal sottocostale ruotare in longitudinale, misurare a 2 cm dall’atrio destro'],
    corpo: <Tronco sonde={[{ x: 109, y: 90, n: '1', r: -60, lx: -15, ly: -6 }, { x: 124, y: 108, n: '2', r: 20, lx: 15, ly: -2 }, { x: 100, y: 122, n: '3', r: -20, lx: -15, ly: 4 }, { x: 104, y: 136, n: '4', r: 90, lx: 15, ly: 4 }]} />,
    immagine: (
      <Us tipo="settoriale" etichetta="1 · PARASTERNALE ASSE LUNGO" lab={[{ x: 120, y: 70, t: 'VD' }, { x: 84, y: 118, t: 'VS' }, { x: 188, y: 114, t: 'Ao' }, { x: 176, y: 145, t: 'AS' }, { x: 120, y: 92, t: 'setto' }, { x: 120, y: 147, t: 'pericardio' }]}>
        <path d="M0 0 H240 V42 Q120 34 0 44 Z" fill={grigio(120)} />
        <path d="M30 46 Q120 36 210 48" stroke={grigio(200)} strokeWidth="3" fill="none" />
        <path d="M44 54 Q120 46 196 58 L190 76 Q120 66 50 74 Z" fill={nero} />
        <path d="M40 82 Q120 72 200 84 L202 96 Q120 86 40 94 Z" fill={grigio(150)} />
        <path d="M36 100 Q100 92 150 100 Q160 128 120 132 Q60 134 36 122 Z" fill={nero} />
        <path d="M150 100 Q170 96 196 104 L200 118 Q176 112 156 118 Z" fill={nero} />
        <path d="M150 104 L136 128 M154 108 L170 126" stroke={grigio(225)} strokeWidth="2.5" />
        <ellipse cx="176" cy="140" rx="24" ry="14" fill={nero} />
        <path d="M30 150 Q120 160 214 150" stroke={grigio(235)} strokeWidth="3.5" fill="none" />
        <circle cx="200" cy="164" r="7" fill={nero} />
      </Us>
    ),
    galleria: [
      { tit: '1b · Parasternale asse corto (papillari)', img: (
        <Us tipo="settoriale" lab={[{ x: 70, y: 70, t: 'VD' }, { x: 120, y: 114, t: 'VS' }, { x: 176, y: 150, t: 'pericardio' }]}>
          <path d="M0 0 H240 V40 Q120 32 0 42 Z" fill={grigio(120)} />
          <path d="M40 74 Q70 46 120 56 Q100 66 92 84 Q66 76 40 86 Z" fill={nero} />
          <circle cx="120" cy="110" r="40" fill={grigio(150)} />
          <circle cx="120" cy="110" r="27" fill={nero} />
          <circle cx="104" cy="126" r="5" fill={grigio(200)} /><circle cx="138" cy="124" r="5" fill={grigio(200)} />
          <path d="M60 156 Q120 170 186 152" stroke={grigio(235)} strokeWidth="3.5" fill="none" />
        </Us>
      ) },
      { tit: '2 · Apicale 4 camere', img: (
        <Us tipo="settoriale" lab={[{ x: 92, y: 76, t: 'VD' }, { x: 148, y: 76, t: 'VS' }, { x: 88, y: 146, t: 'AD' }, { x: 150, y: 146, t: 'AS' }]}>
          <path d="M120 14 L60 110 Q90 118 116 112 Z" fill={nero} />
          <path d="M124 14 L182 112 Q150 120 126 112 Z" fill={nero} />
          <path d="M120 12 L120 160" stroke={grigio(170)} strokeWidth="6" />
          <path d="M60 112 L116 116 M126 116 L184 114" stroke={grigio(225)} strokeWidth="3" />
          <ellipse cx="88" cy="140" rx="28" ry="22" fill={nero} />
          <ellipse cx="152" cy="140" rx="28" ry="22" fill={nero} />
        </Us>
      ) },
      { tit: '2b · Apicale 2 camere (ruotare di 60° in senso antiorario)', img: (
        <Us tipo="settoriale" lab={[{ x: 120, y: 80, t: 'VS' }, { x: 120, y: 148, t: 'AS' }, { x: 176, y: 116, t: 'mitrale', a: 'start' }]}>
          <path d="M120 14 Q70 70 76 112 L166 112 Q172 70 120 14 Z" fill={nero} />
          <path d="M74 114 L166 114" stroke={grigio(225)} strokeWidth="3" />
          <ellipse cx="120" cy="142" rx="38" ry="22" fill={nero} />
        </Us>
      ) },
      { tit: '3 · Sottocostale 4 camere', img: (
        <Us tipo="settoriale" lab={[{ x: 60, y: 40, t: 'fegato', a: 'start' }, { x: 96, y: 92, t: 'VD' }, { x: 162, y: 118, t: 'VS' }, { x: 60, y: 128, t: 'AD' }, { x: 112, y: 152, t: 'AS' }]}>
          <path d="M0 0 H240 V70 Q120 56 0 76 Z" fill={grigio(130)} />
          <path d="M30 78 Q120 62 210 84" stroke={grigio(235)} strokeWidth="3" fill="none" />
          <path d="M70 86 Q130 74 200 96 L196 108 Q130 92 76 100 Z" fill={nero} />
          <path d="M60 104 Q140 98 204 118" stroke={grigio(170)} strokeWidth="6" fill="none" />
          <path d="M120 112 Q170 112 204 128 Q180 150 130 140 Z" fill={nero} />
          <ellipse cx="66" cy="132" rx="30" ry="18" fill={nero} />
          <ellipse cx="114" cy="148" rx="26" ry="14" fill={nero} />
        </Us>
      ) },
      { tit: '4 · Vena cava inferiore (longitudinale)', img: (
        <Us tipo="settoriale" lab={[{ x: 70, y: 52, t: 'fegato', a: 'start' }, { x: 84, y: 120, t: 'VCI' }, { x: 170, y: 86, t: 'AD' }, { x: 120, y: 156, t: '↕ a 2 cm dall’AD' }]}>
          <path d="M0 0 H240 V180 H0 Z" fill={grigio(128)} />
          <path d="M40 112 Q110 102 160 106 L160 126 Q110 124 40 134 Z" fill={nero} />
          <ellipse cx="172" cy="108" rx="22" ry="20" fill={nero} />
          <path d="M112 104 Q118 80 134 66" stroke={nero} strokeWidth="8" fill="none" />
          <path d="M138 98 V134" stroke="#ffe08a" strokeWidth="1.5" strokeDasharray="3 2" />
        </Us>
      ) },
    ],
    didascalia: 'Dall’alto: ventricolo destro, setto, ventricolo sinistro (cavità nera), valvola mitrale, aorta e atrio sinistro a destra; in fondo il pericardio, linea più brillante. Versamento = banda nera tra pericardio e cuore, davanti all’aorta discendente. VD più grande del VS (apicale) = sovraccarico destro.',
    referto: `ECOCARDIOGRAFIA MIRATA BEDSIDE (FoCUS)
Finestre: [parasternale asse lungo e corto / apicale 4 camere / sottocostale]; qualità [buona / sufficiente / limitata].
Ventricolo sinistro non dilatato, funzione sistolica globale [conservata / lievemente / moderatamente / severamente ridotta] alla valutazione visiva[, ipocinesia regionale in sede ...].
Ventricolo destro non dilatato (rapporto VD/VS < 1), [non movimento paradosso del setto].
Non versamento pericardico [/ versamento pericardico [lieve / moderato / severo], [con / senza] collasso diastolico delle sezioni destre].
Vena cava inferiore [... cm], collassabilità [> 50% / < 50%] con il respiro.
Non grossolane alterazioni valvolari [/ ...]. [Aorta ascendente ... cm.]
Conclusione: [...]. Esame mirato bedside, non sostitutivo dell'ecocardiogramma completo.`,
  },
  {
    id: 'occhio', nome: 'Occhio e nervo ottico', sottotitolo: 'Ipertensione endocranica (ONSD), distacco di retina, emovitreo', tono: 'border-l-[#6b4fa0]', sonda: 'Lineare',
    scansioni: ['Palpebra chiusa, molto gel, sonda appoggiata senza premere (appoggiare la mano sullo zigomo); mai su sospetta rottura del bulbo', 'Scansioni trasversale (sonda 1) e sagittale (sonda 2) per ogni occhio, guadagno basso', 'ONSD: misurare il diametro della guaina del nervo ottico 3 mm dietro il globo, media di 2 misure per occhio', 'Far muovere l’occhio (con le palpebre chiuse) per vedere le membrane mobili'],
    corpo: <Collo sonde={[{ x: 86, y: 50, n: '1', lineare: true, lx: -20, ly: -4 }, { x: 116, y: 50, n: '2', r: 90, lineare: true, lx: 18, ly: -4 }]} />,
    immagine: (
      <Us tipo="lineare" etichetta="OCCHIO · ONSD" lab={[{ x: 120, y: 66, t: 'globo' }, { x: 120, y: 30, t: 'cristallino' }, { x: 160, y: 150, t: 'nervo ottico', a: 'start' }, { x: 98, y: 126, t: '3 mm', a: 'end' }]}>
        <rect x="40" y="10" width="160" height="12" fill={grigio(130)} />
        <path d="M100 24 Q120 18 140 24" stroke={grigio(230)} strokeWidth="2.5" fill="none" />
        <circle cx="120" cy="70" r="46" fill={nero} />
        <path d="M40 22 H200 V180 H40 Z" fill="none" />
        <path d="M74 70 A46 46 0 0 0 166 70" stroke={grigio(120)} strokeWidth="3" fill="none" />
        <path d="M110 116 L106 176 L134 176 L130 116 Z" fill={grigio(55)} />
        <path d="M110 116 L106 176 M130 116 L134 176" stroke={grigio(170)} strokeWidth="2" />
      </Us>
    ),
    galleria: [
      { tit: 'Distacco di retina: membrana spessa ancorata al nervo ottico', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 70, t: 'retina' }]}>
          <circle cx="120" cy="80" r="52" fill={nero} />
          <path d="M84 118 Q96 60 120 128 Q140 70 156 118" stroke={grigio(225)} strokeWidth="3.5" fill="none" />
          <path d="M112 132 L110 176 L130 176 L128 132 Z" fill={grigio(55)} />
        </Us>
      ) },
      { tit: 'Emovitreo / distacco di vitreo: echi fini mobili, membrana sottile non ancorata', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 64, t: 'vitreo' }]}>
          <circle cx="120" cy="80" r="52" fill={nero} />
          {[[100, 90], [128, 100], [140, 78], [108, 110], [118, 86], [134, 116], [96, 104]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill={grigio(170)} />)}
          <path d="M80 112 Q120 90 160 112" stroke={grigio(150)} strokeWidth="1.5" fill="none" />
        </Us>
      ) },
    ],
    didascalia: 'Globo nero (anecogeno), cristallino brillante in alto, nervo ottico come banda scura dietro il globo. ONSD > 5–5,7 mm nell’adulto suggerisce ipertensione endocranica (dato di supporto, non sostituisce la TC). Distacco di retina: membrana spessa ancorata al nervo ottico; distacco di vitreo: sottile e molto mobile.',
    referto: `ECOGRAFIA OCULARE BEDSIDE [DX/SX/BILATERALE]
Bulbo oculare di forma regolare, camera vitreale anecogena.
Non immagini di distacco di retina né di distacco del vitreo; non emovitreo. Cristallino in sede.
Diametro della guaina del nervo ottico (ONSD, 3 mm dietro il globo): dx ... mm, sx ... mm [nei limiti / aumentato (> 5–5,7 mm), compatibile con ipertensione endocranica].
[Positivo per: membrana iperecogena ancorata al nervo ottico, compatibile con distacco di retina / echi mobili in camera vitreale da emovitreo / dislocazione del cristallino / ematoma retrobulbare.]
Esame mirato bedside; valutazione oculistica [richiesta].`,
  },
  {
    id: 'muscoli', nome: 'Muscoli e tessuti molli', sottotitolo: 'Contrattura, stiramento, strappo, ematoma, cellulite/ascesso, corpo estraneo, versamento, frattura', tono: 'border-l-[#8a6a2e]', sonda: 'Lineare (convex se profondo)',
    scansioni: ['Sempre confronto con il lato sano, in longitudinale e trasversale', 'Sonda sul punto dolente; contrazione o movimento attivo per vedere le lesioni dinamiche', 'Color Doppler per iperemia e per distinguere vasi da raccolte', 'Compressione: l’ascesso si muove (pus), il flemmone no'],
    corpo: <Gambe sonde={[{ x: 120, y: 92, n: '1', lineare: true, r: 90, lx: 16, ly: 0 }, { x: 116, y: 158, n: '2', lineare: true, lx: 18, ly: 0 }]} />,
    immagine: (
      <Us tipo="lineare" etichetta="MUSCOLO NORMALE (longitudinale)" lab={[{ x: 66, y: 32, t: 'cute', a: 'start' }, { x: 120, y: 80, t: 'fibre «a penna»' }, { x: 120, y: 160, t: 'osso' }]}>
        <rect x="40" y="10" width="160" height="26" fill={grigio(120)} />
        <path d="M40 40 H200" stroke={grigio(220)} strokeWidth="2.5" />
        <rect x="40" y="42" width="160" height="96" fill={grigio(55)} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${30 + i * 24} 138 L${60 + i * 24} 44`} stroke={grigio(165)} strokeWidth="2" />)}
        <path d="M40 140 H200" stroke={grigio(225)} strokeWidth="2.5" />
        <path d="M40 146 Q120 138 200 146" stroke={grigio(250)} strokeWidth="4" fill="none" />
        <rect x="40" y="150" width="160" height="30" fill={nero} />
      </Us>
    ),
    galleria: [
      { tit: 'Contrattura (e DOMS): ecografia normale, fibre integre; il dolore è funzionale', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 92, t: 'normale' }]}>
          <rect x="40" y="10" width="160" height="26" fill={grigio(120)} />
          <rect x="40" y="40" width="160" height="100" fill={grigio(55)} />
          {[0,1,2,3,4,5,6,7].map((i) => <path key={i} d={`M${30 + i * 24} 138 L${60 + i * 24} 44`} stroke={grigio(165)} strokeWidth="2" />)}
        </Us>
      ) },
      { tit: 'Stiramento (grado I): fibre integre, area sfumata di edema, falda di liquido lungo la fascia; spesso eco quasi normale', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 92, t: 'edema' }, { x: 120, y: 34, t: 'liquido perifasciale' }]}>
          <rect x="40" y="10" width="160" height="26" fill={grigio(120)} />
          <rect x="40" y="40" width="160" height="100" fill={grigio(55)} />
          {[0,1,2,3,4,5,6,7].map((i) => <path key={i} d={`M${30 + i * 24} 138 L${60 + i * 24} 44`} stroke={grigio(165)} strokeWidth="2" />)}
          <ellipse cx="120" cy="88" rx="44" ry="26" fill={grigio(140)} opacity="0.55" />
          <path d="M50 41 Q120 47 190 41" stroke={nero} strokeWidth="5" fill="none" />
        </Us>
      ) },
      { tit: 'Strappo parziale (grado II): interruzione di parte delle fibre con ematoma nel difetto', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 96, t: 'ematoma' }]}>
          <rect x="40" y="10" width="160" height="26" fill={grigio(120)} />
          <rect x="40" y="40" width="160" height="100" fill={grigio(55)} />
          {[0,1,2,6,7].map((i) => <path key={i} d={`M${30 + i * 24} 138 L${60 + i * 24} 44`} stroke={grigio(165)} strokeWidth="2" />)}
          <ellipse cx="120" cy="90" rx="38" ry="22" fill={nero} />
        </Us>
      ) },
      { tit: 'Rottura completa (grado III): monconi retratti «a battaglio di campana», grande ematoma', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 92, t: 'ematoma' }, { x: 62, y: 60, t: 'moncone', a: 'start' }]}>
          <rect x="40" y="10" width="160" height="26" fill={grigio(120)} />
          <rect x="40" y="40" width="160" height="100" fill={nero} />
          <path d="M40 46 Q70 50 82 90 Q70 130 40 134 Z" fill={grigio(60)} />
          <path d="M200 46 Q170 50 158 90 Q170 130 200 134 Z" fill={grigio(60)} />
          <path d="M44 120 L66 60 M54 126 L74 74" stroke={grigio(165)} strokeWidth="2" />
          <path d="M196 120 L174 60 M186 126 L166 74" stroke={grigio(165)} strokeWidth="2" />
        </Us>
      ) },
      { tit: 'Cellulite: «acciottolato» (cobblestone), sottocute ispessito', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 160, t: 'cobblestone' }]}>
          <rect x="40" y="10" width="160" height="150" fill={grigio(150)} />
          {[0, 1, 2, 3, 4, 5].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <path key={`${r}${c}`} d={`M${44 + c * 24} ${30 + r * 22} h18`} stroke={nero} strokeWidth="5" strokeLinecap="round" />))}
        </Us>
      ) },
      { tit: 'Ascesso: raccolta ipo/anecogena con parete, si deforma alla compressione', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 92, t: 'pus' }]}>
          <rect x="40" y="10" width="160" height="160" fill={grigio(135)} />
          <ellipse cx="120" cy="90" rx="46" ry="32" fill={grigio(40)} stroke={grigio(200)} strokeWidth="3" />
          {[[104, 84], [130, 96], [118, 104], [140, 82]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={grigio(110)} />)}
          <rect x="100" y="124" width="40" height="40" fill={grigio(185)} />
        </Us>
      ) },
      { tit: 'Corpo estraneo: iperecogeno con ombra (legno) o riverbero (metallo, vetro)', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 54, t: 'corpo estraneo' }]}>
          <rect x="40" y="10" width="160" height="160" fill={grigio(120)} />
          <path d="M96 70 L148 64" stroke={grigio(250)} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="122" cy="68" rx="34" ry="12" fill="none" stroke={grigio(40)} strokeWidth="5" />
          <path d="M98 74 L96 172 L148 172 L146 70 Z" fill={grigio(30)} opacity="0.85" />
        </Us>
      ) },
      { tit: 'Versamento articolare (ginocchio, recesso sovrapatellare)', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 96, t: 'versamento' }, { x: 160, y: 40, t: 'quadricipite' }]}>
          <rect x="40" y="10" width="160" height="60" fill={grigio(80)} />
          <path d="M40 72 Q120 66 200 74 L200 120 Q120 128 40 118 Z" fill={nero} />
          <path d="M40 124 Q120 130 200 122" stroke={grigio(240)} strokeWidth="4" fill="none" />
          <rect x="40" y="128" width="160" height="50" fill={nero} />
        </Us>
      ) },
      { tit: 'Frattura: interruzione o scalino della corticale, ematoma sopra', img: (
        <Us tipo="lineare" lab={[{ x: 120, y: 80, t: 'scalino' }]}>
          <rect x="40" y="10" width="160" height="90" fill={grigio(115)} />
          <ellipse cx="120" cy="92" rx="24" ry="8" fill={nero} />
          <path d="M40 104 L116 104 M126 112 L200 112" stroke={grigio(250)} strokeWidth="5" />
          <rect x="40" y="108" width="76" height="70" fill={nero} /><rect x="126" y="116" width="74" height="62" fill={nero} />
        </Us>
      ) },
    ],
    didascalia: 'Muscolo normale: fondo scuro con fibre chiare oblique «a penna» in longitudinale, aspetto «a cielo stellato» in trasversale. Lesioni muscolari: contrattura ed elongazione hanno eco normale; lo stiramento dà solo edema sfumato e liquido lungo la fascia; lo strappo è un’interruzione delle fibre con ematoma; il momento migliore per valutarle è 2–5 giorni dopo il trauma (prima l’ematoma può non essersi ancora formato). Ematoma e liquido sono neri; la cellulite dà sottocute ispessito ad acciottolato; l’ascesso è una raccolta con parete e rinforzo posteriore; i corpi estranei sono brillanti con ombra o riverbero.',
    referto: `ECOGRAFIA BEDSIDE DEI TESSUTI MOLLI / MUSCOLOSCHELETRICA – SEDE: [...]
Confronto con il controlaterale.
[Normale ecostruttura muscolare, non interruzioni delle fibre né raccolte.]
[Quadro compatibile con contrattura/elongazione: ecostruttura muscolare conservata.]
[Area di edema sfumato del muscolo ... con falda fluida perifasciale, senza interruzione delle fibre: lesione di grado I (stiramento).]
[Lesione muscolare di grado [II parziale / III completa] del muscolo ..., con interruzione delle fibre per ... mm[, monconi retratti] ed ematoma di ... × ... mm.]
[Sottocute ispessito con aspetto ad acciottolato, compatibile con cellulite; non raccolte drenabili.]
[Raccolta ipo-anecogena di ... × ... × ... mm a ... mm dalla cute, con parete iperemica al Doppler, compatibile con ascesso.]
[Formazione iperecogena lineare di ... mm a ... mm di profondità, con [cono d'ombra / artefatto da riverbero], compatibile con corpo estraneo.]
[Versamento articolare [ginocchio / anca / ...] di ... mm.]
[Interruzione della corticale di [...], compatibile con frattura.]
Esame mirato bedside.`,
  },
  {
    id: 'efast', nome: 'eFAST', sottotitolo: 'Trauma: liquido libero, PNX, versamento pericardico', tono: 'border-l-[#a3322a]', sonda: 'Convex (lineare per le pleure)',
    scansioni: ['1 Ipocondrio dx: Morison e polo inferiore del fegato', '2 Ipocondrio sx: perisplenico (più posteriore e alto)', '3 Sovrapubica: retrovescicale / Douglas', '4 Subxifoidea: pericardio', '5–6 Anteriori 2° spazio emiclaveare: sliding pleurico'],
    corpo: <Tronco sonde={[{ x: 66, y: 134, n: '1', r: 75, lx: -16, ly: -8 }, { x: 136, y: 116, n: '2', r: -75, lx: 16, ly: -8 }, { x: 100, y: 188, n: '3', lx: 15, ly: 0 }, { x: 100, y: 124, n: '4', r: -25, lx: 15, ly: 6 }, { x: 84, y: 80, n: '5', r: 90, lx: -13, ly: -6 }, { x: 116, y: 80, n: '6', r: 90, lx: 13, ly: -6 }]} />,
    immagine: (
      <Us tipo="convex" etichetta="MORISON">
        <path d="M0 0 H240 V96 Q160 84 100 112 L0 150 Z" fill={grigio(128)} />
        <path d="M0 150 L100 112 Q160 84 240 96" stroke={grigio(230)} strokeWidth="2.5" fill="none" />
        <g transform="rotate(-14 150 132)"><Rene x={150} y={134} s={0.85} /></g>
        <path d="M0 160 Q60 150 90 176" stroke={grigio(200)} strokeWidth="3" fill="none" />
      </Us>
    ),
    didascalia: 'Morison normale: fegato e rene a contatto, interfaccia brillante continua. Positivo: striscia nera (sangue) tra i due. Ogni finestra va valutata per intero, anche il polo inferiore del fegato.',
    referto: `eFAST
Non versamento libero in sede periepatica (Morison), perisplenica e pelvica.
Non versamento pericardico in scansione subxifoidea.
Sliding pleurico presente bilateralmente nelle scansioni anteriori; non segni di pneumotorace.
Non versamento pleurico alle basi.
[Positivo per: versamento libero in [Morison / perisplenico / pelvico] / versamento pericardico [con / senza] segni di tamponamento / assenza di sliding con [punto polmone] a [dx/sx] / versamento pleurico [dx/sx].]
Una eFAST negativa non esclude lesioni d'organo né emoperitoneo di piccola entità: [ripetere / TC].`,
  },
  {
    id: 'torace', nome: 'Ecografia polmonare', sottotitolo: 'Dispnea: linee A/B, sliding, consolidamenti, versamento', tono: 'border-l-[#2f6652]', sonda: 'Convex o lineare',
    punti: { titolo: 'Segni chiave (consenso internazionale 2025)', righe: [
      'Zone: protocollo a 8 zone (per lato 2 anteriori e 2 laterali, superiore e inferiore); nel critico possono bastare le 4 anteriori, più le basi posterolaterali per consolidamenti e versamento.',
      'Zona positiva = almeno 3 linee B in un fotogramma (o linee B confluenti). Sindrome interstiziale diffusa = ≥ 2 zone positive per lato; ogni altro quadro è focale. Linee B isolate alle basi laterali possono essere posturali.',
      'Edema cardiogeno: linee B diffuse, bilaterali, omogenee, più fitte nelle zone declivi; l’assenza di sindrome interstiziale diffusa lo esclude meglio della RX.',
      'Pneumotorace: sliding, linee B o polso polmonare presenti escludono il PNX in quel punto; se assenti cercare il lung point lateralmente (lo conferma); senza lung point il PNX è molto probabile. Paziente in shock o insufficienza grave: assenza di sliding, linee B e polso nella regione antero-inferiore basta per drenare se il sospetto è alto.',
      'Polmonite batterica: consolidamento irregolare a margini sfumati, broncogramma aereo dinamico, artefatti a coda di cometa al margine profondo, flusso al color Doppler. Infarto polmonare: piccolo consolidamento periferico a cuneo (≥ 5 mm) con margini netti.',
      'Versamento: spazio di solito anecogeno tra le pleure con «segno della sinusoide»; si cerca sulla linea ascellare posteriore sopra il diaframma; echi interni = essudato o sangue.',
      'Dopo l’intubazione: sliding presente su entrambi i lati (meglio se confrontato con prima) conferma il tubo in trachea, meglio dell’auscultazione.',
    ] },
    fonti: [{ etichetta: 'Volpicelli et al., Intensive Care Med 2026 – consenso internazionale LUS 2025', url: 'https://doi.org/10.1007/s00134-026-08487-2' }],
    scansioni: ['1–3 BLUE point superiore: 2°–3° spazio, emiclaveare', '2–4 BLUE point inferiore: 4°–5° spazio, ascellare anteriore', '5–6 PLAPS: base posterolaterale (versamento, consolidamento)', '→ Sonda longitudinale tra due coste («bat sign»), marcatore verso la testa'],
    corpo: <Tronco sonde={[{ x: 84, y: 80, n: '1', r: 90, lx: -13, ly: -6 }, { x: 72, y: 106, n: '2', r: 90, lx: -13, ly: -4 }, { x: 116, y: 80, n: '3', r: 90, lx: 13, ly: -6 }, { x: 128, y: 106, n: '4', r: 90, lx: 13, ly: -4 }, { x: 64, y: 126, n: '5', r: 90, lx: -14, ly: 4 }, { x: 136, y: 126, n: '6', r: 90, lx: 14, ly: 4 }]} />,
    immagine: (
      <Us tipo="lineare" etichetta="LINEE A · sliding +">
        <rect x="40" y="10" width="160" height="34" fill={grigio(115)} />
        <ellipse cx="64" cy="48" rx="18" ry="8" fill={grigio(215)} />
        <rect x="46" y="54" width="36" height="130" fill={nero} />
        <ellipse cx="176" cy="48" rx="18" ry="8" fill={grigio(215)} />
        <rect x="158" y="54" width="36" height="130" fill={nero} />
        <path d="M82 58 H158" stroke={grigio(245)} strokeWidth="4" />
        <path d="M82 102 H158" stroke={grigio(170)} strokeWidth="3" />
        <path d="M82 146 H158" stroke={grigio(120)} strokeWidth="2.5" />
      </Us>
    ),
    didascalia: 'Due coste con il loro cono d’ombra; tra loro la linea pleurica brillante che scorre (sliding). Linee A = repliche orizzontali della pleura (polmone areato). Linee B = strisce verticali dalla pleura fino in fondo (≥ 3 per campo = sindrome interstiziale).',
    referto: `ECOGRAFIA POLMONARE BEDSIDE (LUS)
Sliding pleurico presente bilateralmente.
Pattern A [bilaterale / prevalente] nelle scansioni anteriori. [Linee B multiple (≥ 3 per campo) [diffuse bilaterali / focali in sede ...].]
[Non consolidamenti / consolidamento con broncogramma aereo [dinamico] in sede ...].
[Non versamento pleurico / versamento pleurico [anecogeno / corpuscolato] [dx/sx], spessore massimo [... cm] alla base].
Conclusione: [quadro compatibile con [sindrome interstiziale diffusa (edema) / consolidamento [sede] / versamento] / quadro ecografico nei limiti].`,
  },
]

function Copia({ testo }: { testo: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button onClick={async () => { try { await navigator.clipboard.writeText(testo); setOk(true); setTimeout(() => setOk(false), 1500) } catch { /* */ } }}
      className="rounded-full bg-verde px-3 py-1 text-sm font-extrabold text-white">{ok ? 'Copiato ✓' : 'Copia referto'}</button>
  )
}

export default function Ecografie() {
  const [params] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const apri = params.get('apri')
  useEffect(() => {
    if (!apri) return
    setAperto(apri)
    requestAnimationFrame(() => document.getElementById(`eco-${apri}`)?.scrollIntoView({ block: 'start' }))
  }, [apri])
  return (
    <div className="elenco">
      {ECO.map((e) => {
        const open = aperto === e.id
        return (
          <section key={e.id} id={`eco-${e.id}`} className={`card !p-0 overflow-hidden scroll-mt-24 border-l-[6px] ${e.tono}`}>
            <button onClick={() => setAperto(open ? null : e.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
              <div className="flex-1 min-w-0">
                <p className="font-bold leading-tight">{e.nome}</p>
                <p className="text-[12.5px] text-tenue">{e.sottotitolo} · sonda {e.sonda.toLowerCase()}</p>
              </div>
              <span className={`text-tenue transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
            </button>
            {open && (
              <div className="px-4 pb-4 flex flex-col gap-3">
                <div className="grid grid-cols-[40%_1fr] gap-2 items-start">
                  <div>{e.corpo}</div>
                  <div>{e.immagine}</div>
                </div>
                {e.galleria && (
                  <div className="grid grid-cols-2 gap-2">
                    {e.galleria.map((g) => (
                      <figure key={g.tit} className="flex flex-col gap-1">
                        {g.img}
                        <figcaption className="text-[11.5px] font-bold leading-tight text-tenue">{g.tit}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                <ol className="text-[13px] leading-snug space-y-0.5">{e.scansioni.map((s, i) => <li key={i}>{/^[\d→]/.test(s) ? s : e.id === 'cus' && i === e.scansioni.length - 1 ? `→ ${s}` : `${i + 1}. ${s}`}</li>)}</ol>
                <p className="rounded-lg bg-sabbia px-3 py-2 text-[12.5px] leading-snug"><b>Cosa si vede:</b> {e.didascalia}</p>
                {e.punti && (
                  <div className="rounded-xl border border-linea bg-white p-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-verde">{e.punti.titolo}</p>
                    <ul className="mt-1.5 space-y-1 text-[13px] leading-snug">{e.punti.righe.map((r) => <li key={r} className="flex gap-2"><span className="text-tenue">•</span><span>{r}</span></li>)}</ul>
                  </div>
                )}
                <div className="rounded-xl border border-linea bg-white p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="flex-1 text-[11px] font-extrabold uppercase tracking-wide text-verde">Referto standard</p>
                    <Copia testo={e.referto} />
                  </div>
                  <p className="whitespace-pre-wrap text-[13px] leading-snug">{e.referto}</p>
                </div>
                {e.fonti && (
                  <div className="flex flex-wrap gap-2">
                    {e.fonti.map((f) => <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="rounded-full border border-verde px-3 py-1 text-[12.5px] font-bold text-verde">📄 {f.etichetta} ↗</a>)}
                  </div>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
