/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Zap,
  Users,
  Edit2,
  Check,
  Sparkles,
  Flame,
  Star,
  Trash2
} from 'lucide-react';
import { 
  FinalistTeam, 
  StageQuestion, 
  ScoreHistoryEntry
} from '../types/quiz';
import { soundEngine } from '../utils/audio';
import { cleanHindiText } from '../utils/text';
import { DiyaIcon } from './DiyaIcon';

// Fisher-Yates array shuffle for question order
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface MainStageQuizProps {
  teams: FinalistTeam[];
  questions: StageQuestion[];
  activeRoundId: number;
  onUpdateTeams: (teams: FinalistTeam[]) => void;
  onRecordScoreAction?: (entry: ScoreHistoryEntry) => void;
  onSelectAudienceTeam?: (team: FinalistTeam | null) => void;
  onUndoLastAction?: () => void;
  canUndo?: boolean;
  onOpenTeamManager?: () => void;
}

export const MainStageQuiz: React.FC<MainStageQuizProps> = ({
  teams,
  questions,
  activeRoundId,
  onUpdateTeams,
  onRecordScoreAction,
  onUndoLastAction,
  canUndo = false,
  onOpenTeamManager,
}) => {
  // Question navigation index per round (Rounds 1, 2, 3)
  const [questionIndex, setQuestionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`diwali_quiz_turn_r${activeRoundId}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Round 4 (Grand Finale) Mode: Selection between Easy and Difficult questions
  const [finaleDifficulty, setFinaleDifficulty] = useState<'easy' | 'hard'>('easy');
  const [finaleEasyIndex, setFinaleEasyIndex] = useState<number>(0);
  const [finaleHardIndex, setFinaleHardIndex] = useState<number>(0);

  // Shuffled questions for active round
  const [shuffledQuestions, setShuffledQuestions] = useState<StageQuestion[]>(() => {
    const roundQs = questions.filter((q) => q.roundNumber === activeRoundId);
    return shuffleArray(roundQs);
  });

  // Automatically randomize questions whenever round changes or questions bank updates
  useEffect(() => {
    const roundQs = questions.filter((q) => q.roundNumber === activeRoundId);
    setShuffledQuestions(shuffleArray(roundQs));
    setQuestionIndex(0);
  }, [activeRoundId, questions]);

  // Separate pools for Round 4
  const round4EasyQuestions = questions.filter(
    (q) => q.roundNumber === 4 && q.difficulty === 'easy'
  );
  const round4HardQuestions = questions.filter(
    (q) => q.roundNumber === 4 && q.difficulty === 'hard'
  );

  // Full Screen Question Spotlight Modal
  const [isFullScreenQuestionOpen, setIsFullScreenQuestionOpen] = useState<boolean>(false);

  // Timer: Round 2 (Mythology) defaults to 60s, others to 30s
  const defaultSeconds = activeRoundId === 2 ? 60 : 30;
  const [timerDuration, setTimerDuration] = useState<number>(defaultSeconds);
  const [timerSeconds, setTimerSeconds] = useState<number>(defaultSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Manually selected team by host
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Inline team rename state
  const [inlineEditingTeamId, setInlineEditingTeamId] = useState<string | null>(null);
  const [inlineNameText, setInlineNameText] = useState<string>('');

  // Delete confirmation state for direct deletion in scorekeeper
  const [confirmDeleteTeamId, setConfirmDeleteTeamId] = useState<string | null>(null);

  // Show correct answer toggle
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Sync questionIndex to localStorage
  useEffect(() => {
    localStorage.setItem(`diwali_quiz_turn_r${activeRoundId}`, String(questionIndex));
  }, [questionIndex, activeRoundId]);

  // Reset transient question states on round change or question change
  useEffect(() => {
    const dur = activeRoundId === 2 ? 60 : 30;
    setTimerDuration(dur);
    setTimerSeconds(dur);
    setIsTimerRunning(false);
    setIsFullScreenQuestionOpen(false);
    setShowAnswer(false);
  }, [questionIndex, activeRoundId, finaleDifficulty, finaleEasyIndex, finaleHardIndex]);

  // Countdown timer effect (DISABLED for Round 3 Buzzer Round)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (activeRoundId !== 3 && isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => {
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
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timerSeconds, activeRoundId]);

  // Determine current active question
  let currentQuestion: StageQuestion;
  let totalQuestionsInRound = 0;
  let currentQuestionNumber = 1;

  if (activeRoundId === 4) {
    if (finaleDifficulty === 'easy') {
      totalQuestionsInRound = round4EasyQuestions.length;
      currentQuestionNumber = totalQuestionsInRound > 0 ? (finaleEasyIndex % totalQuestionsInRound) + 1 : 1;
      currentQuestion = round4EasyQuestions[finaleEasyIndex % (totalQuestionsInRound || 1)] || {
        id: 'r4-easy-default',
        roundNumber: 4,
        category: 'Grand Finale',
        difficulty: 'easy',
        question: 'No easy questions loaded for Grand Finale',
        questionHindi: 'ग्रैंड फिनाले के लिए कोई प्रश्न उपलब्ध नहीं है',
        correctAnswer: 'N/A',
        isUsed: false,
      };
    } else {
      totalQuestionsInRound = round4HardQuestions.length;
      currentQuestionNumber = totalQuestionsInRound > 0 ? (finaleHardIndex % totalQuestionsInRound) + 1 : 1;
      currentQuestion = round4HardQuestions[finaleHardIndex % (totalQuestionsInRound || 1)] || {
        id: 'r4-hard-default',
        roundNumber: 4,
        category: 'Grand Finale',
        difficulty: 'hard',
        question: 'No difficult questions loaded for Grand Finale',
        questionHindi: 'ग्रैंड फिनाले के लिए कोई प्रश्न उपलब्ध नहीं है',
        correctAnswer: 'N/A',
        isUsed: false,
      };
    }
  } else {
    totalQuestionsInRound = shuffledQuestions.length;
    currentQuestionNumber = totalQuestionsInRound > 0 ? (questionIndex % totalQuestionsInRound) + 1 : 1;
    currentQuestion = shuffledQuestions[questionIndex % (totalQuestionsInRound || 1)] || {
      id: `placeholder-${activeRoundId}-${questionIndex}`,
      roundNumber: activeRoundId as 1 | 2 | 3 | 4 | 5,
      category: 'General',
      difficulty: 'medium',
      question: 'No questions loaded for this round',
      questionHindi: 'इस राउंड के लिए कोई प्रश्न उपलब्ध नहीं है',
      correctAnswer: 'N/A',
      isUsed: false,
    };
  }

  // Escape key listener to close full screen question overlay
  useEffect(() => {
    if (!isFullScreenQuestionOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreenQuestionOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenQuestionOpen]);

  // Launch Question on Full Screen Spotlight
  const handleLaunchFullScreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFullScreenQuestionOpen(true);
    if (activeRoundId !== 3) {
      setTimerSeconds(timerDuration);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
    try {
      soundEngine.playScoreChange(true);
    } catch {
      // Audio error suppressed
    }
  };

  // Timer controls
  const handleToggleTimer = () => {
    if (activeRoundId === 3) return;
    if (timerSeconds === 0) {
      setTimerSeconds(timerDuration);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const handleAdjustTimerSeconds = (delta: number) => {
    if (activeRoundId === 3) return;
    if (isTimerRunning) {
      setTimerSeconds((prev) => Math.max(0, prev + delta));
    } else {
      setTimerSeconds((prev) => Math.max(15, prev + delta));
      setTimerDuration((prev) => Math.max(15, prev + delta));
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerDuration);
  };

  // Direct Score Adder (+10, +20, +5, -5, -10)
  const handleDirectScoreAdd = (teamId: string, delta: number) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return;

    if (delta > 0) {
      soundEngine.playFanfare();
    } else {
      soundEngine.playScoreChange(false);
    }

    const prevRoundScore = targetTeam.roundScores[activeRoundId as 1 | 2 | 3 | 4] || 0;
    const prevTotalScore = targetTeam.totalScore;

    const updatedTeams = teams.map((t) => {
      if (t.id === teamId) {
        const prevRound = t.roundScores[activeRoundId as 1 | 2 | 3 | 4] || 0;
        const newRound = Math.max(0, prevRound + delta);
        const newTotal = Math.max(0, t.totalScore + delta);

        return {
          ...t,
          roundScores: {
            ...t.roundScores,
            [activeRoundId]: newRound,
          },
          totalScore: newTotal,
        };
      }
      return t;
    });

    onUpdateTeams(updatedTeams);

    if (onRecordScoreAction) {
      onRecordScoreAction({
        id: `score-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        teamId,
        teamName: targetTeam.name,
        roundNumber: activeRoundId,
        delta,
        description: `${targetTeam.name} ${delta > 0 ? '+' : ''}${delta} pts in Round ${activeRoundId}`,
        previousRoundScore: prevRoundScore,
        previousTotalScore: prevTotalScore,
      });
    }
  };

  // Direct Add New Team from Scorekeeper
  const handleQuickAddTeam = () => {
    const nextIdx = teams.length + 1;
    const newTeam: FinalistTeam = {
      id: `team-${Date.now()}`,
      name: `Team ${nextIdx}`,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      totalScore: 0,
      lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
      lifelineUsedInRound: {},
    };
    onUpdateTeams([...teams, newTeam]);
  };

  // Direct Delete Team from Scorekeeper
  const handleDeleteTeam = (teamId: string) => {
    const updated = teams.filter((t) => t.id !== teamId);
    onUpdateTeams(updated);
    setConfirmDeleteTeamId(null);
  };

  // Inline team rename handler
  const handleStartInlineEdit = (team: FinalistTeam) => {
    setInlineEditingTeamId(team.id);
    setInlineNameText(team.name);
  };

  const handleSaveInlineEdit = (teamId: string) => {
    if (!inlineNameText.trim()) {
      setInlineEditingTeamId(null);
      return;
    }
    const updated = teams.map((t) =>
      t.id === teamId ? { ...t, name: inlineNameText.trim() } : t
    );
    onUpdateTeams(updated);
    setInlineEditingTeamId(null);
  };

  // Next / Previous Question Navigation
  const handleNextQuestion = () => {
    soundEngine.playClick();
    if (activeRoundId === 4) {
      if (finaleDifficulty === 'easy') {
        setFinaleEasyIndex((prev) => prev + 1);
      } else {
        setFinaleHardIndex((prev) => prev + 1);
      }
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    soundEngine.playClick();
    if (activeRoundId === 4) {
      if (finaleDifficulty === 'easy') {
        setFinaleEasyIndex((prev) => Math.max(0, prev - 1));
      } else {
        setFinaleHardIndex((prev) => Math.max(0, prev - 1));
      }
    } else {
      setQuestionIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // Round titles
  const ROUND_NAMES: { [key: number]: string } = {
    1: 'Round 1: Bollywood',
    2: 'Round 2: Mythology (Ramayana & Mahabharata)',
    3: 'Round 3: Sports & Current Affairs',
    4: 'Round 4: Grand Finale (Mixed)',
  };

  return (
    <div className="h-full min-h-0 w-full grid grid-cols-12 gap-2 sm:gap-3 overflow-hidden">
      
      {/* =========================================================================
          LEFT COLUMN: STAGE QUESTION CONSOLE (ALWAYS ON LEFT, NEVER SCROLLS)
          ========================================================================= */}
      <div className="col-span-7 h-full min-h-0 flex flex-col justify-between gap-1.5 sm:gap-2 overflow-hidden">
        
        {/* Stage Header Info: Sleek compact header */}
        <div className="bg-gradient-to-r from-[#210D3B] via-[#2F1550] to-[#210D3B] border border-amber-400/60 rounded-xl px-2.5 sm:px-3 py-1 shadow-md flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <DiyaIcon size="sm" showSparkles={false} />
            <h2 className="font-cinzel font-black text-xs sm:text-sm md:text-base text-gold-bright tracking-wide truncate">
              {ROUND_NAMES[activeRoundId]}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-cinzel font-black text-xs text-amber-200 bg-black/60 px-2 py-0.5 rounded-lg border border-amber-400/40">
              Q {currentQuestionNumber} / {totalQuestionsInRound}
            </span>

            {/* Quick Full Screen Button */}
            <button
              onClick={handleLaunchFullScreen}
              className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 via-[#FFE082] to-amber-400 hover:brightness-110 text-stone-950 font-cinzel font-black text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer border border-white shrink-0"
              title="Launch Question Full Screen"
            >
              <Maximize2 className="w-3 h-3 text-stone-950" />
              <span>FULL SCREEN</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            STAGE QUESTION BODY (SCALED TO FIT VIEWPORT PERFECTLY)
            ========================================================================= */}
        <div className="flex-1 min-h-0 bg-gradient-to-b from-[#220E3A] via-[#170929] to-[#0E0519] border-2 border-amber-400/60 rounded-2xl p-2.5 sm:p-3 shadow-[0_0_30px_rgba(255,183,77,0.2)] flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
          
          {/* Subtle Ambient Radial Light */}
          <div className="absolute inset-0 bg-radial from-[#FFE082]/10 via-transparent to-transparent pointer-events-none" />

          {/* =========================================================================
              ROUND 4 SPECIAL: EASY / DIFFICULT QUESTION SELECTOR BUTTONS
              ========================================================================= */}
          {activeRoundId === 4 && (
            <div className="relative z-10 w-full max-w-md bg-black/60 p-1 rounded-xl border border-amber-400/50 flex items-center gap-1.5 shadow-lg shrink-0">
              <button
                onClick={() => {
                  setFinaleDifficulty('easy');
                  soundEngine.playClick();
                }}
                className={`flex-1 py-1 px-2.5 rounded-lg font-cinzel font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  finaleDifficulty === 'easy'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md scale-[1.01] border border-white'
                    : 'bg-white/5 text-stone-300 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>EASY (+10 PTS)</span>
              </button>

              <button
                onClick={() => {
                  setFinaleDifficulty('hard');
                  soundEngine.playClick();
                }}
                className={`flex-1 py-1 px-2.5 rounded-lg font-cinzel font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  finaleDifficulty === 'hard'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-stone-950 shadow-md scale-[1.01] border border-white'
                    : 'bg-white/5 text-stone-300 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>DIFFICULT (+20 PTS)</span>
              </button>
            </div>
          )}

          {/* Badge: In Round 4, DO NOT SHOW TOPIC! Show only difficulty level badge */}
          {activeRoundId === 4 ? (
            <div className="relative z-10 shrink-0">
              <span className={`text-[11px] font-cinzel font-black uppercase tracking-wider px-3 py-0.5 rounded-lg border ${
                finaleDifficulty === 'easy'
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                  : 'bg-rose-950/90 border-rose-400 text-rose-300'
              }`}>
                {finaleDifficulty === 'easy' ? 'Level: Easy Question (+10 Points)' : 'Level: Difficult Question (+20 Points)'}
              </span>
            </div>
          ) : (
            currentQuestion.category && (
              <span className="text-[11px] font-cinzel font-bold text-amber-300 uppercase tracking-wider bg-[#2B1448] px-3 py-0.5 rounded-lg border border-amber-400/40 relative z-10 shrink-0">
                {currentQuestion.category}
              </span>
            )
          )}

          {/* Sane, Readable Heading: "QUESTION X" */}
          <div className="relative z-10 flex items-center justify-center gap-2 shrink-0">
            <DiyaIcon size="sm" showSparkles={false} />
            <h1 className="font-cinzel font-black text-2xl sm:text-3xl lg:text-4xl text-gold-gradient tracking-wide uppercase drop-shadow">
              Question {currentQuestionNumber}
            </h1>
            <DiyaIcon size="sm" showSparkles={false} />
          </div>

          {/* Timer Controls (R1, R2, R4) or Buzzer Badge (R3) */}
          {activeRoundId === 3 ? (
            <div className="px-3.5 py-1 rounded-xl bg-black/70 border border-amber-400 flex items-center justify-center gap-2 relative z-10 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="font-cinzel font-black text-xs text-gold-bright uppercase tracking-wider">
                Buzzer Round (No Timer)
              </span>
            </div>
          ) : (
            <div className="p-1.5 rounded-xl bg-black/70 border border-amber-400/40 flex flex-wrap items-center justify-center gap-1.5 text-xs relative z-10 shrink-0">
              <span className="font-cinzel font-bold text-xs text-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Timer:</span>
              </span>

              {/* +/- 15s Buttons */}
              <div className="flex items-center gap-1 bg-stone-900 border border-amber-400/50 rounded-lg p-0.5">
                <button
                  onClick={() => handleAdjustTimerSeconds(-15)}
                  className="px-1.5 py-0.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700 font-cinzel font-bold text-[11px] active:scale-95 cursor-pointer"
                  title="Decrease by 15s"
                >
                  -15s
                </button>

                <span className="px-2 py-0.5 font-cinzel font-black text-base text-gold-bright min-w-[42px] text-center">
                  {timerSeconds}s
                </span>

                <button
                  onClick={() => handleAdjustTimerSeconds(15)}
                  className="px-1.5 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 font-cinzel font-bold text-[11px] active:scale-95 cursor-pointer"
                  title="Increase by 15s"
                >
                  +15s
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                {[30, 45, 60, 90].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setTimerDuration(sec);
                      setTimerSeconds(sec);
                    }}
                    className={`px-1.5 py-0.5 rounded-lg font-cinzel font-bold text-[11px] transition-all cursor-pointer ${
                      timerDuration === sec && !isTimerRunning
                        ? 'bg-amber-400 text-stone-950 font-black shadow'
                        : 'bg-black/60 text-stone-200 border border-stone-700 hover:text-white'
                    }`}
                  >
                    {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE LAUNCH BUTTON */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm pt-0.5 shrink-0">
            <button
              onClick={handleLaunchFullScreen}
              className="w-full py-2 sm:py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-[#FFF9C4] to-amber-400 hover:brightness-110 text-stone-950 font-cinzel font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,213,79,0.6)] border border-white flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 shrink-0 text-stone-950" />
              <span>FULL SCREEN QUESTION</span>
            </button>
          </div>
        </div>

        {/* Bottom Question Switcher Controls (Prev / Next) */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handlePrevQuestion}
            disabled={
              activeRoundId === 4 
                ? (finaleDifficulty === 'easy' ? finaleEasyIndex === 0 : finaleHardIndex === 0)
                : questionIndex === 0
            }
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-cinzel font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREVIOUS</span>
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-cinzel font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>NEXT QUESTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN: SCORE SECTION (ALWAYS ON THE SIDE, NEVER WRAPS TO BOTTOM)
          ========================================================================= */}
      <div className="col-span-5 h-full min-h-0 bg-gradient-to-b from-[#25103F] via-[#1A0B2E] to-[#10061D] border-2 border-amber-400/60 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-col justify-between overflow-hidden">
        
        {/* Score Keeper Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-amber-400/30 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-purple-900/60 border border-amber-400 flex items-center justify-center text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-cinzel font-black text-xs sm:text-sm text-gold-gradient tracking-wide">
                {activeRoundId === 4 ? 'Finale Score' : `Round ${activeRoundId} Score`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Add Team button */}
            <button
              onClick={handleQuickAddTeam}
              className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              title="Add a new team"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>

            {/* Quick Manage Teams button */}
            {onOpenTeamManager && (
              <button
                onClick={onOpenTeamManager}
                className="px-2 py-0.5 rounded-lg bg-black/60 hover:bg-black/80 border border-amber-400/50 text-amber-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                title="Manage Teams"
              >
                <Users className="w-3 h-3 text-amber-300" />
                <span>Teams</span>
              </button>
            )}

            {/* Quick Undo */}
            {onUndoLastAction && (
              <button
                onClick={onUndoLastAction}
                disabled={!canUndo}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  canUndo
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-200'
                    : 'bg-black/30 border-stone-800 text-stone-600 cursor-not-allowed'
                }`}
                title="Undo last score action"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>

        {/* Teams List: Compact cards fitting 5-6 teams without window scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 space-y-1.5 py-0.5">
          {teams.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-xs">
              No teams. Click &quot;Add&quot; above to add a team.
            </div>
          ) : (
            teams.map((team, idx) => {
              const isSelected = selectedTeamId === team.id;
              const roundScore = team.roundScores[activeRoundId as 1 | 2 | 3 | 4] || 0;
              const isInlineEditing = inlineEditingTeamId === team.id;
              const isConfirmingDelete = confirmDeleteTeamId === team.id;

              return (
                <div
                  key={team.id}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-purple-900/40 border-amber-400 shadow-[0_0_12px_rgba(255,213,79,0.35)]'
                      : 'bg-black/60 border-stone-800 hover:border-amber-400/50'
                  }`}
                >
                  {/* Team Info & Round Score */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/30 to-purple-800/40 border border-amber-400/80 text-amber-200 font-cinzel font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        {isInlineEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={inlineNameText}
                              onChange={(e) => setInlineNameText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineEdit(team.id);
                                if (e.key === 'Escape') setInlineEditingTeamId(null);
                              }}
                              autoFocus
                              className="w-full bg-[#140824] border border-amber-400 rounded px-1.5 py-0.5 text-white font-outfit font-bold text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveInlineEdit(team.id)}
                              className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span 
                              onClick={() => setSelectedTeamId(isSelected ? null : team.id)}
                              className="font-outfit font-bold text-xs sm:text-sm text-white truncate block tracking-wide cursor-pointer hover:text-amber-300 transition-colors"
                              title="Click to select team"
                            >
                              {team.name}
                            </span>
                            
                            {/* Rename pencil */}
                            <button
                              onClick={() => handleStartInlineEdit(team)}
                              className="opacity-60 hover:opacity-100 p-0.5 rounded text-amber-300 transition-opacity cursor-pointer"
                              title="Rename team"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>

                            {/* Delete team button right on the card! */}
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  onClick={() => handleDeleteTeam(team.id)}
                                  className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9px] font-bold cursor-pointer"
                                  title="Confirm Delete"
                                >
                                  Del
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteTeamId(null)}
                                  className="px-1 py-0.5 rounded bg-stone-700 text-stone-300 text-[9px] cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteTeamId(team.id)}
                                className="opacity-40 hover:opacity-100 p-0.5 rounded text-rose-400 transition-opacity cursor-pointer ml-auto"
                                title={`Delete ${team.name}`}
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-amber-200/80 font-cinzel">
                            Total:
                          </span>
                          <span className="px-1 py-0.2 rounded bg-black/70 border border-amber-400/40 text-[9px] font-cinzel font-black text-amber-300">
                            {team.totalScore} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ROUND SCORE */}
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-[8px] font-cinzel font-bold text-amber-300 uppercase tracking-widest">
                        Round
                      </span>
                      <div className="px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-amber-400 font-cinzel font-black text-base sm:text-lg text-gold-bright shadow-inner min-w-[48px] text-center">
                        {roundScore}
                      </div>
                    </div>
                  </div>

                  {/* SCORE ACTION BUTTONS */}
                  {activeRoundId === 4 ? (
                    /* Round 4 buttons: +20, +10, +5, -5, -10 */
                    <div className="grid grid-cols-5 gap-1 pt-0.5">
                      <button
                        onClick={() => handleDirectScoreAdd(team.id, 20)}
                        className="py-1 rounded bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 text-white font-cinzel font-black text-[11px] shadow border border-rose-300 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`+20 Difficult to ${team.name}`}
                      >
                        +20
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, 10)}
                        className="py-1 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-cinzel font-black text-[11px] shadow border border-emerald-300 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`+10 Easy to ${team.name}`}
                      >
                        +10
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, 5)}
                        className="py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-black text-[11px] shadow border border-amber-200 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`+5 to ${team.name}`}
                      >
                        +5
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, -5)}
                        className="py-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 font-cinzel font-black text-[11px] border border-rose-700 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`-5 to ${team.name}`}
                      >
                        -5
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, -10)}
                        className="py-1 rounded bg-stone-900 hover:bg-stone-800 text-rose-400 font-cinzel font-black text-[11px] border border-rose-900 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`-10 to ${team.name}`}
                      >
                        -10
                      </button>
                    </div>
                  ) : (
                    /* Standard rounds: +10, +5, -5, -10 */
                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                      <button
                        onClick={() => handleDirectScoreAdd(team.id, 10)}
                        className="py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-cinzel font-black text-xs shadow border border-emerald-300 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`+10 to ${team.name}`}
                      >
                        +10
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, 5)}
                        className="py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-black text-xs shadow border border-amber-200 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`+5 to ${team.name}`}
                      >
                        +5
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, -5)}
                        className="py-1 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-300 font-cinzel font-black text-[11px] border border-rose-700 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`-5 to ${team.name}`}
                      >
                        -5
                      </button>

                      <button
                        onClick={() => handleDirectScoreAdd(team.id, -10)}
                        className="py-1 rounded bg-stone-900 hover:bg-stone-800 text-rose-400 font-cinzel font-black text-[11px] border border-rose-900 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title={`-10 to ${team.name}`}
                      >
                        -10
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          FULL-SCREEN QUESTION SPOTLIGHT OVERLAY
          ========================================================================= */}
      {isFullScreenQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/98 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-hidden">
          <div className="relative w-full max-w-[1700px] h-[95vh] max-h-[95vh] bg-gradient-to-b from-[#1C0933] via-[#120522] to-[#0A0214] border-2 sm:border-3 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-[0_0_100px_rgba(255,183,77,0.5)] text-white flex flex-col justify-between overflow-hidden">
            
            {/* Top Bar of Fullscreen Stage Overlay */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-400/40 shrink-0 gap-3">
              <div className="flex items-center gap-3">
                <DiyaIcon size="sm" showSparkles={false} />
                <span className="bg-amber-400 text-stone-950 font-cinzel font-black text-base sm:text-xl px-4 py-1.5 rounded-xl shadow-md shrink-0">
                  Q {currentQuestionNumber} / {totalQuestionsInRound}
                </span>

                <h3 className="font-cinzel font-black text-xl sm:text-2xl text-gold-bright uppercase tracking-wider truncate">
                  {ROUND_NAMES[activeRoundId]}
                </h3>

                {/* Level badge for Round 4 (NO TOPIC NAME!) */}
                {activeRoundId === 4 && (
                  <span className={`font-cinzel font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl uppercase border ${
                    finaleDifficulty === 'easy'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                      : 'bg-rose-950 text-rose-300 border-rose-400'
                  }`}>
                    {finaleDifficulty === 'easy' ? 'Level: Easy • 10 Pts' : 'Level: Difficult • 20 Pts'}
                  </span>
                )}
              </div>

              {/* Right: Round 3 BUZZER BADGE or Timer */}
              <div className="flex items-center gap-2.5 shrink-0">
                {activeRoundId === 3 ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-900 to-amber-900 border border-amber-400 shadow-md">
                    <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span className="font-cinzel font-black text-sm sm:text-base text-gold-bright uppercase tracking-wider">
                      Buzzer Round
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/90 border border-amber-400 shadow-lg">
                    <Clock className="w-5 h-5 text-amber-400" />
                    
                    <button
                      onClick={() => handleAdjustTimerSeconds(-15)}
                      className="px-2 py-0.5 rounded bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 font-cinzel font-bold text-xs cursor-pointer"
                      title="Decrease by 15s"
                    >
                      -15s
                    </button>

                    <span 
                      className={`font-cinzel font-black text-2xl sm:text-3xl min-w-[60px] text-center ${
                        timerSeconds <= 5 && timerSeconds > 0 
                          ? 'text-rose-400 animate-pulse' 
                          : timerSeconds === 0 
                          ? 'text-rose-500' 
                          : 'text-gold-bright'
                      }`}
                    >
                      {timerSeconds}s
                    </span>

                    <button
                      onClick={() => handleAdjustTimerSeconds(15)}
                      className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-cinzel font-bold text-xs cursor-pointer"
                      title="Increase by 15s"
                    >
                      +15s
                    </button>

                    <button
                      onClick={handleToggleTimer}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        isTimerRunning
                          ? 'bg-amber-400 text-stone-950 border-amber-200'
                          : 'bg-purple-900/80 text-amber-200 border-amber-400'
                      }`}
                      title={isTimerRunning ? "Pause" : "Start"}
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handleResetTimer}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Close Fullscreen Overlay */}
                <button
                  onClick={() => setIsFullScreenQuestionOpen(false)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Full Screen"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stage Body: QUESTION & OPTIONS */}
            <div className={`flex-1 flex flex-col justify-center py-4 min-h-0 w-full max-w-[1550px] mx-auto overflow-y-auto custom-scrollbar ${
              activeRoundId === 3 ? 'items-start text-left' : 'items-center text-center'
            }`}>
              
              {/* Question Statement */}
              <div className={`w-full px-2 my-auto shrink-0 ${
                activeRoundId === 3 ? 'text-left mr-auto' : 'text-center mx-auto'
              }`}>
                <h1 className="font-outfit font-black text-2xl sm:text-4xl md:text-5xl text-[#FFF9E6] leading-tight drop-shadow">
                  {currentQuestion.question}
                </h1>

                {currentQuestion.questionHindi && (
                  <h2 className="font-outfit font-bold text-xl sm:text-3xl md:text-4xl text-amber-300 leading-snug drop-shadow mt-3 sm:mt-4">
                    {cleanHindiText(currentQuestion.questionHindi)}
                  </h2>
                )}
              </div>

              {/* MCQ Options Grid */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full pt-4 sm:pt-6 shrink-0 ${
                  activeRoundId === 3 ? 'mr-auto' : 'mx-auto'
                }`}>
                  {currentQuestion.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const optHindi = currentQuestion.optionsHindi?.[i];

                    const cleanOpt = (opt || '').replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();
                    const ans = currentQuestion?.correctAnswer || '';
                    const cleanAns = ans.replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();
                    const letterMatches =
                      ans.trim().toLowerCase().startsWith(letter.toLowerCase() + '.') ||
                      ans.trim().toLowerCase() === letter.toLowerCase();

                    const isCorrectAnswer =
                      showAnswer &&
                      Boolean(
                        (opt && opt.toLowerCase() === ans.toLowerCase()) ||
                        (cleanOpt && cleanAns && cleanOpt === cleanAns) ||
                        letterMatches ||
                        (cleanOpt && ans.toLowerCase().includes(cleanOpt)) ||
                        (cleanAns && cleanOpt.includes(cleanAns))
                      );

                    return (
                      <div
                        key={i}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                          isCorrectAnswer
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-[1.01]'
                            : 'bg-black/75 border-amber-400/60 text-stone-100 hover:border-amber-400'
                        }`}
                      >
                        <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-purple-800/40 border border-amber-400 flex items-center justify-center font-cinzel font-black text-lg sm:text-xl text-amber-200 shrink-0">
                          {letter}
                        </span>
                        
                        <div className="flex-1 text-left min-w-0">
                          <span className="font-outfit font-black text-base sm:text-xl md:text-2xl text-white leading-tight block">
                            {opt}
                          </span>
                          {optHindi && (
                            <span className="font-outfit font-bold text-sm sm:text-lg md:text-xl text-amber-300 leading-tight block mt-0.5">
                              {cleanHindiText(optHindi)}
                            </span>
                          )}
                        </div>

                        {isCorrectAnswer && (
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Correct Answer Reveal Box */}
              {showAnswer && (
                <div className={`w-full rounded-2xl bg-gradient-to-r from-emerald-950 via-[#072417] to-emerald-950 border-2 border-emerald-400 py-3 px-6 animate-in zoom-in-95 mt-4 shrink-0 shadow-lg ${
                  activeRoundId === 3 ? 'text-left mr-auto' : 'text-center mx-auto'
                }`}>
                  <span className="text-xs font-cinzel font-black text-emerald-300 uppercase tracking-widest block mb-0.5">
                    CORRECT ANSWER:
                  </span>
                  <div className={`flex flex-wrap items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-outfit font-black text-white ${
                    activeRoundId === 3 ? 'justify-start' : 'justify-center'
                  }`}>
                    {currentQuestion.correctAnswerHindi && (
                      <span className="text-amber-300 font-black">{cleanHindiText(currentQuestion.correctAnswerHindi)}</span>
                    )}
                    {currentQuestion.correctAnswerHindi && currentQuestion.correctAnswer && (
                      <span className="text-emerald-400/70 font-normal">|</span>
                    )}
                    <span>{currentQuestion.correctAnswer}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="pt-3 border-t border-amber-400/40 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setIsFullScreenQuestionOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white font-cinzel font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Close Full Screen"
              >
                <Minimize2 className="w-4 h-4" />
                <span>CLOSE</span>
              </button>

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`px-8 sm:px-12 py-2.5 sm:py-3 rounded-2xl font-cinzel font-black text-base sm:text-xl tracking-wider uppercase transition-all shadow-xl flex items-center gap-2 border active:scale-95 cursor-pointer ${
                  showAnswer
                    ? 'bg-emerald-600 text-white border-emerald-300'
                    : 'bg-gradient-to-r from-amber-400 via-[#FFF9C4] to-amber-400 text-stone-950 border-white hover:brightness-110'
                }`}
              >
                {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span>{showAnswer ? 'HIDE ANSWER' : 'REVEAL ANSWER'}</span>
              </button>

              <button
                onClick={() => {
                  handleNextQuestion();
                  setIsFullScreenQuestionOpen(false);
                }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-cinzel font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
