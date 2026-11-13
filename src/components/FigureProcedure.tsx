/*
 * Schemi disegnati per le procedure (SVG, palette dell'app). Non sono illustrazioni anatomiche
 * in scala: servono a ricordare repere, punto d'ingresso e direzione.
 */
import type { ReactNode } from 'react'
import IsolamentoTabella from './IsolamentoTabella'

const T = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const pelle = 'fill-sabbia stroke-tenue'
const testo = (x: number, y: number, s: string, cls = 'fill-testo', size = 10, anchor: 'start' | 'middle' | 'end' = 'start', bold = false) => (
  <text x={x} y={y} fontSize={size} textAnchor={anchor} fontWeight={bold ? 800 : 600} className={cls}>{s}</text>
)
const X = (x: number, y: number, r = 6) => (
  <g className="stroke-bordeaux" strokeWidth={3} {...T}><path d={`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`} /></g>
)
const freccia = (d: string, cls = 'stroke-bordeaux') => (
  <path d={d} {...T} strokeWidth={2.5} className={cls} markerEnd="url(#punta)" />
)
const defs = (
  <defs>
    <marker id="punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className="fill-bordeaux" />
    </marker>
  </defs>
)

/** Busto visto di fronte, centrato in cx. */
const BustoFronte = ({ cx = 110, y = 14 }: { cx?: number; y?: number }) => (
  <g>
    <path d={`M${cx - 22} ${y} Q${cx} ${y - 6} ${cx + 22} ${y} L${cx + 26} ${y + 14} Q${cx + 70} ${y + 18} ${cx + 78} ${y + 44} L${cx + 70} ${y + 176} L${cx - 70} ${y + 176} L${cx - 78} ${y + 44} Q${cx - 70} ${y + 18} ${cx - 26} ${y + 14} Z`} className={pelle} strokeWidth={1.5} />
    <path d={`M${cx} ${y + 26} L${cx} ${y + 92}`} {...T} className="stroke-tenue" strokeWidth={5} />
    <path d={`M${cx - 6} ${y + 92} L${cx} ${y + 102} L${cx + 6} ${y + 92}`} {...T} className="stroke-tenue" strokeWidth={2} />
    <path d={`M${cx - 4} ${y + 22} Q${cx - 30} ${y + 16} ${cx - 60} ${y + 24} M${cx + 4} ${y + 22} Q${cx + 30} ${y + 16} ${cx + 60} ${y + 24}`} {...T} className="stroke-tenue" strokeWidth={2} />
  </g>
)

function Fig({ children, didascalia, alto = 200 }: { children: ReactNode; didascalia: string; alto?: number }) {
  return (
    <figure className="rounded-2xl bg-carta border border-linea p-2">
      <svg viewBox={`0 0 320 ${alto}`} className="w-full h-auto" role="img" aria-label={didascalia}>{defs}{children}</svg>
      <figcaption className="text-[11.5px] text-tenue leading-snug px-1 pt-1">{didascalia}</figcaption>
    </figure>
  )
}

const RSI = () => (
  <Fig didascalia="Posizione: meato acustico allineato al giugulo (rampa se obeso); tubo a 21 cm (donna) / 23 cm (uomo) all’arcata, cuffia 20–30 cmH₂O, conferma con onda capnografica.">
    <path d="M20 170 L190 170 L190 182 L20 182 Z" className="fill-linea" />
    <path d="M30 170 L120 140 L120 170 Z" className="fill-verde3 stroke-verde2" strokeWidth={1.5} />
    <path d="M118 140 Q120 112 146 104 L232 104 Q252 104 262 120 L290 128 L290 160 L150 160 Q126 160 118 140 Z" className={pelle} strokeWidth={1.5} />
    <circle cx="92" cy="104" r="34" className={pelle} strokeWidth={1.5} />
    <path d="M60 96 Q50 104 60 112" {...T} className="stroke-tenue" strokeWidth={2} />
    <circle cx="104" cy="98" r="4" className="fill-tenue" />
    {testo(98, 64, 'orecchio', 'fill-tenue', 9, 'middle')}
    <path d="M104 98 L160 98" {...T} strokeDasharray="4 4" strokeWidth={2} className="stroke-bordeaux" />
    <circle cx="160" cy="98" r="4" className="fill-bordeaux" />
    {testo(166, 94, 'giugulo', 'fill-bordeaux', 10)}
    {testo(104, 30, 'orecchio e giugulo allineati', 'fill-testo', 10, 'middle', true)}
    <g transform="translate(216 14)">
      <rect width="96" height="58" rx="10" className="fill-sabbia stroke-linea" />
      <path d="M8 44 L20 44 L24 18 L56 16 L60 44 L72 44 L76 18 L88 16" {...T} strokeWidth={2.5} className="stroke-verde" />
      {testo(48, 54, 'capnografia: onda', 'fill-verde', 8.5, 'middle', true)}
    </g>
  </Fig>
)

const Crico = () => (
  <Fig didascalia="Mano non dominante sulla laringe (pollice e medio), indice sulla membrana cricotiroidea: taglio orizzontale attraverso cute e membrana, rotazione della lama di 90°, bougie, tubo 6.0 cuffiato.">
    <path d="M100 0 Q96 100 86 200 L234 200 Q224 100 220 0 Z" className={pelle} strokeWidth={1.5} />
    <path d="M128 46 L160 98 L192 46 Q160 36 128 46 Z" className="fill-carta stroke-tenue" strokeWidth={2} />
    {testo(160, 34, 'cartilagine tiroidea', 'fill-tenue', 9, 'middle')}
    <rect x="140" y="102" width="40" height="14" rx="3" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={2} />
    <rect x="134" y="120" width="52" height="14" rx="6" className="fill-carta stroke-tenue" strokeWidth={2} />
    {[140, 152, 164, 176].map((y) => <rect key={y} x="140" y={y} width="40" height="7" rx="3" className="fill-linea" />)}
    {testo(128, 140, 'cricoide', 'fill-tenue', 9, 'end')}
    <path d="M118 109 L202 109" {...T} strokeWidth={3} className="stroke-bordeaux" />
    {testo(206, 106, 'membrana', 'fill-bordeaux', 10, 'start', true)}
    {testo(206, 118, 'taglio orizzontale', 'fill-bordeaux', 9)}
    <g transform="translate(236 140)">
      {testo(0, 0, '1 bisturi', 'fill-testo', 9.5, 'start', true)}
      {testo(0, 13, '2 ruota 90°', 'fill-testo', 9.5, 'start', true)}
      {testo(0, 26, '3 bougie', 'fill-testo', 9.5, 'start', true)}
      {testo(0, 39, '4 tubo 6.0', 'fill-testo', 9.5, 'start', true)}
    </g>
  </Fig>
)

