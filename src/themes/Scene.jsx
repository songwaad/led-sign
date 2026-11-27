import LedText from '../LedText.jsx'
import { fontSizeFor } from '../lib.js'

// seeded so decoration is stable between renders
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const many = (n, seed, fn) => { const r = rng(seed); return Array.from({ length: n }, (_, i) => fn(r, i)) }

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ0123456789ABCDEFZ'
const RAIN = many(48, 11, (r, i) => ({
  x: i * 40 + 6, d: -(r() * 6).toFixed(2), t: (4 + r() * 5).toFixed(2),
  s: Array.from({ length: 22 }, () => GLYPHS[Math.floor(r() * GLYPHS.length)]).join('\n'),
}))
const STARS = many(90, 5, (r) => ({ a: Math.floor(r() * 360), d: -(r() * 3).toFixed(2), t: (2 + r() * 2).toFixed(2) }))
const BUBBLES = many(32, 3, (r) => ({ x: Math.floor(r() * 1900), s: 20 + Math.floor(r() * 60), d: -(r() * 12).toFixed(2), t: (7 + r() * 8).toFixed(2) }))
const FLAKES = many(70, 9, (r) => ({ x: Math.floor(r() * 1920), s: 5 + Math.floor(r() * 12), d: -(r() * 14).toFixed(2), t: (8 + r() * 10).toFixed(2), sw: 20 + Math.floor(r() * 60) }))
const BULBS = (() => {
  const out = []
  const nx = 36, ny = 19
  for (let i = 0; i < nx; i++) out.push([30 + (i * 1860) / (nx - 1), 30], [30 + (i * 1860) / (nx - 1), 1050])
  for (let j = 1; j < ny - 1; j++) out.push([30, 30 + (j * 1020) / (ny - 1)], [1890, 30 + (j * 1020) / (ny - 1)])
  return out.map(([x, y], i) => ({ x, y, d: -((i % 12) * 0.1).toFixed(2) }))
})()

function Decor({ id }) {
  switch (id) {
    case 'neon': return <div className="sc-neon-frame" />
    case 'casino': return BULBS.map((b, i) => <i key={i} className="sc-bulb" style={{ left: b.x, top: b.y, animationDelay: `${b.d}s` }} />)
    case 'billboard': return <><div className="sc-bezel" /><div className="sc-sweep" /><div className="sc-scan" /></>
    case 'matrix': return <>{RAIN.map((c, i) => <div key={i} className="sc-rain" style={{ left: c.x, animationDelay: `${c.d}s`, animationDuration: `${c.t}s` }}>{c.s}</div>)}<div className="sc-scan" /></>
    case 'aurora': return <><div className="sc-blob b1" /><div className="sc-blob b2" /><div className="sc-blob b3" /></>
    case 'synthwave': return <><div className="sc-sun" /><div className="sc-grid" /><div className="sc-frame" /></>
    case 'starfield': return STARS.map((s, i) => <i key={i} className="sc-warp" style={{ '--a': `${s.a}deg`, animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }} />)
    case 'bubbles': return BUBBLES.map((b, i) => <i key={i} className="sc-bubble" style={{ left: b.x, width: b.s, height: b.s, animationDelay: `${b.d}s`, animationDuration: `${b.t}s` }} />)
    case 'snow': return <>{FLAKES.map((f, i) => <i key={i} className="sc-flake" style={{ left: f.x, width: f.s, height: f.s, '--sw': `${f.sw}px`, animationDelay: `${f.d}s`, animationDuration: `${f.t}s` }} />)}<div className="sc-ice" /></>
    case 'amber': return <div className="sc-amber-bezel" />
    default: return null
  }
}

export default function Scene({ id, lines, size }) {
  return (
    <div className={`scene scene-${id}`}>
      <Decor id={id} />
      <div className="sc-text"><LedText lines={lines} fontSize={fontSizeFor(lines, size * 0.92)} /></div>
    </div>
  )
}
