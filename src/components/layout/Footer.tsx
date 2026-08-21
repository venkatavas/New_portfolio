import { links } from '@/data/links'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <span className="footer__identity">
        {links.name}
        <span className="footer__divider" aria-hidden="true">
          /
        </span>
        Software Engineer
      </span>
      <span>© {year}</span>
    </footer>
  )
}
