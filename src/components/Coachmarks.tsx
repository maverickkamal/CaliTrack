import { useState } from 'react'
import { useUserStore } from '../stores/userStore'

const marks = [
  { label: 'Log', description: 'Tap here to start logging a workout session.' },
  { label: 'Programs', description: 'Browse and enroll in structured training programs.' },
  { label: 'Progress', description: 'Track your PRs, volume, and training history.' },
]

export function Coachmarks() {
  const tourDismissed = useUserStore((s) => s.tourDismissed)
  const dismissTour = useUserStore((s) => s.dismissTour)
  const [step, setStep] = useState(0)

  if (tourDismissed) return null

  const current = marks[step]

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 animate-backdrop-in backdrop-blur-[3px] pb-24 supports-[backdrop-filter]:bg-black/35">
      <div
        key={step}
        className="bg-[var(--color-surface)] rounded-2xl p-5 mx-4 max-w-sm w-full animate-fade-in shadow-[0_24px_64px_-16px_rgba(0,0,0,0.55)] ring-1 ring-[var(--color-border)]"
      >
        <p className="text-heading text-base mb-1">{current.label}</p>
        <p className="text-body text-sm text-[var(--color-muted)] mb-4">{current.description}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={dismissTour}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors duration-[180ms]"
          >
            Skip tour
          </button>
          <button
            type="button"
            onClick={() => {
              if (step < marks.length - 1) setStep(step + 1)
              else dismissTour()
            }}
            className="btn-press px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {step < marks.length - 1 ? 'Got it' : 'Done'}
          </button>
        </div>
        <div className="flex gap-1.5 justify-center mt-3">
          {marks.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
