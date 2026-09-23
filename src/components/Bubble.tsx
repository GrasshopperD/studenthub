import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const spring = { type: 'spring', stiffness: 260, damping: 22 } as const

interface Props {
  size?: number
  active?: boolean
  onClick?: () => void
  children: ReactNode
  /** Offset in px the bubble animates in from. */
  from?: { x?: number; y?: number }
  delay?: number
  label?: string
}

export default function Bubble({ size = 140, active, onClick, children, from, delay = 0, label }: Props) {
  const clickable = !!onClick
  return (
    <motion.button
      type="button"
      layout
      aria-label={label}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0, x: from?.x ?? 0, y: from?.y ?? 0 }}
      animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }}
      transition={{ ...spring, delay }}
      whileHover={clickable ? { scale: 1.08 } : undefined}
      whileTap={clickable ? { scale: 0.95 } : undefined}
      style={{ width: size, height: size }}
      className={[
        'flex shrink-0 flex-col items-center justify-center rounded-full border p-3 text-center font-semibold outline-none',
        clickable ? 'cursor-pointer' : 'cursor-default',
        active
          ? 'border-claude bg-claude text-white shadow-[0_0_40px_-6px_rgba(217,119,87,0.6)]'
          : 'border-border bg-surface text-ink shadow-lg shadow-black/30 hover:border-claude hover:shadow-[0_0_28px_-8px_rgba(217,119,87,0.6)] focus-visible:border-claude',
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}
