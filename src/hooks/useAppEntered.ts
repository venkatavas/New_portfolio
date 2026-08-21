import { useEffect, useState } from 'react'

// Module-level so a component that mounts AFTER the preloader has already
// been dismissed (e.g. HeroProjectsPin replacing Hero.tsx on a breakpoint
// crossing) picks up the entered state immediately instead of waiting for
// an event that only ever fires once.
let hasEnteredGlobally = false

/** True once the preloader's ENTER control has been activated. */
export function useAppEntered(): boolean {
  const [entered, setEntered] = useState(hasEnteredGlobally)

  useEffect(() => {
    if (hasEnteredGlobally) return
    const handleEnter = () => {
      hasEnteredGlobally = true
      setEntered(true)
    }
    window.addEventListener('app:entered', handleEnter)
    return () => window.removeEventListener('app:entered', handleEnter)
  }, [])

  return entered
}
