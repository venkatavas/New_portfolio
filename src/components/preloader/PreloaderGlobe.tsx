import { type RefObject } from 'react'
import './PreloaderGlobe.css'

export interface PreloaderGlobeRefs {
  root: RefObject<HTMLDivElement | null>
  rings: RefObject<SVGGElement | null>
  wireframe: RefObject<SVGGElement | null>
  spin: RefObject<SVGGElement | null>
  pulse: RefObject<SVGCircleElement | null>
}

// Deterministic sunflower-spiral dot field, clipped to the sphere's radius —
// a symbolic dotted globe, not an attempt at real geography.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
// Kept modest deliberately — this is on the critical-path bundle and
// mounts eagerly (invisible but still laid out) even before ENTER is
// clicked. A denser field measurably increased Style & Layout cost on
// initial page load without a proportional visual gain.
const DOT_COUNT = 64
const SPHERE_R = 48
const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => {
  const r = SPHERE_R * Math.sqrt(i / DOT_COUNT)
  const theta = i * GOLDEN_ANGLE
  return { x: 70 + r * Math.cos(theta), y: 70 + r * Math.sin(theta) * 0.94 }
})

// A handful of abstract landmass silhouettes — soft, irregular blobs
// suggesting continents in the wireframe without claiming to be an
// accurate map. Purely symbolic, same as the dot field.
const LANDMASSES = [
  'M 46 55 Q 40 48 48 42 Q 58 38 64 44 Q 70 48 66 56 Q 60 62 52 60 Q 46 60 46 55 Z',
  'M 78 40 Q 88 36 96 42 Q 100 50 94 56 Q 86 58 80 52 Q 76 46 78 40 Z',
  'M 50 82 Q 44 90 50 98 Q 58 104 64 96 Q 66 88 60 84 Q 54 80 50 82 Z',
  'M 84 78 Q 94 76 98 84 Q 96 92 88 92 Q 82 88 84 78 Z',
]

/**
 * A minimal wireframe/dotted Earth — symbolic of "locating the profile,"
 * not a literal globe. Pure SVG, same brass/line-art palette as the rest of
 * the preloader. Motion: a slow ambient rotation of the dot field, a
 * two-part "materialize" (rings → wireframe → dots, driven by the master
 * timeline) at the earth-formation beat, and a one-shot brass pulse at the
 * "location found" beat.
 */
export function PreloaderGlobe({ refs }: { refs: PreloaderGlobeRefs }) {
  return (
    <div className="preloader-globe" ref={refs.root} aria-hidden="true">
      <svg viewBox="0 0 140 140" width="100%" height="100%" fill="none">
        <g ref={refs.rings}>
          <ellipse cx="70" cy="70" rx="66" ry="20" stroke="var(--color-border-strong)" strokeWidth="1" transform="rotate(-14 70 70)" />
          <ellipse cx="70" cy="70" rx="56" ry="14" stroke="var(--color-border)" strokeWidth="1" transform="rotate(-14 70 70)" opacity="0.6" />
        </g>
        <circle cx="70" cy="70" r={SPHERE_R} fill="var(--color-bg-elevated)" fillOpacity="0.5" stroke="var(--color-border-strong)" strokeWidth="1" />
        <g ref={refs.wireframe}>
          <ellipse cx="70" cy="70" rx={SPHERE_R} ry="15" stroke="var(--color-border)" strokeWidth="1" />
          <ellipse cx="70" cy="70" rx={SPHERE_R} ry="30" stroke="var(--color-border)" strokeWidth="1" />
          <ellipse cx="70" cy="70" rx={SPHERE_R} ry="44" stroke="var(--color-border)" strokeWidth="1" />
          <ellipse cx="70" cy="70" rx="15" ry={SPHERE_R} stroke="var(--color-border)" strokeWidth="1" />
          <ellipse cx="70" cy="70" rx="30" ry={SPHERE_R} stroke="var(--color-border)" strokeWidth="1" />
          {LANDMASSES.map((d, i) => (
            <path key={i} d={d} fill="var(--color-fg-muted)" fillOpacity="0.16" stroke="var(--color-fg-muted)" strokeOpacity="0.3" strokeWidth="0.75" />
          ))}
        </g>
        <g ref={refs.spin}>
          {DOTS.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r="0.85" fill="var(--color-fg-muted)" />
          ))}
        </g>
        <circle ref={refs.pulse} cx="56" cy="58" r="3" fill="var(--color-accent)" opacity="0" />
      </svg>
    </div>
  )
}
