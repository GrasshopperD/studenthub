import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface Edge {
  from: string
  to: string
  /** Faint lines lead to ghosts and dimmed siblings. */
  faint?: boolean
}

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  nodes: RefObject<Map<string, HTMLElement>>
  edges: Edge[]
  /** Changes on every navigation so lines re-measure while bubbles animate. */
  trigger: string
}

const GAP = 5 // px between a line end and its bubble
const edgeKey = (e: Edge) => `${e.from}>${e.to}`
const n = (v: number) => v.toFixed(1)

function sameRecord(a: Record<string, string>, b: Record<string, string>) {
  const ka = Object.keys(a)
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k])
}

/** Dashed SVG curves from each parent's bottom to each child's top, measured from the DOM. */
export default function ConnectorLines({ containerRef, nodes, edges, trigger }: Props) {
  const [paths, setPaths] = useState<Record<string, string>>({})
  const edgesRef = useRef(edges)
  edgesRef.current = edges

  const measure = useCallback(() => {
    const box = containerRef.current
    if (!box) return
    const c = box.getBoundingClientRect()
    const next: Record<string, string> = {}
    for (const e of edgesRef.current) {
      const a = nodes.current.get(e.from)
      const b = nodes.current.get(e.to)
      if (!a?.isConnected || !b?.isConnected) continue
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const x1 = ra.left + ra.width / 2 - c.left
      const y1 = ra.bottom - c.top + GAP
      const x2 = rb.left + rb.width / 2 - c.left
      const y2 = rb.top - c.top - GAP
      const ym = (y1 + y2) / 2
      next[edgeKey(e)] = `M${n(x1)},${n(y1)} C${n(x1)},${n(ym)} ${n(x2)},${n(ym)} ${n(x2)},${n(y2)}`
    }
    setPaths((prev) => (sameRecord(prev, next) ? prev : next))
  }, [containerRef, nodes])

  // Re-measure every frame for a short window, so lines track spring/layout animations.
  const until = useRef(0)
  const raf = useRef(0)
  const burst = useCallback(
    (ms: number) => {
      until.current = Math.max(until.current, performance.now() + ms)
      if (raf.current) return
      const tick = () => {
        measure()
        raf.current = performance.now() < until.current ? requestAnimationFrame(tick) : 0
      }
      raf.current = requestAnimationFrame(tick)
    },
    [measure],
  )

  const keys = edges.map(edgeKey).join('|')
  useEffect(() => burst(1500), [keys, trigger, burst])

  useEffect(() => {
    const box = containerRef.current
    const ro = new ResizeObserver(() => burst(400))
    if (box) ro.observe(box)
    const onResize = () => burst(400)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => burst(400))
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [containerRef, burst])

  return (
    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden>
      <AnimatePresence>
        {edges.map((e) => {
          const k = edgeKey(e)
          return paths[k] ? <Connector key={k} id={k} d={paths[k]} faint={!!e.faint} /> : null
        })}
      </AnimatePresence>
    </svg>
  )
}

const draw = {
  hidden: { pathLength: 0, transition: { duration: 0.25, ease: 'easeIn' } },
  shown: { pathLength: 1, transition: { duration: 0.55, ease: 'easeOut', delay: 0.12 } },
} as const

// framer's pathLength uses stroke-dasharray itself, so the draw-in runs on a solid mask
// and the visible line keeps its own 4/6 dash pattern.
function Connector({ id, d, faint }: { id: string; d: string; faint: boolean }) {
  const maskId = `draw-${id.replace(/[^a-zA-Z0-9]/g, '_')}`
  return (
    <motion.g initial="hidden" animate="shown" exit="hidden">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <motion.path d={d} variants={draw} fill="none" stroke="white" strokeWidth={8} />
        </mask>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke="#D97757"
        strokeWidth={1.5}
        strokeDasharray="4 6"
        strokeLinecap="round"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ strokeOpacity: faint ? 0.2 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </motion.g>
  )
}
