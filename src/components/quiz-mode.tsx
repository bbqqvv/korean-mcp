'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, XCircle, RotateCw, Volume2, HelpCircle, ArrowRight, Home } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface QuizModeProps {
  cards: Flashcard[];
  deckTitle: string;
}

export default function QuizMode({ cards, deckTitle }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const total = cards.length;
  const currentCard = cards[currentIndex];

  function shuffleArray<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const options = useMemo(() => {
    if (!currentCard) return [];
    const wrongChoices = cards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.vietnamese);
    const shuffledWrong = shuffleArray(wrongChoices).slice(0, 3);
    return shuffleArray([currentCard.vietnamese, ...shuffledWrong]);
  }, [currentIndex, currentCard, cards]);

  const handleSelect = useCallback(
    (option: string) => {
      if (isSubmitted) return;
      setSelectedAnswer(option);
      setIsSubmitted(true);

      if (currentCard && option === currentCard.vietnamese) {
        setScore((prev) => prev + 1);
      }
    },
    [isSubmitted, currentCard]
  );

  const handleNext = useCallback(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    }
  }, [currentIndex, cards.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      if (!isSubmitted) {
        if (['1', 'Numpad1', 'KeyA'].includes(e.code) && options[0]) {
          handleSelect(options[0]);
        } else if (['2', 'Numpad2', 'KeyB'].includes(e.code) && options[1]) {
          handleSelect(options[1]);
        } else if (['3', 'Numpad3', 'KeyC'].includes(e.code) && options[2]) {
          handleSelect(options[2]);
        } else if (['4', 'Numpad4', 'KeyD'].includes(e.code) && options[3]) {
          handleSelect(options[3]);
        }
      } else {
        if (['Enter', 'Space'].includes(e.code)) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, isCompleted, options, handleSelect, handleNext]);

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isCompleted || !currentCard) {
    const percentage = Math.round((score / total) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/80 rounded-2xl max-w-lg mx-auto text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xs">
          <Award className="w-7 h-7 text-indigo-400" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            Hoàn Thành Bài Trắc Nghiệm! 🇰🇷
          </h3>
          <p className="text-slate-500 text-xs font-medium">Bộ từ vựng: {deckTitle}</p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
          <div className="text-3xl font-black text-slate-900">
            {score} / {total}
          </div>
          <p className="text-xs font-bold text-slate-600">
            Tỷ lệ chính xác: <span className="text-emerald-600 font-extrabold text-xs sm:text-sm">{percentage}%</span>
          </p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsSubmitted(false);
              setSelectedAnswer(null);
              setIsCompleted(false);
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" /> Thử Lại Quiz
          </button>

          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-600" />
            <span>Trang Chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-lg mx-auto space-y-3 font-sans">
      {/* Compact Question Card (Zero Scroll Fit) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-center space-y-4 shadow-xs">
        {/* Korean Word Question */}
        <div className="flex justify-center items-center gap-2.5">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {currentCard.korean}
          </h2>
          <button
            onClick={() => speakKorean(currentCard.korean)}
            className="ios-glass-circle !w-7 !h-7 text-xs"
            title="Nghe phát âm"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>

        {currentCard.pronunciation && (
          <p className="text-xs text-slate-500 font-semibold font-mono tracking-widest -mt-2">
            [{currentCard.pronunciation}]
          </p>
        )}

        <p className="text-xs text-slate-600 font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-rose-600" /> Chọn nghĩa tiếng Việt đúng nhất bên dưới:
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(Phím 1, 2, 3, 4)</span>
        </p>

        {/* Option Cards Grid with Shortcuts 1, 2, 3, 4 */}
        <div className="grid grid-cols-1 gap-2 text-left">
          {options.map((option, idx) => {
            const isCorrect = option === currentCard.vietnamese;
            const isSelected = selectedAnswer === option;
            const label = optionLabels[idx] || `${idx + 1}`;

            let cardStyle =
              'bg-slate-50 border-slate-200/80 text-slate-900 hover:bg-slate-100 hover:border-slate-300';
            let badgeStyle = 'bg-white text-slate-700 border-slate-200';

            if (isSubmitted) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-400/30';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected) {
                cardStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold ring-1 ring-rose-400/30';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                cardStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(option)}
                className={`w-full py-2.5 px-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-semibold shadow-2xs ${cardStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs ${badgeStyle}`}
                  >
                    {label}
                  </span>
                  <span className="truncate max-w-[280px] sm:max-w-xs">{option}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[{idx + 1}]</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Question Button */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2.5 pt-1"
            >
              {/* Interactive Explanation Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-left space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Đáp án đúng: &quot;{currentCard.vietnamese}&quot;</span>
                  {currentCard.hanja && (
                    <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 font-bold border border-rose-200/60 rounded">
                      Hán Hàn: {currentCard.hanja}
                    </span>
                  )}
                </div>
                {currentCard.exampleKr && (
                  <p className="text-slate-600 text-[11px] pt-0.5">
                    💡 Ví dụ: <strong className="text-slate-900">&quot;{currentCard.exampleKr}&quot;</strong> {currentCard.exampleVi ? `👉 ${currentCard.exampleVi}` : ''}
                  </p>
                )}
              </div>

              {/* Next Question CTA */}
              <button
                onClick={handleNext}
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{currentIndex < total - 1 ? 'Câu Tiếp Theo (Enter ↵)' : 'Xem Kết Quả Quiz'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
