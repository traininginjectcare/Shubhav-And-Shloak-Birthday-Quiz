/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MediaType = 'none' | 'image' | 'audio' | 'video';

export type LifelineType = 'askAFriend' | 'fiftyFifty' | 'switchQuestion';

export interface LifelineState {
  askAFriend: boolean;       // true if available, false if used
  fiftyFifty: boolean;        // true if available, false if used
  switchQuestion: boolean;    // true if available, false if used
}

export interface FinalistTeam {
  id: string;
  name: string;
  members?: string[];        // Array of member names e.g. ["Rahul", "Priya", "Aarav"]
  composition?: string;       // Optional composition or description
  roundScores: {
    1: number;
    2: number;
    3: number;
    4: number;
    tieBreaker?: number;
  };
  totalScore: number;
  lifelines: LifelineState;
  // Track which round each lifeline was used in (Max 1 per round, each used only once in contest)
  lifelineUsedInRound: {
    [roundNumber: number]: LifelineType | null;
  };
}

export type RoundDifficulty = 'easy' | 'medium' | 'hard' | 'safe' | 'risk';

export interface StageQuestion {
  id: string;
  roundNumber: 1 | 2 | 3 | 4 | 5; // 1: Bollywood, 2: Mythology, 3: Sports & Current Affairs, 4: Finale, 5: Tie Breaker
  category: string;
  difficulty?: RoundDifficulty;
  question: string;              // English question text
  questionHindi?: string;         // Hindi question text (Devanagari + Hinglish)
  options?: string[];            // 4 options (English)
  optionsHindi?: string[];       // 4 options (Hindi)
  correctAnswer: string;         // English correct answer
  correctAnswerHindi?: string;   // Hindi correct answer
  mediaType?: MediaType;
  mediaUrl?: string;
  mediaPlaceholderText?: string; // e.g. "Audio / Song clip"
  isUsed?: boolean;
  explanation?: string;
  explanationHindi?: string;
  // For tie-breaker numerical
  numericAnswer?: number;
}

export interface ScoreHistoryEntry {
  id: string;
  timestamp: number;
  teamId: string;
  teamName: string;
  roundNumber: number;
  delta: number;
  description: string;
  previousRoundScore: number;
  previousTotalScore: number;
  lifelineRestored?: {
    teamId: string;
    lifeline: LifelineType;
    roundNumber: number;
  };
}

export type ViewMode = 'quizmaster' | 'audience';
