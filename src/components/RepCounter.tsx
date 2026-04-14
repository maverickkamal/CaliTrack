import { useState, useRef, useCallback } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Sheet } from './Sheet'

interface RepCounterProps {
  open: boolean
  onClose: () => void
  initialValue: number
  onDone: (reps: number) => void
}

export function RepCounter({ open, onClose, initialValue, onDone }: RepCounterProps) {
  const [count, setCount] = useState(initialValue)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRapidIncrement = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1)
    }, 100)
  }, [])

  const stopRapidIncrement = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  function handleDone() {
    onDone(count)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Rep Counter">
      <div className="flex flex-col items-center py-6 gap-6">
        <p
          className="text-7xl font-bold tabular-nums"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {count}
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="w-16 h-16 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Decrement"
          >
            <Minus size={24} />
          </button>

          <button
            onClick={() => setCount((c) => c + 1)}
            onMouseDown={startRapidIncrement}
            onMouseUp={stopRapidIncrement}
            onMouseLeave={stopRapidIncrement}
            onTouchStart={startRapidIncrement}
            onTouchEnd={stopRapidIncrement}
            className="w-24 h-24 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center active:scale-95 transition-transform shadow-lg"
            aria-label="Increment"
          >
            <Plus size={36} />
          </button>
        </div>

        <button
          onClick={handleDone}
          className="w-full max-w-xs py-3 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Done
        </button>
      </div>
    </Sheet>
  )
}
