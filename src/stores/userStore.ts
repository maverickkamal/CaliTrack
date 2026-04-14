import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSettings } from '../types'

interface UserState extends UserSettings {
  setUser: (data: Partial<UserSettings>) => void
  completeOnboarding: () => void
  dismissTour: () => void
  clearAllData: () => void
}

const defaults: UserSettings = {
  name: '',
  experience: 'intermediate',
  goal: 'strength',
  trainingDaysPerWeek: 4,
  bodyweight: undefined,
  weightUnit: 'kg',
  onboardingComplete: false,
  autoRestTimer: true,
  defaultRestSeconds: 90,
  repCounterVoice: false,
  theme: 'dark',
  createdAt: '',
  tourDismissed: false,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...defaults,
      setUser: (data) => set((s) => ({ ...s, ...data })),
      completeOnboarding: () =>
        set({ onboardingComplete: true, createdAt: new Date().toISOString() }),
      dismissTour: () => set({ tourDismissed: true }),
      clearAllData: () => {
        localStorage.clear()
        set({ ...defaults })
        window.location.reload()
      },
    }),
    { name: 'calitrack_user' },
  ),
)
