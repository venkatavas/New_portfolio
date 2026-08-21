import { useRef, type KeyboardEvent } from 'react'
import type { ProjectEntry } from '@/data/content'
import './ProjectSelector.css'

interface ProjectSelectorProps {
  projects: ProjectEntry[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ProjectSelector({ projects, activeIndex, onSelect }: ProjectSelectorProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleKeyDown = (event: KeyboardEvent) => {
    let next = activeIndex
    if (event.key === 'ArrowDown') next = (activeIndex + 1) % projects.length
    else if (event.key === 'ArrowUp') next = (activeIndex - 1 + projects.length) % projects.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = projects.length - 1
    else return

    event.preventDefault()
    onSelect(next)
    buttonRefs.current[next]?.focus()
  }

  return (
    <div
      className="proj-selector"
      role="tablist"
      aria-label="Projects"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
    >
      {projects.map((project, i) => {
        const isActive = i === activeIndex
        return (
          <button
            key={project.slug}
            type="button"
            role="tab"
            id={`proj-tab-${project.slug}`}
            aria-selected={isActive}
            aria-controls={`proj-panel-${project.slug}`}
            tabIndex={isActive ? 0 : -1}
            ref={(el) => {
              buttonRefs.current[i] = el
            }}
            className={`proj-selector__item${isActive ? ' is-active' : ''}`}
            onClick={() => onSelect(i)}
            data-cursor="hover"
          >
            <span className="proj-selector__head">
              <span className="proj-selector__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="proj-selector__title">{project.title}</span>
              {isActive && <span className="proj-selector__dot" aria-hidden="true" />}
            </span>
            <span className="proj-selector__tags">
              {project.stack.slice(0, 3).map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
