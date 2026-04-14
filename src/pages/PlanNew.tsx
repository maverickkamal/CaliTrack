import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlanStore } from '../stores/planStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { ExercisePicker } from '../components/ExercisePicker'
import { ArrowLeft, Plus, GripVertical, X } from 'lucide-react'
import type { Exercise, PlanExercise } from '../types'

interface PlanFormProps {
  initialName?: string
  initialExercises?: PlanExercise[]
  onSave: (name: string, exercises: PlanExercise[]) => void
  title: string
}

export function PlanForm({ initialName = '', initialExercises = [], onSave, title }: PlanFormProps) {
  const navigate = useNavigate()
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)
  const [name, setName] = useState(initialName)
  const [exercises, setExercises] = useState<PlanExercise[]>(initialExercises)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  function addExercise(ex: Exercise) {
    setExercises((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        order: prev.length,
        targetSets: 3,
        targetReps: '8-12',
        restSeconds: 90,
      },
    ])
  }

  function removeExercise(idx: number) {
    setExercises((prev) => prev.filter((_, i) => i !== idx).map((e, i) => ({ ...e, order: i })))
  }

  function updateExercise(idx: number, data: Partial<PlanExercise>) {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, ...data } : e)))
  }

  function moveExercise(from: number, to: number) {
    if (to < 0 || to >= exercises.length) return
    const arr = [...exercises]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setExercises(arr.map((e, i) => ({ ...e, order: i })))
  }

  function handleSave() {
    if (!name.trim()) return
    onSave(name.trim(), exercises)
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Plan name (e.g. Push Day A)"
        className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] mb-5"
      />

      <div className="space-y-3 mb-4">
        {exercises.map((ex, idx) => {
          const info = getExerciseById(ex.exerciseId)
          return (
            <div
              key={`${ex.exerciseId}-${idx}`}
              className={`p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] ${
                dragIdx === idx ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null) moveExercise(dragIdx, idx); setDragIdx(null) }}
              onDragEnd={() => setDragIdx(null)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-[var(--color-muted)] cursor-grab" />
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {info?.name ?? 'Unknown'}
                  </p>
                </div>
                <button onClick={() => removeExercise(idx)} className="text-[var(--color-muted)] hover:text-[var(--color-accent-red)]" aria-label="Remove">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-[var(--color-muted)] block mb-1">Sets</label>
                  <input
                    type="number"
                    value={ex.targetSets}
                    onChange={(e) => updateExercise(idx, { targetSets: Number(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] block mb-1">Reps</label>
                  <input
                    type="text"
                    value={ex.targetReps}
                    onChange={(e) => updateExercise(idx, { targetReps: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="8-12"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--color-muted)] block mb-1">Rest (s)</label>
                  <input
                    type="number"
                    value={ex.restSeconds}
                    onChange={(e) => updateExercise(idx, { restSeconds: Number(e.target.value) || 60 })}
                    className="w-full px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                    min={0}
                    step={15}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setPickerOpen(true)}
        className="w-full p-3 rounded-xl border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm flex items-center justify-center gap-2 mb-6 hover:bg-[var(--color-primary)]/10 transition-colors"
      >
        <Plus size={16} /> Add Exercise
      </button>

      <button
        onClick={handleSave}
        disabled={!name.trim() || exercises.length === 0}
        className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
        style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
      >
        Save Plan
      </button>

      <ExercisePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addExercise} />
    </div>
  )
}

export function PlanNew() {
  const navigate = useNavigate()
  const addPlan = usePlanStore((s) => s.addPlan)

  return (
    <PlanForm
      title="New Plan"
      onSave={(name, exercises) => {
        const now = new Date().toISOString()
        addPlan({ id: crypto.randomUUID(), name, exercises, createdAt: now, updatedAt: now })
        navigate('/plans')
      }}
    />
  )
}
