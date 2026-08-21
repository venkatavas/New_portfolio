import type { ReactNode } from 'react'
import { useLenis } from '@/hooks/useLenis'
import { useReducedMotionContext } from './ReducedMotionProvider'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotionContext()

  useLenis(reducedMotion)

  return <>{children}</>
}
