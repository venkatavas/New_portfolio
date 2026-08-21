import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/** Wires Lenis smooth scroll into the GSAP ticker so ScrollTrigger stays in sync. */
export function useLenis(disabled: boolean) {
  useEffect(() => {
    if (disabled) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Lenis measures the scrollable height itself and caches it separately
    // from ScrollTrigger — lazily-mounted sections (LazyMount) grow the page
    // well after Lenis's initial measurement, and calling
    // ScrollTrigger.refresh() alone doesn't tell Lenis to re-measure. Without
    // this, Lenis keeps clamping scroll at its stale, pre-growth height,
    // which reads as the page getting permanently stuck partway down.
    const handleRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', handleRefresh)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      ScrollTrigger.removeEventListener('refresh', handleRefresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [disabled])
}