const Toracentesi = () => (
  <Fig didascalia="Paziente seduto, appoggiato in avanti. Punto ecoguidato 1–2 spazi sotto il livello del versamento, tra linea scapolare e ascellare posteriore; ago sul margine SUPERIORE della costa inferiore (fascio vascolo-nervoso sotto ogni costa).">
    <path d="M30 20 Q90 6 150 20 L160 190 L20 190 Z" className={pelle} strokeWidth={1.5} />
    <path d="M90 22 L90 186" {...T} strokeDasharray="3 5" strokeWidth={3} className="stroke-tenue" />
    <path d="M44 40 L76 34 L72 92 Z" className="fill-carta stroke-tenue" strokeWidth={1.5} />
    {[60, 80, 100, 120, 140, 160].map((y) => <path key={y} d={`M30 ${y + 8} Q60 ${y - 4} 88 ${y}`} {...T} strokeWidth={1.5} className="stroke-linea-forte" />)}
    <path d="M24 130 Q56 122 88 126 L88 186 L22 186 Z" className="fill-verde3" opacity={0.9} />
    {testo(54, 178, 'versamento', 'fill-verde', 9, 'middle', true)}
    {X(52, 146)}
    <g transform="translate(180 30)">
      <circle cx="62" cy="70" r="66" className="fill-carta stroke-linea" />
      <rect x="22" y="22" width="80" height="22" rx="10" className="fill-linea" />
      {testo(62, 37, 'costa sopra', 'fill-tenue', 9, 'middle')}
      <circle cx="40" cy="52" r="5" className="fill-bordeaux2" /><circle cx="56" cy="52" r="5" className="fill-bordeaux" /><circle cx="72" cy="52" r="4" className="fill-oro2" />
      {testo(86, 56, 'V A N', 'fill-bordeaux', 9)}
      <rect x="22" y="96" width="80" height="22" rx="10" className="fill-linea" />
      {testo(62, 111, 'costa sotto', 'fill-tenue', 9, 'middle')}
      {freccia('M-20 92 L50 92')}
      {testo(62, 132, 'sul bordo superiore', 'fill-bordeaux', 9.5, 'middle', true)}
    </g>
  </Fig>
)

const Triangolo = ({ didascalia }: { didascalia: string }) => (
  <Fig didascalia={didascalia}>
    <path d="M60 196 L74 70 Q80 40 110 34 L160 30 Q196 34 206 70 L222 196 Z" className={pelle} strokeWidth={1.5} />
    <path d="M110 34 Q118 8 150 4 L176 4 L180 30" className={pelle} strokeWidth={1.5} />
    <path d="M100 60 L130 150" {...T} strokeWidth={2} className="stroke-tenue" />
    {testo(96, 56, 'gran pettorale', 'fill-tenue', 9, 'end')}
    <path d="M196 64 L176 150" {...T} strokeWidth={2} className="stroke-tenue" />
    {testo(200, 60, 'gran dorsale', 'fill-tenue', 9)}
    <path d="M110 64 L188 64 L176 150 L130 150 Z" className="fill-verde3 stroke-verde" strokeWidth={2} opacity={0.95} />
    <path d="M70 150 L214 150" {...T} strokeDasharray="5 5" strokeWidth={2} className="stroke-oro" />
    {testo(214, 166, '5° spazio', 'fill-oro', 9, 'end')}
    {X(150, 126)}
    {testo(150, 104, 'triangolo di sicurezza', 'fill-verde', 9.5, 'middle', true)}
    {testo(150, 176, 'linea ascellare media', 'fill-testo', 9, 'middle')}
    <path d="M150 160 L150 186" {...T} strokeDasharray="3 4" strokeWidth={1.5} className="stroke-testo" />
  </Fig>
)

const Decompressione = () => (
  <Fig didascalia="Adulto: 4°–5° spazio intercostale appena anteriore alla linea ascellare media (parete più sottile); alternativa 2° spazio sulla emiclaveare. Poi toracostomia o drenaggio.">
    <BustoFronte cx={110} />
    {[50, 66, 82, 98, 114].map((y) => <path key={y} d={`M${126} ${y} Q160 ${y - 6} 182 ${y + 6}`} {...T} strokeWidth={1.2} className="stroke-linea-forte" />)}
    {X(150, 54)}
    {testo(150, 44, '2° spazio emiclaveare', 'fill-bordeaux', 8.5, 'middle')}
    {X(180, 112)}
    <g transform="translate(214 96)">
      {testo(0, 0, '4°–5° spazio', 'fill-bordeaux', 10, 'start', true)}
      {testo(0, 13, 'ascellare anteriore', 'fill-bordeaux', 9.5)}
      {testo(0, 26, '(prima scelta)', 'fill-bordeaux', 9.5)}
    </g>
    {freccia('M212 104 L190 110')}
  </Fig>
)

const Pericardio = () => (
  <Fig didascalia="Sempre ecoguidata: punto dove il versamento è più vicino alla cute. Via sottoxifoidea: ago a 30–45° verso la spalla sinistra; alternative apicale o parasternale sinistra (sul margine superiore della costa, lontano dall’arteria mammaria).">
    <BustoFronte cx={130} />
    <ellipse cx="146" cy="88" rx="40" ry="30" className="fill-verde3 stroke-verde" strokeWidth={2} />
    <ellipse cx="146" cy="88" rx="28" ry="20" className="fill-bordeaux3 stroke-bordeaux" strokeWidth={2} />
    {testo(146, 92, 'cuore', 'fill-bordeaux', 9, 'middle', true)}
    {testo(200, 70, 'versamento', 'fill-verde', 9)}
    {X(124, 126)}
    {freccia('M124 126 L178 54')}
    {testo(184, 50, 'verso la spalla sx', 'fill-bordeaux', 9.5, 'start', true)}
    {testo(70, 160, 'sottoxifoidea 30–45°', 'fill-bordeaux', 9.5, 'start', true)}
    <circle cx="186" cy="104" r="5" className="fill-oro" />
    {testo(196, 118, 'apicale', 'fill-oro', 9)}
  </Fig>
)

const Paracentesi = () => (
  <Fig didascalia="Fossa iliaca sinistra: circa 2 dita medialmente e 2 dita sopra la spina iliaca antero-superiore, lateralmente al retto (lontano dai vasi epigastrici). Ecoguidata, tecnica a Z.">
    <path d="M70 10 L250 10 L262 150 Q160 200 58 150 Z" className={pelle} strokeWidth={1.5} />
    <circle cx="160" cy="84" r="5" className="fill-tenue" />
    <path d="M134 14 L128 170 M186 14 L192 170" {...T} strokeWidth={2} className="stroke-tenue" />
    <path d="M140 20 L136 168 M180 20 L184 168" {...T} strokeDasharray="4 4" strokeWidth={1.8} className="stroke-bordeaux2" />
    {testo(160, 190, 'vasi epigastrici (sotto il retto): evitare', 'fill-bordeaux2', 9, 'middle')}
    <circle cx="80" cy="140" r="5" className="fill-oro" /><circle cx="240" cy="140" r="5" className="fill-oro" />
    {testo(56, 160, 'SIAS', 'fill-oro', 9)}
    {X(240 - 30, 120)}
    {testo(250, 100, 'fossa iliaca sx', 'fill-bordeaux', 9.5, 'end', true)}
    {testo(160, 60, 'ombelico', 'fill-tenue', 9, 'middle')}
  </Fig>
)

const Rachicentesi = () => (
  <Fig didascalia="Decubito laterale (o seduto), schiena flessa. Linea tra le creste iliache = processo spinoso di L4: entrare in L3–L4 o L4–L5 sulla linea mediana, ago diretto verso l’ombelico, mandrino in sede, bisello parallelo alle fibre.">
    <path d="M80 4 L240 4 L252 190 L68 190 Z" className={pelle} strokeWidth={1.5} />
    {[20, 44, 68, 92, 116, 140, 164].map((y) => <rect key={y} x="152" y={y} width="16" height="14" rx="5" className="fill-carta stroke-tenue" strokeWidth={1.5} />)}
    <path d="M70 120 Q100 90 140 100 M250 120 Q220 90 180 100" {...T} strokeWidth={3} className="stroke-oro" />
    {testo(74, 140, 'cresta iliaca', 'fill-oro', 9)}
    <path d="M60 105 L260 105" {...T} strokeDasharray="5 5" strokeWidth={2} className="stroke-oro" />
    {testo(256, 100, 'L4', 'fill-oro', 10, 'start', true)}{testo(256, 112, 'Tuffier', 'fill-oro', 9)}
    {X(160, 86)}
    {testo(178, 84, 'L3–L4', 'fill-bordeaux', 10, 'start', true)}
    {X(160, 111)}
    {testo(178, 124, 'L4–L5', 'fill-bordeaux', 10, 'start', true)}
  </Fig>
)

