import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgramStore } from '../stores/programStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { ExercisePicker } from '../components/ExercisePicker'
import { PillSelect } from '../components/PillSelect'
import { ArrowLeft, Plus, GripVertical, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { Exercise, Program, ProgramDay, ProgramDayExercise } from '../types'

export interface ProgramFormDay {
  label: string
  exercises: ProgramDayExercise[]
}

export interface ProgramFormValues {
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationWeeks: number
  days: ProgramFormDay[]
}

interface ProgramFormProps {
  initial?: ProgramFormValues
  title: string
  saveLabel?: string
  onSave: (values: ProgramFormValues) => void
}

const DEFAULT_FORM: ProgramFormValues = {
  name: '',
  description: '',
  difficulty: 'intermediate',
  durationWeeks: 4,
  days: [],
}

export function ProgramForm({ initial, title, saveLabel = 'Save Program', onSave }: ProgramFormProps) {
  const navigate = useNavigate()
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)
  const [values, setValues] = useState<ProgramFormValues>(initial ?? DEFAULT_FORM)
  const [openDayIdx, setOpenDayIdx] = useState<number | null>(initial?.days.length ? 0 : null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<{ dayIdx: number; replaceExIdx?: number } | null>(null)
  const [dragKey, setDragKey] = useState<string | null>(null)

  function setField<K extends keyof ProgramFormValues>(key: K, value: ProgramFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function addDay() {
    setValues((v) => ({
      ...v,
      days: [...v.days, { label: `Day ${String.fromCharCode(65 + v.days.length)}`, exercises: [] }],
    }))
    setOpenDayIdx(values.days.length)
  }

  function removeDay(idx: number) {
    setValues((v) => ({ ...v, days: v.days.filter((_, i) => i !== idx) }))
    setOpenDayIdx(null)
  }

  function updateDay(idx: number, patch: Partial<ProgramFormDay>) {
    setValues((v) => ({
      ...v,
      days: v.days.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    }))
  }

  function moveDay(from: number, to: number) {
    if (to < 0 || to >= values.days.length) return
    setValues((v) => {
      const arr = [...v.days]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...v, days: arr }
    })
  }

  function handlePickExercise(ex: Exercise) {
    if (!pickerTarget) return
    const { dayIdx, replaceExIdx } = pickerTarget
    setValues((v) => {
      const day = v.days[dayIdx]
      if (!day) return v
      const newEx: ProgramDayExercise = {
        exerciseId: ex.id,
        targetSets: 3,
        targetReps: '8-12',
        restSeconds: 90,
      }
      const exercises =
        replaceExIdx != null
          ? day.exercises.map((e, i) => (i === replaceExIdx ? { ...e, exerciseId: ex.id } : e))
          : [...day.exercises, newEx]
      return { ...v, days: v.days.map((d, i) => (i === dayIdx ? { ...d, exercises } : d)) }
    })
    setPickerTarget(null)
    setPickerOpen(false)
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setValues((v) => ({
      ...v,
      days: v.days.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) } : d,
      ),
    }))
  }

  function updateExercise(dayIdx: number, exIdx: number, patch: Partial<ProgramDayExercise>) {
    setValues((v) => ({
      ...v,
      days: v.days.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.map((e, j) => (j === exIdx ? { ...e, ...patch } : e)) }
          : d,
      ),
    }))
  }

  function moveExercise(dayIdx: number, from: number, to: number) {
    setValues((v) => {
      const day = v.days[dayIdx]
      if (!day || to < 0 || to >= day.exercises.length) return v
      const arr = [...day.exercises]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...v, days: v.days.map((d, i) => (i === dayIdx ? { ...d, exercises: arr } : d)) }
    })
  }

  const canSave = values.name.trim().length > 0 && values.days.length > 0 && values.days.every((d) => d.exercises.length > 0)

  function handleSave() {
    if (!canSave) return
    onSave({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      durationWeeks: Math.max(1, Math.min(52, Math.round(values.durationWeeks))),
    })
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
      </div>

      {/* Meta */}
      <div className="space-y-3 mb-5">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-muted)]">Name</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="e.g. My Push-Pull Split"
            className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-muted)]">Description</label>
          <textarea
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="What is this program about?"
            rows={2}
            className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-muted)]">Difficulty</label>
          <PillSelect
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
            value={values.difficulty}
            onChange={(v) => setField('difficulty', v)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5 text-[var(--color-muted)]">Duration (weeks)</label>
          <input
            type="number"
            value={values.durationWeeks}
            onChange={(e) => setField('durationWeeks', Number(e.target.value) || 1)}
            min={1}
            max={52}
            className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-fg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Each day&apos;s exercises repeat across all weeks.
          </p>
        </div>
      </div>

      {/* Days */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Days {values.days.length > 0 && <span className="text-[var(--color-muted)] font-normal text-sm">({values.days.length}/wk)</span>}
        </h2>
      </div>

      <div className="space-y-3 mb-3">
        {values.days.map((day, dayIdx) => {
          const isOpen = openDayIdx === dayIdx
          return (
            <div
              key={dayIdx}
              className={`rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden ${
                dragKey === `day-${dayIdx}` ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={() => setDragKey(`day-${dayIdx}`)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragKey?.startsWith('day-')) {
                  const from = Number(dragKey.slice(4))
                  if (from !== dayIdx) moveDay(from, dayIdx)
                }
                setDragKey(null)
              }}
              onDragEnd={() => setDragKey(null)}
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <GripVertical size={16} className="text-[var(--color-muted)] cursor-grab shrink-0" />
                <input
                  type="text"
                  value={day.label}
                  onChange={(e) => updateDay(dayIdx, { label: e.target.value })}
                  placeholder="Day name"
                  className="flex-1 min-w-0 px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  onClick={() => setOpenDayIdx(isOpen ? null : dayIdx)}
                  className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-muted)]"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button
                  onClick={() => removeDay(dayIdx)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent-red)]"
                  aria-label="Remove day"
                >
                  <X size={16} />
                </button>
              </div>

              {!isOpen && (
                <div className="px-3 pb-3 -mt-1">
                  <p className="text-xs text-[var(--color-muted)]">
                    {day.exercises.length === 0
                      ? 'No exercises yet'
                      : `${day.exercises.length} exercise${day.exercises.length === 1 ? '' : 's'}`}
                  </p>
                </div>
              )}

              {isOpen && (
                <div className="px-3 pb-3 space-y-2">
                  {day.exercises.map((ex, exIdx) => {
                    const info = getExerciseById(ex.exerciseId)
                    return (
                      <div
                        key={`${ex.exerciseId}-${exIdx}`}
                        className={`p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] ${
                          dragKey === `ex-${dayIdx}-${exIdx}` ? 'opacity-50' : ''
                        }`}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation()
                          setDragKey(`ex-${dayIdx}-${exIdx}`)
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.stopPropagation()
                          if (dragKey?.startsWith(`ex-${dayIdx}-`)) {
                            const from = Number(dragKey.split('-')[2])
                            if (from !== exIdx) moveExercise(dayIdx, from, exIdx)
                          }
                          setDragKey(null)
                        }}
                        onDragEnd={() => setDragKey(null)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <GripVertical size={14} className="text-[var(--color-muted)] cursor-grab shrink-0" />
                            <p className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                              {info?.name ?? 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setPickerTarget({ dayIdx, replaceExIdx: exIdx })
                                setPickerOpen(true)
                              }}
                              className="px-2.5 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/10 transition-colors"
                            >
                              Change
                            </button>
                            <button
                              onClick={() => removeExercise(dayIdx, exIdx)}
                              className="text-[var(--color-muted)] hover:text-[var(--color-accent-red)] p-1"
                              aria-label="Remove exercise"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-[var(--color-muted)] block mb-0.5">Sets</label>
                            <input
                              type="number"
                              value={ex.targetSets}
                              onChange={(e) => updateExercise(dayIdx, exIdx, { targetSets: Number(e.target.value) || 1 })}
                              className="w-full px-2 py-1.5 bg-[var(--color-surface)] rounded-md text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                              min={1}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[var(--color-muted)] block mb-0.5">Reps</label>
                            <input
                              type="text"
                              value={ex.targetReps}
                              onChange={(e) => updateExercise(dayIdx, exIdx, { targetReps: e.target.value })}
                              className="w-full px-2 py-1.5 bg-[var(--color-surface)] rounded-md text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                              placeholder="8-12"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[var(--color-muted)] block mb-0.5">Rest (s)</label>
                            <input
                              type="number"
                              value={ex.restSeconds}
                              onChange={(e) => updateExercise(dayIdx, exIdx, { restSeconds: Number(e.target.value) || 60 })}
                              className="w-full px-2 py-1.5 bg-[var(--color-surface)] rounded-md text-sm text-center border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                              min={0}
                              step={15}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <button
                    onClick={() => {
                      setPickerTarget({ dayIdx })
                      setPickerOpen(true)
                    }}
                    className="w-full p-2.5 rounded-lg border border-dashed border-[var(--color-primary)] text-[var(--color-primary)] text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/10 transition-colors"
                  >
                    <Plus size={14} /> Add Exercise
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={addDay}
        className="w-full p-3 rounded-xl border border-dashed border-[var(--color-border)] text-[var(--color-muted)] text-sm flex items-center justify-center gap-2 mb-6 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <Plus size={16} /> Add Day
      </button>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
        style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
      >
        {saveLabel}
      </button>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false)
          setPickerTarget(null)
        }}
        onSelect={handlePickExercise}
      />
    </div>
  )
}

export function buildProgram(id: string, values: ProgramFormValues, isCustom: boolean): Program {
  const days: ProgramDay[] = values.days.map((d, di) => ({
    id: `${id}-d${di + 1}`,
    dayNumber: di + 1,
    label: d.label.trim() || `Day ${di + 1}`,
    exercises: d.exercises.map((e) => ({ ...e })),
  }))

  const weeks = Array.from({ length: values.durationWeeks }, (_, wi) => ({
    weekNumber: wi + 1,
    days: days.map((d) => ({
      ...d,
      id: `${id}-w${wi + 1}-d${d.dayNumber}`,
      exercises: d.exercises.map((e) => ({ ...e })),
    })),
  }))

  return {
    id,
    name: values.name,
    description: values.description,
    durationWeeks: values.durationWeeks,
    daysPerWeek: values.days.length,
    difficulty: values.difficulty,
    isCustom,
    weeks,
  }
}

export function programToFormValues(p: Program): ProgramFormValues {
  const week1 = p.weeks.find((w) => w.weekNumber === 1) ?? p.weeks[0]
  const days: ProgramFormDay[] = (week1?.days ?? []).map((d) => ({
    label: d.label,
    exercises: d.exercises.map((e) => ({ ...e })),
  }))
  return {
    name: p.name,
    description: p.description,
    difficulty: p.difficulty,
    durationWeeks: p.durationWeeks,
    days,
  }
}

export function ProgramNew() {
  const navigate = useNavigate()
  const addProgram = useProgramStore((s) => s.addProgram)

  return (
    <ProgramForm
      title="New Program"
      saveLabel="Create Program"
      onSave={(values) => {
        const id = `custom-${crypto.randomUUID()}`
        const program = buildProgram(id, values, true)
        addProgram(program)
        navigate(`/programs/${id}`, { replace: true })
      }}
    />
  )
}
