/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, Award, Sparkles, X, Medal } from 'lucide-react';
import { ScoreTeam } from './Scoreboard';
import { soundEngine } from '../utils/audio';

interface WinnerCelebrationProps {
  teams: ScoreTeam[];
  onClose: () => void;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({
  teams,
  onClose
}) => {
  // Sort teams descending by score
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  useEffect(() => {
    // Play celebratory victory fanfare
    soundEngine.playFanfare();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-gradient-to-b from-[#3D0812] via-[#240408] to-[#120104] border-4 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(212,175,55,0.7)] text-center text-white overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Festive Confetti / Sparkle Graphics */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                top: `${(i * 19) % 90}%`,
                left: `${(i * 17) % 95}%`,
                animationDuration: `${1.8 + (i % 5) * 0.4}s`,
                animationDelay: `${(i % 4) * 0.2}s`
              }}
            >
              <Sparkles className="w-5 h-5 text-[#FFDF73] opacity-70" />
            </div>
          ))}
        </div>

        {/* Grand Header */}
        <div className="space-y-3 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#590C19] border border-amber-400/50 shadow-inner">
            <Trophy className="w-4 h-4 text-[#FFDF73]" />
            <span className="text-xs md:text-sm font-bold tracking-widest text-[#FFDF73] uppercase">
              Agrasen Jayanti &bull; Family Quiz Champions
            </span>
          </div>

          <h1 className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl text-gold-gradient tracking-wide uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            CONGRATULATIONS!
          </h1>
          <p className="text-sm md:text-base text-amber-200/90 font-medium max-w-xl mx-auto">
            Honoring the sharpest Agarwal families in today's grand contest celebration!
          </p>
        </div>

        {/* 3-Tier Olympic Podium */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto my-8 relative z-10">
          
          {/* 2nd Place (Silver) */}
          {second && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="text-3xl">🥈</span>
                <h3 className="font-outfit font-black text-sm sm:text-lg text-slate-100 truncate max-w-[130px] sm:max-w-none">
                  {second.name}
                </h3>
                <span className="font-cinzel font-bold text-slate-300 text-xs sm:text-sm">
                  {second.score} pts
                </span>
              </div>
              <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-600 border-2 border-slate-300 flex items-center justify-center shadow-lg">
                <span className="font-cinzel font-black text-3xl sm:text-4xl text-slate-200">
                  2
                </span>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Champion) */}
          {first && (
            <div className="flex flex-col items-center">
              <div className="mb-3 text-center scale-105">
                <div className="relative inline-block">
                  <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
                    👑
                  </span>
                </div>
                <h2 className="font-outfit font-black text-base sm:text-2xl text-gold-bright tracking-wide truncate max-w-[160px] sm:max-w-none mt-1">
                  {first.name}
                </h2>
                <div className="mt-1 inline-block bg-[#590C19] border border-[#D4AF37] px-3 py-1 rounded-full shadow-lg">
                  <span className="font-cinzel font-black text-[#FFDF73] text-sm sm:text-lg">
                    {first.score} Points
                  </span>
                </div>
              </div>
              <div className="w-full h-44 sm:h-56 rounded-t-2xl bg-gradient-to-t from-[#8E6C0C] via-[#D4AF37] to-[#FFF1A8] border-4 border-amber-200 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)] text-stone-950">
                <span className="font-cinzel font-black text-5xl sm:text-6xl text-[#3A070F]">
                  1
                </span>
                <span className="font-cinzel font-bold text-xs tracking-widest uppercase text-[#3A070F] mt-1">
                  CHAMPION
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {third && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <span className="text-3xl">🥉</span>
                <h3 className="font-outfit font-black text-sm sm:text-lg text-amber-200 truncate max-w-[130px] sm:max-w-none">
                  {third.name}
                </h3>
                <span className="font-cinzel font-bold text-amber-300 text-xs sm:text-sm">
                  {third.score} pts
                </span>
              </div>
              <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-amber-950 to-amber-800 border-2 border-amber-600 flex items-center justify-center shadow-lg">
                <span className="font-cinzel font-black text-3xl sm:text-4xl text-amber-300">
                  3
                </span>
              </div>
            </div>
          )}
        </div>

        {/* All Remaining Standings */}
        {sorted.length > 3 && (
          <div className="max-w-md mx-auto my-6 p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-left">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 font-cinzel text-center">
              Full Standings
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {sorted.slice(3).map((team, idx) => (
                <div key={team.id} className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-stone-300">
                    <span className="text-amber-400 font-bold mr-2">#{idx + 4}</span>
                    {team.name}
                  </span>
                  <span className="font-cinzel font-bold text-amber-200">{team.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 flex justify-center gap-3 relative z-10">
          <button
            onClick={() => soundEngine.playFanfare()}
            className="px-6 py-2.5 rounded-xl bg-[#590C19] hover:bg-[#721021] border border-amber-400/50 text-amber-200 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Play Victory Fanfare
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-lg tracking-wide uppercase"
          >
            Back to Quiz Display
          </button>
        </div>
      </div>
    </div>
  );
};
