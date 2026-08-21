import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ReducedMotionContext = createContext(false)

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    document.documentElement.toggleAttribute('data-reduced-motion', reduced)
  }, [reduced])

  return <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>
}

export function useReducedMotionContext(): boolean {
  return useContext(ReducedMotionContext)
}
