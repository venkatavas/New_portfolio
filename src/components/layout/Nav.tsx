import { useEffect, useRef, useState } from 'react'
import { X, Menu, Mail, FileDown } from 'lucide-react'
import { MagneticWrapper } from '@/components/primitives/MagneticWrapper'
import { GithubIcon, LinkedinIcon } from '@/components/primitives/BrandIcons'
import { useAppEntered } from '@/hooks/useAppEntered'
import { links } from '@/data/links'
import './Nav.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]

const OBSERVED_IDS = NAV_ITEMS.map((item) => item.id)

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('')
  const lastScrollY = useRef(0)
  const entered = useAppEntered()

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 40)
      setIsHidden(y > lastScrollY.current && y > 160)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Several sections below the fold now mount lazily (LazyMount, App.tsx),
  // so they don't exist yet when this effect first runs. A MutationObserver
  // picks up each one as it actually appears in the DOM instead of only
  // ever finding whatever happened to be mounted at Nav's own mount time.
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    // Tracked by node, not id: a lazily-mounted section's id briefly
    // belongs to a placeholder div (see LazyMount) before the real section
    // replaces it. Tracking by id would mark that id "already observed" and
    // never look again once the placeholder is swapped for the real node.
    const observedElements = new WeakSet<Element>()
    const observeAvailableSections = () => {
      OBSERVED_IDS.forEach((id) => {
        const section = document.getElementById(id)
        if (section && !observedElements.has(section)) {
          intersectionObserver.observe(section)
          observedElements.add(section)
        }
      })
    }

    observeAvailableSections()

    const mutationObserver = new MutationObserver(observeAvailableSections)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <nav
        className={`nav${isScrolled ? ' is-scrolled' : ''}${isHidden ? ' is-hidden' : ''}${entered ? ' is-entered' : ''}`}
      >
        <a href="#hero" className="nav__mark" data-cursor="hover">
          venkata<span>.</span>vas
        </a>

        <div className="nav__center">
          <div className="nav__links nav__pill">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav__link${activeId === item.id ? ' is-active' : ''}`}
                data-cursor="hover"
              >
                {item.label}
                {activeId === item.id && <span className="nav__link-dot" aria-hidden="true" />}
              </a>
            ))}
          </div>

          <div className="nav__actions nav__pill">
            <MagneticWrapper strength={0.4}>
              <a
                className="nav__icon"
                href={links.github.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                data-cursor="hover"
              >
                <GithubIcon size={15} />
              </a>
            </MagneticWrapper>
            <MagneticWrapper strength={0.4}>
              <a
                className="nav__icon"
                href={links.linkedin.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                data-cursor="hover"
              >
                <LinkedinIcon size={15} />
              </a>
            </MagneticWrapper>
            <MagneticWrapper strength={0.4}>
              <a
                className="nav__icon"
                href={`mailto:${links.email}`}
                aria-label="Email"
                data-cursor="hover"
              >
                <Mail size={15} />
              </a>
            </MagneticWrapper>
            <MagneticWrapper strength={0.4}>
              <a
                className="nav__icon"
                href={links.resumePdf.url}
                download
                aria-label="Download resume"
                data-cursor="hover"
              >
                <FileDown size={15} />
              </a>
            </MagneticWrapper>
          </div>
        </div>

        <button
          type="button"
          className="nav__toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          data-cursor="hover"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isOpen && (
        <div className="nav__overlay" role="dialog" aria-modal="true">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__overlay-link${activeId === item.id ? ' is-active' : ''}`}
              onClick={() => setIsOpen(false)}
              data-cursor="hover"
            >
              {item.label}
            </a>
          ))}
          <div className="nav__overlay-icons">
            <a href={links.github.url} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
              <GithubIcon size={18} />
            </a>
            <a
              href={links.linkedin.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a href={`mailto:${links.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
            <a href={links.resumePdf.url} download aria-label="Download resume">
              <FileDown size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
