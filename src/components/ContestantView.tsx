/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Crown, Zap, Flame, ShieldAlert, Award, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContestantView: React.FC = () => {
  const { gameState, currentTeam, loginTeam, logoutTeam, pressBuzzer, teams } = useQuiz();
  const [teamName, setTeamName] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justBuzzed, setJustBuzzed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!teamName.trim()) {
      setErrorMsg('Please enter your Family / Team Name');
      return;
    }
    setIsSubmitting(true);
    const success = await loginTeam(teamName, pin || '1234');
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Invalid PIN or team credentials. Default PIN is 1234.');
    }
  };

  const handleBuzzClick = async () => {
    if (!currentTeam || gameState.buzzerLocked || !gameState.buzzerActive) return;

    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120, 60, 120]);
    }

    setJustBuzzed(true);
    const buzzed = await pressBuzzer();
    if (!buzzed) {
      setJustBuzzed(false);
    }
  };

  // 1. LOGIN SCREEN
  if (!currentTeam) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-radial from-[#4A0E17] via-[#2A050B] to-[#160205]">
        {/* Festive background accents */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#F9E79F] to-[#D4AF37]" />
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#701422]/20 blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          {/* Header Card */}
          <div className="text-center mb-6">
            <div className="inline-flex p-4 rounded-2xl bg-gold-gradient shadow-xl text-[#2A050B] mb-3 border-2 border-white/20">
              <Crown className="w-10 h-10 text-[#3B0610]" />
            </div>
            <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-gold-gradient tracking-wide">
              CONTESTANT PORTAL
            </h1>
            <p className="text-sm font-medium text-amber-100/80 mt-1">
              Agrasen Jayanti Family Quiz
            </p>
          </div>

          {/* Form */}
          <div className="bg-[#380710]/90 border-2 border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#F9E79F] mb-1.5">
                  Family / Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Goyal Royals, Bansal Family"
                  className="w-full px-4 py-3 bg-black/50 border border-amber-500/40 rounded-xl text-slate-100 placeholder:text-amber-200/30 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[#F9E79F] mb-1.5 flex justify-between">
                  <span>Team PIN</span>
                  <span className="text-[10px] text-amber-200/60 lowercase">(default 1234)</span>
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-4 py-3 bg-black/50 border border-amber-500/40 rounded-xl text-slate-100 placeholder:text-amber-200/30 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 font-mono tracking-widest text-center text-lg"
                  maxLength={6}
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-cinzel font-bold text-base bg-gold-gradient text-[#2A050B] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-[#2A050B] fill-current" />
                <span>{isSubmitting ? 'Connecting...' : 'ENTER THE ARENA'}</span>
              </button>
            </form>

            {/* Quick-Join preset teams */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="block text-[11px] uppercase font-bold tracking-wider text-amber-200/60 mb-2">
                Or select pre-registered family:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {teams.slice(0, 6).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTeamName(t.name);
                      setPin(t.pin || '1234');
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-black/40 border border-[#D4AF37]/30 text-amber-200 hover:bg-[#D4AF37]/20 hover:text-white transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Contestant Status Flags
  const didWeBuzz = gameState.buzzedTeam?.toLowerCase() === currentTeam.name.toLowerCase();
  const someoneElseBuzzed = gameState.buzzerLocked && !didWeBuzz;
  const isBuzzerReady = gameState.buzzerActive && !gameState.buzzerLocked;

  // 2 & 3. CONTESTANT ACTIVE / WAIT SCREEN
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between max-w-md mx-auto px-4 py-4 relative bg-[#230409]">
      {/* Top Bar with Team Name, Score, Logout */}
      <div className="bg-[#380710] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient text-[#2A050B] flex items-center justify-center font-black text-xl shadow-md border border-white/20">
              {currentTeam.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-cinzel font-bold text-base sm:text-lg text-slate-100 truncate max-w-[160px]">
                  {currentTeam.name}
                </h2>
                <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
              </div>
              <p className="text-xs text-amber-300/80 font-medium">Contestant Family</p>
            </div>
          </div>

          {/* Live Score Display */}
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200/70">
              Live Score
            </div>
            <div className="font-cinzel font-black text-2xl text-gold-gradient leading-none">
              {currentTeam.score} <span className="text-xs font-sans text-amber-300">PTS</span>
            </div>
          </div>

          <button
            onClick={logoutTeam}
            title="Switch Team"
            className="p-2 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Round & Active Question Banner */}
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/30 text-xs font-semibold text-amber-200">
          {gameState.currentRound || 'Agrasen Jayanti Quiz'}
        </span>
        {gameState.currentQuestion && (
          <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-medium text-amber-100 max-h-16 overflow-y-auto">
            {gameState.currentQuestion}
          </div>
        )}
      </div>

      {/* Main Interactive Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-2">
        <AnimatePresence mode="wait">
          {/* STATE A: WE BUZZED FIRST! */}
          {didWeBuzz && (
            <motion.div
              key="we-buzzed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full text-center p-6 bg-gradient-to-b from-[#5B0E1E] to-[#2D060D] border-2 border-[#D4AF37] rounded-3xl shadow-2xl gold-box-shadow"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center text-[#2A050B] mb-3 animate-bounce shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-[#3B0610]" />
              </div>
              <h3 className="font-cinzel font-black text-2xl text-gold-gradient tracking-wide">
                YOU BUZZED FIRST!
              </h3>
              <p className="text-sm font-semibold text-amber-100 mt-2">
                Your family has the floor!
              </p>
              <div className="mt-4 px-4 py-2 rounded-xl bg-black/40 border border-amber-400/30 text-xs text-amber-200">
                Answer the Quizmaster loud and clear!
              </div>
            </motion.div>
          )}

          {/* STATE B: LOCKED OUT (Another team buzzed) */}
          {someoneElseBuzzed && (
            <motion.div
              key="locked-out"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full text-center p-6 bg-[#2B0A10] border-2 border-rose-500/50 rounded-3xl shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel font-bold text-xl text-rose-300">
                BUZZER LOCKED OUT
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                <span className="font-bold text-amber-300">{gameState.buzzedTeam}</span> buzzed in first!
              </p>
              <p className="text-xs text-slate-400 mt-3">
                Wait for the Quizmaster to unlock the buzzer.
              </p>
            </motion.div>
          )}

          {/* STATE C: BUZZER ACTIVE & READY (BIG TACTILE BUZZ BUTTON!) */}
          {isBuzzerReady && (
            <motion.div
              key="buzzer-active"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              <p className="text-sm font-bold text-amber-200 uppercase tracking-widest mb-4 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300" />
                BUZZER IS LIVE! HIT IT!
              </p>

              {/* Giant 3D Buzz Button */}
              <button
                type="button"
                onClick={handleBuzzClick}
                className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full cursor-pointer focus:outline-none active:scale-95 transition-transform duration-100 group select-none"
              >
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-red-600/40 animate-ping pointer-events-none" />

                {/* Bevel Base */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#8B1E28] to-[#3B070E] p-3 shadow-2xl border-4 border-[#D4AF37]">
                  {/* Red Dome Button */}
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FF2A3D] via-[#D90429] to-[#8D0801] shadow-[inset_0_10px_20px_rgba(255,255,255,0.4),0_12px_25px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-white border-2 border-red-300/40 group-hover:brightness-110">
                    <Zap className="w-14 h-14 sm:w-16 sm:h-16 text-yellow-300 fill-yellow-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] animate-pulse" />
                    <span className="font-cinzel font-black text-3xl sm:text-4xl tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">
                      BUZZ
                    </span>
                  </div>
                </div>
              </button>

              <p className="text-xs text-amber-200/80 mt-5 font-medium">
                Tap anywhere on the red button to buzz first!
              </p>
            </motion.div>
          )}

          {/* STATE D: WAITING FOR QUIZMASTER */}
          {!gameState.buzzerActive && !gameState.buzzerLocked && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-black/40 border border-[#D4AF37]/30 rounded-3xl w-full"
            >
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="p-4 rounded-full bg-gold-gradient text-[#2A050B] relative shadow-lg">
                  <Flame className="w-8 h-8 text-[#5B0E1E] animate-pulse" />
                </div>
              </div>
              <h3 className="font-cinzel font-bold text-xl text-gold-gradient">
                Waiting for Quizmaster...
              </h3>
              <p className="text-xs text-amber-100/70 mt-2 max-w-xs mx-auto">
                Listen carefully to the question. The BUZZ button will appear as soon as the question goes live!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Mini Leaderboard preview */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-3 mt-4">
        <div className="flex items-center justify-between text-xs text-amber-200/80 mb-2 font-semibold">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            Live Standings
          </span>
          <span>Top Teams</span>
        </div>
        <div className="space-y-1">
          {[...teams]
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((t, idx) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-2.5 py-1 rounded text-xs ${
                  t.id === currentTeam.id
                    ? 'bg-[#D4AF37]/20 text-[#F9E79F] font-bold border border-[#D4AF37]/40'
                    : 'text-slate-300'
                }`}
              >
                <span className="truncate">
                  #{idx + 1} {t.name}
                </span>
                <span className="font-mono font-bold">{t.score} pts</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
