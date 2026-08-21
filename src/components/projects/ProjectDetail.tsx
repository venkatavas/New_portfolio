import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Tag } from '@/components/primitives/Tag'
import { links } from '@/data/links'
import type { ProjectEntry } from '@/data/content'
import './ProjectDetail.css'

interface ProjectDetailProps {
  project: ProjectEntry
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div
      className="proj-detail"
      role="tabpanel"
      id={`proj-panel-${project.slug}`}
      aria-labelledby={`proj-tab-${project.slug}`}
    >
      <h3 className="proj-detail__title">{project.title}</h3>
      <p className="proj-detail__summary">{project.summary}</p>

      <span className="eyebrow proj-detail__label">Key features</span>
      <ul className="proj-detail__points">
        {project.points.map((point) => (
          <li key={point}>
            <ChevronRight size={12} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>

      <span className="eyebrow proj-detail__label">Tech stack</span>
      <div className="proj-detail__stack">
        {project.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>

      <a
        className="proj-detail__link"
        href={links.github.url}
        target="_blank"
        rel="noreferrer noopener"
        data-cursor="hover"
        aria-label={`View ${project.title} on GitHub`}
      >
        View on GitHub
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  )
}
