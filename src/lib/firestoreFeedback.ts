import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import type { ActivityType, ScoreInput, StudentPublicRecord, StudentRecord } from '../types.ts';
import { OperationType, db, handleFirestoreError } from './firebase.ts';
import {
  BLUEPRINT_LIMITS,
  clampString,
  fromFirestoreCriteria,
  fromFirestoreObservations,
  generateRandomHexKey,
  hashStudentPassword,
  hashTeacherPassword,
  normalizeActivityType,
  normalizeCriteriaForFirestore,
  normalizeObservationsForFirestore,
} from './feedbackHelpers.ts';
import {
  calcFinalScore,
  generateStudentPassword,
  getCriteriaForActivity,
  sanitizeFeedbackHtml,
} from './rubric.ts';

export { BLUEPRINT_LIMITS, hashStudentPassword };

export const DEFAULT_TEACHER_PASSWORD = 'formacao*2020';
const SESSION_KEY = 'fp_teacher_capability_v1';

export interface TeacherSession {
  teacherHash: string;
  workspaceKey: string;
}

function saveSession(session: TeacherSession | null): void {
  try {
    if (session) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore storage restriction
  }
}

function readStoredSession(): TeacherSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TeacherSession>;
    if (
      typeof parsed.teacherHash === 'string' &&
      BLUEPRINT_LIMITS.HASH_PATTERN.test(parsed.teacherHash) &&
      typeof parsed.workspaceKey === 'string' &&
      BLUEPRINT_LIMITS.HASH_PATTERN.test(parsed.workspaceKey)
    ) {
      return {
        teacherHash: parsed.teacherHash,
        workspaceKey: parsed.workspaceKey,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function clearTeacherSession(): void {
  saveSession(null);
}

function formatTimestampIso(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString();
  }
  if (typeof ts === 'string' && ts) {
    return ts;
  }
  return new Date().toISOString();
}

function mapStudentDoc(id: string, data: Record<string, unknown>): StudentRecord {
  const activityType = normalizeActivityType(data.activityType);
  return {
    id,
    activityType,
    name: typeof data.name === 'string' ? data.name : '',
    projectTitle: typeof data.projectTitle === 'string' ? data.projectTitle : '',
    targetAudience: typeof data.targetAudience === 'string' ? data.targetAudience : '',
    password: typeof data.password === 'string' ? data.password : '',
    accessHash: typeof data.accessHash === 'string' ? data.accessHash : undefined,
    feedback: typeof data.feedback === 'string' ? data.feedback : '',
    criterios: fromFirestoreCriteria(data.criterios, activityType),
    criterioObservacoes: fromFirestoreObservations(data.criterioObservacoes, activityType),
    nota: typeof data.nota === 'string' ? data.nota : '',
    updatedAt: formatTimestampIso(data.updatedAt),
  };
}

function generateValidStudentId(): string {
  const raw =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const id = `stu_${raw}`.replace(/[^a-zA-Z0-9_\-]/g, '-');
  return id.slice(0, BLUEPRINT_LIMITS.ID_MAX);
}

const INITIAL_SEED_STUDENTS: Array<{
  id: string;
  activityType: ActivityType;
  name: string;
  projectTitle: string;
  targetAudience: string;
  password: string;
  feedback: string;
  criterios: ScoreInput[];
}> = [
  {
    id: 'seed-1',
    activityType: 'projeto',
    name: 'Ana Ferreira',
    projectTitle: 'Assistente Documental para a Direção Escolar',
    targetAudience: 'Direção e Serviços Administrativos',
    password: 'Solar34',
    feedback:
      '<p>Olá, Ana Ferreira,</p>' +
      '<p>O Projeto de Intervenção apresentado demonstra uma excelente compreensão das necessidades organizacionais da escola e propõe uma solução prática e diretamente aplicável aos serviços da Direção.</p>' +
      '<p><strong>Pontos Fortes</strong></p>' +
      '<ul><li><strong>Identificação e Contexto:</strong> Todos os elementos iniciais estão completos e o problema da sobrecarga administrativa na redação de circulares e atas está muito bem fundamentado.</li>' +
      '<li><strong>Seleção de Ferramentas:</strong> A articulação entre o NotebookLM (para consulta segura de regulamentos internos) e o Gemini (para minutas padronizadas) é exemplar.</li></ul>' +
      '<p><strong>Aspetos a Melhorar</strong></p>' +
      '<ul><li>Detalhar os procedimentos de revisão humana e proteção de dados antes da divulgação de documentos oficiais às famílias.</li></ul>' +
      '<p><strong>Recomendações</strong></p>' +
      '<ul><li>Criar uma grelha curta de verificação de conformidade (RGPD) para acompanhar o guia de prompts entregue à equipa administrativa.</li></ul>' +
      '<p>Continuação de um excelente trabalho!<br>A formadora, Carla Oliveira</p>',
    criterios: [10, 10, 9.5, 9.5, 10, 9.5],
  },
  {
    id: 'seed-2',
    activityType: 'projeto',
    name: 'Miguel Costa',
    projectTitle: 'Biblioteca Digital Inteligente e Guias de Leitura',
    targetAudience: 'Equipa da Biblioteca Escolar e Departamentos',
    password: 'Azul85',
    feedback:
      '<p>Olá, Miguel Costa,</p>' +
      '<p>A proposta para dinamizar a Biblioteca Escolar através de recomendações temáticas e materiais de apoio criados com IA é muito pertinente e responde a uma necessidade real de articulação com os departamentos.</p>' +
      '<p><strong>Pontos Fortes</strong></p>' +
      '<ul><li><strong>Adequação ao Público-Alvo:</strong> A integração com o Canva AI para cartazes e guiões de divulgação está bem pensada para o contexto da biblioteca.</li>' +
      '<li><strong>Benefícios Claros:</strong> Evidencia ganhos concretos na poupança de tempo da equipa e na visibilidade do fundo documental.</li></ul>' +
      '<p><strong>Aspetos a Melhorar</strong></p>' +
      '<ul><li>Concretizar melhor a calendarização das sessões de acompanhamento aos docentes dos departamentos.</li></ul>' +
      '<p>Estou disponível para qualquer esclarecimento adicional.<br>A formadora, Carla Oliveira</p>',
    criterios: [10, 9, 9, 8.5, 9, 9],
  },
  {
    id: 'seed-3',
    activityType: 'projeto',
    name: 'Sofia Ribeiro',
    projectTitle: 'Canal de Comunicação Multilingue Escola–Famílias',
    targetAudience: 'Famílias e Equipas Educativas',
    password: 'Rio51',
    feedback: '',
    criterios: [],
  },
  {
    id: 'seed-cenario-1',
    activityType: 'cenario',
    name: 'Beatriz Almeida',
    projectTitle: 'Análise Crítica de Fontes Históricas com Apoio da IA',
    targetAudience: 'História · 8.º Ano',
    password: 'Verde42',
    feedback:
      '<p>Olá, Beatriz Almeida,</p>' +
      '<p>O Cenário de Aprendizagem apresentado está muito bem estruturado, com excelente articulação entre os objetivos, a metodologia ativa e a utilização crítica da IA pelos alunos.</p>' +
      '<p><strong>Pontos Fortes</strong></p>' +
      '<ul><li><strong>Enquadramento e Metodologia:</strong> Todos os dados curriculares estão completos e a aprendizagem baseada em problemas está claramente definida.</li>' +
      '<li><strong>Sequência Pedagógica:</strong> Os momentos da aula, tempos e papel mediador da professora garantem a exequibilidade na turma.</li></ul>' +
      '<p>Continuação de um ótimo trabalho!<br>A formadora, Carla Oliveira</p>',
    criterios: [10, 9.5, 10, 9, 9.5],
  },
  {
    id: 'seed-cenario-2',
    activityType: 'cenario',
    name: 'Diogo Martins',
    projectTitle: 'Exploração dos Ecossistemas Locais com Guiões Digitais',
    targetAudience: 'Ciências Naturais · 5.º Ano',
    password: 'Luna73',
    feedback: '',
    criterios: [],
  },
];

async function bootstrapDefaultWorkspace(): Promise<TeacherSession> {
  const teacherHash = await hashTeacherPassword(DEFAULT_TEACHER_PASSWORD);
  const workspaceKey = generateRandomHexKey();

  const batch = writeBatch(db);
  batch.set(doc(db, 'system', 'init'), {
    initialized: true,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, 'workspaces', workspaceKey), {
    name: 'Avaliação de Trabalhos IA',
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, 'teacherAccess', teacherHash), {
    workspaceKey,
    updatedAt: serverTimestamp(),
  });

  for (const s of INITIAL_SEED_STUDENTS) {
    const accessHash = await hashStudentPassword(s.password);
    const criterios = normalizeCriteriaForFirestore(s.criterios, s.activityType);
    const criterioObservacoes = normalizeObservationsForFirestore([], s.activityType);
    const nota = calcFinalScore(s.criterios, s.activityType) ?? '';

    batch.set(doc(db, 'workspaces', workspaceKey, 'students', s.id), {
      activityType: s.activityType,
      name: s.name,
      projectTitle: s.projectTitle,
      targetAudience: s.targetAudience,
      password: s.password,
      accessHash,
      feedback: s.feedback,
      criterios,
      criterioObservacoes,
      nota,
      workspaceKey,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    batch.set(doc(db, 'publicFeedbacks', accessHash), {
      studentId: s.id,
      workspaceKey,
      activityType: s.activityType,
      name: s.name,
      projectTitle: s.projectTitle,
      targetAudience: s.targetAudience,
      feedback: s.feedback,
      criterios,
      criterioObservacoes,
      nota,
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'system/init');
  }

  return { teacherHash, workspaceKey };
}

export async function restoreTeacherSession(): Promise<TeacherSession | null> {
  const stored = readStoredSession();
  if (!stored) return null;
  try {
    const snap = await getDoc(doc(db, 'teacherAccess', stored.teacherHash));
    if (!snap.exists()) {
      saveSession(null);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

export async function loginTeacherWithPassword(password: string): Promise<TeacherSession> {
  if (!password) {
    throw new Error('Introduz a password do formador.');
  }

  const teacherHash = await hashTeacherPassword(password);
  const accessPath = `teacherAccess/${teacherHash}`;

  let accessSnap;
  try {
    accessSnap = await getDoc(doc(db, 'teacherAccess', teacherHash));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, accessPath);
  }

  if (accessSnap.exists()) {
    const workspaceKey = accessSnap.data()?.workspaceKey;
    if (typeof workspaceKey === 'string' && BLUEPRINT_LIMITS.HASH_PATTERN.test(workspaceKey)) {
      const session: TeacherSession = { teacherHash, workspaceKey };
      saveSession(session);
      return session;
    }
  }

  // Not found: check if workspace has never been initialized yet
  let initSnap;
  try {
    initSnap = await getDoc(doc(db, 'system', 'init'));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'system/init');
  }

  if (!initSnap.exists() && password === DEFAULT_TEACHER_PASSWORD) {
    const session = await bootstrapDefaultWorkspace();
    saveSession(session);
    return session;
  }

  throw new Error('Password incorreta.');
}

export async function changeTeacherPasswordInFirestore(
  session: TeacherSession,
  currentPassword: string,
  newPassword: string
): Promise<TeacherSession> {
  const currentHash = await hashTeacherPassword(currentPassword);
  if (currentHash !== session.teacherHash) {
    throw new Error('A password atual está incorreta.');
  }

  const trimmedNew = newPassword.trim();
  if (trimmedNew.length < 4) {
    throw new Error('A nova password deve ter pelo menos 4 caracteres.');
  }

  const newHash = await hashTeacherPassword(trimmedNew);
  if (newHash === currentHash) {
    throw new Error('A nova password deve ser diferente da atual.');
  }

  const batch = writeBatch(db);
  batch.set(doc(db, 'teacherAccess', newHash), {
    workspaceKey: session.workspaceKey,
    updatedAt: serverTimestamp(),
  });
  batch.delete(doc(db, 'teacherAccess', currentHash));

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `teacherAccess/${newHash}`);
  }

  const nextSession: TeacherSession = {
    teacherHash: newHash,
    workspaceKey: session.workspaceKey,
  };
  saveSession(nextSession);
  return nextSession;
}

export function subscribeTeacherStudents(
  workspaceKey: string,
  onData: (students: StudentRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `workspaces/${workspaceKey}/students`;
  const q = query(
    collection(db, 'workspaces', workspaceKey, 'students'),
    where('workspaceKey', '==', workspaceKey)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs
        .map((d) => mapStudentDoc(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        } else {
          throw wrapped;
        }
      }
    }
  );
}

export async function createStudentInFirestore(
  workspaceKey: string,
  existingStudents: readonly StudentRecord[],
  payload: {
    activityType: ActivityType;
    name: string;
    password?: string;
    projectTitle?: string;
    targetAudience?: string;
  }
): Promise<StudentRecord> {
  const activityType = normalizeActivityType(payload.activityType);
  const name = clampString(payload.name, BLUEPRINT_LIMITS.NAME_MAX);
  if (name.length < BLUEPRINT_LIMITS.NAME_MIN) {
    throw new Error('O nome do formando é obrigatório.');
  }

  let password = clampString(payload.password || '', BLUEPRINT_LIMITS.PASSWORD_MAX);
  if (!password) {
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const candidate = generateStudentPassword();
      const collision = existingStudents.some(
        (s) => s.password.trim().toLowerCase() === candidate.toLowerCase()
      );
      if (!collision) {
        password = candidate;
        break;
      }
    }
    if (!password) {
      password = `Form${Math.floor(100 + Math.random() * 900)}`;
    }
  } else {
    if (password.length < BLUEPRINT_LIMITS.PASSWORD_MIN) {
      throw new Error('A password do formando deve ter pelo menos 2 caracteres.');
    }
    const duplicate = existingStudents.some(
      (s) => s.password.trim().toLowerCase() === password.toLowerCase()
    );
    if (duplicate) {
      throw new Error('Essa password já está atribuída a outro trabalho/formando. Escolhe outra.');
    }
  }

  const projectTitle = clampString(payload.projectTitle || '', BLUEPRINT_LIMITS.PROJECT_TITLE_MAX);
  const targetAudience = clampString(
    payload.targetAudience || '',
    BLUEPRINT_LIMITS.TARGET_AUDIENCE_MAX
  );
  const studentId = generateValidStudentId();
  const accessHash = await hashStudentPassword(password);
  const criterios = normalizeCriteriaForFirestore([], activityType);
  const criterioObservacoes = normalizeObservationsForFirestore([], activityType);

  const studentRef = doc(db, 'workspaces', workspaceKey, 'students', studentId);
  const publicRef = doc(db, 'publicFeedbacks', accessHash);

  const batch = writeBatch(db);
  batch.set(studentRef, {
    activityType,
    name,
    projectTitle,
    targetAudience,
    password,
    accessHash,
    feedback: '',
    criterios,
    criterioObservacoes,
    nota: '',
    workspaceKey,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(publicRef, {
    studentId,
    workspaceKey,
    activityType,
    name,
    projectTitle,
    targetAudience,
    feedback: '',
    criterios,
    criterioObservacoes,
    nota: '',
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `workspaces/${workspaceKey}/students/${studentId}`);
  }

  return {
    id: studentId,
    activityType,
    name,
    projectTitle,
    targetAudience,
    password,
    accessHash,
    feedback: '',
    criterios: getCriteriaForActivity(activityType).map(() => ''),
    criterioObservacoes,
    nota: '',
    updatedAt: new Date().toISOString(),
  };
}

export async function saveStudentFeedbackInFirestore(
  workspaceKey: string,
  existingStudent: StudentRecord,
  payload: {
    projectTitle: string;
    targetAudience: string;
    feedback: string;
    criterios: ScoreInput[];
    criterioObservacoes: string[];
  }
): Promise<StudentRecord> {
  const activityType = normalizeActivityType(existingStudent.activityType);
  const projectTitle = clampString(payload.projectTitle, BLUEPRINT_LIMITS.PROJECT_TITLE_MAX);
  const targetAudience = clampString(
    payload.targetAudience,
    BLUEPRINT_LIMITS.TARGET_AUDIENCE_MAX
  );
  const sanitizedHtml = sanitizeFeedbackHtml(payload.feedback);
  const feedback =
    sanitizedHtml.length > BLUEPRINT_LIMITS.FEEDBACK_MAX
      ? sanitizedHtml.slice(0, BLUEPRINT_LIMITS.FEEDBACK_MAX)
      : sanitizedHtml;

  const criterios = normalizeCriteriaForFirestore(payload.criterios, activityType);
  const criterioObservacoes = normalizeObservationsForFirestore(
    payload.criterioObservacoes,
    activityType
  );
  const nota = clampString(
    calcFinalScore(payload.criterios, activityType) ?? '',
    BLUEPRINT_LIMITS.NOTA_MAX
  );
  const accessHash =
    existingStudent.accessHash || (await hashStudentPassword(existingStudent.password));

  const studentRef = doc(db, 'workspaces', workspaceKey, 'students', existingStudent.id);
  const publicRef = doc(db, 'publicFeedbacks', accessHash);

  const batch = writeBatch(db);
  batch.update(studentRef, {
    activityType,
    projectTitle,
    targetAudience,
    feedback,
    criterios,
    criterioObservacoes,
    nota,
    updatedAt: serverTimestamp(),
  });
  batch.update(publicRef, {
    activityType,
    projectTitle,
    targetAudience,
    feedback,
    criterios,
    criterioObservacoes,
    nota,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.UPDATE,
      `workspaces/${workspaceKey}/students/${existingStudent.id}`
    );
  }

  return {
    ...existingStudent,
    activityType,
    accessHash,
    projectTitle,
    targetAudience,
    feedback,
    criterios: fromFirestoreCriteria(criterios, activityType),
    criterioObservacoes,
    nota,
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteStudentInFirestore(
  workspaceKey: string,
  student: StudentRecord
): Promise<void> {
  const accessHash = student.accessHash || (await hashStudentPassword(student.password));
  const studentRef = doc(db, 'workspaces', workspaceKey, 'students', student.id);
  const publicRef = doc(db, 'publicFeedbacks', accessHash);

  const batch = writeBatch(db);
  batch.delete(studentRef);
  batch.delete(publicRef);

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `workspaces/${workspaceKey}/students/${student.id}`
    );
  }
}

export async function lookupStudentFeedbackByPassword(
  password: string
): Promise<StudentPublicRecord> {
  const trimmed = password.trim();
  if (trimmed.length < BLUEPRINT_LIMITS.PASSWORD_MIN) {
    throw new Error('Introduz a password individual recebida pela formadora.');
  }
  const accessHash = await hashStudentPassword(trimmed);
  const path = `publicFeedbacks/${accessHash}`;

  let snap;
  try {
    snap = await getDoc(doc(db, 'publicFeedbacks', accessHash));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!snap.exists()) {
    // If the database has never been initialized yet and student enters a demo seed password, bootstrap automatically
    let initSnap;
    try {
      initSnap = await getDoc(doc(db, 'system', 'init'));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'system/init');
    }

    if (!initSnap.exists()) {
      const isSeedPwd = INITIAL_SEED_STUDENTS.some(
        (s) => s.password.toLowerCase() === trimmed.toLowerCase()
      );
      if (isSeedPwd) {
        await bootstrapDefaultWorkspace();
        snap = await getDoc(doc(db, 'publicFeedbacks', accessHash));
      }
    }
  }

  if (!snap.exists()) {
    throw new Error('Password inválida. Confirma com a tua formadora.');
  }

  const data = snap.data() as Record<string, unknown>;
  const activityType = normalizeActivityType(data.activityType);
  return {
    id: typeof data.studentId === 'string' ? data.studentId : snap.id,
    activityType,
    name: typeof data.name === 'string' ? data.name : '',
    projectTitle: typeof data.projectTitle === 'string' ? data.projectTitle : '',
    targetAudience: typeof data.targetAudience === 'string' ? data.targetAudience : '',
    feedback: typeof data.feedback === 'string' ? data.feedback : '',
    criterios: fromFirestoreCriteria(data.criterios, activityType),
    criterioObservacoes: fromFirestoreObservations(data.criterioObservacoes, activityType),
    nota: typeof data.nota === 'string' ? data.nota : '',
    updatedAt: formatTimestampIso(data.updatedAt),
  };
}
