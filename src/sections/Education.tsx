import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { GraduationCap, Star, ChevronRight } from 'lucide-react'
import { RevealText } from '@/components/primitives/RevealText'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { fadeUp, viewportOnce } from '@/lib/motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { education, leadership } from '@/data/content'
import './Education.css'

export function Education() {
  const reducedMotion = useReducedMotionContext()
  const connectorRef = useRef<HTMLDivElement>(null)
  const cardMotionProps = reducedMotion
    ? {}
    : { initial: 'hidden', whileInView: 'visible', viewport: viewportOnce, variants: fadeUp }

  // The "Foundation" connector draws in as the section arrives — Stack's
  // network collapsing into this single grounded node, per the scroll
  // continuity pass. Desktop/tablet only: the connector itself is already
  // hidden below 800px via CSS, so there's nothing to animate on mobile.
  useEffect(() => {
    if (reducedMotion || !connectorRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.education__connector-line',
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: connectorRef.current,
            start: 'top 90%',
            end: 'bottom 70%',
            scrub: 0.4,
          },
        },
      )
      gsap.fromTo(
        '.education__connector-node',
        { opacity: 0, scale: 0.4, transformOrigin: 'center' },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: connectorRef.current,
            start: 'top 90%',
            end: 'bottom 70%',
            scrub: 0.4,
          },
        },
      )
    }, connectorRef)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return (
    <section id="education" className="section container education">
      <header className="education__header">
        <span className="eyebrow education__index">04</span>
        <div className="education__heading-row">
          <RevealText as="h2" className="education__title">
            Education
          </RevealText>
          <p className="education__description">
            Academic foundation and leadership.
            <span className="education__description-dot" aria-hidden="true" />
          </p>
        </div>
      </header>

      <div className="education__connector" aria-hidden="true" ref={connectorRef}>
        <span className="education__connector-label">Foundation</span>
        <svg viewBox="0 0 200 44" className="education__connector-svg" preserveAspectRatio="none">
          <circle cx="100" cy="6" r="3" className="education__connector-node" />
          <line x1="100" y1="9" x2="100" y2="22" className="education__connector-line" />
          <line x1="100" y1="22" x2="50" y2="40" className="education__connector-line" />
          <line x1="100" y1="22" x2="150" y2="40" className="education__connector-line" />
          <circle cx="50" cy="40" r="2.5" className="education__connector-node" />
          <circle cx="150" cy="40" r="2.5" className="education__connector-node" />
        </svg>
      </div>

      <div className="education__grid">
        <motion.div className="education__card" {...cardMotionProps}>
          <div className="education__icon" aria-hidden="true">
            <GraduationCap size={20} />
          </div>
          <div className="education__card-body">
            <h3 className="education__school">{education.school}</h3>
            <p className="education__degree">{education.degree}</p>
            <div className="education__meta">
              <span>{education.period}</span>
              <span>{education.detail}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="education__card" {...cardMotionProps}>
          <div className="education__icon" aria-hidden="true">
            <Star size={20} />
          </div>
          <div className="education__card-body">
            <span className="eyebrow education__card-label">Leadership &amp; activities</span>
            <ul className="education__leadership">
              {leadership.map((item) => (
                <li key={item}>
                  <ChevronRight size={12} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
