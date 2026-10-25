/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Trophy, Clock, Image, Video, Music, Zap } from 'lucide-react';
import { FinalistTeam, StageQuestion } from '../types/quiz';
import { cleanHindiText } from '../utils/text';

interface AudienceViewProps {
  teams: FinalistTeam[];
  currentQuestion: StageQuestion;
  activeRoundName: string;
  activeRoundId: number;
  timerSeconds: number;
  buzzedTeam: FinalistTeam | null;
  showLeaderboardOnScreen?: boolean;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  teams,
  currentQuestion,
  activeRoundName,
  activeRoundId,
  timerSeconds,
  buzzedTeam,
  showLeaderboardOnScreen = false,
}) => {
  return (
    <div className="min-h-screen bg-[#140205] bg-radial from-[#2B050B] via-[#140205] to-[#0A0103] text-stone-100 flex flex-col justify-between p-4 sm:p-8 select-none">
      
      {/* Audience Header */}
      <header className="flex items-center justify-between border-b-2 border-[#D4AF37]/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#590C19] to-[#2B050B] border-2 border-[#D4AF37] flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <Trophy className="w-6 h-6 text-[#FFDF73]" />
          </div>
          <div>
            <h1 className="font-cinzel font-black text-xl sm:text-3xl text-gold-gradient tracking-wide uppercase drop-shadow">
              {activeRoundId === 4 ? 'Grand Finale Round' : activeRoundName}
            </h1>
            <p className="text-xs text-amber-200/80 font-medium">
              Maharaja Agrasen Jayanti Mahotsav
            </p>
          </div>
        </div>

        {/* Timer Ring or Buzzer Badge */}
        {activeRoundId === 4 ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-stone-950 font-cinzel font-black text-sm sm:text-base shadow-md">
            <Trophy className="w-4 h-4 text-stone-950" />
            <span>Grand Finale</span>
          </div>
        ) : activeRoundId === 3 ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#590C19] to-[#3B070F] border-2 border-amber-400">
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-cinzel font-black text-sm sm:text-base text-gold-bright uppercase tracking-wider">
              Buzzer Round
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/60 border-2 border-amber-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-cinzel font-black text-xl sm:text-2xl text-gold-bright min-w-[45px] text-center">
              {timerSeconds}s
            </span>
          </div>
        )}
      </header>

      {/* Main Audience Center */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full space-y-5">
        
        {/* If Round 4, show Grand Finale Screen */}
        {activeRoundId === 4 ? (
          <div className="bg-gradient-to-b from-[#2B050B] to-[#160205] border-4 border-[#D4AF37] rounded-3xl p-8 sm:p-14 shadow-[0_0_60px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#590C19] to-[#2B050B] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFDF73] shadow-[0_0_35px_rgba(212,175,55,0.5)]">
              <Trophy className="w-12 h-12 text-[#FFDF73] animate-pulse" />
            </div>
            <h1 className="font-cinzel font-black text-4xl sm:text-6xl text-gold-gradient uppercase drop-shadow">
              Grand Finale Round
            </h1>
            <p className="text-amber-200/80 text-sm sm:text-base font-outfit max-w-md mx-auto">
              Maharaja Agrasen Jayanti Mahotsav
            </p>
          </div>
        ) : showLeaderboardOnScreen ? (
          /* Leaderboard Screen */
          <div className="bg-gradient-to-b from-[#2E050C] to-[#160205] border-4 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in zoom-in-95">
            <h2 className="font-cinzel font-black text-2xl sm:text-4xl text-gold-gradient mb-6 uppercase">
              🏆 Current Leaderboard 🏆
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[...teams]
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((team, idx) => (
                  <div
                    key={team.id}
                    className="p-3 sm:p-4 rounded-2xl bg-black/50 border-2 border-amber-400/50 flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-xl sm:text-2xl">
                      {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[180px]">
                      {team.name}
                    </h3>
                    <span className="font-cinzel font-black text-lg sm:text-2xl text-[#FFDF73] mt-1">
                      {team.totalScore} Points
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Normal Audience Display: Neutral Question (Bilingual English & Hindi) */
          <div className={`bg-gradient-to-b from-[#2B050B] to-[#160205] border-4 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(212,175,55,0.4)] flex flex-col space-y-5 ${
            activeRoundId === 3 ? 'text-left items-start' : 'text-center items-center'
          }`}>
            
            {/* If buzzer was pressed in Round 3, show who buzzed, otherwise neutral banner */}
            <div className={activeRoundId === 3 ? 'inline-block' : 'inline-block mx-auto'}>
              <div className="px-5 py-1.5 rounded-full bg-[#590C19] border-2 border-[#D4AF37] shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFDF73]" />
                {buzzedTeam ? (
                  <>
                    <span className="font-cinzel font-bold text-xs sm:text-sm text-amber-200 uppercase tracking-widest">
                      Buzzed Team:
                    </span>
                    <span className="font-outfit font-black text-sm sm:text-base text-gold-bright">
                      {buzzedTeam.name}
                    </span>
                  </>
                ) : (
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-amber-200 uppercase tracking-widest">
                    Agrasen Jayanti Family Quiz &bull; Question in Play
                  </span>
                )}
              </div>
            </div>

            {/* Media Placeholder */}
            {currentQuestion.mediaType && currentQuestion.mediaType !== 'none' && (
              <div className="p-4 rounded-2xl bg-black/60 border-2 border-dashed border-amber-400/60 max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
                {currentQuestion.mediaType === 'audio' && <Music className="w-6 h-6 text-amber-300" />}
                {currentQuestion.mediaType === 'video' && <Video className="w-6 h-6 text-amber-300" />}
                {currentQuestion.mediaType === 'image' && <Image className="w-6 h-6 text-amber-300" />}
                <span className="font-bold text-sm text-amber-200">
                  {currentQuestion.mediaPlaceholderText || 'Media Clue'}
                </span>
              </div>
            )}

            {/* Large Stage Question Statement (English + Hindi, Left-aligned for Round 3 Buzzer) */}
            <div className={`max-w-5xl w-full space-y-3 ${activeRoundId === 3 ? 'text-left mr-auto' : 'text-center mx-auto'}`}>
              <h2 className="font-outfit font-black text-3xl sm:text-5xl md:text-6xl text-[#FFF8E7] leading-tight drop-shadow-xl">
                {currentQuestion.question}
              </h2>
              {currentQuestion.questionHindi && (
                <h3 className="font-outfit font-bold text-2xl sm:text-4xl md:text-5xl text-amber-300 leading-snug drop-shadow-md">
                  {cleanHindiText(currentQuestion.questionHindi)}
                </h3>
              )}
            </div>

            {/* MCQ Options (If applicable, with both English and Hindi) */}
            {currentQuestion.options && currentQuestion.options.length > 0 && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl w-full pt-4 ${
                activeRoundId === 3 ? 'mr-auto' : 'mx-auto'
              }`}>
                {currentQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-3xl bg-black/60 border-2 border-amber-400/50 flex items-center gap-4 text-left shadow-lg"
                  >
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#4A0B16] border-2 border-amber-400 text-amber-200 font-cinzel font-black text-xl sm:text-2xl flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-outfit font-black text-xl sm:text-2xl md:text-3xl text-white block leading-tight">
                        {opt}
                      </span>
                      {currentQuestion.optionsHindi?.[i] && (
                        <span className="font-outfit font-bold text-base sm:text-xl text-amber-200 block mt-1 leading-tight">
                          {cleanHindiText(currentQuestion.optionsHindi[i])}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Audience Footer */}
      <footer className="pt-3 border-t border-[#D4AF37]/30 text-center text-xs text-amber-200/60">
        Maharaja Agrasen Jayanti Mahotsav &bull; Grand Finale Celebration
      </footer>
    </div>
  );
};
