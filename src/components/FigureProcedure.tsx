/*
 * Schemi disegnati per le procedure (SVG, palette dell'app). Non sono illustrazioni anatomiche
 * in scala: servono a ricordare repere, punto d'ingresso e direzione.
 */
import type { ReactNode } from 'react'

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

function Fig({ children, didascalia }: { children: ReactNode; didascalia: string }) {
  return (
    <figure className="rounded-2xl bg-carta border border-linea p-2">
      <svg viewBox="0 0 320 200" className="w-full h-auto" role="img" aria-label={didascalia}>{defs}{children}</svg>
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

export const FIGURE: Record<string, () => ReactNode> = {
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
