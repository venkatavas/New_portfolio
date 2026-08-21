import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { RevealText } from '@/components/primitives/RevealText'
import { ProjectSelector } from '@/components/projects/ProjectSelector'
import { ProjectAccordion } from '@/components/projects/ProjectAccordion'
import { ArchitectureViz } from '@/components/projects/ArchitectureViz'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { projects } from '@/data/content'
import { architectures } from '@/data/architecture'
import { links } from '@/data/links'
import './Projects.css'

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const activeProject = projects[activeIndex]
  const architecture = architectures[activeProject.slug]

  return (
    <section id="projects" className="section container projects">
      <header className="projects__header">
        <div className="projects__title-row">
          <span className="eyebrow projects__index">02</span>
          <a
            className="projects__all-link"
            href={links.github.url}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
          >
            View on GitHub
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="projects__heading-row">
          <RevealText as="h2" className="projects__title">
            Projects
          </RevealText>
          <p className="projects__description">
            Systems I've designed and built to solve real problems.
          </p>
        </div>
      </header>

      {isDesktop ? (
        <div className="projects__lab">
          <ProjectSelector projects={projects} activeIndex={activeIndex} onSelect={setActiveIndex} />

          <div className="projects__viz-panel">
            <span className="eyebrow projects__viz-label">System architecture</span>
            <ArchitectureViz architecture={architecture} />
          </div>

          <ProjectDetail key={activeProject.slug} project={activeProject} />
        </div>
      ) : (
        <ProjectAccordion
          projects={projects}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          architectures={architectures}
        />
      )}
    </section>
  )
}
