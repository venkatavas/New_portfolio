// Shared Motion (Framer Motion) variants/transitions, kept in step with the
// GSAP easing tokens in tokens.css so the whole site reads as one motion system.

export const easeOutExpo = [0.16, 1, 0.3, 1] as const
export const easeOutQuart = [0.25, 1, 0.5, 1] as const

export const durations = {
  fast: 0.22,
  base: 0.48,
  slow: 0.8,
}

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easeOutExpo },
  },
}

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easeOutQuart } },
}

export const staggerChildren = (stagger = 0.08) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  },
})

export const viewportOnce = { once: true, margin: '-15% 0px -15% 0px' } as const
