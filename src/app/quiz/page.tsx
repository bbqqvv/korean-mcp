'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import QuizMode from '@/components/quiz-mode';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';

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
      <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Đang chuẩn bị câu hỏi Quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#faf8f5] text-slate-900 overflow-hidden font-sans">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-5xl w-full mx-auto">
          {/* Direct Quiz Component Arena */}
          {selectedDeck && (
            <QuizMode
              cards={selectedDeck.cards}
              deckTitle={selectedDeck.title}
            />
          )}
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
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] text-slate-900 p-8">Đang tải...</div>}>
      <QuizContent />
    </Suspense>
  );
}
