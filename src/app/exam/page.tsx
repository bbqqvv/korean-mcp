'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import AmbientAudio from '@/components/ambient-audio';
import { useTheme } from '@/lib/theme-context';
import { TOPIK_EXAM_SUITES, TopikExamSuite, ExamQuestion } from '@/lib/exam-data';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  Volume2,
  FileText,
  AlertCircle,
  BarChart3,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExamPage() {
  const { themeConfig } = useTheme();

  // Test Selection & Filtering
  const [selectedSuite, setSelectedSuite] = useState<TopikExamSuite | null>(null);
  const [filterType, setFilterType] = useState<string>('Tất cả');
  const [examMode, setExamMode] = useState<'practice' | 'timed'>('timed');

  // Active Test State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (!selectedSuite || isSubmitted || examMode !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSuite, isSubmitted, examMode]);

  // Start Test
  const handleStartExam = (suite: TopikExamSuite) => {
    setSelectedSuite(suite);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
    setTimeLeftSec(suite.durationMinutes * 60);
  };

  // Answer selection
  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted && examMode === 'timed') return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Submit test
  const handleSubmitExam = () => {
    setIsSubmitted(true);
  };

  // Calculate score
  const calculateResult = () => {
    if (!selectedSuite) return { correctCount: 0, total: 0, percentage: 0 };
    let correctCount = 0;
    selectedSuite.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const total = selectedSuite.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    return { correctCount, total, percentage };
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSec.toString().padStart(2, '0')}`;
  };

  const filteredSuites = TOPIK_EXAM_SUITES.filter((suite) => {
    if (filterType === 'Tất cả') return true;
    if (filterType === 'TOPIK I') return suite.level.includes('TOPIK I');
    if (filterType === 'TOPIK II') return suite.level.includes('TOPIK II');
    if (filterType === 'Nghe') return suite.type === 'Nghe';
    if (filterType === 'Đọc') return suite.type === 'Đọc';
    return true;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {!selectedSuite && (
            <div className="space-y-6">
              {/* Filtering & Mode Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#121215] p-4 rounded-2xl border border-slate-200/80 dark:border-[#222226] shadow-xs">
                <div className="flex flex-wrap gap-2">
                  {['Tất cả', 'TOPIK I', 'TOPIK II', 'Nghe', 'Đọc'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterType(tab)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        filterType === tab
                          ? `${themeConfig.primaryBg} text-white shadow-xs`
                          : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#070709] p-1 rounded-xl border border-slate-200 dark:border-zinc-800/80 text-xs font-semibold">
                  <button
                    onClick={() => setExamMode('timed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      examMode === 'timed'
                        ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Thi Thử Bấm Giờ</span>
                  </button>
                  <button
                    onClick={() => setExamMode('practice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      examMode === 'practice'
                        ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Luyện Tập Từng Câu</span>
                  </button>
                </div>
              </div>

              {/* Exam Suites Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSuites.map((suite) => (
                  <div
                    key={suite.id}
                    className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] rounded-2xl p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all shadow-2xs flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/60 text-[11px] font-bold">
                          {suite.level}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {suite.durationMinutes} phút
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {suite.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {suite.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          {suite.totalQuestions} câu hỏi
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                          {suite.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 mt-4">
                      <button
                        onClick={() => handleStartExam(suite)}
                        className={`w-full py-2.5 px-4 rounded-xl ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Bắt Đầu Làm Đề</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Exam Interface */}
          {selectedSuite && (
            <div className="space-y-5 max-w-5xl mx-auto">
              {/* Exam Control Top Bar */}
              <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedSuite(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    ← Trở lại danh sách đề
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedSuite.title}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      Câu {currentQuestionIdx + 1} / {selectedSuite.questions.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Countdown Timer Badge */}
                  {examMode === 'timed' && !isSubmitted && (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <Clock className="w-4 h-4 animate-pulse text-amber-500" />
                      <span>{formatTime(timeLeftSec)}</span>
                    </div>
                  )}

                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitExam}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Nộp Bài Thi</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartExam(selectedSuite)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Làm Lại Đề Này</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Exam Submitted Score Card */}
              {isSubmitted && (
                <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg border border-emerald-400/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>Kết Quả Bài Thi TOPIK</span>
                    </div>
                    <h3 className="text-2xl font-black">
                      Bạn Đạt: {calculateResult().correctCount} / {calculateResult().total} Câu Đúng ({calculateResult().percentage}%)
                    </h3>
                    <p className="text-xs text-emerald-100 font-medium">
                      {calculateResult().percentage >= 80
                        ? '🎉 Xuất sắc! Bạn đã đáp ứng đủ điều kiện đạt chuẩn cấp độ TOPIK mục tiêu!'
                        : '💪 Cố gắng lên! Hãy xem giải thích chi tiết phía dưới để ôn luyện các dạng câu sai nhé.'}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center border border-white/20">
                    <span className="text-xs font-bold block text-emerald-200">ĐÁNH GIÁ</span>
                    <span className="text-lg font-black block">
                      {calculateResult().percentage >= 80 ? 'ĐẠT TOPIK' : 'CẦN ÔN THÊM'}
                    </span>
                  </div>
                </div>
              )}

              {/* Main Question Card Layout */}
              {selectedSuite.questions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                  {/* Question Content (Col-span 3) */}
                  <div className="lg:col-span-3 space-y-5">
                    {(() => {
                      const q = selectedSuite.questions[currentQuestionIdx];
                      const selectedOpt = userAnswers[q.id];
                      const isCorrect = selectedOpt === q.correctAnswer;

                      return (
                        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] p-6 rounded-2xl shadow-2xs space-y-5">
                          {/* Question Section Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold">
                              {q.section}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              Câu {currentQuestionIdx + 1}
                            </span>
                          </div>

                          {/* Reading Passage if any */}
                          {q.passage && (
                            <div className="bg-slate-50 dark:bg-[#070709] p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 text-sm leading-relaxed text-slate-800 dark:text-zinc-200 font-medium whitespace-pre-line">
                              {q.passage}
                            </div>
                          )}

                          {/* Question Text */}
                          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {q.questionText}
                          </h3>

                          {/* Options */}
                          <div className="space-y-2.5 pt-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              let btnStyle =
                                'bg-slate-50 dark:bg-[#070709] border-slate-200 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800';

                              if (isSelected) {
                                btnStyle = `${themeConfig.badgeBg} ${themeConfig.primaryText} border-blue-500 font-bold shadow-2xs`;
                              }

                              if (isSubmitted || (examMode === 'practice' && isSelected)) {
                                if (optIdx === q.correctAnswer) {
                                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 font-bold text-xs">
                                      {optIdx + 1}
                                    </span>
                                    <span>{opt}</span>
                                  </div>

                                  {isSubmitted && optIdx === q.correctAnswer && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                  )}
                                  {isSubmitted && isSelected && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Card (In Practice Mode or Submitted) */}
                          {(isSubmitted || examMode === 'practice') && (
                            <div className="mt-5 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  Giải Thích Chi Tiết & Từ Vựng
                                </span>
                              </div>

                              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                                {q.explanation}
                              </p>

                              {/* Vocabulary Badges */}
                              {q.vocabulary && q.vocabulary.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block mb-1.5 uppercase tracking-wider">
                                    Từ Vựng Cần Ghi Nhớ:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {q.vocabulary.map((vocab, vIdx) => (
                                      <span
                                        key={vIdx}
                                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                                      >
                                        <strong className="text-blue-600 dark:text-blue-400">{vocab.kr}</strong>: {vocab.vi}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Question Navigation Controls */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                            <button
                              disabled={currentQuestionIdx === 0}
                              onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            >
                              ← Câu trước
                            </button>

                            <button
                              disabled={currentQuestionIdx === selectedSuite.questions.length - 1}
                              onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                              className={`px-4 py-2 rounded-xl ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-1`}
                            >
                              <span>Câu tiếp</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Question Palette Sidebar (Col-span 1) */}
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] p-5 rounded-2xl shadow-2xs space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Danh Sách Câu Hỏi ({selectedSuite.questions.length})
                      </h4>

                      <div className="grid grid-cols-5 gap-2">
                        {selectedSuite.questions.map((q, idx) => {
                          const isAnswered = userAnswers[q.id] !== undefined;
                          const isCurrent = currentQuestionIdx === idx;
                          let cellStyle = 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300';

                          if (isAnswered) {
                            cellStyle = 'bg-blue-600 text-white font-bold';
                          }

                          if (isCurrent) {
                            cellStyle += ' ring-2 ring-blue-500 scale-105 font-black';
                          }

                          return (
                            <button
                              key={q.id}
                              onClick={() => setCurrentQuestionIdx(idx)}
                              className={`w-9 h-9 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${cellStyle}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-600" />
                          <span>Đã làm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-zinc-800" />
                          <span>Chưa làm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AmbientAudio />
    </div>
  );
}
