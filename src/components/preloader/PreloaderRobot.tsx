import { type RefObject } from 'react'
import './PreloaderRobot.css'

export interface PreloaderRobotRefs {
  root: RefObject<HTMLDivElement | null>
  head: RefObject<SVGGElement | null>
  eye: RefObject<SVGCircleElement | null>
  upperArm: RefObject<SVGGElement | null>
  forearm: RefObject<SVGGElement | null>
  legL: RefObject<SVGGElement | null>
  legR: RefObject<SVGGElement | null>
}

/**
 * A flat, geometric silhouette — deliberately not the rendered/cartoon robot
 * from the moodboard. Reads as a small autonomous agent rather than a
 * mascot: one status light for a face, two-segment articulated legs and a
 * two-segment reaching arm (shoulder + elbow joints), no walk-cycle bounce.
 * Thin off-white outline (--color-fg-muted) on a dark metallic body fill —
 * needs the lighter stroke here specifically, since border-strong (used
 * elsewhere for line-art) reads as nearly invisible at the robot's small
 * on-screen size against the near-black backdrop.
 */
export function PreloaderRobot({ refs }: { refs: PreloaderRobotRefs }) {
  return (
    <div className="preloader-robot" ref={refs.root} aria-hidden="true">
      <svg viewBox="0 0 80 112" width="100%" height="100%" fill="none">
        {/* legs — two segments each, opposite-phase micro-rotation during the walk */}
        <g ref={refs.legL}>
          <rect x="26" y="80" width="8" height="16" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <circle cx="30" cy="96" r="2.5" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <rect x="26" y="96" width="8" height="13" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
        </g>
        <g ref={refs.legR}>
          <rect x="46" y="80" width="8" height="16" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <circle cx="50" cy="96" r="2.5" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <rect x="46" y="96" width="8" height="13" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
        </g>

        {/* torso */}
        <rect x="18" y="38" width="44" height="44" rx="9" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
        <line x1="25" y1="53" x2="55" y2="53" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="25" y1="67" x2="55" y2="67" stroke="var(--color-border)" strokeWidth="1" />

        {/* left arm (static) */}
        <g>
          <rect x="12" y="44" width="7" height="22" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
        </g>

        {/* right arm — the one that reaches, two segments. Rotation pivots
            are set via GSAP's svgOrigin (Preloader.tsx), not CSS
            transform-origin — pixel-based transform-origin on a nested SVG
            <g> resolves against that element's own local bounding box, not
            the SVG's coordinate space, so the arm would rotate around the
            wrong point and never actually reach the ENTER node. */}
        <g ref={refs.upperArm}>
          <rect x="58" y="46" width="7" height="22" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <g ref={refs.forearm}>
            <circle cx="61" cy="68" r="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
            <rect x="58" y="68" width="7" height="20" rx="3" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
            <circle cx="61" cy="90" r="4" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          </g>
        </g>

        {/* head */}
        <g ref={refs.head}>
          <line x1="40" y1="2" x2="40" y2="7" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <rect x="34" y="30" width="12" height="8" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <circle cx="40" cy="19" r="15" fill="var(--color-bg-elevated-2)" stroke="var(--color-fg-muted)" strokeWidth="1.5" />
          <circle ref={refs.eye} cx="40" cy="19" r="4" fill="var(--color-accent)" opacity="0.28" />
        </g>
      </svg>
    </div>
  )
}
