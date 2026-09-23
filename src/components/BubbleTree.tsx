import { useCallback, useEffect, useRef, type ReactNode, type Ref } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { schools } from '../data/courses'
import type { Path } from '../App'
import Bubble, { spring, type BubbleVariant } from './Bubble'
import ConnectorLines, { type Edge } from './ConnectorLines'
import CourseDetail, { ItemGhosts } from './CourseDetail'

const SIZE = { user: 140, school: 120, course: 104 }

interface Props {
  username: string
  path: Path
  onNavigate: (path: Path) => void
}

/** One row of the tree. Levels below the current one animate in and collapse on the way back. */
function Level({ nodeRef, children }: { nodeRef: Ref<HTMLDivElement>; children: ReactNode }) {
  return (
    <motion.div
      className="relative z-10 flex w-full justify-center pt-14"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.22 } }}
      transition={spring}
    >
      <div ref={nodeRef} className="flex w-full justify-center">
        {children}
      </div>
    </motion.div>
  )
}

/**
 * Tree grows downward: user -> schools -> courses -> items.
 * path: [] | ['user'] | ['user', school] | ['user', school, course]
 * Level i is shown once depth >= i - 1; at depth === i - 1 it is a ghost preview.
 */
export default function BubbleTree({ username, path, onNavigate }: Props) {
  const depth = path.length
  const school = schools.find((s) => s.id === path[1])
  const course = school?.courses.find((c) => c.id === path[2])
  const pathKey = path.join('/')

  const containerRef = useRef<HTMLDivElement>(null)
  const nodes = useRef(new Map<string, HTMLElement>())
  const refCache = useRef(new Map<string, (el: HTMLElement | null) => void>())
  // Stable callback ref per node id; stale entries are skipped via isConnected when measuring.
  const node = useCallback((id: string) => {
    let fn = refCache.current.get(id)
    if (!fn) {
      fn = (el) => {
        if (el) nodes.current.set(id, el)
      }
      refCache.current.set(id, fn)
    }
    return fn
  }, [])

  // Scroll so the newest level sits in the middle of the viewport (below the fixed header).
  useEffect(() => {
    const t = setTimeout(() => {
      const el = nodes.current.get(`level-${depth}`)
      if (!el?.isConnected) return
      // offsetTop ignores in-flight transforms, so we aim at the settled position.
      let top = 0
      for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) top += e.offsetTop
      const header = document.querySelector('header')?.offsetHeight ?? 72
      const visible = window.innerHeight - header
      const target =
        el.offsetHeight > visible - 32 ? top - header - 24 : top + el.offsetHeight / 2 - header - visible / 2
      window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
    }, 60)
    return () => clearTimeout(t)
  }, [depth, pathKey])

  const schoolVariant = (id: string): BubbleVariant =>
    depth === 0 ? 'ghost' : depth === 1 ? 'normal' : id === school?.id ? 'active' : 'dim'
  const courseVariant = (id: string): BubbleVariant =>
    depth === 2 ? 'normal' : id === course?.id ? 'active' : 'dim'

  const edges: Edge[] = schools.map((s) => ({
    from: 'user',
    to: `school-${s.id}`,
    faint: depth === 0 || (depth >= 2 && s.id !== school?.id),
  }))
  if (depth === 1) {
    for (const s of schools)
      for (const c of s.courses) edges.push({ from: `school-${s.id}`, to: `course-${c.id}`, faint: true })
  }
  if (school && depth >= 2) {
    for (const c of school.courses)
      edges.push({ from: `school-${school.id}`, to: `course-${c.id}`, faint: depth === 3 && c.id !== course?.id })
  }
  if (school && depth === 2) {
    for (const c of school.courses) edges.push({ from: `course-${c.id}`, to: `ghostitems-${c.id}`, faint: true })
  }
  if (course) edges.push({ from: `course-${course.id}`, to: `items-${course.id}` })

  return (
    <LayoutGroup>
      <div ref={containerRef} className="relative flex w-full flex-col items-center">
        <ConnectorLines containerRef={containerRef} nodes={nodes} edges={edges} trigger={pathKey} />

        {/* Level 0: user */}
        <div ref={node('level-0')} className="relative z-10 flex justify-center">
          <Bubble
            id="user"
            nodeRef={node('user')}
            size={SIZE.user}
            variant="active"
            onClick={depth === 1 ? undefined : () => onNavigate(['user'])}
          >
            <span className="max-w-[124px] break-words font-serif text-[26px] font-medium leading-tight">{username}</span>
            <span className="mt-0.5 text-sm opacity-70">{depth === 0 ? 'Tap to open' : `${schools.length} schools`}</span>
          </Bubble>
        </div>

        <AnimatePresence>
          {/* Level 1: schools (ghosts at depth 0) */}
          <Level key="level-1" nodeRef={node('level-1')}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {schools.map((s) => (
                <Bubble
                  key={s.id}
                  id={`school-${s.id}`}
                  nodeRef={node(`school-${s.id}`)}
                  size={SIZE.school}
                  variant={schoolVariant(s.id)}
                  onClick={() => onNavigate(['user', s.id])}
                >
                  <span className="font-serif text-2xl font-medium">{s.name}</span>
                  <span className="text-sm opacity-70">{s.courses.length} courses</span>
                </Bubble>
              ))}
            </div>
          </Level>

          {/* Level 2: courses (ghosts for every school at depth 1) */}
          {depth >= 1 && (
            <Level key="level-2" nodeRef={node('level-2')}>
              {depth === 1 ? (
                <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4">
                  {schools.map((s) => (
                    <div key={s.id} className="flex flex-wrap justify-center gap-3 sm:gap-4">
                      {s.courses.map((c) => (
                        <Bubble key={c.id} id={`course-${c.id}`} nodeRef={node(`course-${c.id}`)} size={SIZE.course} variant="ghost" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                school && (
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {school.courses.map((c) => (
                      <Bubble
                        key={c.id}
                        id={`course-${c.id}`}
                        nodeRef={node(`course-${c.id}`)}
                        size={SIZE.course}
                        variant={courseVariant(c.id)}
                        title={c.subtitle}
                        onClick={() => onNavigate(['user', school.id, c.id])}
                      >
                        <span className="whitespace-nowrap font-serif text-[21px] font-medium tracking-tight">{c.name}</span>
                        <span className="text-sm opacity-70">{c.items.length} items</span>
                      </Bubble>
                    ))}
                  </div>
                )
              )}
            </Level>
          )}

          {/* Level 3: items (ghost bars under each course at depth 2) */}
          {depth >= 2 && school && (
            <Level key="level-3" nodeRef={node('level-3')}>
              {course ? (
                <CourseDetail course={course} nodeRef={node(`items-${course.id}`)} />
              ) : (
                <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-4">
                  {school.courses.map((c) => (
                    <ItemGhosts key={c.id} course={c} nodeRef={node(`ghostitems-${c.id}`)} />
                  ))}
                </div>
              )}
            </Level>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
