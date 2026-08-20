'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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
  timestamp: 'Vừa xong',
  chips: [
    '🎭 Luyện hội thoại gọi món ở nhà hàng Seoul 🇰🇷',
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

  // Helper to parse inline markdown: **bold**, `code`, *italic*, <br>
  const renderFormattedText = (text: string) => {
    // 1. Split by <br> or <br/> or <br />
    const brParts = text.split(/<br\s*\/?>/gi);

    return brParts.map((brPart, brIdx) => {
      // 2. Tokenize by **bold**, `code`, *italic*
      const tokens = brPart.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
      const renderedTokens = tokens.map((token, tokenIdx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={tokenIdx} className="font-extrabold text-slate-900 dark:text-white">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code key={tokenIdx} className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border border-blue-200/80 dark:border-blue-800/80 mx-0.5 inline-block">
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('*') && token.endsWith('*')) {
          return (
            <em key={tokenIdx} className="italic text-slate-600 dark:text-zinc-400 font-medium">
              {token.slice(1, -1)}
            </em>
          );
        }
        return token;
      });

      return (
        <span key={brIdx}>
          {renderedTokens}
          {brIdx < brParts.length - 1 && <br />}
        </span>
      );
    });
  };

  const getKoreanText = (str: string) => {
    const matches = str.match(/[\u3131-\u318E\uAC00-\uD7A3]+/g);
    return matches ? matches.join(' ') : '';
  };

  const formatMarkdown = (content: string) => {
    // Sanitize and strip any raw reasoning <think>...</think> tags
    const sanitizedContent = (content || '')
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<think>[\s\S]*/gi, '')
      .trim();

    const lines = sanitizedContent.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      const koreanText = getKoreanText(trimmed);

      // Check for Markdown Table (lines starting with | and containing |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          // Parse header and rows
          const headerRow = tableLines[0].split('|').slice(1, -1).map((c) => c.trim());
          const hasDivider = tableLines[1].includes('---');
          const dataRows = tableLines.slice(hasDivider ? 2 : 1).map((r) =>
            r.split('|').slice(1, -1).map((c) => c.trim())
          );

          elements.push(
            <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800">
                    {headerRow.map((cell, cIdx) => (
                      <th key={cIdx} className="p-2.5 font-extrabold border-r last:border-r-0 border-slate-200 dark:border-zinc-800">
                        {renderFormattedText(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 bg-white dark:bg-[#121215]">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/80 transition-colors">
                      {row.map((cell, cIdx) => {
                        const cellKorean = getKoreanText(cell);
                        return (
                          <td key={cIdx} className="p-2.5 text-slate-700 dark:text-zinc-300 border-r last:border-r-0 border-slate-200 dark:border-zinc-800">
                            <div className="flex items-center justify-between gap-1">
                              <span>{renderFormattedText(cell)}</span>
                              {cellKorean && (
                                <button
                                  type="button"
                                  onClick={() => speakText(cellKorean)}
                                  className="p-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer shrink-0"
                                  title="Nghe phát âm ô này"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Check for List Items (- or •)
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const itemText = trimmed.slice(2);
        const itemKorean = getKoreanText(itemText);
        elements.push(
          <div key={`list-${i}`} className="flex items-start justify-between gap-2 my-1 pl-1 group">
            <div className="flex items-start gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
              <div className="text-slate-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed">
                {renderFormattedText(itemText)}
              </div>
            </div>
            {itemKorean && (
              <button
                type="button"
                onClick={() => speakText(itemKorean)}
                className="p-1 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 shadow-3xs"
                title="Bấm nghe phát âm câu này"
              >
                <Volume2 className="w-3 h-3" />
                <span>Nghe</span>
              </button>
            )}
          </div>
        );
        i++;
        continue;
      }

      // Check for Numbered List (1. 2. 1️⃣ 2️⃣ 3️⃣)
      if (/^\d+\.\s/.test(trimmed) || /^[\u0030-\u0039]\uFE0F?\u20E3/.test(trimmed)) {
        elements.push(
          <div key={`num-${i}`} className="font-extrabold text-slate-900 dark:text-zinc-100 text-xs sm:text-sm pt-2 pb-0.5 flex items-center justify-between gap-2 group">
            <div className="min-w-0">
              {renderFormattedText(trimmed)}
            </div>
            {koreanText && (
              <button
                type="button"
                onClick={() => speakText(koreanText)}
                className="p-1 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 shadow-3xs"
                title="Bấm nghe phát âm câu ví dụ này"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe</span>
              </button>
            )}
          </div>
        );
        i++;
        continue;
      }

      // Empty line spacer
      if (!trimmed) {
        elements.push(<div key={`space-${i}`} className="h-2" />);
        i++;
        continue;
      }

      // Standard paragraph
      elements.push(
        <div key={`p-${i}`} className="my-1 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed flex items-center justify-between gap-2 group">
          <p className="min-w-0">
            {renderFormattedText(trimmed)}
          </p>
          {koreanText && (
            <button
              type="button"
              onClick={() => speakText(koreanText)}
              className="p-1 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/80 dark:border-blue-800/80 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0 shadow-3xs"
              title="Bấm nghe phát âm đoạn này"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe</span>
            </button>
          )}
        </div>
      );
      i++;
    }

    return elements;
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
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Image
                    src="/krlogo.png"
                    alt="LynKore AI Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-2xl object-cover border border-slate-200/80 dark:border-zinc-800 shadow-xs shrink-0 mt-1"
                  />
                )}

                <div className={`max-w-[85%] sm:max-w-2xl space-y-2`}>
                  {/* Bubble Container */}
                  <div
                    className={`p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border border-slate-200/80 dark:border-zinc-800/80 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-3xl rounded-br-xs font-semibold'
                        : 'bg-white dark:bg-[#121215] text-slate-900 dark:text-zinc-100 rounded-3xl rounded-bl-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      {msg.role === 'user' ? msg.content : formatMarkdown(msg.content)}
                    </div>

                    <div
                      className={`flex items-center justify-between text-[10px] pt-2 border-t mt-3 ${
                        msg.role === 'user' ? 'border-blue-500 text-blue-200' : 'border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="flex items-center gap-1 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
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
                          className="px-3 py-1.5 bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 shadow-xs rounded-2xl text-slate-800 dark:text-zinc-200 font-bold text-xs shadow-2xs hover:bg-blue-50 dark:hover:bg-zinc-800 hover:border-blue-600 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{chip}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <Image
                  src="/krlogo.png"
                  alt="LynKore AI Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-2xl object-cover border border-slate-200/80 dark:border-zinc-800 shrink-0 animate-bounce"
                />
                <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 shadow-xs rounded-2xl px-4 py-3 text-xs font-bold text-slate-600 dark:text-zinc-300 flex items-center gap-2">
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
              className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 shadow-xs rounded-3xl p-3 sm:p-4 shadow-md flex items-center gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Nhắn cho Trợ lý AI Tiếng Hàn hoặc yêu cầu bài tập..."
                className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none px-2"
              />

              <button
                type="button"
                onClick={() => speakText(inputPrompt || '안녕하세요!')}
                className="p-2 text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-xl transition-colors cursor-pointer"
                title="Nghe thử"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className={`px-5 py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-200/80 dark:border-zinc-800 flex items-center gap-2 transition-all shrink-0 cursor-pointer`}
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