const CVC = () => (
  <Fig didascalia="Giugulare interna ecoguidata: sonda trasversale all’apice del triangolo dello sternocleidomastoideo. Vena laterale, ovale e comprimibile; carotide mediale, rotonda e pulsante. Ago visualizzato sempre, Seldinger, controllo del filo in vena.">
    <path d="M30 0 L130 0 L140 200 L20 200 Z" className={pelle} strokeWidth={1.5} />
    <path d="M100 10 L64 170 M100 10 L104 170" {...T} strokeWidth={4} className="stroke-tenue" />
    {testo(28, 186, 'capo sternale', 'fill-tenue', 8.5)}
    {testo(100, 186, 'clavicolare', 'fill-tenue', 8.5)}
    {X(86, 124)}
    <rect x="70" y="100" width="34" height="12" rx="4" className="fill-verde stroke-verde-scuro" />
    {testo(108, 104, 'sonda', 'fill-verde', 9)}
    <g transform="translate(160 18)">
      <path d="M0 0 L150 0 L150 160 L0 160 Z" className="fill-testo" />
      <path d="M0 0 L150 0" {...T} strokeWidth={6} className="stroke-verde" />
      <ellipse cx="96" cy="70" rx="30" ry="20" className="fill-black stroke-verde2" strokeWidth={2} />
      {testo(96, 74, 'VENA', 'fill-verde2', 10, 'middle', true)}
      <circle cx="44" cy="96" r="14" className="fill-black stroke-bordeaux2" strokeWidth={3} />
      {testo(44, 126, 'carotide', 'fill-bordeaux2', 9, 'middle', true)}
      {testo(120, 150, 'laterale →', 'fill-linea', 8.5, 'middle')}
      {testo(36, 150, '← mediale', 'fill-linea', 8.5, 'middle')}
    </g>
  </Fig>
)

const IO = () => (
  <Fig didascalia="Tibia prossimale: 2 cm sotto la tuberosità tibiale, 1–2 cm medialmente, sulla superficie piana. Omero prossimale: mano sull’ombelico (braccio addotto e intraruotato), 1–2 cm sopra il collo chirurgico, tubercolo maggiore. Ago a 90° all’osso.">
    <path d="M40 10 L110 10 L104 190 L54 190 Z" className={pelle} strokeWidth={1.5} />
    <ellipse cx="76" cy="40" rx="20" ry="16" className="fill-carta stroke-tenue" strokeWidth={1.5} />
    {testo(76, 44, 'rotula', 'fill-tenue', 8.5, 'middle')}
    <circle cx="78" cy="76" r="6" className="fill-linea stroke-tenue" />
    {testo(118, 78, 'tuberosità', 'fill-tenue', 9)}
    {X(92, 100)}
    {testo(118, 104, '2 cm sotto,', 'fill-bordeaux', 9.5, 'start', true)}
    {testo(118, 116, '1–2 cm mediale', 'fill-bordeaux', 9.5, 'start', true)}
    {testo(76, 196, 'tibia', 'fill-tenue', 9, 'middle')}
    <g transform="translate(190 0)">
      <circle cx="56" cy="44" r="34" className={pelle} strokeWidth={1.5} />
      <path d="M30 70 L40 190 L86 190 L84 70" className={pelle} strokeWidth={1.5} />
      {X(66, 40)}
      {testo(56, 100, 'omero:', 'fill-bordeaux', 9.5, 'middle', true)}
      {testo(56, 112, 'tubercolo maggiore', 'fill-bordeaux', 9, 'middle')}
      {testo(56, 150, 'mano sull’ombelico', 'fill-tenue', 9, 'middle')}
    </g>
  </Fig>
)

const Placche = ({ didascalia, cve }: { didascalia: string; cve?: boolean }) => (
  <Fig didascalia={didascalia}>
    <BustoFronte cx={90} />
    <rect x="44" y="40" width="34" height="26" rx="8" className="fill-bordeaux stroke-bordeaux" opacity={cve ? 1 : 0.35} />
    {cve && testo(61, 34, 'sottoclaveare dx', 'fill-bordeaux', 8.5, 'middle')}
    <rect x="120" y="96" width="30" height="34" rx="8" className="fill-bordeaux" />
    {testo(135, 146, cve ? 'apice (ascellare media)' : 'precordiale sx', 'fill-bordeaux', 8.5, 'middle')}
    <g transform="translate(176 14)">
      {testo(40, 0, 'oppure', 'fill-tenue', 9, 'middle')}
      <path d="M8 8 Q40 2 72 8 L76 110 L4 110 Z" className={pelle} strokeWidth={1.5} />
      <path d="M40 10 L40 106" {...T} strokeDasharray="3 5" strokeWidth={3} className="stroke-tenue" />
      <rect x="44" y="40" width="26" height="34" rx="8" className="fill-oro" />
      {testo(40, 124, 'posteriore sx (schiena)', 'fill-oro', 8.5, 'middle')}
      {testo(40, 136, '+ anteriore precordiale', 'fill-oro', 8.5, 'middle')}
    </g>
    {cve ? (
      <g transform="translate(176 166)">
        <path d="M0 18 L12 18 L15 2 L18 30 L21 18 L48 18 L51 2 L54 30 L57 18 L84 18 L87 2 L90 30 L93 18 L104 18" {...T} strokeWidth={2} className="stroke-verde" />
        {[15, 51, 87].map((x) => <path key={x} d={`M${x - 4} -6 L${x + 4} -6 L${x} 0 Z`} className="fill-bordeaux" />)}
        {testo(108, 22, 'SYNC', 'fill-bordeaux', 10, 'start', true)}
      </g>
    ) : (
      <g transform="translate(176 160)">
        <rect width="140" height="36" rx="8" className="fill-testo" />
        {testo(70, 15, 'DEMAND · 60–80/min', 'fill-carta', 9.5, 'middle', true)}
        {testo(70, 29, 'mA ↑ fino a cattura, +10', 'fill-carta', 9, 'middle')}
      </g>
    )}
  </Fig>
)


/* ─── Blocchi nervosi ecoguidati: a sinistra dove va la sonda, a destra l'immagine ecografica schematica ─── */
const Eco = ({ children, x = 168 }: { children: ReactNode; x?: number }) => (
  <g transform={`translate(${x} 10)`}>
    <rect width="146" height="160" rx="6" className="fill-testo" />
    <path d="M0 2 L146 2" {...T} strokeWidth={5} className="stroke-verde" />
    {children}
  </g>
)
const Sonda = ({ x, y, w = 34, r = 0 }: { x: number; y: number; w?: number; r?: number }) => (
  <rect x={x - w / 2} y={y - 5} width={w} height={10} rx={3} transform={`rotate(${r} ${x} ${y})`} className="fill-verde stroke-verde-scuro" strokeWidth={1.5} />
)
const ago = (d: string) => <path d={d} {...T} strokeWidth={2.2} className="stroke-oro" />
const anest = (cx: number, cy: number, rx: number, ry: number) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="fill-verde3" opacity={0.75} />
const t = (x: number, y: number, s: string, cls = 'fill-linea', size = 8.5, a: 'start' | 'middle' | 'end' = 'middle') => testo(x, y, s, cls, size, a)

