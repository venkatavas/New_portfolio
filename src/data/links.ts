interface ExternalLink {
  url: string
  isPlaceholder: boolean
}

// Contact is email-only by design — no phone number is published on the
// site (it stays on the resume only).
export const links = {
  name: 'Parsha Venkata Vas',
  email: 'venkatavas467@gmail.com',
  domain: 'https://venkatavas.dev',
  github: { url: 'https://github.com/venkatavas', isPlaceholder: false } satisfies ExternalLink,
  linkedin: {
    url: 'https://www.linkedin.com/in/venkatavas',
    isPlaceholder: false,
  } satisfies ExternalLink,
  resumePdf: { url: '/resume.pdf', isPlaceholder: false } satisfies ExternalLink,
}

export type Links = typeof links
