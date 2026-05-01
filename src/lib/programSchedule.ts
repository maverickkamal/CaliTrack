import type { Program, ProgramDay, UserProgram } from '../types'

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function normalizeWeekday(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 1
  return ((value % 7) + 7) % 7
}

function getCurrentWeek(program: Program, userProgram: UserProgram) {
  return program.weeks.find((w) => w.weekNumber === userProgram.currentWeek)
}

function getPendingDaysForCurrentWeek(program: Program, userProgram: UserProgram): ProgramDay[] {
  const currentWeek = getCurrentWeek(program, userProgram)
  if (!currentWeek) return []
  const completedSet = new Set(userProgram.completedDays)
  return currentWeek.days.filter((d) => !completedSet.has(d.id))
}

function sortByWeekdayThenDayNumber(days: ProgramDay[]): ProgramDay[] {
  return [...days].sort((a, b) => {
    const aw = normalizeWeekday(a.weekday)
    const bw = normalizeWeekday(b.weekday)
    if (aw !== bw) return aw - bw
    return a.dayNumber - b.dayNumber
  })
}

export function getScheduledProgramDayForDate(
  program: Program | undefined,
  userProgram: UserProgram | undefined,
  date: Date = new Date(),
): ProgramDay | undefined {
  if (!program || !userProgram) return undefined

  const pendingDays = getPendingDaysForCurrentWeek(program, userProgram)
  if (pendingDays.length === 0) return undefined

  const todayWeekday = date.getDay()
  const exactMatch = pendingDays.find((d) => normalizeWeekday(d.weekday) === todayWeekday)
  if (exactMatch) return exactMatch

  return sortByWeekdayThenDayNumber(pendingDays)[0]
}

