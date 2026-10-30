import React from 'react';
import offsleekLogoAsset from '../assets/images/OFFSLEEK Floating Molecule Logo.png';

export interface OffsleekLogoProps {
  variant?: 'full' | 'mark' | 'header' | 'compact' | 'tile';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  onClick?: () => void;
}

/**
 * OFFSLEEK School OS — Official Floating Molecule Logo Component
 * Single source of truth using the original asset: "OFFSLEEK Floating Molecule Logo.png"
 */
export const OffsleekLogo: React.FC<OffsleekLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  imgClassName = '',
  showSubtitle = true,
  subtitle = 'SCHOOL OS',
  onClick,
}) => {
  // Size presets
  const sizeStyles = {
    xs: { h: 'h-6', imgH: 'h-6', tile: 'w-6 h-6 rounded-lg', text: 'text-[10px]', sub: 'text-[7px]' },
    sm: { h: 'h-8', imgH: 'h-8', tile: 'w-8 h-8 rounded-xl', text: 'text-xs', sub: 'text-[8px]' },
    md: { h: 'h-10', imgH: 'h-10', tile: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl', text: 'text-xs sm:text-sm', sub: 'text-[8px] sm:text-[9px]' },
    lg: { h: 'h-14', imgH: 'h-14', tile: 'w-12 h-12 rounded-2xl', text: 'text-sm sm:text-base', sub: 'text-[9px] sm:text-[10px]' },
    xl: { h: 'h-20', imgH: 'h-20', tile: 'w-16 h-16 rounded-2xl', text: 'text-base sm:text-lg', sub: 'text-[10px] sm:text-xs' },
  }[size];

  // 1. Mark variant: Pure molecule logo mark
  if (variant === 'mark') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center overflow-hidden bg-white ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="OFFSLEEK"
      >
        <img
          src={offsleekLogoAsset}
          alt="OFFSLEEK Floating Molecule Logo"
          className={`object-contain select-none pointer-events-none ${imgClassName || sizeStyles.imgH}`}
        />
      </div>
    );
  }

  // 2. Tile variant: Square app tile containing the floating molecule logo mark
  if (variant === 'tile') {
    return (
      <div
        onClick={onClick}
        className={`relative ${sizeStyles.tile} bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center overflow-hidden p-1 shrink-0 ${onClick ? 'cursor-pointer hover:border-neutral-400 transition-colors' : ''} ${className}`}
        title="OFFSLEEK School OS"
      >
        <img
          src={offsleekLogoAsset}
          alt="OFFSLEEK Floating Molecule Logo"
          className="w-full h-full object-contain scale-110 select-none pointer-events-none"
        />
      </div>
    );
  }

  // 3. Header variant: Standard portal header lockup with the official tile & brand text
  if (variant === 'header') {
    return (
      <div 
        onClick={onClick}
        className={`flex items-center space-x-2.5 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      >
        <div className={`relative ${sizeStyles.tile} bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center overflow-hidden p-1 shrink-0 group-hover:border-neutral-300 transition-colors`}>
          <img
            src={offsleekLogoAsset}
            alt="OFFSLEEK Floating Molecule Logo"
            className="w-full h-full object-contain scale-110 select-none pointer-events-none"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-xs font-bold tracking-[0.16em] text-black uppercase leading-none">
            OFFSLEEK
          </h2>
          {showSubtitle && (
            <p className="text-[8px] tracking-[0.22em] font-medium text-neutral-500 uppercase mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 4. Compact variant: Horizontal logo image
  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center space-x-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img
          src={offsleekLogoAsset}
          alt="OFFSLEEK Floating Molecule Logo"
          className={`object-contain select-none ${imgClassName || sizeStyles.imgH}`}
        />
      </div>
    );
  }

  // 5. Full variant (default): Full original Floating Molecule Logo asset with wordmark and shadow
  return (
    <div 
      onClick={onClick}
      className={`inline-flex flex-col items-start ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src={offsleekLogoAsset}
        alt="OFFSLEEK Floating Molecule Logo"
        className={`w-auto object-contain select-none ${imgClassName || sizeStyles.imgH}`}
      />
      {showSubtitle && subtitle && (
        <span className="text-[8px] sm:text-[9px] tracking-[0.24em] font-semibold text-neutral-500 uppercase mt-1 pl-0.5">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export default OffsleekLogo;
