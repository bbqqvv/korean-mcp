'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowBigUp,
  Keyboard
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

// Exact Type.Today 5-Row Keyboard Definition
interface KeyDef {
  key: string;
  hangul: string;
  native: string;
  isHomeFinger?: boolean;
  isShiftKey?: boolean;
  isSpaceBar?: boolean;
}

const EXACT_TYPE_TODAY_ROWS: KeyDef[][] = [
  // Row 0: Number Row
  [
    { key: '1', hangul: '1', native: '' },
    { key: '2', hangul: '2', native: '' },
    { key: '3', hangul: '3', native: '' },
    { key: '4', hangul: '4', native: '' },
    { key: '5', hangul: '5', native: '' },
    { key: '6', hangul: '6', native: '' },
    { key: '7', hangul: '7', native: '' },
    { key: '8', hangul: '8', native: '' },
    { key: '9', hangul: '9', native: '' },
    { key: '0', hangul: '0', native: '' },
    { key: '-', hangul: '-', native: '' },
    { key: '=', hangul: '=', native: '' }
  ],
  // Row 1: Top QWERTY Row
  [
    { key: 'q', hangul: 'ㅂ', native: 'Q' },
    { key: 'w', hangul: 'ㅈ', native: 'W' },
    { key: 'e', hangul: 'ㄷ', native: 'E' },
    { key: 'r', hangul: 'ㄱ', native: 'R' },
    { key: 't', hangul: 'ㅅ', native: 'T' },
    { key: 'y', hangul: 'ㅛ', native: 'Y' },
    { key: 'u', hangul: 'ㅕ', native: 'U' },
    { key: 'i', hangul: 'ㅑ', native: 'I' },
    { key: 'o', hangul: 'ㅐ', native: 'O' },
    { key: 'p', hangul: 'ㅔ', native: 'P' },
    { key: '[', hangul: '[', native: '' }
  ],
  // Row 2: Home Row (with Home Finger Guides on ㄹ/F and ㅓ/J)
  [
    { key: 'a', hangul: 'ㅁ', native: 'A' },
    { key: 's', hangul: 'ㄴ', native: 'S' },
    { key: 'd', hangul: 'ㅇ', native: 'D' },
    { key: 'f', hangul: 'ㄹ', native: 'F', isHomeFinger: true },
    { key: 'g', hangul: 'ㅎ', native: 'G' },
    { key: 'h', hangul: 'ㅗ', native: 'H' },
    { key: 'j', hangul: 'ㅓ', native: 'J', isHomeFinger: true },
    { key: 'k', hangul: 'ㅏ', native: 'K' },
    { key: 'l', hangul: 'ㅣ', native: 'L' },
    { key: ';', hangul: ';', native: '' }
  ],
  // Row 3: Bottom Row (with Left & Right Shift Keys)
  [
    { key: 'shift_left', hangul: '', native: '', isShiftKey: true },
    { key: 'z', hangul: 'ㅋ', native: 'Z' },
    { key: 'x', hangul: 'ㅌ', native: 'X' },
    { key: 'c', hangul: 'ㅊ', native: 'C' },
    { key: 'v', hangul: 'ㅍ', native: 'V' },
    { key: 'b', hangul: 'ㅠ', native: 'B' },
    { key: 'n', hangul: 'ㅜ', native: 'N' },
    { key: 'm', hangul: 'ㅡ', native: 'M' },
    { key: ',', hangul: ',', native: '' },
    { key: '.', hangul: '.', native: '' },
    { key: 'shift_right', hangul: '', native: '', isShiftKey: true }
  ]
];

