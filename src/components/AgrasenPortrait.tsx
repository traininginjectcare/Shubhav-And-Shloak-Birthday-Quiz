/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AgrasenPortraitProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AgrasenPortrait: React.FC<AgrasenPortraitProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'h-16 sm:h-20 w-auto',
    md: 'h-24 sm:h-28 md:h-32 w-auto',
    lg: 'h-36 sm:h-44 md:h-52 w-auto',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* Radiant Divine Aura Background Glow (No box/frame) */}
      <div className="absolute inset-0 bg-radial from-[#FFDF73]/40 via-[#D4AF37]/20 to-transparent blur-xl pointer-events-none scale-125" />
      
      {/* Clean Majestic Image of Maharaja Agrasen (No artificial thick frame) */}
      <img
        src="/agrasen_maharaj.jpg"
        alt="Maharaja Agrasen Ji on Throne"
        className={`${sizeStyles[size]} object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] filter contrast-105 brightness-105 transition-transform duration-300 hover:scale-105 relative z-10`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            'https://upload.wikimedia.org/wikipedia/commons/3/35/Shri_Agrasen_Maharaj.jpg';
        }}
      />
    </div>
  );
};
