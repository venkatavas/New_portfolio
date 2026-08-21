import { ArrowRight } from 'lucide-react'
import { Tag } from '@/components/primitives/Tag'
import { LiveClock } from './LiveClock'
import { SystemFlowViz } from './SystemFlowViz'
import './HeroInterface.css'

const NAME_LINE = 'PARSHA VENKATA VAS'

// A tighter restatement for this dense module — the full summary lives in
// the About section; this one just needs to fit one identity-row line.
const IDENTITY_DESCRIPTION =
  'Backend-focused engineer building Python and Java systems, APIs, and full-stack applications.'

const FILE_TREE = [
  { depth: 0, name: '/src' },
  { depth: 1, name: 'api/' },
  { depth: 1, name: 'services/' },
  { depth: 0, name: 'README.md' },
]

// A representative slice of the verified stack (src/data/content.ts), not
// the full list — this module is a compact preview, not the Stack section.
const FEATURED_STACK = ['Python', 'Java', 'Spring Boot', 'REST APIs', 'React.js', 'MongoDB']

interface HeroInterfaceProps {
  /** heroContentRef in HeroProjectsPin needs a single root node to animate as one unit on exit. */
  rootRef?: React.Ref<HTMLDivElement>
}

export function HeroInterface({ rootRef }: HeroInterfaceProps) {
  return (
    <div className="hi" ref={rootRef}>
      <div className="hi__panels" data-hero-panel>
        <div className="hi__panel hi__panel--status">
          <span className="eyebrow">System status</span>
          <span className="hi__status">
            <span className="hi__status-dot" aria-hidden="true" />
            Available
          </span>
          <div className="hi__status-tags">
            <span>Backend</span>
            <span>API</span>
            <span>Full Stack</span>
          </div>
        </div>

        <div className="hi__panel hi__panel--positioning">
          <p className="hi__positioning">
            Building <span className="hi__accent-word">reliable</span> backend systems, clean
            APIs, and full-stack applications that <span className="hi__accent-word">hold</span>.
          </p>
        </div>

        <div className="hi__panel hi__panel--files">
          <span className="eyebrow">Files</span>
          <ul className="hi__file-tree">
            {FILE_TREE.map((entry, i) => (
              <li
                key={entry.name}
                className={`hi__file-row${entry.depth ? ' hi__file-row--nested' : ''}${i === 1 ? ' is-active' : ''}`}
              >
                {entry.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h1 className="hi__name" data-hero-name aria-label={NAME_LINE}>
        <span className="hi__name-base" aria-hidden="true">
          {NAME_LINE}
        </span>
        <span className="hi__name-sweep" aria-hidden="true">
          {NAME_LINE}
        </span>
      </h1>

      <div className="hi__identity" data-hero-identity>
        <div className="hi__identity-col">
          <span className="eyebrow">Local time</span>
          <div className="hi__clock-row">
            <LiveClock />
            <span className="hi__tz">IST</span>
          </div>
        </div>

        <p className="hi__identity-desc">{IDENTITY_DESCRIPTION}</p>

        <div className="hi__identity-col hi__identity-col--right">
          <span className="hi__role">Software Engineer</span>
          <span className="hi__availability">Open to opportunities</span>
        </div>
      </div>

      <div className="hi__modules" data-hero-module>
        <div className="hi__panel hi__module--about">
          <span className="eyebrow">/about.me</span>
          <p>
            I build systems that are reliable, maintainable, and useful, from APIs and backend
            services to full-stack applications.
          </p>
          <a href="#about" className="hi__module-link" data-cursor="hover">
            Read more <ArrowRight size={12} aria-hidden="true" />
          </a>
        </div>

        <div className="hi__panel hi__module--flow">
          <span className="eyebrow">Request lifecycle</span>
          <SystemFlowViz />
        </div>

        <div className="hi__panel hi__module--stack">
          <span className="eyebrow">Tech stack</span>
          <div className="hi__stack-tags">
            {FEATURED_STACK.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
          <a href="#stack" className="hi__module-link" data-cursor="hover">
            View full stack <ArrowRight size={12} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hi__scroll" data-hero-scroll aria-hidden="true">
        <span className="hi__scroll-icon">
          <span className="hi__scroll-dot" />
        </span>
        Scroll to explore
      </div>
    </div>
  )
}
