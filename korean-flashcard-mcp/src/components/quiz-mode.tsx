'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, XCircle, RotateCw, Volume2, HelpCircle } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import confetti from 'canvas-confetti';

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

  const currentCard = cards[currentIndex];

  const options = useState(() => {
    return shuffleArray([
      currentCard.vietnamese,
      ...cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.vietnamese)
        .slice(0, 3)
    ]);
  })[0];

  function shuffleArray(arr: any[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(option);
    setIsSubmitted(true);

    if (option === currentCard.vietnamese) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isCompleted) {
    const percentage = Math.round((score / cards.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-xl mx-auto text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Kết Quả Bài Trắc Nghiệm 🇰🇷
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Bộ từ vựng: {deckTitle}</p>

        <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-1">
          <div className="text-4xl font-black text-slate-900 dark:text-white">
            {score} / {cards.length}
          </div>
          <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400">
            Tỷ lệ chính xác: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{percentage}%</span>
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setIsCompleted(false);
          }}
          className="px-6 py-2.5 text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" /> Thử Lại Bài Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-[13px] text-slate-600 dark:text-slate-400 font-bold">
        <span>Bài Trắc Nghiệm Từ Vựng</span>
        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
          Câu {currentIndex + 1} / {cards.length} | Điểm: {score}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-md">
        <div className="flex justify-center items-center gap-3">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentCard.korean}
          </h2>
          <button
            onClick={() => speakKorean(currentCard.korean)}
            className="ios-glass-circle"
          >
            <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold font-mono">
          [{currentCard.pronunciation}]
        </p>

        <p className="text-[13px] text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-rose-500" /> Chọn nghĩa tiếng Việt đúng nhất bên dưới:
        </p>

        <div className="grid grid-cols-1 gap-2.5 text-left">
          {options.map((option, idx) => {
            const isCorrect = option === currentCard.vietnamese;
            const isSelected = selectedAnswer === option;

            let btnStyle =
              'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 font-bold';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(option)}
                className={`w-full p-3.5 rounded-2xl transition flex items-center justify-between text-[14px] font-semibold ${btnStyle}`}
              >
                <span>{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
            <button
              onClick={handleNext}
              className="w-full py-3 text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-sm transition-colors"
            >
              Câu Tiếp Theo →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
