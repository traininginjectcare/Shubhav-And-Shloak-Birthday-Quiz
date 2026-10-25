/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Trophy, 
  X, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Users,
  Sparkles
} from 'lucide-react';
import { FinalistTeam, ScoreHistoryEntry } from '../types/quiz';
import { DiyaIcon } from './DiyaIcon';

interface LeaderboardModalProps {
  teams: FinalistTeam[];
  isOpen: boolean;
  onClose: () => void;
  onAdjustScore?: (teamId: string, roundNumber: number, delta: number) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
  lastAction?: ScoreHistoryEntry;
  onToggleShowToAudience?: () => void;
  isAudienceVisible?: boolean;
  onOpenTeamManager?: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  teams,
  isOpen,
  onClose,
  onUndoLastAction,
  canUndo,
  lastAction,
  onToggleShowToAudience,
  isAudienceVisible = false,
  onOpenTeamManager,
}) => {
  if (!isOpen) return null;

  // Sort teams descending by cumulative total score
  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-6xl bg-gradient-to-b from-[#1F0E36] via-[#160B28] to-[#0D0518] border-2 sm:border-3 border-amber-400/70 rounded-3xl p-5 sm:p-9 shadow-[0_0_90px_rgba(255,183,77,0.45)] text-white flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-amber-400/40 mb-4 gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <DiyaIcon size="md" />
            <div>
              <h2 className="font-cinzel font-black text-2xl sm:text-4xl text-gold-gradient tracking-wide uppercase drop-shadow">
                Official Scoreboard
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium font-outfit mt-0.5">
                Shubhav &amp; Shloak&apos;s Birthday Quiz &bull; Diwali Celebration Leaderboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Manage Teams Button */}
            {onOpenTeamManager && (
              <button
                onClick={onOpenTeamManager}
                className="px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit Team Names"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Edit Teams</span>
              </button>
            )}

            {/* Show / Hide on Audience Screen */}
            {onToggleShowToAudience && (
              <button
                onClick={onToggleShowToAudience}
                className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAudienceVisible
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-black/40 border-stone-600 text-stone-300 hover:border-amber-400'
                }`}
                title="Toggle scoreboard visibility on stage"
              >
                {isAudienceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {isAudienceVisible ? 'Visible on Stage' : 'Hidden on Stage'}
                </span>
              </button>
            )}

            {/* Undo button */}
            <button
              onClick={onUndoLastAction}
              disabled={!canUndo}
              className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                canUndo
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-black/30 border-stone-800 text-stone-600 cursor-not-allowed'
              }`}
              title="Undo last score action"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Leaderboard"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Last action notification bar */}
        {lastAction && (
          <div className="mb-3.5 px-4 py-2 rounded-2xl bg-black/50 border border-amber-400/40 text-xs sm:text-sm flex items-center justify-between text-amber-200/90 shrink-0">
            <span>
              <b className="text-amber-300">Last Action:</b> {lastAction.description} ({lastAction.delta > 0 ? `+${lastAction.delta}` : lastAction.delta} pts to {lastAction.teamName})
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {new Date(lastAction.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Teams Table (NO MEMBER NAMES, BIG TEAM NAME, BIG TOTAL BOX) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-400/40 text-xs sm:text-sm font-cinzel text-amber-300 uppercase tracking-wider bg-black/50">
                <th className="py-3.5 px-4">Rank &amp; Team</th>
                <th className="py-3.5 px-3 text-center">R1 (Bollywood)</th>
                <th className="py-3.5 px-3 text-center">R2 (Mythology)</th>
                <th className="py-3.5 px-3 text-center">R3 (Sports)</th>
                <th className="py-3.5 px-3 text-center">R4 (Finale)</th>
                <th className="py-3.5 px-6 text-center text-amber-200 font-black text-sm sm:text-base">TOTAL SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-400/20">
              {sortedTeams.map((team, idx) => {
                const isLeader = idx === 0 && team.totalScore > 0;

                return (
                  <tr 
                    key={team.id}
                    className={`hover:bg-white/5 transition-colors ${
                      isLeader ? 'bg-amber-500/15' : ''
                    }`}
                  >
                    {/* Rank & Team Name (NO MEMBER NAMES!) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        <span className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-500/30 to-purple-800/40 border-2 border-amber-400/80 flex items-center justify-center font-cinzel font-black text-lg sm:text-xl text-amber-200 shrink-0 shadow-md">
                          {idx === 0 ? '👑 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                        </span>
                        <div>
                          <span className="font-outfit font-black text-xl sm:text-2xl lg:text-3xl text-white block tracking-wide">
                            {team.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Round 1 (Bollywood) */}
                    <td className="py-4 px-3 text-center font-cinzel font-black text-xl sm:text-2xl text-stone-200">
                      {team.roundScores[1] || 0}
                    </td>

                    {/* Round 2 (Mythology) */}
                    <td className="py-4 px-3 text-center font-cinzel font-black text-xl sm:text-2xl text-stone-200">
                      {team.roundScores[2] || 0}
                    </td>

                    {/* Round 3 (Sports & Current Affairs) */}
                    <td className="py-4 px-3 text-center font-cinzel font-black text-xl sm:text-2xl text-stone-200">
                      {team.roundScores[3] || 0}
                    </td>

                    {/* Round 4 (Grand Finale) */}
                    <td className="py-4 px-3 text-center font-cinzel font-black text-xl sm:text-2xl text-amber-300">
                      {team.roundScores[4] || 0}
                    </td>

                    {/* TOTAL SCORE BOX */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-block px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-cinzel font-black text-2xl sm:text-4xl shadow-[0_0_25px_rgba(255,213,79,0.5)] border-2 border-white min-w-[100px]">
                        {team.totalScore}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
