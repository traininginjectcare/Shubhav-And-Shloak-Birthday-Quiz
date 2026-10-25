/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Database, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { getStoredFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig, syncService } from '../services/firebase';
import { FirebaseCustomConfig } from '../types';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose, onConfigUpdated }) => {
  const currentConfig = getStoredFirebaseConfig();
  const [configJson, setConfigJson] = useState<string>(
    currentConfig ? JSON.stringify(currentConfig, null, 2) : ''
  );
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed: FirebaseCustomConfig = JSON.parse(configJson);
      if (!parsed.apiKey || !parsed.projectId) {
        setStatusMsg('Error: Config must at least have apiKey and projectId.');
        return;
      }
      saveFirebaseConfig(parsed);
      const success = syncService.tryInitFirebase();
      onConfigUpdated();
      setStatusMsg(success ? 'Firebase configured and connected successfully!' : 'Saved config. Initialized sync.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setStatusMsg('Error: Invalid JSON format. Please paste valid Firebase config object.');
    }
  };

  const handleReset = () => {
    clearFirebaseConfig();
    setConfigJson('');
    onConfigUpdated();
    setStatusMsg('Cleared Firebase credentials. Using built-in real-time sync.');
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamId} {
      allow read, write: if true;
    }
    match /gameState/{stateId} {
      allow read, write: if true;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#2D060D] border-2 border-[#D4AF37]/60 rounded-2xl p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#D4AF37]/20 rounded-xl text-[#F9E79F] border border-[#D4AF37]/40">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-gold-gradient">Firebase Realtime Sync Setup</h2>
            <p className="text-sm text-slate-300">
              Sync scores, buzzers, and projector display live across 300+ attendees.
            </p>
          </div>
        </div>

        {/* Current status */}
        <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${syncService.isFirebaseActive() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-sm">
                Status: {syncService.isFirebaseActive() ? 'Connected to Cloud Firestore' : 'Built-in High-Speed Local & Network Sync Active'}
              </span>
            </div>
            {syncService.isFirebaseActive() && (
              <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Live Cloud Sync
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Note: The app is completely interactive out-of-the-box! To sync between different physical phones on separate networks, paste your Firebase web config below.
          </p>
        </div>

        {/* Firebase Config Input */}
        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-[#F9E79F]">
            Paste Firebase Web Configuration (from Firebase Console &gt; Project Settings &gt; General &gt; Your Apps)
          </label>
          <textarea
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "agrasen-quiz.firebaseapp.com",
  "projectId": "agrasen-quiz",
  "storageBucket": "agrasen-quiz.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef"
}`}
            rows={7}
            className="w-full px-4 py-3 bg-black/60 border border-amber-500/30 rounded-xl text-sm font-mono text-amber-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${statusMsg.startsWith('Error') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
            {statusMsg}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end mb-6">
          {currentConfig && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm text-rose-300 hover:bg-rose-500/20 border border-rose-500/30"
            >
              Disconnect Firebase
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gold-gradient text-[#2A050B] hover:brightness-110 shadow-lg cursor-pointer"
          >
            Save & Connect Firebase
          </button>
        </div>

        {/* Firestore Security Rules helper */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#F9E79F]">Firestore Security Rules (Optional Reference)</h3>
            <button
              onClick={copyRules}
              className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/10"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Rules'}
            </button>
          </div>
          <pre className="p-3 bg-black/70 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-white/5">
            {sampleRules}
          </pre>
        </div>
      </div>
    </div>
  );
};
