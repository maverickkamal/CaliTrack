import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  position?: 'center' | 'bottom'
}

export function Sheet({ open, onClose, children, title, position = 'center' }: SheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const isCenter = position === 'center'

  const content = (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-[60] flex justify-center animate-backdrop-in supports-[backdrop-filter]:backdrop-blur-[2px] ${
        isCenter ? 'items-center bg-black/60 px-5' : 'items-end bg-black/55'
      }`}
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div
        className={`w-full max-w-lg bg-[var(--color-surface)] flex flex-col shadow-[0_24px_80px_-16px_rgba(0,0,0,0.6)] ring-1 ring-[var(--color-border)] ${
          isCenter
            ? 'rounded-2xl max-h-[80vh] animate-fade-in'
            : 'rounded-t-[1.25rem] max-h-[85vh] animate-slide-up'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 relative">
          {!isCenter && (
            <div className="w-10 h-1 rounded-full bg-[var(--color-muted)] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          )}
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

  return createPortal(content, document.body)
}
