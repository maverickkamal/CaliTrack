export interface UserSettings {
  name: string
  experience: 'beginner' | 'intermediate' | 'advanced'
  goal: 'strength' | 'skill' | 'endurance' | 'aesthetics'
  trainingDaysPerWeek: number
  bodyweight?: number
  weightUnit: 'kg' | 'lbs'
  onboardingComplete: boolean
  autoRestTimer: boolean
  defaultRestSeconds: number
  repCounterVoice: boolean
  theme: 'dark' | 'light'
  createdAt: string
  tourDismissed?: boolean
}

export interface Exercise {
  id: string
  name: string
  muscleGroups: string[]
  movementType: 'push' | 'pull' | 'squat' | 'hinge' | 'core' | 'skill' | 'carry'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isCustom: boolean
  notes?: string
}

export interface PlanExercise {
  exerciseId: string
  order: number
  targetSets: number
  targetReps: string
  restSeconds: number
  notes?: string
}

export interface SessionSet {
  id: string
  exerciseId: string
  setNumber: number
  reps: number
  weight?: number
  weightType: 'bodyweight' | 'assisted' | 'weighted'
  rpe?: number // Phase 3
  completed: boolean
  timestamp: string
}

export interface Session {
  id: string
  planId?: string
  programId?: string
  programDayId?: string
  date: string
  duration: number
  sets: SessionSet[]
  notes?: string
  mood?: 'bad' | 'ok' | 'good' | 'great'
  prs: string[]
}

export interface ProgramDayExercise {
  exerciseId: string
  targetSets: number
  targetReps: string
  restSeconds: number
  notes?: string
}

export interface ProgramDay {
  id: string
  dayNumber: number
  label: string
  exercises: ProgramDayExercise[]
}

export interface ProgramWeek {
  weekNumber: number
  days: ProgramDay[]
}

export interface Program {
  id: string
  name: string
  description: string
  durationWeeks: number
  daysPerWeek: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isCustom: boolean
  weeks: ProgramWeek[]
}

export interface UserProgram {
  id: string
  programId: string
  startDate: string
  currentWeek: number
  currentDay: number
  completedDays: string[]
  status: 'active' | 'paused' | 'completed'
}

export type MoodType = 'bad' | 'ok' | 'good' | 'great'

export const MOOD_MAP: Record<MoodType, { emoji: string; label: string }> = {
  bad: { emoji: '😞', label: 'Bad' },
  ok: { emoji: '😐', label: 'OK' },
  good: { emoji: '🙂', label: 'Good' },
  great: { emoji: '🔥', label: 'Great' },
}
