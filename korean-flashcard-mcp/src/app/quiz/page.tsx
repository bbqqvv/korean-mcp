'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import QuizMode from '@/components/quiz-mode';
import { Deck } from '@/lib/types';
import { Award } from 'lucide-react';

function QuizContent() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck');

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await fetch('/api/decks');
        const data = await res.json();
        if (data.success) {
          setDecks(data.decks);
          if (deckId) {
            const found = data.decks.find((d: Deck) => d.id === deckId);
            if (found) setSelectedDeck(found);
            else setSelectedDeck(data.decks[0]);
          } else if (data.decks.length > 0) {
            setSelectedDeck(data.decks[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDecks();
  }, [deckId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Đang chuẩn bị câu hỏi Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">Ôn Luyện Quiz Từ Vựng 🇰🇷</h1>
            </div>
            <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400">Kiểm tra mức độ ghi nhớ tiếng Hàn qua bài tập trắc nghiệm</p>
          </div>

          {/* Select Deck Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-400 font-bold">Chọn bộ:</span>
            <select
              value={selectedDeck?.id || ''}
              onChange={(e) => {
                const found = decks.find((d) => d.id === e.target.value);
                if (found) setSelectedDeck(found);
              }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-[12px] sm:text-[13px] font-bold text-slate-900 dark:text-white focus:outline-none max-w-[200px] truncate shadow-sm"
            >
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title} ({deck.cards.length} từ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quiz Component */}
        {selectedDeck && <QuizMode cards={selectedDeck.cards} deckTitle={selectedDeck.title} />}
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f6] dark:bg-slate-900 text-slate-900 p-8">Đang tải...</div>}>
      <QuizContent />
    </Suspense>
  );
}
