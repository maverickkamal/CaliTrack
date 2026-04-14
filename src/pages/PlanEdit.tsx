import { useNavigate, useParams } from 'react-router-dom'
import { usePlanStore } from '../stores/planStore'
import { PlanForm } from './PlanNew'

export function PlanEdit() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const plan = usePlanStore((s) => s.getPlanById)(planId!)
  const updatePlan = usePlanStore((s) => s.updatePlan)

  if (!plan) return (
    <div className="p-6 text-center">
      <p className="text-[var(--color-muted)]">Plan not found</p>
      <button onClick={() => navigate('/plans')} className="mt-4 text-[var(--color-primary)]">Back</button>
    </div>
  )

  return (
    <PlanForm
      title="Edit Plan"
      initialName={plan.name}
      initialExercises={plan.exercises}
      onSave={(name, exercises) => {
        updatePlan(plan.id, { name, exercises })
        navigate(`/plans/${plan.id}`)
      }}
    />
  )
}
