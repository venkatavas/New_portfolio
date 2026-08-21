import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
  className?: string
}

/** Cursor-magnetic hover wrapper. Self-disables on touch and reduced motion. */
export function MagneticWrapper({ children, strength = 0.3, className }: MagneticWrapperProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isTouch = useIsTouchDevice()
  const reducedMotion = useReducedMotionContext()
  const disabled = isTouch || reducedMotion

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    // Belt-and-suspenders beyond the `disabled` (device-level) guard below:
    // checking the actual pointerType on this specific event is
    // authoritative, where `isTouch` is a heuristic guess that can be wrong
    // on some phones/in-app browsers. Without this, a touch tap could still
    // fire a pointermove that yanks the element toward the touch point
    // right as the user tries to tap it — reported as "ENTER moving aside
    // when I try to click it" on mobile.
    if (disabled || !ref.current || event.pointerType !== 'mouse') return
    const rect = ref.current.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    ref.current.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`
  }

  const handlePointerLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <span
      ref={ref}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        display: 'inline-block',
        transition: disabled ? undefined : 'transform 0.2s var(--ease-out-quart)',
      }}
    >
      {children}
    </span>
  )
}
