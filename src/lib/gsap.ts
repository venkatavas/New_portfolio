import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registered eagerly at module load (not inside a component effect) since
// React fires child effects before parent effects — a component using
// ScrollTrigger can otherwise mount before a provider-based registration runs.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
