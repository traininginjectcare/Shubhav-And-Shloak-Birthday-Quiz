/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Download, 
  Upload, 
  Eye, 
  Sparkles,
  FileText,
  Music,
  Image as ImageIcon,
  Video,
  Play,
  Volume2,
  ListChecks,
  HelpCircle,
  FolderOpen,
  RotateCcw
} from 'lucide-react';
import { StageQuestion, MediaType, RoundDifficulty } from '../types/quiz';
import { INITIAL_PLACEHOLDER_QUESTIONS } from '../data/placeholderQuestions';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: StageQuestion[];
  onUpdateQuestions: (newQuestions: StageQuestion[]) => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
}) => {
  const [filterRound, setFilterRound] = useState<number>(1);
  const [editingQuestion, setEditingQuestion] = useState<StageQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [previewQuestion, setPreviewQuestion] = useState<StageQuestion | null>(null);

  // Form State for editing
  const [isMcqFormat, setIsMcqFormat] = useState<boolean>(false);
  const [optionsList, setOptionsList] = useState<string[]>(['', '', '', '']);
  const [optionsHindiList, setOptionsHindiList] = useState<string[]>(['', '', '', '']);

  if (!isOpen) return null;

  const filteredQuestions = questions.filter(
    (q) => q.roundNumber === filterRound
  );

  const handleOpenEdit = (q: StageQuestion) => {
    setEditingQuestion({ ...q });
    setIsAddingNew(false);
    if (q.options && q.options.length > 0) {
      setIsMcqFormat(true);
      const opts = [...q.options];
      while (opts.length < 4) opts.push('');
      setOptionsList(opts.slice(0, 4));

      const optsH = q.optionsHindi ? [...q.optionsHindi] : [];
      while (optsH.length < 4) optsH.push('');
      setOptionsHindiList(optsH.slice(0, 4));
    } else {
      setIsMcqFormat(false);
      setOptionsList(['', '', '', '']);
      setOptionsHindiList(['', '', '', '']);
    }
  };

  const handleStartNewQuestion = () => {
    const categoryDefault = 
      filterRound === 1 
        ? 'Bollywood' 
        : filterRound === 2 
        ? 'Mythology' 
        : filterRound === 3 
        ? 'Sports & Current Affairs' 
        : 'Finale';

    const newQ: StageQuestion = {
      id: `q-${Date.now()}`,
      roundNumber: filterRound as 1 | 2 | 3 | 4 | 5,
      category: categoryDefault,
      difficulty: 'medium',
      question: '',
      questionHindi: '',
      correctAnswer: '',
      correctAnswerHindi: '',
      isUsed: false,
      mediaType: filterRound === 1 ? 'audio' : 'none',
      mediaPlaceholderText: filterRound === 1 ? '🎵 Bollywood Audio Clue' : undefined,
    };

    setEditingQuestion(newQ);
    setIsAddingNew(true);
    setIsMcqFormat(filterRound !== 2); // Default to direct for Round 2 Mythology
    setOptionsList(['', '', '', '']);
    setOptionsHindiList(['', '', '', '']);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;
    if (!editingQuestion.question.trim()) {
      alert('Please enter a question text in English.');
      return;
    }

    const qToSave: StageQuestion = {
      ...editingQuestion,
      question: editingQuestion.question.trim(),
      questionHindi: editingQuestion.questionHindi?.trim() || undefined,
      correctAnswer: editingQuestion.correctAnswer.trim(),
      correctAnswerHindi: editingQuestion.correctAnswerHindi?.trim() || undefined,
      options: isMcqFormat
        ? optionsList.map((o) => o.trim()).filter((o) => o.length > 0)
        : undefined,
      optionsHindi: isMcqFormat
        ? optionsHindiList.map((o) => o.trim()).slice(0, 4)
        : undefined,
    };

    const exists = questions.some((item) => item.id === qToSave.id);
    let updated: StageQuestion[];
    if (exists) {
      updated = questions.map((item) => (item.id === qToSave.id ? qToSave : item));
    } else {
      updated = [...questions, qToSave];
    }

    onUpdateQuestions(updated);
    setEditingQuestion(null);
    setIsAddingNew(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updated = questions.filter((item) => item.id !== id);
      onUpdateQuestions(updated);
    }
  };

  const handleToggleUsed = (id: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, isUsed: !q.isUsed } : q
    );
    onUpdateQuestions(updated);
  };

  const handleResetToOfficialBank = () => {
    if (window.confirm('Reset all questions to the official Agrasen Jayanti bilingual question bank (including all 17 Mythology questions and Round 3 Sports questions)? Any unsaved custom questions will be replaced.')) {
      onUpdateQuestions(INITIAL_PLACEHOLDER_QUESTIONS);
      localStorage.setItem('agrasen_stage_questions_v5', JSON.stringify(INITIAL_PLACEHOLDER_QUESTIONS));
      localStorage.setItem('agrasen_stage_questions', JSON.stringify(INITIAL_PLACEHOLDER_QUESTIONS));
      alert('Question bank successfully reset to official bilingual questions!');
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('All questions copied to clipboard as JSON!');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        onUpdateQuestions(parsed);
        setShowJsonModal(false);
        setJsonInput('');
        alert(`Successfully imported ${parsed.length} questions!`);
      } else {
        alert('Invalid format. JSON must be an array of StageQuestion objects.');
      }
    } catch {
      alert('Could not parse JSON. Please check syntax.');
    }
  };

  const ROUND_NAMES: { [key: number]: string } = {
    1: 'Round 1: Bollywood',
    2: 'Round 2: Mythology',
    3: 'Round 3: Sports & Current Affairs',
    4: 'Round 4: Finale',
    5: 'Tie-Breaker',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1C0933] via-[#120522] to-[#0A0214] border-2 border-amber-400/70 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] p-4 sm:p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/30 mb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-amber-400 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg sm:text-2xl text-gold-gradient">
                Question Bank Manager
              </h2>
              <p className="text-xs text-amber-200/70">
                {questions.length} Total Questions &bull; Bilingual English &amp; Hindi &bull; Direct &amp; MCQs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToOfficialBank}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-400/50 text-amber-200 text-xs font-semibold flex items-center gap-1.5"
              title="Reset questions to official set"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Official</span>
            </button>

            <button
              onClick={() => setShowJsonModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5"
              title="Import or Export Question JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleStartNewQuestion}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Round Filter Tabs */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
          {[
            { id: 1, name: 'Round 1: Bollywood' },
            { id: 2, name: 'Round 2: Mythology (Ramayana & Mahabharata)' },
            { id: 3, name: 'Round 3: Sports & Current Affairs' },
            { id: 4, name: 'Round 4: Grand Finale (Mixed Easy/Hard)' },
            { id: 5, name: 'Tie-Breaker' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setFilterRound(r.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold shrink-0 transition-colors ${
                filterRound === r.id
                  ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                  : 'bg-black/40 border border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Questions Table / List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No questions found for this round. Click "Add Question" above or "Reset to Official".
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const hasOptions = q.options && q.options.length > 0;

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                    q.isUsed
                      ? 'bg-black/20 border-stone-800 text-stone-400'
                      : 'bg-black/40 border-amber-400/30 hover:border-amber-400/60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-stone-900 border border-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold bg-[#4A0B16] text-[#FFDF73] px-2 py-0.5 rounded-md border border-amber-400/30">
                          {q.category}
                        </span>

                        {hasOptions ? (
                          <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-600/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ListChecks className="w-3 h-3" />
                            <span>MCQ (4 Options)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            <span>Direct Question</span>
                          </span>
                        )}

                        {q.mediaType && q.mediaType !== 'none' && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            {q.mediaType === 'audio' && <Music className="w-3 h-3" />}
                            {q.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                            {q.mediaType === 'video' && <Video className="w-3 h-3" />}
                            <span className="capitalize">{q.mediaType}</span>
                          </span>
                        )}

                        {q.isUsed && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            [USED]
                          </span>
                        )}
                      </div>

                      {/* Question English */}
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {q.question}
                      </h4>
                      {/* Question Hindi */}
                      {q.questionHindi && (
                        <p className="text-[11px] text-amber-300 truncate">
                          {q.questionHindi}
                        </p>
                      )}
                      {/* Answer */}
                      <p className="text-[11px] text-emerald-300 truncate">
                        <b>Answer:</b> {q.correctAnswer} {q.correctAnswerHindi ? `| ${q.correctAnswerHindi}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 text-xs"
                      title="Preview Question"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-800 text-amber-300 text-xs border border-amber-600/40"
                      title="Edit Question"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleUsed(q.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                        q.isUsed
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-stone-900 text-stone-400 border-stone-700'
                      }`}
                      title="Toggle Used status"
                    >
                      {q.isUsed ? 'Used' : 'Mark Used'}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs border border-rose-700/50"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-amber-200/70">
          <span>
            Tip: All 17 official Mythology questions and Round 3 Sports MCQs are fully loaded with English & Hindi!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold"
          >
            Close
          </button>
        </div>

        {/* Add / Edit Question Modal */}
        {editingQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
            <div className="bg-gradient-to-b from-[#2E050C] to-[#160205] border-2 border-amber-400 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-5 sm:p-6 text-white shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-amber-400/30">
                <h3 className="font-cinzel font-bold text-lg text-amber-200">
                  {isAddingNew ? 'Add New Question' : 'Edit Question'}
                </h3>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Round & Category & Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-amber-200/90 block font-semibold mb-1">
                      Round:
                    </label>
                    <select
                      value={editingQuestion.roundNumber}
                      onChange={(e) => {
                        const rNum = parseInt(e.target.value, 10) as 1 | 2 | 3 | 4 | 5;
                        setEditingQuestion({
                          ...editingQuestion,
                          roundNumber: rNum,
                          category: 
                            rNum === 1 ? 'Bollywood' : rNum === 2 ? 'Mythology' : rNum === 3 ? 'Sports' : 'Finale'
                        });
                        if (rNum === 2) setIsMcqFormat(false);
                      }}
                      className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2 text-white"
                    >
                      <option value={1}>Round 1: Bollywood</option>
                      <option value={2}>Round 2: Mythology (Direct)</option>
                      <option value={3}>Round 3: Sports & Current Affairs</option>
                      <option value={4}>Round 4: Finale</option>
                      <option value={5}>Tie-Breaker</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-amber-200/90 block font-semibold mb-1">
                      Category:
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.category}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, category: e.target.value })
                      }
                      placeholder="e.g. Mahabharata, Ramayana, Cricket"
                      className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-amber-200/90 block font-semibold mb-1">
                      Difficulty:
                    </label>
                    <select
                      value={editingQuestion.difficulty || 'medium'}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          difficulty: e.target.value as RoundDifficulty,
                        })
                      }
                      className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2 text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="safe">Safe (R4)</option>
                      <option value="risk">Risk (R4)</option>
                    </select>
                  </div>
                </div>

                {/* Question Format Selector: Direct Question vs MCQ */}
                <div className="p-3 rounded-2xl bg-black/50 border border-amber-400/30 space-y-2">
                  <label className="text-amber-200 font-cinzel font-bold text-xs uppercase tracking-wider block">
                    Question Format:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMcqFormat(false)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        !isMcqFormat
                          ? 'bg-amber-400 text-stone-950 font-black border-white shadow'
                          : 'bg-black/40 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Direct / Open Question (No Options)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMcqFormat(true)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        isMcqFormat
                          ? 'bg-amber-400 text-stone-950 font-black border-white shadow'
                          : 'bg-black/40 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      <ListChecks className="w-4 h-4" />
                      <span>Multiple Choice (MCQ with Options)</span>
                    </button>
                  </div>
                </div>

                {/* Question Statement (English) */}
                <div>
                  <label className="text-amber-200/90 block font-semibold mb-1">
                    Question Text (English):
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, question: e.target.value })
                    }
                    placeholder="Enter question in English..."
                    className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-300 text-xs"
                  />
                </div>

                {/* Question Statement (Hindi / Hinglish) */}
                <div>
                  <label className="text-amber-300 block font-semibold mb-1">
                    Question Text (Hindi / Hinglish):
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.questionHindi || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, questionHindi: e.target.value })
                    }
                    placeholder="प्रश्न हिंदी या हिंग्लिश में दर्ज करें..."
                    className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2.5 text-amber-200 focus:outline-none focus:border-amber-300 text-xs"
                  />
                </div>

                {/* MCQ Options (Visible when MCQ is enabled) */}
                {isMcqFormat && (
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-400/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel font-bold text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <ListChecks className="w-4 h-4 text-amber-400" />
                        <span>MCQ Options (English & Hindi):</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((letter, idx) => {
                        const isThisCorrect =
                          Boolean(optionsList[idx]) &&
                          editingQuestion.correctAnswer.trim().toLowerCase() ===
                            optionsList[idx].trim().toLowerCase();

                        return (
                          <div key={letter} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
                            <span className="w-7 h-7 rounded-lg bg-[#4A0B16] border border-amber-400/40 flex items-center justify-center font-cinzel font-bold text-xs text-amber-200 shrink-0">
                              {letter}
                            </span>
                            
                            <input
                              type="text"
                              value={optionsList[idx] || ''}
                              onChange={(e) => {
                                const newOpts = [...optionsList];
                                newOpts[idx] = e.target.value;
                                setOptionsList(newOpts);
                              }}
                              placeholder={`Option ${letter} (English)`}
                              className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-white w-full"
                            />

                            <input
                              type="text"
                              value={optionsHindiList[idx] || ''}
                              onChange={(e) => {
                                const newOptsH = [...optionsHindiList];
                                newOptsH[idx] = e.target.value;
                                setOptionsHindiList(newOptsH);
                              }}
                              placeholder={`Option ${letter} (Hindi)`}
                              className="flex-1 bg-stone-900 border border-amber-400/30 rounded-lg px-2.5 py-1 text-xs text-amber-200 w-full"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                if (optionsList[idx]) {
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    correctAnswer: optionsList[idx],
                                    correctAnswerHindi: optionsHindiList[idx] || undefined,
                                  });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${
                                isThisCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-300'
                                  : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-amber-400'
                              }`}
                            >
                              {isThisCorrect ? 'Correct ✓' : 'Set Correct'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Correct Answer Fields (English & Hindi) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-amber-200/90 block font-semibold mb-1">
                      Correct Answer (English):
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.correctAnswer}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                      }
                      placeholder="e.g. Gandiva / Ding Liren"
                      className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2 text-white font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-amber-300 block font-semibold mb-1">
                      Correct Answer (Hindi):
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.correctAnswerHindi || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, correctAnswerHindi: e.target.value })
                      }
                      placeholder="उदा. गांडीव / डिंग लिरेन"
                      className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2 text-amber-200 font-semibold text-xs"
                    />
                  </div>
                </div>

                {/* Media Attachment Section */}
                <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-purple-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-purple-400" />
                      <span>Media Attachment (Optional):</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(['none', 'audio', 'image', 'video'] as MediaType[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, mediaType: m })}
                        className={`py-1.5 rounded-xl border text-xs capitalize font-bold transition-all ${
                          (editingQuestion.mediaType || 'none') === m
                            ? 'bg-purple-600 text-white border-white shadow'
                            : 'bg-black/40 text-stone-300 border-stone-800'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {editingQuestion.mediaType && editingQuestion.mediaType !== 'none' && (
                    <input
                      type="text"
                      value={editingQuestion.mediaUrl || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, mediaUrl: e.target.value })
                      }
                      placeholder={`Enter ${editingQuestion.mediaType} direct URL...`}
                      className="w-full bg-stone-900 border border-purple-400/40 rounded-xl p-2 text-xs text-white"
                    />
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <label className="text-amber-200/90 block font-semibold mb-1">
                    Explanation / Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.explanation || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                    }
                    placeholder="Context or history to share after answer reveal..."
                    className="w-full bg-stone-900 border border-amber-400/30 rounded-xl p-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-400/30">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-cinzel font-black text-xs shadow-lg active:scale-95 transition-transform"
                >
                  Save Question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JSON Import / Export Drawer */}
        {showJsonModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#2E050C] border-2 border-amber-400 rounded-3xl max-w-xl w-full p-5 sm:p-6 text-white shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-400/30">
                <h3 className="font-cinzel font-bold text-amber-200">
                  Import / Export Question Bank JSON
                </h3>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-300">
                You can copy the entire questions structure or paste your final question bank JSON here to update all questions in one click.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy Questions JSON</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-amber-200 block mb-1">
                  Or Paste JSON Array Below to Import:
                </label>
                <textarea
                  rows={6}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[ { "id": "r1-q1", "roundNumber": 1, "category": "Bollywood", "question": "...", "correctAnswer": "..." } ]'
                  className="w-full bg-stone-900 border border-amber-400/40 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-400/20">
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={handleImportJson}
                  disabled={!jsonInput.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow"
                >
                  Import Questions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Single Question */}
        {previewQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#2E050C] border-2 border-amber-400 rounded-3xl max-w-lg w-full p-5 sm:p-6 text-white shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-400/30">
                <h3 className="font-cinzel font-bold text-amber-200">
                  Question Preview
                </h3>
                <button
                  onClick={() => setPreviewQuestion(null)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#4A0B16] text-[#FFDF73] px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-amber-400/40">
                    {ROUND_NAMES[previewQuestion.roundNumber]} &bull; {previewQuestion.category}
                  </span>
                  <span className="text-[10px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded">
                    {previewQuestion.options && previewQuestion.options.length > 0 ? 'MCQ' : 'Direct Question'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">
                    {previewQuestion.question}
                  </h4>
                  {previewQuestion.questionHindi && (
                    <p className="text-sm font-semibold text-amber-300">
                      {previewQuestion.questionHindi}
                    </p>
                  )}
                </div>

                {previewQuestion.options && previewQuestion.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {previewQuestion.options.map((opt, i) => (
                      <div key={i} className="p-2 bg-black/50 rounded-xl border border-amber-400/30 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#4A0B16] flex items-center justify-center font-cinzel font-bold text-xs text-amber-300">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-stone-200 block">{opt}</span>
                          {previewQuestion.optionsHindi?.[i] && (
                            <span className="text-[10px] text-amber-200/80 block">{previewQuestion.optionsHindi[i]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex flex-wrap items-center gap-2">
                  <b>Correct Answer:</b>
                  <span>{previewQuestion.correctAnswer}</span>
                  {previewQuestion.correctAnswerHindi && (
                    <span className="text-amber-300 font-bold">| {previewQuestion.correctAnswerHindi}</span>
                  )}
                </div>

                {previewQuestion.explanation && (
                  <p className="text-[11px] text-stone-300 italic">
                    <b>Note:</b> {previewQuestion.explanation}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-amber-400/20">
                <button
                  onClick={() => setPreviewQuestion(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
