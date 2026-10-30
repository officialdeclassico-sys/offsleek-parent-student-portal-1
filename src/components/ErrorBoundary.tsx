import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-black selection:text-white font-sans">
          <div className="w-full max-w-md bg-white text-black rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-5 text-center">
            
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-900 shadow-xs">
              <ShieldAlert className="w-7 h-7 stroke-[1.8]" />
            </div>

            {/* Error Message */}
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-black tracking-tight">
                {this.props.fallbackTitle || 'Application Restored'}
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                An unexpected display issue occurred in this view. Your session and school records are secure.
              </p>
            </div>

            {/* Error Details (Collapsible) */}
            {this.state.error && (
              <details className="text-left bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 text-[11px] text-neutral-700">
                <summary className="font-semibold text-neutral-800 cursor-pointer select-none">
                  Technical Details
                </summary>
                <p className="mt-2 font-mono text-[10px] text-red-600 break-all leading-normal">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 p-2 bg-neutral-100 rounded-lg text-[9px] text-neutral-600 overflow-x-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset to Home</span>
              </button>
              
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
            </div>

            <p className="text-[10px] text-neutral-400">
              OFFSLEEK School OS Safeguard Protection
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
