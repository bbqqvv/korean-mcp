'use client';

import { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, BookOpen, MessageSquare, Volume2, X, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Flashcard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AITutorDrawerProps {
  card: Flashcard;
  isOpen: boolean;
  onClose: () => void;
}

export default function AITutorDrawer({ card, isOpen, onClose }: AITutorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'sentences' | 'chat'>('explain');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [aiSentences, setAiSentences] = useState<Array<{ kr: string; vi: string }> | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const fetchAIExplanation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          word: card.korean,
          vietnamese: card.vietnamese
        })
      });
      const data = await res.json();
      if (data.success) {
        setExplanation(data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAISentences = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_sentences',
          word: card.korean,
          vietnamese: card.vietnamese
        })
      });
      const data = await res.json();
      if (data.success) {
        try {
          const parsed = JSON.parse(data.reply);
          if (Array.isArray(parsed)) setAiSentences(parsed);
          else setAiSentences([{ kr: card.korean, vi: data.reply }]);
        } catch {
          setAiSentences([{ kr: card.korean, vi: data.reply }]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          word: card.korean,
          vietnamese: card.vietnamese,
          prompt: userText
        })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Trợ Lý Gia Sư Groq AI 🇰🇷
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-mono font-bold rounded">
                  llama-3.3-70b
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Đang phân tích thẻ: <strong className="text-slate-900 dark:text-white font-bold">{card.korean}</strong> ({card.vietnamese})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="ios-glass-circle !w-8 !h-8 text-xs">
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab('explain');
              if (!explanation) fetchAIExplanation();
            }}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'explain'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Phân Tích Từ
          </button>

          <button
            onClick={() => {
              setActiveTab('sentences');
              if (!aiSentences) fetchAISentences();
            }}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'sentences'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Sinh Câu Mới
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Hỏi AI (Q&A)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[220px] max-h-[360px] p-1">
          {isLoading && (
            <div className="space-y-3 py-4">
              <Skeleton className="w-3/4 h-5 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-5/6 h-4 rounded-lg" />
              <Skeleton className="w-2/3 h-4 rounded-lg" />
            </div>
          )}

          {!isLoading && activeTab === 'explain' && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-[13px] text-slate-900 dark:text-white leading-relaxed space-y-2">
              {explanation ? (
                <div className="prose max-w-none text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_strong]:font-bold [&_p]:my-1.5">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 space-y-2">
                  <p>Bấm nút bên dưới để yêu cầu AI giải thích chi tiết ngữ pháp và cách chia từ này.</p>
                  <button onClick={fetchAIExplanation} className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm">
                    Bắt đầu giải thích
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === 'sentences' && (
            <div className="space-y-2.5">
              {aiSentences ? (
                aiSentences.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-1 text-[13px]">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{idx + 1}. {item.kr}</span>
                      <button onClick={() => speakKorean(item.kr)} className="ios-glass-circle !w-6 !h-6">
                        <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[12px]">👉 {item.vi}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                  <p>Bấm nút bên dưới để Groq AI sinh ra 3 câu ví dụ giao tiếp hoàn toàn mới.</p>
                  <button onClick={fetchAISentences} className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm">
                    Sinh câu ví dụ mới
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-3">
              {chatMessages.length === 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center text-slate-500 text-[12px] space-y-1">
                  <HelpCircle className="w-5 h-5 mx-auto text-rose-500 mb-1" />
                  <p className="font-bold text-slate-900 dark:text-white">Hỏi bất kỳ điều gì về từ &quot;{card.korean}&quot;</p>
                  <p>Ví dụ: &quot;Phân biệt từ này với từ tương tự&quot;, &quot;Khi nào dùng kính ngữ?&quot;</p>
                </div>
              )}

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-[13px] leading-relaxed max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto font-semibold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 mr-auto prose [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_p]:my-1'
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input if in chat mode */}
        {activeTab === 'chat' && (
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder={`Hỏi AI về từ "${card.korean}"...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !chatInput.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center gap-1 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
