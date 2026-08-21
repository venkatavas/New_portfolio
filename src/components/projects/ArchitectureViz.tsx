import { useEffect, useRef, useState } from 'react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap } from '@/lib/gsap'
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

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
      )
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
