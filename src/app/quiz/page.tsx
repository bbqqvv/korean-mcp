'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import QuizMode from '@/components/quiz-mode';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';
import { QuizSkeleton } from '@/components/ui/skeleton';

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

  return (
    <div className="flex h-screen bg-caro-grid text-slate-900 overflow-hidden font-sans">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-5xl w-full mx-auto">
          {isLoading ? (
            <QuizSkeleton />
          ) : selectedDeck ? (
            <QuizMode
              cards={selectedDeck.cards}
              deckTitle={selectedDeck.title}
            />
          ) : (
            <div className="text-center p-8 bg-white border border-slate-200 rounded-3xl">
              <p className="text-sm font-bold text-slate-700">Chưa có dữ liệu bộ câu hỏi Quiz</p>
            </div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] p-6 max-w-3xl mx-auto"><QuizSkeleton /></div>}>
      <QuizContent />
    </Suspense>
  );
}
