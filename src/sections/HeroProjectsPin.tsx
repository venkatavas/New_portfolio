import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Tag } from '@/components/primitives/Tag'
import { ArchitectureViz } from '@/components/projects/ArchitectureViz'
import { HeroInterface } from '@/components/hero/HeroInterface'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useAppEntered } from '@/hooks/useAppEntered'
import { projects } from '@/data/content'
import { architectures } from '@/data/architecture'
import { links } from '@/data/links'
import './HeroProjectsPin.css'

/** One wipe direction per project so each transition reads distinct, not repeated. */
const WIPES: Array<{ from: string; to: string }> = [
  { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
  { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
  { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
]

/**
 * Hero and Projects pinned into a single continuous GSAP-scrubbed sequence:
 * the hero exits, each project wipes in, holds, then wipes into the next.
 * Only mounted when HeroProjectsShowcase has already confirmed desktop +
 * fine pointer + motion allowed.
 */
export function HeroProjectsPin() {
  const pinRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<Array<HTMLDivElement | null>>([])
  const artRefs = useRef<Array<HTMLDivElement | null>>([])
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([])

  const [activeStep, setActiveStep] = useState(-1)
  const entered = useAppEntered()

  // Kinetic entrance, gated on the preloader's ENTER activation instead of
  // firing on mount — order matches the composition top-to-bottom: top
  // panels, then the name materializes, then identity row, then lower
  // modules, then the scroll indicator.
  useEffect(() => {
    if (!heroContentRef.current || !entered) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('[data-hero-panel]', { opacity: 1, y: 0, duration: 0.7 })
        .to('[data-hero-name]', { opacity: 1, y: 0, duration: 0.9 }, '-=0.35')
        .to('[data-hero-identity]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('[data-hero-module]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to('[data-hero-scroll]', { opacity: 1, duration: 0.6 }, '-=0.2')
    }, heroContentRef)

    return () => ctx.revert()
  }, [entered])

  useEffect(() => {
    if (!pinRef.current) return

    const activeStepRef = { current: -1 }

    const bodyChildren = (index: number) => {
      const el = bodyRefs.current[index]
      return el ? Array.from(el.children) : []
    }

    const ctx = gsap.context(() => {
      gsap.set(projectRefs.current, { autoAlpha: 0 })
      artRefs.current.forEach((art, i) => {
        if (art) gsap.set(art, { clipPath: WIPES[i].from })
      })

      // Shared by onUpdate/onEnterBack/onEnter so a big jump (not just an
      // incremental scroll) always lands on the step that actually matches
      // wherever the user ended up, not a hardcoded guess.
      const syncStepToProgress = (progress: number) => {
        const total = tl.duration()
        // "Active" labels sit where each project's text has actually
        // landed, not where the transition starts — the indicator should
        // flip once that project is readable, not the instant the previous
        // one begins fading.
        const p1 = (tl.labels.p1Active ?? 0) / total
        const p2 = (tl.labels.p2Active ?? 0) / total
        const p3 = (tl.labels.p3Active ?? 0) / total
        let step = -1
        if (progress >= p3) step = 2
        else if (progress >= p2) step = 1
        else if (progress >= p1) step = 0
        if (activeStepRef.current !== step) {
          activeStepRef.current = step
          setActiveStep(step)
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          // Gated on self.isActive: with scrub enabled, the tween keeps
          // smoothly "catching up" to the real scroll position for a
          // moment even after scrolling past the trigger's end — onUpdate
          // keeps firing during that catch-up, racing with onLeave below.
          // Without this guard, a late onUpdate (still reporting
          // progress≈1 from the catch-up) would call syncStepToProgress
          // AFTER onLeave already reset to -1, re-setting a real step and
          // permanently un-hiding the progress readout for the rest of the
          // page — confirmed via real scroll input, not a synthetic-test
          // artifact.
          onUpdate: (self) => {
            if (self.isActive) syncStepToProgress(self.progress)
          },
          onLeave: () => {
            activeStepRef.current = -1
            setActiveStep(-1)
          },
          onEnterBack: (self) => syncStepToProgress(self.progress),
          onEnter: (self) => syncStepToProgress(self.progress),
        },
        defaults: { ease: 'power2.inOut' },
      })

      // Reusable recipe for "exit whichever layer is showing, wipe the next
      // project's art in, then bring its text in" — text only starts
      // appearing once the outgoing layer is nearly fully faded, so the two
      // are never both legible at once.
      const enterProject = (label: string, outgoing: HTMLElement | null, index: number) => {
        tl.addLabel(label)
        if (outgoing) {
          tl.to(outgoing, { autoAlpha: 0, scale: 0.96, duration: 0.85 }, label)
        }
        tl.to(artRefs.current[index], { clipPath: WIPES[index].to, duration: 1.15 }, `${label}+=0.15`)
          .fromTo(
            projectRefs.current[index],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4 },
            `${label}+=0.7`,
          )
          .fromTo(
            bodyChildren(index),
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.05 },
            `${label}+=0.8`,
          )
          .addLabel(`${label}Active`, `${label}+=1.4`)
        tl.to({}, { duration: 0.8 }) // hold, unpositioned: appended after the above
      }

      tl.to({}, { duration: 0.6 }) // hero hold

      // Very slight scroll-linked reflective drift on the name's metallic
      // band, layered on top of its own idle shimmer — scrubbed directly to
      // scroll position since it runs inside the master timeline.
      const nameBase = heroContentRef.current?.querySelector('.hi__name-base')
      if (nameBase) {
        tl.to(nameBase, { backgroundPosition: '65% 50%', duration: 0.6, ease: 'none' }, 0)
      }

      enterProject('p1', heroContentRef.current, 0)
      enterProject('p2', projectRefs.current[0], 1)
      enterProject('p3', projectRefs.current[1], 2)

      tl.to(projectRefs.current[2], { autoAlpha: 0, y: -24, duration: 0.6 }) // release
    }, pinRef)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <div id="hero" className="hpp" ref={pinRef}>
      <div className="hpp__stage">
        <div className="hpp__layer hpp__hero">
          <HeroInterface rootRef={heroContentRef} />
        </div>

        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="hpp__layer hpp__project"
            ref={(el) => {
              projectRefs.current[index] = el
            }}
          >
            <div
              className="hpp__project-art"
              ref={(el) => {
                artRefs.current[index] = el
              }}
            >
              <ArchitectureViz architecture={architectures[project.slug]} simplified />
            </div>

            <div
              className="hpp__project-body"
              ref={(el) => {
                bodyRefs.current[index] = el
              }}
            >
              <h2 className="hpp__project-title">{project.title}</h2>
              <p className="hpp__project-summary">{project.summary}</p>
              <ul className="hpp__project-points">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="hpp__project-stack">
                {project.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
              <a
                className="hpp__project-link"
                href={links.github.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                aria-label={`View ${project.title} on GitHub`}
              >
                View on GitHub
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className={`hpp__progress${activeStep >= 0 ? ' is-visible' : ''}`} aria-hidden="true">
        <span className="hpp__progress-label">
          <span>{String(activeStep + 1).padStart(2, '0')}</span> /{' '}
          {String(projects.length).padStart(2, '0')}
        </span>
        <div className="hpp__progress-ticks">
          {projects.map((project, index) => (
            <span
              key={project.slug}
              className={`hpp__progress-tick${activeStep === index ? ' is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
