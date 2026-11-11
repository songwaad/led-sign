import LedText from '../LedText.jsx'
import { fontSizeFor } from '../lib.js'

export default function LedBoard({ lines, size }) {
  const fontSize = fontSizeFor(lines, size)
  return (
    <div className="board-root">
      <div className="board">
        <svg className="board-chase cc-b" width="1808" height="968" viewBox="0 0 1808 968" aria-hidden="true">
          <rect className="chase" x="28" y="28" width="1752" height="912" rx="16" fill="none" stroke="currentColor"
            strokeWidth="9" strokeLinecap="round" pathLength="250" strokeDasharray="0 1" />
        </svg>
        <LedText lines={lines} fontSize={fontSize} palette="a" />
      </div>
    </div>
  )
}
