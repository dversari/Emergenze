/*
 * Tavola schematica di un fungo, disegnata da parametri (lib/micologia).
 * Con le etichette: frecce verso le parti utili al riconoscimento.
 */
import type { Disegno, Parte, Specie } from '../lib/micologia'

const G = 212 // linea del terreno
const CX = 92

interface Geo { cx: number; y0: number; hw: number; h: number; sw: number; ya: number; bulge: number; stemH: number }

function geo(d: Disegno, cx = CX): Geo {
  const s = d.scala ?? 1
  const stemH = d.gambo.altezza * s
  const y0 = G - stemH
  const hw = d.cappello.larghezza * s
  const h = d.cappello.altezza * s
  const sw = d.gambo.spessore * s
  const bulge = d.cappello.forma === 'campana' ? hw * 0.2 : d.cappello.forma === 'boleto' ? hw * 0.32 : hw * 0.24
  return { cx, y0, hw, h, sw, ya: y0 + bulge + stemH * 0.12, bulge, stemH }
}

function pathCappello(f: Disegno['cappello']['forma'], g: Geo) {
  const { cx, y0, hw, h, sw } = g
  switch (f) {
    case 'umbonato':
      return `M${cx - hw},${y0} C${cx - hw},${y0 - 1.15 * h} ${cx - hw * 0.4},${y0 - h} ${cx - hw * 0.2},${y0 - h} Q${cx},${y0 - 1.28 * h} ${cx + hw * 0.2},${y0 - h} C${cx + hw * 0.4},${y0 - h} ${cx + hw},${y0 - 1.15 * h} ${cx + hw},${y0} Q${cx},${y0 + 5} ${cx - hw},${y0}Z`
    case 'campana':
      return `M${cx - hw},${y0} C${cx - hw},${y0 - h * 0.9} ${cx - hw * 0.7},${y0 - h} ${cx},${y0 - h} C${cx + hw * 0.7},${y0 - h} ${cx + hw},${y0 - h * 0.9} ${cx + hw},${y0} Q${cx},${y0 + 4} ${cx - hw},${y0}Z`
    case 'conico':
      return `M${cx - hw},${y0} C${cx - hw * 0.6},${y0 - h * 0.45} ${cx - hw * 0.2},${y0 - h * 0.8} ${cx - hw * 0.1},${y0 - h * 0.88} Q${cx},${y0 - h * 1.12} ${cx + hw * 0.1},${y0 - h * 0.88} C${cx + hw * 0.2},${y0 - h * 0.8} ${cx + hw * 0.6},${y0 - h * 0.45} ${cx + hw},${y0} Q${cx},${y0 + 3} ${cx - hw},${y0}Z`
    case 'depresso':
      return `M${cx - hw},${y0} C${cx - hw},${y0 - 1.3 * h} ${cx - hw * 0.45},${y0 - h * 0.95} ${cx},${y0 - h * 0.78} C${cx + hw * 0.45},${y0 - h * 0.95} ${cx + hw},${y0 - 1.3 * h} ${cx + hw},${y0} Q${cx},${y0 + 5} ${cx - hw},${y0}Z`
    case 'imbuto':
      return `M${cx - hw},${y0 - h} Q${cx},${y0 - h * 0.45} ${cx + hw},${y0 - h} Q${cx + hw * 1.03},${y0 - h * 0.82} ${cx + hw * 0.9},${y0 - h * 0.72} Q${cx + hw * 0.35},${y0 - h * 0.3} ${cx + sw},${y0} L${cx - sw},${y0} Q${cx - hw * 0.35},${y0 - h * 0.3} ${cx - hw * 0.9},${y0 - h * 0.72} Q${cx - hw * 1.03},${y0 - h * 0.82} ${cx - hw},${y0 - h}Z`
    case 'cervello': {
      const ccy = y0 - h * 0.45, n = 44
      const pts: [number, number][] = []
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * Math.PI * 2
        const r = 1 + 0.07 * Math.sin(t * 9) + 0.04 * Math.sin(t * 5 + 1)
        pts.push([cx + Math.cos(t) * hw * r, ccy + Math.sin(t) * h * 0.55 * r])
      }
      return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L') + 'Z'
    }
    case 'piano':
    case 'boleto':
    case 'convesso':
    default:
      return `M${cx - hw},${y0} C${cx - hw},${y0 - 1.3 * h} ${cx + hw},${y0 - 1.3 * h} ${cx + hw},${y0} Q${cx},${y0 + 5} ${cx - hw},${y0}Z`
  }
}

