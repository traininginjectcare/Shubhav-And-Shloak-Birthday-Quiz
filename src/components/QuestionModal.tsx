/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { ScoreTeam } from './Scoreboard';
import { soundEngine } from '../utils/audio';

interface QuestionModalProps {
  question: QuizQuestion;
  roundName: string;
  roundTheme: string;
  totalQuestions: number;
  teams: ScoreTeam[];
  isAnswered: boolean;
  onClose: () => void;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  onMarkAnswered: (questionId: string) => void;
  onAwardPoints: (teamId: string, delta: number) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  roundName,
  roundTheme,
  totalQuestions,
  teams,
  isAnswered,
  onClose,
  onNextQuestion,
  onPrevQuestion,
  onMarkAnswered,
  onAwardPoints
}) => {
  // Determine default timer based on round (Family relay gets 60s, others 30s)
  const isFamilyRelay = roundName.toLowerCase().includes('family relay');
  const defaultSeconds = isFamilyRelay ? 60 : 30;

  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [timerDuration, setTimerDuration] = useState(defaultSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedAwardTeam, setSelectedAwardTeam] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isZoomMedia, setIsZoomMedia] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset states when question changes
  useEffect(() => {
    const dur = isFamilyRelay ? 60 : 30;
    setTimerDuration(dur);
    setTimeLeft(dur);
    setIsTimerRunning(false);
    setShowAnswer(false);
    setSelectedOption(null);
    setSelectedAwardTeam(null);
    setIsPlayingAudio(false);
    setIsZoomMedia(false);
  }, [question.id, isFamilyRelay]);

  // Timer Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundEngine.playTimeUp();
            return 0;
          }
          if (prev <= 6) {
            soundEngine.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Toggle Timer
  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const handleResetTimer = (seconds?: number) => {
    const s = seconds || timerDuration;
    setIsTimerRunning(false);
    setTimerDuration(s);
    setTimeLeft(s);
  };

  const handleRevealAnswer = useCallback(() => {
    if (!showAnswer) {
      soundEngine.playFanfare();
      onMarkAnswered(question.id);
    }
    setShowAnswer(!showAnswer);
  }, [showAnswer, onMarkAnswered, question.id]);

  const handleAwardPoints = (teamId: string, points: number) => {
    onAwardPoints(teamId, points);
    setSelectedAwardTeam(teamId);
    onMarkAnswered(question.id);
    soundEngine.playScoreChange(points > 0);
  };

  const handlePlayAudio = () => {
    if (!audioRef.current) {
      // If audio element is ready
      soundEngine.playTick();
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4000);
      return;
    }
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        handleToggleTimer();
      } else if (e.key.toLowerCase() === 'r' && e.target === document.body) {
        e.preventDefault();
        handleRevealAnswer();
      } else if (e.key === 'ArrowRight' && onNextQuestion) {
        onNextQuestion();
      } else if (e.key === 'ArrowLeft' && onPrevQuestion) {
        onPrevQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextQuestion, onPrevQuestion, handleToggleTimer, handleRevealAnswer]);

  const timerPercent = (timeLeft / timerDuration) * 100;
  const isUrgent = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-gradient-to-b from-[#2E050C] via-[#220409] to-[#150205] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.4)] text-white overflow-hidden flex flex-col my-auto max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#4A0B16] via-[#2F060D] to-[#4A0B16] border-b border-[#D4AF37]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#D4AF37] text-[#220409] font-cinzel font-black px-3 py-1 rounded-full text-xs md:text-sm tracking-widest shadow-md">
              Q{question.questionNumber} / {totalQuestions}
            </span>
            <div className="hidden sm:block">
              <span className="text-[#FFDF73] font-cinzel font-bold text-sm md:text-base tracking-wide block">
                {roundName}
              </span>
              <span className="text-amber-200/70 text-xs font-medium">
                {roundTheme}
              </span>
            </div>
          </div>

          {/* Points badge & Close button */}
          <div className="flex items-center gap-3">
            <span className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-cinzel font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              +10 Points
            </span>

            {isAnswered && (
              <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Answered
              </span>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Modal Body */}
        <div className="p-5 md:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* Main Question Text - Big and Projector-optimized */}
          <div className="text-center max-w-4xl mx-auto space-y-2">
            <h1 className="font-outfit font-bold text-2xl sm:text-3xl md:text-4xl text-[#FFF8E7] leading-tight drop-shadow-md">
              {question.question}
            </h1>
          </div>

          {/* Media Section (Images, Audio, or Video) */}
          {question.mediaType && question.mediaType !== 'none' && question.mediaUrl && (
            <div className="max-w-3xl mx-auto">
              {question.mediaType === 'image' && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_10px_25px_rgba(0,0,0,0.8)] bg-black/60 group max-h-[300px] flex items-center justify-center">
                  <img
                    src={question.mediaUrl}
                    alt="Quiz Clue"
                    className={`max-h-[300px] w-auto object-contain transition-transform duration-300 ${
                      isZoomMedia ? 'scale-125' : 'group-hover:scale-105'
                    }`}
                  />
                  <button
                    onClick={() => setIsZoomMedia(!isZoomMedia)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 hover:bg-black text-amber-300 border border-amber-400/50 text-xs flex items-center gap-1.5 backdrop-blur-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{isZoomMedia ? 'Reset Zoom' : 'Zoom Clue'}</span>
                  </button>
                </div>
              )}

              {question.mediaType === 'audio' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#4A0B16] to-[#2B050B] border-2 border-amber-400/50 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayAudio}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-5 h-5 fill-stone-950" />
                          <span>Pause Audio Clip</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 fill-stone-950" />
                          <span>Play Audio Track Clue</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audio Waveform Animation */}
                  <div className="flex items-center gap-1 h-8">
                    {[16, 28, 12, 32, 20, 24, 14, 30, 22, 18, 32, 14].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'bg-amber-300 animate-pulse' : 'bg-amber-600/40'
                        }`}
                        style={{ height: isPlayingAudio ? `${h}px` : '8px' }}
                      />
                    ))}
                  </div>

                  <audio
                    ref={audioRef}
                    src={question.mediaUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="hidden"
                  />
                  <span className="text-xs text-amber-200/80 font-medium">
                    Listen carefully to the signature notes or commentary!
                  </span>
                </div>
              )}

              {question.mediaType === 'video' && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-black max-h-[320px] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={question.mediaUrl}
                    controls
                    className="max-h-[320px] w-full object-contain"
                    poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
                  />
                </div>
              )}
            </div>
          )}

          {/* Options Grid (If Multiple Choice is available) */}
          {question.options && question.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-4xl mx-auto">
              {question.options.map((option, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
                const isCorrect = showAnswer && (option.trim().toLowerCase() === question.answer.trim().toLowerCase() || question.answer.toLowerCase().includes(option.toLowerCase()));
                const isUserSelected = selectedOption === option;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(option)}
                    className={`p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                      isCorrect
                        ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(52,211,153,0.4)] scale-[1.02]'
                        : isUserSelected
                        ? 'bg-[#5A0C18] border-amber-400 text-amber-100'
                        : 'bg-black/40 hover:bg-black/60 border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-slate-200'
                    }`}
                  >
                    <span 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-cinzel font-black text-lg shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500 text-emerald-950'
                          : isUserSelected
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-[#4A0B16] border border-amber-400/40 text-amber-200'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-outfit font-bold text-base sm:text-lg md:text-xl flex-1">
                      {option}
                    </span>
                    {isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Reveal Answer Box */}
          {showAnswer && (
            <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#1C3B2B] to-emerald-950/90 border-2 border-emerald-400 p-5 md:p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-200 space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-400/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                    ✓
                  </span>
                  <span className="font-cinzel font-bold text-emerald-300 text-lg md:text-xl tracking-wide">
                    CORRECT ANSWER:
                  </span>
                </div>
                <span className="font-outfit font-black text-xl md:text-2xl text-white drop-shadow">
                  {question.answer}
                </span>
              </div>

              {question.explanation && (
                <div className="pt-2 text-emerald-100/90 text-sm md:text-base leading-relaxed">
                  <span className="font-semibold text-emerald-300 mr-1.5">Trivia & Story:</span>
                  {question.explanation}
                </div>
              )}
            </div>
          )}

          {/* Quick Score Award Bar directly in Question Modal */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-black/40 border border-[#D4AF37]/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-200/90 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Award Points to Buzzed Family Team:
              </span>
              <span className="text-[11px] text-amber-300/70">
                Click a team to give +10 points
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
              {teams.map((team) => {
                const isSelected = selectedAwardTeam === team.id;
                return (
                  <div key={team.id} className="flex items-center">
                    <button
                      onClick={() => handleAwardPoints(team.id, 10)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-300 text-white shadow-md'
                          : 'bg-[#3A070F] hover:bg-[#520B16] border-amber-400/40 text-amber-100 hover:text-white'
                      }`}
                    >
                      <span>{team.name}</span>
                      <span className="text-emerald-400 text-[11px]">+10</span>
                    </button>
                    <button
                      onClick={() => handleAwardPoints(team.id, -5)}
                      title={`Deduct 5 points from ${team.name}`}
                      className="px-1.5 py-1.5 ml-0.5 rounded-r-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/50 text-rose-300 text-[10px] font-bold"
                    >
                      -5
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Control Dock: Timer, Reveal, and Navigation */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#220409] via-[#35070F] to-[#220409] border-t border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Previous Question */}
          <div className="flex items-center gap-2">
            {onPrevQuestion && (
              <button
                onClick={onPrevQuestion}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-semibold flex items-center gap-1 transition-colors"
                title="Previous Question (←)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {/* Stage Timer Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-400/40">
              <div 
                className={`font-cinzel font-black text-xl md:text-2xl min-w-[42px] text-center ${
                  isUrgent 
                    ? 'text-rose-400 animate-pulse' 
                    : timeLeft === 0 
                    ? 'text-rose-500' 
                    : 'text-[#FFDF73]'
                }`}
              >
                {timeLeft}s
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleTimer}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                    isTimerRunning
                      ? 'bg-amber-500 text-stone-950 border-amber-400'
                      : 'bg-[#590C19] text-amber-200 border-amber-400/50 hover:bg-[#721021]'
                  }`}
                  title="Start / Pause Timer (Space)"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleResetTimer(30)}
                  className="px-2 py-1 rounded bg-black/40 hover:bg-white/10 text-stone-400 hover:text-white text-[11px]"
                  title="Reset to 30s"
                >
                  30s
                </button>

                <button
                  onClick={() => handleResetTimer(60)}
                  className="px-2 py-1 rounded bg-black/40 hover:bg-white/10 text-stone-400 hover:text-white text-[11px]"
                  title="Reset to 60s (Family Relay)"
                >
                  60s
                </button>

                <button
                  onClick={() => handleResetTimer(15)}
                  className="px-2 py-1 rounded bg-black/40 hover:bg-white/10 text-stone-400 hover:text-white text-[11px]"
                  title="Reset to 15s (Rapid)"
                >
                  15s
                </button>
              </div>
            </div>
          </div>

          {/* Center: Giant REVEAL ANSWER Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRevealAnswer}
              className={`px-6 py-2.5 rounded-xl font-cinzel font-black text-sm md:text-base tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                showAnswer
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-300'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#B8860B] hover:brightness-110 text-[#240408] border-2 border-amber-200'
              }`}
              title="Reveal Correct Answer (R)"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Answer</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>REVEAL ANSWER</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Next Question */}
          <div className="flex items-center gap-2">
            {onNextQuestion ? (
              <button
                onClick={onNextQuestion}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs md:text-sm flex items-center gap-1 transition-all shadow-md"
                title="Next Question (→)"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
