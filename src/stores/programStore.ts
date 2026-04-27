import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Program, UserProgram } from '../types'
import { preloadedPrograms } from '../data/programs'

interface ProgramState {
  userPrograms: UserProgram[]
  /** Custom or overridden programs. If id matches a preloaded program, this entry overrides it. */
  customPrograms: Program[]
  enrollInProgram: (programId: string) => void
  completeDay: (dayId: string) => void
  pauseProgram: (userProgramId: string) => void
  resumeProgram: (userProgramId: string) => void
  unenroll: (userProgramId: string) => void
  addProgram: (program: Program) => void
  updateProgram: (id: string, program: Program) => void
  deleteProgram: (id: string) => void
  isBuiltIn: (id: string) => boolean
  isCustom: (id: string) => boolean
  hasOverride: (id: string) => boolean
  resetToBuiltIn: (id: string) => void
  getActiveUserProgram: () => UserProgram | undefined
  getAllPrograms: () => Program[]
  getProgramById: (id: string) => Program | undefined
}

function mergePrograms(custom: Program[]): Program[] {
  const customById = new Map(custom.map((c) => [c.id, c]))
  const merged = preloadedPrograms.map((p) => customById.get(p.id) ?? p)
  const extras = custom.filter((c) => !preloadedPrograms.some((p) => p.id === c.id))
  return [...merged, ...extras]
}

export const useProgramStore = create<ProgramState>()(
  persist(
    (set, get) => ({
      userPrograms: [],
      customPrograms: [],

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

        const program = state.getProgramById(active.programId)
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

      addProgram: (program) =>
        set((s) => ({ customPrograms: [...s.customPrograms, program] })),

      updateProgram: (id, program) =>
        set((s) => {
          const exists = s.customPrograms.some((p) => p.id === id)
          if (exists) {
            return {
              customPrograms: s.customPrograms.map((p) => (p.id === id ? program : p)),
            }
          }
          return { customPrograms: [...s.customPrograms, program] }
        }),

      deleteProgram: (id) =>
        set((s) => {
          const isBuiltIn = preloadedPrograms.some((p) => p.id === id)
          if (isBuiltIn) {
            return {
              customPrograms: s.customPrograms.filter((p) => p.id !== id),
              userPrograms: s.userPrograms,
            }
          }
          return {
            customPrograms: s.customPrograms.filter((p) => p.id !== id),
            userPrograms: s.userPrograms.filter((up) => up.programId !== id),
          }
        }),

      resetToBuiltIn: (id) =>
        set((s) => ({ customPrograms: s.customPrograms.filter((p) => p.id !== id) })),

      isBuiltIn: (id) => preloadedPrograms.some((p) => p.id === id),
      isCustom: (id) => !preloadedPrograms.some((p) => p.id === id),
      hasOverride: (id) => get().customPrograms.some((p) => p.id === id),

      getActiveUserProgram: () => get().userPrograms.find((up) => up.status === 'active'),

      getAllPrograms: () => mergePrograms(get().customPrograms),

      getProgramById: (id) => {
        const custom = get().customPrograms.find((p) => p.id === id)
        if (custom) return custom
        return preloadedPrograms.find((p) => p.id === id)
      },
    }),
    { name: 'calitrack_user_programs' },
  ),
)