const FasciaIliaca = () => (
  <Fig didascalia="Infrainguinale: sonda trasversale sotto il legamento inguinale, al terzo laterale. Ago in piano da laterale verso mediale fino SOTTO la fascia iliaca, sopra l’ileopsoas, lontano dall’arteria: l’anestetico si deve aprire verso il nervo femorale.">
    <path d="M20 20 L150 20 L140 190 L30 190 Z" className={pelle} strokeWidth={1.5} />
    <path d="M30 60 Q85 92 140 60" {...T} strokeWidth={2} className="stroke-tenue" />
    {t(85, 92, 'legamento inguinale', 'fill-tenue', 8.5)}
    <circle cx="34" cy="56" r="4" className="fill-oro" />{t(40, 46, 'SIAS', 'fill-oro', 8.5, 'start')}
    <circle cx="140" cy="56" r="4" className="fill-oro" />{t(136, 46, 'pube', 'fill-oro', 8.5, 'end')}
    <Sonda x={62} y={118} w={40} />
    {t(62, 138, 'terzo laterale', 'fill-verde', 9)}
    <Eco>
      {t(20, 18, 'lat', 'fill-linea', 8, 'start')}{t(126, 18, 'med', 'fill-linea', 8, 'end')}
      <path d="M0 40 Q40 32 70 46" {...T} strokeWidth={1.5} className="stroke-linea" />{t(30, 34, 'sartorio', 'fill-linea', 8)}
      <path d="M0 62 L146 70" {...T} strokeWidth={3} className="stroke-carta" />{t(30, 58, 'fascia iliaca', 'fill-carta', 8.5)}
      <path d="M0 110 Q60 80 110 100 L146 104" {...T} strokeWidth={1.5} className="stroke-linea" />{t(40, 126, 'ileopsoas', 'fill-linea', 8.5)}
      <ellipse cx="88" cy="78" rx="12" ry="6" className="fill-oro2" />{t(88, 96, 'n. femorale', 'fill-oro2', 8)}
      <circle cx="122" cy="80" r="9" className="fill-black stroke-bordeaux2" strokeWidth={2} />{t(122, 100, 'arteria', 'fill-bordeaux2', 8)}
      {anest(52, 72, 30, 6)}
      {ago('M0 30 L46 70')}
      {t(73, 150, 'ago sotto la fascia', 'fill-oro', 9)}
    </Eco>
  </Fig>
)

const Soprainguinale = () => (
  <Fig didascalia="Soprainguinale: sonda parasagittale medialmente alla SIAS, inclinata verso l’ombelico. Immagine a «papillon» (sartorio e obliquo interno). Ago in piano da caudale a craniale, sotto la fascia iliaca sopra il muscolo iliaco: l’anestetico deve sollevare la fascia verso l’alto (craniale). Copre femorale e cutaneo laterale (ottimo per l’anca).">
    <path d="M20 20 L150 20 L140 190 L30 190 Z" className={pelle} strokeWidth={1.5} />
    <path d="M30 100 Q85 132 140 100" {...T} strokeWidth={2} className="stroke-tenue" />
    {t(95, 140, 'legamento inguinale', 'fill-tenue', 8.5)}
    <circle cx="34" cy="96" r="4" className="fill-oro" />{t(30, 84, 'SIAS', 'fill-oro', 8.5, 'start')}
    <circle cx="85" cy="40" r="4" className="fill-tenue" />{t(85, 32, 'ombelico', 'fill-tenue', 8.5)}
    <Sonda x={56} y={78} w={40} r={-55} />
    <Eco>
      {t(18, 18, 'craniale', 'fill-linea', 8, 'start')}{t(128, 18, 'caudale', 'fill-linea', 8, 'end')}
      <path d="M0 40 L60 70 L0 100 M146 40 L86 70 L146 100" {...T} strokeWidth={1.5} className="stroke-linea" />
      {t(20, 74, 'obliquo int.', 'fill-linea', 8, 'start')}{t(126, 74, 'sartorio', 'fill-linea', 8, 'end')}
      <path d="M0 112 L146 120" {...T} strokeWidth={3} className="stroke-carta" />{t(110, 112, 'fascia iliaca', 'fill-carta', 8.5)}
      <path d="M0 142 L146 146" {...T} strokeWidth={1} className="stroke-linea" />{t(73, 140, 'm. iliaco', 'fill-linea', 8.5)}
      <circle cx="96" cy="108" r="4" className="fill-bordeaux2" />{t(96, 98, 'a. circonflessa', 'fill-bordeaux2', 7.5)}
      {anest(44, 122, 34, 6)}
      {ago('M146 150 L70 120')}
      {freccia('M40 118 L10 116')}
    </Eco>
  </Fig>
)

const ESP = () => (
  <Fig didascalia="Erettore della spina (ESP): paziente seduto o sul fianco. Sonda parasagittale a circa 3 cm dalla linea mediana sul processo trasverso del livello voluto (T4–T5 per fratture costali). Ago in piano da craniale a caudale fino a toccare il processo trasverso; l’anestetico si deve stendere sotto il muscolo erettore, in senso craniocaudale.">
    <path d="M30 10 Q90 0 150 10 L150 190 L30 190 Z" className={pelle} strokeWidth={1.5} />
    <path d="M90 14 L90 186" {...T} strokeDasharray="3 5" strokeWidth={3} className="stroke-tenue" />
    {[40, 66, 92, 118, 144].map((y) => <rect key={y} x="98" y={y} width="20" height="8" rx="3" className="fill-carta stroke-tenue" />)}
    {t(132, 34, 'processi trasversi', 'fill-tenue', 8)}
    <Sonda x={108} y={92} w={44} r={90} />
    {t(74, 96, '3 cm', 'fill-verde', 9, 'end')}
    <Eco>
      {t(18, 18, 'craniale', 'fill-linea', 8, 'start')}{t(128, 18, 'caudale', 'fill-linea', 8, 'end')}
      <path d="M0 34 L146 34" {...T} strokeWidth={1} className="stroke-linea" />{t(73, 30, 'trapezio / romboide', 'fill-linea', 8)}
      <path d="M0 50 L146 50 M0 92 L146 92" {...T} strokeWidth={1} className="stroke-linea" />{t(73, 74, 'erettore della spina', 'fill-linea', 9)}
      {[20, 73, 126].map((x) => <path key={x} d={`M${x - 16} 104 Q${x} 94 ${x + 16} 104`} {...T} strokeWidth={4} className="stroke-carta" />)}
      {t(73, 124, 'processi trasversi', 'fill-carta', 8.5)}
      {anest(73, 96, 60, 5)}
      {ago('M2 46 L66 96')}
      {freccia('M90 96 L130 96')}
    </Eco>
  </Fig>
)

