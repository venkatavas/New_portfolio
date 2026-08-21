import { useEffect, useRef, useState } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotionContext } from './ReducedMotionProvider'
import './CustomCursor.css'

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'

export function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotionContext()
  const disabled = isTouch || reducedMotion

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)

  useMousePosition(
    disabled
      ? undefined
      : (x, y) => {
          target.current = { x, y }
          setHasMoved(true)
          if (dotRef.current) {
            dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
          }
        },
  )

  useEffect(() => {
    if (disabled) return

    let frame: number
    const loop = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18
      ring.current.y += (target.current.y - ring.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [disabled])

  useEffect(() => {
    if (disabled) return

    document.body.classList.add('has-custom-cursor')

    const handleOver = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR)
      setIsActive(Boolean(el))
    }
    document.addEventListener('mouseover', handleOver)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      document.removeEventListener('mouseover', handleOver)
    }
  }, [disabled])

  if (disabled) return null

  return (
    <>
      <div ref={dotRef} className={`cursor-dot${hasMoved ? ' is-visible' : ''}`} aria-hidden="true" />
      <div
        ref={ringRef}
        className={`cursor-ring${hasMoved ? ' is-visible' : ''}${isActive ? ' is-active' : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
