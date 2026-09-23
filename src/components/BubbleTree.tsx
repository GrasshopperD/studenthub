import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { schools } from '../data/courses'
import type { Path } from '../App'
import Bubble from './Bubble'
import Login from './Login'
import CourseDetail from './CourseDetail'

interface Props {
  username: string | null
  path: Path
  onLogin: (name: string) => void
  onSelect: (id: string) => void
}

export default function BubbleTree({ username, path, onLogin, onSelect }: Props) {
  const school = schools.find((s) => s.id === path[1])
  const course = school?.courses.find((c) => c.id === path[2])

  if (!username) {
    return (
      <AnimatePresence mode="wait">
        <Login key="login" onLogin={onLogin} />
      </AnimatePresence>
    )
  }

  // depth 0: big user bubble, 1: schools, 2: courses, 3: course items
  const depth = path.length

  return (
    <LayoutGroup>
      <div className="flex w-full flex-col items-center gap-8">
        {/* Active parent bubble: shrinks as we go deeper */}
        <AnimatePresence mode="popLayout">
          {depth === 0 && (
            <Bubble key="user-big" size={260} active onClick={() => onSelect('user')} label={username}>
              <span className="break-all text-2xl">{username}</span>
              <span className="mt-1 text-xs font-normal opacity-80">Tap to open</span>
            </Bubble>
          )}
          {depth === 1 && (
            <Bubble key="user-small" size={110} active label={username}>
              <span className="break-all text-base">{username}</span>
            </Bubble>
          )}
          {depth === 2 && school && (
            <Bubble key={`school-${school.id}`} size={110} active label={school.name}>
              <span className="text-base">{school.name}</span>
            </Bubble>
          )}
          {depth === 3 && course && (
            <Bubble key={`course-${course.id}`} size={120} active label={course.name}>
              <span className="text-lg">{course.name}</span>
              <span className="mt-0.5 text-[10px] font-normal leading-tight opacity-85">{course.subtitle}</span>
            </Bubble>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {depth === 1 && (
            <motion.div key="schools" className="flex flex-wrap justify-center gap-6" exit={{ opacity: 0 }}>
              {schools.map((s, i) => (
                <Bubble key={s.id} size={150} from={{ y: -120 }} delay={i * 0.08} onClick={() => onSelect(s.id)}>
                  <span className="text-xl">{s.name}</span>
                  <span className="mt-1 text-xs font-normal text-muted">{s.courses.length} courses</span>
                </Bubble>
              ))}
            </motion.div>
          )}

          {depth === 2 && school && (
            <motion.div key={`courses-${school.id}`} className="flex flex-wrap justify-center gap-5" exit={{ opacity: 0 }}>
              {school.courses.map((c, i) => (
                <Bubble key={c.id} size={140} from={{ y: -120 }} delay={i * 0.08} onClick={() => onSelect(c.id)}>
                  <span className="text-lg">{c.name}</span>
                  <span className="mt-1 text-[11px] font-normal leading-tight text-muted">{c.subtitle}</span>
                </Bubble>
              ))}
            </motion.div>
          )}

          {depth === 3 && course && (
            <motion.div key={`detail-${course.id}`} className="flex w-full justify-center" exit={{ opacity: 0 }}>
              <CourseDetail course={course} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
