import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exercise } from '../types'
import { preloadedExercises } from '../data/exercises'

interface ExerciseState {
  customExercises: Exercise[]
  addCustomExercise: (exercise: Exercise) => void
  updateCustomExercise: (id: string, data: Partial<Exercise>) => void
  deleteCustomExercise: (id: string) => boolean
  getAllExercises: () => Exercise[]
  getExerciseById: (id: string) => Exercise | undefined
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      customExercises: [],
      addCustomExercise: (exercise) =>
        set((s) => ({ customExercises: [...s.customExercises, exercise] })),
      updateCustomExercise: (id, data) =>
        set((s) => ({
          customExercises: s.customExercises.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteCustomExercise: (id) => {
        const state = get()
        const exists = state.customExercises.find((e) => e.id === id)
        if (!exists) return false
        set((s) => ({ customExercises: s.customExercises.filter((e) => e.id !== id) }))
        return true
      },
      getAllExercises: () => {
        const state = get()
        return [...state.customExercises, ...preloadedExercises]
      },
      getExerciseById: (id) => {
        const state = get()
        return state.customExercises.find((e) => e.id === id) ?? preloadedExercises.find((e) => e.id === id)
      },
    }),
    {
      name: 'calitrack_exercises',
      partialize: (state) => ({ customExercises: state.customExercises }),
    },
  ),
)
