'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import CreateDeckModal from '@/components/create-deck-modal';
import { useTheme } from '@/lib/theme-context';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  RotateCw,
  MessageSquare,
  BookOpen,
  Mic,
  Smile,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chips?: string[];
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `안녕하세요! 🇰🇷 Tôi là **LynKore AI** — Trợ lý & Gia sư tiếng Hàn thông minh của bạn.

Tôi có thể giúp bạn:
- 💬 **Luyện hội thoại bản xứ** (đóng vai mua sắm, nhà hàng, công sở...)
- 📝 **Chữa bài & Sửa lỗi ngữ pháp** tiếng Hàn chi tiết
- 💡 **Giải thích từ Hán Hàn (한자)** & phân biệt từ đồng nghĩa
- 🎯 **Luyện thi TOPIK I, II & KIIP**

Hãy chọn gợi ý nhanh bên dưới hoặc gõ câu hỏi của bạn nhé!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  chips: [
    '🎭 Luyện hội thoại gọi món ở nhà hàng Seoul',
    '📝 Sửa lỗi câu: "저는 한국어를 공부를 해요"',
    '💡 Phân biệt -아/어 보다 và -고 싶다',
    '🇰🇷 Cho tôi 5 câu giao tiếp công sở Hàn Quốc'
  ]
};

export default function AITutorPage() {
  const { themeConfig } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [activeRole, setActiveRole] = useState<'general' | 'grammar' | 'roleplay' | 'topik'>('general');
  const [isLoading, setIsLoading] = useState(false);

  // App Shell state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          })),
          role: activeRole
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: [
            '📝 Sửa lỗi ngữ pháp',
            '💡 Đặt thêm 3 câu ví dụ',
            '🔊 Đọc mẫu đoạn này'
          ]
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Không nhận được phản hồi');
      }
    } catch (err: any) {
      console.error('Chat AI Error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Có lỗi kết nối AI: ${err.message || 'Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Extract Korean sentences
      const koreanRegex = /[\u3131-\u318E\uAC00-\uD7A3]+/g;
      const matches = text.match(koreanRegex);
      const textToSpeak = matches ? matches.join(' ') : text;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Main Workspace Arena */}
        <main className="flex-1 flex flex-col min-w-0 h-full max-w-5xl w-full mx-auto p-3 sm:p-6 overflow-hidden space-y-3">
          {/* Header Bar */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  Trợ Lý Tiếng Hàn AI (LynKore Bot)
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Hỗ trợ sửa lỗi, luyện hội thoại &amp; giải đáp ngữ pháp 24/7 với Groq AI
                </p>
              </div>
            </div>

            {/* Mode Select Buttons & Reset */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setActiveRole('general')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    activeRole === 'general' ? 'bg-white text-slate-900 border border-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  💬 Chung
                </button>
                <button
                  onClick={() => setActiveRole('grammar')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    activeRole === 'grammar' ? 'bg-white text-slate-900 border border-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  📝 Ngữ pháp
                </button>
                <button
                  onClick={() => setActiveRole('roleplay')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    activeRole === 'roleplay' ? 'bg-white text-slate-900 border border-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  🎭 Đóng vai
                </button>
                <button
                  onClick={() => setActiveRole('topik')}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    activeRole === 'topik' ? 'bg-white text-slate-900 border border-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  🎯 TOPIK
                </button>
              </div>

              <button
                onClick={handleClearHistory}
                className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-colors shadow-2xs"
                title="Xóa lịch sử trò chuyện"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-xs shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-2xl space-y-2`}>
                  {/* Bubble Container */}
                  <div
                    className={`p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border-2 border-slate-900 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-3xl rounded-br-xs font-semibold'
                        : 'bg-white text-slate-900 rounded-3xl rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans space-y-1">
                      {msg.content}
                    </div>

                    <div
                      className={`flex items-center justify-between text-[10px] pt-2 border-t mt-3 ${
                        msg.role === 'user' ? 'border-blue-500 text-blue-200' : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-bold bg-slate-100 px-2 py-0.5 rounded-full transition-colors"
                          title="Đọc mẫu câu tiếng Hàn"
                        >
                          <Volume2 className="w-3 h-3" /> Đọc phát âm
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Action Chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="px-3 py-1.5 bg-white border-2 border-slate-900 rounded-2xl text-slate-800 font-bold text-xs shadow-2xs hover:bg-blue-50 hover:border-blue-600 transition-all flex items-center gap-1.5"
                        >
                          <span>{chip}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-slate-900 shadow-xs shrink-0 animate-bounce">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border-2 border-slate-900 rounded-2xl px-4 py-3 shadow-xs text-xs font-bold text-slate-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>LynKore AI đang suy nghĩ câu trả lời...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Bottom Input Bar */}
          <div className="shrink-0 pt-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="bg-white border-2 border-slate-900 rounded-3xl p-3 sm:p-4 shadow-md flex items-center gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Nhắn cho Trợ lý AI Tiếng Hàn hoặc yêu cầu bài tập..."
                className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none px-2"
              />

              <button
                type="button"
                onClick={() => speakText(inputPrompt || '안녕하세요!')}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors"
                title="Nghe thử"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className={`px-5 py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl border-2 border-slate-900 shadow-xs flex items-center gap-2 transition-all shrink-0`}
              >
                <span>Gửi</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Create Deck Modal */}
      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
