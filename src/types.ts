export type ActivityType = 'projeto' | 'cenario';

export type ScoreInput = number | '' | null;

export type PerformanceLevelKey = 'excelente' | 'bom' | 'satisfatorio' | 'insuficiente';

export interface PerformanceLevel {
  key: PerformanceLevelKey;
  label: string;
  range: string;
  suggestedScore: number;
}

export interface CriterionDefinition {
  id: string;
  number: number;
  name: string;
  weight: number;
  weightPercent: number;
  descriptors: Record<PerformanceLevelKey, string>;
}

export interface ActivityConfig {
  id: ActivityType;
  label: string;
  shortLabel: string;
  activityTitle: string;
  titleFieldLabel: string;
  titlePlaceholder: string;
  audienceFieldLabel: string;
  audienceShortLabel: string;
  audiencePlaceholder: string;
  feedbackPlaceholder: string;
  criteria: readonly CriterionDefinition[];
  templateHtml: string;
  csvSlug: string;
}

export interface StudentRecord {
  id: string;
  activityType: ActivityType;
  name: string;
  projectTitle: string;
  targetAudience: string;
  password: string;
  accessHash?: string;
  feedback: string;
  criterios: ScoreInput[];
  nota: string;
  updatedAt: string;
}

export interface StudentPublicRecord {
  id: string;
  activityType: ActivityType;
  name: string;
  projectTitle: string;
  targetAudience: string;
  feedback: string;
  criterios: ScoreInput[];
  nota: string;
  updatedAt: string;
}
