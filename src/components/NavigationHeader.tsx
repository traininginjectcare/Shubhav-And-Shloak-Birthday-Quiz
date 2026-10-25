/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { ViewMode } from '../types';
import {
  Smartphone,
  Sliders,
  Tv,
  ExternalLink,
  Volume2,
  VolumeX,
  Database,
  Crown,
  Share2,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { FirebaseModal } from './FirebaseModal';

export const NavigationHeader: React.FC = () => {
  const { viewMode, setViewMode, isFirebaseActive, reloadFirebase } = useQuiz();
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const openInNewWindow = (mode: ViewMode) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', mode);
    window.open(url.toString(), `_blank_${mode}`, 'noopener,noreferrer');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1D0306]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Event Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-[#2A050B] shadow-md font-bold">
              <Crown className="w-5 h-5 text-[#3B0610]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-sm sm:text-base tracking-wide text-gold-gradient">
                  AGRASEN JAYANTI
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#D4AF37]/20 text-[#F9E79F] rounded-full border border-[#D4AF37]/40">
                  Family Quiz
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 hidden sm:block">
                Interactive Multi-Screen Quiz Show
              </p>
            </div>
          </div>

          {/* Three View Switcher Tabs */}
          <nav className="flex items-center bg-black/50 p-1 rounded-xl border border-[#D4AF37]/25 shadow-inner">
            <button
              onClick={() => setViewMode('contestant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'contestant'
                  ? 'bg-gold-gradient text-[#2A050B] shadow-md font-bold'
                  : 'text-amber-100/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Contestant (Mobile)</span>
            </button>

            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'admin'
                  ? 'bg-gold-gradient text-[#2A050B] shadow-md font-bold'
                  : 'text-amber-100/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>

            <button
              onClick={() => setViewMode('projector')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'projector'
                  ? 'bg-gold-gradient text-[#2A050B] shadow-md font-bold'
                  : 'text-amber-100/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Projector Screen</span>
            </button>
          </nav>

          {/* Utility Tools: Popout, Sound, Firebase, Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openInNewWindow(viewMode)}
              title="Open current view in a new tab/window"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-200/90 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-amber-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pop Out</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              title="Share links with families"
              className="p-1.5 text-amber-200/90 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-amber-500/20"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMuted
                  ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                  : 'text-[#F9E79F] border-[#D4AF37]/30 bg-[#D4AF37]/10'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              title="Firebase Realtime Sync"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isFirebaseActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isFirebaseActive ? 'Firebase Live' : 'Firebase Sync'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Share Links Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#2B060D] border-2 border-[#D4AF37]/60 rounded-2xl p-6 text-slate-100 shadow-2xl">
            <h3 className="text-xl font-bold font-cinzel text-gold-gradient mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              Join Agrasen Jayanti Quiz
            </h3>
            <p className="text-xs text-amber-100/70 mb-4">
              Share these links with contestants and event technicians:
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Contestant Mobile Buzzer
                </span>
                <p className="text-xs font-mono text-slate-300 break-all mt-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/?view=contestant` : ''}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?view=contestant`);
                    alert('Copied Contestant Link!');
                  }}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
                >
                  Copy Link
                </button>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Projector Screen (Audience)
                </span>
                <p className="text-xs font-mono text-slate-300 break-all mt-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/?view=projector` : ''}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?view=projector`);
                    alert('Copied Projector Link!');
                  }}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:underline"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl font-bold bg-gold-gradient text-[#2A050B] hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Firebase Modal */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onConfigUpdated={() => reloadFirebase()}
      />
    </>
  );
};
