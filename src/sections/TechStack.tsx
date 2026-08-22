import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Box, Brain, BarChart3, Clapperboard, type LucideIcon } from 'lucide-react'
import { RevealText } from '@/components/primitives/RevealText'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { stackCategories, type SkillItem } from '@/data/stack'
import { projects, experience } from '@/data/content'
import './TechStack.css'

const PROJECT_ICONS: Record<string, LucideIcon> = {
  'ai-support-assistant': Brain,
  'governance-analytics-platform': BarChart3,
  'movie-review-system': Clapperboard,
}

const ALL_ITEMS = stackCategories.flatMap((category) => category.items)
const ITEM_BY_NAME = new Map<string, SkillItem>(ALL_ITEMS.map((item) => [item.name, item]))

// "These are the tools behind the work I just saw" — derived directly from
// the real experience stacks (content.ts), not invented. One known naming
// difference ('React' in experience data vs 'React.js' in the stack index)
// is normalized; everything else must match a real stack item verbatim.
const NAME_ALIASES: Record<string, string> = { React: 'React.js' }
const PREVIEW_NAMES = new Set(
  experience
    .flatMap((entry) => entry.stack)
    .map((name) => NAME_ALIASES[name] ?? name)
    .filter((name) => ITEM_BY_NAME.has(name)),
)

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export function TechStack() {
  const reducedMotion = useReducedMotionContext()
  const isTouch = useIsTouchDevice()
  const [activeName, setActiveName] = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => new Set([stackCategories[0].label]))
  const [lines, setLines] = useState<Line[]>([])
  const [previewActive, setPreviewActive] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())

  // Continuity from Experience: as Stack's own network arrives, the real
  // technologies used in the just-viewed experience quietly light up once —
  // not a hover state, just a lasting acknowledgment that settles in place.
  useEffect(() => {
    if (PREVIEW_NAMES.size === 0) return
    if (reducedMotion) {
      // No scroll-linked movement, but the underlying acknowledgment is
      // real content, not decoration — show it immediately instead of
      // dropping it.
      setPreviewActive(true)
      return
    }
    if (!sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => setPreviewActive(true),
    })
    return () => trigger.kill()
  }, [reducedMotion])

  // BOOT: the whole graph powers on left to right the first time it's
  // scrolled into view — each category column staggered slightly after the
  // last, each item within a column staggered slightly after the one
  // before it — instead of the categories just being there when you arrive.
  // Independent of the preview-callback effect above (that one only fires
  // if PREVIEW_NAMES exists; this one always should).
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const categories = sectionRef.current?.querySelectorAll<HTMLElement>('.stack__category') ?? []
        categories.forEach((category, ci) => {
          const items = category.querySelectorAll<HTMLElement>('.stack__item')
          gsap.fromTo(
            items,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.035,
              delay: ci * 0.09,
              // The existing hover interaction dims items via a CSS class
              // (.is-dimmed, opacity: 0.4) — an inline opacity left behind
              // by this tween would permanently outrank that class after
              // boot finishes, so hand the property back to CSS once done.
              clearProps: 'opacity,transform',
            },
          )
        })
      },
    })
    return () => trigger.kill()
  }, [reducedMotion])

  const activeItem = activeName ? (ITEM_BY_NAME.get(activeName) ?? null) : null

  const connectedNames = useMemo(() => {
    if (!activeItem?.connections) return new Set<string>()
    return new Set(activeItem.connections.filter((name) => ITEM_BY_NAME.has(name)))
  }, [activeItem])

  const activeProjectSlugs = useMemo(() => new Set(activeItem?.projects ?? []), [activeItem])

  useLayoutEffect(() => {
    if (reducedMotion || !activeName || !mapRef.current || connectedNames.size === 0) {
      setLines([])
      return
    }
    const containerRect = mapRef.current.getBoundingClientRect()
    const fromEl = nodeRefs.current.get(activeName)
    if (!fromEl) {
      setLines([])
      return
    }
    const fromRect = fromEl.getBoundingClientRect()
    const fromX = fromRect.left + fromRect.width / 2 - containerRect.left
    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top

    const nextLines: Line[] = []
    connectedNames.forEach((name) => {
      const toEl = nodeRefs.current.get(name)
      if (!toEl) return
      const toRect = toEl.getBoundingClientRect()
      nextLines.push({
        x1: fromX,
        y1: fromY,
        x2: toRect.left + toRect.width / 2 - containerRect.left,
        y2: toRect.top + toRect.height / 2 - containerRect.top,
      })
    })
    setLines(nextLines)
  }, [activeName, connectedNames, reducedMotion])

  const activate = (name: string) => setActiveName(name)
  const deactivate = () => setActiveName(null)
  const toggleTouch = (name: string) => setActiveName((current) => (current === name ? null : name))

  const toggleCategory = (label: string) => {
    setOpenCategories((current) => {
      const next = new Set(current)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <section id="stack" className="section container stack" ref={sectionRef}>
      <div className="stack__body">
        <aside className="stack__intro">
          <span className="eyebrow stack__index">04</span>
          <RevealText as="h2" className="stack__title">
            Stack
          </RevealText>
          <span className="stack__subheading">Technical index</span>
          <p className="stack__description">
            The technologies, tools and platforms I use to build reliable, scalable and useful
            systems.
            <span className="stack__description-dot" aria-hidden="true" />
          </p>

          <div className="stack__legend">
            <span className="stack__legend-title">Legend</span>
            <span className="stack__legend-row">
              <span className="stack__dot stack__dot--primary" aria-hidden="true" />
              Primary technology
            </span>
            <span className="stack__legend-row">
              <span className="stack__dot stack__dot--used" aria-hidden="true" />
              Used in project
            </span>
            <span className="stack__legend-row">
              <span className="stack__dot stack__dot--supporting" aria-hidden="true" />
              Supporting technology
            </span>
          </div>
        </aside>

        <div className="stack__map" ref={mapRef}>
          {lines.length > 0 && (
            <svg className="stack__connectors" aria-hidden="true">
              {lines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className="stack__connector-line"
                />
              ))}
            </svg>
          )}

          <div className="stack__categories">
            {stackCategories.map((category) => {
              const isOpen = openCategories.has(category.label)
              const CategoryIcon = category.icon
              return (
                <div
                  className={`stack__category${isOpen ? ' is-open' : ''}`}
                  key={category.label}
                >
                  <button
                    type="button"
                    className="stack__category-head"
                    onClick={() => toggleCategory(category.label)}
                    aria-expanded={isOpen}
                    aria-controls={`stack-cat-${category.label}`}
                    data-cursor="hover"
                  >
                    <CategoryIcon size={17} aria-hidden="true" className="stack__category-icon" />
                    <span className="stack__category-index">{category.index}</span>
                    <span className="stack__category-label">{category.label}</span>
                  </button>

                  <ul className="stack__items" id={`stack-cat-${category.label}`}>
                    {category.items.map((item) => {
                      const isActive = activeName === item.name
                      const isConnected = connectedNames.has(item.name)
                      const isDimmed = activeName !== null && !isActive && !isConnected
                      const isPreview = previewActive && PREVIEW_NAMES.has(item.name)
                      const showTouchDetail = isTouch && isActive

                      return (
                        <li key={item.name}>
                          <button
                            type="button"
                            ref={(el) => {
                              if (el) nodeRefs.current.set(item.name, el)
                              else nodeRefs.current.delete(item.name)
                            }}
                            className={`stack__item stack__item--${item.tier}${isActive ? ' is-active' : ''}${isConnected ? ' is-connected' : ''}${isDimmed ? ' is-dimmed' : ''}${isPreview ? ' is-preview' : ''}`}
                            onMouseEnter={() => !isTouch && activate(item.name)}
                            onMouseLeave={() => !isTouch && deactivate()}
                            onFocus={() => activate(item.name)}
                            onBlur={deactivate}
                            onClick={() => isTouch && toggleTouch(item.name)}
                            data-cursor="hover"
                          >
                            <span className="stack__item-name">{item.name}</span>
                            <span className="stack__item-dot" aria-hidden="true" />
                          </button>

                          {showTouchDetail && (
                            <div className="stack__item-detail">
                              {item.projects.length > 0 && (
                                <p>
                                  Used in{' '}
                                  {item.projects
                                    .map(
                                      (slug) => projects.find((p) => p.slug === slug)?.title ?? '',
                                    )
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                              {item.connections && item.connections.length > 0 && (
                                <p>Pairs with {item.connections.join(', ')}</p>
                              )}
                              {item.projects.length === 0 &&
                                (!item.connections || item.connections.length === 0) && (
                                  <p>Supporting technology.</p>
                                )}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>

          <p className="stack__hint">
            <Box size={14} aria-hidden="true" />
            <span className="stack__hint-desktop">
              Hover a technology to see how it connects across projects and experience.
            </span>
            <span className="stack__hint-mobile">Tap a technology to explore connections.</span>
          </p>
        </div>

        <aside className="stack__projects">
          <span className="eyebrow">Where I use them</span>
          <ul className="stack__project-list">
            {projects.map((project) => {
              const Icon = PROJECT_ICONS[project.slug]
              const isHighlighted = activeProjectSlugs.has(project.slug)
              return (
                <li
                  key={project.slug}
                  className={`stack__project${isHighlighted ? ' is-active' : ''}`}
                >
                  <span className="stack__project-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="stack__project-text">
                    <span className="stack__project-title">{project.title}</span>
                    <span className="stack__project-tag">Primary stack</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <a href="#projects" className="stack__project-link" data-cursor="hover">
            View all projects
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>
  )
}
