import { motion } from 'framer-motion'
import type { Ref } from 'react'
import { dueDate, DAY_MS, type Course } from '../data/courses'
import { titleCase } from '../lib/format'
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

const byDue = (course: Course) => [...course.items].sort((a, b) => a.dueInDays - b.dueInDays)

/** Skeleton teaser: one shimmering bar per item, which morphs into the real card. */
export function ItemGhosts({ course, nodeRef }: { course: Course; nodeRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={nodeRef} className="flex w-[104px] flex-col gap-2">
      {byDue(course).map((item) => (
        <motion.div
          key={item.id}
          layoutId={`item-${item.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring}
          className="shimmer h-6 rounded-lg border border-dashed border-white/12"
        />
      ))}
    </div>
  )
}

export default function CourseDetail({ course, nodeRef }: { course: Course; nodeRef: Ref<HTMLDivElement> }) {
  const items = byDue(course)

  return (
    <div ref={nodeRef} className="w-full max-w-xl">
      <p className="mb-3 text-center text-sm text-muted">
        {course.subtitle} · {items.length} items
      </p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const due = dueDate(item)
          const s = status(due)
          return (
            <motion.li
              key={item.id}
              layoutId={`item-${item.id}`}
              transition={spring}
              whileHover={{ scale: 1.015 }}
              className={`rounded-2xl border px-4 py-3 transition-colors ${
                s === 'soon'
                  ? 'border-claude/70 bg-[#3a2a23]'
                  : s === 'overdue'
                    ? 'border-red-400/25 bg-surface'
                    : 'border-border bg-surface hover:border-muted/60'
              }`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
                      {titleCase(item.type)}
                    </span>
                    {s === 'soon' && (
                      <span className="rounded-full bg-claude px-2.5 py-0.5 text-xs font-semibold text-[#1f1e1d]">
                        Due Soon
                      </span>
                    )}
                    {s === 'overdue' && (
                      <span className="rounded-full bg-red-400/15 px-2.5 py-0.5 text-xs font-medium text-red-300/80">
                        Overdue
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-serif text-lg font-medium leading-snug">{titleCase(item.title)}</h3>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <div className="text-ink/85">
                    {due.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className={s === 'soon' ? 'text-claude' : s === 'overdue' ? 'text-red-300/80' : 'text-muted'}>
                    {relative(due)}
                  </div>
                </div>
              </motion.div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
