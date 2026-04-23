import { useState, useEffect, useRef, useCallback } from 'react'
import { Sheet } from './Sheet'

interface RestTimerProps {
  open: boolean
  onClose: () => void
  defaultSeconds: number
}

const presets = [60, 90, 120, 180]

function playTone() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  } catch { /* Web Audio not available */ }
}

function vibrate() {
  try {
    navigator.vibrate?.([200, 100, 200, 100, 200])
  } catch { /* Vibration not available */ }
}

function notifyComplete() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Rest complete!', { body: 'Time to get back to work.', icon: '/pwa-192x192.png' })
  }
}

export function RestTimer({ open, onClose, defaultSeconds }: RestTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds)
  const [remaining, setRemaining] = useState(defaultSeconds)
  const [running, setRunning] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasNotifiedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (open) {
      setTotalSeconds(defaultSeconds)
      setRemaining(defaultSeconds)
      setRunning(true)
      setIsDone(false)
      hasNotifiedRef.current = false
      requestNotificationPermission()
    } else {
      clearTimer()
      setRunning(false)
      setIsDone(false)
    }
    return clearTimer
  }, [open, defaultSeconds, requestNotificationPermission, clearTimer])

  useEffect(() => {
    clearTimer()

    if (!running || isDone) return

    if (remaining <= 0) {
      setRunning(false)
      setIsDone(true)
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true
        playTone()
        vibrate()
        notifyComplete()
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1
        if (next <= 0) {
          clearTimer()
          setRunning(false)
          setIsDone(true)
          if (!hasNotifiedRef.current) {
            hasNotifiedRef.current = true
            playTone()
            vibrate()
            notifyComplete()
          }
          return 0
        }
        return next
      })
    }, 1000)

    return clearTimer
  }, [running, isDone, remaining <= 0, clearTimer])

  const progress = totalSeconds > 0 ? Math.max(0, remaining / totalSeconds) : 0
  const isWarning = remaining <= 10 && remaining > 0

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference * (1 - progress)

  const ringColor = isDone
    ? 'var(--color-primary)'
    : isWarning
      ? 'var(--color-accent-red)'
      : 'var(--color-accent-amber)'

  function handleClose() {
    clearTimer()
    setRunning(false)
    setIsDone(false)
    onClose()
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Rest Timer">
      <div className="flex flex-col items-center py-4 gap-5">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-border)" strokeWidth="6" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-3xl font-bold tabular-nums ${isDone ? 'text-[var(--color-primary)]' : ''}`}
              style={{ fontFamily: 'var(--font-display)', color: isDone ? undefined : ringColor }}
            >
              {isDone ? 'Done!' : `${mins}:${secs.toString().padStart(2, '0')}`}
            </span>
          </div>
        </div>

        {!isDone && running && (
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm font-medium"
            >
              Skip
            </button>
            <button
              onClick={() => { setRemaining((r) => r + 30); setTotalSeconds((t) => t + 30) }}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm font-medium"
            >
              +30s
            </button>
          </div>
        )}

        {isDone && (
          <button
            onClick={handleClose}
            className="w-full max-w-xs py-3 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold active:scale-[0.98] transition-transform"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Continue
          </button>
        )}

        {!running && !isDone && (
          <div className="flex gap-2 flex-wrap justify-center">
            {presets.map((s) => (
              <button
                key={s}
                onClick={() => { setTotalSeconds(s); setRemaining(s); setRunning(true); setIsDone(false) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  totalSeconds === s
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-muted)]'
                }`}
              >
                {s >= 60 ? `${s / 60}min` : `${s}s`}
              </button>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  )
}
