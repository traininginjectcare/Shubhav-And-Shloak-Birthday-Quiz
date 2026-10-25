/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Clock, Eye, Crown, Headphones, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import { QUIZ_ROUNDS } from '../data/quizQuestions';

interface RoundRulesModalProps {
  activeRoundId: number;
  onClose: () => void;
  onSelectRound: (roundId: number) => void;
}

export const RoundRulesModal: React.FC<RoundRulesModalProps> = ({
  activeRoundId,
  onClose,
  onSelectRound
}) => {
  const getRoundIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Eye className="w-5 h-5 text-amber-300" />;
      case 2:
        return <Crown className="w-5 h-5 text-amber-300" />;
      case 3:
        return <Headphones className="w-5 h-5 text-amber-300" />;
      case 4:
        return <Clock className="w-5 h-5 text-amber-300" />;
      case 5:
        return <Video className="w-5 h-5 text-amber-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#34070E] via-[#240408] to-[#170205] border-2 border-[#D4AF37] rounded-3xl max-w-3xl w-full p-6 text-white shadow-[0_0_50px_rgba(212,175,55,0.4)] relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#590C19] border border-[#D4AF37] flex items-center justify-center text-amber-300 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-cinzel font-bold text-gold-gradient">
                Quiz Rounds & Game Rules
              </h2>
              <p className="text-xs text-amber-200/70 font-medium">
                5 Engaging Rounds &bull; 10 Questions Per Round &bull; Agrasen Jayanti Contest
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rounds List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 custom-scrollbar">
          {QUIZ_ROUNDS.map((round) => {
            const isSelected = round.id === activeRoundId;

            return (
              <div
                key={round.id}
                onClick={() => onSelectRound(round.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#5E1220] to-[#3B070F] border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-black/30 hover:bg-black/50 border-amber-900/40 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4A0B16] border border-amber-400/50 flex items-center justify-center">
                      {getRoundIcon(round.id)}
                    </div>
                    <div>
                      <h3 className="font-cinzel font-bold text-base md:text-lg text-amber-100">
                        {round.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#FFDF73] bg-[#590C19] px-2 py-0.5 rounded-full border border-amber-400/30">
                        Theme: {round.theme}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Round
                    </span>
                  )}
                </div>

                <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-amber-400/20 text-xs md:text-sm text-stone-200 leading-relaxed">
                  <span className="font-bold text-amber-300 mr-1.5">How It Works:</span>
                  {round.howItWorks}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/70">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">Scoring:</span>
            <span>+10 points for correct answer, -5 points penalty for wrong answer.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