const Serrato = () => (
  <Fig didascalia="Serrato anteriore: paziente supino con il braccio abdotto. Sonda sulla linea ascellare media all’altezza della 4ª–5ª costa. Ago in piano verso la costa: iniezione SOPRA il serrato (tra gran dorsale e serrato) o SOTTO il serrato (sulla costa). Per fratture costali laterali e drenaggi toracici.">
    <path d="M60 196 L74 70 Q80 40 110 34 L160 30 Q196 34 206 70 L222 196 Z" transform="translate(-50 0) scale(0.95 1)" className={pelle} strokeWidth={1.5} />
    {[90, 110, 130, 150].map((y) => <path key={y} d={`M40 ${y} Q90 ${y - 10} 140 ${y}`} {...T} strokeWidth={1.2} className="stroke-linea-forte" />)}
    <Sonda x={92} y={118} w={40} r={-20} />
    {t(92, 140, 'ascellare media, 4ª–5ª costa', 'fill-verde', 8.5)}
    <Eco>
      <path d="M0 36 L146 36" {...T} strokeWidth={1} className="stroke-linea" />{t(73, 30, 'sottocute', 'fill-linea', 8)}
      <path d="M0 62 L146 58" {...T} strokeWidth={1.5} className="stroke-linea" />{t(73, 52, 'gran dorsale', 'fill-linea', 8.5)}
      <path d="M0 88 L146 84" {...T} strokeWidth={1.5} className="stroke-linea" />{t(73, 78, 'serrato anteriore', 'fill-linea', 8.5)}
      <path d="M40 112 Q73 98 106 112" {...T} strokeWidth={5} className="stroke-carta" />{t(73, 126, 'costa', 'fill-carta', 8.5)}
      <path d="M0 140 L146 140" {...T} strokeWidth={2} className="stroke-linea" strokeDasharray="6 4" />{t(73, 152, 'pleura', 'fill-linea', 8.5)}
      {anest(73, 66, 46, 4)}
      {anest(73, 94, 40, 4)}
      {ago('M0 30 L64 64')}
      {t(122, 72, 'sopra', 'fill-verde2', 8)}{t(122, 98, 'sotto', 'fill-verde2', 8)}
    </Eco>
  </Fig>
)


const NivMontaggio = () => (
  <Fig didascalia="V60: ossigeno ad alta pressione dalla parete, filtro all’uscita, circuito monotubo, UNA sola perdita intenzionale (porta espiratoria sul circuito con maschera non ventilata a gomito arancio con valvola antisoffocamento). Tubicino di sensing dal raccordo vicino alla maschera al frontale della V60. Maschera appoggiata a mano a ventilatore acceso, poi le cinghie.">
    {/* parete O2 */}
    <rect x="6" y="8" width="54" height="22" rx="4" className="fill-verde3 stroke-verde-scuro" strokeWidth={1.5} />
    {testo(33, 23, 'O₂ parete', 'fill-verde-scuro', 9, 'middle', true)}
    <path d="M33 30 C33 44 40 46 40 56" {...T} strokeWidth={3} className="stroke-verde" />
    {/* ventilatore */}
    <rect x="14" y="56" width="104" height="104" rx="10" className="fill-white stroke-verde-scuro" strokeWidth={2} />
    <rect x="22" y="64" width="72" height="52" rx="4" className="fill-[#26332d]" />
    {testo(27, 78, 'S/T', 'fill-[#9fd3b5]', 8, 'start', true)}
    {testo(27, 91, 'IPAP 15', 'fill-white', 9, 'start', true)}
    {testo(27, 103, 'EPAP 5', 'fill-white', 9, 'start', true)}
    {testo(66, 91, 'O₂ 40%', 'fill-[#f1d98a]', 8)}
    {testo(66, 103, 'Vte 480', 'fill-[#f1d98a]', 8)}
    <path d="M28 110 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" {...T} strokeWidth={1.2} className="stroke-[#9fd3b5]" />
    <circle cx="106" cy="90" r="8" className="fill-sabbia stroke-verde-scuro" strokeWidth={1.5} />
    {testo(66, 150, 'Philips V60', 'fill-verde-scuro', 10, 'middle', true)}
    {/* filtro */}
    <rect x="118" y="124" width="16" height="14" rx="3" className="fill-oro3 stroke-oro" strokeWidth={1.5} />
    {testo(126, 152, 'filtro', 'fill-oro', 8, 'middle', true)}
    {/* circuito */}
    <path d="M134 131 C170 131 160 176 200 170 C226 166 222 132 236 120" {...T} strokeWidth={7} className="stroke-[#c9d6e2]" />
    <path d="M134 131 C170 131 160 176 200 170 C226 166 222 132 236 120" {...T} strokeWidth={1} strokeDasharray="2 3" className="stroke-[#8aa1b6]" />
    {/* porta espiratoria */}
    <rect x="226" y="112" width="18" height="14" rx="3" transform="rotate(-40 235 119)" className="fill-white stroke-bordeaux" strokeWidth={1.8} />
    <path d="M232 108 l-4 -6 M238 106 l-2 -7 M243 109 l1 -7" {...T} strokeWidth={1.4} className="stroke-bordeaux" />
    {testo(196, 96, 'porta espiratoria', 'fill-bordeaux', 8, 'middle', true)}
    {testo(196, 106, '(unica perdita)', 'fill-bordeaux', 7.5, 'middle')}
    {/* testa di profilo con maschera */}
    <path d="M300 40 C266 36 250 58 252 80 L246 92 L253 96 L250 104 C252 112 258 114 266 113 L268 126 C270 138 286 142 304 138" className={pelle} strokeWidth={1.5} />
    <path d="M300 40 C318 46 318 120 304 138" {...T} className="stroke-tenue" strokeWidth={1.5} />
    <path d="M258 70 L240 98 L246 118 L272 122 L268 84 Z" className="fill-[#e7eef5]/80 stroke-[#5b7b98]" strokeWidth={2} />
    <path d="M244 112 l-6 6" {...T} strokeWidth={6} className="stroke-[#e07b24]" />
    <circle cx="247" cy="112" r="2.6" className="fill-white stroke-[#e07b24]" strokeWidth={1.2} />
    {testo(262, 152, 'gomito arancio', 'fill-[#c0621a]', 8, 'middle', true)}
    {testo(262, 161, '(antisoffocamento)', 'fill-[#c0621a]', 7.5, 'middle')}
    {/* tubicino di sensing */}
    <path d="M232 126 C214 160 196 186 150 186 C112 186 104 176 100 160" {...T} strokeWidth={1.3} className="stroke-verde-scuro" />
    <circle cx="100" cy="160" r="2.4" className="fill-verde-scuro" />
    {testo(150, 196, 'tubicino di sensing', 'fill-verde-scuro', 8, 'middle', true)}
    <path d="M268 84 L300 66 M272 116 L304 112" {...T} strokeWidth={2.2} className="stroke-oro" />
    {testo(290, 182, 'testa 30–45°', 'fill-tenue', 8, 'middle')}
    {testo(170, 24, 'maschera: ponte del naso → sotto il labbro', 'fill-tenue', 8, 'middle')}
  </Fig>
)

const box = (x: number, y: number, w: number, h: number, cls: string, righe: string[], tcls = 'fill-testo', size = 8.2, bold0 = true) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="6" className={cls} strokeWidth={1.4} />
    {righe.map((r, i) => <text key={i} x={x + w / 2} y={y + 12 + i * (size + 3)} fontSize={size} textAnchor="middle" fontWeight={i === 0 && bold0 ? 800 : 600} className={tcls}>{r}</text>)}
  </g>
)

