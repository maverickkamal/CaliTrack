import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export function Settings() {
  const navigate = useNavigate()
  const user = useUserStore()
  const setUser = useUserStore((s) => s.setUser)
  const clearAllData = useUserStore((s) => s.clearAllData)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <div>
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Theme</p>
                <p className="text-xs text-[var(--color-muted)]">{user.theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={() => setUser({ theme: user.theme === 'dark' ? 'light' : 'dark' })}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                user.theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  user.theme === 'dark' ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Weight Unit */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Weight Unit</p>
          <div className="flex gap-2">
            {(['kg', 'lbs'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setUser({ weightUnit: unit })}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  user.weightUnit === unit
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-muted)]'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Rest Timer */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Auto Rest Timer</p>
              <p className="text-xs text-[var(--color-muted)]">Start timer after completing a set</p>
            </div>
            <button
              onClick={() => setUser({ autoRestTimer: !user.autoRestTimer })}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                user.autoRestTimer ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  user.autoRestTimer ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Default Rest */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Default Rest Duration</p>
          <div className="flex gap-2">
            {[60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => setUser({ defaultRestSeconds: s })}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  user.defaultRestSeconds === s
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-muted)]'
                }`}
              >
                {s >= 60 ? `${s / 60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Rep Counter Voice */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Rep Counter Voice</p>
              <p className="text-xs text-[var(--color-muted)]">Read count aloud</p>
            </div>
            <button
              onClick={() => setUser({ repCounterVoice: !user.repCounterVoice })}
              className={`w-12 h-7 rounded-full relative transition-colors ${
                user.repCounterVoice ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  user.repCounterVoice ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <p className="text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Profile</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--color-muted)] block mb-1">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ name: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--color-bg)] rounded-lg text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted)] block mb-1">Bodyweight ({user.weightUnit})</label>
              <input
                type="number"
                value={user.bodyweight ?? ''}
                onChange={(e) => setUser({ bodyweight: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 bg-[var(--color-bg)] rounded-lg text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Clear Data */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent-red)]/20">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full text-sm text-[var(--color-accent-red)] font-medium"
            >
              Clear All Data
            </button>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm">This will delete all your data. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllData}
                  className="flex-1 py-2 bg-[var(--color-accent-red)] text-white rounded-lg text-sm"
                >
                  Yes, clear everything
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 bg-[var(--color-bg)] rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
