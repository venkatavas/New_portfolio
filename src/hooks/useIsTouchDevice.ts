import { useEffect, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

/**
 * True when the user is on a touch-primary device. Starts from the static
 * `pointer: fine` media query (correct for the vast majority of devices),
 * OR'd with real hardware touch capability (`navigator.maxTouchPoints`),
 * then self-corrects from real pointer events: many hybrid touch+mouse
 * Windows laptops report a coarse "primary" pointer via CSS media features
 * even while a mouse is actively being used, which would otherwise disable
 * the custom cursor/magnetic interactions for a real mouse user.
 *
 * The maxTouchPoints check specifically covers a mobile browser's "Request
 * Desktop Site" mode, which reports `pointer: fine` on a real touchscreen
 * phone (to make sites render as if on desktop) — the pointer/hover media
 * features alone would misdetect that as a non-touch device. That once let
 * HeroProjectsShowcase mount its desktop-pinned, 560vh scroll-scrubbed
 * choreography on an actual phone: a huge blank scroll gap, and every
 * downstream ScrollTrigger (including every SectionConnector) miscalculated
 * against that inflated document height. navigator.maxTouchPoints reflects
 * real hardware, not layout emulation, so it isn't fooled by that spoofing.
 */
export function useIsTouchDevice(): boolean {
  const mediaGuess = !useMediaQuery('(pointer: fine) and (hover: hover)')
  const hasTouchHardware = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0
  const staticGuess = mediaGuess || hasTouchHardware
  const [observed, setObserved] = useState<boolean | null>(null)

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        setObserved(false)
      } else if (event.pointerType === 'touch') {
        setObserved(true)
      }
    }
    window.addEventListener('pointerdown', handlePointer, { passive: true })
    window.addEventListener('pointermove', handlePointer, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', handlePointer)
      window.removeEventListener('pointermove', handlePointer)
    }
  }, [])

  return observed ?? staticGuess
}
