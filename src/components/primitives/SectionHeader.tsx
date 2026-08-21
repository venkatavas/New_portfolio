import { RevealText } from './RevealText'
import './SectionHeader.css'

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <RevealText as="h2" className="section-header__title">
        {title}
      </RevealText>
      {description && <p className="section-header__description">{description}</p>}
    </header>
  )
}
