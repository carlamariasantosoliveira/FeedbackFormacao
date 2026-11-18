import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

function formatFriendlyError(rawMessage: string): string {
  try {
    const parsed = JSON.parse(rawMessage) as { error?: string };
    if (typeof parsed?.error === 'string') {
      if (parsed.error.toLowerCase().includes('quota exceeded')) {
        return 'O limite diário gratuito da base de dados foi atingido. Tenta novamente amanhã.';
      }
      if (parsed.error.toLowerCase().includes('permission')) {
        return 'Sem permissões para aceder ou guardar estes dados na base de dados.';
      }
      return parsed.error;
    }
  } catch {
    // Plain error message
  }
  return rawMessage || 'Ocorreu um erro inesperado na aplicação.';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: formatFriendlyError(error.message),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafbff] px-5 py-10">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-[#fde8e8] text-[#9b2226] flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="font-display text-xl font-bold text-[#1a1a2e] mb-2">
              Algo não correu como esperado
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1a1a2e] rounded-xl hover:bg-[#2d2d4a] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Recarregar Aplicação</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
