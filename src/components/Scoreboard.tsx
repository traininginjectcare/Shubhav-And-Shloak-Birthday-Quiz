/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Plus, Minus, RotateCcw, UserPlus, Trash2, Edit2, Check, ArrowUpDown } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface ScoreTeam {
  id: string;
  name: string;
  score: number;
}

interface ScoreboardProps {
  teams: ScoreTeam[];
  onUpdateScore: (teamId: string, delta: number) => void;
  onSetScore: (teamId: string, newScore: number) => void;
  onAddTeam: (name: string) => void;
  onDeleteTeam: (teamId: string) => void;
  onRenameTeam: (teamId: string, newName: string) => void;
  onResetScores: () => void;
  isCompact?: boolean;
  onToggleCompact?: () => void;
  className?: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  onUpdateScore,
  onSetScore,
  onAddTeam,
  onDeleteTeam,
  onRenameTeam,
  onResetScores,
  isCompact = false,
  className = ''
}) => {
  const [isSortedByRank, setIsSortedByRank] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Sorting logic
  const displayTeams = [...teams].sort((a, b) => {
    if (!isSortedByRank) return 0;
    return b.score - a.score;
  });

  const handleScoreChange = (teamId: string, delta: number) => {
    soundEngine.playScoreChange(delta > 0);
    onUpdateScore(teamId, delta);
  };

  const handleStartRename = (team: ScoreTeam) => {
    setEditingTeamId(team.id);
    setEditingName(team.name);
  };

  const handleSaveRename = (teamId: string) => {
    if (editingName.trim()) {
      onRenameTeam(teamId, editingName.trim());
    }
    setEditingTeamId(null);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim());
      setNewTeamName('');
      setIsAddingTeam(false);
    }
  };

  return (
    <div className={`bg-gradient-to-b from-[#34070E] to-[#1E0307] border-2 border-[#D4AF37]/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-4 md:p-5 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#590C19] border border-[#D4AF37] flex items-center justify-center text-amber-300 shadow-sm">
            <Trophy className="w-4 h-4 text-[#FFDF73]" />
          </div>
          <div>
            <h2 className="font-cinzel font-bold text-base md:text-lg text-gold-gradient tracking-wide">
              Live Scoreboard
            </h2>
            <p className="text-[11px] text-amber-200/70 font-medium">
              {teams.length} Competing Families
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSortedByRank(!isSortedByRank)}
            title={isSortedByRank ? "Sorted by Points" : "Sorted by Entry Order"}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isSortedByRank 
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-200' 
                : 'bg-black/30 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">{isSortedByRank ? 'Ranked' : 'Order'}</span>
          </button>

          <button
            onClick={() => setIsAddingTeam(true)}
            className="p-1.5 rounded-lg bg-[#590C19] hover:bg-[#721021] border border-amber-400/40 text-amber-200 text-xs flex items-center gap-1 font-medium transition-colors"
            title="Add New Family Team"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Team</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all team scores to 0?')) {
                onResetScores();
              }
            }}
            title="Reset Scores to 0"
            className="p-1.5 rounded-lg bg-black/30 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-700/60 text-stone-400 hover:text-rose-300 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Team Inline Form */}
      {isAddingTeam && (
        <form onSubmit={handleCreateTeam} className="mb-3 p-2.5 rounded-xl bg-black/40 border border-amber-400/40 flex items-center gap-2">
          <input
            type="text"
            placeholder="Family Team Name (e.g. Bansal Blasters)"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            autoFocus
            className="flex-1 bg-stone-900/80 border border-amber-400/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-300"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAddingTeam(false)}
            className="px-2 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Team Roster List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px] custom-scrollbar">
        {displayTeams.map((team, index) => {
          const isFirst = index === 0 && team.score > 0 && isSortedByRank;
          const isSecond = index === 1 && team.score > 0 && isSortedByRank;
          const isThird = index === 2 && team.score > 0 && isSortedByRank;

          return (
            <div
              key={team.id}
              className={`group rounded-xl p-2.5 border transition-all duration-200 flex items-center justify-between gap-3 ${
                isFirst
                  ? 'bg-gradient-to-r from-[#5E1220] to-[#3B070F] border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : isSecond
                  ? 'bg-[#3C0811] border-slate-300/50'
                  : isThird
                  ? 'bg-[#36060F] border-amber-700/50'
                  : 'bg-black/30 border-amber-900/40 hover:border-amber-500/40'
              }`}
            >
              {/* Rank & Team Name */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-cinzel font-black text-xs">
                  {isFirst ? (
                    <span className="text-base" title="1st Place Champion">👑</span>
                  ) : isSecond ? (
                    <span className="text-base" title="2nd Place">🥈</span>
                  ) : isThird ? (
                    <span className="text-base" title="3rd Place">🥉</span>
                  ) : (
                    <span className="w-6 h-6 rounded-md bg-black/40 border border-stone-700/50 flex items-center justify-center text-stone-300 text-[11px] font-bold">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Team Name / Edit field */}
                {editingTeamId === team.id ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-black/60 border border-amber-400 rounded px-2 py-0.5 text-xs text-white flex-1 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(team.id)}
                      className="p-1 rounded bg-amber-500 text-stone-950 hover:bg-amber-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-xs md:text-sm text-amber-100 truncate tracking-wide">
                      {team.name}
                    </span>
                    <button
                      onClick={() => handleStartRename(team)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-amber-300 transition-opacity"
                      title="Rename Team"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Score & Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Score Number Display */}
                <div 
                  className={`min-w-[48px] px-2 py-1 rounded-lg text-center font-cinzel font-black text-base md:text-lg tracking-wider ${
                    team.score > 0 
                      ? 'bg-[#590C19] text-[#FFDF73] border border-[#D4AF37]/60 shadow-sm'
                      : team.score < 0
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      : 'bg-black/40 text-stone-400 border border-stone-800'
                  }`}
                >
                  {team.score}
                </div>

                {/* Quick Points Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleScoreChange(team.id, 10)}
                    title="Add 10 Points"
                    className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleScoreChange(team.id, 5)}
                    title="Add 5 Points"
                    className="w-6 h-7 rounded-lg bg-amber-950/60 hover:bg-amber-800 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-[11px] flex items-center justify-center transition-transform active:scale-95"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleScoreChange(team.id, -5)}
                    title="Deduct 5 Points"
                    className="w-6 h-7 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/40 text-rose-300 hover:text-white font-bold text-[11px] flex items-center justify-center transition-transform active:scale-95"
                  >
                    -5
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${team.name}?`)) {
                        onDeleteTeam(team.id);
                      }
                    }}
                    title="Remove Team"
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-rose-400 transition-opacity ml-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-amber-200/60 font-medium">
        <span>Click +10 / -5 to award points</span>
        <span className="text-[#FFDF73] font-semibold">Standard: +10 pts</span>
      </div>
    </div>
  );
};
