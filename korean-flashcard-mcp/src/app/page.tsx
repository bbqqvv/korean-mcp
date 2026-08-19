'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import { Deck } from '@/lib/types';
import {
  Layers,
  Play,
  ChevronDown,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get('category');

  const [decks, setDecks] = useState<Deck[]>([]);
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

  // Recommended deck for today
  const recommendedDeck = decks.length > 0 ? decks[0] : null;

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

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
          {/* Welcome & Progress Overview Banner */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-extrabold tracking-wide uppercase">
                  안녕하세요! 🇰🇷 LynKore Learning Hub
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bắt Đầu Bài Học Tiếng Hàn Hôm Nay
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Hệ thống Flashcard thông minh giúp ghi nhớ từ vựng tiếng Hàn nhanh chóng, tích hợp phát âm chuẩn và kết nối tự động qua Gemini MCP.
              </p>
            </div>

            {/* Clean Stats Bar (No multicolored pastel boxes) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
              <div className="p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> Chuỗi Học
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900">5 Ngày liên tiếp</div>
              </div>

              <div className="p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Từ Đã Thuộc
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900">32 / 100 từ</div>
              </div>

              <div className="p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Bộ Từ Vựng
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900">{decks.length} Bộ bài</div>
              </div>

              <div className="p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-rose-600" /> Thẻ Từ Vựng
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900">{totalCardsCount} Thẻ</div>
              </div>
            </div>
          </div>

          {/* RECOMMENDED DECK OF THE DAY */}
          {recommendedDeck && (
            <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Bài Học Gợi Ý Hôm Nay
                  </span>
                </div>
                <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full">
                  {recommendedDeck.category}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {recommendedDeck.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {recommendedDeck.description}
                  </p>
                  <div className="text-xs text-slate-500 pt-1 font-medium">
                    📚 Quy mô: <strong className="text-slate-900">{recommendedDeck.cards.length} thẻ từ vựng</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href={`/deck/${recommendedDeck.id}`}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-xs flex items-center gap-2 transition-all"
                  >
                    <span>Bắt Đầu Học Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/quiz?deck=${recommendedDeck.id}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-full flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                    <span>Ôn Quiz</span>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* DECK LIBRARY GRID */}
          <section className="space-y-4 pt-2">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {activeCategory === 'Tất cả' ? 'Thư Viện Bài Học Tiếng Hàn' : `Danh Mục: ${activeCategory}`}
                </h3>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                  {filteredDecks.length} bộ bài
                </span>
              </div>
            </div>

            {/* Grid of Decks */}
            {displayedDecks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDecks.map((deck) => (
                  <div
                    key={deck.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-bold rounded-full border border-rose-200/60">
                          {deck.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {deck.cards.length} thẻ từ
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 line-clamp-1">
                        {deck.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {deck.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/deck/${deck.id}`}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full text-center transition-colors shadow-2xs"
                      >
                        Bắt Đầu Học →
                      </Link>

                      <Link
                        href={`/quiz?deck=${deck.id}`}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-full flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current text-blue-600" /> Ôn Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  Không tìm thấy bộ từ vựng nào
                </p>
                <p>Thử chọn lại danh mục &quot;Tất cả&quot; hoặc tìm từ khóa khác trên thanh tìm kiếm</p>
              </div>
            )}

            {/* Load More Button */}
            {filteredDecks.length > visibleLimit && (
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 9)}
                  className="px-5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-full shadow-2xs flex items-center gap-1.5 hover:bg-slate-50"
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
          router.push(`/deck/${newDeck.id}`);
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
