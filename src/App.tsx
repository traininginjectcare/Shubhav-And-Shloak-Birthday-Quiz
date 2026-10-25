/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  FileText, 
  Zap, 
  Sparkles,
  Users,
  Clock
} from 'lucide-react';
import { FinalistTeam, StageQuestion, ScoreHistoryEntry } from './types/quiz';
import { INITIAL_PLACEHOLDER_QUESTIONS } from './data/placeholderQuestions';
import { MainStageQuiz } from './components/MainStageQuiz';
import { LeaderboardModal } from './components/LeaderboardModal';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { TeamManagerModal } from './components/TeamManagerModal';
import { TieBreakerModal } from './components/TieBreakerModal';
import { FullScreenTimerModal } from './components/FullScreenTimerModal';
import { DiyaIcon } from './components/DiyaIcon';
import { soundEngine } from './utils/audio';

// Default teams with simple editable names and NO team member names
const INITIAL_BIRTHDAY_TEAMS: FinalistTeam[] = [
  {
    id: 'team-1',
    name: 'Team 1',
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalScore: 0,
    lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
    lifelineUsedInRound: {},
  },
  {
    id: 'team-2',
    name: 'Team 2',
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalScore: 0,
    lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
    lifelineUsedInRound: {},
  },
  {
    id: 'team-3',
    name: 'Team 3',
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalScore: 0,
    lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
    lifelineUsedInRound: {},
  },
  {
    id: 'team-4',
    name: 'Team 4',
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalScore: 0,
    lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
    lifelineUsedInRound: {},
  },
  {
    id: 'team-5',
    name: 'Team 5',
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalScore: 0,
    lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
    lifelineUsedInRound: {},
  },
];

