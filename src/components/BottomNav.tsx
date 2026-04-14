import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Dumbbell, BookOpen, TrendingUp } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/log/new', label: 'Log', icon: Dumbbell, matchPaths: ['/log'] },
  { path: '/programs', label: 'Programs', icon: BookOpen },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(tab: (typeof tabs)[number]) {
    if (tab.path === '/' && location.pathname === '/') return true
    if (tab.path !== '/' && location.pathname.startsWith(tab.path)) return true
    if ('matchPaths' in tab) {
      return tab.matchPaths.some((p) => location.pathname.startsWith(p))
    }
    return false
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.35)]"
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const active = isActive(tab)
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative rounded-xl transition-[color,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.94] min-w-0"
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label}
            >
              <span
                className="absolute top-0 left-1/2 h-0.5 rounded-full bg-[var(--color-primary)] transition-[width,opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: active ? '1.75rem' : '0',
                  opacity: active ? 1 : 0,
                  transform: 'translateX(-50%)',
                }}
              />
              <Icon
                size={22}
                className={`transition-transform duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  active ? 'text-[var(--color-primary)] scale-105' : 'text-[var(--color-muted)] scale-100'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[11px] font-medium transition-colors duration-[180ms] ${
                  active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
