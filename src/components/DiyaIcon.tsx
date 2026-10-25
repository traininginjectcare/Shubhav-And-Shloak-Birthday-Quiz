/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DiyaIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSparkles?: boolean;
}

export const DiyaIcon: React.FC<DiyaIconProps> = ({
  className = '',
  size = 'md',
  showSparkles = true,
}) => {
  const sizeMap = {
    sm: { width: 32, height: 28 },
    md: { width: 48, height: 42 },
    lg: { width: 72, height: 62 },
    xl: { width: 96, height: 84 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Ambient Pulsing Warm Diya Glow */}
      <div 
        className="absolute rounded-full bg-gradient-to-r from-amber-400/30 via-orange-500/25 to-pink-500/20 blur-lg animate-diya-aura pointer-events-none"
        style={{
          width: width * 1.5,
          height: height * 1.5,
          top: -height * 0.25,
        }}
      />

      {/* SVG Diya with Layered Flickering Flame */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-[0_4px_10px_rgba(255,167,38,0.5)]"
      >
        <defs>
          {/* Flame Gradient */}
          <radialGradient id="flameInner" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFF9C4" />
            <stop offset="60%" stopColor="#FFD54F" />
            <stop offset="85%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>

          {/* Lamp Base Gradient (Festive Terracotta / Pastel Gold Brass) */}
          <linearGradient id="lampBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="35%" stopColor="#FFB74D" />
            <stop offset="70%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </linearGradient>

          {/* Oil Reservoir Rim */}
          <linearGradient id="lampRim" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
        </defs>

        {/* Flickering Flame Group */}
        <g className="animate-flame" style={{ transformOrigin: '50px 42px' }}>
          {/* Outer Flame Glow */}
          <path
            d="M50 8 C42 20, 36 29, 39 39 C41 46, 45 49, 50 49 C55 49, 59 46, 61 39 C64 29, 58 20, 50 8 Z"
            fill="url(#flameInner)"
            opacity="0.9"
          />
          {/* Inner Bright Flame Core */}
          <path
            d="M50 18 C45 26, 43 32, 45 39 C46 43, 48 45, 50 45 C52 45, 54 43, 55 39 C57 32, 55 26, 50 18 Z"
            fill="#FFFDE7"
          />
        </g>

        {/* Diya Wick */}
        <path
          d="M50 42 C49.5 45, 50.5 46, 50 48"
          stroke="#422006"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Diya Base (The Clay/Brass Vessel) */}
        <path
          d="M14 47 C18 68, 34 78, 50 78 C66 78, 82 68, 86 47 C72 52, 28 52, 14 47 Z"
          fill="url(#lampBody)"
        />

        {/* Top Rim of the Diya */}
        <ellipse
          cx="50"
          cy="48"
          rx="36"
          ry="7.5"
          fill="url(#lampRim)"
          stroke="#FFE082"
          strokeWidth="1.2"
        />

        {/* Decorative Ornate Base Pedestal */}
        <path
          d="M38 77 L34 82 C34 82, 43 83.5, 50 83.5 C57 83.5, 66 82, 66 82 L62 77 Z"
          fill="#BF360C"
          stroke="#FFD54F"
          strokeWidth="1"
        />

        {/* Decorative Lotus dots on the Diya rim */}
        <circle cx="28" cy="50" r="1.5" fill="#FFF9C4" />
        <circle cx="39" cy="52" r="1.5" fill="#FFF9C4" />
        <circle cx="50" cy="53" r="1.8" fill="#FFF9C4" />
        <circle cx="61" cy="52" r="1.5" fill="#FFF9C4" />
        <circle cx="72" cy="50" r="1.5" fill="#FFF9C4" />
      </svg>

      {/* Tiny Sparkles around the flame */}
      {showSparkles && (
        <>
          <span 
            className="absolute -top-1 -right-1 text-xs text-amber-200 animate-sparkle pointer-events-none"
            style={{ animationDelay: '0.3s' }}
          >
            ✦
          </span>
          <span 
            className="absolute top-2 -left-2 text-[10px] text-pink-200 animate-sparkle pointer-events-none"
            style={{ animationDelay: '0.8s' }}
          >
            ✨
          </span>
        </>
      )}
    </div>
  );
};
