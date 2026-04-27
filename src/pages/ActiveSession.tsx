import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSessionStore } from '../stores/sessionStore'
import { useProgramStore } from '../stores/programStore'
import { useExerciseStore } from '../stores/exerciseStore'
import { useUserStore } from '../stores/userStore'
import { ExercisePicker } from '../components/ExercisePicker'
import { RepCounter } from '../components/RepCounter'
import { RestTimer } from '../components/RestTimer'
import { ArrowLeft, Plus, Check, Timer, Trash2 } from 'lucide-react'
import type { SessionSet, Exercise, MoodType, PlanExercise } from '../types'
import { MOOD_MAP } from '../types'

interface ExerciseGroup {
  exerciseId: string
  sets: SessionSet[]
  target?: { targetSets: number; targetReps: string; restSeconds: number }
}

interface PersistedSession {
  sessionId: string
  groups: ExerciseGroup[]
  startTime: number
  programId?: string
  programDayId?: string
  isFree?: boolean
}

const STORAGE_KEY = 'calitrack-active-session'

function loadPersistedSession(sessionId: string): PersistedSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedSession
    if (data.sessionId === sessionId) return data
    return null
  } catch {
    return null
  }
}

function saveSession(data: PersistedSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* sessionStorage full or unavailable */ }
}

function clearPersistedSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function ActiveSession() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const addSession = useSessionStore((s) => s.addSession)
  const detectPRs = useSessionStore((s) => s.detectPRs)
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const completeDay = useProgramStore((s) => s.completeDay)
  const getExerciseById = useExerciseStore((s) => s.getExerciseById)
  const autoRestTimer = useUserStore((s) => s.autoRestTimer)
  const defaultRestSeconds = useUserStore((s) => s.defaultRestSeconds)

  const state = location.state as { programId?: string; programDayId?: string; free?: boolean } | null

  const persisted = sessionId ? loadPersistedSession(sessionId) : null

  const effectiveProgramId = persisted?.programId ?? state?.programId
  const effectiveProgramDayId = persisted?.programDayId ?? state?.programDayId

  const program = effectiveProgramId ? getProgramById(effectiveProgramId) : undefined
  const programDay = program && effectiveProgramDayId
    ? program.weeks.flatMap((w) => w.days).find((d) => d.id === effectiveProgramDayId)
    : undefined

  const initialExercises: PlanExercise[] = programDay?.exercises?.map((e, i) => ({
    exerciseId: e.exerciseId,
    order: i,
    targetSets: e.targetSets,
    targetReps: e.targetReps,
    restSeconds: e.restSeconds,
  })) ?? []

  const [groups, setGroups] = useState<ExerciseGroup[]>(() => {
    if (persisted?.groups) return persisted.groups
    return initialExercises.map((pe) => ({
      exerciseId: pe.exerciseId,
      target: { targetSets: pe.targetSets, targetReps: pe.targetReps, restSeconds: pe.restSeconds },
      sets: Array.from({ length: pe.targetSets }, (_, i) => ({
        id: crypto.randomUUID(),
        exerciseId: pe.exerciseId,
        setNumber: i + 1,
        reps: 0,
        weightType: 'bodyweight' as const,
        completed: false,
        timestamp: '',
      })),
    }))
  })

  const startTimeRef = useRef(persisted?.startTime ?? Date.now())
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - startTimeRef.current) / 1000),
  )
  const [pickerOpen, setPickerOpen] = useState(false)
  const [repCounterOpen, setRepCounterOpen] = useState(false)
  const [repCounterTarget, setRepCounterTarget] = useState<{ groupIdx: number; setIdx: number } | null>(null)
  const [timerOpen, setTimerOpen] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(defaultRestSeconds)
  const [showSummary, setShowSummary] = useState(false)
  const [mood, setMood] = useState<MoodType | undefined>()
  const [notes, setNotes] = useState('')
  const [prs, setPrs] = useState<string[]>([])

  useEffect(() => {
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (!sessionId || showSummary) return
    const data: PersistedSession = {
      sessionId,
      groups,
      startTime: startTimeRef.current,
      programId: effectiveProgramId,
      programDayId: effectiveProgramDayId,
      isFree: state?.free,
    }
    saveSession(data)
  }, [groups, sessionId, showSummary, effectiveProgramId, effectiveProgramDayId, state?.free])

  const sessionLabel = programDay?.label ?? program?.name ?? 'Free Session'

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function updateSet(groupIdx: number, setIdx: number, data: Partial<SessionSet>) {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? { ...g, sets: g.sets.map((s, si) => (si === setIdx ? { ...s, ...data } : s)) }
          : g,
      ),
    )
  }

  const completeSet = useCallback((groupIdx: number, setIdx: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              sets: g.sets.map((s, si) =>
                si === setIdx ? { ...s, completed: !s.completed, timestamp: new Date().toISOString() } : s,
              ),
            }
          : g,
      ),
    )
    const group = groups[groupIdx]
    if (group && autoRestTimer && !groups[groupIdx].sets[setIdx].completed) {
      const rest = group.target?.restSeconds ?? defaultRestSeconds
      setTimerSeconds(rest)
      setTimerOpen(true)
    }
  }, [groups, autoRestTimer, defaultRestSeconds])

  function addSet(groupIdx: number) {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              sets: [
                ...g.sets,
                {
                  id: crypto.randomUUID(),
                  exerciseId: g.exerciseId,
                  setNumber: g.sets.length + 1,
                  reps: 0,
                  weightType: 'bodyweight' as const,
                  completed: false,
                  timestamp: '',
                },
              ],
            }
          : g,
      ),
    )
  }

  function deleteSet(groupIdx: number, setIdx: number) {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? { ...g, sets: g.sets.filter((_, si) => si !== setIdx).map((s, i) => ({ ...s, setNumber: i + 1 })) }
          : g,
      ),
    )
  }

  function addExercise(ex: Exercise) {
    setGroups((prev) => [
      ...prev,
      {
        exerciseId: ex.id,
        sets: [{
          id: crypto.randomUUID(),
          exerciseId: ex.id,
          setNumber: 1,
          reps: 0,
          weightType: 'bodyweight' as const,
          completed: false,
          timestamp: '',
        }],
      },
    ])
  }

  function handleFinish() {
    const allSets = groups.flatMap((g) => g.sets)
    const session = {
      id: sessionId!,
      programId: program?.id,
      programDayId: programDay?.id,
      date: new Date().toISOString(),
      duration: elapsed,
      sets: allSets,
      notes: '',
      mood: undefined as MoodType | undefined,
      prs: [] as string[],
    }
    const detectedPrs = detectPRs(session)
    setPrs(detectedPrs)
    setShowSummary(true)
  }

  function handleSave() {
    const allSets = groups.flatMap((g) => g.sets)
    const session = {
      id: sessionId!,
      programId: program?.id,
      programDayId: programDay?.id,
      date: new Date().toISOString(),
      duration: elapsed,
      sets: allSets,
      notes: notes || undefined,
      mood,
      prs,
    }
    addSession(session)
    if (programDay) completeDay(programDay.id)
    clearPersistedSession()
    navigate('/')
  }

  function handleDiscard() {
    clearPersistedSession()
    navigate('/')
  }

  if (showSummary) {
    const completedSets = groups.flatMap((g) => g.sets).filter((s) => s.completed)
    const totalReps = completedSets.reduce((a, s) => a + s.reps, 0)
    const exerciseCount = new Set(completedSets.map((s) => s.exerciseId)).size

    return (
      <div className="px-4 pt-6 pb-4 animate-fade-in">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Session Complete</h1>
        <p className="text-[var(--color-muted)] text-sm mb-6">{sessionLabel}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{formatTime(elapsed)}</p>
            <p className="text-xs text-[var(--color-muted)]">Duration</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{completedSets.length}</p>
            <p className="text-xs text-[var(--color-muted)]">Sets</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{totalReps}</p>
            <p className="text-xs text-[var(--color-muted)]">Reps</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{exerciseCount}</p>
            <p className="text-xs text-[var(--color-muted)]">Exercises</p>
          </div>
        </div>

        {prs.length > 0 && (
          <div className="p-4 rounded-xl bg-[var(--color-accent-amber)]/10 border border-[var(--color-accent-amber)]/30 mb-6">
            <p className="text-sm font-semibold text-[var(--color-accent-amber)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              New PRs!
            </p>
            {prs.map((id) => (
              <p key={id} className="text-sm">{getExerciseById(id)?.name ?? id}</p>
            ))}
          </div>
        )}

        <div className="mb-5">
          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-heading)' }}>How did it feel?</p>
          <div className="flex gap-3">
            {(Object.entries(MOOD_MAP) as [MoodType, { emoji: string; label: string }][]).map(([key, { emoji, label }]) => (
              <button
                key={key}
                onClick={() => setMood(key)}
                className={`flex-1 py-3 rounded-xl text-center transition-all ${
                  mood === key
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
                }`}
              >
                <span className="text-xl block">{emoji}</span>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
          style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
        >
          Save Session
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={handleDiscard} className="p-2 -ml-2" aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{sessionLabel}</p>
            <p className="text-xs text-[var(--color-muted)] tabular-nums">{formatTime(elapsed)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPickerOpen(true)}
            className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center"
            aria-label="Add exercise"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Finish
          </button>
        </div>
      </div>

      {/* Exercise groups */}
      <div className="space-y-5">
        {groups.map((group, gi) => {
          const info = getExerciseById(group.exerciseId)
          return (
            <div key={`${group.exerciseId}-${gi}`} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
              <div className="px-4 pt-3 pb-2">
                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{info?.name ?? 'Unknown'}</p>
                {group.target && (
                  <p className="text-xs text-[var(--color-muted)]">Target: {group.target.targetSets}×{group.target.targetReps}</p>
                )}
              </div>

              <div className="px-4 pb-2">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem_2rem] gap-1 text-xs text-[var(--color-muted)] mb-1 px-1">
                  <span>Set</span><span>Reps</span><span>Weight</span><span></span><span></span>
                </div>
                {group.sets.map((set, si) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-[2rem_1fr_1fr_2.5rem_2rem] gap-1 items-center py-1.5 px-1 rounded-lg ${
                      set.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <span className="text-xs text-[var(--color-muted)] text-center">{set.setNumber}</span>
                    <button
                      onClick={() => { setRepCounterTarget({ groupIdx: gi, setIdx: si }); setRepCounterOpen(true) }}
                      className="px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm text-center border border-[var(--color-border)] min-h-[34px]"
                    >
                      {set.reps || '-'}
                    </button>
                    <input
                      type="text"
                      value={set.weight != null ? String(set.weight) : ''}
                      onChange={(e) => {
                        const v = e.target.value
                        const num = v === '' ? undefined : Number(v)
                        updateSet(gi, si, {
                          weight: num,
                          weightType: num != null && num < 0 ? 'assisted' : num != null && num > 0 ? 'weighted' : 'bodyweight',
                        })
                      }}
                      placeholder="BW"
                      className="px-2 py-1.5 bg-[var(--color-bg)] rounded-lg text-sm text-center border border-[var(--color-border)] min-h-[34px] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <button
                      onClick={() => completeSet(gi, si)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        set.completed
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-muted)]'
                      }`}
                      aria-label={set.completed ? 'Undo complete' : 'Complete set'}
                    >
                      <Check size={14} className={set.completed ? 'animate-check-in' : ''} />
                    </button>
                    <button
                      onClick={() => deleteSet(gi, si)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent-red)]"
                      aria-label="Delete set"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => addSet(gi)}
                  className="flex-1 py-2 text-xs text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary)]/5 rounded-lg transition-colors"
                >
                  + Add Set
                </button>
                <button
                  onClick={() => { setTimerSeconds(group.target?.restSeconds ?? defaultRestSeconds); setTimerOpen(true) }}
                  className="px-3 py-2 text-xs text-[var(--color-accent-amber)] font-medium hover:bg-[var(--color-accent-amber)]/5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Timer size={12} /> Rest
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--color-muted)] mb-4">No exercises yet. Add one to start.</p>
          <button
            onClick={() => setPickerOpen(true)}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold"
          >
            Add Exercise
          </button>
        </div>
      )}

      <ExercisePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addExercise} />

      {repCounterTarget && (
        <RepCounter
          open={repCounterOpen}
          onClose={() => { setRepCounterOpen(false); setRepCounterTarget(null) }}
          initialValue={groups[repCounterTarget.groupIdx]?.sets[repCounterTarget.setIdx]?.reps ?? 0}
          onDone={(reps) => {
            updateSet(repCounterTarget.groupIdx, repCounterTarget.setIdx, { reps })
            setRepCounterTarget(null)
          }}
        />
      )}

      <RestTimer open={timerOpen} onClose={() => setTimerOpen(false)} defaultSeconds={timerSeconds} />
    </div>
  )
}
