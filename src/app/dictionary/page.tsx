'use client';

import { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import { Search, Volume2, Sparkles, BookOpen, Clock, Tag, Loader2, Bot } from 'lucide-react';
import { normalizeKoreanQuery } from '@/lib/korean-normalizer';
import { Flashcard } from '@/lib/types';

// Pre-populated rich Korean-Vietnamese Dictionary Dataset
const DICTIONARY_DATABASE: Array<{
  korean: string;
  lemma?: string;
  origin?: 'native_korean' | 'sino_korean' | 'loanword';
  hanja?: string;
  hanjaExplanation?: string;
  hanjaFamily?: Array<{ korean: string; vietnamese: string }>;
  relatedWords?: Array<{ korean: string; vietnamese: string }>;
  vietnamese: string;
  type: string;
  level: string;
  pronunciation: string;
  exampleKr: string;
  exampleVi: string;
}> = [
  {
    korean: '몰라요',
    lemma: '모르다',
    origin: 'native_korean',
    vietnamese: 'Tôi không biết',
    type: 'Động từ (dạng chia)',
    level: 'Sơ cấp 1',
    pronunciation: '[mol-la-yo]',
    relatedWords: [
      { korean: '알다', vietnamese: 'Biết' },
      { korean: '알지 못하다', vietnamese: 'Không biết' },
      { korean: '이해하다', vietnamese: 'Hiểu' }
    ],
    exampleKr: '그 영화 제목이 뭐예요? 몰라요.',
    exampleVi: 'Tiêu đề phim đó là gì? Tôi không biết.'
  },
  {
    korean: '모르다',
    lemma: '모르다',
    origin: 'native_korean',
    vietnamese: 'Không biết',
    type: 'Động từ',
    level: 'Sơ cấp 1',
    pronunciation: '[mo-reu-da]',
    relatedWords: [
      { korean: '알다', vietnamese: 'Biết' },
      { korean: '알지 못하다', vietnamese: 'Không biết' }
    ],
    exampleKr: '저는 그 사실을 몰라요.',
    exampleVi: 'Tôi không biết sự thật đó.'
  },
  {
    korean: '우주선',
    hanja: '宇宙船',
    origin: 'sino_korean',
    hanjaExplanation: '宇宙 (Vũ trụ) + 船 (Thuyền/Tàu) = Tàu vũ trụ',
    hanjaFamily: [
      { korean: '우주', vietnamese: 'Vũ trụ' },
      { korean: '우주비행사', vietnamese: 'Phi hành gia' }
    ],
    vietnamese: 'Tàu vũ trụ / Tàu không gian',
    type: 'Danh từ',
    level: 'Trung cấp',
    pronunciation: '[u-ju-seon]',
    exampleKr: '우주선이 성공적으로 지구 궤도에 진입했습니다.',
    exampleVi: 'Tàu vũ trụ đã thành công đi vào quỹ đạo Trái Đất.'
  },
  {
    korean: '비행기',
    hanja: '飛行機',
    hanjaExplanation: '飛行 (Phi hành / Bay) + 機 (Cơ / Máy) = Máy bay',
    vietnamese: 'Máy bay',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[bi-haeng-gi]',
    exampleKr: '저는 내일 비행기를 타고 부산에 갑니다.',
    exampleVi: 'Ngày mai tôi đi Busan bằng máy bay.'
  },
  {
    korean: '항공기',
    hanja: '航空機',
    hanjaExplanation: '航空 (Hàng không) + 機 (Cơ / Máy) = Tàu bay',
    vietnamese: 'Tàu bay / Máy bay (chính thức/chuyên ngành)',
    type: 'Danh từ',
    level: 'Trung cấp',
    pronunciation: '[hang-gong-gi]',
    exampleKr: '이 항공기는 매우 안전하고 빠릅니다.',
    exampleVi: 'Tàu bay này rất an toàn và nhanh chóng.'
  },
  {
    korean: '차',
    hanja: '車',
    vietnamese: 'Xe / Ô tô',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[cha]',
    exampleKr: '새 차를 샀어요.',
    exampleVi: 'Tôi đã mua một chiếc xe mới.'
  },
  {
    korean: '차량',
    hanja: '車輛',
    vietnamese: 'Phương tiện / Xe cộ (chính thức/chuyên ngành)',
    type: 'Danh từ',
    level: 'Trung cấp',
    pronunciation: '[cha-ryang]',
    exampleKr: '이 도로에는 차량 통행이 금지되어 있습니다.',
    exampleVi: 'Tuyến đường này cấm các phương tiện xe cộ qua lại.'
  },
  {
    korean: '집',
    hanja: '',
    vietnamese: 'Nhà',
    type: 'Danh từ',
    level: 'Sơ cấp 1',
    pronunciation: '[jip]',
    exampleKr: '오늘 집에서 쉬어요.',
    exampleVi: 'Hôm nay tôi nghỉ ngơi ở nhà.'
  },
  {
    korean: '댁',
    hanja: '宅',
    vietnamese: 'Nhà (kính ngữ)',
    type: 'Danh từ / Kính ngữ',
    level: 'Sơ cấp 2',
    pronunciation: '[daek]',
    exampleKr: '선생님 댁에 방문했습니다.',
    exampleVi: 'Tôi đã đến thăm nhà thầy giáo.'
  },
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
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['tạm biệt', 'Xin chào', '시간', '행복', '감사합니다']);
  const [selectedWord, setSelectedWord] = useState<Flashcard | null>(null);

  // AI Dynamic Dictionary Search State
  const [normalizationHint, setNormalizationHint] = useState<string | null>(null);
  const [searchedResults, setSearchedResults] = useState<Array<{
    korean: string;
    lemma?: string;
    origin?: 'native_korean' | 'sino_korean' | 'loanword';
    hanja?: string;
    hanjaExplanation?: string;
    hanjaFamily?: Array<{ korean: string; vietnamese: string }>;
    relatedWords?: Array<{ korean: string; vietnamese: string }>;
    vietnamese: string;
    type: string;
    level: string;
    pronunciation: string;
    exampleKr: string;
    exampleVi: string;
    confidence?: number;
  }>>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const performSearch = async (queryText: string) => {
    const rawQ = queryText.trim();
    if (!rawQ) return;

    // Layer 1: Korean Lemmatizer & Normalizer
    const norm = normalizeKoreanQuery(rawQ);
    const q = norm.normalized;
    setSubmittedQuery(rawQ);
    setNormalizationHint(norm.isConjugated ? norm.explanation || null : null);

    // Save to recent searches
    if (!recentSearches.includes(rawQ)) {
      setRecentSearches((prev) => [rawQ, ...prev.slice(0, 4)]);
    }

    // 1. Check local pre-populated dictionary first
    const localMatches = DICTIONARY_DATABASE.filter(
      (item) =>
        item.korean.toLowerCase().includes(q.toLowerCase()) ||
        item.korean.toLowerCase().includes(rawQ.toLowerCase()) ||
        item.vietnamese.toLowerCase().includes(q.toLowerCase()) ||
        (item.hanja && item.hanja.toLowerCase().includes(q.toLowerCase()))
    );

    if (localMatches.length > 0) {
      setSearchedResults(localMatches);
      return;
    }

    // 2. If not found in local database, fetch from AI dictionary API
    setIsSearchingAI(true);
    setSearchedResults([]);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dict_lookup',
          word: q
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        let rawText = data.reply;
        // Strip thinking blocks <think>...</think> if present
        rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
          const parsed = JSON.parse(rawText);
          const list = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.results)
            ? parsed.results
            : Array.isArray(parsed?.words)
            ? parsed.words
            : [];

          if (list.length > 0) {
            setSearchedResults(list);
          }
        } catch (parseErr) {
          const matchObj = rawText.match(/\{[\s\S]*\}/);
          const matchArr = rawText.match(/\[[\s\S]*\]/);
          if (matchObj) {
            try {
              const pObj = JSON.parse(matchObj[0]);
              const list = Array.isArray(pObj?.results) ? pObj.results : [];
              if (list.length > 0) setSearchedResults(list);
            } catch {}
          } else if (matchArr) {
            try {
              const pArr = JSON.parse(matchArr[0]);
              if (Array.isArray(pArr) && pArr.length > 0) setSearchedResults(pArr);
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error('AI Dictionary lookup error:', err);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
    performSearch(term);
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
                  placeholder="Tra tiếng Hàn hoặc tiếng Việt... (vd: tạm biệt, 시간, thời gian)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 shadow-xs rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSearchingAI}
                className={`px-6 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-200/80 shadow-xs shadow-xs transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50`}
              >
                {isSearchingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Tra Từ...</span>
                  </>
                ) : (
                  <span>Tra từ</span>
                )}
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
                  onClick={() => handleRecentClick(term)}
                  className="px-3 py-1 bg-white border border-slate-900 rounded-xl text-slate-800 font-bold text-[11px] shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              Dữ liệu từ Viện Quốc ngữ Hàn Quốc &amp; Từ điển Hàn-Việt Chuyên Sâu.
            </p>
          </form>

          {/* Results List Grid */}
          <div className="space-y-4 pt-2">
            {normalizationHint && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-blue-900 shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 animate-bounce" />
                <span>{normalizationHint}</span>
              </div>
            )}

            {submittedQuery.trim() && !isSearchingAI && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Kết Quả Tra Cứu cho &quot;{submittedQuery}&quot; ({searchedResults.length} từ)
                </span>
              </div>
            )}

            {!submittedQuery.trim() && !isSearchingAI && (
              <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-10 text-center space-y-3 shadow-xs my-4">
                <BookOpen className="w-10 h-10 text-blue-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">
                  Nhập từ vựng và bấm Tra từ
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Hỗ trợ tra từ bằng Tiếng Hàn hoặc Tiếng Việt. Nhập từ cần tra ở ô trên và bấm nút &quot;Tra từ&quot; hoặc phím Enter để xem kết quả.
                </p>
              </div>
            )}

            {isSearchingAI && (
              <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-8 text-center space-y-3 shadow-xs">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-900">
                  Đang truy vấn từ điển cho &quot;{submittedQuery}&quot;...
                </p>
                <p className="text-xs text-slate-500">
                  Tự động dịch thuật, tìm gốc Hán Hàn, phiên âm và tạo câu ví dụ thực tế.
                </p>
              </div>
            )}

            {!isSearchingAI && searchedResults.length === 0 && submittedQuery.trim() && (
              <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-8 text-center space-y-2 shadow-xs">
                <p className="text-sm font-black text-slate-900">
                  Không tìm thấy kết quả phù hợp cho &quot;{submittedQuery}&quot;
                </p>
                <p className="text-xs text-slate-500">
                  Thử kiểm tra lại chính tả hoặc tìm từ khóa khác trên thanh tìm kiếm.
                </p>
              </div>
            )}

            {!isSearchingAI && searchedResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedResults.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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

                      <div className="flex items-center gap-2 flex-wrap">
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

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <p className="text-sm sm:text-base font-extrabold text-slate-900">
                          {item.vietnamese}
                        </p>

                        {/* Lemma Conjugation Hint for Verbs/Adjectives */}
                        {item.lemma && item.lemma !== item.korean && (
                          <div className="p-2 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-900 text-xs font-semibold flex items-center justify-between">
                            <span><strong>Dạng chia:</strong> {item.lemma} → {item.korean}</span>
                            <span className="text-[11px] font-mono text-blue-700">Nguyên thể: {item.lemma}</span>
                          </div>
                        )}

                        {/* Native Korean vs Sino-Korean Origin Badge */}
                        {item.origin === 'native_korean' || !item.hanja ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-900 text-xs font-semibold">
                            <span><strong>Từ thuần Hàn (고유어)</strong> · Không có Hán tự (Hanja)</span>
                          </div>
                        ) : (
                          item.hanjaExplanation && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs font-semibold">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span><strong>Hán Việt:</strong> {item.hanjaExplanation}</span>
                            </div>
                          )
                        )}

                        {/* Semantic Related Words (For Native Korean or General Words) */}
                        {item.relatedWords && item.relatedWords.length > 0 && (
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-emerald-600" /> Từ liên quan về nghĩa (Synonyms / Antonyms):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.relatedWords.map((rel, rIdx) => (
                                <button
                                  key={rIdx}
                                  type="button"
                                  onClick={() => handleRecentClick(rel.korean)}
                                  className="px-2 py-0.5 bg-white border border-slate-300 hover:border-emerald-500 rounded-lg text-[11px] font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                                  title={`Tra từ ${rel.korean}`}
                                >
                                  {rel.korean} <span className="font-normal text-slate-500">({rel.vietnamese})</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Hanja Family Lexical Network (For Sino-Korean Words) */}
                        {item.hanjaFamily && item.hanjaFamily.length > 0 && item.origin !== 'native_korean' && (
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-blue-600" /> Mạng lưới Họ từ Hán-Hàn (Hanja Network):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.hanjaFamily.map((fam, fIdx) => (
                                <button
                                  key={fIdx}
                                  type="button"
                                  onClick={() => handleRecentClick(fam.korean)}
                                  className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 rounded-lg text-[11px] font-bold text-slate-800 hover:text-blue-600 transition-colors"
                                  title={`Tra từ ${fam.korean}`}
                                >
                                  {fam.korean} <span className="font-normal text-slate-500">({fam.vietnamese})</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

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
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Xem Phân Tích &amp; Ngữ Pháp Chi Tiết →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
