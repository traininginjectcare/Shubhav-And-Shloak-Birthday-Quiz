/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { GameState, Team, FirebaseCustomConfig } from '../types';
import { DEFAULT_QUESTIONS, INITIAL_TEAMS } from '../data/quizQuestions';

const FIREBASE_CONFIG_STORAGE_KEY = 'agrasen_quiz_firebase_config';

export const getStoredFirebaseConfig = (): FirebaseCustomConfig | null => {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
};

export const saveFirebaseConfig = (config: FirebaseCustomConfig) => {
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
};

export class FirebaseSyncService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  private isConnectedToFirebase: boolean = false;
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('agrasen_quiz_sync_channel');
    }
    this.tryInitFirebase();
  }

  public tryInitFirebase(): boolean {
    const config = getStoredFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      this.isConnectedToFirebase = false;
      return false;
    }

    try {
      if (getApps().length === 0) {
        this.app = initializeApp(config);
      } else {
        this.app = getApps()[0];
      }

      this.db = getFirestore(this.app, config.firestoreDatabaseId || '(default)');
      this.auth = getAuth(this.app);
      this.isConnectedToFirebase = true;

      // Authenticate anonymously
      signInAnonymously(this.auth).catch((err) => {
        console.warn('Anonymous auth note (not critical):', err);
      });

      return true;
    } catch (e) {
      console.error('Failed to initialize Firebase with current config:', e);
      this.isConnectedToFirebase = false;
      return false;
    }
  }

  public isFirebaseActive(): boolean {
    return this.isConnectedToFirebase && this.db !== null;
  }

  // Subscribe to live GameState
  public subscribeToGameState(callback: (state: GameState) => void): Unsubscribe {
    if (this.isFirebaseActive() && this.db) {
      const stateDocRef = doc(this.db, 'gameState', 'active');
      return onSnapshot(
        stateDocRef,
        (snap) => {
          if (snap.exists()) {
            callback(snap.data() as GameState);
          } else {
            // Document doesn't exist yet in Firestore, seed it!
            const defaultState = this.getDefaultGameState();
            setDoc(stateDocRef, defaultState).catch(console.error);
            callback(defaultState);
          }
        },
        (error) => {
          console.warn('Firestore gameState snapshot note, falling back to local sync:', error);
          this.subscribeLocalGameState(callback);
        }
      );
    } else {
      return this.subscribeLocalGameState(callback);
    }
  }

  private subscribeLocalGameState(callback: (state: GameState) => void): Unsubscribe {
    // Initial read
    const local = this.getLocalGameState();
    callback(local);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'GAME_STATE_UPDATE') {
        callback(event.data.payload);
      }
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'agrasen_quiz_gameState' && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    if (this.broadcastChannel) {
      this.broadcastChannel.addEventListener('message', handler);
    }
    window.addEventListener('storage', storageHandler);

    return () => {
      if (this.broadcastChannel) {
        this.broadcastChannel.removeEventListener('message', handler);
      }
      window.removeEventListener('storage', storageHandler);
    };
  }

  // Subscribe to Teams
  public subscribeToTeams(callback: (teams: Team[]) => void): Unsubscribe {
    if (this.isFirebaseActive() && this.db) {
      const teamsCollRef = collection(this.db, 'teams');
      return onSnapshot(
        teamsCollRef,
        (snap) => {
          if (!snap.empty) {
            const list: Team[] = [];
            snap.forEach((d) => list.push({ ...(d.data() as Team), id: d.id }));
            callback(list);
          } else {
            // Seed initial teams in Firestore
            this.seedFirestoreTeams();
            callback(INITIAL_TEAMS);
          }
        },
        (error) => {
          console.warn('Firestore teams snapshot note, falling back to local sync:', error);
          this.subscribeLocalTeams(callback);
        }
      );
    } else {
      return this.subscribeLocalTeams(callback);
    }
  }

  private subscribeLocalTeams(callback: (teams: Team[]) => void): Unsubscribe {
    const local = this.getLocalTeams();
    callback(local);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'TEAMS_UPDATE') {
        callback(event.data.payload);
      }
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'agrasen_quiz_teams' && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    if (this.broadcastChannel) {
      this.broadcastChannel.addEventListener('message', handler);
    }
    window.addEventListener('storage', storageHandler);

    return () => {
      if (this.broadcastChannel) {
        this.broadcastChannel.removeEventListener('message', handler);
      }
      window.removeEventListener('storage', storageHandler);
    };
  }

  // Update Game State
  public async updateGameState(patch: Partial<GameState>) {
    const currentState = this.getLocalGameState();
    const updatedState: GameState = {
      ...currentState,
      ...patch,
      updatedAt: Date.now()
    };

    // Save to LocalStorage & broadcast for instant zero-latency UI
    localStorage.setItem('agrasen_quiz_gameState', JSON.stringify(updatedState));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'GAME_STATE_UPDATE', payload: updatedState });
    }

    // Sync to Firestore if active
    if (this.isFirebaseActive() && this.db) {
      try {
        const stateDocRef = doc(this.db, 'gameState', 'active');
        await setDoc(stateDocRef, updatedState, { merge: true });
      } catch (err) {
        console.error('Error syncing gameState to Firestore:', err);
      }
    }
  }

  // Update Team
  public async updateTeam(teamId: string, patch: Partial<Team>) {
    const currentTeams = this.getLocalTeams();
    const idx = currentTeams.findIndex((t) => t.id === teamId);
    let updatedTeams: Team[];

    if (idx !== -1) {
      updatedTeams = [...currentTeams];
      updatedTeams[idx] = { ...updatedTeams[idx], ...patch };
    } else {
      updatedTeams = [...currentTeams, { id: teamId, ...patch } as Team];
    }

    localStorage.setItem('agrasen_quiz_teams', JSON.stringify(updatedTeams));
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'TEAMS_UPDATE', payload: updatedTeams });
    }

    if (this.isFirebaseActive() && this.db) {
      try {
        const teamDocRef = doc(this.db, 'teams', teamId);
        await setDoc(teamDocRef, patch, { merge: true });
      } catch (err) {
        console.error('Error syncing team to Firestore:', err);
      }
    }
  }

  // Trigger Contestant Buzzer
  public async pressBuzzer(teamName: string, teamId: string): Promise<boolean> {
    const state = this.getLocalGameState();
    // Check if buzzer is already locked or inactive
    if (!state.buzzerActive || state.buzzerLocked) {
      return false;
    }

    // First team locks the buzzer
    const now = Date.now();
    await this.updateGameState({
      buzzerLocked: true,
      buzzedTeam: teamName,
      screenState: state.screenState === 'question' ? 'question' : state.screenState
    });

    await this.updateTeam(teamId, {
      buzzerPressed: true,
      buzzerTime: now
    });

    return true;
  }

  // Seed default teams to Firestore
  private async seedFirestoreTeams() {
    if (!this.db) return;
    try {
      for (const t of INITIAL_TEAMS) {
        await setDoc(doc(this.db, 'teams', t.id), t);
      }
    } catch (e) {
      console.warn('Could not seed firestore teams:', e);
    }
  }

  // Local state helpers
  public getDefaultGameState(): GameState {
    const firstQ = DEFAULT_QUESTIONS[0];
    return {
      currentRound: firstQ.round,
      currentQuestion: firstQ.question,
      questionNumber: firstQ.questionNumber,
      options: firstQ.options,
      correctAnswer: firstQ.answer,
      mediaUrl: firstQ.mediaUrl || '',
      mediaType: firstQ.mediaType || 'none',
      timerStatus: 'idle',
      timerDuration: 15,
      timerEndTime: null,
      buzzerActive: true,
      buzzerLocked: false,
      buzzedTeam: null,
      showWinner: false,
      winnerTeam: null,
      screenState: 'idle',
      updatedAt: Date.now()
    };
  }

  public getLocalGameState(): GameState {
    try {
      const raw = localStorage.getItem('agrasen_quiz_gameState');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    const def = this.getDefaultGameState();
    localStorage.setItem('agrasen_quiz_gameState', JSON.stringify(def));
    return def;
  }

  public getLocalTeams(): Team[] {
    try {
      const raw = localStorage.getItem('agrasen_quiz_teams');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    localStorage.setItem('agrasen_quiz_teams', JSON.stringify(INITIAL_TEAMS));
    return INITIAL_TEAMS;
  }
}

export const syncService = new FirebaseSyncService();
