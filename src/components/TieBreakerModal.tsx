/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  Zap, 
  Hash, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { FinalistTeam, StageQuestion } from '../types/quiz';
import { soundEngine } from '../utils/audio';

interface TieBreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: FinalistTeam[];
  tieBreakerQuestions: StageQuestion[];
  onAwardTieBreaker: (winningTeamId: string, points?: number) => void;
}

export const TieBreakerModal: React.FC<TieBreakerModalProps> = ({
  isOpen,
  onClose,
  teams,
  tieBreakerQuestions,
  onAwardTieBreaker,
}) => {
  const [mode, setMode] = useState<'buzzer' | 'numeric'>('buzzer');
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [buzzedTeamId, setBuzzedTeamId] = useState<string | null>(null);
  const [numericGuesses, setNumericGuesses] = useState<{ [teamId: string]: string }>({});
  const [revealedAnswer, setRevealedAnswer] = useState<boolean>(false);
  const [winnerTeamId, setWinnerTeamId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentQuestions = tieBreakerQuestions.filter((q) =>
    mode === 'buzzer' ? q.category.includes('Buzzer') : q.category.includes('Closest')
  );
  const activeQ = currentQuestions[selectedQuestionIdx] || currentQuestions[0] || tieBreakerQuestions[0];

  const handleBuzz = (teamId: string) => {
    soundEngine.playBuzzer();
    setBuzzedTeamId(teamId);
  };

  const handleSelectWinner = (teamId: string) => {
    soundEngine.playFanfare();
    setWinnerTeamId(teamId);
    onAwardTieBreaker(teamId, 1);
  };

  const handleReset = () => {
    setBuzzedTeamId(null);
    setRevealedAnswer(false);
    setWinnerTeamId(null);
    setNumericGuesses({});
  };

  // Find closest guess if in numeric mode
  const getClosestTeam = () => {
    if (!activeQ?.numericAnswer) return null;
    const target = activeQ.numericAnswer;
    let closestTeamId: string | null = null;
    let smallestDiff = Infinity;

    Object.entries(numericGuesses).forEach(([teamId, guessStr]) => {
      const val = parseFloat(guessStr);
      if (!isNaN(val)) {
        const diff = Math.abs(val - target);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestTeamId = teamId;
        }
      }
    });
    return closestTeamId;
  };

  const suggestedNumericWinner = getClosestTeam();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1E0E36] via-[#140826] to-[#0A0214] border-2 border-amber-400/70 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(255,183,77,0.4)] text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/30 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-amber-400 flex items-center justify-center text-amber-300">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg sm:text-2xl text-gold-gradient">
                Tie-Breaker Arena
              </h2>
              <p className="text-xs text-amber-200/70">
                Diwali Party Family Quiz &bull; Sudden Death &amp; Closest Guess
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

        {/* Mode Selector */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => {
              setMode('buzzer');
              handleReset();
            }}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs sm:text-sm font-cinzel font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'buzzer'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 border-amber-300 shadow-md'
                : 'bg-black/40 border-stone-700 text-stone-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1. Sudden-Death Buzzer</span>
          </button>

          <button
            onClick={() => {
              setMode('numeric');
              handleReset();
            }}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs sm:text-sm font-cinzel font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'numeric'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 border-amber-300 shadow-md'
                : 'bg-black/40 border-stone-700 text-stone-300 hover:text-white'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>2. Closest Numerical Answer</span>
          </button>
        </div>

        {/* Active Question Box */}
        <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/40 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-200/70">
            <span className="font-semibold text-amber-300">
              {mode === 'buzzer' ? 'Buzzer Sudden-Death Question' : 'Estimate Closest Numerical Target'}
            </span>
            <div className="flex gap-1">
              {currentQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedQuestionIdx(i);
                    handleReset();
                  }}
                  className={`w-6 h-6 rounded-md text-xs font-bold ${
                    selectedQuestionIdx === i
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-white/10 text-stone-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <h3 className="font-outfit font-bold text-lg sm:text-xl text-white">
            {activeQ?.question || 'Question will be added later'}
          </h3>

          {/* Reveal answer button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setRevealedAnswer(!revealedAnswer)}
              className="text-xs text-amber-300 hover:underline font-semibold"
            >
              {revealedAnswer ? 'Hide Correct Answer' : 'Reveal Correct Answer'}
            </button>

            {revealedAnswer && (
              <span className="text-sm font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/40">
                Answer: {activeQ?.correctAnswer}
              </span>
            )}
          </div>
        </div>

        {/* Mode Specific Interaction */}
        {mode === 'buzzer' ? (
          <div className="space-y-3 mb-4">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wider font-cinzel">
              Click whichever team buzzed first:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {teams.map((t) => {
                const isBuzzed = buzzedTeamId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleBuzz(t.id)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                      isBuzzed
                        ? 'bg-amber-400 text-stone-950 border-amber-200 scale-105 shadow-[0_0_20px_rgba(212,175,55,0.7)]'
                        : 'bg-[#3A070F] hover:bg-[#520B16] border-amber-400/40 text-stone-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    {isBuzzed && <span className="text-[10px] bg-stone-950 text-amber-300 px-2 py-0.5 rounded-full font-black">BUZZED FIRST!</span>}
                  </button>
                );
              })}
            </div>

            {buzzedTeamId && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-between">
                <span className="text-xs text-emerald-200">
                  Did <b>{teams.find((t) => t.id === buzzedTeamId)?.name}</b> answer correctly?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectWinner(buzzedTeamId)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs"
                  >
                    CORRECT (AWARD WIN)
                  </button>
                  <button
                    onClick={() => setBuzzedTeamId(null)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-bold"
                  >
                    WRONG (REOPEN)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Numeric Mode: Collect guesses from tied teams */
          <div className="space-y-3 mb-4">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wider font-cinzel">
              Enter each team's written estimate/number:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {teams.map((t) => (
                <div key={t.id} className="p-2 rounded-xl bg-black/40 border border-amber-400/30 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-stone-200 truncate flex-1">
                    {t.name}
                  </span>
                  <input
                    type="number"
                    placeholder="Guess"
                    value={numericGuesses[t.id] || ''}
                    onChange={(e) =>
                      setNumericGuesses((prev) => ({ ...prev, [t.id]: e.target.value }))
                    }
                    className="w-24 bg-stone-900 border border-amber-400/40 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-amber-300"
                  />
                </div>
              ))}
            </div>

            {suggestedNumericWinner && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-between">
                <span className="text-xs text-amber-200">
                  Closest Guess: <b>{teams.find((t) => t.id === suggestedNumericWinner)?.name}</b>
                </span>
                <button
                  onClick={() => handleSelectWinner(suggestedNumericWinner)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-xs"
                >
                  Award Tie-Breaker Win
                </button>
              </div>
            )}
          </div>
        )}

        {/* Winner Declared Banner */}
        {winnerTeamId && (
          <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 text-stone-950 font-cinzel font-black text-center text-sm shadow-lg animate-in zoom-in-95">
            🏆 {teams.find((t) => t.id === winnerTeamId)?.name} WINS THE TIE-BREAKER!
          </div>
        )}

        {/* Footer controls */}
        <div className="pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Round</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
