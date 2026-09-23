import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { spring } from './Bubble'

export default function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim()) onLogin(name)
  }

  return (
    // Shares layoutId with the user bubble, so signing in morphs it into the tree root.
    <motion.div
      layoutId="user"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
      whileHover={open ? undefined : { scale: 1.04 }}
      onClick={() => !open && setOpen(true)}
      className={`flex h-64 w-64 flex-col items-center justify-center rounded-full border border-border bg-surface p-6 text-center shadow-2xl shadow-black/40 sm:h-72 sm:w-72 ${
        open ? '' : 'cursor-pointer hover:border-claude hover:shadow-[0_0_50px_-10px_rgba(217,119,87,0.6)]'
      }`}
    >
      {open ? (
        <form onSubmit={submit} className="flex w-full flex-col items-center gap-3">
          <p className="font-serif text-[22px] font-medium">Welcome</p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className="w-48 rounded-full border border-border bg-bg px-4 py-2.5 text-center text-[15px] text-ink outline-none placeholder:text-muted focus:border-claude"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="h-10 rounded-full bg-claude px-6 text-[15px] font-bold text-[#1f1e1d] transition hover:brightness-110 disabled:opacity-40"
          >
            Sign In
          </button>
        </form>
      ) : (
        <>
          <span className="font-serif text-[28px] font-medium">Sign In</span>
          <span className="mt-1.5 text-sm text-muted">to see all your courses</span>
        </>
      )}
    </motion.div>
  )
}
