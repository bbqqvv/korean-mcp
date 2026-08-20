'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  RotateCw,
  Star,
  Award,
  Sparkles,
  Bot
} from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { HintDiscreteTabs } from '@/components/hint-discrete-tabs';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import confetti from 'canvas-confetti';

interface FlashcardViewProps {
  cards: Flashcard[];
  deckTitle: string;
  onFinish?: () => void;
}

export default function FlashcardView({ cards, deckTitle, onFinish }: FlashcardViewProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [trackProgress, setTrackProgress] = useState(true);
  const [starred, setStarred] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const total = cards.length;
  const currentCard = cards[index];

  const go = useCallback(
    (delta: number) => {
      if (flipped) {
        setFlipped(false);
        setTimeout(() => {
          setIndex((i) => {
            const n = i + delta;
            if (n < 0) return total - 1;
            if (n >= total) return 0;
            return n;
          });
        }, 220);
      } else {
        setIndex((i) => {
          const n = i + delta;
          if (n < 0) return total - 1;
          if (n >= total) return 0;
          return n;
        });
      }
    },
    [flipped, total]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        go(1);
      } else if (e.code === 'ArrowLeft') {
        go(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [go]);

  const speakKorean = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRate = (rating: 'easy' | 'medium' | 'hard', e: React.MouseEvent) => {
    e.stopPropagation();
    setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));

    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (index < total - 1) {
          setIndex((i) => i + 1);
        } else {
          setIsCompleted(true);
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
          if (onFinish) onFinish();
        }
      }, 220);
    } else {
      if (index < total - 1) {
        setIndex((i) => i + 1);
      } else {
        setIsCompleted(true);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        if (onFinish) onFinish();
      }
    }
  };

  if (!currentCard || isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200/80 rounded-2xl max-w-xl mx-auto text-center shadow-xs">
        <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Award className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          Chúc Mừng Bạn Đã Hoàn Thành! 🇰🇷
        </h3>
        <p className="text-slate-600 text-xs mb-6">
          Bạn đã lật xong tất cả <span className="font-bold text-slate-900">{total} thẻ</span> trong bộ &quot;{deckTitle}&quot;.
        </p>

        <div className="grid grid-cols-3 gap-3 w-full mb-6 text-center">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs text-slate-500 block font-medium">Đã thuộc</span>
            <span className="text-lg font-black text-emerald-600">{stats.easy}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs text-slate-500 block font-medium">Cần ôn</span>
            <span className="text-lg font-black text-amber-600">{stats.medium}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs text-slate-500 block font-medium">Chưa nhớ</span>
            <span className="text-lg font-black text-rose-600">{stats.hard}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIndex(0);
            setFlipped(false);
            setIsCompleted(false);
          }}
          className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-xs flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4 text-indigo-400" /> Học Lại Bộ Này
        </button>
      </div>
    );
  }

  const hintText = currentCard.exampleKr
    ? `Ví dụ câu: "${currentCard.exampleKr}" ${currentCard.exampleVi ? `👉 ${currentCard.exampleVi}` : ''}`
    : currentCard.hanja
      ? `Từ Hán Hàn: ${currentCard.hanja}`
      : undefined;

  return (
    <div className="w-full max-w-[min(100%,34rem)] mx-auto space-y-3 sm:space-y-4">
      {/* Hint Discrete Tabs + Smart AI Tutor Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:px-1">
        <HintDiscreteTabs key={currentCard.id} hint={hintText} />
        <div className="flex shrink-0 justify-end gap-2 sm:pt-0.5">
          {/* Smart AI Tutor Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAIOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full flex items-center gap-1.5 shadow-2xs"
            title="Gia sư AI giải thích từ vựng"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hỏi AI</span>
          </button>

          <button
            type="button"
            onClick={(e) => speakKorean(currentCard.korean, e)}
            className="ios-glass-circle"
            title="Nghe phát âm tiếng Hàn"
          >
            <Volume2 strokeWidth={1.75} className="size-[18px] text-slate-600" />
          </button>

          <button
            type="button"
            onClick={() => setStarred((s) => !s)}
            className="ios-glass-circle"
            title={starred ? 'Bỏ đánh dấu' : 'Đánh dấu sao'}
          >
            <Star
              strokeWidth={1.75}
              className={`size-[18px] ${starred ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
            />
          </button>
        </div>
      </div>

      {/* 3D Flashcard Scene */}
      <div className="flashcard-scene w-full">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          className="ios-card-pressable group relative w-full cursor-pointer focus:outline-none"
        >
          <div
            className="flashcard-flipper relative aspect-[3/2] w-full max-sm:aspect-auto max-sm:min-h-[min(52svh,22rem)] max-sm:max-h-[min(70svh,28rem)]"
            data-flipped={flipped ? 'true' : 'false'}
          >
            {/* FRONT */}
            <div className="flashcard-face ios-flashcard-face absolute inset-0 flex w-full flex-col items-start justify-between p-6 sm:p-8 text-left bg-white border border-slate-200/80 shadow-xs rounded-3xl shadow-xs">
              <div className="flex justify-between items-center w-full">
                <span className="text-[11px] font-bold tracking-wider text-rose-600 uppercase">
                  TIẾNG HÀN (MẶT TRƯỚC)
                </span>
                <span className="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-full border border-slate-200/60 truncate max-w-[150px]">
                  {deckTitle}
                </span>
              </div>

              <div className="my-auto w-full text-center space-y-2">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {currentCard.korean}
                </h2>
                {currentCard.pronunciation && (
                  <p className="text-slate-500 font-semibold font-mono text-sm tracking-widest">
                    [{currentCard.pronunciation}]
                  </p>
                )}
              </div>

              <div className="w-full flex justify-between items-center text-xs text-slate-400">
                <span>Chạm thẻ hoặc bấm [Space] để xem nghĩa</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAIOpen(true);
                  }}
                  className="text-slate-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3 text-rose-500" /> Hỏi AI từ này
                </button>
              </div>
            </div>

            {/* BACK */}
            <div className="flashcard-face flashcard-face--back ios-flashcard-face--back absolute inset-0 flex w-full flex-col items-start justify-between p-6 sm:p-8 text-left bg-slate-50 border border-slate-200/80 shadow-xs rounded-3xl shadow-xs">
              <div className="flex justify-between items-center w-full">
                <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                  NGHĨA TIẾNG VIỆT (MẶT SAU)
                </span>
                {currentCard.hanja && (
                  <span className="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold border border-slate-200/60 rounded-md">
                    Hán Hàn: {currentCard.hanja}
                  </span>
                )}
              </div>

              <div className="my-auto w-full space-y-3">
                <h3 className="text-3xl font-black text-slate-900">
                  {currentCard.vietnamese}
                </h3>
                {currentCard.exampleKr && (
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-xs space-y-1 shadow-2xs">
                    <p className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{currentCard.exampleKr}</span>
                      <button
                        onClick={(e) => speakKorean(currentCard.exampleKr!, e)}
                        className="p-1 text-slate-400 hover:text-slate-900"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </p>
                    {currentCard.exampleVi && (
                      <p className="text-slate-500 italic">👉 {currentCard.exampleVi}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Refined Rating action buttons */}
              <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleRate('hard', e)}
                  className="py-2 px-2 bg-white text-slate-700 rounded-xl text-xs font-bold text-center border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  Chưa nhớ
                </button>
                <button
                  onClick={(e) => handleRate('medium', e)}
                  className="py-2 px-2 bg-white text-slate-700 rounded-xl text-xs font-bold text-center border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  Đang nhớ
                </button>
                <button
                  onClick={(e) => handleRate('easy', e)}
                  className="py-2 px-2 bg-slate-900 text-white rounded-xl text-xs font-bold text-center hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  Đã thuộc ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="shrink-0 pt-0.5">
        <div className="ios-toolbar flex flex-col gap-2.5 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3 bg-white border border-slate-200/80 shadow-xs">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 select-none">
            <span>Theo dõi tiến độ</span>
            <button
              type="button"
              role="switch"
              aria-checked={trackProgress}
              data-on={trackProgress ? 'true' : 'false'}
              onClick={() => setTrackProgress((t) => !t)}
              className="ios-switch-track"
            >
              <span className="ios-switch-thumb" />
            </button>
          </label>

          <div className="ios-pager-pill justify-center sm:mx-auto bg-slate-50 border border-slate-200/80">
            <button
              type="button"
              onClick={() => go(-1)}
              className="ios-pager-btn"
              aria-label="Previous card"
            >
              <ChevronLeft strokeWidth={2} className="size-[21px]" />
            </button>
            <span className="ios-counter min-w-[4.5rem] text-center text-xs sm:text-sm font-bold tabular-nums text-slate-900">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="ios-pager-btn"
              aria-label="Next card"
            >
              <ChevronRight strokeWidth={2} className="size-[21px]" />
            </button>
          </div>

          <div className="flex justify-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={(e) => speakKorean(currentCard.korean, e)}
              className="ios-glass-circle"
              title="Phát âm"
            >
              <Volume2 strokeWidth={1.8} className="size-[19px] text-slate-700" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="ios-glass-circle"
              title="Chuyển tiếp"
            >
              <Play strokeWidth={1.8} className="size-[19px] text-slate-900 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Tutor Drawer Modal */}
      <AITutorDrawer card={currentCard} isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