/** mezza larghezza del cappello a una certa altezza sopra il margine (approssimazione ellittica) */
const semi = (g: Geo, dy: number) => g.hw * Math.sqrt(Math.max(0, 1 - (dy / (g.h * 0.98)) ** 2))

function Corpo({ d, id, cx = CX }: { d: Disegno; id: string; cx?: number }) {
  const g = geo(d, cx)
  const { y0, hw, h, sw, ya, bulge, stemH } = g
  const c = d.cappello, gb = d.gambo
  const tratto = { stroke: '#3b3430', strokeWidth: 1.1, strokeLinejoin: 'round' as const }
  const imbuto = c.forma === 'imbuto'
  const cervello = c.forma === 'cervello'

  // gambo
  let gambo: string
  if (gb.forma === 'panciuto') gambo = `M${cx - sw * 0.75},${y0 + 4} L${cx + sw * 0.75},${y0 + 4} C${cx + sw * 1.1},${y0 + stemH * 0.35} ${cx + sw * 1.75},${G - stemH * 0.3} ${cx + sw * 1.2},${G - 2} Q${cx},${G + 3} ${cx - sw * 1.2},${G - 2} C${cx - sw * 1.75},${G - stemH * 0.3} ${cx - sw * 1.1},${y0 + stemH * 0.35} ${cx - sw * 0.75},${y0 + 4}Z`
  else if (gb.forma === 'flessuoso') gambo = `M${cx - sw},${y0 + 2} L${cx + sw},${y0 + 2} C${cx + sw + 9},${y0 + stemH * 0.4} ${cx + sw - 9},${y0 + stemH * 0.7} ${cx + sw + 2},${G} L${cx - sw + 2},${G} C${cx - sw - 9},${y0 + stemH * 0.7} ${cx - sw + 9},${y0 + stemH * 0.4} ${cx - sw},${y0 + 2}Z`
  else gambo = `M${cx - sw * 0.85},${y0 + 2} L${cx + sw * 0.85},${y0 + 2} L${cx + sw},${G} L${cx - sw},${G}Z`

  const lente = `M${cx - hw},${y0} Q${cx},${y0 + bulge * 2} ${cx + hw},${y0} Q${cx},${y0 + 3} ${cx - hw},${y0}Z`
  const lamelle: string[] = []
  if (!imbuto && !cervello && d.sotto.tipo === 'lamelle') {
    for (let k = 1; k < 16; k++) {
      const t = k / 16
      const x = cx - hw + 2 * hw * t, y = y0 + 2 * t * (1 - t) * bulge * 2 * 0.98
      const tx = cx + (t - 0.5) * sw * 1.4
      const ty = d.sotto.decorrenti ? y0 + bulge * 2 + 10 : y0 + 4
      lamelle.push(`M${x.toFixed(1)},${y.toFixed(1)} L${tx.toFixed(1)},${ty.toFixed(1)}`)
    }
  }
  if (imbuto) {
    for (let k = 1; k < 12; k++) {
      const t = k / 12
      const x = cx - hw * 0.9 + 1.8 * hw * t
      lamelle.push(`M${x.toFixed(1)},${(y0 - h * 0.74 + Math.abs(t - 0.5) * 4).toFixed(1)} L${(cx + (t - 0.5) * sw * 1.6).toFixed(1)},${(y0 + 6).toFixed(1)}`)
    }
  }
  const grad = `g-${id}`

  return (
    <g>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.colore2} />
          <stop offset={c.inchiostro ? '0.5' : '0.7'} stopColor={c.colore} />
          <stop offset="1" stopColor={c.colore3 ?? c.colore} />
        </linearGradient>
        {gb.reticolo && (
          <pattern id={`r-${id}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 H5 M0 0 V5" stroke={gb.reticolo} strokeWidth="1" />
          </pattern>
        )}
      </defs>
      {/* gambo */}
      {gb.bulbo && <ellipse cx={cx} cy={G - 6} rx={sw * 1.6} ry={8} fill={gb.colore} {...tratto} />}
      <path d={gambo} fill={gb.colore} {...tratto} />
      {gb.reticolo && <path d={gambo} fill={`url(#r-${id})`} opacity={0.8} />}
      {gb.fasce && [0.3, 0.45, 0.6, 0.75].map((f) => {
        const y = y0 + stemH * f
        return <path key={f} d={`M${cx - sw * 0.9},${y} l${sw * 0.45},2.5 l${sw * 0.45},-2.5 l${sw * 0.45},2.5 l${sw * 0.45},-2.5`} fill="none" stroke={gb.fasce} strokeWidth={1} />
      })}
      {gb.blu && <path d={`M${cx - sw * 0.2},${G - stemH * 0.35} q${sw * 0.9},-4 ${sw * 1.2},6 q-${sw * 0.4},9 -${sw * 1.1},5 z`} fill="#3a68b2" opacity={0.85} />}
      {gb.baseGialla && <ellipse cx={cx} cy={G - 7} rx={sw * 1.2} ry={5} fill="#f0cf17" opacity={0.9} />}
      {/* volva */}
      {d.volva?.tipo === 'sacco' && (
        <path d={`M${cx - sw * 1.8},${G - 26} Q${cx - sw * 2.3},${G} ${cx},${G + 2} Q${cx + sw * 2.3},${G} ${cx + sw * 1.8},${G - 26} L${cx + sw * 1.35},${G - 19} L${cx + sw * 1.1},${G - 25} L${cx + sw},${G - 13} L${cx - sw},${G - 13} L${cx - sw * 1.1},${G - 25} L${cx - sw * 1.35},${G - 19}Z`} fill={d.volva.colore} {...tratto} />
      )}
      {d.volva?.tipo === 'cercini' && [0, 1, 2].map((k) => (
        <path key={k} d={`M${cx - sw * (1.05 + k * 0.18)},${G - 20 + k * 5} Q${cx},${G - 15 + k * 5} ${cx + sw * (1.05 + k * 0.18)},${G - 20 + k * 5}`} fill="none" stroke="#8c8473" strokeWidth={0.9} strokeDasharray="2 1.5" />
      ))}
      {d.volva?.tipo === 'orlo' && (
        <path d={`M${cx - sw * 1.75},${G - 16} Q${cx},${G - 8} ${cx + sw * 1.75},${G - 16} L${cx + sw * 1.55},${G - 10} Q${cx},${G - 3} ${cx - sw * 1.55},${G - 10}Z`} fill={d.volva.colore} {...tratto} />
      )}
      {/* anello */}
      {d.anello?.tipo === 'gonna' && (
        <g>
          <path d={`M${cx - sw * 0.85},${ya} L${cx + sw * 0.85},${ya} Q${cx + sw * 1.5},${ya + 6} ${cx + sw * 1.8},${ya + 13} Q${cx + sw},${ya + 16} ${cx},${ya + 14} Q${cx - sw},${ya + 16} ${cx - sw * 1.8},${ya + 13} Q${cx - sw * 1.5},${ya + 6} ${cx - sw * 0.85},${ya}Z`} fill={d.anello.colore} {...tratto} />
          {d.anello.striato && [-0.8, -0.3, 0.2, 0.7].map((k) => <path key={k} d={`M${cx + k * sw},${ya + 2} l${k * 2},10`} stroke="#b8b3a3" strokeWidth={0.7} />)}
        </g>
      )}
      {d.anello?.tipo === 'fugace' && <path d={`M${cx - sw * 1.3},${ya + 4} Q${cx},${ya + 9} ${cx + sw * 1.3},${ya + 4}`} fill="none" stroke={d.anello.colore === '#ffffff' ? '#cfc8b8' : d.anello.colore} strokeWidth={2.2} strokeLinecap="round" />}
      {d.anello?.tipo === 'anellino' && <path d={`M${cx - sw * 1.2},${ya} Q${cx},${ya + 5} ${cx + sw * 1.2},${ya}`} fill="none" stroke={d.anello.colore} strokeWidth={2} strokeLinecap="round" />}
      {/* sotto il cappello */}
      {!imbuto && !cervello && <path d={lente} fill={d.sotto.colore} {...tratto} />}
      {d.sotto.tipo === 'pori' && Array.from({ length: 34 }, (_, i) => {
        const t = 0.06 + (i % 17) / 17 * 0.88, r = Math.floor(i / 17)
        const x = cx - hw + 2 * hw * t, y = y0 + 2 * t * (1 - t) * bulge * 2 * (r ? 0.45 : 0.8)
        return <circle key={i} cx={x} cy={y} r={0.9} fill="#6e1610" />
      })}
      {d.cortina && [-0.7, -0.35, 0.35, 0.7].map((k) => (
        <path key={k} d={`M${cx + k * hw},${y0 + 3} Q${cx + k * hw * 0.6},${y0 + bulge * 2 + 6} ${cx + Math.sign(k) * sw},${y0 + bulge * 2 + 10}`} fill="none" stroke="#efe3cf" strokeWidth={0.9} strokeDasharray="1.5 1.8" />
      ))}
      {/* cappello */}
      <path d={pathCappello(c.forma, g)} fill={imbuto ? d.sotto.colore : `url(#${grad})`} {...tratto} />
      {lamelle.map((p, i) => <path key={i} d={p} stroke="#6b5d52" strokeWidth={0.45} opacity={0.75} />)}
      {imbuto && <ellipse cx={cx} cy={y0 - h * 0.88} rx={hw * 0.98} ry={h * 0.17} fill={`url(#${grad})`} {...tratto} />}
      {cervello && [0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M${cx - hw * 0.75 + k * hw * 0.32},${y0 - h * 0.85 + (k % 2) * 6} q${hw * 0.12},${h * 0.2} -${hw * 0.04},${h * 0.35} q-${hw * 0.12},${h * 0.15} ${hw * 0.06},${h * 0.3}`} fill="none" stroke={c.colore2} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      {c.fibrille && [-0.85, -0.6, -0.35, -0.12, 0.12, 0.35, 0.6, 0.85].map((k) => (
        <path key={k} d={`M${cx + k * hw * 0.15},${y0 - h * 0.92} Q${cx + k * hw * 0.75},${y0 - h * 0.6} ${cx + k * hw * 0.98},${y0 - 1}`} fill="none" stroke={c.colore2} strokeWidth={0.6} opacity={0.6} />
      ))}
      {c.solchi && [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((k) => (
        <path key={k} d={`M${cx + k * hw * 0.5},${y0 - h * 0.85} Q${cx + k * hw * 0.95},${y0 - h * 0.45} ${cx + k * hw},${y0 - 1}`} fill="none" stroke={c.colore2} strokeWidth={0.8} opacity={0.8} />
      ))}
      {c.inchiostro && [-0.85, -0.45, 0, 0.5, 0.88].map((k) => (
        <path key={k} d={`M${cx + k * hw - 1.6},${y0} q1.6,${7 + Math.abs(k) * 3} 3.2,0 z`} fill="#1d1a19" />
      ))}
      {c.involuto && [-1, 1].map((k) => <ellipse key={k} cx={cx + k * (hw - 2)} cy={y0 - 2} rx={4} ry={3.2} fill={c.colore2} {...tratto} />)}
      {c.verruche && [0.82, 0.6, 0.38, 0.16].flatMap((f, i) => {
        const dy = h * f, w = semi(g, dy) * 0.82, n = 2 + i * 2, y = y0 - dy
        return Array.from({ length: n }, (_, j) => {
          const x = n === 1 ? cx : cx - w + (2 * w * j) / (n - 1)
          return <ellipse key={`${i}-${j}`} cx={x} cy={y} rx={2.8} ry={1.9} fill={c.verruche} stroke="#9c9381" strokeWidth={0.4} />
        })
      })}
      {c.squame && (
        <g>
          <ellipse cx={cx} cy={y0 - h * 0.98} rx={hw * 0.28} ry={h * 0.16} fill={c.squame} />
          {[0.62, 0.38, 0.16].flatMap((f, i) => {
            const dy = h * f, w = semi(g, dy) * 0.85, n = 3 + i * 2, y = y0 - dy
            return Array.from({ length: n }, (_, j) => {
              const x = cx - w + (2 * w * j) / (n - 1)
              return <path key={`${i}-${j}`} d={`M${x - 2.2},${y} q2.2,2.4 4.4,0`} fill="none" stroke={c.squame} strokeWidth={1.3} strokeLinecap="round" />
            })
          })}
        </g>
      )}
    </g>
  )
}

function ancora(p: Parte, d: Disegno): [number, number] {
  const g = geo(d)
  const { cx, y0, hw, h, sw, ya, bulge } = g
  const imbuto = d.cappello.forma === 'imbuto'
  switch (p) {
    case 'cappello': return d.cappello.forma === 'cervello' ? [cx + hw * 0.6, y0 - h * 0.55] : imbuto ? [cx + hw * 0.55, y0 - h * 0.9] : [cx + hw * 0.45, y0 - h * 0.6]
    case 'lamelle':
    case 'pori': return imbuto ? [cx + hw * 0.45, y0 - h * 0.45] : [cx + hw * 0.5, y0 + bulge * 0.9]
    case 'anello': return [cx + sw * 1.5, ya + 9]
    case 'volva': return [cx + sw * 1.7, G - 12]
    case 'gambo': return [cx + sw * 0.9, (y0 + G) / 2 + 10]
    case 'base': return d.legno ? [cx + 24, G + 4] : d.gambo.blu ? [cx + sw * 0.4, G - g.stemH * 0.33] : [cx + sw * 1.1, G - 6]
    case 'cortina': return [cx + hw * 0.55, y0 + bulge * 1.6]
  }
}

const aCapo = (t: string, max = 20) => {
  const righe: string[] = []
  let r = ''
  for (const w of t.split(' ')) {
    if ((r + ' ' + w).trim().length > max && r) { righe.push(r); r = w } else r = (r + ' ' + w).trim()
  }
  if (r) righe.push(r)
  return righe
}

/** Tavola del fungo. Senza etichette: miniatura. */
export default function Fungo({ s, etichette = true, className }: { s: Specie; etichette?: boolean; className?: string }) {
  const d = s.disegno
  const rif = d.cespitoso
  const ombre = rif ? [{ dx: -30, dy: 2, k: 0.78 }, { dx: 30, dy: 4, k: 0.86 }] : []
  // etichette: posizioni senza sovrapposizioni
  const LH = 10.2
  const voci = etichette ? s.etichette.map((e) => ({ ...e, a: ancora(e.parte, d), righe: aCapo(e.testo) })).sort((x, y) => x.a[1] - y.a[1]) : []
  let fine = 6
  const pos = voci.map((v) => {
    const alt = v.righe.length * LH
    const y = Math.max(v.a[1] - alt / 2, fine + 5)
    fine = y + alt
    return { ...v, y }
  })
  if (fine > 226) { const sh = fine - 226; pos.forEach((p) => { p.y -= sh }) }
  const gg = geo(d)
  const cima = Math.min(gg.y0 - gg.h * 1.2, ...pos.map((p) => p.y)) - 8
  let vb = `0 ${cima} 288 ${236 - cima}`
  if (!etichette) {
    const g = geo(d)
    const half = Math.max(g.hw, g.sw * 2.3) + (d.cespitoso ? 34 : 0) + 8
    const top = g.y0 - g.h * (d.cappello.forma === 'cervello' ? 1.05 : 1.2) - 6
    const lato = Math.max(2 * half, G + 12 - top)
    vb = `${CX - lato / 2} ${G + 12 - lato} ${lato} ${lato}`
  }
  return (
    <svg viewBox={vb} className={className} role="img" aria-label={`${s.nome}: ${s.etichette.map((e) => e.testo).join('; ')}`}>
      {d.legno && <path d={`M28,${G - 4} Q92,${G - 14} 156,${G - 4} L160,${G + 10} L24,${G + 10}Z`} fill="#8a6a48" stroke="#5c4530" strokeWidth={1} />}
      {!d.legno && <path d={`M18,${G} H166`} stroke="#b7ad98" strokeWidth={1.4} />}
      {!d.legno && [30, 60, 128, 152].map((x) => <path key={x} d={`M${x},${G} l-3,-7 M${x},${G} l1,-8 M${x},${G} l4,-6`} stroke="#9fae86" strokeWidth={1} strokeLinecap="round" />)}
      {ombre.map((o, i) => (
        <g key={i} transform={`translate(${o.dx} ${o.dy}) translate(${CX} ${G}) scale(${o.k}) translate(${-CX} ${-G})`} opacity={0.92}>
          <Corpo d={d} id={`${s.id}-o${i}`} />
        </g>
      ))}
      <Corpo d={d} id={s.id} />
      {pos.map((p) => {
        const ty = p.y + (p.righe.length * LH) / 2 - 3
        return (
          <g key={p.parte + p.testo}>
            <circle cx={p.a[0]} cy={p.a[1]} r={2} fill="#7b3f4a" />
            <path d={`M${p.a[0]},${p.a[1]} L174,${ty} L180,${ty}`} fill="none" stroke="#7b3f4a" strokeWidth={0.8} />
            <text x={183} y={p.y + 7.5} fontSize={8.6} fill="#1f2b26" fontWeight={600}>
              {p.righe.map((r, i) => <tspan key={i} x={183} dy={i ? LH : 0}>{r}</tspan>)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
