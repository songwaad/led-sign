import { useEffect, useRef, useState } from 'react'
import { LockOpen } from 'lucide-react'

const HOLD_MS = 1500

// Swallows every touch while the sign is locked; only a long press on the lock icon unlocks.
export default function LockOverlay({ onUnlock }) {
  const [holding, setHolding] = useState(false)
  const timer = useRef(null)

  const start = () => {
    setHolding(true)
    timer.current = setTimeout(onUnlock, HOLD_MS)
  }
  const cancel = () => {
    setHolding(false)
    clearTimeout(timer.current)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="fixed inset-0 z-50 touch-none select-none" onContextMenu={(e) => e.preventDefault()}>
      <button
        className="absolute bottom-4 left-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        aria-label="กดค้างเพื่อปลดล็อก"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
            pathLength="1" strokeDasharray="1" strokeDashoffset={holding ? 0 : 1}
            style={{ transition: holding ? `stroke-dashoffset ${HOLD_MS}ms linear` : 'none' }} />
        </svg>
        <LockOpen className="h-6 w-6" />
      </button>
      <div className="absolute bottom-6 left-24 rounded-full bg-black/40 px-3 py-1 text-sm text-white/60 backdrop-blur">
        กดค้างปุ่มซ้ายล่างเพื่อปลดล็อก
      </div>
    </div>
  )
}
