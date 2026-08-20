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
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
};

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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! 👋 Mình là trợ lý AI của LynKore. Mình có thể giúp gì cho bạn về việc học tiếng Hàn & TOPIK hôm nay?'
    }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
    showToast('Đã hiển thị lại thanh hướng dẫn thiết lập!');
    setIsOpen(false);
  };

  const handleReportBug = () => {
    showToast('Đã gửi báo cáo lỗi kỹ thuật thành công!');
    setIsOpen(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Cảm ơn bạn đã gửi ý kiến đóng góp cho LynKore!');
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
      let answer = 'Hệ thống đã ghi nhận câu hỏi. Trợ lý AI sẽ trả lời chi tiết và gửi hướng dẫn học tập cho bạn!';
      if (q.includes('topik') || q.includes('đề') || q.includes('thi')) {
        answer = 'Bạn có thể truy cập mục "Luyện Đề TOPIK" ở menu bên trái để chọn các bộ đề thi thử TOPIK I và TOPIK II có bấm giờ thực tế!';
      } else if (q.includes('từ vựng') || q.includes('flashcard') || q.includes('học')) {
        answer = 'Hãy chọn mục "Bộ Thẻ Bài Học" để luyện từ vựng tiếng Hàn theo phương pháp lặp lại ngắt quãng (Spaced Repetition).';
      } else if (q.includes('phím tắt') || q.includes('shortcut')) {
        answer = 'Mở bảng phím tắt bên dưới để xem danh sách phím thao tác nhanh nhé!';
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
      let answer = 'Bạn có thể xem chi tiết ở mục Tài liệu hướng dẫn sử dụng LynKore.';
      if (question.includes('tự động') || question.includes('lịch')) {
        answer = 'Tính năng nhắc nhở học tập tự động giúp bạn duy trì chuỗi Streak học tiếng Hàn hằng ngày mà không lo bị gián đoạn!';
      } else if (question.includes('instagram') || question.includes('kết nối')) {
        answer = 'Để kết nối tài khoản xã hội, bạn vào Cài Đặt -> Tài Khoản Xã Hội và làm theo hướng dẫn liên kết nhanh.';
      } else if (question.includes('nhiều kênh') || question.includes('luyện')) {
        answer = 'Bạn có thể chọn chế độ "Luyện tập từng phần" hoặc "Làm Full Test" trong bộ luyện đề TOPIK.';
      }

      setMessages((prev) => {
        const newMsgs = prev.filter((m) => m.id !== 'typing');
        return [...newMsgs, { id: (Date.now() + 1).toString(), role: 'assistant', content: answer }];
      });
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none" ref={containerRef}>
      {/* Toast alert message overlay */}
      {toastMsg && (
        <div className="absolute bottom-14 right-0 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Launcher Button */}
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
        title="Trợ giúp & Tài nguyên OtterSync / LynKore"
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
          {/* Header Banner */}
          {showBanner ? (
            <div className="w-full h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden shrink-0 group p-4 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-xs">
                    🦦
                  </div>
                  <span className="text-xs font-black tracking-wide">OtterSync × LynKore</span>
                </div>

                <div className="flex items-center gap-2.5 text-white/80">
                  <button
                    onClick={() => showToast('Đang kết nối cổng hỗ trợ...')}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Mở rộng"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => showToast('Không có lịch sử câu hỏi.')}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Lịch sử"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsChatting(false);
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Đóng"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="z-10 space-y-0.5">
                <h4 className="text-sm font-black tracking-tight">Create Once. Sync Everywhere.</h4>
                <p className="text-[11px] text-blue-100/90 font-medium">Hỗ trợ thông minh & Luyện thi TOPIK hiệu quả</p>
              </div>

              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-2 left-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/20 z-20"
                title="Ẩn banner"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
              <span className="text-xs font-bold">Hỗ trợ nhanh từ Trung tâm trợ giúp</span>
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
                    className={`flex flex-col gap-1 w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                          AI
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">Otter AI</span>
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

            {/* Search Box Card */}
            <div className="p-3 bg-white dark:bg-[#121215] border-b border-slate-200/80 dark:border-zinc-800/80 shrink-0">
              <div className="border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#070709] rounded-xl p-3 flex flex-col gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-3xs">
                <form onSubmit={handleSearchSubmit} className="relative flex items-start">
                  <Search className="h-3.5 w-3.5 text-slate-400 mt-0.5 mr-2 shrink-0" />
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
                    placeholder="Đặt câu hỏi hoặc nhập vấn đề bạn đang gặp phải..."
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
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer p-1"
                        title="Quay lại danh sách"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => showToast('Tính năng đính kèm ảnh sắp ra mắt!')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer p-1"
                      title="Đính kèm ảnh"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleSearchSubmit}
                    disabled={!searchQuery.trim()}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all cursor-pointer ${
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
                      <span>Danh sách phím tắt</span>
                      <button
                        onClick={() => setShowShortcuts(false)}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Quay lại
                      </button>
                    </div>
                    <div className="space-y-2 bg-white dark:bg-[#121215] p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Mở bảng tìm kiếm</span>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 border rounded font-semibold">Ctrl + K</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Đổi giao diện Sáng/Tối</span>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 border rounded font-semibold">Shift + L</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-zinc-400">Chuyển thẻ Flashcard</span>
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 border rounded font-semibold">Phím Space / ← →</kbd>
                      </div>
                    </div>
                  </div>
                ) : showFeedback ? (
                  <form onSubmit={handleSendFeedback} className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>Gửi đóng góp ý kiến</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFeedback(false);
                          setFeedbackText('');
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Quay lại
                      </button>
                    </div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Ý kiến của bạn sẽ giúp LynKore hoàn thiện sản phẩm hơn..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      Gửi góp ý của bạn
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3.5">
                    {/* FAQs (Matching OtterSync Screenshot) */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Câu hỏi thường gặp
                      </span>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleQuestionClick('Lịch đăng bài tự động hoạt động như thế nào?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-medium rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Lịch đăng bài tự động hoạt động như thế nào?
                        </button>
                        <button
                          onClick={() => handleQuestionClick('Làm sao để kết nối tài khoản Instagram?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-medium rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Làm sao để kết nối tài khoản Instagram?
                        </button>
                        <button
                          onClick={() => handleQuestionClick('Làm cách nào để lên lịch đăng cho nhiều kênh cùng lúc?')}
                          className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-800 dark:text-zinc-200 text-xs font-medium rounded-xl py-2 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                        >
                          Làm cách nào để lên lịch đăng cho nhiều kênh cùng lúc?
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-zinc-800" />

                    {/* Quick Help Options (Matching OtterSync Screenshot) */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Tùy chọn trợ giúp nhanh
                      </span>
                      <div className="space-y-1">
                        <button
                          onClick={handleResetChecklist}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                            <RefreshCw className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Hiện thanh thiết lập
                            </span>
                            <span className="text-[10px] text-slate-400">Khôi phục hướng dẫn thiết lập</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowShortcuts(true)}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                            <Keyboard className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Danh sách phím tắt
                            </span>
                            <span className="text-[10px] text-slate-400">Phím tắt thao tác nhanh</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowFeedback(true)}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Gửi ý kiến đóng góp
                            </span>
                            <span className="text-[10px] text-slate-400">Góp ý cải tiến chất lượng</span>
                          </div>
                        </button>

                        <button
                          onClick={handleReportBug}
                          className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                            <Bug className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-grow min-w-0 flex flex-col">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Báo cáo lỗi kỹ thuật
                            </span>
                            <span className="text-[10px] text-slate-400">Báo sự cố hoặc lỗi hiển thị</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Chat Footer Button & Powered by OtterSync */}
            <div
              className={`overflow-hidden transition-all duration-300 shrink-0 flex flex-col border-t border-slate-200/60 dark:border-zinc-800/60 ${
                isChatting ? 'h-0 opacity-0' : 'h-[75px] opacity-100 p-3 justify-between'
              }`}
            >
              {!showShortcuts && !showFeedback && (
                <button
                  onClick={() => {
                    showToast('Đang kết nối bộ phận hỗ trợ trực tiếp (Live Chat)...');
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between text-xs font-medium transition-all text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-3xs group"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span>Liên hệ trực tiếp với bộ phận hỗ trợ (Live Chat)</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </button>
              )}

              <div className="text-center text-[10.5px] text-slate-400 dark:text-zinc-500 font-semibold select-none">
                Powered by OtterSync × LynKore
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
