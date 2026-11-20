import { useEffect, useRef, useState } from 'react';
import type { ActivityType, ScoreInput, StudentPublicRecord, StudentRecord } from './types.ts';
import {
  type TeacherSession,
  changeTeacherPasswordInFirestore,
  clearTeacherSession,
  createStudentInFirestore,
  deleteStudentInFirestore,
  loginTeacherWithPassword,
  lookupStudentFeedbackByPassword,
  restoreTeacherSession,
  saveStudentFeedbackInFirestore,
  subscribeTeacherStudents,
} from './lib/firestoreFeedback.ts';
import { HomeScreen } from './components/HomeScreen.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { TeacherPanel } from './components/TeacherPanel.tsx';
import { StudentFeedbackView } from './components/StudentFeedbackView.tsx';
import { RubricModal } from './components/RubricModal.tsx';

type ActiveScreen =
  | 'home'
  | 'teacher-login'
  | 'teacher-panel'
  | 'student-login'
  | 'student-view';

export default function App() {
  const [screen, setScreen] = useState<ActiveScreen>('home');
  const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(null);
  const [activeActivity, setActiveActivity] = useState<ActivityType>('projeto');
  const activeActivityRef = useRef<ActivityType>(activeActivity);
  activeActivityRef.current = activeActivity;
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeStudent, setActiveStudent] = useState<StudentPublicRecord | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [rubricActivity, setRubricActivity] = useState<ActivityType>('projeto');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [asyncError, setAsyncError] = useState<Error | null>(null);

  if (asyncError) {
    throw asyncError;
  }

  function showToast(msg: string) {
    setToastMsg(msg);
  }

  function openRubric(activity: ActivityType) {
    setRubricActivity(activity);
    setRubricOpen(true);
  }

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  // Attach real-time Firestore listener when trainer session is active
  useEffect(() => {
    if (!teacherSession || (screen !== 'teacher-panel' && !isPreviewMode)) {
      return;
    }

    setStudentsLoading(true);
    const unsubscribe = subscribeTeacherStudents(
      teacherSession.workspaceKey,
      (list) => {
        setStudents(list);
        setStudentsLoading(false);
        setSelectedId((prev) => {
          const areaList = list.filter((s) => s.activityType === activeActivityRef.current);
          if (prev && areaList.some((s) => s.id === prev)) return prev;
          return areaList[0]?.id ?? null;
        });
      },
      (err) => {
        setStudentsLoading(false);
        setAsyncError(err);
      }
    );

    return () => unsubscribe();
  }, [teacherSession, screen, isPreviewMode]);

  function handleChangeActivity(nextActivity: ActivityType) {
    setActiveActivity(nextActivity);
    const firstInArea = students.find((s) => s.activityType === nextActivity);
    setSelectedId(firstInArea?.id ?? null);
  }

  async function handleOpenTeacherFlow() {
    const existingSession = await restoreTeacherSession();
    if (existingSession) {
      setTeacherSession(existingSession);
      setScreen('teacher-panel');
      return;
    }
    setScreen('teacher-login');
  }

  async function handleTeacherLogin(password: string) {
    const session = await loginTeacherWithPassword(password);
    setTeacherSession(session);
    setScreen('teacher-panel');
  }

  async function handleStudentLogin(password: string) {
    const student = await lookupStudentFeedbackByPassword(password);
    setActiveStudent(student);
    setIsPreviewMode(false);
    setScreen('student-view');
  }

  async function handleChangeTeacherPassword(currentPwd: string, newPwd: string) {
    if (!teacherSession) throw new Error('Sessão expirada.');
    const updated = await changeTeacherPasswordInFirestore(teacherSession, currentPwd, newPwd);
    setTeacherSession(updated);
  }

  async function handleAddStudent(payload: {
    activityType: ActivityType;
    name: string;
    password?: string;
    projectTitle?: string;
    targetAudience?: string;
  }): Promise<StudentRecord> {
    if (!teacherSession) throw new Error('Sessão expirada.');
    const created = await createStudentInFirestore(teacherSession.workspaceKey, students, payload);
    setSelectedId(created.id);
    return created;
  }

  async function handleSaveFeedback(
    id: string,
    payload: {
      projectTitle: string;
      targetAudience: string;
      feedback: string;
      criterios: ScoreInput[];
    }
  ): Promise<StudentRecord> {
    if (!teacherSession) throw new Error('Sessão expirada.');
    const target = students.find((s) => s.id === id);
    if (!target) throw new Error('Formando não encontrado.');
    return await saveStudentFeedbackInFirestore(teacherSession.workspaceKey, target, payload);
  }

  async function handleDeleteStudent(id: string): Promise<void> {
    if (!teacherSession) throw new Error('Sessão expirada.');
    const target = students.find((s) => s.id === id);
    if (!target) return;
    await deleteStudentInFirestore(teacherSession.workspaceKey, target);
  }

  function handleLogout() {
    if (screen === 'teacher-panel' || isPreviewMode) {
      clearTeacherSession();
      setTeacherSession(null);
      setStudents([]);
      setSelectedId(null);
    }
    setActiveStudent(null);
    setIsPreviewMode(false);
    setScreen('home');
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          onSelectTeacher={handleOpenTeacherFlow}
          onSelectStudent={() => setScreen('student-login')}
        />
      )}

      {screen === 'teacher-login' && (
        <LoginScreen
          mode="teacher"
          onBack={() => setScreen('home')}
          onSubmit={handleTeacherLogin}
        />
      )}

      {screen === 'student-login' && (
        <LoginScreen
          mode="student"
          onBack={() => setScreen('home')}
          onSubmit={handleStudentLogin}
        />
      )}

      {screen === 'teacher-panel' && (
        <TeacherPanel
          students={students}
          loading={studentsLoading}
          activeActivity={activeActivity}
          onChangeActivity={handleChangeActivity}
          selectedId={selectedId}
          onSelectStudent={(id) => setSelectedId(id)}
          onAddStudent={handleAddStudent}
          onSaveFeedback={handleSaveFeedback}
          onDeleteStudent={handleDeleteStudent}
          onPreviewStudent={(student) => {
            setActiveStudent(student);
            setIsPreviewMode(true);
            setScreen('student-view');
          }}
          onOpenRubric={openRubric}
          onChangeTeacherPassword={handleChangeTeacherPassword}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}

      {screen === 'student-view' && activeStudent && (
        <StudentFeedbackView
          student={activeStudent}
          isPreview={isPreviewMode}
          onBackToPanel={() => {
            setIsPreviewMode(false);
            setScreen('teacher-panel');
          }}
          onOpenRubric={openRubric}
          onLogout={handleLogout}
        />
      )}

      <RubricModal
        open={rubricOpen}
        initialActivity={rubricActivity}
        onClose={() => setRubricOpen(false)}
      />

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-6 right-6 z-50 bg-[#1a1a2e] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg"
        >
          {toastMsg}
        </div>
      )}
    </>
  );
}
