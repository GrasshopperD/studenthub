import { motion } from 'framer-motion'
import { dueDate, DAY_MS, type Course } from '../data/courses'
import { spring } from './Bubble'

function status(due: Date) {
  const diff = due.getTime() - Date.now()
  if (diff < 0) return 'overdue' as const
  if (diff <= 3 * DAY_MS) return 'soon' as const
  return 'normal' as const
}

function relative(due: Date) {
  const days = Math.round((due.getTime() - Date.now()) / DAY_MS)
  if (days < 0) return `${-days}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `In ${days} days`
}

export default function CourseDetail({ course }: { course: Course }) {
  const items = [...course.items].sort((a, b) => a.dueInDays - b.dueInDays)

  return (
    <ul className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const due = dueDate(item)
        const s = status(due)
        return (
          <motion.li
            key={item.id}
            initial={{ scale: 0.5, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.08 + i * 0.07 }}
            whileHover={{ scale: 1.03 }}
            className={`rounded-3xl border p-4 transition-colors ${
              s === 'soon'
                ? 'border-claude bg-claude/15'
                : s === 'overdue'
                  ? 'border-red-400/30 bg-surface'
                  : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
                {item.type}
              </span>
              {s === 'overdue' && (
                <span className="rounded-full bg-red-400/15 px-2.5 py-0.5 text-xs font-medium text-red-300/80">
                  Overdue
                </span>
              )}
              {s === 'soon' && (
                <span className="rounded-full bg-claude px-2.5 py-0.5 text-xs font-medium text-white">
                  Due soon
                </span>
              )}
            </div>
            <h3 className="mt-3 text-base font-semibold leading-snug">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              <span className="mx-1.5">·</span>
              <span className={s === 'soon' ? 'text-claude' : s === 'overdue' ? 'text-red-300/80' : ''}>
                {relative(due)}
              </span>
            </p>
          </motion.li>
        )
      })}
    </ul>
  )
}
