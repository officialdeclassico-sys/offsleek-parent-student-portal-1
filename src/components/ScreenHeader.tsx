import React from 'react';
import { ChevronLeft } from 'lucide-react';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backAriaLabel?: string;
  rightAction?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

/**
 * Standardized OFFSLEEK Screen Header
 * - Small, simple, left-facing chevron (18px)
 * - Monochrome black icon, stroke-width 2.2
 * - Mobile touch target 40-44px without enlarging the visible chevron
 * - Chevron and page heading on the same horizontal row
 * - Subtitle placed directly below heading, horizontally aligned with heading text
 * - Zero decorative background or oversized arrows
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backAriaLabel = 'Back',
  rightAction,
  className = '',
  titleClassName = '',
}) => {
  return (
    <header className={`pt-3.5 px-4 pb-1.5 flex items-start justify-between shrink-0 ${className}`}>
      <div className="flex items-start gap-1 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          aria-label={backAriaLabel}
          className="w-10 h-10 -ml-2 -mt-1 rounded-full flex items-center justify-center text-black hover:bg-neutral-100 active:bg-neutral-200 transition-colors shrink-0"
        >
          <ChevronLeft className="w-[18px] h-[18px] stroke-[2.2] text-black" />
        </button>
        <div className="min-w-0 flex-1 pt-1">
          <h1 className={`text-lg font-bold text-black tracking-tight leading-snug ${titleClassName}`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-neutral-500 font-normal mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && (
        <div className="shrink-0 ml-3 pt-0.5">
          {rightAction}
        </div>
      )}
    </header>
  );
};