const NivSchema = () => (
  <Fig alto={250} didascalia="Schema di partenza: si sale di 2–3 cmH₂O di PS (o 1–2 di EPAP) ogni 5–10 minuti fino a Vte 6–8 mL/kg di peso ideale e FR < 25. Prima di tutto chiedersi se la NIV è indicata e se c’è un tetto terapeutico.">
    {box(85, 4, 150, 30, 'fill-verde3 stroke-verde-scuro', ['Distress (FR > 25–30) + EGA', 'pH · PaCO₂ · P/F · lattati'], 'fill-verde-scuro')}
    {freccia('M120 34 L55 52', 'stroke-verde-scuro')}{freccia('M160 34 L160 52', 'stroke-verde-scuro')}{freccia('M200 34 L265 52', 'stroke-verde-scuro')}
    {box(4, 56, 102, 34, 'fill-bordeaux3 stroke-bordeaux', ['IPERCAPNICO', 'pH < 7,35 · CO₂ > 45'], 'fill-bordeaux')}
    {box(110, 56, 100, 34, 'fill-oro3 stroke-oro', ['MISTO', 'ipossiemia + CO₂ ↑'], 'fill-oro')}
    {box(214, 56, 102, 34, 'fill-[#e3ecf4] stroke-[#5b7b98]', ['IPOSSIEMICO', 'CO₂ normale o bassa'], 'fill-[#35577a]')}
    {box(4, 96, 102, 92, 'fill-white stroke-bordeaux', ['S/T', 'IPAP 12–15 → 20–25', 'EPAP 4–5 (→ 6–8)', 'Rate 12–16', 'I-Time 0,8–1,0 s · Rise 1–2', 'SpO₂ 88–92%', 'BPCO, neuromuscolare'], 'fill-testo', 8)}
    {box(110, 96, 100, 92, 'fill-white stroke-oro', ['S/T', 'EPAP 8–10', 'IPAP 15–20', 'obeso: AVAPS', 'Vt 8 mL/kg PBW', 'EPA con fatica,', 'BPCO + polmonite'], 'fill-testo', 8)}
    {box(214, 96, 102, 92, 'fill-white stroke-[#5b7b98]', ['CPAP 8–10', 'EPA cardiogeno', '(da 5 se PAS bassa)', '— — —', 'Polmonite/ARDS:', 'HFNC, o CPAP 8–10,', 'PS bassa, Vte < 9,5'], 'fill-testo', 8)}
    {box(4, 196, 312, 48, 'fill-sabbia stroke-linea-forte', ['EGA a 1 ora', 'migliorano pH, CO₂, FR, P/F → continuare e rivalutare a 4 ore', 'nessun miglioramento, GCS ↓, FR > 35, intolleranza → INTUBARE'], 'fill-testo', 8.6)}
  </Fig>
)

const NivMonitor = () => (
  <Fig didascalia="Curva di pressione: EPAP di base, IPAP al plateau, pressione di supporto = IPAP − EPAP; Rise è la pendenza della salita (1 = più rapida). Sullo schermo controllare Vte, FR, perdite (Pt Leak) e Pt Trig.">
    <path d="M18 30 V170 H210" {...T} strokeWidth={1.4} className="stroke-tenue" />
    {testo(22, 26, 'cmH₂O', 'fill-tenue', 8)}{testo(206, 182, 'tempo', 'fill-tenue', 8, 'end')}
    <path d="M18 140 H40 L52 70 H92 L100 140 H130 L142 70 H182 L190 140 H210" {...T} strokeWidth={2.6} className="stroke-verde" />
    <path d="M18 140 H210" {...T} strokeWidth={1} strokeDasharray="3 3" className="stroke-bordeaux2" />
    <path d="M18 70 H210" {...T} strokeWidth={1} strokeDasharray="3 3" className="stroke-bordeaux2" />
    {testo(206, 66, 'IPAP', 'fill-bordeaux', 9, 'end', true)}{testo(206, 154, 'EPAP', 'fill-bordeaux', 9, 'end', true)}
    {freccia('M116 136 L116 76', 'stroke-oro')}{freccia('M116 76 L116 136', 'stroke-oro')}
    {testo(120, 108, 'PS', 'fill-oro', 10, 'start', true)}
    <path d="M40 140 L52 70" {...T} strokeWidth={4} className="stroke-oro2" opacity={0.5} />
    {testo(30, 100, 'Rise', 'fill-oro', 8.5, 'end', true)}
    <path d="M52 160 H92" {...T} strokeWidth={1.2} className="stroke-tenue" />
    <path d="M52 156 v8 M92 156 v8" {...T} strokeWidth={1.2} className="stroke-tenue" />
    {testo(72, 158, 'Ti', 'fill-tenue', 8.5, 'middle', true)}
    {box(222, 14, 94, 36, 'fill-verde3 stroke-verde-scuro', ['Vte', '6–8 mL/kg PBW'], 'fill-verde-scuro', 9)}
    {box(222, 56, 94, 36, 'fill-verde3 stroke-verde-scuro', ['FR', '< 25 e in calo'], 'fill-verde-scuro', 9)}
    {box(222, 98, 94, 36, 'fill-oro3 stroke-oro', ['Pt Leak', 'il più bassa possibile'], 'fill-oro', 9)}
    {box(222, 140, 94, 36, 'fill-bordeaux3 stroke-bordeaux', ['Pt Trig', 'basso = backup'], 'fill-bordeaux', 9)}
  </Fig>
)


// ─── Terapia elettrica: pannelli dei nostri defibrillatori ───
const num = (x: number, y: number, n: string) => (
  <g>
    <circle cx={x} cy={y} r="6.5" className="fill-bordeaux" stroke="#fff" strokeWidth="1.2" />
    <text x={x} y={y + 3} fontSize="8.5" fontWeight="800" textAnchor="middle" fill="#fff">{n}</text>
  </g>
)
/** Manopola con etichette disposte a ventaglio (angoli in gradi, 0 = in alto, orario). */
function Manopola({ cx, cy, r, etichette, punta, colore = '#f2efe8', anello = '#e06a1f' }: { cx: number; cy: number; r: number; etichette: { t: string; a: number; c?: string; b?: boolean }[]; punta: number; colore?: string; anello?: string }) {
  const p = (a: number, d: number) => [cx + d * Math.sin((a * Math.PI) / 180), cy - d * Math.cos((a * Math.PI) / 180)]
  const [px, py] = p(punta, r * 0.8)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke={anello} strokeWidth="2.5" strokeDasharray="1.5 2.5" />
      <circle cx={cx} cy={cy} r={r} fill={colore} stroke="#9a9488" strokeWidth="1.2" />
      <rect x={cx - 3.5} y={cy - r + 3} width="7" height={2 * r - 6} rx="3" fill="#fff" stroke="#c9c3b6" transform={`rotate(${punta} ${cx} ${cy})`} />
      <path d={`M${cx} ${cy} L${px} ${py}`} stroke="#b3261e" strokeWidth="1.8" />
      {etichette.map((e, i) => {
        const [x, y] = p(e.a, r + 12)
        return <text key={i} x={x} y={y + 2.5} fontSize="6.6" textAnchor={Math.abs(e.a % 180) < 15 ? 'middle' : (e.a % 360 + 360) % 360 < 180 ? 'start' : 'end'} fontWeight={e.b ? 800 : 600} fill={e.c ?? '#3a3d3b'}>{e.t}</text>
      })}
    </g>
  )
}
const tasto = (x: number, y: number, w: number, h: number, fill: string, label?: string, lc = '#fff', fs = 7) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke="#8d877b" strokeWidth="1" />
    {label && <text x={x + w / 2} y={y + h / 2 + fs * 0.37} fontSize={fs} fontWeight="800" textAnchor="middle" fill={lc}>{label}</text>}
  </g>
)
const freccette = (x: number, y: number, label: string) => (
  <g>
    <text x={x + 9} y={y - 4} fontSize="5.8" fontWeight="700" textAnchor="middle" fill="#eee">{label}</text>
    <rect x={x} y={y} width="18" height="26" rx="9" fill="#e9e6df" stroke="#8d877b" />
    <path d={`M${x + 9} ${y + 4} l-4 6 h8 z M${x + 9} ${y + 22} l-4 -6 h8 z`} fill="#3a3d3b" />
  </g>
)
const ENERGIE_NK = ['5', '10', '20', '30', '50', '70', '100', '150', '200', '270']

