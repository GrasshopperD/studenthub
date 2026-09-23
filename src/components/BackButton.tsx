export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Back (Esc)"
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-claude pl-4 pr-5 text-[15px] font-bold text-[#1f1e1d] shadow-[0_4px_16px_-4px_rgba(217,119,87,0.55)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-4px_rgba(217,119,87,0.7)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-claude"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      Back
    </button>
  )
}
