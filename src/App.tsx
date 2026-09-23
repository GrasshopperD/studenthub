import { useEffect, useState } from 'react'
import BubbleTree from './components/BubbleTree'
import BackButton from './components/BackButton'
import Breadcrumb from './components/Breadcrumb'
import Login from './components/Login'
import { schools } from './data/courses'
import { capitalizeName } from './lib/format'

// Navigation state lives here as a path array:
// [] (user bubble) | ['user'] | ['user', 'waterloo'] | ['user', 'waterloo', 'math137']
export type Path = string[]

export default function App() {
  const [username, setUsername] = useState<string | null>(null)
  const [path, setPath] = useState<Path>([])

  const login = (name: string) => {
    setUsername(capitalizeName(name))
    setPath([])
  }

  // One level up; at the root, back returns to the sign-in bubble.
  const back = () => {
    if (path.length > 0) setPath((p) => p.slice(0, -1))
    else setUsername(null)
  }

  useEffect(() => {
    if (!username) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPath((p) => (p.length ? p.slice(0, -1) : p))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [username])

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
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-bg/75 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-6">
          {username && <BackButton onClick={back} />}
          {username && (
            <div className="order-3 w-full sm:order-2 sm:w-auto">
              <Breadcrumb crumbs={crumbs} current={path.length} onJump={(d) => setPath((p) => p.slice(0, d))} />
            </div>
          )}
          <span className="order-2 ml-auto flex h-11 items-center font-serif text-xl font-semibold tracking-tight sm:order-3">
            Student<span className="text-claude">Hub</span>
          </span>
        </div>
      </header>

      {username ? (
        <main className="mx-auto w-full max-w-[900px] px-4 pb-[35vh] pt-[132px] sm:pt-[100px]">
          <BubbleTree username={username} path={path} onNavigate={setPath} />
        </main>
      ) : (
        <main className="flex min-h-screen items-center justify-center px-4">
          <Login onLogin={login} />
        </main>
      )}
    </div>
  )
}
