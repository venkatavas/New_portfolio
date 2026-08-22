import { useEffect, useRef, useState } from 'react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Architecture } from '@/data/architecture'
import './ArchitectureViz.css'

interface ArchitectureVizProps {
  architecture: Architecture
  /** Ambient background-art mode for the pinned Hero/Projects sequence:
   *  same nodes/edges/packets, no labels or hover chrome. */
  simplified?: boolean
}

/**
 * Per-project system diagram: nodes are real HTML (crisp text at any zoom),
 * edges are a single SVG overlay sharing the same 0-100 x/y coordinate space
 * as the nodes so the two stay pixel-aligned without measuring anything.
 * Packet dots use SMIL <animateMotion> — simplest way to travel an element
 * along an arbitrary line without a per-edge JS animation loop.
 */
export function ArchitectureViz({ architecture, simplified = false }: ArchitectureVizProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const reducedMotion = useReducedMotionContext()
  const rootRef = useRef<HTMLDivElement>(null)
  // Projects mounts eagerly, off-screen, on initial load (it's the critical
  // path alongside Hero) — without this gate the "assembly" would already be
  // finished before anyone scrolls far enough to see it. True only after the
  // real first scroll-into-view; every project switch after that (click, not
  // scroll) draws immediately since the panel is already on screen.
  const hasBootedRef = useRef(false)

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
      )

      // BOOT: the diagram assembles rather than just fading in — every edge
      // draws from its start node to its end node, staggered, before the
      // ambient marching-dash loop (arch-dash, CSS) takes over. Only in the
      // real Projects panel; the Hero pin's simplified ambient-art mode is
      // untouched. Each <line>'s own length drives its dash values, so this
      // works for every architecture's differently-shaped edges without
      // hardcoding anything.
      if (!simplified) {
        const drawEdges = () => {
          const edges = rootRef.current?.querySelectorAll<SVGLineElement>('.arch-viz__edge') ?? []
          edges.forEach((edge, i) => {
            const length = edge.getTotalLength()
            // The CSS marching-dash loop (arch-dash) runs continuously and
            // unconditionally — a running CSS animation outranks an inline
            // style in the cascade, so it would fight this tween's own
            // stroke-dashoffset writes for control of the same property.
            // Suspended for the length of the draw, restored on completion.
            edge.style.animation = 'none'
            gsap.fromTo(
              edge,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 0.5,
                delay: 0.15 + i * 0.08,
                ease: 'power2.inOut',
                onComplete: () => {
                  edge.style.removeProperty('stroke-dasharray')
                  edge.style.removeProperty('stroke-dashoffset')
                  edge.style.removeProperty('animation')
                },
              },
            )
          })
        }

        if (hasBootedRef.current) {
          drawEdges()
        } else {
          ScrollTrigger.create({
            trigger: rootRef.current,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              hasBootedRef.current = true
              drawEdges()
            },
          })
        }
      }
    }, rootRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [architecture])

  const nodeById = Object.fromEntries(architecture.nodes.map((n) => [n.id, n]))
  const isEdgeActive = (edge: Architecture['edges'][number]) =>
    hoveredId !== null && (edge.from === hoveredId || edge.to === hoveredId)

  return (
    <div
      className={`arch-viz${simplified ? ' arch-viz--simplified' : ''}`}
      ref={rootRef}
      aria-hidden={simplified || undefined}
    >
      <svg
        className="arch-viz__lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {architecture.edges.map((edge) => {
          const from = nodeById[edge.from]
          const to = nodeById[edge.to]
          const active = isEdgeActive(edge)
          const path = `M${from.x},${from.y} L${to.x},${to.y}`
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`arch-viz__edge${active ? ' is-active' : ''}`}
              />
              {!reducedMotion && (
                <circle r="0.7" className={`arch-viz__packet${active ? ' is-active' : ''}`}>
                  <animateMotion
                    dur="2.4s"
                    begin={`${(from.y / 100) * 1.6}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      <div className="arch-viz__nodes">
        {architecture.nodes.map((node) => {
          if (simplified) {
            return (
              <div
                key={node.id}
                className="arch-viz__node arch-viz__node--simple"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              />
            )
          }

          const Icon = node.icon
          return (
            <div
              key={node.id}
              className={`arch-viz__node${hoveredId === node.id ? ' is-hovered' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Icon size={13} className="arch-viz__node-icon" aria-hidden="true" />
              <span className="arch-viz__node-text">
                <span className="arch-viz__node-label">{node.label}</span>
                <span className="arch-viz__node-sublabel">{node.sublabel}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
