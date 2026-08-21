import { Check } from 'lucide-react'
import { type RefObject } from 'react'
import { links } from '@/data/links'
import './PreloaderScanPanel.css'

export interface PreloaderScanPanelRefs {
  root: RefObject<HTMLDivElement | null>
  scanning: RefObject<HTMLDivElement | null>
  found: RefObject<HTMLDivElement | null>
  access: RefObject<HTMLDivElement | null>
  scanBarFill: RefObject<HTMLSpanElement | null>
  scanPercent: RefObject<HTMLSpanElement | null>
  scanline: RefObject<HTMLSpanElement | null>
}

// Real section names from the site's own nav, not invented database/server
// labels — this is a visual metaphor for "reading the portfolio," not a
// fake backend.
const SCAN_TARGETS = ['Profile', 'Projects', 'Experience', 'Tech Stack']

/**
 * Three stacked, cross-faded states driven entirely by Preloader's master
 * timeline (this component owns no animation logic of its own). Each
 * letter of the name renders as its own span so the timeline can scatter
 * and reconstruct it (the "profile reconstruction" beat) without a canvas
 * or particle library. The database list and progress percentage are
 * explicitly decorative visual metaphor, not real system telemetry — no
 * fabricated latency, IDs, or server counts.
 */
export function PreloaderScanPanel({ refs }: { refs: PreloaderScanPanelRefs }) {
  return (
    <div className="scan-panel" ref={refs.root} aria-hidden="true">
      <div className="scan-panel__state" ref={refs.scanning}>
        <span className="scan-panel__label">Scanning profile…</span>
        <ul className="scan-panel__list">
          {SCAN_TARGETS.map((target) => (
            <li key={target}>{target}</li>
          ))}
        </ul>
        <div className="scan-panel__bar">
          <span className="scan-panel__bar-fill" ref={refs.scanBarFill} />
        </div>
        <span className="scan-panel__percent" ref={refs.scanPercent}>
          0%
        </span>
        <span className="scan-panel__scanline" ref={refs.scanline} />
      </div>

      <div className="scan-panel__state" ref={refs.found}>
        <span className="scan-panel__label scan-panel__label--accent">
          Profile found <Check size={13} strokeWidth={2.5} />
        </span>
        <span className="scan-panel__name">
          {links.name.split(' ').map((word, wi) => (
            <span className="scan-panel__word" key={wi}>
              {word.split('').map((letter, li) => (
                <span className="scan-panel__letter" key={li}>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </span>
        <span className="scan-panel__role">Software Engineer</span>
        <span className="scan-panel__status">
          Status: <em>Available</em>
        </span>
      </div>

      <div className="scan-panel__state" ref={refs.access}>
        <span className="scan-panel__label scan-panel__label--accent">
          Access granted <Check size={13} strokeWidth={2.5} />
        </span>
        <span className="scan-panel__welcome">Welcome, {links.name}</span>
      </div>
    </div>
  )
}
