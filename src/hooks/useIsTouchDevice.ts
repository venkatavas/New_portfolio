import { useEffect, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

/**
 * True when the user is on a touch-primary device. Starts from the static
 * `pointer: fine` media query (correct for the vast majority of devices),
 * but self-corrects from real pointer events: many hybrid touch+mouse
 * Windows laptops report a coarse "primary" pointer via CSS media features
 * even while a mouse is actively being used, which would otherwise disable
 * the custom cursor/magnetic interactions for a real mouse user.
 */
export function useIsTouchDevice(): boolean {
  const staticGuess = !useMediaQuery('(pointer: fine) and (hover: hover)')
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
