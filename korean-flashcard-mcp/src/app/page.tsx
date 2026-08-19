'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import FlashcardView from '@/components/flashcard-view';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';
import { Layers, Play, ChevronDown, Sparkles, BookOpen, Flame, Award } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleLimit, setVisibleLimit] = useState<number>(9);
  const [isLoading, setIsLoading] = useState(true);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      if (data.success) {
        setDecks(data.decks);
        if (!selectedDeck && data.decks.length > 0) {
          setSelectedDeck(data.decks[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch decks', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    if (catParam) {
      setActiveCategory(catParam);
    }
  }, [catParam]);

  const handleSelectDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriesList = [
    'Tất cả',
    ...Array.from(new Set(decks.map((d) => d.category).filter(Boolean)))
  ].map((catName) => ({
    name: catName,
    count: catName === 'Tất cả' ? decks.length : decks.filter((d) => d.category === catName).length
  }));

  const filteredDecks = decks.filter((deck) => {
    const matchesCategory = activeCategory === 'Tất cả' || deck.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedDecks = filteredDecks.slice(0, visibleLimit);
  const totalCardsCount = decks.reduce((acc, d) => acc + d.cards.length, 0);

  return (
    <div className="flex h-screen bg-[#faf9f6] text-slate-900 overflow-hidden font-sans">
      {/* Left Sidebar Command Center */}
      <Sidebar
        categories={categoriesList}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setVisibleLimit(9);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Workspace (Header + Scrollable Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-xs rounded-full border border-rose-200">
                  안녕하세요! 🇰🇷
                </span>
                <span className="text-xs text-slate-500 font-semibold">Chào mừng bạn trở lại LynKore</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Hôm Nay Bạn Muốn Học Tiếng Hàn Về Chủ Đề Gì?
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Bộ Từ Vựng</span>
                <span className="text-base font-black text-blue-600">{decks.length} bộ</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Thẻ Từ Vựng</span>
                <span className="text-base font-black text-rose-600">{totalCardsCount} thẻ</span>
              </div>
            </div>
          </div>

          {/* MAIN FLASHCARD STUDY ARENA */}
          {selectedDeck && (
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div>
                  <span className="text-[11px] sm:text-[12px] text-rose-600 font-extrabold uppercase tracking-wider block">
                    ĐANG HỌC BỘ THẺ:
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedDeck.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={`/quiz?deck=${selectedDeck.id}`}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" /> Ôn Quiz Ngay
                  </Link>
                </div>
              </div>

              {/* Flashcard Component */}
              <FlashcardView key={selectedDeck.id} cards={selectedDeck.cards} deckTitle={selectedDeck.title} />
            </section>
          )}

          {/* DECKS EXPLORER SECTION */}
          <section className="space-y-4 pt-2">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {activeCategory === 'Tất cả' ? 'Danh Sách Tất Cả Bộ Từ Vựng' : `Danh Mục: ${activeCategory}`}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full border border-blue-200">
                    {filteredDecks.length} bộ
                  </span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-slate-500 mt-0.5">
                  Tự động đồng bộ từ Gemini Spark qua MCP Server
                </p>
              </div>
            </div>

            {/* Grid of Decks */}
            {displayedDecks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDecks.map((deck) => {
                  const isSelected = selectedDeck?.id === deck.id;
                  return (
                    <div
                      key={deck.id}
                      onClick={() => handleSelectDeck(deck)}
                      className={`bg-white border rounded-2xl p-5 cursor-pointer flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/30 shadow-md'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-bold rounded-full border border-rose-200">
                            {deck.category}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {deck.title}
                        </h4>

                        <p className="text-[12px] sm:text-[13px] text-slate-600 line-clamp-2">
                          {deck.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-slate-700">
                          📚 {deck.cards.length} thẻ từ vựng
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDeck(deck);
                          }}
                          className="text-blue-600 font-bold text-[12px] hover:underline"
                        >
                          Chạm để học →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  Không tìm thấy bộ từ vựng nào
                </p>
                <p>Thử tìm với từ khóa khác hoặc chuyển danh mục &quot;Tất cả&quot;</p>
              </div>
            )}

            {/* Load More Button */}
            {filteredDecks.length > visibleLimit && (
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 9)}
                  className="px-5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-full shadow-sm flex items-center gap-1.5 hover:bg-slate-50"
                >
                  <span>Xem Thêm Bộ Bài ({filteredDecks.length - visibleLimit} bộ nữa)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* AI Deck Creation Modal */}
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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f6] text-slate-900 p-8">Đang tải LynKore...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
