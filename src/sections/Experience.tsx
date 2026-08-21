import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import { Tag } from '@/components/primitives/Tag'
import { RevealText } from '@/components/primitives/RevealText'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { experience } from '@/data/content'
import { links } from '@/data/links'
import './Experience.css'

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotionContext()
  const listRef = useRef<HTMLDivElement>(null)

  // The timeline line draws in as the section arrives, continuing the
  // connector's line-growth motif directly into an element that already
  // existed — no new visual system, just a scroll-scrubbed reveal of it.
  useEffect(() => {
    if (reducedMotion || !listRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        listRef.current,
        { '--xp-line-progress': 0 },
        {
          '--xp-line-progress': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.4,
          },
        },
      )
    }, listRef)
    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return (
    <section id="experience" className="section container experience">
      <header className="experience__header">
        <div className="experience__title-row">
          <span className="eyebrow experience__index">03</span>
          <a
            className="experience__resume-link"
            href={links.resumePdf.url}
            download
            data-cursor="hover"
          >
            View full resume
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="experience__heading-row">
          <RevealText as="h2" className="experience__title">
            Experience
          </RevealText>
          <p className="experience__description">
            My professional journey so far.
            <span className="experience__description-dot" aria-hidden="true" />
          </p>
        </div>
      </header>

      <div className="experience__list" ref={listRef}>
        {experience.map((entry, i) => {
          const isActive = i === activeIndex
          const panelId = `xp-panel-${i}`
          return (
            <div className={`xp__row${isActive ? ' is-active' : ''}`} key={entry.org}>
              <div className="xp__marker" aria-hidden="true">
                <span className="xp__marker-dot" />
              </div>

              <div className="xp__body">
                <h3 className="xp__heading">
                  <button
                    type="button"
                    className="xp__trigger"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(i)}
                    data-cursor="hover"
                  >
                    <span className="xp__number">{String(i + 1).padStart(2, '0')}</span>

                    <span className="xp__meta">
                      <span className="xp__role">{entry.role}</span>
                      <span className="xp__org-row">
                        <span className="xp__org">{entry.org}</span>
                        <span className="xp__period">{entry.period}</span>
                      </span>
                    </span>

                    <span className="xp__tags">
                      {entry.stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </span>

                    <span className="xp__chevron">
                      <ChevronDown size={16} aria-hidden="true" />
                    </span>
                  </button>
                </h3>

                {isActive && (
                  <div className="xp__panel" id={panelId}>
                    <ul className="xp__points">
                      {entry.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
