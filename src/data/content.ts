// Single source of truth for resume-verified content.
// Nothing here should be added or embellished beyond what's been verified.

export interface ExperienceEntry {
  role: string
  org: string
  period: string
  stack: string[]
  points: string[]
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Software Developer Intern',
    org: 'Multiplier AI',
    period: 'Jun 2025 - Aug 2025',
    stack: ['MERN Stack', 'JavaScript', 'Python', 'CI/CD'],
    points: [
      'Developed, tested, and debugged RESTful APIs and backend logic in Node.js.',
      'Improved reliability of core services.',
      'Built React.js interfaces with JWT authentication.',
      'Optimized frontend performance.',
      'Automated backend workflows.',
    ],
  },
  {
    // Freelance/support work on a contract basis — not employment at the
    // client's company, which is why no company name appears here.
    role: 'Freelance Full Stack Developer',
    org: 'Independent Contractor, Java Full Stack',
    period: 'Freelance',
    stack: ['Java', 'Spring Boot', 'React', 'REST APIs', 'Jira'],
    points: [
      'Worked on UI enhancements.',
      'Developed and modified backend functionality.',
      'Worked with APIs.',
      'Fixed bugs.',
      'Handled Jira tickets.',
      'Collaborated across teams.',
      'Worked on sprint-based tickets.',
      'Handled 20+ tickets.',
    ],
  },
  {
    role: 'Summer Research Intern',
    org: 'Research Centre Imarat (RCI), DRDO',
    period: 'May 2024 - Jun 2024',
    stack: ['Python'],
    points: [
      'Developed a standalone system auditing tool in Python to extract and analyze 15+ critical system parameters.',
      'Automated system information collection using Python libraries and Windows Registry integration, reducing manual effort and improving accuracy.',
      'Designed automated data extraction workflows supporting system diagnostics and technical analysis.',
      'Validated tool outputs across multiple execution environments to ensure reliability and consistency.',
      'Delivered a lightweight auditing solution providing rapid system insights for end users.',
    ],
  },
]

export interface ProjectEntry {
  slug: string
  title: string
  stack: string[]
  summary: string
  points: string[]
}

export const projects: ProjectEntry[] = [
  {
    slug: 'ai-support-assistant',
    title: 'AI-Powered Support Assistant',
    stack: ['Python', 'Flask', 'React', 'MongoDB'],
    summary:
      'An AI-powered chatbot integrating backend services, REST APIs, and conversational workflows, with a React frontend and a MongoDB data layer.',
    points: [
      'Implemented API integrations and validation mechanisms to ensure reliable application behavior.',
      'Designed error-handling and debugging workflows improving interaction reliability between services.',
      'Tested conversational and API workflows across multiple usage scenarios.',
    ],
  },
  {
    slug: 'governance-analytics-platform',
    title: 'AI-Driven Governance Analytics Platform',
    stack: ['Python', 'Machine Learning'],
    summary:
      'A scalable analytics platform processing governance datasets across 630+ administrative units.',
    points: [
      'Designed end-to-end ETL pipelines covering data ingestion, transformation, validation, analysis, and reporting.',
      'Implemented anomaly detection and clustering techniques supporting intelligent monitoring and decision-making.',
      'Developed automated reporting workflows generating structured HTML and JSON outputs.',
    ],
  },
  {
    slug: 'movie-review-system',
    title: 'Movie Review System',
    stack: ['Spring Boot', 'React', 'MongoDB'],
    summary: 'Full-stack movie review platform with structured REST APIs and role-based features.',
    points: [
      'Designed and optimized backend REST APIs supporting role-based access control and review management.',
      'Built the React frontend and validated end-to-end workflows against a MongoDB data layer.',
      'Performed functional and integration testing to ensure stable application behavior.',
    ],
  },
]

export interface SkillGroup {
  label: string
  items: string[]
}

// Core, project/experience-proven skills.
export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: ['Java', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS'] },
  {
    label: 'Backend & APIs',
    items: [
      'REST APIs',
      'Spring Boot',
      'Spring MVC',
      'Spring Security',
      'JWT',
      'Hibernate',
      'Spring Data JPA',
      'Node.js',
    ],
  },
  { label: 'Frontend', items: ['React.js', 'React Native', 'Redux Toolkit', 'Material UI'] },
  { label: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle DB'] },
  {
    label: 'Testing & Tools',
    items: ['Selenium', 'BDD', 'Cucumber', 'Jenkins', 'Git', 'GitHub', 'Jira', 'CI/CD'],
  },
  {
    label: 'Practices',
    items: [
      'Debugging',
      'Root Cause Analysis',
      'Workflow Automation',
      'ETL Pipelines',
      'ML Fundamentals',
    ],
  },
]

// Broader background, not tied to a specific shipped project — kept
// visually and semantically separate from the core, evidenced skill groups.
export const backgroundSkills: string[] = ['Docker', 'Kubernetes', 'AWS', 'GCP']

export const education = {
  school: 'Gokaraju Rangaraju Institute of Technology',
  degree: 'Bachelor of Technology, Information Technology',
  period: '2021 - 2025',
  detail: 'No active backlogs',
}

export const leadership: string[] = [
  'Led and coordinated 15-member teams for college events and sustainability initiatives.',
  'Managed sponsorships exceeding INR 25,000 while coordinating stakeholder communication and execution.',
]

export const summary =
  'Backend-focused software engineer who builds Python and Java systems, develops APIs and full-stack applications, automates workflows, and troubleshoots production issues with an eye for reliability.'
