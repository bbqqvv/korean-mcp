'use client';

import { useState } from 'react';
import { Sparkles, Bot, Loader2, Link as LinkIcon, Layers, FileText, X } from 'lucide-react';
import { Deck } from '@/lib/types';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckCreated?: (newDeck: Deck) => void;
}

export default function CreateDeckModal({ isOpen, onClose, onDeckCreated }: CreateDeckModalProps) {
  const [topicOrUrl, setTopicOrUrl] = useState('');
  const [category, setCategory] = useState<Deck['category']>('YouTube Video');
  const [cardCount, setCardCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicOrUrl.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrUrl: topicOrUrl.trim(),
          category,
          cardCount
        })
      });

      const data = await res.json();
      if (data.success && data.deck) {
        if (onDeckCreated) onDeckCreated(data.deck);
        setTopicOrUrl('');
        onClose();
      } else {
        setErrorMsg(data.error || 'Không thể tạo bộ từ vựng qua Groq AI.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Lỗi mạng khi kết nối Groq AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Tạo Bộ Từ Vựng AI 🇰🇷
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Nhập link YouTube hoặc chủ đề bạn muốn học</p>
            </div>
          </div>

          <button onClick={onClose} className="ios-glass-circle !w-7 !h-7 text-xs">
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" /> Link YouTube HOẶC Chủ Đề Từ Vựng *
            </label>
            <input
              type="text"
              required
              placeholder="VD: 'https://youtube.com/...' HOẶC 'Đi Siêu Thị Tiếng Hàn'"
              value={topicOrUrl}
              onChange={(e) => setTopicOrUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Danh Mục:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="YouTube Video">YouTube Video</option>
                <option value="Công sở & Địa điểm">Công sở & Địa điểm</option>
                <option value="Nhà cửa & Vật dụng">Nhà cửa & Vật dụng</option>
                <option value="Giao tiếp hàng ngày">Giao tiếp hàng ngày</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Số Lượng Thẻ:
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={4}>4 thẻ từ vựng</option>
                <option value={6}>6 thẻ từ vựng</option>
                <option value={10}>10 thẻ từ vựng</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>LynKore AI</strong> sẽ tự động tạo từ vựng chuẩn, phiên âm Romaja, từ Hán Hàn và câu ví dụ tiếng Hàn sắc nét chỉ trong vài giây!
            </span>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-100 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !topicOrUrl.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Đang Tạo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Tạo Bộ Bài Bằng AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
