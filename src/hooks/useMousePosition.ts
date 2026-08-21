import { useEffect, useRef } from 'react'

/**
 * Tracks pointer position without triggering React re-renders. Always mirrors
 * the position onto `--mouse-x`/`--mouse-y` on the document root (consumed by
 * the CSS-only cursor-reactive background glow); an optional callback runs in
 * the same rAF tick for components that need direct values, e.g. the cursor.
 */
export function useMousePosition(onMove?: (x: number, y: number) => void) {
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const root = document.documentElement

    const tick = () => {
      root.style.setProperty('--mouse-x', `${target.current.x}px`)
      root.style.setProperty('--mouse-y', `${target.current.y}px`)
      onMove?.(target.current.x, target.current.y)
      frame.current = null
    }

    const handlePointerMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      if (frame.current === null) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [onMove])
}
