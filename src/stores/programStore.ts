import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Program, UserProgram } from '../types'
import { preloadedPrograms } from '../data/programs'

interface ProgramState {
  userPrograms: UserProgram[]
  enrollInProgram: (programId: string) => void
  completeDay: (dayId: string) => void
  pauseProgram: (userProgramId: string) => void
  resumeProgram: (userProgramId: string) => void
  unenroll: (userProgramId: string) => void
  getActiveUserProgram: () => UserProgram | undefined
  getAllPrograms: () => Program[]
  getProgramById: (id: string) => Program | undefined
}

export const useProgramStore = create<ProgramState>()(
  persist(
    (set, get) => ({
      userPrograms: [],

      enrollInProgram: (programId) => {
        set((s) => ({
          userPrograms: [
            ...s.userPrograms.map((up) =>
              up.status === 'active' ? { ...up, status: 'paused' as const } : up,
            ),
            {
              id: crypto.randomUUID(),
              programId,
              startDate: new Date().toISOString(),
              currentWeek: 1,
              currentDay: 1,
              completedDays: [],
              status: 'active',
            },
          ],
        }))
      },

      completeDay: (dayId) => {
        const state = get()
        const active = state.userPrograms.find((up) => up.status === 'active')
        if (!active) return

        const program = preloadedPrograms.find((p) => p.id === active.programId)
        if (!program) return

        const alreadyDone = active.completedDays.includes(dayId)
        if (alreadyDone) return

        const currentWeek = program.weeks.find((w) => w.weekNumber === active.currentWeek)
        if (!currentWeek) return

        const currentDayIndex = currentWeek.days.findIndex((d) => d.id === dayId)
        let nextWeek = active.currentWeek
        let nextDay = active.currentDay
        let status: UserProgram['status'] = 'active'

        if (currentDayIndex < currentWeek.days.length - 1) {
          nextDay = currentWeek.days[currentDayIndex + 1].dayNumber
        } else if (active.currentWeek < program.durationWeeks) {
          nextWeek = active.currentWeek + 1
          nextDay = 1
        } else {
          status = 'completed'
        }

        set((s) => ({
          userPrograms: s.userPrograms.map((up) =>
            up.id === active.id
              ? {
                  ...up,
                  completedDays: [...up.completedDays, dayId],
                  currentWeek: nextWeek,
                  currentDay: nextDay,
                  status,
                }
              : up,
          ),
        }))
      },

      pauseProgram: (id) =>
        set((s) => ({
          userPrograms: s.userPrograms.map((up) =>
            up.id === id ? { ...up, status: 'paused' as const } : up,
          ),
        })),

      resumeProgram: (id) =>
        set((s) => ({
          userPrograms: s.userPrograms.map((up) =>
            up.id === id
              ? { ...up, status: 'active' as const }
              : up.status === 'active'
                ? { ...up, status: 'paused' as const }
                : up,
          ),
        })),

      unenroll: (id) =>
        set((s) => ({
          userPrograms: s.userPrograms.filter((up) => up.id !== id),
        })),

      getActiveUserProgram: () => get().userPrograms.find((up) => up.status === 'active'),

      getAllPrograms: () => preloadedPrograms,

      getProgramById: (id) => preloadedPrograms.find((p) => p.id === id),
    }),
    { name: 'calitrack_user_programs' },
  ),
)
