'use client';

import { useState, useEffect, Suspense } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import KoreanTypingTutor from '@/components/korean-typing-tutor';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';

function TypingContent() {
  const [decks, setDecks] = useState<Deck[]>([]);

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
        }
      } catch (err) {
        console.error('Failed to fetch custom decks for typing:', err);
      }
    }
    fetchDecks();
  }, []);

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

        <main className="flex-1 overflow-hidden p-2 sm:p-4 max-w-5xl w-full mx-auto flex flex-col justify-between">
          <KoreanTypingTutor decks={decks} />
        </main>
      </div>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default function TypingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] text-slate-900 p-8">Đang tải...</div>}>
      <TypingContent />
    </Suspense>
  );
}
