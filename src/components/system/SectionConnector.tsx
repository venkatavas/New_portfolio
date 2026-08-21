import { useEffect, useRef } from 'react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import './SectionConnector.css'

/**
 * The connective tissue between sections: a short line grows, a node
 * appears at each end, and a small packet travels the line — literally the
 * site's NODE / CONNECTION / FLOW language, scrubbed directly to scroll
 * position rather than looping on its own. Reused identically between every
 * section pair rather than bespoke per-gap, on purpose — one quiet, exact
 * repetition reads as a signature; five different transition ideas would
 * read as five separate decorations.
 */
export function SectionConnector() {
  const reducedMotion = useReducedMotionContext()
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const topNodeRef = useRef<HTMLSpanElement>(null)
  const bottomNodeRef = useRef<HTMLSpanElement>(null)
  const packetRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleY: 0 })
      gsap.set([topNodeRef.current, bottomNodeRef.current], { opacity: 0, scale: 0.4 })
      gsap.set(packetRef.current, { opacity: 0, top: '0%' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 88%',
            end: 'bottom 60%',
            scrub: 0.4,
          },
        })
        .to(topNodeRef.current, { opacity: 1, scale: 1, duration: 0.15 }, 0)
        .to(lineRef.current, { scaleY: 1, duration: 0.7 }, 0.05)
        .to(packetRef.current, { opacity: 1, duration: 0.1 }, 0.1)
        .to(packetRef.current, { top: '100%', duration: 0.75, ease: 'none' }, 0.1)
        .to(packetRef.current, { opacity: 0, duration: 0.1 }, 0.75)
        .to(bottomNodeRef.current, { opacity: 1, scale: 1, duration: 0.15 }, 0.72)
    }, rootRef)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return (
    <div className="section-connector" ref={rootRef} aria-hidden="true">
      <div className="section-connector__line" ref={lineRef} />
      <span className="section-connector__packet" ref={packetRef} />
      <span className="section-connector__node section-connector__node--top" ref={topNodeRef} />
      <span
        className="section-connector__node section-connector__node--bottom"
        ref={bottomNodeRef}
      />
    </div>
  )
}
