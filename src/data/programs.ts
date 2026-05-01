import type { Program } from '../types'

function makeDayId(progId: string, week: number, day: number) {
  return `${progId}-w${week}-d${day}`
}

function makeWeeks(
  progId: string,
  numWeeks: number,
  daysTemplate: { label: string; weekday?: number; exercises: { exerciseId: string; targetSets: number; targetReps: string; restSeconds: number }[] }[],
) {
  const defaultWeekdayOrder = [1, 3, 5, 0, 2, 4, 6]
  return Array.from({ length: numWeeks }, (_, wi) => ({
    weekNumber: wi + 1,
    days: daysTemplate.map((dt, di) => ({
      id: makeDayId(progId, wi + 1, di + 1),
      dayNumber: di + 1,
      label: dt.label,
      weekday: dt.weekday ?? defaultWeekdayOrder[di % defaultWeekdayOrder.length],
      exercises: dt.exercises.map((e) => ({ ...e })),
    })),
  }))
}

export const preloadedPrograms: Program[] = [
  {
    id: 'prog-foundation',
    name: 'Foundation',
    description: 'Build a solid base with push, pull, and full-body fundamentals. Perfect for getting started with calisthenics.',
    durationWeeks: 4,
    daysPerWeek: 3,
    difficulty: 'beginner',
    isCustom: false,
    weeks: makeWeeks('prog-foundation', 4, [
      {
        label: 'Day A — Push',
        exercises: [
          { exerciseId: 'ex-push-01', targetSets: 3, targetReps: '8-12', restSeconds: 60 },
          { exerciseId: 'ex-push-07', targetSets: 3, targetReps: '5-8', restSeconds: 90 },
          { exerciseId: 'ex-push-05', targetSets: 3, targetReps: '6-10', restSeconds: 60 },
        ],
      },
      {
        label: 'Day B — Pull',
        exercises: [
          { exerciseId: 'ex-pull-10', targetSets: 3, targetReps: '8-12', restSeconds: 60 },
          { exerciseId: 'ex-pull-12', targetSets: 3, targetReps: '20s', restSeconds: 60 },
          { exerciseId: 'ex-pull-13', targetSets: 3, targetReps: '5-8', restSeconds: 90 },
        ],
      },
      {
        label: 'Day C — Full Body',
        exercises: [
          { exerciseId: 'ex-legs-01', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'ex-legs-08', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'ex-core-09', targetSets: 3, targetReps: '30s', restSeconds: 60 },
          { exerciseId: 'ex-core-01', targetSets: 3, targetReps: '20s', restSeconds: 60 },
        ],
      },
    ]),
  },
  {
    id: 'prog-ppl',
    name: 'Push-Pull-Legs',
    description: 'Intermediate split targeting each movement pattern. Four days per week with balanced volume across push, pull, legs, and full body.',
    durationWeeks: 6,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    isCustom: false,
    weeks: makeWeeks('prog-ppl', 6, [
      {
        label: 'Day A — Push',
        exercises: [
          { exerciseId: 'ex-push-07', targetSets: 4, targetReps: '6-10', restSeconds: 90 },
          { exerciseId: 'ex-push-02', targetSets: 3, targetReps: '8-12', restSeconds: 60 },
          { exerciseId: 'ex-push-05', targetSets: 3, targetReps: '6-10', restSeconds: 60 },
          { exerciseId: 'ex-skill-09', targetSets: 3, targetReps: '15s', restSeconds: 60 },
        ],
      },
      {
        label: 'Day B — Pull',
        exercises: [
          { exerciseId: 'ex-pull-01', targetSets: 4, targetReps: '5-8', restSeconds: 120 },
          { exerciseId: 'ex-pull-10', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
          { exerciseId: 'ex-pull-11', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
        ],
      },
      {
        label: 'Day C — Legs',
        exercises: [
          { exerciseId: 'ex-legs-03', targetSets: 4, targetReps: '3-5', restSeconds: 120 },
          { exerciseId: 'ex-legs-07', targetSets: 3, targetReps: '4-6', restSeconds: 90 },
          { exerciseId: 'ex-legs-09', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
        ],
      },
      {
        label: 'Day D — Full Body',
        exercises: [
          { exerciseId: 'ex-pull-01', targetSets: 3, targetReps: '5-8', restSeconds: 90 },
          { exerciseId: 'ex-push-07', targetSets: 3, targetReps: '6-10', restSeconds: 90 },
          { exerciseId: 'ex-legs-02', targetSets: 3, targetReps: '8-10', restSeconds: 60 },
          { exerciseId: 'ex-core-07', targetSets: 3, targetReps: '8-12', restSeconds: 60 },
          { exerciseId: 'ex-core-09', targetSets: 3, targetReps: '45s', restSeconds: 60 },
        ],
      },
    ]),
  },
  {
    id: 'prog-skill',
    name: 'Skill Builder',
    description: 'Advanced program focusing on front lever, planche, handstand, and muscle-up progressions with supplementary strength work.',
    durationWeeks: 8,
    daysPerWeek: 5,
    difficulty: 'advanced',
    isCustom: false,
    weeks: makeWeeks('prog-skill', 8, [
      {
        label: 'Day A — Planche + Push',
        exercises: [
          { exerciseId: 'ex-skill-01', targetSets: 5, targetReps: '15s', restSeconds: 120 },
          { exerciseId: 'ex-skill-02', targetSets: 4, targetReps: '8s', restSeconds: 120 },
          { exerciseId: 'ex-push-06', targetSets: 3, targetReps: '5-8', restSeconds: 90 },
          { exerciseId: 'ex-push-07', targetSets: 3, targetReps: '8-12', restSeconds: 90 },
        ],
      },
      {
        label: 'Day B — Front Lever + Pull',
        exercises: [
          { exerciseId: 'ex-skill-03', targetSets: 5, targetReps: '10s', restSeconds: 120 },
          { exerciseId: 'ex-skill-04', targetSets: 3, targetReps: '5s', restSeconds: 120 },
          { exerciseId: 'ex-pull-01', targetSets: 4, targetReps: '5-8', restSeconds: 90 },
          { exerciseId: 'ex-pull-05', targetSets: 3, targetReps: '3-5', restSeconds: 90 },
        ],
      },
      {
        label: 'Day C — Handstand',
        exercises: [
          { exerciseId: 'ex-skill-06', targetSets: 5, targetReps: '30s', restSeconds: 90 },
          { exerciseId: 'ex-push-10', targetSets: 4, targetReps: '3-5', restSeconds: 120 },
          { exerciseId: 'ex-core-02', targetSets: 3, targetReps: '10s', restSeconds: 90 },
          { exerciseId: 'ex-core-04', targetSets: 3, targetReps: '3-5', restSeconds: 90 },
        ],
      },
      {
        label: 'Day D — Muscle-up + Strength',
        exercises: [
          { exerciseId: 'ex-pull-07', targetSets: 5, targetReps: '1-3', restSeconds: 180 },
          { exerciseId: 'ex-pull-01', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
          { exerciseId: 'ex-push-07', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
          { exerciseId: 'ex-core-08', targetSets: 3, targetReps: '5-8', restSeconds: 60 },
        ],
      },
      {
        label: 'Day E — Legs + Core',
        exercises: [
          { exerciseId: 'ex-legs-03', targetSets: 4, targetReps: '3-5', restSeconds: 120 },
          { exerciseId: 'ex-legs-07', targetSets: 3, targetReps: '4-6', restSeconds: 90 },
          { exerciseId: 'ex-skill-05', targetSets: 3, targetReps: '10s', restSeconds: 120 },
          { exerciseId: 'ex-core-01', targetSets: 3, targetReps: '30s', restSeconds: 60 },
          { exerciseId: 'ex-core-11', targetSets: 3, targetReps: '6-8', restSeconds: 60 },
        ],
      },
    ]),
  },
]