const NK5600 = () => (
  <Fig alto={215} didascalia="Nihon Kohden TEC-5600 (carrello con pacing): ① manopola modalità/energia, ② CARICA/DAE, ③ SCARICA, ④ SINC; a sinistra il pannello PACING: ⑤ START/STOP, ⑥ FREQUENZA (ppm), ⑦ CORRENTE (mA), spia STIMOLO. Sulla manopola: DISARMA scarica internamente l’energia, VERIFICA BASE è il test giornaliero.">
    <rect x="4" y="14" width="312" height="196" rx="14" fill="#f4f1ea" stroke="#9a9488" />
    <rect x="10" y="22" width="300" height="160" rx="8" fill="#3b3e44" />
    <rect x="10" y="22" width="52" height="160" rx="8" fill="#2f3237" />
    {testo(36, 36, 'PACING', 'fill-white', 8, 'middle', true)}
    <circle cx="20" cy="47" r="2.5" fill="#6ee07a" />{testo(26, 49.5, 'STIMOLO', 'fill-white', 5.6)}
    {tasto(16, 58, 40, 14, '#5fbfa4', 'START/STOP', '#103a2e', 5.6)}
    {freccette(27, 88, 'FREQ ppm')}
    {freccette(27, 132, 'CORR mA')}
    <rect x="68" y="34" width="132" height="104" rx="3" fill="#121416" />
    <path d="M74 92 h14 l4 -18 l5 34 l4 -16 h18 l4 -18 l5 34 l4 -16 h22 l4 -18 l5 34 l4 -16 h20" fill="none" stroke="#7ee08a" strokeWidth="1.4" />
    {testo(134, 155, 'cardiolife · ActiBiphasic', 'fill-[#c9c9c9]', 6.5, 'middle')}
    <Manopola cx={258} cy={86} r={18} punta={180} etichette={[
      ...ENERGIE_NK.map((t, i) => ({ t, a: -88 + i * 19, c: t === '150' ? '#ff9a5c' : '#eee', b: t === '150' })),
      { t: 'DEMAND', a: 112, c: '#ff9a5c', b: true }, { t: 'FISSO', a: 134, c: '#eee' }, { t: 'VERIF.', a: 156, c: '#eee' },
      { t: 'OFF', a: 180, c: '#fff', b: true }, { t: 'MONITOR', a: 207, c: '#eee' }, { t: 'DAE', a: 230, c: '#ff9a5c', b: true }, { t: 'DISARMA', a: 252, c: '#eee' },
    ]} />
    {tasto(272, 26, 30, 13, '#d7d3ca', 'SINC', '#3a3d3b')}
    {tasto(250, 136, 52, 16, '#d7d3ca', '2 CARICA', '#3a3d3b')}
    {tasto(250, 158, 52, 18, '#e8662a', '3 ⚡ SCARICA')}
    {num(214, 60, '1')}{num(243, 144, '2')}{num(243, 167, '3')}{num(266, 33, '4')}
    {num(8, 65, '5')}{num(20, 101, '6')}{num(20, 145, '7')}
  </Fig>
)

const NK5531 = () => (
  <Fig alto={215} didascalia="Nihon Kohden TEC-5531K (carrello con piastre): ① manopola, ② CARICA/DAE (anche sulla piastra), ③ shock premendo INSIEME i pulsanti delle due piastre, ④ SINC; in alto il pannello di stimolazione: ⑤ START/STOP, ⑥ FREQUENZA, ⑦ CORRENTE. AZZERA = scarica interna dell’energia.">
    <rect x="70" y="4" width="46" height="30" rx="6" fill="#e8662a" stroke="#a9481c" />
    <rect x="124" y="4" width="46" height="30" rx="6" fill="#e8662a" stroke="#a9481c" />
    {testo(93, 22, 'APEX', 'fill-white', 7, 'middle', true)}{testo(147, 22, 'STERNUM', 'fill-white', 7, 'middle', true)}
    <circle cx="80" cy="12" r="3.5" fill="#ffd34d" stroke="#a9481c" /><circle cx="160" cy="12" r="3.5" fill="#ffd34d" stroke="#a9481c" />
    <rect x="4" y="40" width="312" height="170" rx="12" fill="#ece8df" stroke="#9a9488" />
    <rect x="12" y="46" width="200" height="22" rx="4" fill="#dcd8cf" />
    {testo(24, 55, 'FREQ', 'fill-[#3a3d3b]', 6, 'start', true)}<path d="M24 58 l4 6 l4 -6 z M36 64 l4 -6 l4 6 z" fill="#3a3d3b" />
    {testo(62, 55, 'CORR', 'fill-[#3a3d3b]', 6, 'start', true)}<path d="M62 58 l4 6 l4 -6 z M74 64 l4 -6 l4 6 z" fill="#3a3d3b" />
    {tasto(98, 51, 44, 13, '#5fbfa4', 'START/STOP', '#103a2e', 5.8)}
    <circle cx="150" cy="57" r="2.5" fill="#6ee07a" />{testo(155, 59.5, 'STIMOLO', 'fill-[#3a3d3b]', 5.6)}
    <rect x="12" y="74" width="176" height="128" rx="6" fill="#3b3e44" />
    <rect x="22" y="84" width="140" height="92" rx="3" fill="#121416" />
    <path d="M28 132 h14 l4 -18 l5 34 l4 -16 h18 l4 -18 l5 34 l4 -16 h22 l4 -18 l5 34 l4 -16 h12" fill="none" stroke="#7ee08a" strokeWidth="1.4" />
    <rect x="196" y="74" width="114" height="128" rx="6" fill="#4f5aa6" />
    <Manopola cx={254} cy={114} r={15} punta={180} colore="#f2efe8" anello="#e06a1f" etichette={[
      ...ENERGIE_NK.map((t, i) => ({ t, a: -88 + i * 19, c: t === '150' ? '#ffb08a' : '#fff', b: t === '150' })),
      { t: 'DEMAND', a: 112, c: '#ffb08a', b: true }, { t: 'FISSO', a: 134, c: '#fff' }, { t: 'VERIF.', a: 156, c: '#fff' },
      { t: 'SPENTO', a: 180, c: '#fff', b: true }, { t: 'MONITOR', a: 207, c: '#fff' }, { t: 'DAE', a: 230, c: '#ffb08a', b: true }, { t: 'AZZERA', a: 252, c: '#fff' },
    ]} />
    {tasto(270, 158, 34, 12, '#d7d3ca', 'SINC', '#3a3d3b')}
    {tasto(254, 180, 50, 16, '#d7d3ca', '2 CARICA', '#3a3d3b')}
    {num(206, 86, '1')}{num(248, 188, '2')}{num(122, 12, '3')}{num(264, 166, '4')}{num(120, 46, '5')}{num(18, 52, '6')}{num(56, 52, '7')}
  </Fig>
)

