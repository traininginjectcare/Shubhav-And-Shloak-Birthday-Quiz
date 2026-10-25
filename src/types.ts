/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  id: string;
  name: string;
  score: number;
  isLoggedIn: boolean;
  buzzerPressed: boolean;
  buzzerTime?: number | null;
  pin: string;
}

export type MediaType = 'none' | 'image' | 'video' | 'youtube' | 'audio';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'ended';
export type ScreenState = 'idle' | 'question' | 'media' | 'winner';

export interface RoundInfo {
  id: number;
  name: string;
  theme: string;
  howItWorks: string;
  iconName?: string;
}

export interface GameState {
  currentRound: string;
  currentQuestion: string;
  questionNumber: number;
  options?: string[];
  correctAnswer?: string;
  mediaUrl: string;
  mediaType: MediaType;
  timerStatus: TimerStatus;
  timerDuration: number;
  timerEndTime: number | null;
  buzzerActive: boolean;
  buzzerLocked: boolean;
  buzzedTeam: string | null;
  showWinner: boolean;
  winnerTeam: string | null;
  screenState: ScreenState;
  updatedAt: number;
}

export interface QuizQuestion {
  id: string;
  round: string;
  questionNumber: number;
  question: string;
  options?: string[];
  answer: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  explanation?: string;
}

export type ViewMode = 'contestant' | 'admin' | 'projector';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}
