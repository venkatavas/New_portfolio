import { useEffect, useRef } from 'react'
import { HeroInterface } from '@/components/hero/HeroInterface'
import { gsap } from '@/lib/gsap'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { useAppEntered } from '@/hooks/useAppEntered'
import './Hero.css'

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotionContext()
  const entered = useAppEntered()

  useEffect(() => {
    if (!containerRef.current || reducedMotion || !entered) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('[data-hero-panel]', { opacity: 1, y: 0, duration: 0.7 })
        .to('[data-hero-name]', { opacity: 1, y: 0, duration: 0.9 }, '-=0.35')
        .to('[data-hero-identity]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('[data-hero-module]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to('[data-hero-scroll]', { opacity: 1, duration: 0.6 }, '-=0.2')
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion, entered])

  return (
    <section id="hero" className="hero" ref={containerRef}>
      <HeroInterface />
    </section>
  )
}
