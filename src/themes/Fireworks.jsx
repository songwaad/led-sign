import LedText from '../LedText.jsx'
import { fontSizeFor } from '../lib.js'

const COLORS = ['#ff1fa0', '#ffee00', '#00eaff', '#7dff1a', '#ff6a00', '#b04dff']
const BURSTS = [
  [240, 240, 0], [960, 150, 1], [1680, 260, 2], [150, 650, 3], [1770, 670, 4],
  [620, 110, 5], [1320, 100, 0], [430, 520, 2], [1500, 540, 1],
].map(([x, y, ci], bi) => {
  const c1 = COLORS[ci % 6]
  const c2 = COLORS[(ci + 2) % 6]
  const outer = Array.from({ length: 28 }, (_, k) => ({ a: (k * 360) / 28, d: 300 + (k % 2) * 50, c: c1, sm: false }))
  const inner = Array.from({ length: 18 }, (_, k) => ({ a: (k * 360) / 18 + 10, d: 165, c: c2, sm: true }))
  return { x, y, c1, delay: -(bi * 0.47), rise: 1080 - y + 120, parts: [...outer, ...inner] }
})

// deterministic "random" stars so the sky does not change between renders
const STARS = (() => {
  let s = 7
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: 60 }, () => ({ x: Math.floor(rnd() * 1900), y: Math.floor(rnd() * 700), d: -(rnd() * 3).toFixed(2) }))
})()

const SKYLINE =
  'polygon(0% 100%,0% 60%,3% 60%,3% 35%,7% 35%,7% 55%,11% 55%,11% 25%,14% 25%,14% 50%,19% 50%,19% 40%,23% 40%,23% 65%,28% 65%,28% 30%,32% 30%,32% 55%,37% 55%,37% 45%,42% 45%,42% 70%,47% 70%,47% 35%,51% 35%,51% 20%,53% 20%,53% 35%,56% 35%,56% 60%,61% 60%,61% 40%,66% 40%,66% 55%,70% 55%,70% 28%,74% 28%,74% 50%,79% 50%,79% 38%,84% 38%,84% 62%,89% 62%,89% 32%,93% 32%,93% 52%,97% 52%,97% 45%,100% 45%,100% 100%)'

export default function Fireworks({ lines, size }) {
  const fontSize = fontSizeFor(lines, size * 0.95)
  return (
    <div className="fw-root">
      {STARS.map((s, i) => (
        <div key={i} className="star" style={{ left: s.x, top: s.y, animationDelay: `${s.d}s` }} />
      ))}
      {BURSTS.map((b, bi) => (
        <div key={bi} className="burst" style={{ left: b.x, top: b.y, '--dl': `${b.delay.toFixed(2)}s` }}>
          <div className="flash" style={{ background: `radial-gradient(circle, ${b.c1} 0%, transparent 65%)` }} />
          <div className="rocket" style={{ '--rise': `${b.rise}px` }} />
          {b.parts.map((p, pi) => (
            <div key={pi} className={`p${p.sm ? ' sm' : ''}`} style={{ '--a': `${p.a.toFixed(1)}deg`, '--d': `${p.d}px`, '--c': p.c }} />
          ))}
        </div>
      ))}
      <div className="fw-glow" />
      <div className="fw-skyline" style={{ clipPath: SKYLINE }} />
      <div className="fw-text">
        <LedText lines={lines} fontSize={fontSize} palette="fw" />
      </div>
    </div>
  )
}
