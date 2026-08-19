'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard,
  RotateCw,
  Volume2,
  CheckCircle2,
  Sparkles,
  Trophy,
  Activity,
  Target,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Flashcard, Deck } from '@/lib/types';
import confetti from 'canvas-confetti';

interface KoreanTypingTutorProps {
  decks?: Deck[];
}

// 2-Bolsik QWERTY to Hangul Mapping
const QWERTY_TO_HANGUL: Record<string, string> = {
  q: 'ㅂ', Q: 'ㅃ', w: 'ㅈ', W: 'ㅉ', e: 'ㄷ', E: 'ㄸ', r: 'ㄱ', R: 'ㄲ', t: 'ㅅ', T: 'ㅆ',
  y: 'ㅛ', u: 'ㅕ', i: 'ㅑ', o: 'ㅐ', O: 'ㅒ', p: 'ㅔ', P: 'ㅖ',
  a: 'ㅁ', s: 'ㄴ', d: 'ㅇ', f: 'ㄹ', g: 'ㅎ', h: 'ㅗ', j: 'ㅓ', k: 'ㅏ', l: 'ㅣ',
  z: 'ㅋ', x: 'ㅌ', c: 'ㅊ', v: 'ㅍ', b: 'ㅠ', n: 'ㅜ', m: 'ㅡ'
};

// Inverse Hangul to QWERTY key
const HANGUL_TO_QWERTY: Record<string, string> = {};
Object.entries(QWERTY_TO_HANGUL).forEach(([qwerty, hangul]) => {
  HANGUL_TO_QWERTY[hangul] = qwerty.toLowerCase();
});

// Keyboard Layout Rows
const KEYBOARD_ROWS = [
  [
    { key: 'q', hangul: 'ㅂ', shiftHangul: 'ㅃ' },
    { key: 'w', hangul: 'ㅈ', shiftHangul: 'ㅉ' },
    { key: 'e', hangul: 'ㄷ', shiftHangul: 'ㄸ' },
    { key: 'r', hangul: 'ㄱ', shiftHangul: 'ㄲ' },
    { key: 't', hangul: 'ㅅ', shiftHangul: 'ㅆ' },
    { key: 'y', hangul: 'ㅛ', shiftHangul: '' },
    { key: 'u', hangul: 'ㅕ', shiftHangul: '' },
    { key: 'i', hangul: 'ㅑ', shiftHangul: '' },
    { key: 'o', hangul: 'ㅐ', shiftHangul: 'ㅒ' },
    { key: 'p', hangul: 'ㅔ', shiftHangul: 'ㅖ' }
  ],
  [
    { key: 'a', hangul: 'ㅁ', shiftHangul: '' },
    { key: 's', hangul: 'ㄴ', shiftHangul: '' },
    { key: 'd', hangul: 'ㅇ', shiftHangul: '' },
    { key: 'f', hangul: 'ㄹ', shiftHangul: '' },
    { key: 'g', hangul: 'ㅎ', shiftHangul: '' },
    { key: 'h', hangul: 'ㅗ', shiftHangul: '' },
    { key: 'j', hangul: 'ㅓ', shiftHangul: '' },
    { key: 'k', hangul: 'ㅏ', shiftHangul: '' },
    { key: 'l', hangul: 'ㅣ', shiftHangul: '' }
  ],
  [
    { key: 'z', hangul: 'ㅋ', shiftHangul: '' },
    { key: 'x', hangul: 'ㅌ', shiftHangul: '' },
    { key: 'c', hangul: 'ㅊ', shiftHangul: '' },
    { key: 'v', hangul: 'ㅍ', shiftHangul: '' },
    { key: 'b', hangul: 'ㅠ', shiftHangul: '' },
    { key: 'n', hangul: 'ㅜ', shiftHangul: '' },
    { key: 'm', hangul: 'ㅡ', shiftHangul: '' }
  ]
];

