import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan } from '../types'

interface PlanState {
  plans: Plan[]
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, data: Partial<Plan>) => void
  deletePlan: (id: string) => void
  getPlanById: (id: string) => Plan | undefined
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plans: [],
      addPlan: (plan) => set((s) => ({ plans: [...s.plans, plan] })),
      updatePlan: (id, data) =>
        set((s) => ({
          plans: s.plans.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p,
          ),
        })),
      deletePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),
      getPlanById: (id) => get().plans.find((p) => p.id === id),
    }),
    { name: 'calitrack_plans' },
  ),
)
