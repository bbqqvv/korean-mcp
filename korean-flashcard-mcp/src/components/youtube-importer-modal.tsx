'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Link as LinkIcon, FileText, Bot, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface YoutubeImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function YoutubeImporterModal({ isOpen, onClose, onSuccess }: YoutubeImporterModalProps) {
  const [topicOrUrl, setTopicOrUrl] = useState('');
  const [cardCount, setCardCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicOrUrl) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrUrl,
          cardCount
        })
      });

      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
        setTopicOrUrl('');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Không thể sinh từ vựng qua Groq AI.');
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Tạo Từ Vựng Bằng Groq AI 🇰🇷
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-mono font-bold rounded">
                  llama-3.3-70b
                </span>
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Trích xuất bài học thông minh qua AI siêu tốc</p>
            </div>
          </div>
          <button onClick={onClose} className="ios-glass-circle !w-7 !h-7 text-xs">
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" /> Link YouTube HOẶC Chủ Đề Tiếng Hàn *
            </label>
            <input
              type="text"
              required
              placeholder="VD: https://youtube.com/... HOẶC 'Từ vựng Tiếng Hàn Đi Du Lịch'"
              value={topicOrUrl}
              onChange={(e) => setTopicOrUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Số Lượng Thẻ Cần Tạo:
            </label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={4}>4 thẻ từ vựng</option>
              <option value={6}>6 thẻ từ vựng (Khuyên dùng)</option>
              <option value={10}>10 thẻ từ vựng</option>
            </select>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>Groq AI (llama-3.3-70b-versatile)</strong> sẽ tự động phân tích chủ đề, sinh phiên âm Romaja, từ Hán Hàn và câu ví dụ tiếng Hàn chuẩn xác trong vài giây!
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
              className="px-4 py-2 text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-full"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Groq AI Đang Xử Lý...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 text-white" />
                  <span>Groq AI Tạo Bộ Thẻ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
