'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/sidebar';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import { Search, Volume2, Sparkles, BookOpen, Clock, Tag } from 'lucide-react';
import { Flashcard } from '@/lib/types';

// Pre-populated rich Korean-Vietnamese Dictionary Dataset
const DICTIONARY_DATABASE: Array<{
  korean: string;
  hanja?: string;
  vietnamese: string;
  type: string;
  level: string;
  pronunciation: string;
  exampleKr: string;
  exampleVi: string;
}> = [
  {
    korean: '안녕하세요',
    hanja: '',
    vietnamese: 'Xin chào',
    type: 'Cụm từ giao tiếp',
    level: 'Sơ cấp 1',
    pronunciation: '[an-nyeong-ha-se-yo]',
    exampleKr: '안녕하세요! 만나서 반갑습니다.',
    exampleVi: 'Xin chào! Rất vui được gặp bạn.'
  },
  {
    korean: '감사합니다',
    hanja: '感謝--',
    vietnamese: 'Cảm ơn, xin cảm ơn',
    type: 'Động từ / Kính ngữ',
    level: 'Sơ cấp 1',
    pronunciation: '[gam-sa-ham-ni-da]',
    exampleKr: '도와주셔서 thật 감사 드립니다.',
    exampleVi: 'Thật sự cảm ơn vì bạn đã giúp đỡ.'
  },
  {
    korean: '시간',
    hanja: '時間',
    vietnamese: 'Thời gian, giờ',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[si-gan]',
    exampleKr: '지금 몇 시예요? 시간이 있어요?',
    exampleVi: 'Bây giờ là mấy giờ? Bạn có thời gian không?'
  },
  {
    korean: '행복',
    hanja: '幸福',
    vietnamese: 'Hạnh phúc',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[haeng-bok]',
    exampleKr: '우리 가족의 행복이 가장 중요합니다.',
    exampleVi: 'Hạnh phúc của gia đình tôi là quan trọng nhất.'
  },
  {
    korean: '학교',
    hanja: '學校',
    vietnamese: 'Trường học',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[hak-gyo]',
    exampleKr: '아침에 학교에 갑니다.',
    exampleVi: 'Tôi đến trường vào buổi sáng.'
  },
  {
    korean: '공부하다',
    hanja: '工夫--',
    vietnamese: 'Học tập, nghiên cứu',
    type: 'Động từ',
    level: 'Sơ cấp 1',
    pronunciation: '[gong-bu-ha-da]',
    exampleKr: '도서관에서 한국어를 공부합니다.',
    exampleVi: 'Tôi học tiếng Hàn ở thư viện.'
  },
  {
    korean: '친구',
    hanja: '親舊',
    vietnamese: 'Bạn bè, bạn',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[chin-gu]',
    exampleKr: '주말에 친구를 만났어요.',
    exampleVi: 'Cuối tuần tôi đã gặp bạn bè.'
  },
  {
    korean: '음식',
    hanja: '飮食',
    vietnamese: 'Thức ăn, món ăn',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[eum-sik]',
    exampleKr: '한국 음식은 맛있고 매워요.',
    exampleVi: 'Món ăn Hàn Quốc ngon và cay.'
  },
  {
    korean: '사랑',
    hanja: '',
    vietnamese: 'Tình yêu, sự yêu thương',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[sa-rang]',
    exampleKr: '부모님의 사랑은 무한합니다.',
    exampleVi: 'Tình yêu của cha mẹ là vô tận.'
  },
  {
    korean: '희망',
    hanja: '希望',
    vietnamese: 'Hy vọng',
    type: 'Danh từ',
    level: 'Trung cấp 1',
    pronunciation: '[hui-mang]',
    exampleKr: '어려운 상황에서도 희망을 잃지 마세요.',
    exampleVi: 'Dù trong hoàn cảnh khó khăn cũng đừng mất hy vọng.'
  }
];

export default function DictionaryPage() {
  const { themeConfig } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Xin chào', '시간', '행복', '감사합니다']);
  const [selectedWord, setSelectedWord] = useState<Flashcard | null>(null);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return DICTIONARY_DATABASE;
    const q = searchQuery.toLowerCase().trim();
    return DICTIONARY_DATABASE.filter(
      (item) =>
        item.korean.toLowerCase().includes(q) ||
        item.vietnamese.toLowerCase().includes(q) ||
        (item.hanja && item.hanja.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
  };

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Header Title Section */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tra từ điển
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              Tra nghĩa tiếng Việt của từ tiếng Hàn: phát âm, từ loại, gốc Hán và cấp độ từ vựng.
            </p>
          </div>

          {/* Search Box Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tra tiếng Hàn hoặc tiếng Việt... (vd: 시간, thời gian)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-900 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className={`px-6 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs sm:text-sm rounded-2xl border-2 border-slate-900 shadow-xs transition-all shrink-0`}
              >
                Tra từ
              </button>
            </div>

            {/* Recent Searches */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Tra gần đây:
              </span>
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-white border border-slate-900 rounded-xl text-slate-800 font-bold text-[11px] shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              Dữ liệu từ Từ điển tiếng Hàn dành cho người học — Viện Quốc ngữ Hàn Quốc &amp; AI MCP.
            </p>
          </form>

          {/* Results List Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Kết Quả Tra Cứu ({filteredResults.length} từ)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          {item.korean}
                        </span>
                        {item.hanja && (
                          <span className="text-xs font-semibold text-slate-400">
                            ({item.hanja})
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => speakKorean(item.korean)}
                        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-full transition-colors"
                        title="Phát âm tiếng Hàn"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-full">
                        {item.type}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full">
                        {item.level}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.pronunciation}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <p className="text-sm sm:text-base font-extrabold text-slate-900">
                        {item.vietnamese}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        🇰🇷 {item.exampleKr}
                        <br />
                        🇻🇳 <span className="text-slate-500 font-sans">{item.exampleVi}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setSelectedWord({
                          id: `dict-${index}`,
                          korean: item.korean,
                          vietnamese: item.vietnamese,
                          pronunciation: item.pronunciation,
                          exampleKr: item.exampleKr,
                          exampleVi: item.exampleVi
                        })
                      }
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Hỏi Groq AI Giải Thích Chi Tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* AI Tutor Drawer */}
      {selectedWord && (
        <AITutorDrawer
          card={selectedWord}
          isOpen={!!selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}

      {/* Create Deck Modal */}
      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
