/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  Edit3, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { FinalistTeam } from '../types/quiz';
import { DiyaIcon } from './DiyaIcon';

interface TeamManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: FinalistTeam[];
  onUpdateTeams: (teams: FinalistTeam[]) => void;
}

export const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  isOpen,
  onClose,
  teams,
  onUpdateTeams,
}) => {
  const [localTeams, setLocalTeams] = useState<FinalistTeam[]>(teams);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync with prop when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalTeams(teams);
      setConfirmDeleteId(null);
    }
  }, [isOpen, teams]);

  if (!isOpen) return null;

  const handleTeamNameChange = (id: string, newName: string) => {
    const updated = localTeams.map((t) => (t.id === id ? { ...t, name: newName } : t));
    setLocalTeams(updated);
    onUpdateTeams(updated);
  };

  const handleAddNewTeam = () => {
    const nextIdx = localTeams.length + 1;
    const newTeam: FinalistTeam = {
      id: `team-${Date.now()}`,
      name: `Team ${nextIdx}`,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      totalScore: 0,
      lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
      lifelineUsedInRound: {},
    };

    const updated = [...localTeams, newTeam];
    setLocalTeams(updated);
    onUpdateTeams(updated);
  };

  const handleDeleteTeamDirect = (id: string) => {
    const updated = localTeams.filter((t) => t.id !== id);
    setLocalTeams(updated);
    onUpdateTeams(updated);
    setConfirmDeleteId(null);
  };

  const handleResetScores = () => {
    const reset = localTeams.map((t) => ({
      ...t,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0, tieBreaker: 0 },
      totalScore: 0,
      lifelines: { askAFriend: true, fiftyFifty: true, switchQuestion: true },
      lifelineUsedInRound: {},
    }));
    setLocalTeams(reset);
    onUpdateTeams(reset);
  };

  const handleSaveAndClose = () => {
    const sanitized = localTeams.map((t, idx) => ({
      ...t,
      name: t.name.trim() || `Team ${idx + 1}`,
    }));
    onUpdateTeams(sanitized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1C0D32] via-[#140824] to-[#0A0214] border-2 border-amber-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl text-white flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/30 mb-3 gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <DiyaIcon size="sm" showSparkles={false} />
            <div>
              <h2 className="font-cinzel font-black text-lg sm:text-xl text-gold-gradient tracking-wide">
                Manage Quiz Teams
              </h2>
              <p className="text-xs text-amber-200/80 font-medium">
                Add, rename or delete teams (no member names required)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar: Add Team + Reset */}
        <div className="flex items-center justify-between gap-2.5 mb-3 shrink-0 flex-wrap">
          <button
            onClick={handleAddNewTeam}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-stone-950 font-cinzel font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD NEW TEAM</span>
          </button>

          <button
            onClick={handleResetScores}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset all team scores"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Scores to 0</span>
          </button>
        </div>

        {/* Team list: Compact, clear inputs with instant working delete button */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {localTeams.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              No teams added yet. Click &quot;+ ADD NEW TEAM&quot; above to create one.
            </div>
          ) : (
            localTeams.map((team, idx) => {
              const isConfirming = confirmDeleteId === team.id;

              return (
                <div
                  key={team.id}
                  className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-amber-400/30 hover:border-amber-400/70 transition-all flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-purple-600/30 border border-amber-400/60 text-amber-200 font-cinzel font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                        placeholder={`Team ${idx + 1}`}
                        className="w-full bg-[#10061D] border border-amber-400/50 focus:border-amber-300 focus:outline-none rounded-lg px-2.5 py-1 text-white font-outfit font-bold text-sm sm:text-base transition-all"
                      />
                    </div>
                  </div>

                  {/* Current Score + Delete Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-cinzel font-black text-xs sm:text-sm text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-400/30 hidden sm:inline-block">
                      {team.totalScore} pts
                    </span>

                    {/* Working Delete Button */}
                    {isConfirming ? (
                      <div className="flex items-center gap-1 animate-in fade-in">
                        <button
                          onClick={() => handleDeleteTeamDirect(team.id)}
                          className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                          title="Confirm Delete"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(team.id)}
                        className="p-1.5 sm:p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        title={`Delete ${team.name}`}
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-amber-400/30 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-amber-200/70 font-medium">
            Total Teams: <b className="text-amber-300">{localTeams.length}</b>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-stone-950 font-cinzel font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>DONE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
