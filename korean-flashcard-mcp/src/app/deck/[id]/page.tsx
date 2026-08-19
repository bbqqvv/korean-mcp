'use client';

import { useEffect, useState, use } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FlashcardView from '@/components/flashcard-view';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className || 'w-3 h-3'} {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function DeckStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      try {
        const res = await fetch(`/api/decks/${id}`);
        const data = await res.json();
        if (data.success) {
          setDeck(data.deck);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDeck();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Đang tải bộ thẻ từ vựng tiếng Hàn...</p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="space-y-4">
              <h2 className="text-xl font-black">Không Tìm Thấy Bộ Từ Vựng</h2>
              <p className="text-slate-500 text-sm">Bộ từ vựng này không tồn tại hoặc đã bị xóa.</p>
              <Link
                href="/"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Quay Về Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 pb-24 md:pb-8 max-w-5xl w-full mx-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 rounded-full hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" /> Tất Cả Bộ Thẻ
            </Link>

            <Link
              href={`/quiz?deck=${deck.id}`}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full flex items-center gap-1.5 shadow-2xs"
            >
              <Play className="w-4 h-4 fill-current text-indigo-400" /> Ôn Quiz Ngay
            </Link>
          </div>

          {/* Deck Title Header */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full border border-slate-200/60">
                {deck.category}
              </span>
              {deck.youtubeUrl && (
                <span className="flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full font-bold">
                  <YoutubeIcon className="w-3 h-3 text-rose-600" /> YouTube Video
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-slate-900">{deck.title}</h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{deck.description}</p>
          </div>

          {/* Flashcard Component */}
          <FlashcardView cards={deck.cards} deckTitle={deck.title} />
        </main>
      </div>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
