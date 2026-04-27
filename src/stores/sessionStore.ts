import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, SessionSet } from '../types'

interface SessionState {
  sessions: Session[]
  addSession: (session: Session) => void
  deleteSession: (id: string) => void
  getSessionById: (id: string) => Session | undefined
  getSessionsByExercise: (exerciseId: string) => Session[]
  detectPRs: (newSession: Session) => string[]
}

function epleyMax(weight: number, reps: number): number {
  if (reps <= 0) return 0
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) => set((s) => ({ sessions: [session, ...s.sessions] })),
      deleteSession: (id) => set((s) => ({ sessions: s.sessions.filter((ss) => ss.id !== id) })),
      getSessionById: (id) => get().sessions.find((s) => s.id === id),
      getSessionsByExercise: (exerciseId) =>
        get().sessions.filter((s) => s.sets.some((set) => set.exerciseId === exerciseId)),

      detectPRs: (newSession) => {
        const { sessions } = get()
        const prExerciseIds: string[] = []
        const exerciseIds = [...new Set(newSession.sets.map((s) => s.exerciseId))]

        for (const exId of exerciseIds) {
          const newSets = newSession.sets.filter(
            (s) => s.exerciseId === exId && s.completed,
          )
          if (newSets.length === 0) continue

          const historicalSets: SessionSet[] = sessions.flatMap((s) =>
            s.sets.filter((set) => set.exerciseId === exId && set.completed),
          )

          for (const ns of newSets) {
            const sameTypeSets = historicalSets.filter((h) => h.weightType === ns.weightType)
            const maxHistoricalReps = sameTypeSets.length > 0
              ? Math.max(...sameTypeSets.map((s) => s.reps))
              : 0

            if (ns.reps > maxHistoricalReps) {
              prExerciseIds.push(exId)
              break
            }

            if (ns.weight != null && ns.weight > 0) {
              const newEstMax = epleyMax(ns.weight, ns.reps)
              const maxHistoricalLoad = sameTypeSets.length > 0
                ? Math.max(
                    ...sameTypeSets
                      .filter((s) => s.weight != null && s.weight > 0)
                      .map((s) => epleyMax(s.weight!, s.reps)),
                    0,
                  )
                : 0
              if (newEstMax > maxHistoricalLoad) {
                prExerciseIds.push(exId)
                break
              }
            }
          }
        }

        return [...new Set(prExerciseIds)]
      },
    }),
    { name: 'calitrack_sessions' },
  ),
)
