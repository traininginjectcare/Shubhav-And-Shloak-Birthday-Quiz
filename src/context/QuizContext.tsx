/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { GameState, Team, QuizQuestion, ViewMode, MediaType, ScreenState, RoundInfo } from '../types';
import { DEFAULT_QUESTIONS, QUIZ_ROUNDS } from '../data/quizQuestions';
import { syncService } from '../services/firebase';
import { soundEngine } from '../utils/audio';

interface QuizContextValue {
  gameState: GameState;
  teams: Team[];
  currentTeam: Team | null;
  questions: QuizQuestion[];
  rounds: RoundInfo[];
  currentQuestionIdx: number;
  viewMode: ViewMode;
  isFirebaseActive: boolean;
  setViewMode: (mode: ViewMode) => void;
  loginTeam: (name: string, pin: string) => Promise<boolean>;
  logoutTeam: () => void;
  pressBuzzer: () => Promise<boolean>;
  resetBuzzer: () => Promise<void>;
  adjustScore: (teamId: string, delta: number) => Promise<void>;
  addNewTeam: (name: string, pin?: string) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  loadQuestion: (question: QuizQuestion) => Promise<void>;
  nextQuestion: () => Promise<void>;
  prevQuestion: () => Promise<void>;
  pushMedia: (url: string, type: MediaType) => Promise<void>;
  startTimer: (seconds: number) => Promise<void>;
  stopTimer: () => Promise<void>;
  revealWinner: () => Promise<void>;
  hideWinner: () => Promise<void>;
  setScreenState: (state: ScreenState) => Promise<void>;
  reloadFirebase: () => void;
  resetGameSession: () => Promise<void>;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

const CURRENT_TEAM_STORAGE_KEY = 'agrasen_quiz_my_team';

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => syncService.getLocalGameState());
  const [teams, setTeams] = useState<Team[]>(() => syncService.getLocalTeams());
  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_TEAM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Check URL params for initial view route (e.g. ?view=contestant or ?view=admin or ?view=projector)
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('view') as ViewMode;
      if (mode && ['contestant', 'admin', 'projector'].includes(mode)) {
        return mode;
      }
    }
    return 'projector'; // default to high impact projector screen
  });

  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(() => syncService.isFirebaseActive());

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', mode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Sync subscriptions
  useEffect(() => {
    const unsubState = syncService.subscribeToGameState((newState) => {
      setGameState(newState);
    });

    const unsubTeams = syncService.subscribeToTeams((newTeams) => {
      setTeams(newTeams);
      // Keep current team updated with latest score/status
      if (currentTeam) {
        const found = newTeams.find((t) => t.id === currentTeam.id);
        if (found) {
          setCurrentTeam(found);
          localStorage.setItem(CURRENT_TEAM_STORAGE_KEY, JSON.stringify(found));
        }
      }
    });

    return () => {
      unsubState();
      unsubTeams();
    };
  }, [currentTeam?.id]);

  // Audio effect triggers based on state changes
  useEffect(() => {
    // If someone buzzed, play buzzer sound
    if (gameState.buzzerLocked && gameState.buzzedTeam) {
      soundEngine.playBuzzer();
    }
  }, [gameState.buzzerLocked, gameState.buzzedTeam]);

  // Find index of current question in DEFAULT_QUESTIONS
  const currentQuestionIdx = useMemo(() => {
    const idx = DEFAULT_QUESTIONS.findIndex(
      (q) => q.question === gameState.currentQuestion && q.round === gameState.currentRound
    );
    if (idx !== -1) return idx;
    const byText = DEFAULT_QUESTIONS.findIndex((q) => q.question === gameState.currentQuestion);
    return byText !== -1 ? byText : 0;
  }, [gameState.currentQuestion, gameState.currentRound]);

  // Actions
  const loginTeam = async (name: string, pin: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    // Check existing team or create new
    let matched = teams.find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (matched) {
      // Validate pin if configured
      if (matched.pin && matched.pin !== pin) {
        return false;
      }
      const updated: Team = { ...matched, isLoggedIn: true };
      await syncService.updateTeam(matched.id, { isLoggedIn: true });
      setCurrentTeam(updated);
      localStorage.setItem(CURRENT_TEAM_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } else {
      // Create new team
      const newId = `team-${Date.now()}`;
      const newTeam: Team = {
        id: newId,
        name: trimmedName,
        score: 0,
        isLoggedIn: true,
        buzzerPressed: false,
        pin: pin || '1234'
      };
      await syncService.updateTeam(newId, newTeam);
      setCurrentTeam(newTeam);
      localStorage.setItem(CURRENT_TEAM_STORAGE_KEY, JSON.stringify(newTeam));
      return true;
    }
  };

  const logoutTeam = () => {
    if (currentTeam) {
      syncService.updateTeam(currentTeam.id, { isLoggedIn: false });
    }
    setCurrentTeam(null);
    localStorage.removeItem(CURRENT_TEAM_STORAGE_KEY);
  };

  const pressBuzzer = async (): Promise<boolean> => {
    if (!currentTeam) return false;
    const success = await syncService.pressBuzzer(currentTeam.name, currentTeam.id);
    return success;
  };

  const resetBuzzer = async () => {
    // Reset all teams buzzer pressed status
    for (const team of teams) {
      if (team.buzzerPressed) {
        await syncService.updateTeam(team.id, { buzzerPressed: false, buzzerTime: null });
      }
    }
    await syncService.updateGameState({
      buzzerActive: true,
      buzzerLocked: false,
      buzzedTeam: null
    });
  };

  const adjustScore = async (teamId: string, delta: number) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    const newScore = Math.max(0, team.score + delta);
    soundEngine.playScoreChange(delta > 0);
    await syncService.updateTeam(teamId, { score: newScore });
  };

  const addNewTeam = async (name: string, pin: string = '1234') => {
    const newId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      name: name.trim(),
      score: 0,
      isLoggedIn: true,
      buzzerPressed: false,
      pin
    };
    await syncService.updateTeam(newId, newTeam);
  };

  const deleteTeam = async (teamId: string) => {
    const filtered = teams.filter((t) => t.id !== teamId);
    localStorage.setItem('agrasen_quiz_teams', JSON.stringify(filtered));
    setTeams(filtered);
    if (currentTeam?.id === teamId) {
      logoutTeam();
    }
  };

  const loadQuestion = async (q: QuizQuestion) => {
    // Reset buzzer automatically for new question
    for (const team of teams) {
      if (team.buzzerPressed) {
        await syncService.updateTeam(team.id, { buzzerPressed: false, buzzerTime: null });
      }
    }

    await syncService.updateGameState({
      currentRound: q.round,
      currentQuestion: q.question,
      questionNumber: q.questionNumber,
      options: q.options,
      correctAnswer: q.answer,
      mediaUrl: q.mediaUrl || '',
      mediaType: q.mediaType || 'none',
      timerStatus: 'idle',
      timerEndTime: null,
      buzzerActive: true,
      buzzerLocked: false,
      buzzedTeam: null,
      showWinner: false,
      screenState: q.mediaUrl && q.mediaType !== 'none' ? 'media' : 'question'
    });
  };

  const nextQuestion = async () => {
    const nextIdx = (currentQuestionIdx + 1) % DEFAULT_QUESTIONS.length;
    await loadQuestion(DEFAULT_QUESTIONS[nextIdx]);
  };

  const prevQuestion = async () => {
    const prevIdx = (currentQuestionIdx - 1 + DEFAULT_QUESTIONS.length) % DEFAULT_QUESTIONS.length;
    await loadQuestion(DEFAULT_QUESTIONS[prevIdx]);
  };

  const pushMedia = async (url: string, type: MediaType) => {
    await syncService.updateGameState({
      mediaUrl: url,
      mediaType: type,
      screenState: type !== 'none' ? 'media' : 'question'
    });
  };

  const startTimer = async (seconds: number) => {
    const endTime = Date.now() + seconds * 1000;
    await syncService.updateGameState({
      timerStatus: 'running',
      timerDuration: seconds,
      timerEndTime: endTime
    });
  };

  const stopTimer = async () => {
    await syncService.updateGameState({
      timerStatus: 'ended',
      timerEndTime: null
    });
  };

  const revealWinner = async () => {
    // Find top scoring team
    const sorted = [...teams].sort((a, b) => b.score - a.score);
    const topTeam = sorted.length > 0 ? sorted[0].name : 'All Families';

    await syncService.updateGameState({
      showWinner: true,
      winnerTeam: topTeam,
      screenState: 'winner'
    });
  };

  const hideWinner = async () => {
    await syncService.updateGameState({
      showWinner: false,
      winnerTeam: null,
      screenState: 'question'
    });
  };

  const setScreenState = async (state: ScreenState) => {
    await syncService.updateGameState({ screenState: state });
  };

  const reloadFirebase = () => {
    const ok = syncService.tryInitFirebase();
    setIsFirebaseActive(ok);
  };

  const resetGameSession = async () => {
    const firstQ = DEFAULT_QUESTIONS[0];
    const resetTeams = teams.map((t) => ({ ...t, buzzerPressed: false, score: 0 }));
    for (const t of resetTeams) {
      await syncService.updateTeam(t.id, t);
    }
    await loadQuestion(firstQ);
  };

  return (
    <QuizContext.Provider
      value={{
        gameState,
        teams,
        currentTeam,
        questions: DEFAULT_QUESTIONS,
        rounds: QUIZ_ROUNDS,
        currentQuestionIdx,
        viewMode,
        isFirebaseActive,
        setViewMode,
        loginTeam,
        logoutTeam,
        pressBuzzer,
        resetBuzzer,
        adjustScore,
        addNewTeam,
        deleteTeam,
        loadQuestion,
        nextQuestion,
        prevQuestion,
        pushMedia,
        startTimer,
        stopTimer,
        revealWinner,
        hideWinner,
        setScreenState,
        reloadFirebase,
        resetGameSession
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
