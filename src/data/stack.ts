// Presentational structure for the Stack section — every item name, tier,
// and project association is derived from already-verified data
// (content.ts's skillGroups/backgroundSkills and each project/experience
// entry's own `stack` array). Tech-to-tech `connections` are limited to
// standard, uncontroversial technical pairings (e.g. Spring Boot runs on
// Java) that follow directly from the technologies already listed — not
// claims about undisclosed experience.
import { Code2, Cog, Monitor, Database, Wrench, type LucideIcon } from 'lucide-react'

export type SkillTier = 'primary' | 'used' | 'supporting'

export interface SkillItem {
  name: string
  tier: SkillTier
  /** Project slugs (from content.ts) whose stack literally includes this technology. */
  projects: string[]
  /** Names of other stack items this pairs with technically. */
  connections?: string[]
}

export interface SkillCategory {
  index: string
  label: string
  icon: LucideIcon
  items: SkillItem[]
}

export const stackCategories: SkillCategory[] = [
  {
    index: '01',
    label: 'Languages',
    icon: Code2,
    items: [
      { name: 'Java', tier: 'primary', projects: [], connections: ['Spring Boot'] },
      {
        name: 'Python',
        tier: 'primary',
        projects: ['ai-support-assistant', 'governance-analytics-platform'],
        connections: ['Flask'],
      },
      { name: 'JavaScript', tier: 'primary', projects: [], connections: ['React.js'] },
      {
        name: 'SQL',
        tier: 'supporting',
        projects: [],
        connections: ['MySQL', 'PostgreSQL', 'Oracle DB'],
      },
      { name: 'HTML', tier: 'supporting', projects: [] },
      { name: 'CSS', tier: 'supporting', projects: [] },
    ],
  },
  {
    index: '02',
    label: 'Backend',
    icon: Cog,
    items: [
      {
        name: 'Spring Boot',
        tier: 'primary',
        projects: ['movie-review-system'],
        connections: ['Java', 'REST APIs', 'Spring MVC', 'Spring Security', 'Spring Data JPA'],
      },
      {
        name: 'REST APIs',
        tier: 'primary',
        projects: [],
        connections: ['Spring Boot', 'Flask'],
      },
      {
        name: 'Flask',
        tier: 'used',
        projects: ['ai-support-assistant'],
        connections: ['Python', 'REST APIs'],
      },
      { name: 'Spring MVC', tier: 'supporting', projects: [], connections: ['Spring Boot'] },
      { name: 'Spring Security', tier: 'supporting', projects: [], connections: ['Spring Boot'] },
      { name: 'Hibernate', tier: 'supporting', projects: [], connections: ['Spring Boot'] },
      {
        name: 'Spring Data JPA',
        tier: 'supporting',
        projects: [],
        connections: ['Spring Boot', 'Hibernate'],
      },
      { name: 'Node.js', tier: 'supporting', projects: [], connections: ['JavaScript'] },
    ],
  },
  {
    index: '03',
    label: 'Frontend',
    icon: Monitor,
    items: [
      {
        name: 'React.js',
        tier: 'primary',
        projects: ['ai-support-assistant', 'movie-review-system'],
        connections: ['JavaScript', 'REST APIs', 'Redux Toolkit'],
      },
      { name: 'React Native', tier: 'supporting', projects: [], connections: ['React.js'] },
      { name: 'Redux Toolkit', tier: 'supporting', projects: [], connections: ['React.js'] },
      { name: 'Material UI', tier: 'supporting', projects: [], connections: ['React.js'] },
    ],
  },
  {
    index: '04',
    label: 'Databases',
    icon: Database,
    items: [
      {
        name: 'MongoDB',
        tier: 'primary',
        projects: ['ai-support-assistant', 'movie-review-system'],
        connections: ['Flask', 'Spring Boot'],
      },
      { name: 'MySQL', tier: 'supporting', projects: [], connections: ['SQL'] },
      { name: 'PostgreSQL', tier: 'supporting', projects: [], connections: ['SQL'] },
      { name: 'Oracle DB', tier: 'supporting', projects: [], connections: ['SQL'] },
    ],
  },
  {
    index: '05',
    label: 'Tools & Platforms',
    icon: Wrench,
    items: [
      { name: 'Git', tier: 'supporting', projects: [], connections: ['GitHub'] },
      { name: 'GitHub', tier: 'supporting', projects: [], connections: ['Git'] },
      { name: 'Jira', tier: 'used', projects: [] },
      { name: 'CI/CD', tier: 'used', projects: [] },
      { name: 'Docker', tier: 'supporting', projects: [] },
      { name: 'Kubernetes', tier: 'supporting', projects: [] },
      { name: 'AWS', tier: 'supporting', projects: [] },
      { name: 'GCP', tier: 'supporting', projects: [] },
      { name: 'Jenkins', tier: 'supporting', projects: [] },
      { name: 'Selenium', tier: 'supporting', projects: [] },
      { name: 'Cucumber', tier: 'supporting', projects: [] },
      { name: 'BDD', tier: 'supporting', projects: [] },
    ],
  },
]
