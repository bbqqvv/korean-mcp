'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  HelpCircle,
  X,
  Search,
  Image as ImageIcon,
  ArrowRight,
  History,
  Maximize2,
  ExternalLink,
  Keyboard,
  RefreshCw,
  MessageSquare,
  Bug,
  ArrowRightCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
};

const BANNERS = ['/banner.png', '/banner-1.png'];

export function HelpWidget() {
  const pathname = usePathname();
  const { themeConfig } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! 👋 Mình là LynKore AI Tutor – trợ lý học tiếng Hàn & luyện thi TOPIK thông minh. Bạn cần hỗ trợ bài học nào hôm nay?'
    }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Banner slideshow effect
  useEffect(() => {
    if (!showBanner || !isOpen) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showBanner, isOpen]);

  useEffect(() => {
    if (isChatting) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatting]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowShortcuts(false);
        setShowFeedback(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetChecklist = () => {
    showToast('Đã hiển thị lại lộ trình học tiếng Hàn sơ cấp!');
    setIsOpen(false);
  };

  const handleReportBug = () => {
    showToast('Đã gửi báo cáo thắc mắc câu hỏi thành công!');
    setIsOpen(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Cảm ơn bạn đã gửi đóng góp ý kiến bài học cho LynKore!');
    setFeedbackText('');
    setShowFeedback(false);
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!isChatting) setIsChatting(true);

    const question = searchQuery.trim();
    setSearchQuery('');

    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: question },
      { id: 'typing', role: 'assistant', content: '', isTyping: true }
    ]);

    setTimeout(() => {
      const q = question.toLowerCase();
      let answer = 'LynKore AI Tutor đã ghi nhận câu hỏi của bạn. Hãy thử tham khảo các chuyên mục luyện tập tương ứng nhé!';
      if (q.includes('topik') || q.includes('đề') || q.includes('thi') || q.includes('luyện')) {
        answer = 'Bạn hãy truy cập trang "Luyện Đề TOPIK" ở menu bên trái để chọn đề 35th, 36th, 37th, 41st TOPIK I hoặc 83rd TOPIK II có bấm giờ thi thật và giải thích chi tiết!';
      } else if (q.includes('từ vựng') || q.includes('flashcard') || q.includes('học') || q.includes('thẻ')) {
        answer = 'Mục "Bộ Thẻ Bài Học" áp dụng thuật toán Lặp lại ngắt quãng (Spaced Repetition) tự động giúp bạn nhớ từ vựng tiếng Hàn lâu gấp 3 lần!';
      } else if (q.includes('phim') || q.includes('youtube') || q.includes('nghe') || q.includes('phát âm')) {
        answer = 'Hãy truy cập "AI Tutor Tiếng Hàn" hoặc "Luyện Phát Âm" để nhận phản hồi chỉnh khẩu hình & ngữ điệu giọng chuẩn Seoul!';
      } else if (q.includes('phím tắt') || q.includes('shortcut')) {
        answer = 'Mở danh sách phím tắt bên dưới để lật thẻ Flashcard bằng phím Space và Mũi tên siêu nhanh nhé!';
        setShowShortcuts(true);
      }

      setMessages((prev) => {
        const newMsgs = prev.filter((m) => m.id !== 'typing');
        return [...newMsgs, { id: (Date.now() + 1).toString(), role: 'assistant', content: answer }];
      });
    }, 1200);
  };

  const handleQuestionClick = (question: string) => {
    if (!isChatting) setIsChatting(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: question },
      { id: 'typing', role: 'assistant', content: '', isTyping: true }
    ]);

    setTimeout(() => {
      let answer = 'Bạn có thể xem chi tiết trong bộ tài liệu hướng dẫn học tiếng Hàn của LynKore.';
      if (question.includes('TOPIK')) {
        answer = 'Bạn nên chọn chế độ "Luyện tập từng phần" trước để rèn phản xạ, sau đó làm "Full Test Bấm Giờ" để quen với áp lực phòng thi thật!';
      } else if (question.includes('Flashcard') || question.includes('Spaced Repetition')) {
        answer = 'Mỗi ngày ôn 15-20 từ vựng. Hệ thống tự ghi nhận từ bạn làm sai để nhắc lại đúng thời điểm chu kỳ trí nhớ!';
      } else if (question.includes('phát âm') || question.includes('AI Tutor')) {
        answer = 'Mở trang "AI Tutor Tiếng Hàn" và nói trực tiếp qua micro. AI sẽ phân tích độ chính xác nguyên âm/phụ âm của bạn!';
      }

      setMessages((prev) => {
        const newMsgs = prev.filter((m) => m.id !== 'typing');
        return [...newMsgs, { id: (Date.now() + 1).toString(), role: 'assistant', content: answer }];
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none" ref={containerRef}>
      {/* Toast Overlay */}
      {toastMsg && (
        <div className="absolute bottom-14 right-0 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowShortcuts(false);
          setShowFeedback(false);
        }}
        className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-[#121215] ${
          isOpen
            ? 'border-blue-500 text-blue-600 dark:text-blue-400 shadow-blue-500/20'
            : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500'
        } ${isOpen && isChatting ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
        title="Trợ giúp & Hỏi đáp LynKore AI Tutor"
      >
        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-300 rotate-90" strokeWidth={2} />
        ) : (
          <HelpCircle className="h-5 w-5 transition-transform duration-300" strokeWidth={2} />
        )}
      </button>

      {/* Popover Card Widget */}
      {isOpen && (
        <div
          className={`absolute right-0 w-[calc(100vw-32px)] sm:w-[380px] bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-[#222226] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 z-50 ${
            isChatting ? 'bottom-0 max-h-[calc(100vh-60px)]' : 'bottom-14 max-h-[calc(100vh-100px)]'
          }`}
        >
          {/* Header Block with Real Banner Image Slideshow (from OtterSync) */}
          {showBanner ? (
            <div className="w-full aspect-[21/9] relative overflow-hidden shrink-0 group">
              <div
                className="absolute inset-0 flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
              >
                {BANNERS.map((src, i) => (
                  <div
                    key={i}
                    className="w-full h-full shrink-0"
                    style={{
                      backgroundImage: `url('${src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ))}
              </div>

              {/* Gradient Overlay for Controls Visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Hide Banner Button */}
              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/20 z-20 backdrop-blur-xs"
                title="Ẩn banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Header Controls (Expand, History, Close) */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-3 text-white/80 z-10">
                <button
                  onClick={() => showToast('Đang kết nối cổng trợ giúp LynKore...')}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Mở rộng"
                >
                  <Maximize2 className="h-3.5 w-3.5 drop-shadow-md" strokeWidth={2.2} />
                </button>
                <button
                  onClick={() => showToast('Chưa có lịch sử câu hỏi.')}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Lịch sử"
                >
                  <History className="h-4 w-4 drop-shadow-md" strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsChatting(false);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Đóng"
                >
                  <X className="h-4 w-4 drop-shadow-md" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
              <span className="text-xs font-bold">Trợ Giúp Học Tiếng Hàn & TOPIK</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 bg-slate-50/50 dark:bg-[#070709]/50 relative overflow-hidden">
            {/* Chat History Area (when chatting) */}
            <div
              className={`overflow-hidden transition-all duration-300 flex flex-col shrink ${
                isChatting ? 'h-[320px] opacity-100 p-4' : 'h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1.5 w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700">
                          <img src="/helpcenter.png" alt="LynKore AI Tutor" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white tracking-tight">
                          LynKore AI Tutor 🇰🇷
                        </span>
                      </div>
                    )}

                    <div
                      className={`text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'p-3 bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-xs max-w-[85%]'
                          : 'p-3 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 rounded-2xl rounded-tl-none border border-slate-200/80 dark:border-zinc-800/80 w-full'
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex gap-1.5 items-center h-4 px-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Search Box Card Container */}
            <div className="p-3 bg-white dark:bg-[#121215] border-b border-slate-200/80 dark:border-zinc-800/80 shrink-0">
              <div className="border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#070709] rounded-xl p-3 flex flex-col gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-3xs">
                <form onSubmit={handleSearchSubmit} className="relative flex items-start">
                  <Search className="h-3.5 w-3.5 text-slate-400 mt-0.5 mr-2 shrink-0" strokeWidth={2} />
                  <textarea
                    value={searchQuery}
                    onFocus={() => setIsChatting(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchSubmit(e);
                      }
                    }}
                    placeholder="Hỏi AI về từ vựng, đề thi TOPIK hoặc phương pháp học..."
                    rows={2}
                    className="w-full text-xs bg-transparent border-none text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none resize-none p-0 leading-normal"
                  />
                </form>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-1">
                    {isChatting && (
                      <button
                        type="button"
                        onClick={() => setIsChatting(false)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer p-1 flex items-center"
                        title="Quay lại danh sách"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => showToast('Tính năng trích xuất bài tập từ ảnh sắp ra mắt!')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer p-1 flex items-center"
                      title="Đính kèm ảnh bài tập"
                    >
                      <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>

                  <button
                    onClick={handleSearchSubmit}
                    disabled={!searchQuery.trim()}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all cursor-pointer border-none ${
                      searchQuery.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed'
                    }`}
                    title="Gửi câu hỏi"
                  >
                    <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Options & FAQs (shrinks when chatting) */}
            <div
              className={`overflow-hidden transition-all duration-300 flex flex-col ${
                isChatting ? 'h-0 opacity-0 pointer-events-none' : 'h-[260px] opacity-100'
              }`}
            >
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {showShortcuts ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>Danh sách phím tắt học Flashcard</span>
                      <button
                        onClick={() => setShowShortcuts(false)}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                      >
                        Quay lại
                      </button>
                    </div>
                    <div className="space-y-2 bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Lật thẻ Flashcard (Flip)</span>
                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-semibold text-slate-800 dark:text-zinc-200">Space</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Chuyển thẻ Kế tiếp / Trước</span>
                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-semibold text-slate-800 dark:text-zinc-200">← / →</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Mở bảng tìm kiếm từ vựng</span>
                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded font-semibold text-slate-800 dark:text-zinc-200">Ctrl + K</kbd>
                      </div>
                    </div>
                  </div>
                ) : showFeedback ? (
                  <form onSubmit={handleSendFeedback} className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>Góp ý bài học & Đề thi TOPIK</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFeedback(false);
                          setFeedbackText('');
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                      >
                        Quay lại
                      </button>
                    </div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Ý kiến của bạn giúp LynKore cải tiến chất lượng đề thi và từ vựng..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none leading-relaxed"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer border-none"
                    >
                      Gửi góp ý của bạn
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3.5">
                    {/* FAQs Tailored 100% to LynKore */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tracking-tight">
                        CÂU HỎI THƯỜNG GẶP
                      </span>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleQuestionClick('Luyện thi TOPIK I & TOPIK II như thế nào hiệu quả nhất?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-normal rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Luyện thi TOPIK I & TOPIK II như thế nào hiệu quả nhất?
                        </button>
                        <button
                          onClick={() => handleQuestionClick('Phương pháp ôn từ vựng Flashcard Spaced Repetition hoạt động ra sao?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-normal rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Phương pháp ôn từ vựng Flashcard Spaced Repetition hoạt động ra sao?
                        </button>
                        <button
                          onClick={() => handleQuestionClick('Làm thế nào để sử dụng AI Tutor thực hành nói & phát âm tiếng Hàn?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-normal rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Làm thế nào để sử dụng AI Tutor thực hành nói & phát âm tiếng Hàn?
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200/60 dark:bg-zinc-800/60" />

                    {/* Quick Help Options Tailored 100% to LynKore */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 tracking-tight">
                        TÙY CHỌN TRỢ GIÚP NHANH
                      </span>
                      <div className="space-y-1">
                        <button
                          onClick={handleResetChecklist}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Hướng Dẫn Học Cho Người Mới
                            </span>
                            <span className="text-[10px] text-slate-400">Khôi phục lộ trình học tiếng Hàn từ sơ cấp</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowShortcuts(true)}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                            <Keyboard className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Danh Sách Phím Tắt Lật Thẻ
                            </span>
                            <span className="text-[10px] text-slate-400">Phím tắt thao tác nhanh ôn Flashcard</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowFeedback(true)}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold">
                            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Góp Ý Cải Tiến Bài Học
                            </span>
                            <span className="text-[10px] text-slate-400">Góp ý nội dung cho đội ngũ LynKore</span>
                          </div>
                        </button>

                        <button
                          onClick={handleReportBug}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                            <Bug className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Báo Cáo Lỗi Bài Thi / Kỹ Thuật
                            </span>
                            <span className="text-[10px] text-slate-400">Báo sự cố hiển thị hoặc đáp án</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat Footer Button & Powered by LynKore */}
            <div
              className={`overflow-hidden transition-all duration-300 shrink-0 flex flex-col border-t border-slate-200/60 dark:border-zinc-800/60 ${
                isChatting ? 'h-0 opacity-0' : 'h-[75px] opacity-100 p-3 justify-between'
              }`}
            >
              {!showShortcuts && !showFeedback && (
                <button
                  onClick={() => {
                    showToast('Đang kết nối Giảng viên & Bộ phận hỗ trợ trực tiếp...');
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between text-xs font-medium transition-all text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-3xs group"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" strokeWidth={1.8} />
                    <span className="text-slate-600 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white">
                      Liên hệ trực tiếp Giảng viên (Live Chat)
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" strokeWidth={1.8} />
                </button>
              )}

              <div className="text-center text-[10.5px] text-slate-400 dark:text-zinc-500 font-semibold select-none">
                Powered by LynKore K-Learning AI
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
