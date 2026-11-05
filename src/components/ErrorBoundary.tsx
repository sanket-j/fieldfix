import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in FieldFix:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('fieldfix_active_user');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6 text-stone-800">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#EAE3D2] p-8 shadow-md text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0F4C5C] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              An unexpected error occurred while loading the application.
            </p>
            {this.state.error && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-left font-mono text-xs text-stone-600 mb-6 overflow-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#134E5E] transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