export default function App() {
  // Teams State - Clean editable teams without member names
  const [teams, setTeams] = useState<FinalistTeam[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shubhav_shloak_birthday_quiz_teams_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
      localStorage.setItem('shubhav_shloak_birthday_quiz_teams_v2', JSON.stringify(INITIAL_BIRTHDAY_TEAMS));
    }
    return INITIAL_BIRTHDAY_TEAMS;
  });

  // Question Bank State
  const [questions, setQuestions] = useState<StageQuestion[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shubhav_shloak_birthday_questions_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
      localStorage.setItem('shubhav_shloak_birthday_questions_v2', JSON.stringify(INITIAL_PLACEHOLDER_QUESTIONS));
    }
    return INITIAL_PLACEHOLDER_QUESTIONS;
  });

  // Active Round (1: Bollywood, 2: Mythology, 3: Sports & Current Affairs, 4: Finale)
  const [activeRoundId, setActiveRoundId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('birthday_quiz_active_round');
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  // Score History Stack for UNDO
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('birthday_quiz_score_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  // Modal States
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showQuestionManager, setShowQuestionManager] = useState<boolean>(false);
  const [showTeamManager, setShowTeamManager] = useState<boolean>(false);
  const [showTieBreaker, setShowTieBreaker] = useState<boolean>(false);
  const [showFullScreenTimer, setShowFullScreenTimer] = useState<boolean>(false);

  // Sound and Fullscreen
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('shubhav_shloak_birthday_quiz_teams_v2', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('shubhav_shloak_birthday_questions_v2', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('birthday_quiz_active_round', String(activeRoundId));
  }, [activeRoundId]);

  useEffect(() => {
    localStorage.setItem('birthday_quiz_score_history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // UNDO LAST SCORE ACTION
  const handleUndoLastAction = () => {
    if (scoreHistory.length === 0) return;
    const last = scoreHistory[scoreHistory.length - 1];

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === last.teamId) {
          const prevRoundScore = t.roundScores[last.roundNumber as 1 | 2 | 3 | 4] || 0;
          const restoredRoundScore = Math.max(0, prevRoundScore - last.delta);
          const restoredTotal = Math.max(0, t.totalScore - last.delta);

          return {
            ...t,
            roundScores: {
              ...t.roundScores,
              [last.roundNumber]: restoredRoundScore,
            },
            totalScore: restoredTotal,
          };
        }
        return t;
      })
    );

    setScoreHistory((prev) => prev.slice(0, -1));
    soundEngine.playScoreChange(false);
  };

  const handleRecordScoreAction = (entry: ScoreHistoryEntry) => {
    setScoreHistory((prev) => [...prev, entry]);
  };

  const handleAdjustScore = (teamId: string, roundNumber: number, delta: number) => {
    soundEngine.playScoreChange(delta > 0);
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const currentRoundScore = t.roundScores[roundNumber as 1 | 2 | 3 | 4] || 0;
          return {
            ...t,
            roundScores: {
              ...t.roundScores,
              [roundNumber]: currentRoundScore + delta,
            },
            totalScore: t.totalScore + delta,
          };
        }
        return t;
      })
    );
  };

  const handleAwardTieBreaker = (teamId: string, points: number = 1) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            totalScore: t.totalScore + points,
          };
        }
        return t;
      })
    );
  };

  const handleToggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (
      !doc.fullscreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.msFullscreenElement
    ) {
      const req =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (req) {
        req.call(docEl).catch(() => {});
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#11061F] bg-radial from-[#240D3E] via-[#140626] to-[#0A0214] text-slate-100 flex flex-col font-sans selection:bg-[#FFE082] selection:text-[#1F0838] overflow-hidden select-none">
      
      {/* =========================================================================
          SLIM REGAL FESTIVE HEADER: SHUBHAV & SHLOAK BIRTHDAY QUIZ
          ========================================================================= */}
      <header className="bg-gradient-to-r from-[#170729]/95 via-[#290E4A]/95 to-[#170729]/95 border-b border-amber-400/40 px-3 sm:px-4 py-1.5 shadow-md shrink-0">
        <div className="w-full flex items-center justify-between gap-2">
          
          {/* Left: Birthday & Diwali Party Title */}
          <div className="flex items-center gap-2 min-w-0">
            <DiyaIcon size="sm" showSparkles={false} />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] text-amber-200/90 font-cinzel tracking-widest uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Diwali Theme Birthday Party</span>
                </span>
              </div>
              <h1 className="font-cinzel font-black text-base sm:text-lg md:text-xl text-gold-gradient tracking-wide uppercase drop-shadow truncate">
                Shubhav &amp; Shloak&apos;s Birthday Quiz
              </h1>
            </div>
          </div>

          {/* Right: Master Control Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Scoreboard Button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-[#FFE082] to-amber-400 hover:brightness-110 text-stone-950 font-cinzel font-black text-xs tracking-wider shadow flex items-center gap-1.5 transition-transform active:scale-95 border border-white cursor-pointer"
              title="Open Scoreboard"
            >
              <Trophy className="w-3.5 h-3.5 fill-stone-950" />
              <span>SCOREBOARD</span>
            </button>

            {/* Timer Modal Button */}
            <button
              onClick={() => setShowFullScreenTimer(true)}
              className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-amber-400/80 text-amber-200 text-xs font-cinzel font-bold flex items-center gap-1 transition-colors shadow active:scale-95 cursor-pointer"
              title="Open Stage Countdown Timer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">TIMER</span>
            </button>

            {/* Teams Manager */}
            <button
              onClick={() => setShowTeamManager(true)}
              className="px-2.5 py-1 rounded-xl bg-black/50 hover:bg-black/80 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Add or Rename Teams"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Teams</span>
            </button>

            {/* Question Bank Manager */}
            <button
              onClick={() => setShowQuestionManager(true)}
              className="px-2.5 py-1 rounded-xl bg-black/50 hover:bg-black/80 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Manage Question Bank"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Questions</span>
            </button>

            {/* Tie-Breaker */}
            <button
              onClick={() => setShowTieBreaker(true)}
              className="px-2.5 py-1 rounded-xl bg-black/50 hover:bg-black/80 border border-amber-400/50 text-amber-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Tie-Breaker Arena"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">Tie-Breaker</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isMuted 
                  ? 'bg-rose-950/70 border-rose-700 text-rose-300' 
                  : 'bg-black/50 border-amber-400/50 text-amber-300 hover:bg-black/70'
              }`}
              title={isMuted ? "Unmute Sound" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className={`px-2.5 py-1 rounded-xl border text-xs font-cinzel font-bold flex items-center gap-1 transition-all shadow active:scale-95 cursor-pointer ${
                isFullscreen
                  ? 'bg-amber-400 text-stone-950 border-amber-200 font-black'
                  : 'bg-black/60 hover:bg-black/80 border-amber-400/60 text-amber-200'
              }`}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-stone-950" /> : <Maximize className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isFullscreen ? 'EXIT' : 'FULL'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SLIM 4 ROUND SELECTOR TABS
          ========================================================================= */}
      <section className="bg-black/50 border-b border-amber-400/30 px-3 sm:px-4 py-1 backdrop-blur-sm shrink-0">
        <div className="w-full flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 1, title: 'Round 1: Bollywood', badge: '🎬 MCQs' },
            { id: 2, title: 'Round 2: Mythology', badge: '🪔 Ramayana & Mahabharata' },
            { id: 3, title: 'Round 3: Sports & News', badge: '⚡ Buzzer' },
            { id: 4, title: 'Round 4: Grand Finale', badge: '🌟 Easy / Difficult' },
          ].map((round) => {
            const isSelected = round.id === activeRoundId;

            return (
              <button
                key={round.id}
                onClick={() => setActiveRoundId(round.id)}
                className={`flex-1 min-w-[170px] px-3 py-1.5 rounded-xl border transition-all flex items-center justify-between gap-1.5 text-left cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#391761] to-[#200A38] border-amber-400 shadow scale-[1.01]'
                    : 'bg-[#180A28]/80 hover:bg-[#230F3B] border-amber-900/40 text-stone-300'
                }`}
              >
                <span className={`font-cinzel font-bold text-xs sm:text-sm truncate block ${
                  isSelected ? 'text-gold-bright' : 'text-stone-300'
                }`}>
                  {round.title}
                </span>
                <span className="text-[10px] font-semibold text-amber-300/80 shrink-0">
                  {round.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          MAIN LIVE STAGE QUIZ VIEW (FITS SCREEN WITHOUT VERTICAL SCROLLBARS)
          ========================================================================= */}
      <main className="flex-1 min-h-0 px-3 sm:px-4 py-2 w-full flex flex-col overflow-hidden">
        <MainStageQuiz
          teams={teams}
          questions={questions}
          activeRoundId={activeRoundId}
          onUpdateTeams={setTeams}
          onRecordScoreAction={handleRecordScoreAction}
          onUndoLastAction={handleUndoLastAction}
          canUndo={scoreHistory.length > 0}
          onOpenTeamManager={() => setShowTeamManager(true)}
        />
      </main>

      {/* =========================================================================
          SLIM COMPACT FOOTER
          ========================================================================= */}
      <footer className="bg-[#0C0315] border-t border-amber-400/20 px-4 py-1 text-center text-[11px] text-amber-200/70 flex items-center justify-between w-full shrink-0">
        <div className="flex items-center gap-1.5">
          <DiyaIcon size="sm" showSparkles={false} />
          <span className="font-cinzel font-bold text-xs text-gold-bright">
            Shubhav &amp; Shloak&apos;s Birthday Quiz
          </span>
          <span>•</span>
          <span className="font-cinzel text-[11px] text-amber-300">Diwali Theme Celebration</span>
        </div>

        <div className="flex items-center gap-2">
          {scoreHistory.length > 0 && (
            <button
              onClick={handleUndoLastAction}
              className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo Last Score</span>
            </button>
          )}

          <span className="text-[11px] text-amber-200/60 font-cinzel hidden sm:inline">
            ✨ Wishing Shubhav &amp; Shloak A Very Happy Birthday! ✨
          </span>
        </div>
      </footer>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <LeaderboardModal
        teams={teams}
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        onAdjustScore={handleAdjustScore}
        onUndoLastAction={handleUndoLastAction}
        canUndo={scoreHistory.length > 0}
        lastAction={scoreHistory[scoreHistory.length - 1]}
        onOpenTeamManager={() => setShowTeamManager(true)}
      />

      <QuestionManagerModal
        isOpen={showQuestionManager}
        onClose={() => setShowQuestionManager(false)}
        questions={questions}
        onUpdateQuestions={setQuestions}
      />

      <TeamManagerModal
        isOpen={showTeamManager}
        onClose={() => setShowTeamManager(false)}
        teams={teams}
        onUpdateTeams={setTeams}
      />

      <TieBreakerModal
        isOpen={showTieBreaker}
        onClose={() => setShowTieBreaker(false)}
        teams={teams}
        tieBreakerQuestions={questions.filter((q) => q.roundNumber === 5)}
        onAwardTieBreaker={handleAwardTieBreaker}
      />

      <FullScreenTimerModal
        isOpen={showFullScreenTimer}
        onClose={() => setShowFullScreenTimer(false)}
        defaultDuration={activeRoundId === 2 ? 60 : 30}
      />
    </div>
  );
}
