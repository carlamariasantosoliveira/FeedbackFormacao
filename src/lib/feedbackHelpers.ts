import type { ActivityType, ScoreInput } from '../types.ts';
import { getCriteriaForActivity, parseScore } from './rubric.ts';

// Volumetric bounds synchronized verbatim with firebase-blueprint.json & firestore.rules
export const BLUEPRINT_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 120,
  PROJECT_TITLE_MAX: 200,
  TARGET_AUDIENCE_MAX: 200,
  PASSWORD_MIN: 2,
  PASSWORD_MAX: 64,
  FEEDBACK_MAX: 50000,
  OBSERVATION_MAX: 500,
  NOTA_MAX: 16,
  ID_MAX: 128,
  ID_PATTERN: /^[a-zA-Z0-9_\-]+$/,
  HASH_PATTERN: /^[a-f0-9]{64}$/,
} as const;

export function normalizeActivityType(raw: unknown): ActivityType {
  return raw === 'cenario' ? 'cenario' : 'projeto';
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashStudentPassword(password: string): Promise<string> {
  const normalized = password.trim().toLowerCase();
  return sha256Hex(`fp_v1:${normalized}`);
}

export async function hashTeacherPassword(password: string): Promise<string> {
  return sha256Hex(`fp_teacher_v1:${password}`);
}

export function generateRandomHexKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function normalizeCriteriaForFirestore(
  criterios: readonly ScoreInput[] | undefined,
  activityType: ActivityType = 'projeto'
): (number | null)[] {
  const criteria = getCriteriaForActivity(activityType);
  const result: (number | null)[] = [];
  for (let i = 0; i < criteria.length; i += 1) {
    const parsed = parseScore(criterios?.[i]);
    result.push(parsed !== null ? parsed : null);
  }
  return result;
}

export function fromFirestoreCriteria(
  raw: unknown,
  activityType: ActivityType = 'projeto'
): ScoreInput[] {
  const criteria = getCriteriaForActivity(activityType);
  if (!Array.isArray(raw)) return criteria.map(() => '');
  return criteria.map((_, i) => {
    const val = raw[i];
    return typeof val === 'number' && Number.isFinite(val) ? val : '';
  });
}

export function normalizeObservationsForFirestore(
  observacoes: readonly string[] | undefined,
  activityType: ActivityType = 'projeto'
): string[] {
  const criteria = getCriteriaForActivity(activityType);
  const result: string[] = [];
  for (let i = 0; i < criteria.length; i += 1) {
    const raw = typeof observacoes?.[i] === 'string' ? observacoes[i] : '';
    result.push(clampString(raw, BLUEPRINT_LIMITS.OBSERVATION_MAX));
  }
  return result;
}

export function fromFirestoreObservations(
  raw: unknown,
  activityType: ActivityType = 'projeto'
): string[] {
  const criteria = getCriteriaForActivity(activityType);
  if (!Array.isArray(raw)) return criteria.map(() => '');
  return criteria.map((_, i) => {
    const val = raw[i];
    return typeof val === 'string' ? val.slice(0, BLUEPRINT_LIMITS.OBSERVATION_MAX) : '';
  });
}

export function clampString(value: string, maxLen: number): string {
  const trimmed = value.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}
