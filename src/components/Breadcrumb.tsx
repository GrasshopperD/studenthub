interface Crumb {
  label: string
  depth: number
}

interface Props {
  crumbs: Crumb[]
  current: number
  onJump: (depth: number) => void
}

export default function Breadcrumb({ crumbs, current, onJump }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-2 text-base">
      {crumbs.map((c, i) => (
        <span key={c.depth} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted/60">›</span>}
          <button
            type="button"
            onClick={() => onJump(c.depth)}
            disabled={c.depth === current}
            aria-current={c.depth === current ? 'page' : undefined}
            className={c.depth === current ? 'font-semibold text-claude' : 'text-muted transition hover:text-ink'}
          >
            {c.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
