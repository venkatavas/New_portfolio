import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, FileDown, ArrowUpRight } from 'lucide-react'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { MagneticWrapper } from '@/components/primitives/MagneticWrapper'
import { GithubIcon, LinkedinIcon } from '@/components/primitives/BrandIcons'
import { OrbitalStatus } from '@/components/contact/OrbitalStatus'
import { staggerChildren, fadeUp, viewportOnce } from '@/lib/motion'
import { links } from '@/data/links'
import './Contact.css'

const STATEMENT = "Let's build something worth shipping."
const ACCENT_WORD = 'shipping.'

const SUPPORTING_COPY =
  "I'm currently open to full-time opportunities where I can build, learn and create impact."

const githubHandle = new URL(links.github.url).pathname
const linkedinHandle = new URL(links.linkedin.url).pathname

/** Same word-reveal + accent-word pattern as About's statement, so
 *  "shipping." keeps its brass color whether or not motion is reduced —
 *  RevealText's reduced-motion fallback drops span structure entirely,
 *  which a CSS :last-child selector can't survive. */
function ContactStatement() {
  const reducedMotion = useReducedMotionContext()
  const words = STATEMENT.split(' ')

  if (reducedMotion) {
    return (
      <p className="contact__statement">
        {words.map((word, i) => (
          <span key={i} className={word === ACCENT_WORD ? 'contact__accent-word' : undefined}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    )
  }

  return (
    <motion.p
      className="contact__statement"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren(0.06)}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={fadeUp}
              className={word === ACCENT_WORD ? 'contact__accent-word' : undefined}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.p>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }

  return (
    <section id="contact" className="section container contact">
      <header className="contact__header">
        <span className="eyebrow contact__index">06</span>
        <h2 className="contact__section-title">Contact</h2>
        <span className="contact__label">Get in touch</span>
      </header>

      <div className="contact__grid">
        <div className="contact__statement-col">
          <ContactStatement />
          <p className="contact__supporting">{SUPPORTING_COPY}</p>
        </div>

        <div className="contact__reach-col">
          <div className="contact__email-block">
            <MagneticWrapper strength={0.1} className="contact__email-wrapper">
              <a href={`mailto:${links.email}`} className="contact__email" data-cursor="hover">
                {links.email}
              </a>
            </MagneticWrapper>
            <button
              type="button"
              className="contact__copy"
              onClick={handleCopyEmail}
              data-cursor="hover"
            >
              {copied ? (
                <>
                  Copied <Check size={14} aria-hidden="true" />
                </>
              ) : (
                <>
                  Copy email <Copy size={14} aria-hidden="true" />
                </>
              )}
            </button>
            <span className="visually-hidden" aria-live="polite">
              {copied ? 'Email copied to clipboard' : ''}
            </span>
          </div>

          <div className="contact__links">
            <a
              href={links.github.url}
              target="_blank"
              rel="noreferrer noopener"
              className="contact__link-card"
              data-cursor="hover"
              aria-label={`GitHub, ${githubHandle}`}
            >
              <span className="contact__link-icon" aria-hidden="true">
                <GithubIcon size={18} />
              </span>
              <span className="contact__link-text">
                <span className="contact__link-label">GitHub</span>
                <span className="contact__link-handle">{githubHandle}</span>
              </span>
              <ArrowUpRight size={14} className="contact__link-arrow" aria-hidden="true" />
            </a>

            <a
              href={links.linkedin.url}
              target="_blank"
              rel="noreferrer noopener"
              className="contact__link-card"
              data-cursor="hover"
              aria-label={`LinkedIn, ${linkedinHandle}`}
            >
              <span className="contact__link-icon" aria-hidden="true">
                <LinkedinIcon size={18} />
              </span>
              <span className="contact__link-text">
                <span className="contact__link-label">LinkedIn</span>
                <span className="contact__link-handle">{linkedinHandle}</span>
              </span>
              <ArrowUpRight size={14} className="contact__link-arrow" aria-hidden="true" />
            </a>

            <a
              href={links.resumePdf.url}
              download
              className="contact__link-card"
              data-cursor="hover"
              aria-label="Resume, download PDF"
            >
              <span className="contact__link-icon" aria-hidden="true">
                <FileDown size={18} />
              </span>
              <span className="contact__link-text">
                <span className="contact__link-label">Resume</span>
                <span className="contact__link-handle">Download PDF</span>
              </span>
              <ArrowUpRight size={14} className="contact__link-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="contact__status-col">
          <div className="contact__status-label">
            <span className="eyebrow">Final connection</span>
            <span className="contact__status-live">Email · GitHub · LinkedIn · Resume</span>
          </div>
          <OrbitalStatus />
        </div>
      </div>
    </section>
  )
}
