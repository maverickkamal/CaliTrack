import { useNavigate, useParams } from 'react-router-dom'
import { useProgramStore } from '../stores/programStore'
import { ProgramForm, programToFormValues, buildProgram } from './ProgramNew'

export function ProgramEdit() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const getProgramById = useProgramStore((s) => s.getProgramById)
  const isBuiltIn = useProgramStore((s) => s.isBuiltIn)
  const updateProgram = useProgramStore((s) => s.updateProgram)

  const program = programId ? getProgramById(programId) : undefined

  if (!program) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--color-muted)]">Program not found</p>
        <button onClick={() => navigate('/programs')} className="mt-4 text-[var(--color-primary)]">
          Back
        </button>
      </div>
    )
  }

  return (
    <ProgramForm
      title={`Edit ${program.name}`}
      saveLabel="Save Changes"
      initial={programToFormValues(program)}
      onSave={(values) => {
        const builtIn = isBuiltIn(program.id)
        const updated = buildProgram(program.id, values, !builtIn)
        updateProgram(program.id, updated)
        navigate(`/programs/${program.id}`)
      }}
    />
  )
}
