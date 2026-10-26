/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Clock, 
  Maximize2
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FullScreenTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDuration?: number;
}

export const FullScreenTimerModal: React.FC<FullScreenTimerModalProps> = ({
  isOpen,
  onClose,
  defaultDuration = 60,
}) => {
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [secondsLeft, setSecondsLeft] = useState<number>(defaultDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync default duration when modal opens
  useEffect(() => {
    if (isOpen) {
      setDuration(defaultDuration);
      setSecondsLeft(defaultDuration);
      setIsRunning(false);
    }
  }, [isOpen, defaultDuration]);

  // Timer interval effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) {
              soundEngine.playTimeUp();
            }
            return 0;
          }
          if (soundEnabled && prev <= 6) {
            soundEngine.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft, soundEnabled]);

  // Keyboard shortcut listener (Space = Toggle, Esc = Close, R = Reset)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsRunning(false);
        setSecondsLeft(duration);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const handleToggle = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(duration);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration);
  };

  const handleAdjust = (delta: number) => {
    if (isRunning) {
      setSecondsLeft((prev) => Math.max(0, prev + delta));
    } else {
      const next = Math.max(5, duration + delta);
      setDuration(next);
      setSecondsLeft(next);
    }
  };

  const handlePreset = (presetSec: number) => {
    setIsRunning(false);
    setDuration(presetSec);
    setSecondsLeft(presetSec);
  };

  // Format MM:SS or SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (totalSec >= 60) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  const percentage = duration > 0 ? (secondsLeft / duration) * 100 : 0;
  const isDanger = secondsLeft <= 5 && secondsLeft > 0;
  const isTimeUp = secondsLeft === 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F041D]/95 bg-radial from-[#2B0E4E] via-[#16062A] to-[#0A0214] backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 md:p-12 text-white select-none animate-in fade-in duration-200 overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b-2 border-amber-400/40 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-purple-800/40 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(255,213,79,0.4)]">
            <Clock className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="font-cinzel font-black text-xl sm:text-3xl text-gold-gradient tracking-wide uppercase drop-shadow">
              Stage Countdown Timer
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
              Diwali Party Family Quiz &bull; Stage Countdown Timer
            </p>
          </div>
        </div>

        {/* Action Controls Top Right */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2 text-xs font-cinzel font-bold ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg'
                : 'bg-black/50 border-stone-700 text-stone-400'
            }`}
            title={soundEnabled ? "Mute Timer Sounds" : "Enable Timer Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-300" /> : <VolumeX className="w-5 h-5 text-stone-500" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Close Fullscreen Modal */}
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 text-stone-200 hover:text-white transition-colors"
            title="Exit Full Screen Timer (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Massive Timer Center */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto min-h-0 relative">
        
        {/* Subtle Background Glow */}
        <div className={`absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
          isTimeUp 
            ? 'bg-rose-600/25' 
            : isDanger 
            ? 'bg-rose-500/20' 
            : 'bg-[#D4AF37]/15'
        }`} />

        {/* Progress Bar Container */}
        <div className="w-full max-w-3xl mb-4 sm:mb-6">
          <div className="w-full h-3 sm:h-4 bg-black/60 rounded-full border border-amber-400/40 p-0.5 overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isTimeUp
                  ? 'bg-rose-600'
                  : isDanger
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#D4AF37]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>

        {/* Massive Digit Display */}
        <div className="relative text-center">
          <div 
            onClick={handleToggle}
            className="cursor-pointer select-none transition-transform active:scale-95 group"
            title="Click to Start / Pause (or press Space)"
          >
            <span 
              className={`font-cinzel font-black tracking-wider transition-all duration-300 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] ${
                isTimeUp 
                  ? 'text-rose-500 text-7xl sm:text-9xl md:text-[13rem] animate-pulse'
                  : isDanger 
                  ? 'text-rose-400 text-8xl sm:text-[11rem] md:text-[15rem] animate-pulse'
                  : 'text-gold-gradient text-8xl sm:text-[11rem] md:text-[15rem]'
              }`}
            >
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Status Badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full font-cinzel font-black text-xs sm:text-sm tracking-widest uppercase border-2 shadow-lg ${
              isTimeUp
                ? 'bg-rose-950 border-rose-500 text-rose-300 animate-bounce'
                : isRunning
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                : 'bg-amber-950/80 border-amber-400/60 text-amber-200'
            }`}>
              {isTimeUp ? "TIME'S UP!" : isRunning ? "RUNNING • SPACE TO PAUSE" : "PAUSED • SPACE TO START"}
            </span>
          </div>
        </div>

        {/* Adjustment Buttons (-15s, +15s, -30s, +30s) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap">
          <button
            onClick={() => handleAdjust(-30)}
            className="px-3.5 py-2 rounded-xl bg-black/50 hover:bg-black/80 border border-stone-700 text-stone-300 hover:text-white font-cinzel font-bold text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-all"
            title="Subtract 30 seconds"
          >
            <Minus className="w-4 h-4" />
            <span>30s</span>
          </button>

          <button
            onClick={() => handleAdjust(-15)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-cinzel font-bold text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-all"
            title="Subtract 15 seconds"
          >
            <Minus className="w-4 h-4" />
            <span>15s</span>
          </button>

          {/* Big Play / Pause Center Button */}
          <button
            onClick={handleToggle}
            className={`px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl font-cinzel font-black text-base sm:text-xl tracking-wider uppercase flex items-center gap-3 transition-transform active:scale-95 shadow-[0_0_35px_rgba(212,175,55,0.6)] border-2 border-white ${
              isRunning
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950'
                : 'bg-gradient-to-r from-[#D4AF37] via-[#FFE58F] to-[#D4AF37] text-stone-950 hover:brightness-110'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-stone-950" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-stone-950" />
                <span>{secondsLeft === 0 ? 'RESTART' : 'START'}</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 hover:text-white font-cinzel font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
            title="Reset to selected duration (R)"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={() => handleAdjust(15)}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-cinzel font-bold text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-all"
            title="Add 15 seconds"
          >
            <Plus className="w-4 h-4" />
            <span>15s</span>
          </button>

          <button
            onClick={() => handleAdjust(30)}
            className="px-3.5 py-2 rounded-xl bg-black/50 hover:bg-black/80 border border-stone-700 text-stone-300 hover:text-white font-cinzel font-bold text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-all"
            title="Add 30 seconds"
          >
            <Plus className="w-4 h-4" />
            <span>30s</span>
          </button>
        </div>
      </div>

      {/* Bottom Presets Bar */}
      <div className="pt-4 border-t-2 border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/80 font-cinzel font-bold">
          <span>Quick Presets:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[
            { label: '15s', sec: 15 },
            { label: '30s', sec: 30 },
            { label: '45s', sec: 45 },
            { label: '60s (1m)', sec: 60 },
            { label: '90s (1.5m)', sec: 90 },
            { label: '2 min', sec: 120 },
            { label: '3 min', sec: 180 },
            { label: '5 min', sec: 300 },
          ].map((preset) => {
            const isCurrent = duration === preset.sec && !isRunning;
            return (
              <button
                key={preset.sec}
                onClick={() => handlePreset(preset.sec)}
                className={`px-3 py-1.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-stone-950 font-black shadow-lg scale-105 border border-white'
                    : 'bg-black/50 hover:bg-black/80 text-stone-300 border border-stone-700 hover:border-amber-400/50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] sm:text-xs text-amber-200/60 font-outfit">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-stone-700 text-amber-300">Space</kbd> to toggle, <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-stone-700 text-amber-300">R</kbd> to reset, <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-stone-700 text-amber-300">Esc</kbd> to exit.
        </div>
      </div>
    </div>
  );
};
