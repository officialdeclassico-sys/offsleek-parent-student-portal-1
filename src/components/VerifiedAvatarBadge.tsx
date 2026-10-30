import React from 'react';
import glossyBadgeImg from '../assets/images/glossy_black_verification_badge.png';

export interface VerifiedAvatarBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

/**
 * OFFSLEEK Verified Avatar Badge Component
 * Displays the high-resolution glossy black verification badge PNG
 * as a small overlay attached at the bottom-right corner of profile pictures/avatars.
 */
export const VerifiedAvatarBadge: React.FC<VerifiedAvatarBadgeProps> = ({
  size = 'sm',
  className = '',
  title = 'Verified Profile',
}) => {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    sm: 'w-4 h-4 -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 -bottom-1 -right-1',
    lg: 'w-6 h-6 -bottom-1 -right-1',
  }[size];

  return (
    <div className={`absolute pointer-events-none select-none z-20 ${sizeClasses} ${className}`}>
      <img
        src={glossyBadgeImg}
        alt={title}
        title={title}
        className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
};
