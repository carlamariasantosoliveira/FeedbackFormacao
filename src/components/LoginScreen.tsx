import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-8 px-6 sm:px-8 py-4 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <span className="font-display text-lg font-bold text-[#2563eb] whitespace-nowrap shrink-0">
          FeedbackPrivado
        </span>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1a1a2e] border border-slate-200 rounded-lg hover:bg-[#f8faff] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        >
          <h1 className="font-display text-2xl sm:text-[1.75rem] font-bold text-[#1a1a2e] mb-1.5">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mb-7 leading-relaxed">{subtitle}</p>

          <div className="mb-5">
            <label
              htmlFor="login-password-input"
              className="block text-xs font-medium tracking-wide text-slate-600 mb-2"
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
                className="w-full px-4 py-3 pr-11 text-[0.95rem] text-[#1a1a2e] bg-white border border-slate-200 rounded-xl outline-none transition-colors focus:border-[#2563eb]"
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
            className={`w-full py-3 px-5 rounded-xl text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-60 ${
              isTeacher
                ? 'bg-[#1a1a2e] hover:bg-[#2d2d4a]'
                : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
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
