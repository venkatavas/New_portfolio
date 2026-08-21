// Presentational architecture diagrams for the Projects section — each node
// maps directly to something already described in a project's summary/points
// in content.ts (no invented components or metrics).
import {
  User,
  Send,
  Server,
  ShieldCheck,
  MessageSquare,
  Database,
  CheckCircle2,
  Workflow,
  Cpu,
  Layers,
  FileJson,
  type LucideIcon,
} from 'lucide-react'

export interface ArchNode {
  id: string
  label: string
  sublabel: string
  icon: LucideIcon
  x: number
  y: number
}

export interface ArchEdge {
  from: string
  to: string
}

export interface Architecture {
  nodes: ArchNode[]
  edges: ArchEdge[]
}

const ROW = [8, 25, 42, 58, 75, 92]
const BRANCH_LEFT = 20
const BRANCH_RIGHT = 80
const CENTER = 50

export const architectures: Record<string, Architecture> = {
  'ai-support-assistant': {
    nodes: [
      { id: 'client', label: 'CLIENT', sublabel: 'React UI', icon: User, x: CENTER, y: ROW[0] },
      { id: 'request', label: 'REQUEST', sublabel: 'HTTP call', icon: Send, x: CENTER, y: ROW[1] },
      {
        id: 'api',
        label: 'FLASK API',
        sublabel: 'Route handler',
        icon: Server,
        x: CENTER,
        y: ROW[2],
      },
      {
        id: 'chat',
        label: 'CHAT ENGINE',
        sublabel: 'Query processing',
        icon: MessageSquare,
        x: BRANCH_LEFT,
        y: ROW[3],
      },
      {
        id: 'validation',
        label: 'VALIDATION',
        sublabel: 'Error handling',
        icon: ShieldCheck,
        x: BRANCH_RIGHT,
        y: ROW[3],
      },
      {
        id: 'db',
        label: 'MONGODB',
        sublabel: 'Data layer',
        icon: Database,
        x: CENTER,
        y: ROW[4],
      },
      {
        id: 'response',
        label: 'RESPONSE',
        sublabel: 'JSON reply',
        icon: CheckCircle2,
        x: CENTER,
        y: ROW[5],
      },
    ],
    edges: [
      { from: 'client', to: 'request' },
      { from: 'request', to: 'api' },
      { from: 'api', to: 'chat' },
      { from: 'api', to: 'validation' },
      { from: 'chat', to: 'db' },
      { from: 'validation', to: 'db' },
      { from: 'db', to: 'response' },
    ],
  },

  'governance-analytics-platform': {
    nodes: [
      {
        id: 'source',
        label: 'RAW DATA',
        sublabel: '630+ admin units',
        icon: Database,
        x: CENTER,
        y: ROW[0],
      },
      {
        id: 'ingest',
        label: 'INGESTION',
        sublabel: 'ETL pipeline',
        icon: Workflow,
        x: CENTER,
        y: ROW[1],
      },
      {
        id: 'transform',
        label: 'TRANSFORM',
        sublabel: 'Validation',
        icon: ShieldCheck,
        x: CENTER,
        y: ROW[2],
      },
      {
        id: 'anomaly',
        label: 'ANOMALY DETECTION',
        sublabel: 'Outlier scan',
        icon: Cpu,
        x: BRANCH_LEFT,
        y: ROW[3],
      },
      {
        id: 'cluster',
        label: 'CLUSTERING',
        sublabel: 'Grouping',
        icon: Layers,
        x: BRANCH_RIGHT,
        y: ROW[3],
      },
      {
        id: 'report',
        label: 'REPORT ENGINE',
        sublabel: 'Automated',
        icon: FileJson,
        x: CENTER,
        y: ROW[4],
      },
      {
        id: 'output',
        label: 'HTML / JSON',
        sublabel: 'Structured output',
        icon: CheckCircle2,
        x: CENTER,
        y: ROW[5],
      },
    ],
    edges: [
      { from: 'source', to: 'ingest' },
      { from: 'ingest', to: 'transform' },
      { from: 'transform', to: 'anomaly' },
      { from: 'transform', to: 'cluster' },
      { from: 'anomaly', to: 'report' },
      { from: 'cluster', to: 'report' },
      { from: 'report', to: 'output' },
    ],
  },

  'movie-review-system': {
    nodes: [
      { id: 'client', label: 'CLIENT', sublabel: 'React UI', icon: User, x: CENTER, y: ROW[0] },
      { id: 'request', label: 'REQUEST', sublabel: 'REST call', icon: Send, x: CENTER, y: ROW[1] },
      {
        id: 'api',
        label: 'SPRING BOOT API',
        sublabel: 'Controller layer',
        icon: Server,
        x: CENTER,
        y: ROW[2],
      },
      {
        id: 'auth',
        label: 'RBAC / AUTH',
        sublabel: 'Role check',
        icon: ShieldCheck,
        x: BRANCH_LEFT,
        y: ROW[3],
      },
      {
        id: 'reviews',
        label: 'REVIEW SERVICE',
        sublabel: 'CRUD logic',
        icon: MessageSquare,
        x: BRANCH_RIGHT,
        y: ROW[3],
      },
      {
        id: 'db',
        label: 'MONGODB',
        sublabel: 'Data layer',
        icon: Database,
        x: CENTER,
        y: ROW[4],
      },
      {
        id: 'response',
        label: 'RESPONSE',
        sublabel: 'JSON reply',
        icon: CheckCircle2,
        x: CENTER,
        y: ROW[5],
      },
    ],
    edges: [
      { from: 'client', to: 'request' },
      { from: 'request', to: 'api' },
      { from: 'api', to: 'auth' },
      { from: 'api', to: 'reviews' },
      { from: 'auth', to: 'db' },
      { from: 'reviews', to: 'db' },
      { from: 'db', to: 'response' },
    ],
  },
}
