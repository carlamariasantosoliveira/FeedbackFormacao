import { useState, type FormEvent } from 'react';
import { ArrowLeft, ClipboardCheck, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { BackdropWaves } from './BackdropWaves.tsx';

interface LoginScreenProps {
  mode: 'teacher' | 'student';
  onBack: () => void;
  onSubmit: (password: string) => Promise<void>;
}

export function LoginScreen({ mode, onBack, onSubmit }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTeacher = mode === 'teacher';
  const title = isTeacher ? 'Área do Formador' : 'Ver o meu Feedback';
  const subtitle = isTeacher
    ? 'Introduz a tua password de acesso ao painel.'
    : 'Introduz a password individual que recebeste da tua formadora.';
  const label = isTeacher ? 'Password do Formador' : 'A tua Password';
  const buttonLabel = isTeacher ? 'Entrar no Painel' : 'Ver Feedback';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError(isTeacher ? 'Introduz a password do formador.' : 'Introduz a tua password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <BackdropWaves />

      <header className="relative z-10 flex items-center justify-between gap-8 px-6 sm:px-8 py-4 border-b border-blue-100/80 bg-white/75 backdrop-blur-md">
        <span className="font-display text-lg font-extrabold tracking-tight text-[#0B3B8C] whitespace-nowrap shrink-0">
          FeedbackPrivado
        </span>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0F2D6B] bg-white border border-blue-100 rounded-xl hover:bg-blue-50/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[440px] bg-white/95 backdrop-blur-sm border-2 border-white rounded-[24px] p-8 sm:p-10 shadow-[0_24px_56px_rgba(37,99,235,0.14)]"
        >
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                isTeacher
                  ? 'bg-gradient-to-br from-[#0041A8] to-[#0894EB]'
                  : 'bg-gradient-to-br from-[#6A2BE2] to-[#9B63FA]'
              }`}
            >
              {isTeacher ? (
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              ) : (
                <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B3B8C] tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{subtitle}</p>

          <div className="mb-6">
            <label
              htmlFor="login-password-input"
              className="block text-xs font-semibold tracking-wide text-[#0F2D6B] mb-2"
            >
              {label}
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                autoComplete={isTeacher ? 'current-password' : 'off'}
                className={`w-full px-4 py-3 pr-11 text-[0.95rem] text-[#0F2D6B] bg-[#F8FBFF] border border-blue-200/80 rounded-xl outline-none transition-colors ${
                  isTeacher ? 'focus:border-[#0464D9]' : 'focus:border-[#7C3AED]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar password' : 'Mostrar password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-5 rounded-xl text-sm font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-60 ${
              isTeacher
                ? 'bg-gradient-to-r from-[#0041A8] to-[#0894EB] hover:brightness-105'
                : 'bg-gradient-to-r from-[#6A2BE2] to-[#8B5CF6] hover:brightness-105'
            }`}
          >
            {loading ? 'A verificar...' : buttonLabel}
          </button>

          {error && (
            <p role="alert" className="mt-3.5 text-sm text-[#9b2226] font-medium">
              {error}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
