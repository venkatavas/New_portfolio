import { useEffect, useRef } from 'react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import './OrbitalStatus.css'

const CX = 100
const CY = 100
const ORBIT_R = 80
const RINGS = [38, 64, 90]
const NODES = [
  { r: 64, angle: 35 },
  { r: 90, angle: 150 },
  { r: 38, angle: 250 },
  { r: 90, angle: 305 },
]

function pointOnCircle(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

/**
 * A quiet callback to the Hero's Request Lifecycle: same node/pulse
 * vocabulary, reshaped into a circular "system at rest" read for the site's
 * final section instead of a linear request/response flow.
 */
export function OrbitalStatus() {
  const reducedMotion = useReducedMotionContext()
  const rootRef = useRef<HTMLDivElement>(null)

  // Entrance only — the rings and nodes already pulse/orbit continuously via
  // CSS/SMIL once visible, so the scroll-triggered part is scoped to the
  // container and the (otherwise static) rings, never the properties those
  // existing loops already own, to avoid two animation systems fighting over
  // the same inline style.
  useEffect(() => {
    if (reducedMotion || !rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.4,
          },
        },
      )
      gsap.fromTo(
        '.orbital__ring',
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.4,
          },
        },
      )
    }, rootRef)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return (
    <div className="orbital" ref={rootRef}>
      <svg viewBox="0 0 200 200" className="orbital__svg" aria-hidden="true">
        <line x1="0" y1={CY} x2="200" y2={CY} className="orbital__axis" />
        <line x1={CX} y1="0" x2={CX} y2="200" className="orbital__axis" />

        {RINGS.map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} className="orbital__ring" />
        ))}

        {NODES.map((node, i) => {
          const { x, y } = pointOnCircle(node.r, node.angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="orbital__node"
              style={reducedMotion ? undefined : { animationDelay: `${i * 0.7}s` }}
            />
          )
        })}

        <circle cx={CX} cy={CY} r="6" className="orbital__center" />

        {!reducedMotion && (
          <circle r="3.5" className="orbital__orbit-point">
            <animateMotion
              dur="18s"
              repeatCount="indefinite"
              path={`M${CX + ORBIT_R},${CY} A${ORBIT_R},${ORBIT_R} 0 1,1 ${CX - ORBIT_R},${CY} A${ORBIT_R},${ORBIT_R} 0 1,1 ${CX + ORBIT_R},${CY}`}
            />
          </circle>
        )}
      </svg>
    </div>
  )
}
