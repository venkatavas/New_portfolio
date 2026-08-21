import { useEffect, useRef, useState } from 'react'
import { MagneticWrapper } from '@/components/primitives/MagneticWrapper'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap } from '@/lib/gsap'
import { projects } from '@/data/content'
import { links } from '@/data/links'
import './Preloader.css'

const PROJECT_COUNT = String(projects.length).padStart(2, '0')

/**
 * The site's opening gate: not a loading screen (Hero is already mounted
 * underneath, ready), but a deliberate "enter the system" moment. Activating
 * ENTER transforms this into the Hero rather than a plain crossfade — see
 * handleEnter. Dispatches `app:entered` on window so Hero.tsx and
 * HeroProjectsPin.tsx know when to start their own entrance timelines
 * (useAppEntered).
 */
export function Preloader() {
  const reducedMotion = useReducedMotionContext()
  const [isExiting, setIsExiting] = useState(false)
  const [isGone, setIsGone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLButtonElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = isGone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isGone])

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    }, rootRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isGone) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      handleEnter()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGone, isExiting])

  const handleEnter = () => {
    if (isExiting) return
    setIsExiting(true)

    if (reducedMotion) {
      window.dispatchEvent(new Event('app:entered'))
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => setIsGone(true),
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => setIsGone(true) })
        .addLabel('start')
        .to(enterRef.current, { scale: 1.1, duration: 0.14, ease: 'power2.out' }, 'start')
        .to(
          enterRef.current,
          {
            scale: 1,
            duration: 0.14,
            ease: 'power2.in',
            boxShadow: '0 0 0 1px var(--color-accent), 0 0 32px 4px var(--color-accent-soft)',
          },
          'start+=0.14',
        )
        .to(
          '[data-preloader-meta]',
          { opacity: 0, y: -10, duration: 0.45, stagger: 0.03 },
          'start+=0.05',
        )
        .addLabel('expand', 'start+=0.28')
        .to(enterRef.current, { scale: 48, opacity: 0, duration: 1, ease: 'power2.in' }, 'expand')
        .to(
          backdropRef.current,
          { clipPath: 'circle(0% at 50% 50%)', duration: 0.95, ease: 'power2.inOut' },
          'expand+=0.08',
        )
        .call(() => window.dispatchEvent(new Event('app:entered')), undefined, 'expand+=0.15')
    }, rootRef)

    return () => ctx.revert()
  }

  if (isGone) return null

  return (
    <div className={`preloader${isExiting ? ' is-exiting' : ''}`} ref={rootRef}>
      <div className="preloader__backdrop" ref={backdropRef} aria-hidden="true" />

      <div className="preloader__content">
        <span className="preloader__ready" data-preloader-meta>
          Ready
        </span>

        <div className="preloader__bottom-row">
          <div className="preloader__corner preloader__corner--identity" data-preloader-meta>
            <span>{links.name}</span>
            <span>Software Engineer</span>
          </div>

          <div className="preloader__corner preloader__corner--overview" data-preloader-meta>
            <span>Overview:</span>
            <span>{PROJECT_COUNT} Projects</span>
          </div>

          <div className="preloader__corner preloader__corner--version" data-preloader-meta>
            <span>V-001</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>

        <MagneticWrapper strength={0.25} className="preloader__enter-wrapper">
          <button
            type="button"
            className="preloader__enter"
            ref={enterRef}
            onClick={handleEnter}
            disabled={isExiting}
            data-cursor="hover"
            aria-label="Enter the site"
          >
            <span className="preloader__enter-label">Enter</span>
            <span className="preloader__enter-label preloader__enter-label--hover" aria-hidden="true">
              Initialize
            </span>
          </button>
        </MagneticWrapper>
      </div>
    </div>
  )
}