// Basic Jamo Lessons
const JAMO_LESSONS = [
  'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
  'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'
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
  const [targetText, setTargetText] = useState('ㄱ');

  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyFeedback, setKeyFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);

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

  const currentLessonsList = useMemo(() => {
    if (practiceMode === 'jamo') return JAMO_LESSONS;
    if (practiceMode === 'sentence') return SENTENCE_LESSONS;
    return vocabList;
  }, [practiceMode, vocabList]);

  // Update target text when mode or lesson index changes
  useEffect(() => {
    setUserInput('');
    setIsLessonComplete(false);
    setStartTime(null);
    setTargetText(currentLessonsList[currentLessonIndex % currentLessonsList.length]);
  }, [practiceMode, currentLessonIndex, currentLessonsList]);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  // Next expected character & QWERTY key
  const nextChar = targetText[userInput.length] || '';
  const nextQwertyKey = HANGUL_TO_QWERTY[nextChar] || (nextChar === ' ' ? 'space' : null);

  const speakKorean = useCallback((text: string) => {
    if (isSoundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setTotalTypedKeys((prev) => prev + 1);

    const typedChar = val[val.length - 1];
    const expectedChar = targetText[val.length - 1];

    if (typedChar === expectedChar) {
      setCorrectTypedKeys((prev) => prev + 1);
      setKeyFeedback('correct');
      if (practiceMode === 'jamo' && typedChar) {
        speakKorean(typedChar);
      }
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
      if (practiceMode !== 'jamo') {
        speakKorean(targetText);
      }
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

  const totalLessonsCount = currentLessonsList.length;
  const currentLessonNum = (currentLessonIndex % totalLessonsCount) + 1;
  const progressPercent = Math.round((currentLessonNum / totalLessonsCount) * 100);
  const accuracyPercentage = totalTypedKeys > 0 ? Math.round((correctTypedKeys / totalTypedKeys) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans select-none pb-8">
      {/* Type.Today Top Header Bar */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl px-5 py-3 shadow-md flex items-center justify-between gap-4">
        {/* Left: Exercise Counter & Progress Bar */}
        <div className="flex items-center gap-4 flex-1">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-300 block">
              Exercise {currentLessonNum} of {totalLessonsCount}
            </span>
            <div className="w-36 sm:w-48 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline border-l border-slate-800 pl-4">
            {practiceMode === 'jamo' ? 'Luyện Phím Phụ/Nguyên Âm' : practiceMode === 'vocab' ? 'Luyện Từ Vựng' : 'Luyện Mẫu Câu'}
          </span>
        </div>

        {/* Mode Tabs & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 p-1 rounded-full border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setPracticeMode('jamo')}
              className={`px-3 py-1 rounded-full transition-all ${
                practiceMode === 'jamo' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Phím
            </button>
            <button
              onClick={() => setPracticeMode('vocab')}
              className={`px-3 py-1 rounded-full transition-all ${
                practiceMode === 'vocab' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Từ Vựng
            </button>
            <button
              onClick={() => setPracticeMode('sentence')}
              className={`px-3 py-1 rounded-full transition-all ${
                practiceMode === 'sentence' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Câu
            </button>
          </div>

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-full transition-colors"
            title="Bật/Tắt Âm Thanh"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* CENTER STAGE: Giant Floating Korean Character (Type.Today Style) */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[16rem] sm:min-h-[18rem] space-y-4 shadow-xs relative cursor-text overflow-hidden"
      >
        {/* Stats Pills Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            WPM: {wpm}
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Chính xác: {accuracyPercentage}%
          </span>
        </div>

        {/* GIANT TARGET KOREAN CHARACTER */}
        <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-widest text-slate-900 drop-shadow-xs flex items-center justify-center gap-2 transition-all">
          {targetText.split('').map((char, index) => {
            let charStyle = 'text-slate-900';
            if (index < userInput.length) {
              if (userInput[index] === char) {
                charStyle = 'text-emerald-600 font-black';
              } else {
                charStyle = 'text-rose-600 underline';
              }
            } else if (index === userInput.length) {
              charStyle = 'text-blue-600 underline decoration-blue-600 underline-offset-8 animate-pulse';
            }

            return (
              <span key={index} className={`transition-all ${charStyle}`}>
                {char === ' ' ? '␣' : char}
              </span>
            );
          })}
        </div>

        {/* Typing Guidance Text (Type.Today Style: "Press key to continue") */}
        <div className="text-xs sm:text-sm font-bold text-slate-400 tracking-wide">
          {isLessonComplete ? (
            <span className="text-emerald-600 flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="w-4 h-4" /> Hoàn thành bài tập! Bấm phím tiếp theo hoặc nút bên dưới
            </span>
          ) : (
            <span>
              Gõ phím <strong className="text-blue-600 uppercase text-sm font-mono font-black">&apos;{nextQwertyKey || ''}&apos;</strong> trên bàn phím để tiếp tục
            </span>
          )}
        </div>

        {/* Hidden Input Box */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute inset-0 w-full h-full cursor-text"
          autoFocus
        />

        {/* Completion Control Bar */}
        <AnimatePresence>
          {isLessonComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 flex items-center justify-center gap-3"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM STAGE: Exact Type.Today 5-Row 3D Angled Virtual Keyboard */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden [perspective:1000px]">
        {/* 3D Angled Container matching Type.Today */}
        <div className="space-y-1.5 sm:space-y-2 [transform:rotateX(20deg)_scale(0.96)] transition-transform duration-300 origin-bottom">
          {EXACT_TYPE_TODAY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((item) => {
                if (item.isShiftKey) {
                  return (
                    <div
                      key={item.key}
                      className="w-12 sm:w-16 h-10 sm:h-12 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shadow-md"
                    >
                      <ArrowBigUp className="w-5 h-5 text-slate-400" />
                    </div>
                  );
                }

                const isTarget = nextQwertyKey === item.key;
                const isActive = activeKey === item.key;

                let keyCapStyle = 'bg-slate-900/90 border-slate-800 text-slate-400 opacity-60';

                if (isTarget) {
                  keyCapStyle = 'bg-blue-600 border-blue-400 text-white font-black ring-4 ring-blue-400/50 shadow-xl scale-105 animate-pulse opacity-100';
                } else if (isActive) {
                  keyCapStyle = keyFeedback === 'wrong'
                    ? 'bg-rose-600 text-white border-rose-500 scale-95 opacity-100'
                    : 'bg-emerald-600 text-white border-emerald-500 scale-95 opacity-100';
                }

                return (
                  <div
                    key={item.key}
                    className={`w-9 h-11 sm:w-12 sm:h-13 rounded-lg border flex flex-col justify-between p-1 transition-all relative ${keyCapStyle}`}
                  >
                    {/* Top Hanguel Character (_keyHanguel) */}
                    <span className="text-xs sm:text-sm font-black leading-none text-left">
                      {item.hangul}
                    </span>

                    {/* Bottom Native QWERTY Character (_keyNative) */}
                    <span className="text-[9px] font-mono text-slate-400 uppercase text-right leading-none">
                      {item.native}
                    </span>

                    {/* Home Finger Dot Indicator (_isHomeFinger) */}
                    {item.isHomeFinger && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400/80 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Row 4: Spacebar Row matching Type.Today */}
          <div className="flex justify-center gap-1.5 pt-1">
            <div className="w-12 sm:w-16 h-10 sm:h-12" />
            <div
              className={`w-72 sm:w-96 h-10 sm:h-12 rounded-lg border flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                nextQwertyKey === 'space'
                  ? 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-400/50 animate-pulse'
                  : 'bg-slate-900/90 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <span className="text-xs font-mono">SPACEBAR</span>
            </div>
            <div className="w-12 sm:w-16 h-10 sm:h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
