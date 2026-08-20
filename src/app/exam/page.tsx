'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import AmbientAudio from '@/components/ambient-audio';
import { useTheme } from '@/lib/theme-context';
import { TOPIK_EXAM_SUITES, TopikExamSuite, ExamQuestion, ExamComment } from '@/lib/exam-data';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Send,
  Lightbulb,
  CheckSquare,
  ChevronLeft
} from 'lucide-react';

export default function ExamPage() {
  const { themeConfig } = useTheme();

  // Navigation View State: 'list' | 'detail' | 'runner'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'runner'>('list');
  const [selectedSuite, setSelectedSuite] = useState<TopikExamSuite>(TOPIK_EXAM_SUITES[0]);

  // List View Filter State
  const [filterLevel, setFilterLevel] = useState<string>('Tất cả');

  // Detail View Config State
  const [detailTab, setDetailTab] = useState<'practice' | 'full' | 'discussion'>('practice');
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    listening: true,
    reading: true
  });
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<string>('default');

  // Comments State
  const [comments, setComments] = useState<ExamComment[]>(selectedSuite.comments || []);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Runner Active Test State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  // Sync comments when suite changes
  useEffect(() => {
    if (selectedSuite) {
      setComments(selectedSuite.comments || []);
    }
  }, [selectedSuite]);

  // Timer effect for runner
  useEffect(() => {
    if (viewState !== 'runner' || isSubmitted || selectedTimeLimit === 'unlimited') return;

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
  }, [viewState, isSubmitted, selectedTimeLimit]);

  // Click card "Chi tiết"
  const handleOpenDetail = (suite: TopikExamSuite) => {
    setSelectedSuite(suite);
    setViewState('detail');
    setDetailTab('practice');
  };

  // Start exam runner
  const handleStartExamRunner = (mode: 'practice' | 'full') => {
    setViewState('runner');
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setIsSubmitted(false);

    let durationMins = selectedSuite.durationMinutes;
    if (selectedTimeLimit !== 'default' && selectedTimeLimit !== 'unlimited') {
      durationMins = parseInt(selectedTimeLimit, 10);
    }
    setTimeLeftSec(durationMins * 60);
  };

  // Select Option in Runner
  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: ExamComment = {
      id: `c_${Date.now()}`,
      author: 'LynKore Learner',
      avatarLetter: 'L',
      date: 'Vừa xong',
      content: newCommentText.trim()
    };

    setComments([newC, ...comments]);
    setNewCommentText('');
  };

  // Calculate score
  const calculateResult = () => {
    let correctCount = 0;
    selectedSuite.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const total = selectedSuite.questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return { correctCount, total, percentage };
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSec.toString().padStart(2, '0')}`;
  };

  const filteredSuites = TOPIK_EXAM_SUITES.filter((suite) => {
    if (filterLevel === 'Tất cả') return true;
    if (filterLevel === 'TOPIK I') return suite.level === 'TOPIK I';
    if (filterLevel === 'TOPIK II') return suite.level === 'TOPIK II';
    return true;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ==================================================================== */}
          {/* 1. LIST VIEW: Filter Tabs & Exam Cards (Matching User Screenshot 1) */}
          {/* ==================================================================== */}
          {viewState === 'list' && (
            <div className="space-y-6">
              {/* Filter Tabs Header Bar */}
              <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#121215] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#222226] shadow-2xs">
                <div className="flex items-center gap-2">
                  {['Tất cả', 'TOPIK I', 'TOPIK II'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterLevel(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filterLevel === tab
                          ? `${themeConfig.primaryBg} text-white shadow-xs`
                          : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hidden sm:block">
                  Hiển thị {filteredSuites.length} bộ đề thi
                </span>
              </div>

              {/* Exam Cards Grid (Matching User Screenshot 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredSuites.map((suite) => (
                  <div
                    key={suite.id}
                    className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Exam Title */}
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {suite.title}
                      </h3>

                      {/* Stats Metadata Row 1 */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {suite.durationMinutes} phút
                        </span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {suite.participantsCount.toLocaleString('vi-VN')}
                        </span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {suite.commentsCount || suite.comments.length}
                        </span>
                      </div>

                      {/* Stats Metadata Row 2 */}
                      <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                        {suite.totalSections} phần thi | {suite.totalQuestions} câu hỏi
                      </p>

                      {/* Tag Badge */}
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200/50 dark:border-blue-900/50">
                          {suite.tag}
                        </span>
                      </div>
                    </div>

                    {/* Chi tiết Button (Matching Screenshot 1) */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleOpenDetail(suite)}
                        className="w-full py-2 px-4 rounded-xl border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all cursor-pointer text-center active:scale-98"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 2. DETAIL VIEW: Exam Practice Configuration (Matching User Screenshot 2) */}
          {/* ==================================================================== */}
          {viewState === 'detail' && selectedSuite && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Back Button */}
              <button
                onClick={() => setViewState('list')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trở lại danh sách đề thi</span>
              </button>

              {/* Main Detail Container Card */}
              <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] rounded-2xl p-6 shadow-2xs space-y-6">
                {/* Header Metadata Section */}
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-bold">
                    {selectedSuite.tag}
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedSuite.title}
                  </h1>

                  <div className="text-xs font-medium text-slate-600 dark:text-zinc-300 space-y-1 pt-1">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 inline shrink-0" />
                      <span>
                        Thời gian làm bài: <strong>{selectedSuite.durationMinutes} phút</strong> |{' '}
                        {selectedSuite.totalSections} phần thi | {selectedSuite.totalQuestions} câu hỏi |{' '}
                        {comments.length} bình luận
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                      <Users className="w-4 h-4 text-slate-400 inline shrink-0" />
                      <span>
                        <strong>{selectedSuite.participantsCount.toLocaleString('vi-VN')}</strong> người đã luyện tập đề thi này
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-rose-500 italic pt-1 font-medium">
                    Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm chuẩn), vui lòng chọn chế độ FULL TEST.
                  </p>
                </div>

                {/* Sub Tabs: Luyện tập | Làm full test | Thảo luận */}
                <div className="flex border-b border-slate-200 dark:border-zinc-800 gap-6 text-xs font-bold">
                  <button
                    onClick={() => setDetailTab('practice')}
                    className={`pb-3 transition-colors cursor-pointer ${
                      detailTab === 'practice'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Luyện tập
                  </button>
                  <button
                    onClick={() => setDetailTab('full')}
                    className={`pb-3 transition-colors cursor-pointer ${
                      detailTab === 'full'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Làm full test
                  </button>
                  <button
                    onClick={() => setDetailTab('discussion')}
                    className={`pb-3 transition-colors cursor-pointer ${
                      detailTab === 'discussion'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Thảo luận ({comments.length})
                  </button>
                </div>

                {/* TAB 1: LUYỆN TẬP SECTIONAL (Matching User Screenshot 2) */}
                {detailTab === 'practice' && (
                  <div className="space-y-6">
                    {/* Pro Tips Alert Box */}
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                        <strong>Pro tips:</strong> Hình thức luyện tập từng phần và chọn mức thời gian phù hợp sẽ giúp bạn tập trung vào giải đúng các câu hỏi thay vì phải chịu áp lực hoàn thành bài thi.
                      </p>
                    </div>

                    {/* Section Selector Checkboxes */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Chọn phần thi bạn muốn làm
                      </h3>

                      {/* 1. Listening Section Checkbox & Badges */}
                      <div className="space-y-2.5 pl-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800 dark:text-zinc-200">
                          <input
                            type="checkbox"
                            checked={selectedSections.listening}
                            onChange={(e) =>
                              setSelectedSections((prev) => ({ ...prev, listening: e.target.checked }))
                            }
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span>Listening (30 câu hỏi)</span>
                        </label>

                        {selectedSuite.listeningTags && (
                          <div className="flex flex-wrap gap-1.5 pl-6">
                            {selectedSuite.listeningTags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700/80"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Reading Section Checkbox & Badges */}
                      <div className="space-y-2.5 pl-1 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800 dark:text-zinc-200">
                          <input
                            type="checkbox"
                            checked={selectedSections.reading}
                            onChange={(e) =>
                              setSelectedSections((prev) => ({ ...prev, reading: e.target.checked }))
                            }
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span>Reading (40 câu hỏi)</span>
                        </label>

                        {selectedSuite.readingTags && (
                          <div className="flex flex-wrap gap-1.5 pl-6">
                            {selectedSuite.readingTags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700/80"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time Limit Selector */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Giới hạn thời gian (Để trống để làm bài không giới hạn)
                      </label>
                      <select
                        value={selectedTimeLimit}
                        onChange={(e) => setSelectedTimeLimit(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#070709] text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      >
                        <option value="default">-- Chọn thời gian --</option>
                        <option value="unlimited">Không giới hạn thời gian</option>
                        <option value="15">15 phút</option>
                        <option value="30">30 phút</option>
                        <option value="45">45 phút</option>
                        <option value="60">60 phút</option>
                        <option value="100">100 phút (Mặc định TOPIK I)</option>
                      </select>
                    </div>

                    {/* Action Button: LUYỆN TẬP */}
                    <div className="pt-3">
                      <button
                        onClick={() => handleStartExamRunner('practice')}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                      >
                        LUYỆN TẬP
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: LÀM FULL TEST */}
                {detailTab === 'full' && (
                  <div className="space-y-6 py-4 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Sẵn Sàng Làm Full Test Mô Phỏng Đề {selectedSuite.title}?
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400">
                        Bài thi gồm {selectedSuite.totalQuestions} câu hỏi làm trong {selectedSuite.durationMinutes} phút với đồng hồ đếm ngược áp lực thực tế.
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartExamRunner('full')}
                      className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer"
                    >
                      BẮT ĐẦU LÀM FULL TEST
                    </button>
                  </div>
                )}

                {/* TAB 3: THẢO LUẬN / BÌNH LUẬN (Matching User Screenshot 2) */}
                {detailTab === 'discussion' && (
                  <div className="space-y-6 pt-2">
                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="space-y-3">
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Viết bình luận hoặc thắc mắc của bạn về đề thi này..."
                        rows={3}
                        className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-[#070709] text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!newCommentText.trim()}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi Bình Luận</span>
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4 pt-2">
                      {comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-[#070709] border border-slate-200/80 dark:border-zinc-800/80 space-y-2"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-extrabold text-xs flex items-center justify-center shrink-0">
                              {c.avatarLetter}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                {c.author}
                              </span>
                              <span className="text-[10px] text-slate-400 block">{c.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed pl-9 font-medium">
                            {c.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 3. RUNNER VIEW: Interactive Exam Runner */}
          {/* ==================================================================== */}
          {viewState === 'runner' && selectedSuite && (
            <div className="space-y-5 max-w-5xl mx-auto">
              {/* Exam Runner Control Top Bar */}
              <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewState('detail')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    ← Thoát làm bài
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
                  {selectedTimeLimit !== 'unlimited' && !isSubmitted && (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <Clock className="w-4 h-4 animate-pulse text-amber-500" />
                      <span>{formatTime(timeLeftSec)}</span>
                    </div>
                  )}

                  {!isSubmitted ? (
                    <button
                      onClick={() => setIsSubmitted(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Nộp Bài Thi</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartExamRunner('practice')}
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

              {/* Question Content & Navigation Palette */}
              {selectedSuite.questions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                  <div className="lg:col-span-3 space-y-5">
                    {(() => {
                      const q = selectedSuite.questions[currentQuestionIdx];
                      const selectedOpt = userAnswers[q.id];
                      const isCorrect = selectedOpt === q.correctAnswer;

                      return (
                        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-[#222226] p-6 rounded-2xl shadow-2xs space-y-5">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold">
                              {q.section}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              Câu {currentQuestionIdx + 1}
                            </span>
                          </div>

                          {q.passage && (
                            <div className="bg-slate-50 dark:bg-[#070709] p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 text-sm leading-relaxed text-slate-800 dark:text-zinc-200 font-medium whitespace-pre-line">
                              {q.passage}
                            </div>
                          )}

                          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {q.questionText}
                          </h3>

                          <div className="space-y-2.5 pt-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              let btnStyle =
                                'bg-slate-50 dark:bg-[#070709] border-slate-200 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800';

                              if (isSelected) {
                                btnStyle = `${themeConfig.badgeBg} ${themeConfig.primaryText} border-blue-500 font-bold shadow-2xs`;
                              }

                              if (isSubmitted) {
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

                          {isSubmitted && (
                            <div className="mt-5 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
                              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Giải Thích Chi Tiết & Từ Vựng
                              </span>
                              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                                {q.explanation}
                              </p>
                              {q.vocabulary && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {q.vocabulary.map((v, vIdx) => (
                                    <span
                                      key={vIdx}
                                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-xs font-semibold border border-blue-200 dark:border-zinc-700"
                                    >
                                      <strong className="text-blue-600 dark:text-blue-400">{v.kr}</strong>: {v.vi}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                            <button
                              disabled={currentQuestionIdx === 0}
                              onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold disabled:opacity-40 cursor-pointer"
                            >
                              ← Câu trước
                            </button>

                            <button
                              disabled={currentQuestionIdx === selectedSuite.questions.length - 1}
                              onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                              className={`px-4 py-2 rounded-xl ${themeConfig.primaryBg} text-white text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1`}
                            >
                              <span>Câu tiếp</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Question Palette */}
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
