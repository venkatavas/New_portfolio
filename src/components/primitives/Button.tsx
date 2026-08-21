import type { ElementType, ReactNode } from 'react'
import { MagneticWrapper } from './MagneticWrapper'
import './Button.css'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'icon'
  icon?: ReactNode
  external?: boolean
  magnetic?: boolean
  className?: string
  ariaLabel?: string
  download?: boolean
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  icon,
  external = false,
  magnetic = true,
  className,
  ariaLabel,
  download,
}: ButtonProps) {
  const Tag: ElementType = href ? 'a' : 'button'

  const content = (
    <Tag
      className={`btn btn--${variant}${className ? ` ${className}` : ''}`}
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      aria-label={ariaLabel}
      type={href ? undefined : 'button'}
      download={download ? '' : undefined}
      data-cursor="hover"
    >
      <span className="btn__label">{children}</span>
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </Tag>
  )

  return magnetic ? <MagneticWrapper>{content}</MagneticWrapper> : content
}
