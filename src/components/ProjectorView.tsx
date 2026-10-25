/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Crown, Trophy, Sparkles, Clock, Flame, Zap, Award, Image as ImageIcon, Video, Star, Volume2, Music, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectorView: React.FC = () => {
  const { gameState, teams } = useQuiz();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [drumrollActive, setDrumrollActive] = useState(false);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  const confettiIntervalRef = useRef<number | null>(null);

  // Timer countdown handler
  useEffect(() => {
    if (gameState.timerStatus === 'running' && gameState.timerEndTime) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((gameState.timerEndTime! - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining > 0 && remaining <= 5) {
          soundEngine.playTick();
        }

        if (remaining <= 0) {
          soundEngine.playTimeUp();
          setTimeLeft(0);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 500);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [gameState.timerStatus, gameState.timerEndTime]);

  // Grand Finale Winner Sequence
  useEffect(() => {
    if (gameState.showWinner) {
      setDrumrollActive(true);
      setShowWinnerAnimation(false);

      // Play dramatic drumroll
      soundEngine.playDrumroll(3.2).then(() => {
        setDrumrollActive(false);
        setShowWinnerAnimation(true);
        soundEngine.playFanfare();

        // Launch celebratory confetti barrage
        triggerRoyalConfetti();
        confettiIntervalRef.current = window.setInterval(() => {
          triggerRoyalConfetti();
        }, 1800);
      });
    } else {
      setDrumrollActive(false);
      setShowWinnerAnimation(false);
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }

    return () => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    };
  }, [gameState.showWinner]);

  const triggerRoyalConfetti = () => {
    // Left side burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#D4AF37', '#FFD700', '#800020', '#FFFFFF', '#FFA500']
    });

    // Right side burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#D4AF37', '#FFD700', '#800020', '#FFFFFF', '#FFA500']
    });

    // Center star blast
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#FFE885', '#D4AF37', '#FAF0BE', '#FF4500']
    });
  };

  // Sorted teams for leaderboard
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winningTeam = gameState.winnerTeam || (sortedTeams.length > 0 ? sortedTeams[0].name : 'Contestant Families');
  const winningScore = sortedTeams.length > 0 ? sortedTeams[0].score : 0;

  // 1. GRAND FINALE WINNER OVERLAY
  if (gameState.showWinner) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden select-none">
        {/* Animated Background Lights */}
        <div className="absolute inset-0 bg-radial from-[#5B0E1E]/60 via-[#1F0307]/90 to-black pointer-events-none" />

        {/* DRUMROLL SUSPENSE STAGE */}
        {drumrollActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative z-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gold-gradient p-1 mb-6 animate-spin">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Crown className="w-12 h-12 text-[#D4AF37]" />
              </div>
            </div>
            <h2 className="font-cinzel font-black text-3xl sm:text-5xl text-gold-gradient tracking-widest animate-pulse">
              CALCULATING FINAL SCORES...
            </h2>
            <p className="text-xl text-amber-200/80 font-serif italic mt-4">
              And the champion of Agrasen Jayanti 2026 is...
            </p>
          </motion.div>
        )}

        {/* WINNER EXPLOSION STAGE */}
        {showWinnerAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 90 }}
            className="text-center relative z-20 max-w-4xl px-4"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-gold-bright text-sm sm:text-base font-cinzel font-bold tracking-widest uppercase mb-6 shadow-2xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>GRAND QUIZ CHAMPIONS</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>

            <div className="my-2">
              <Crown className="w-20 h-20 sm:w-28 sm:h-28 mx-auto text-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.8)] animate-bounce" />
            </div>

            {/* Giant Glowing Golden Letters for Winning Family */}
            <h1 className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl tracking-wider text-gold-bright animate-winner-glow my-4 leading-tight">
              {winningTeam}
            </h1>

            <div className="inline-block p-4 sm:p-6 rounded-3xl bg-[#3B070E]/80 border-2 border-[#D4AF37] shadow-2xl gold-box-shadow mt-4">
              <div className="font-cinzel text-xl sm:text-2xl text-amber-200">
                FINAL SCORE:{' '}
                <span className="font-black text-3xl sm:text-4xl text-gold-gradient ml-2">
                  {winningScore} POINTS
                </span>
              </div>
              <p className="text-sm sm:text-base text-amber-100/90 mt-2 font-serif italic">
                Jai Maharaja Agrasen! Heartiest congratulations on a glorious victory!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // 2. STANDARD PROJECTOR LAYOUT (High Impact 16:9 Widescreen)
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#1B0306] flex flex-col p-4 sm:p-6 lg:p-8 relative select-none">
      {/* Decorative Ornate Top Border */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#FFF4D2] to-[#D4AF37] shadow-lg" />

      {/* Main Grid: Left 70% Stage / Right 30% Leaderboard */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-7xl mx-auto w-full">
        {/* MAIN STAGE (Question, Media, or Idle Welcome) */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#380710] to-[#200307] border-3 border-[#D4AF37]/50 shadow-2xl relative overflow-hidden">
          {/* Subtle Toran / Festive corner flourishes */}
          <div className="absolute top-3 left-3 text-[#D4AF37]/40 text-lg">✦</div>
          <div className="absolute top-3 right-3 text-[#D4AF37]/40 text-lg">✦</div>
          <div className="absolute bottom-3 left-3 text-[#D4AF37]/40 text-lg">✦</div>
          <div className="absolute bottom-3 right-3 text-[#D4AF37]/40 text-lg">✦</div>

          {/* BUZZER LOCKOUT OVERLAY RIBBON */}
          {gameState.buzzerLocked && gameState.buzzedTeam && (
            <div className="absolute top-0 inset-x-0 z-30 py-3.5 px-6 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-cinzel font-black text-center shadow-2xl border-b-2 border-white animate-buzz-pulse">
              <div className="flex items-center justify-center gap-3 text-lg sm:text-2xl drop-shadow">
                <Zap className="w-6 h-6 text-yellow-300 fill-current animate-bounce" />
                <span>⚡ BUZZED FIRST BY: {gameState.buzzedTeam.toUpperCase()} ⚡</span>
                <Zap className="w-6 h-6 text-yellow-300 fill-current animate-bounce" />
              </div>
            </div>
          )}

          {/* A. IDLE STATE: WELCOME BANNER */}
          {gameState.screenState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-2xl bg-gold-gradient p-1 mb-5 shadow-2xl">
                <div className="w-full h-full rounded-2xl bg-[#3B070E] flex items-center justify-center">
                  <Crown className="w-12 h-12 text-[#D4AF37]" />
                </div>
              </div>

              <span className="text-xs sm:text-sm uppercase tracking-widest font-bold text-amber-300 px-4 py-1 rounded-full bg-black/40 border border-[#D4AF37]/30 mb-3">
                Agrawal Samaj Maha Gathering
              </span>

              <h1 className="font-cinzel font-black text-4xl sm:text-5xl lg:text-6xl text-gold-gradient tracking-wide leading-tight">
                AGRASEN JAYANTI
              </h1>

              <h2 className="font-rozha text-2xl sm:text-3xl text-amber-100/90 mt-2 font-normal">
                Grand Family Quiz Competition
              </h2>

              <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />

              <p className="text-sm sm:text-base text-amber-100/80 max-w-lg leading-relaxed">
                Connect your smartphones to the Contestant portal to buzz in real-time. Welcome all 300+ esteemed families!
              </p>

              <div className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/40 text-amber-300 text-xs sm:text-sm font-semibold">
                <Flame className="w-4 h-4 text-orange-400 fill-current" />
                <span>Quiz starting shortly with the blessings of Maharaja Agrasen & Goddess Mahalaxmi</span>
              </div>
            </div>
          )}

          {/* B. MEDIA STATE: FULL SCREEN IMAGE / VIDEO */}
          {gameState.screenState === 'media' && (
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-full h-full max-h-[500px] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-black flex items-center justify-center">
                {gameState.mediaType === 'image' && (
                  <img
                    src={gameState.mediaUrl}
                    alt="Quiz Visual"
                    className="w-full h-full object-contain"
                  />
                )}

                {gameState.mediaType === 'video' && (
                  <video
                    src={gameState.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}

                {gameState.mediaType === 'audio' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#30060C] to-[#120204] space-y-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gold-gradient p-1 shadow-2xl animate-pulse">
                      <div className="w-full h-full rounded-full bg-[#200307] flex items-center justify-center">
                        <Music className="w-12 h-12 text-[#D4AF37]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-cinzel font-bold tracking-widest uppercase">
                        AUDIO ROUND: SUNO SUNO
                      </span>
                      <h3 className="font-cinzel font-bold text-2xl text-gold-gradient">
                        Listen Carefully to the Clip
                      </h3>
                      <p className="text-xs text-amber-100/70">
                        Identify the song hook, movie signature score, or historic commentary!
                      </p>
                    </div>
                    <audio
                      src={gameState.mediaUrl}
                      controls
                      autoPlay
                      className="w-full max-w-md accent-amber-500 mt-2"
                    />
                  </div>
                )}

                {gameState.mediaType === 'youtube' && (
                  <div className="w-full h-full aspect-video">
                    <iframe
                      src={gameState.mediaUrl.replace('watch?v=', 'embed/')}
                      title="YouTube media round"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {gameState.currentQuestion && (
                <div className="mt-4 p-4 rounded-xl bg-black/70 border border-[#D4AF37]/40 w-full text-center">
                  <p className="text-lg font-bold text-amber-100">{gameState.currentQuestion}</p>
                </div>
              )}
            </div>
          )}

          {/* C. QUESTION STATE: HIGH IMPACT QUESTION + OPTIONS */}
          {gameState.screenState === 'question' && (
            <div className="flex-1 flex flex-col justify-between">
              {/* Question Header & Round */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-black/50 border border-[#D4AF37]/40 text-xs sm:text-sm font-cinzel font-bold text-[#F9E79F] tracking-wide">
                    {gameState.currentRound || 'Maharaja Agrasen Round'}
                  </span>

                  {/* Active Timer Pill on Main Screen */}
                  {timeLeft !== null && (
                    <div
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-base font-cinzel font-bold shadow-lg ${
                        timeLeft <= 5
                          ? 'bg-rose-600/40 text-rose-300 border-rose-500 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}s</span>
                    </div>
                  )}
                </div>

                {/* Big Readable Question text for 300 audience members */}
                <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl text-slate-50 leading-snug tracking-normal mt-2">
                  {gameState.currentQuestion}
                </h2>

                {/* Inline media clip player if question has attached audio or image */}
                {gameState.mediaUrl && gameState.mediaType === 'audio' && (
                  <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-[#D4AF37]/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-[#2A050B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                        Suno Suno Audio Clip:
                      </span>
                      <audio src={gameState.mediaUrl} controls autoPlay className="w-full h-8" />
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Multiple Choice Grid */}
              {gameState.options && gameState.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
                  {gameState.options.map((option, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-black/40 border-2 border-amber-500/30 hover:border-[#D4AF37] flex items-center gap-3 transition-colors shadow-md"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gold-gradient text-[#2A050B] font-cinzel font-black text-lg flex items-center justify-center shrink-0 shadow">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base sm:text-lg font-medium text-slate-100 leading-snug">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Projector Status Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/70 font-medium">
                <span>Agrasen Jayanti 2026</span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Press Buzzer on your mobile phones!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR: LIVE AUDIENCE SCOREBOARD */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-b from-[#34070F] to-[#200307] border-2 border-[#D4AF37]/40 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="font-cinzel font-black text-xl text-gold-gradient">
                  LEADERBOARD
                </h3>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-500/30">
                LIVE
              </span>
            </div>

            {/* Teams Leaderboard List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {sortedTeams.map((team, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <div
                    key={team.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isTop1
                        ? 'bg-gradient-to-r from-[#D4AF37]/25 via-amber-500/15 to-[#D4AF37]/25 border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/50'
                        : 'bg-black/35 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-cinzel font-black text-sm shrink-0 ${
                          isTop1
                            ? 'bg-gold-gradient text-[#2A050B] shadow'
                            : isTop2
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : isTop3
                            ? 'bg-amber-700 text-amber-100 font-bold'
                            : 'bg-white/10 text-amber-200/80 font-bold'
                        }`}
                      >
                        {isTop1 ? <Crown className="w-5 h-5 text-[#3B0610]" /> : `#${index + 1}`}
                      </div>

                      <div className="truncate">
                        <div className="font-cinzel font-bold text-sm sm:text-base text-slate-100 truncate">
                          {team.name}
                        </div>
                        {team.buzzerPressed && (
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 fill-current" /> Buzzed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-cinzel font-black text-lg sm:text-xl text-gold-gradient shrink-0 font-mono">
                      {team.score} <span className="text-[10px] text-amber-300 font-sans">PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Footer Motto */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] font-serif text-amber-200/70 italic">
              "Ek Eent Aur Ek Rupaya" — Samajik Samarasta & Ekta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
