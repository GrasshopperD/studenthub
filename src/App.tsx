import { useState } from 'react'
import BubbleTree from './components/BubbleTree'
import BackButton from './components/BackButton'
import Breadcrumb from './components/Breadcrumb'
import { schools } from './data/courses'

// Navigation state lives here as a path array:
// [] (big user bubble) | ['user'] | ['user', 'waterloo'] | ['user', 'waterloo', 'math137']
export type Path = string[]

export default function App() {
  const [username, setUsername] = useState<string | null>(null)
  const [path, setPath] = useState<Path>([])

  const push = (id: string) => setPath((p) => [...p, id])
  const back = () => setPath((p) => p.slice(0, -1))
  const jumpTo = (depth: number) => setPath((p) => p.slice(0, depth))

  const labelFor = (id: string, i: number): string => {
    if (i === 0) return username ?? 'User'
    if (i === 1) return schools.find((s) => s.id === id)?.name ?? id
    return schools.flatMap((s) => s.courses).find((c) => c.id === id)?.name ?? id
  }

  const crumbs =
    path.length === 0
      ? [{ label: username ?? 'User', depth: 0 }]
      : path.map((id, i) => ({ label: labelFor(id, i), depth: i + 1 }))

  return (
    <div className="flex min-h-full flex-col px-4 py-4 sm:px-8">
      <header className="flex flex-wrap items-center gap-3">
        <BackButton disabled={!username || path.length === 0} onClick={back} />
        {username && <Breadcrumb crumbs={crumbs} current={path.length} onJump={jumpTo} />}
        <span className="ml-auto text-sm font-semibold tracking-tight text-muted">
          Student<span className="text-claude">Hub</span>
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center py-6">
        <BubbleTree username={username} path={path} onLogin={setUsername} onSelect={push} />
      </main>
    </div>
  )
}
