import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotionContext } from './ReducedMotionProvider'
import './ScrollProgress.css'

/**
 * A thin fixed rail down the left edge that fills with the accent color as
 * the page scrolls — a single connective spine tying every section into one
 * continuous journey instead of a stack of isolated blocks.
 */
export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotionContext()

  useEffect(() => {
    if (!fillRef.current || reducedMotion) return

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.set(fillRef.current, { scaleY: self.progress })
      },
    })

    return () => trigger.kill()
  }, [reducedMotion])

  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-rail__fill" ref={fillRef} />
    </div>
  )
}
