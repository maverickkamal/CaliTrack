import { useEffect, useRef, type ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Sheet({ open, onClose, children, title }: SheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 animate-backdrop-in supports-[backdrop-filter]:backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="w-full max-w-lg bg-[var(--color-surface)] rounded-t-[1.25rem] animate-slide-up max-h-[85vh] flex flex-col shadow-[0_-24px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-[var(--color-border)]">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="w-10 h-1 rounded-full bg-[var(--color-muted)] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          {title && <h3 className="text-heading text-lg">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-[var(--color-muted)] hover:text-[var(--color-fg)] text-xl leading-none p-1 rounded-lg transition-colors duration-[180ms] active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
