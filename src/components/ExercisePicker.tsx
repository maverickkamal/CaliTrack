import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Sheet } from './Sheet'
import { useExerciseStore } from '../stores/exerciseStore'
import type { Exercise } from '../types'

interface ExercisePickerProps {
  open: boolean
  onClose: () => void
  onSelect: (exercise: Exercise) => void
}

const categories = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Skills'] as const
const movementMap: Record<string, string> = {
  Push: 'push', Pull: 'pull', Legs: 'squat,hinge', Core: 'core', Skills: 'skill',
}

export function ExercisePicker({ open, onClose, onSelect }: ExercisePickerProps) {
  const getAllExercises = useExerciseStore((s) => s.getAllExercises)
  const addCustomExercise = useExerciseStore((s) => s.addCustomExercise)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('All')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<Exercise['movementType']>('push')

  const exercises = getAllExercises()
  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    if (category === 'All') return matchSearch
    const types = movementMap[category]?.split(',') ?? []
    return matchSearch && types.includes(e.movementType)
  })

  function handleCreateCustom() {
    if (!newName.trim()) return
    const ex: Exercise = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      muscleGroups: [],
      movementType: newType,
      difficulty: 'intermediate',
      isCustom: true,
    }
    addCustomExercise(ex)
    onSelect(ex)
    setNewName('')
    setShowCreate(false)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Add Exercise" position="bottom">
      <div className="relative mb-3">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg)] rounded-xl text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === c
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg)] text-[var(--color-muted)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowCreate(!showCreate)}
        className="flex items-center gap-2 w-full p-3 mb-2 rounded-xl border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm hover:bg-[var(--color-primary)]/10 transition-colors"
      >
        <Plus size={16} /> Create custom exercise
      </button>

      {showCreate && (
        <div className="p-3 mb-3 bg-[var(--color-bg)] rounded-xl space-y-3">
          <input
            type="text"
            placeholder="Exercise name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-surface)] rounded-lg text-sm text-[var(--color-fg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
            autoFocus
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as Exercise['movementType'])}
            className="w-full px-3 py-2 bg-[var(--color-surface)] rounded-lg text-sm text-[var(--color-fg)] border border-[var(--color-border)]"
          >
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="squat">Squat</option>
            <option value="hinge">Hinge</option>
            <option value="core">Core</option>
            <option value="skill">Skill</option>
          </select>
          <button
            onClick={handleCreateCustom}
            className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => { onSelect(ex); onClose() }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--color-bg)] transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-sm font-medium">{ex.name}</p>
              <p className="text-xs text-[var(--color-muted)] capitalize">{ex.movementType} · {ex.difficulty}</p>
            </div>
            {ex.isCustom && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                Custom
              </span>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted)] py-8">No exercises found</p>
        )}
      </div>
    </Sheet>
  )
}
