import { useEffect, useRef } from 'react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import './SectionConnector.css'

interface SectionConnectorProps {
  /** 'converge' fans two extra lines in from the sides into the same bottom
   *  node — reserved for the two moments in the page that are actually
   *  about many things settling into one (Stack's dense graph quieting into
   *  Education's single Foundation node; that Foundation becoming Contact's
   *  final connection), not used as a generic decoration. */
  variant?: 'default' | 'converge'
}

/**
 * The connective tissue between sections: a short line grows, a node
 * appears at each end, and a small packet travels the line — literally the
 * site's NODE / CONNECTION / FLOW language, scrubbed directly to scroll
 * position rather than looping on its own. Reused identically between every
 * section pair rather than bespoke per-gap, on purpose — one quiet, exact
 * repetition reads as a signature; five different transition ideas would
 * read as five separate decorations. The packet's travel speed responds to
 * how fast the visitor is actually scrolling (ScrollTrigger's own
 * self.getVelocity(), no extra library) — the one place on the page scroll
 * speed becomes a visible input, not just a progress value.
 */
export function SectionConnector({ variant = 'default' }: SectionConnectorProps) {
  const reducedMotion = useReducedMotionContext()
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const fanRefs = useRef<Array<HTMLDivElement | null>>([])
  const topNodeRef = useRef<HTMLSpanElement>(null)
  const bottomNodeRef = useRef<HTMLSpanElement>(null)
  const packetRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return

    const ctx = gsap.context(() => {
      const growLines = [lineRef.current, ...fanRefs.current].filter(Boolean)
      // Fan lines carry their own permanent rotation as a GSAP-tracked
      // property (not raw CSS transform) specifically so the scaleY tween
      // below composites onto it instead of overwriting it — GSAP owns the
      // whole transform once any property on an element is set through it.
      if (fanRefs.current[0]) gsap.set(fanRefs.current[0], { rotation: -20, transformOrigin: 'bottom center' })
      if (fanRefs.current[1]) gsap.set(fanRefs.current[1], { rotation: 20, transformOrigin: 'bottom center' })
      gsap.set(growLines, { scaleY: 0 })
      gsap.set([topNodeRef.current, bottomNodeRef.current], { opacity: 0, scale: 0.4 })
      gsap.set(packetRef.current, { opacity: 0, top: '0%' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 88%',
            end: 'bottom 60%',
            scrub: 0.4,
            // Faster scroll -> the packet chases harder (shorter duration,
            // sharper ease); slow/idle scroll -> it eases like the rest of
            // the timeline. Clamped so a violent flick can't make it feel
            // broken, and reduced-motion never reaches this branch at all.
            onUpdate: (self) => {
              const speed = Math.min(Math.abs(self.getVelocity()) / 1400, 1)
              packetRef.current?.style.setProperty('--packet-speed', String(0.4 + speed * 0.6))
            },
          },
        })
        .to(topNodeRef.current, { opacity: 1, scale: 1, duration: 0.15 }, 0)
        .to(growLines, { scaleY: 1, duration: 0.7 }, 0.05)
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
    <div
      className={`section-connector${variant === 'converge' ? ' section-connector--converge' : ''}`}
      ref={rootRef}
      aria-hidden="true"
    >
      <div className="section-connector__line" ref={lineRef} />
      {variant === 'converge' && (
        <>
          <div
            className="section-connector__fan section-connector__fan--left"
            ref={(el) => {
              fanRefs.current[0] = el
            }}
          />
          <div
            className="section-connector__fan section-connector__fan--right"
            ref={(el) => {
              fanRefs.current[1] = el
            }}
          />
        </>
      )}
      <span className="section-connector__packet" ref={packetRef} />
      <span className="section-connector__node section-connector__node--top" ref={topNodeRef} />
      <span
        className="section-connector__node section-connector__node--bottom"
        ref={bottomNodeRef}
      />
    </div>
  )
}
