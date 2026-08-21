import { motion } from 'motion/react'
import { RevealText } from '@/components/primitives/RevealText'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { fadeUp, viewportOnce, easeOutExpo } from '@/lib/motion'
import { summary } from '@/data/content'
import './About.css'

const PHILOSOPHY =
  "I care about the parts of engineering that don't show up in a demo: reproducing a defect, validating data before it ships, and automating the workflow so the next person doesn't have to do it by hand. That's the work I gravitate toward."

// A restrained subset of the summary's own words — enough to give the
// statement a pulse without turning every line brass.
const ACCENT_WORDS = new Set(['APIs', 'automates', 'reliability.'])

const STATS = [
  { value: '20+', label: 'Support tickets resolved' },
  { value: '2', label: 'Internships completed' },
  { value: '3', label: 'Projects shipped' },
  { value: '15+', label: 'Team members led' },
]

const statementWordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
}

const statementContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } },
}

function AboutStatement() {
  const reducedMotion = useReducedMotionContext()
  const words = summary.split(' ')

  if (reducedMotion) {
    return <p className="about__statement">{summary}</p>
  }

  return (
    <motion.p
      className="about__statement"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={statementContainerVariants}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={statementWordVariants}
              className={ACCENT_WORDS.has(word) ? 'about__accent-word' : undefined}
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

export function About() {
  const reducedMotion = useReducedMotionContext()

  const philosophyMotionProps = reducedMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: viewportOnce,
        variants: fadeUp,
        transition: { delay: 0.6, duration: 0.6, ease: easeOutExpo },
      }

  return (
    <section id="about" className="section container about">
      <div className="about__grid">
        <div className="about__intro">
          <span className="eyebrow about__index">01</span>
          <RevealText as="h2" className="about__title">
            About me
          </RevealText>
          <span className="about__label">/ How I work</span>
        </div>

        <div className="about__statement-col">
          <AboutStatement />
        </div>

        <div className="about__side">
          <motion.p className="about__philosophy" {...philosophyMotionProps}>
            {PHILOSOPHY}
          </motion.p>

          <div className="about__stats">
            {STATS.map((stat, i) => {
              const statMotionProps = reducedMotion
                ? {}
                : {
                    initial: 'hidden',
                    whileInView: 'visible',
                    viewport: viewportOnce,
                    variants: fadeUp,
                    transition: { delay: 0.75 + i * 0.08, duration: 0.5, ease: easeOutExpo },
                  }
              return (
                <motion.div className="about__stat" key={stat.label} {...statMotionProps}>
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
