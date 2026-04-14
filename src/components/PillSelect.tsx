interface PillSelectProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function PillSelect<T extends string>({ options, value, onChange }: PillSelectProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${
            value === opt.value
              ? 'bg-[var(--color-primary)] text-white shadow-[0_6px_20px_-6px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]'
              : 'bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))]'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
