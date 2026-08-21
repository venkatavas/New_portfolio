import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

// Module-level, shared by every LazyMount instance: ScrollTrigger.refresh()
// synchronously recalculates every registered trigger's position (a real
// layout cost that scales with how many sections/connectors exist), so
// running it once per lazy-mounted section — right as the user scrolls
// into each one — is the exact "stutters after each section" pattern.
// Deferring to requestIdleCallback (rather than requestAnimationFrame,
// which forces it into the very next paint while still actively
// scrolling) lets the browser run it when the main thread actually has
// slack, and the pending-handle guard coalesces several sections mounting
// in quick succession into a single refresh instead of one each.
let refreshIdleHandle: number | null = null
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null

function scheduleRefresh() {
  if (refreshIdleHandle !== null || refreshTimeoutId !== null) return
  const run = () => {
    refreshIdleHandle = null
    refreshTimeoutId = null
    ScrollTrigger.refresh()
  }
  if (typeof requestIdleCallback === 'function') {
    refreshIdleHandle = requestIdleCallback(run, { timeout: 500 })
  } else {
    refreshTimeoutId = setTimeout(run, 200)
  }
}

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
  // content, not synchronously on the same tick. The expensive, cross-
  // trigger recalculation is deferred/coalesced (scheduleRefresh), but
  // Lenis needs to know the document got taller right away — otherwise its
  // own cached scroll limit stays stale for that entire deferral window and
  // scroll reads as capped/stuck partway down (see useLenis.ts).
  useEffect(() => {
    if (!shouldMount) return
    window.dispatchEvent(new Event('app:content-grew'))
    scheduleRefresh()
  }, [shouldMount])

  if (shouldMount) return children
  return <div id={id} ref={anchorRef} aria-hidden="true" />
}
