import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

interface LazyMountProps {
  children: ReactNode
  /** Same id as the section this wraps. In-page links (`href="#about"`,
   *  Nav's own scroll-spy) need something to resolve to and observe even
   *  before the real section exists — carrying the id on the placeholder
   *  means `#about` is always a valid, jumpable target, and jumping to it
   *  is itself what brings the real section within the reveal margin. */
  id: string
  /** How far below the viewport to start mounting — generous on purpose,
   *  so the section is fully mounted and settled well before it's ever
   *  actually visible; scrolling should never reveal a pop-in. */
  rootMargin?: string
}

/**
 * Defers mounting a below-the-fold section until the user is getting close
 * to it, instead of every section's GSAP/ScrollTrigger setup (and the
 * getBoundingClientRect calls that come with it) firing simultaneously on
 * initial load. Not virtualization — once mounted, a section stays mounted.
 * Combined with React.lazy() at the call site, this also keeps that
 * section's JS chunk out of the critical path entirely.
 */
export function LazyMount({ children, id, rootMargin = '800px 0px' }: LazyMountProps) {
  const [shouldMount, setShouldMount] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldMount || !anchorRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldMount(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(anchorRef.current)
    return () => observer.disconnect()
  }, [shouldMount, rootMargin])

  // Every SectionConnector (and any section that mounted earlier) computed
  // its ScrollTrigger positions against a shorter document than this one
  // just became — refresh once the browser has actually laid out the new
  // content, not synchronously on the same tick.
  useEffect(() => {
    if (!shouldMount) return
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(raf)
  }, [shouldMount])

  if (shouldMount) return children
  return <div id={id} ref={anchorRef} aria-hidden="true" />
}
