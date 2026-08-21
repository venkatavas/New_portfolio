import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { Hero } from './Hero'
import { Projects } from './Projects'
import { HeroProjectsPin } from './HeroProjectsPin'

/**
 * The pinned Hero-to-Projects choreography (desktop, fine pointer, motion
 * allowed, tall enough) is a cinematic teaser that previews each project as
 * the hero exits; the real Projects section (selector + architecture
 * diagrams) always follows it, for every device. Elsewhere, HeroProjectsPin
 * is swapped for a plain static Hero instead. The modular hero composition
 * is dense enough that it needs real vertical room to fit inside the pin's
 * fixed 100vh stage without clipping, hence the height check.
 */
export function HeroProjectsShowcase() {
  const isWide = useMediaQuery('(min-width: 1024px)')
  const isTall = useMediaQuery('(min-height: 760px)')
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotionContext()

  const choreographed = isWide && isTall && !isTouch && !reducedMotion

  return (
    <>
      {choreographed ? <HeroProjectsPin /> : <Hero />}
      <Projects />
    </>
  )
}
