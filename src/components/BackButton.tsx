interface Props {
  disabled: boolean
  onClick: () => void
}

export default function BackButton({ disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Back"
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition enabled:hover:border-claude enabled:hover:bg-claude enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      <span aria-hidden>←</span> Back
    </button>
  )
}