const DFM100 = () => (
  <Fig alto={215} didascalia="Philips Efficia DFM100: ① manopola terapia (a sinistra AED, a destra Monitor, energie 1–200 J, Pacer), ② Carica (giallo), ③ Scarica (arancio), ④ Sync (si illumina di blu), ⑤ tasti funzione sotto lo schermo (es. «Impostazioni pacer», «Avvia pacing», «Annulla carica»), ⑥ manopola Smart Select (menu, es. modalità pacer Fissa/Demand), ⑦ tasto selezione derivazione.">
    <rect x="18" y="6" width="290" height="204" rx="18" fill="#f4f1ea" stroke="#9a9488" />
    {testo(150, 22, 'PHILIPS', 'fill-[#2b2d2c]', 10, 'middle', true)}
    <rect x="34" y="30" width="262" height="168" rx="12" fill="#2e3033" />
    <rect x="54" y="40" width="150" height="96" rx="3" fill="#121416" />
    <path d="M60 92 h14 l4 -18 l5 34 l4 -16 h18 l4 -18 l5 34 l4 -16 h22 l4 -18 l5 34 l4 -16 h12" fill="none" stroke="#7ee08a" strokeWidth="1.4" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={58 + i * 30} y={144} width="26" height="9" rx="2" fill="#1d1f21" stroke="#555" />)}
    <circle cx="190" cy="152" r="10" fill="#1d1f21" stroke="#666" /><circle cx="190" cy="152" r="4" fill="#3b3e44" />
    <rect x="38" y="48" width="12" height="12" rx="3" fill="#1d1f21" stroke="#666" /><rect x="38" y="66" width="12" height="12" rx="3" fill="#1d1f21" stroke="#666" />
    <Manopola cx={256} cy={84} r={18} punta={-20} colore="#2f6b55" anello="#2f6b55" etichette={[
      { t: 'AED', a: -40, c: '#9fe0bf', b: true }, { t: 'OFF', a: -12, c: '#fff', b: true }, { t: 'Monitor', a: 20, c: '#9fe0bf' },
      { t: '1-10', a: 45, c: '#eee' }, { t: '20', a: 62, c: '#eee' }, { t: '50', a: 80, c: '#eee' }, { t: '100', a: 100, c: '#eee' },
      { t: '120', a: 118, c: '#eee' }, { t: '150', a: 140, c: '#fff', b: true }, { t: '170', a: 160, c: '#eee' }, { t: '200', a: 182, c: '#eee' }, { t: 'Pacer', a: 215, c: '#9fe0bf', b: true },
    ]} />
    {tasto(232, 124, 26, 10, '#8fb3e8', 'Sync', '#123')}
    {tasto(222, 142, 66, 18, '#f2d43c', '2  Carica', '#3a2f00')}
    {tasto(222, 166, 66, 20, '#ee7a2c', '3  Scarica ⚡')}
    {num(212, 66, '1')}{num(214, 151, '2')}{num(214, 176, '3')}{num(266, 129, '4')}{num(64, 166, '5')}{num(190, 172, '6')}{num(30, 54, '7')}
  </Fig>
)

/** Energie consigliate per ritmo e per apparecchio. */
const EnergieTabella = () => {
  const righe: [string, string, string, string][] = [
    ['FV / TV senza polso', 'NON sincronizzato', '150 → 200 → 270 J', '150 → 170 → 200 J'],
    ['Fibrillazione atriale', 'SINC', '270 J (massima)', '200 J (massima)'],
    ['Flutter, TPSV', 'SINC', '70 → 100 → 150 J', '70 → 120 → 150 J'],
    ['TV monomorfa con polso', 'SINC', '150 → 200 J', '120 → 150 → 200 J'],
    ['TV polimorfa instabile', 'NON sincronizzato', 'come FV', 'come FV'],
  ]
  const c = ['fill-bordeaux3', 'fill-oro3', 'fill-oro3', 'fill-oro3', 'fill-bordeaux3']
  return (
    <Fig alto={152} didascalia="Energie di partenza (bifasico) e incrementi: FA all’energia massima (ERC); flutter/TPSV 70–120 J; TV con polso 120–150 J. Dopo ogni shock sincronizzato verificare che la sincronizzazione sia ancora attiva.">
      {testo(10, 14, 'Ritmo', 'fill-tenue', 8, 'start', true)}
      {testo(196, 14, 'Nihon Kohden TEC', 'fill-tenue', 8, 'middle', true)}{testo(276, 14, 'Philips DFM100', 'fill-tenue', 8, 'middle', true)}
      {righe.map((r, i) => (
        <g key={i}>
          <rect x="4" y={20 + i * 26} width="312" height="23" rx="5" className={c[i]} />
          {testo(10, 31 + i * 26, r[0], 'fill-testo', 8, 'start', true)}
          {testo(10, 40 + i * 26, r[1], r[1] === 'SINC' ? 'fill-[#35577a]' : 'fill-bordeaux', 6.6, 'start', true)}
          {testo(196, 35 + i * 26, r[2], 'fill-testo', 8, 'middle', true)}{testo(276, 35 + i * 26, r[3], 'fill-testo', 8, 'middle', true)}
        </g>
      ))}
    </Fig>
  )
}

export const FIGURE: Record<string, () => ReactNode> = {
  isolamento: IsolamentoTabella,
  'nk-5600': NK5600,
  'nk-5531': NK5531,
  'dfm100': DFM100,
  'defibrillazione': EnergieTabella,
  'niv-v60': NivMontaggio,
  'niv-parametri': NivSchema,
  'niv-monitor': NivMonitor,
  'fascia-iliaca': FasciaIliaca,
  'fascia-iliaca-sopra': Soprainguinale,
  esp: ESP,
  serrato: Serrato,
  rsi: RSI,
  crico: Crico,
  toracentesi: Toracentesi,
  pigtail: () => <Triangolo didascalia="Triangolo di sicurezza: bordo laterale del gran pettorale, bordo anteriore del gran dorsale, linea del 5° spazio; vertice sotto l’ascella. Braccio sopra la testa; ingresso sulla linea ascellare media, sopra la costa inferiore." />,
  tubo: () => <Triangolo didascalia="Triangolo di sicurezza, 4°–5° spazio sulla linea ascellare media: incisione sopra la costa, dissezione smussa con pinza, esplorazione digitale prima del tubo; mai il trocar contro il polmone." />,
  decompressione: Decompressione,
  pericardiocentesi: Pericardio,
  paracentesi: Paracentesi,
  rachicentesi: Rachicentesi,
  cvc: CVC,
  io: IO,
  pacing: () => <Placche didascalia="Placche antero-posteriori (precordiale sx e posteriore sx tra scapola e colonna) o antero-laterali. Modalità demand, frequenza 60–80/min, corrente aumentata fino alla cattura elettrica e meccanica (polso femorale), poi +10%. Analgesia e sedazione." />,
  cve: () => <Placche cve didascalia="Placche antero-laterali (sottoclaveare dx + apice sx) o antero-posteriori. Tasto SYNC: controllare i marcatori sulle onde R prima di OGNI shock (molti defibrillatori lo disattivano dopo lo shock)." />,
}
