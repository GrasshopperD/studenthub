import { motion } from 'framer-motion'
import type { ReactNode, Ref } from 'react'

export const spring = { type: 'spring', stiffness: 300, damping: 28 } as const

/**
 * active: on the current path (Claude orange)
 * normal: the level you're choosing from right now
 * dim:    a sibling in an already visited level, still clickable to switch branch
 * ghost:  skeleton teaser of the next level, no text
 */
export type BubbleVariant = 'active' | 'normal' | 'dim' | 'ghost'

interface Props {
  /** Also the layoutId, so a ghost morphs into the real bubble with the same id. */
  id: string
  size: number
  variant: BubbleVariant
  nodeRef?: Ref<HTMLElement>
  onClick?: () => void
  title?: string
  children?: ReactNode
}

const base =
  'flex shrink-0 flex-col items-center justify-center rounded-full border text-center outline-none transition-colors duration-300'

const styles: Record<BubbleVariant, string> = {
  active: 'border-claude bg-claude text-[#1f1e1d] shadow-[0_0_36px_-6px_rgba(217,119,87,0.55)]',
  normal:
    'border-border bg-surface text-ink shadow-lg shadow-black/30 hover:border-claude hover:shadow-[0_0_28px_-8px_rgba(217,119,87,0.6)]',
  dim: 'border-dashed border-[#4d4c47] bg-bg text-ink/40 hover:border-claude/60 hover:text-ink/75',
  ghost: 'shimmer border-dashed border-white/12',
}

export default function Bubble({ id, size, variant, nodeRef, onClick, title, children }: Props) {
  if (variant === 'ghost') {
    return (
      <motion.div
        ref={nodeRef as Ref<HTMLDivElement>}
        layoutId={id}
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        style={{ width: size, height: size }}
        className={`${base} ${styles.ghost}`}
      />
    )
  }

  return (
    <motion.button
      ref={nodeRef as Ref<HTMLButtonElement>}
      type="button"
      layoutId={id}
      title={title}
      onClick={onClick}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={spring}
      whileHover={onClick ? { scale: 1.06 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      style={{ width: size, height: size }}
      className={`${base} ${styles[variant]} ${onClick ? 'cursor-pointer' : 'cursor-default'} focus-visible:ring-2 focus-visible:ring-claude/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
    >
      {children}
    </motion.button>
  )
}
