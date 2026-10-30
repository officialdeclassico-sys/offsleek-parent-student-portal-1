import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OffsleekLogo } from './OffsleekLogo';

type ViewportPreset = '390x844' | '360x800' | '430x932' | '320x568' | 'responsive';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewport, setViewport] = useState<ViewportPreset>('390x844');
  const { user, isDemoMode, setIsDemoMode, switchRole } = useAuth();

  const getViewportDimensions = () => {
    switch (viewport) {
      case '320x568':
        return 'w-[320px] h-[568px] rounded-[36px] border-[8px]';
      case '360x800':
        return 'w-[360px] h-[800px] rounded-[44px] border-[10px]';
      case '430x932':
        return 'w-[430px] h-[932px] rounded-[52px] border-[10px]';
      case '390x844':
      default:
        return 'w-[390px] h-[844px] rounded-[48px] border-[10px]';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start py-0 font-sans selection:bg-black selection:text-white">
      {/* Top Device & Environment Control Bar */}
      <header className="w-full bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-xs z-50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 font-bold tracking-wider text-white">
            <div className="w-5 h-5 rounded-md bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
              <OffsleekLogo variant="mark" imgClassName="h-3.5 w-auto" showSubtitle={false} />
            </div>
            <span>OFFSLEEK OS</span>
          </div>
          <div className="hidden md:flex items-center space-x-1 bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 text-[11px]">
            <ShieldAlert className="w-3 h-3 text-neutral-300" />
            <span>Mobile Portal</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Quick Role Switcher (Parent App <-> Student App) */}
          {user && (
            <button
              type="button"
              onClick={switchRole}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-black hover:bg-neutral-200 transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
              title="Click to toggle between Parent and Student Application"
            >
              <span>{user.role === 'parent' ? '👨‍👩‍👧 Parent App' : '🎓 Student App'}</span>
              <span className="text-[9px] text-neutral-600 font-mono">⇄ Switch</span>
            </button>
          )}

          {/* Viewport Dimension Presets for Testing Requirement 7 */}
          <div className="hidden sm:flex items-center space-x-1 bg-neutral-800 px-1 py-0.5 rounded-lg border border-neutral-700">
            {(['320x568', '360x800', '390x844', '430x932'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setViewport(preset)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  viewport === preset ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {preset.replace('x', '×')}
              </button>
            ))}
            <button
              onClick={() => setViewport('responsive')}
              className={`p-1 rounded transition-all ${
                viewport === 'responsive' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Full Responsive"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="flex items-center space-x-1.5 bg-neutral-950 px-2.5 py-0.5 rounded-full border border-neutral-800">
            <span className="text-[10px] text-neutral-400">Mode:</span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                isDemoMode ? 'bg-white text-black shadow-2xs' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {isDemoMode ? 'Demo Sandbox' : 'Production'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center items-center py-2 sm:py-4 px-2">
        <div
          className={
            viewport === 'responsive'
              ? 'w-full max-w-md bg-white text-black flex flex-col h-[844px] max-h-[92vh] shadow-2xl rounded-3xl border border-neutral-800 overflow-hidden relative [transform:translateZ(0)]'
              : `${getViewportDimensions()} border-neutral-900 shadow-2xl bg-white text-black flex flex-col relative overflow-hidden transition-all duration-300 [transform:translateZ(0)]`
          }
        >
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
