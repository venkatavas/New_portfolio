import { useState, type CSSProperties } from 'react'
import './SystemFlowViz.css'

const NODES = [
  { key: 'ui', label: 'UI' },
  { key: 'api', label: 'API' },
  { key: 'backend', label: 'BACKEND' },
  { key: 'database', label: 'DATABASE' },
]

const CYCLE_SECONDS = 3.2

/**
 * UI -> API -> Backend -> Database: a minimal request/response flow used as
 * the hero's engineering signature, not a literal architecture diagram.
 */
export function SystemFlowViz() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flow-viz">
      <div className="flow-viz__line" aria-hidden="true">
        <span className="flow-viz__packet" style={{ animationDuration: `${CYCLE_SECONDS}s` }} />
      </div>
      <ul className="flow-viz__nodes">
        {NODES.map((node, i) => (
          <li
            key={node.key}
            className={`flow-viz__node${hovered === node.key ? ' is-hovered' : ''}`}
            style={
              {
                // Node flashes are timed to when the request packet actually
                // passes it during the packet's compressed 0-38% downward
                // leg (see the flow-packet keyframes), not spread evenly
                // across the whole round-trip cycle.
                '--flow-delay': `${((i / (NODES.length - 1)) * 0.38 - 0.06) * CYCLE_SECONDS}s`,
              } as CSSProperties
            }
            onMouseEnter={() => setHovered(node.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="flow-viz__node-dot"
              aria-hidden="true"
              style={{ animationDuration: `${CYCLE_SECONDS}s` }}
            />
            <span className="flow-viz__node-label">{node.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
