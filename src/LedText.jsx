import { graphemes } from './lib.js'

// LED dot-matrix text. Colours cycle through --c1..--c4 set by the selected palette.
export default function LedText({ lines, fontSize }) {
  const dot = Math.max(7, Math.round(fontSize / 12))
  const radius = +(dot * 0.36).toFixed(2)
  let i = 0
  return (
    <div className="led-text" style={{ fontSize, '--dot': `${dot}px`, '--dr': `${radius}px` }}>
      {lines.map((line, li) => (
        <div className="led-line" key={li}>
          {graphemes(line).map((ch, ci) =>
            ch.trim() === '' ? (
              <span key={ci} className="led-gap" />
            ) : (
              <span key={ci} className="led" style={{ animationDelay: `-${(i++ * 0.2).toFixed(2)}s` }}>
                {ch}
              </span>
            )
          )}
        </div>
      ))}
    </div>
  )
}
