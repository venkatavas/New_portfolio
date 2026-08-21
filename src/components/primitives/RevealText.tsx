import { motion } from 'motion/react'
import type { ElementType } from 'react'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

interface RevealTextProps {
  children: string
  as?: Tag
  className?: string
  stagger?: number
  splitBy?: 'word' | 'line'
}

const MOTION_TAGS: Record<Tag, ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
}

/** Masked, staggered word/line reveal, triggered once on scroll into view. */
export function RevealText({
  children,
  as = 'span',
  className,
  stagger = 0.05,
  splitBy = 'word',
}: RevealTextProps) {
  const reducedMotion = useReducedMotionContext()
  const MotionTag = MOTION_TAGS[as]
  const pieces = splitBy === 'word' ? children.split(' ') : children.split('\n')

  if (reducedMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren(stagger)}
    >
      {pieces.map((piece, index) => (
        // The trailing space must live OUTSIDE the inline-block mask: a
        // browser's shrink-to-fit width for an inline-block box collapses a
        // space at the very end of its content, so keeping it inside made
        // words run together with no visible gap.
        <span key={index}>
          <span style={{ display: 'inline-block', overflow: 'hidden' }}>
            <motion.span style={{ display: 'inline-block' }} variants={fadeUp}>
              {piece}
            </motion.span>
          </span>
          {splitBy === 'word' && index < pieces.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  )
}
