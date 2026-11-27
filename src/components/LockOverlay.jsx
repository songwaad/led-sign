import { LockOpen } from 'lucide-react'

// Swallows every touch while the sign is locked; tapping the lock icon unlocks.
export default function LockOverlay({ onUnlock }) {
  return (
    <div className="fixed inset-0 z-50 touch-none select-none" onContextMenu={(e) => e.preventDefault()}>
      <button
        className="absolute bottom-4 left-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur"
        onClick={onUnlock}
        aria-label="ปลดล็อก"
      >
        <LockOpen className="h-6 w-6" />
      </button>
    </div>
  )
}
