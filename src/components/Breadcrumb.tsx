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
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {crumbs.map((c, i) => (
        <span key={c.depth} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-muted">›</span>}
          <button
            onClick={() => onJump(c.depth)}
            disabled={c.depth === current}
            className={c.depth === current ? 'font-medium text-claude' : 'text-muted transition hover:text-ink'}
          >
            {c.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
