'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import QuizMode from '@/components/quiz-mode';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';
import { Award } from 'lucide-react';

function QuizContent() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck');

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      <div className="min-h-screen bg-[#faf9f6] text-slate-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Đang chuẩn bị câu hỏi Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf9f6] text-slate-900 overflow-hidden font-sans">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                <h1 className="text-base sm:text-xl font-black text-slate-900">Ôn Luyện Quiz Từ Vựng 🇰🇷</h1>
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-500">Kiểm tra mức độ ghi nhớ tiếng Hàn qua bài tập trắc nghiệm</p>
            </div>

            {/* Select Deck Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-[12px] sm:text-[13px] text-slate-600 font-bold">Chọn bộ:</span>
              <select
                value={selectedDeck?.id || ''}
                onChange={(e) => {
                  const found = decks.find((d) => d.id === e.target.value);
                  if (found) setSelectedDeck(found);
                }}
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-[12px] sm:text-[13px] font-bold text-slate-900 focus:outline-none max-w-[220px] truncate shadow-xs"
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

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDeckCreated={(newDeck) => {
          setDecks((prev) => [newDeck, ...prev]);
          setSelectedDeck(newDeck);
        }}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f6] text-slate-900 p-8">Đang tải...</div>}>
      <QuizContent />
    </Suspense>
  );
}
