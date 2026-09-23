import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { spring } from './Bubble'

export default function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) onLogin(name.trim())
  }

  return (
    <motion.div
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={spring}
      whileHover={open ? undefined : { scale: 1.05 }}
      onClick={() => !open && setOpen(true)}
      className={`flex h-64 w-64 flex-col items-center justify-center rounded-full border border-border bg-surface p-6 text-center shadow-2xl shadow-black/40 sm:h-80 sm:w-80 ${
        open ? '' : 'cursor-pointer hover:border-claude hover:shadow-[0_0_50px_-10px_rgba(217,119,87,0.6)]'
      }`}
    >
      {open ? (
        <form onSubmit={submit} className="flex w-full flex-col items-center gap-3">
          <p className="text-sm text-muted">Welcome to StudentHub</p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className="w-44 rounded-full border border-border bg-bg px-4 py-2 text-center text-sm text-ink outline-none placeholder:text-muted focus:border-claude"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-full bg-claude px-6 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
          >
            Sign in
          </button>
        </form>
      ) : (
        <>
          <span className="text-3xl font-semibold">Sign in</span>
          <span className="mt-2 text-sm text-muted">to see all your courses</span>
        </>
      )}
    </motion.div>
  )
}