// Basic Jamo Lessons
const JAMO_LESSONS = [
  'ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ',
  'ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ',
  'ㅐ ㅒ ㅔ ㅖ ㅘ ㅙ ㅚ ㅝ ㅞ ㅟ ㅢ',
  'ㄲ ㄸ ㅃ ㅆ ㅉ'
];

// Sentences Lessons
const SENTENCE_LESSONS = [
  '안녕하세요',
  '감사합니다',
  '만나서 반갑습니다',
  '한국어를 공부하고 있어요',
  '오늘 날씨가 정말 좋아요',
  '맛있게 드세요'
];

export default function KoreanTypingTutor({ decks = [] }: KoreanTypingTutorProps) {
  const [practiceMode, setPracticeMode] = useState<'jamo' | 'vocab' | 'sentence'>('jamo');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [targetText, setTargetText] = useState('ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ');

  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyFeedback, setKeyFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Performance Stats
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTypedKeys, setTotalTypedKeys] = useState(0);
  const [correctTypedKeys, setCorrectTypedKeys] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Vocabulary list from decks
  const vocabList = useMemo(() => {
    const allCards: Flashcard[] = decks.flatMap((d) => d.cards);
    if (allCards.length > 0) {
      return allCards.map((c) => c.korean);
    }
    return ['학교', '학생', '선생님', '한국', '친구', '사랑', '음식', '커피'];
  }, [decks]);

  // Update target text when mode or lesson index changes
  useEffect(() => {
    setUserInput('');
    setIsLessonComplete(false);
    setStartTime(null);

    if (practiceMode === 'jamo') {
      setTargetText(JAMO_LESSONS[currentLessonIndex % JAMO_LESSONS.length]);
    } else if (practiceMode === 'sentence') {
      setTargetText(SENTENCE_LESSONS[currentLessonIndex % SENTENCE_LESSONS.length]);
    } else if (practiceMode === 'vocab') {
      setTargetText(vocabList[currentLessonIndex % vocabList.length]);
    }
  }, [practiceMode, currentLessonIndex, vocabList]);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  // Calculate next expected character & QWERTY key
  const nextChar = targetText[userInput.length] || '';
  const nextQwertyKey = HANGUL_TO_QWERTY[nextChar] || (nextChar === ' ' ? 'space' : null);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setTotalTypedKeys((prev) => prev + 1);

    // Check if typed character matches expected character
    const typedChar = val[val.length - 1];
    const expectedChar = targetText[val.length - 1];

    if (typedChar === expectedChar) {
      setCorrectTypedKeys((prev) => prev + 1);
      setKeyFeedback('correct');
    } else {
      setKeyFeedback('wrong');
    }

    setUserInput(val);

    // WPM Calculation
    if (startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const calculatedWpm = Math.round((val.length / 5) / elapsedMinutes);
        setWpm(calculatedWpm);
      }
    }

    // Check completion
    if (val === targetText) {
      setIsLessonComplete(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);
  };

  const handleNextLesson = () => {
    setCurrentLessonIndex((prev) => prev + 1);
  };

  const handleResetLesson = () => {
    setUserInput('');
    setIsLessonComplete(false);
    setStartTime(null);
    inputRef.current?.focus();
  };

  const speakKorean = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const accuracyPercentage = totalTypedKeys > 0 ? Math.round((correctTypedKeys / totalTypedKeys) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      {/* Top Controls & Practice Mode Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-2xs">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none">
              Luyện Gõ Phím Tiếng Hàn 2-Bolsik 🇰🇷
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Gõ phím tiếng Hàn chuẩn xác, cải thiện tốc độ WPM & phản xạ bộ nhớ cơ ngón tay
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/60 w-full sm:w-auto">
          <button
            onClick={() => setPracticeMode('jamo')}
            className={`flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-full transition-all ${
              practiceMode === 'jamo'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phím Cơ Bản
          </button>
          <button
            onClick={() => setPracticeMode('vocab')}
            className={`flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-full transition-all ${
              practiceMode === 'vocab'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Từ Vựng
          </button>
          <button
            onClick={() => setPracticeMode('sentence')}
            className={`flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-full transition-all ${
              practiceMode === 'sentence'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Luyện Câu
          </button>
        </div>
      </div>

      {/* Real-time Stats Header Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> Tốc Độ (WPM)
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900">{wpm}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-600" /> Chính Xác
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900">{accuracyPercentage}%</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Tiến Độ
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {userInput.length} / {targetText.length}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Target Text Box & Hidden Input Arena */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-xs cursor-text relative overflow-hidden"
      >
        <div className="flex justify-center items-center gap-2 text-slate-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bài tập: {practiceMode === 'jamo' ? 'Nguyên/Phụ Âm' : practiceMode === 'vocab' ? 'Từ vựng' : 'Mẫu câu'} #{currentLessonIndex + 1}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakKorean(targetText);
            }}
            className="ios-glass-circle !w-6 !h-6 ml-1"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 className="w-3 h-3 text-slate-700" />
          </button>
        </div>

        {/* Text Display with Highlighted Current Typing Character */}
        <div className="text-3xl sm:text-4xl font-black tracking-widest leading-relaxed flex flex-wrap justify-center items-center gap-1 min-h-[4rem]">
          {targetText.split('').map((char, index) => {
            let charStateStyle = 'text-slate-300';
            if (index < userInput.length) {
              if (userInput[index] === char) {
                charStateStyle = 'text-emerald-600 font-black';
              } else {
                charStateStyle = 'text-rose-600 bg-rose-50 underline rounded px-0.5';
              }
            } else if (index === userInput.length) {
              charStateStyle = 'text-blue-600 bg-blue-50 border-b-2 border-blue-600 animate-pulse px-1 rounded-t';
            }

            return (
              <span key={index} className={`transition-all ${charStateStyle}`}>
                {char === ' ' ? '␣' : char}
              </span>
            );
          })}
        </div>

        {/* Invisible Keyboard Capture Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute inset-0 w-full h-full cursor-text"
          autoFocus
        />

        {/* Completion Banner */}
        <AnimatePresence>
          {isLessonComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hoàn thành bài tập tuyệt vời!
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetLesson}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Gõ Lại
                </button>

                <button
                  onClick={handleNextLesson}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Bài Tiếp Theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Virtual 2-Bolsik Korean Keyboard Visualization */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2">
          <span>Bàn Phím Ảo Tiếng Hàn (2-Bolsik Layout)</span>
          <span className="text-[11px] text-blue-600 font-bold">
            {nextChar ? `Phím tiếp theo: "${nextChar}" [gõ phím '${nextQwertyKey?.toUpperCase() || ''}']` : 'Hoàn thành!'}
          </span>
        </div>

        {/* 3 Rows Keyboard Grid */}
        <div className="space-y-1.5 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div
              key={rIdx}
              className="flex justify-center gap-1 sm:gap-1.5"
              style={{ paddingLeft: rIdx === 1 ? '1rem' : rIdx === 2 ? '2rem' : '0' }}
            >
              {row.map((item) => {
                const isTarget = nextQwertyKey === item.key;
                const isActive = activeKey === item.key;

                let keyStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                if (isTarget) {
                  keyStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-black ring-2 ring-blue-500/40 animate-pulse';
                }

                if (isActive) {
                  keyStyle = keyFeedback === 'wrong'
                    ? 'bg-rose-500 text-white border-rose-600 scale-95'
                    : 'bg-emerald-500 text-white border-emerald-600 scale-95';
                }

                return (
                  <div
                    key={item.key}
                    className={`w-9 h-11 sm:w-12 sm:h-13 rounded-xl border flex flex-col items-center justify-center transition-all shadow-2xs ${keyStyle}`}
                  >
                    <span className="text-sm sm:text-base font-black leading-none">
                      {item.hangul}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                      {item.key}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Spacebar Row */}
          <div className="flex justify-center pt-1">
            <div
              className={`w-64 sm:w-80 h-10 rounded-xl border flex items-center justify-center text-xs font-bold text-slate-400 transition-all ${
                nextQwertyKey === 'space'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/40 animate-pulse'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              Dấu Cách (Spacebar)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
