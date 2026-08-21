import { ArchitectureViz } from './ArchitectureViz'
import { ProjectDetail } from './ProjectDetail'
import type { ProjectEntry } from '@/data/content'
import type { Architecture } from '@/data/architecture'
import './ProjectAccordion.css'

interface ProjectAccordionProps {
  projects: ProjectEntry[]
  activeIndex: number
  onSelect: (index: number) => void
  architectures: Record<string, Architecture>
}

/**
 * Compact-viewport equivalent of the desktop selector + side-by-side
 * diagram/detail: each project expands inline, right under the card you
 * tapped, instead of a separate panel sitting below all three cards.
 */
export function ProjectAccordion({
  projects,
  activeIndex,
  onSelect,
  architectures,
}: ProjectAccordionProps) {
  return (
    <div className="proj-accordion">
      {projects.map((project, i) => {
        const isActive = i === activeIndex
        return (
          <div className="proj-accordion__item" key={project.slug}>
            <button
              type="button"
              className={`proj-accordion__trigger${isActive ? ' is-active' : ''}`}
              aria-expanded={isActive}
              aria-controls={`proj-accordion-panel-${project.slug}`}
              onClick={() => onSelect(i)}
              data-cursor="hover"
            >
              <span className="proj-accordion__head">
                <span className="proj-accordion__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="proj-accordion__title">{project.title}</span>
                {isActive && <span className="proj-accordion__dot" aria-hidden="true" />}
              </span>
              <span className="proj-accordion__tags">
                {project.stack.slice(0, 3).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </span>
            </button>

            {isActive && (
              <div className="proj-accordion__panel" id={`proj-accordion-panel-${project.slug}`}>
                <div className="projects__viz-panel">
                  <span className="eyebrow projects__viz-label">System architecture</span>
                  <ArchitectureViz architecture={architectures[project.slug]} />
                </div>
                <ProjectDetail project={project} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
