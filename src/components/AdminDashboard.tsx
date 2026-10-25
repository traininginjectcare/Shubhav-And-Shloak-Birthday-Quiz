/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { MediaType, ScreenState, QuizQuestion, RoundInfo } from '../types';
import {
  Sliders,
  Play,
  RotateCcw,
  Clock,
  Plus,
  Minus,
  Trophy,
  Video,
  Image as ImageIcon,
  Youtube,
  Tv,
  Users,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  Trash2,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle,
  AlertCircle,
  Crown,
  Headphones,
  Info,
  Layers,
  ArrowRight,
  Radio,
  Zap,
  Music
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const AdminDashboard: React.FC = () => {
  const {
    gameState,
    teams,
    questions,
    rounds,
    currentQuestionIdx,
    loadQuestion,
    nextQuestion,
    prevQuestion,
    pushMedia,
    startTimer,
    stopTimer,
    resetBuzzer,
    adjustScore,
    addNewTeam,
    deleteTeam,
    revealWinner,
    hideWinner,
    setScreenState,
    resetGameSession
  } = useQuiz();

  // Selected round filter for tabs
  const [selectedRoundId, setSelectedRoundId] = useState<number>(() => {
    const matchedRound = rounds.find(r => r.name === gameState.currentRound);
    return matchedRound ? matchedRound.id : 1;
  });

  // Media inputs state
  const [mediaInputUrl, setMediaInputUrl] = useState(gameState.mediaUrl || '');
  const [mediaInputType, setMediaInputType] = useState<MediaType>(gameState.mediaType || 'image');

  // Custom question modal or inline state
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [customRoundText, setCustomRoundText] = useState('1. Pehchaan Kaun (Visuals)');

  // New team input state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPin, setNewTeamPin] = useState('1234');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // Active question from bank
  const currentQ = questions[currentQuestionIdx] || questions[0];

  // Questions filtered by active round tab
  const activeRoundInfo = rounds.find(r => r.id === selectedRoundId) || rounds[0];
  const roundQuestions = questions.filter(q => q.round === activeRoundInfo.name);

  const handlePushMedia = () => {
    if (!mediaInputUrl.trim()) return;
    pushMedia(mediaInputUrl.trim(), mediaInputType);
  };

  const handleClearMedia = () => {
    setMediaInputUrl('');
    pushMedia('', 'none');
    setScreenState('question');
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionText.trim()) return;

    const newQ: QuizQuestion = {
      id: `custom-${Date.now()}`,
      round: customRoundText.trim() || activeRoundInfo.name,
      questionNumber: (gameState.questionNumber || 1) + 1,
      question: customQuestionText.trim(),
      answer: 'Quizmaster Discretion',
      mediaType: 'none'
    };

    loadQuestion(newQ);
    setCustomQuestionText('');
  };

  const handleAddNewTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    addNewTeam(newTeamName.trim(), newTeamPin || '1234');
    setNewTeamName('');
    setShowAddTeamModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1F0307]">
      {/* Quizmaster Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#4A0E17] via-[#35070E] to-[#250409] border border-[#D4AF37]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold-gradient rounded-xl text-[#2A050B] shadow-md font-bold">
            <Sliders className="w-6 h-6 text-[#3B0610]" />
          </div>
          <div>
            <h1 className="font-cinzel font-black text-xl sm:text-2xl text-gold-gradient">
              QUIZMASTER COMMAND CENTER
            </h1>
            <p className="text-xs text-amber-200/80">
              5 Predefined Rounds • 50 Questions Ready • Real-Time Stage Synchronization
            </p>
          </div>
        </div>

        {/* Global Screen State Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider mr-1">
            Projector Mode:
          </span>
          {(['idle', 'question', 'media', 'winner'] as ScreenState[]).map((state) => (
            <button
              key={state}
              onClick={() => setScreenState(state)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                gameState.screenState === state
                  ? 'bg-gold-gradient text-[#2A050B] shadow-md ring-2 ring-amber-400'
                  : 'bg-black/40 text-amber-200/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              {state === 'idle' && 'Welcome Banner'}
              {state === 'question' && 'Question View'}
              {state === 'media' && 'Media View'}
              {state === 'winner' && 'Grand Winner'}
            </button>
          ))}
        </div>
      </div>

      {/* TOP ROW: Buzzer Monitor & Timers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BUZZER STATUS & LOCKOUT CONTROLLER */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#31060D] border-2 border-[#D4AF37]/50 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="font-cinzel font-bold text-lg text-gold-gradient">
                Live Buzzer Status
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  gameState.buzzerLocked
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : gameState.buzzerActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-500/20 text-slate-300'
                }`}
              >
                {gameState.buzzerLocked
                  ? '🔒 BUZZER LOCKED'
                  : gameState.buzzerActive
                  ? '⚡ BUZZER OPEN'
                  : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* Buzzer Alert Banner */}
          {gameState.buzzedTeam ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/30 via-red-500/20 to-amber-500/30 border-2 border-[#D4AF37] mb-4 text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
                FIRST TEAM TO BUZZ
              </span>
              <div className="font-cinzel font-black text-2xl sm:text-3xl text-gold-bright drop-shadow mt-1">
                {gameState.buzzedTeam}
              </div>
              <p className="text-xs text-amber-100/80 mt-1">
                Awaiting answer. Award +10 or -5 in the scoreboard below!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-4 text-center">
              <p className="text-sm font-semibold text-slate-300">
                No buzzer pressed yet. Contestants are waiting.
              </p>
            </div>
          )}

          {/* Buzzer Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetBuzzer}
              className="flex-1 py-3 px-4 rounded-xl font-cinzel font-bold text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET & UNLOCK BUZZER</span>
            </button>

            <button
              onClick={() => soundEngine.playBuzzer()}
              title="Test Buzzer Sound"
              className="px-4 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-amber-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Sound Test</span>
            </button>
          </div>
        </div>

        {/* TIMER CONTROL */}
        <div className="p-5 rounded-2xl bg-[#31060D] border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel font-bold text-lg text-gold-gradient">
                Countdown Timer
              </h2>
            </div>
            <p className="text-xs text-amber-100/70 mb-4">
              Trigger synchronized high-impact countdown for Rapid Fire or Family Relay.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => startTimer(15)}
                className="py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <span className="text-xl font-cinzel text-white">15s</span>
                <span className="text-[10px] tracking-wider uppercase text-amber-300">Quick Fire</span>
              </button>

              <button
                onClick={() => startTimer(60)}
                className="py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ring-1 ring-amber-400/40"
              >
                <span className="text-xl font-cinzel text-white">60s</span>
                <span className="text-[10px] tracking-wider uppercase text-amber-300">Family Relay</span>
              </button>
            </div>
          </div>

          <button
            onClick={stopTimer}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Stop / Reset Timer</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          5 ROUND SELECTOR TABS & HOW IT WORKS GUIDE
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#2D060C] border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-cinzel font-bold text-lg sm:text-xl text-gold-gradient">
              5 Predefined Quiz Rounds (10 Questions Each)
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-black/40 border border-[#D4AF37]/30 text-amber-300 font-semibold">
            Total 50 Pre-Loaded Questions
          </span>
        </div>

        {/* Round Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {rounds.map((round) => {
            const isSelected = selectedRoundId === round.id;
            const isLiveRound = gameState.currentRound === round.name;

            return (
              <button
                key={round.id}
                onClick={() => setSelectedRoundId(round.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#4A0E17] to-[#30060D] border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-lg'
                    : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-amber-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400/80">
                      Round {round.id}
                    </span>
                    {isLiveRound && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500 text-black animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel font-bold text-xs sm:text-sm text-slate-100 leading-tight">
                    {round.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <p className="text-[11px] text-amber-200/70 mt-1 line-clamp-1">
                    {round.theme}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-300 font-semibold">
                  <span>10 Questions</span>
                  <span className="text-amber-400">View →</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Round "How It Works" Banner */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-gradient text-[#2A050B]">
                Round {activeRoundInfo.id} Rules & Format
              </span>
              <span className="text-xs font-bold text-amber-200">
                Theme: {activeRoundInfo.theme}
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              <span className="font-bold text-[#F9E79F]">How It Works: </span>
              {activeRoundInfo.howItWorks}
            </p>
          </div>

          <button
            onClick={() => {
              const firstInRound = roundQuestions[0];
              if (firstInRound) loadQuestion(firstInRound);
            }}
            className="px-4 py-2 rounded-xl text-xs font-cinzel font-bold bg-gold-gradient text-[#2A050B] hover:brightness-110 shadow cursor-pointer whitespace-nowrap self-center"
          >
            Launch Round {activeRoundInfo.id} (Q1)
          </button>
        </div>
      </div>

      {/* =========================================================================
          MIDDLE ROW: 10-Question Bank for Selected Round + Active Question Preview
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: 10-Question List for Active Round */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#31060D] border border-[#D4AF37]/30 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-cinzel font-bold text-base text-gold-gradient">
                  Questions in Round {activeRoundInfo.id} (1 to 10)
                </h3>
              </div>
              <span className="text-xs text-amber-300 font-bold font-mono">
                {roundQuestions.length} Questions
              </span>
            </div>

            <p className="text-xs text-amber-100/70 mb-3">
              Click any question below to immediately push it to the Projector Stage:
            </p>

            {/* 10 Questions Roster */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {roundQuestions.map((q, qIndex) => {
                const isCurrentOnScreen = gameState.currentQuestion === q.question;

                return (
                  <button
                    key={q.id}
                    onClick={() => loadQuestion(q)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isCurrentOnScreen
                        ? 'bg-amber-500/25 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow'
                        : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrentOnScreen
                          ? 'bg-gold-gradient text-[#2A050B] shadow'
                          : 'bg-white/10 text-amber-200'
                      }`}
                    >
                      {qIndex + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-100 line-clamp-2">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-emerald-300 font-medium">
                          Ans: {q.answer}
                        </span>
                        {q.mediaType && q.mediaType !== 'none' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                            {q.mediaType}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/70">
            <span>Every family gets their turn to answer!</span>
            <span className="font-semibold text-amber-300">10 Qs / Round</span>
          </div>
        </div>

        {/* RIGHT: Active Question Stage Preview & Media Controls */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#31060D] border border-[#D4AF37]/30 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel font-bold text-lg text-gold-gradient">
                Active Question on Screen
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevQuestion}
                className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-amber-200 border border-white/10 cursor-pointer"
                title="Previous Question in Bank"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-amber-200">
                Q{currentQuestionIdx + 1} of {questions.length}
              </span>
              <button
                onClick={nextQuestion}
                className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-amber-200 border border-white/10 cursor-pointer"
                title="Next Question in Bank"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Question Preview Box */}
          <div className="p-4 rounded-xl bg-black/50 border border-[#D4AF37]/40 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {currentQ.round} • Question #{currentQ.questionNumber || (currentQuestionIdx % 10) + 1}
              </span>
              {currentQ.mediaType && currentQ.mediaType !== 'none' && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold uppercase">
                  {currentQ.mediaType === 'audio' && <Headphones className="w-3 h-3" />}
                  {currentQ.mediaType === 'video' && <Video className="w-3 h-3" />}
                  {currentQ.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                  {currentQ.mediaType}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-base sm:text-lg text-slate-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            {currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {currentQ.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg text-xs font-medium border ${
                      opt === currentQ.answer
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 font-bold'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}
                  >
                    <span className="text-amber-400 font-bold mr-1.5">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {opt === currentQ.answer && ' ✓ (Correct Answer)'}
                  </div>
                ))}
              </div>
            )}

            {currentQ.explanation && (
              <p className="text-xs text-amber-200/80 italic mt-3 pt-2 border-t border-white/10">
                💡 Note for Quizmaster: {currentQ.explanation}
              </p>
            )}
          </div>

          {/* Push buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadQuestion(currentQ)}
              className="flex-1 py-3 px-4 rounded-xl font-cinzel font-bold text-sm bg-gold-gradient text-[#2A050B] hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Tv className="w-4 h-4 text-[#2A050B]" />
              <span>PUSH QUESTION TO PROJECTOR SCREEN</span>
            </button>

            <button
              onClick={nextQuestion}
              className="py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>NEXT QUESTION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Media Push Controller (Quick Audio / Video / Image Trigger) */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4" />
                <span>Media Controller (Audio / Visual Clips)</span>
              </span>
              <span className="text-[11px] text-amber-200/60">
                Current Media: {gameState.mediaType !== 'none' ? gameState.mediaType : 'None'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['image', 'audio', 'video', 'youtube'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaInputType(type)}
                  className={`py-1.5 text-xs rounded-lg font-semibold flex items-center justify-center gap-1 border capitalize cursor-pointer ${
                    mediaInputType === type
                      ? 'bg-gold-gradient text-[#2A050B] font-bold border-white'
                      : 'bg-black/40 text-slate-300 border-white/10'
                  }`}
                >
                  {type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                  {type === 'audio' && <Headphones className="w-3.5 h-3.5" />}
                  {type === 'video' && <Video className="w-3.5 h-3.5" />}
                  {type === 'youtube' && <Youtube className="w-3.5 h-3.5" />}
                  {type}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={mediaInputUrl}
                onChange={(e) => setMediaInputUrl(e.target.value)}
                placeholder="Paste MP3 audio, MP4 video, YouTube URL, or Image link..."
                className="flex-1 px-3 py-2 text-xs bg-black/60 border border-amber-500/30 rounded-lg text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handlePushMedia}
                className="px-4 py-2 rounded-lg font-cinzel font-bold text-xs bg-gold-gradient text-[#2A050B] hover:brightness-110 shadow cursor-pointer whitespace-nowrap"
              >
                Push Media
              </button>
              <button
                type="button"
                onClick={handleClearMedia}
                className="px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Custom On-The-Fly Question Form */}
          <div className="pt-2 border-t border-white/10">
            <details className="group">
              <summary className="text-xs font-bold text-amber-300/80 cursor-pointer flex items-center gap-1 hover:text-amber-200">
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ask a spontaneous question on the fly</span>
              </summary>
              <form onSubmit={handleAddCustomQuestion} className="mt-3 space-y-2">
                <input
                  type="text"
                  value={customRoundText}
                  onChange={(e) => setCustomRoundText(e.target.value)}
                  placeholder="Round Title"
                  className="w-full px-3 py-2 text-xs bg-black/60 border border-amber-500/30 rounded-lg text-amber-100"
                />
                <textarea
                  value={customQuestionText}
                  onChange={(e) => setCustomQuestionText(e.target.value)}
                  placeholder="Type spontaneous question here..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-black/60 border border-amber-500/30 rounded-lg text-amber-100"
                />
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg text-xs font-bold bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50 text-amber-100 border border-[#D4AF37]/40 cursor-pointer"
                >
                  Push Custom Question Directly
                </button>
              </form>
            </details>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: Score Management (Teams, +10, -5)
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#31060D] border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-cinzel font-bold text-lg text-gold-gradient">
              Participating Family Teams & Live Scores
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-amber-200 border border-[#D4AF37]/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Family</span>
            </button>
          </div>
        </div>

        {/* Teams Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...teams]
            .sort((a, b) => b.score - a.score)
            .map((team, idx) => (
              <div
                key={team.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  team.name === gameState.buzzedTeam
                    ? 'bg-amber-500/20 border-[#D4AF37] ring-2 ring-[#D4AF37]/50'
                    : 'bg-black/40 border-white/10 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-gold-gradient text-[#2A050B] shadow'
                        : 'bg-white/10 text-amber-200'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-sm text-slate-100 truncate">
                        {team.name}
                      </span>
                      {team.isLoggedIn && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Connected" />
                      )}
                    </div>
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      {team.score} PTS
                    </span>
                  </div>
                </div>

                {/* Score adjustment buttons: +10 and -5 */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => adjustScore(team.id, 10)}
                    title="Add 10 points"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-black active:scale-90 transition-transform cursor-pointer"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => adjustScore(team.id, -5)}
                    title="Deduct 5 points"
                    className="px-2 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-black active:scale-90 transition-transform cursor-pointer"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    title="Delete Team"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* GRAND FINALE TRIGGER: REVEAL WINNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#5B0E1E] via-[#3B070E] to-[#5B0E1E] border-3 border-[#D4AF37] shadow-2xl text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-gold-gradient text-[#2A050B] shadow-lg">
            <Trophy className="w-8 h-8 text-[#3B0610]" />
          </div>

          <h2 className="font-cinzel font-black text-2xl sm:text-3xl text-gold-gradient tracking-wide">
            GRAND FINALE MOMENT
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/80">
            Darkens the projector screen, starts the suspenseful drumroll, triggers an explosion of golden confetti, and crowns the winning family in giant glowing 3D letters!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={revealWinner}
              className="py-4 px-8 rounded-2xl font-cinzel font-black text-lg sm:text-xl bg-gold-gradient text-[#2A050B] shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-white/40 gold-box-shadow animate-buzz-pulse"
            >
              <Sparkles className="w-6 h-6 text-[#2A050B] fill-current" />
              <span>REVEAL WINNER (GRAND FINALE)</span>
            </button>

            {gameState.showWinner && (
              <button
                type="button"
                onClick={hideWinner}
                className="py-3 px-5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-rose-300 border border-rose-500/30 cursor-pointer"
              >
                Close Winner Finale
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2D060D] border-2 border-[#D4AF37] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-cinzel font-bold text-lg text-gold-gradient mb-3">
              Add Participating Family Team
            </h3>
            <form onSubmit={handleAddNewTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#F9E79F] mb-1">
                  Team / Family Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Singhal Family"
                  className="w-full px-3 py-2 bg-black/60 border border-amber-500/30 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#F9E79F] mb-1">
                  PIN (Optional)
                </label>
                <input
                  type="text"
                  value={newTeamPin}
                  onChange={(e) => setNewTeamPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 bg-black/60 border border-amber-500/30 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-xs bg-gold-gradient text-[#2A050B] cursor-pointer"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
