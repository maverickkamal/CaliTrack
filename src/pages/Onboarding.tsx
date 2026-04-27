import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { useProgramStore } from '../stores/programStore'
import { PillSelect } from '../components/PillSelect'
import { ChevronRight, Flame } from 'lucide-react'

type Step = 1 | 2 | 3

export function Onboarding() {
  const navigate = useNavigate()
  const setUser = useUserStore((s) => s.setUser)
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram)
  const programs = useProgramStore((s) => s.getAllPrograms)()

  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [goal, setGoal] = useState<'strength' | 'skill' | 'endurance' | 'aesthetics'>('strength')
  const [trainingDays, setTrainingDays] = useState(4)
  const [bodyweight, setBodyweight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')

  function handleProfileNext() {
    setUser({
      name: name.trim() || 'Athlete',
      experience,
      goal,
      trainingDaysPerWeek: trainingDays,
      bodyweight: bodyweight ? Number(bodyweight) : undefined,
      weightUnit,
    })
    setStep(3)
  }

  function finishWithCustomProgram() {
    completeOnboarding()
    navigate('/programs/new')
  }

  function finishWithProgram(programId: string) {
    enrollInProgram(programId)
    completeOnboarding()
    navigate('/')
  }

  function finishFreestyle() {
    completeOnboarding()
    navigate('/')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {step === 1 && (
        <div key={1} className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-6 shadow-[0_12px_40px_-8px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]">
            <Flame size={32} className="text-white" />
          </div>
          <h1
            className="text-4xl font-bold mb-3 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CaliTrack
          </h1>
          <p className="text-[var(--color-muted)] text-center text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Train like you mean it
          </p>
          <p className="text-[var(--color-muted)] text-center text-sm max-w-xs mb-10">
            Your personal calisthenics tracker. Build programs, log sessions, track progress — all offline.
          </p>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="btn-press flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold shadow-[0_12px_36px_-10px_color-mix(in_srgb,var(--color-primary)_50%,transparent)] hover:bg-[var(--color-primary-hover)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s go <ChevronRight size={20} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div key={2} className="flex-1 flex flex-col px-6 pt-12 pb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            About you
          </h2>
          <p className="text-[var(--color-muted)] text-sm mb-6">Personalize your training experience.</p>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-muted)]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] text-base transition-[border-color,box-shadow] duration-200"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-muted)]">Experience</label>
              <PillSelect
                options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
                value={experience}
                onChange={setExperience}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-muted)]">Primary Goal</label>
              <PillSelect
                options={[
                  { value: 'strength', label: 'Strength' },
                  { value: 'skill', label: 'Skill' },
                  { value: 'endurance', label: 'Endurance' },
                  { value: 'aesthetics', label: 'Aesthetics' },
                ]}
                value={goal}
                onChange={setGoal}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-muted)]">Training Days / Week</label>
              <PillSelect
                options={[
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                ]}
                value={String(trainingDays)}
                onChange={(v) => setTrainingDays(Number(v))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--color-muted)]">
                Bodyweight <span className="text-xs">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bodyweight}
                  onChange={(e) => setBodyweight(e.target.value)}
                  placeholder="72"
                  className="flex-1 px-4 py-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-fg)] placeholder:text-[var(--color-muted)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <PillSelect
                  options={[
                    { value: 'kg', label: 'kg' },
                    { value: 'lbs', label: 'lbs' },
                  ]}
                  value={weightUnit}
                  onChange={setWeightUnit}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProfileNext}
            className="btn-press w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-base font-semibold mt-6 shadow-[0_10px_32px_-10px_color-mix(in_srgb,var(--color-primary)_48%,transparent)] hover:bg-[var(--color-primary-hover)]"
            style={{ fontFamily: 'var(--font-heading)', height: '52px' }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div key={3} className="flex-1 flex flex-col px-6 pt-12 pb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            How do you want to start?
          </h2>
          <p className="text-[var(--color-muted)] text-sm mb-6">Pick a path. You can always change later.</p>

          <button
            type="button"
            onClick={finishWithCustomProgram}
            className="card-surface-interactive w-full p-5 text-left mb-3"
          >
            <p className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Build my own program
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Create a custom multi-day program from scratch with exercises you choose.
            </p>
          </button>

          <button
            type="button"
            onClick={finishFreestyle}
            className="card-surface-interactive w-full p-4 text-left mb-4"
          >
            <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
              Just freestyle
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Skip for now — start free sessions and pick a program later.
            </p>
          </button>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--color-muted)] mt-2">Or start with a program:</p>
            {programs.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => finishWithProgram(prog.id)}
                className="card-surface-interactive w-full p-5 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {prog.name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    prog.difficulty === 'beginner'
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      : prog.difficulty === 'intermediate'
                        ? 'bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]'
                        : 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]'
                  }`}>
                    {prog.difficulty}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">{prog.description}</p>
                <p className="text-xs text-[var(--color-muted)] mt-2">
                  {prog.durationWeeks} weeks · {prog.daysPerWeek} days/week
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex gap-2 justify-center pb-8 safe-bottom">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              s === step ? 'w-8 bg-[var(--color-primary)]' : 'w-2 bg-[var(--color-muted)]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
