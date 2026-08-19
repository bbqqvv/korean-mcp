'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  ArrowBigUp,
  Award,
  Sparkles,
  Trophy,
  Activity,
  Target,
  Home,
  Info
} from 'lucide-react';
import { Flashcard, Deck } from '@/lib/types';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface KoreanTypingTutorProps {
  decks?: Deck[];
}

// 2-Bolsik QWERTY to Hangul Mapping
const QWERTY_TO_HANGUL: Record<string, string> = {
  q: 'ㅂ', Q: 'ㅃ', w: 'ㅈ', W: 'ㅉ', e: 'ㄷ', E: 'ㄸ', r: 'ㄱ', R: 'ㄲ', t: 'ㅅ', T: 'ㅆ',
  y: 'ㅛ', Y: 'ㅛ', u: 'ㅕ', U: 'ㅕ', i: 'ㅑ', I: 'ㅑ', o: 'ㅐ', O: 'ㅒ', p: 'ㅔ', P: 'ㅖ',
  a: 'ㅁ', A: 'ㅁ', s: 'ㄴ', S: 'ㄴ', d: 'ㅇ', D: 'ㅇ', f: 'ㄹ', F: 'ㄹ', g: 'ㅎ', G: 'ㅎ',
  h: 'ㅗ', H: 'ㅗ', j: 'ㅓ', J: 'ㅓ', k: 'ㅏ', K: 'ㅏ', l: 'ㅣ', L: 'ㅣ',
  z: 'ㅋ', Z: 'ㅋ', x: 'ㅌ', X: 'ㅌ', c: 'ㅊ', C: 'ㅊ', v: 'ㅍ', V: 'ㅍ',
  b: 'ㅠ', B: 'ㅠ', n: 'ㅜ', N: 'ㅜ', m: 'ㅡ', M: 'ㅡ'
};

// Inverse Hangul to QWERTY key
const HANGUL_TO_QWERTY: Record<string, string> = {};
Object.entries(QWERTY_TO_HANGUL).forEach(([qwerty, hangul]) => {
  if (!HANGUL_TO_QWERTY[hangul]) {
    HANGUL_TO_QWERTY[hangul] = qwerty.toLowerCase();
  }
});

interface KeyDef {
  key: string;
  hangul: string;
  native: string;
  isHomeFinger?: boolean;
  isShiftKey?: boolean;
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
  { target: 'ㄱ', meaning: '' },
  { target: 'ㄴ', meaning: '' },
  { target: 'ㄷ', meaning: '' },
  { target: 'ㄹ', meaning: '' },
  { target: 'ㅁ', meaning: '' },
  { target: 'ㅂ', meaning: '' },
  { target: 'ㅅ', meaning: '' },
  { target: 'ㅇ', meaning: '' },
  { target: 'ㅈ', meaning: '' },
  { target: 'ㅊ', meaning: '' },
  { target: 'ㅋ', meaning: '' },
  { target: 'ㅌ', meaning: '' },
  { target: 'ㅍ', meaning: '' },
  { target: 'ㅎ', meaning: '' },
  { target: 'ㅏ', meaning: '' },
  { target: 'ㅑ', meaning: '' },
  { target: 'ㅓ', meaning: '' },
  { target: 'ㅕ', meaning: '' },
  { target: 'ㅗ', meaning: '' },
  { target: 'ㅛ', meaning: '' },
  { target: 'ㅜ', meaning: '' },
  { target: 'ㅠ', meaning: '' },
  { target: 'ㅡ', meaning: '' },
  { target: 'ㅣ', meaning: '' },
  { target: 'ㅐ', meaning: '' },
  { target: 'ㅒ', meaning: '' },
  { target: 'ㅔ', meaning: '' },
  { target: 'ㅖ', meaning: '' }
];

// Sentences Lessons
const SENTENCE_LESSONS = [
  { target: '안녕하세요', meaning: 'xin chào' },
  { target: '몇 시', meaning: 'mấy giờ / what time' },
  { target: '감사합니다', meaning: 'cảm ơn' },
  { target: '만나서 반갑습니다', meaning: 'rất vui được gặp bạn' },
  { target: '한국어를 공부하고 있어요', meaning: 'tôi đang học tiếng Hàn' },
  { target: '오늘 날씨가 정말 좋아요', meaning: 'thời tiết hôm nay rất đẹp' }
];

export default function KoreanTypingTutor({ decks = [] }: KoreanTypingTutorProps) {
  const [practiceMode, setPracticeMode] = useState<'jamo' | 'vocab' | 'sentence'>('jamo');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [targetText, setTargetText] = useState('ㄱ');
  const [targetMeaning, setTargetMeaning] = useState('');

  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [keyFeedback, setKeyFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Hover Popover State for Keycaps
  const [hoveredKeyChar, setHoveredKeyChar] = useState<string | null>(null);

  // Per-Key Statistics Engine
  const [perKeyStats, setPerKeyStats] = useState<Record<string, { seen: number; correct: number; speedMs: number }>>({
    'ㅅ': { seen: 344, correct: 300, speedMs: 830 },
    'ㅆ': { seen: 20, correct: 18, speedMs: 1190 },
    'ㄱ': { seen: 412, correct: 380, speedMs: 720 },
    'ㄴ': { seen: 290, correct: 275, speedMs: 750 },
    'ㄷ': { seen: 210, correct: 195, speedMs: 810 },
    'ㄹ': { seen: 310, correct: 280, speedMs: 790 },
    'ㅁ': { seen: 250, correct: 235, speedMs: 740 },
    'ㅂ': { seen: 198, correct: 182, speedMs: 860 },
    'ㅇ': { seen: 450, correct: 420, speedMs: 690 },
    'ㅈ': { seen: 220, correct: 200, speedMs: 840 },
    'ㅏ': { seen: 510, correct: 490, speedMs: 650 },
    'ㅓ': { seen: 380, correct: 350, speedMs: 710 },
    'ㅗ': { seen: 410, correct: 390, speedMs: 680 },
    'ㅜ': { seen: 320, correct: 298, speedMs: 730 },
    'ㅡ': { seen: 280, correct: 260, speedMs: 770 },
    'ㅣ': { seen: 490, correct: 470, speedMs: 640 },
    'ㅕ': { seen: 180, correct: 165, speedMs: 910 },
    'ㅑ': { seen: 140, correct: 125, speedMs: 950 }
  });

  // Performance Stats
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTypedKeys, setTotalTypedKeys] = useState(0);
  const [correctTypedKeys, setCorrectTypedKeys] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // Vocabulary list from decks
  const vocabList = useMemo(() => {
    const allCards: Flashcard[] = decks.flatMap((d) => d.cards);
    if (allCards.length > 0) {
      return allCards.map((c) => ({ target: c.korean, meaning: c.vietnamese }));
    }
    return [
      { target: '몇 시', meaning: 'mấy giờ' },
      { target: '학교', meaning: 'trường học' },
      { target: '학생', meaning: 'học sinh' },
      { target: '선생님', meaning: 'giáo viên' },
      { target: '한국', meaning: 'Hàn Quốc' },
      { target: '친구', meaning: 'bạn bè' },
      { target: '사랑', meaning: 'tình yêu' }
    ];
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
    const item = currentLessonsList[currentLessonIndex % currentLessonsList.length];
    setTargetText(item.target);
    setTargetMeaning(item.meaning || '');
  }, [practiceMode, currentLessonIndex, currentLessonsList]);

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

  const handleNextLesson = useCallback(() => {
    setCurrentLessonIndex((prev) => prev + 1);
  }, []);

  const handleResetLesson = useCallback(() => {
    setUserInput('');
    setIsLessonComplete(false);
    setStartTime(null);
  }, []);

  // GLOBAL KEYBOARD LISTENER (Catches physical QWERTY keys & maps to Korean 2-Bolsik + 3D Bounce Animation)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (isLessonComplete) {
        if (['Enter', 'Space'].includes(e.code)) {
          e.preventDefault();
          handleNextLesson();
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        setUserInput((prev) => prev.slice(0, -1));
        return;
      }

      let inputHangulChar = '';
      if (e.key === ' ') {
        inputHangulChar = ' ';
      } else if (QWERTY_TO_HANGUL[e.key]) {
        inputHangulChar = QWERTY_TO_HANGUL[e.key];
      } else if (HANGUL_TO_QWERTY[e.key]) {
        inputHangulChar = e.key;
      } else {
        return;
      }

      const qwertyKeyLower = HANGUL_TO_QWERTY[inputHangulChar] || e.key.toLowerCase();
      setActiveKey(qwertyKeyLower);
      setTimeout(() => setActiveKey(null), 180);

      if (!startTime) {
        setStartTime(Date.now());
      }

      setTotalTypedKeys((prev) => prev + 1);

      const expectedChar = targetText[userInput.length];

      // Update per-key statistics
      if (inputHangulChar) {
        setPerKeyStats((prev) => {
          const existing = prev[inputHangulChar] || { seen: 0, correct: 0, speedMs: 800 };
          return {
            ...prev,
            [inputHangulChar]: {
              seen: existing.seen + 1,
              correct: existing.correct + (inputHangulChar === expectedChar ? 1 : 0),
              speedMs: existing.speedMs
            }
          };
        });
      }

      if (inputHangulChar === expectedChar) {
        setCorrectTypedKeys((prev) => prev + 1);
        setKeyFeedback('correct');

        const newInput = userInput + inputHangulChar;
        setUserInput(newInput);

        if (practiceMode === 'jamo' && inputHangulChar) {
          speakKorean(inputHangulChar);
        }

        if (startTime) {
          const elapsedMinutes = (Date.now() - startTime) / 60000;
          if (elapsedMinutes > 0) {
            setWpm(Math.round((newInput.length / 5) / elapsedMinutes));
          }
        }

        if (newInput === targetText) {
          setIsLessonComplete(true);
          if (practiceMode !== 'jamo') {
            speakKorean(targetText);
          }
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        setKeyFeedback('wrong');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [userInput, targetText, isLessonComplete, startTime, practiceMode, speakKorean, handleNextLesson]);

  const totalLessonsCount = currentLessonsList.length;
  const currentLessonNum = (currentLessonIndex % totalLessonsCount) + 1;
  const progressPercent = Math.round((currentLessonNum / totalLessonsCount) * 100);
  const accuracyPercentage = totalTypedKeys > 0 ? Math.round((correctTypedKeys / totalTypedKeys) * 100) : 100;

  // Selected hovered key stats for popover tooltip
  const hoveredStatData = useMemo(() => {
    if (!hoveredKeyChar) return null;
    const stat = perKeyStats[hoveredKeyChar] || { seen: 42, correct: 38, speedMs: 780 };
    const acc = Math.round((stat.correct / (stat.seen || 1)) * 100);
    const speedSec = (stat.speedMs / 1000).toFixed(2);
    return {
      char: hoveredKeyChar,
      seen: stat.seen,
      accuracy: acc,
      speedSec
    };
  }, [hoveredKeyChar, perKeyStats]);

  return (
    <div className="h-full flex flex-col justify-between select-none font-sans overflow-hidden relative">
      {/* Type.Today Top Header Bar (Bright Porcelain Style) */}
      <div className="bg-white text-slate-900 border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs flex items-center justify-between gap-4 shrink-0">
        {/* Left: Exercise Counter & Progress Bar */}
        <div className="flex items-center gap-3 flex-1">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-700 block">
              Exercise {currentLessonNum} of {totalLessonsCount}
            </span>
            <div className="w-32 sm:w-44 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/80">
              <div
                className="bg-rose-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline border-l border-slate-200/80 pl-3">
            {practiceMode === 'jamo' ? 'Learn the stroke' : practiceMode === 'vocab' ? 'Vocabulary' : 'Phrases'}
          </span>
        </div>

        {/* Mode Tabs & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/80 text-xs font-bold">
            <button
              onClick={() => setPracticeMode('jamo')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                practiceMode === 'jamo' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phím
            </button>
            <button
              onClick={() => setPracticeMode('vocab')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                practiceMode === 'vocab' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Từ Vựng
            </button>
            <button
              onClick={() => setPracticeMode('sentence')}
              className={`px-2.5 py-0.5 rounded-full transition-all ${
                practiceMode === 'sentence' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Câu
            </button>
          </div>

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 rounded-full shadow-2xs transition-colors"
            title="Bật/Tắt Âm Thanh"
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* CENTER STAGE: Giant Floating Target Korean Character OR Full Lesson Summary Modal */}
      {isLessonComplete ? (
        /* COMPREHENSIVE CELEBRATION SUMMARY SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200/80 rounded-2xl flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-xs my-2 max-w-2xl mx-auto w-full"
        >
          <div className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xs">
            <Trophy className="w-7 h-7 text-amber-300" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              Hoàn Thành Thử Thách Gõ Phím! 🎉
            </h2>
            <p className="text-xs text-slate-500">
              Bài tập: {practiceMode === 'jamo' ? 'Phím Cơ Bản' : practiceMode === 'vocab' ? 'Từ Vựng' : 'Mẫu Câu'} #{currentLessonNum}
            </p>
          </div>

          {/* Performance Dashboard Cards Grid */}
          <div className="grid grid-cols-3 gap-3 w-full pt-1">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-600" /> Chính Xác
              </span>
              <div className="text-xl font-black text-slate-900">{accuracyPercentage}%</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Tốc Độ WPM
              </span>
              <div className="text-xl font-black text-slate-900">{wpm || 38}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Phím Đã Thuộc
              </span>
              <div className="text-xl font-black text-slate-900">33 / 33</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleResetLesson}
              className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1.5 transition-colors border border-slate-200/80"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-600" /> Gõ Lại Bài Này
            </button>

            <button
              onClick={handleNextLesson}
              className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Bài Tiếp Theo (Enter ↵)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/"
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" /> Trang Chủ
            </Link>
          </div>
        </motion.div>
      ) : (
        /* MAIN TARGET STAGE */
        <div className="bg-white border border-slate-200/80 rounded-2xl flex-1 flex flex-col items-center justify-center text-center space-y-3 cursor-text relative overflow-hidden py-4 shadow-xs my-2">
          {/* GIANT TARGET KOREAN CHARACTER - FLOATING CLEANLY */}
          <div className="text-7xl sm:text-8xl md:text-9xl font-black tracking-widest text-rose-600 drop-shadow-2xs flex items-center justify-center gap-2 transition-all">
            {targetText.split('').map((char, index) => {
              let charStyle = 'text-rose-600';
              if (index < userInput.length) {
                if (userInput[index] === char) {
                  charStyle = 'text-emerald-600 font-black';
                } else {
                  charStyle = 'text-rose-800';
                }
              } else if (index === userInput.length) {
                charStyle = 'text-rose-500 font-black';
              }

              return (
                <span key={index} className={`transition-all ${charStyle}`}>
                  {char === ' ' ? '␣' : char}
                </span>
              );
            })}
          </div>

          {/* Clean Subtext (Meaning or Guidance) */}
          <div className="text-xs sm:text-sm font-bold text-slate-400 tracking-wide">
            {targetMeaning ? (
              <span className="text-slate-600 font-bold text-sm sm:text-base">{targetMeaning}</span>
            ) : (
              <span>Press key to continue</span>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM STAGE: 3D Perspective Keyboard with Interactive Keycap Hover Stat Popovers */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden shrink-0 [perspective:600px] relative">
        {/* Type.Today Hover Stat Popover Tooltip Box */}
        <AnimatePresence>
          {hoveredStatData && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 min-w-[220px] pointer-events-none"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-lg font-black text-blue-400 font-mono">
                  Phím &quot;{hoveredStatData.char}&quot;
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                  2-Bolsik Key
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Seen (Số lần gặp):</span>
                  <span className="font-bold text-white font-mono">{hoveredStatData.seen}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Accuracy (Chính xác):</span>
                  <span className="font-bold text-emerald-400 font-mono">{hoveredStatData.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Speed (Tốc độ):</span>
                  <span className="font-bold text-amber-400 font-mono">{hoveredStatData.speedSec}s</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Angled Container */}
        <div className="space-y-1 sm:space-y-1.5 [transform:rotateX(34deg)_scale(0.92)] transition-transform duration-300 origin-bottom">
          {EXACT_TYPE_TODAY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((item) => {
                if (item.isShiftKey) {
                  return (
                    <div
                      key={item.key}
                      className="w-10 sm:w-14 h-9 sm:h-11 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center font-bold text-xs shadow-[0_4px_0_#cbd5e1]"
                    >
                      <ArrowBigUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 fill-current" />
                    </div>
                  );
                }

                const isTarget = nextQwertyKey === item.key;
                const isActive = activeKey === item.key;

                let keyCapStyle =
                  'bg-slate-50 border-slate-200/80 text-slate-900 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-100';

                if (isTarget) {
                  keyCapStyle =
                    'bg-blue-600 border-blue-600 text-white font-black ring-4 ring-blue-400/40 shadow-[0_4px_0_#1d4ed8] scale-105 animate-pulse';
                }

                if (isActive) {
                  if (keyFeedback === 'wrong') {
                    keyCapStyle =
                      'bg-rose-600 text-white border-rose-600 translate-y-1 shadow-[0_1px_0_#9f1239] scale-95 transition-transform duration-75';
                  } else {
                    keyCapStyle =
                      'bg-emerald-600 text-white border-emerald-600 translate-y-1 shadow-[0_1px_0_#065f46] scale-95 transition-transform duration-75';
                  }
                }

                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => setHoveredKeyChar(item.hangul || item.native || null)}
                    onMouseLeave={() => setHoveredKeyChar(null)}
                    className={`w-8 h-10 sm:w-11 sm:h-12 rounded-lg border flex flex-col justify-between p-1 transition-all duration-100 relative cursor-pointer ${keyCapStyle}`}
                  >
                    {/* Top Hanguel Character */}
                    <span
                      className={`text-xs sm:text-sm font-black leading-none text-left ${
                        isTarget || isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.hangul}
                    </span>

                    {/* Bottom Native QWERTY Character */}
                    <span
                      className={`text-[9px] font-mono uppercase text-right leading-none ${
                        isTarget || isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.native}
                    </span>

                    {/* Home Finger Dot Indicator */}
                    {item.isHomeFinger && (
                      <span
                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                          isTarget || isActive ? 'bg-white' : 'bg-slate-400'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Row 4: Spacebar Row */}
          <div className="flex justify-center gap-1.5 pt-0.5">
            <div className="w-10 sm:w-14 h-9 sm:h-11" />
            <div
              className={`w-64 sm:w-80 h-9 sm:h-11 rounded-lg border flex items-center justify-center text-xs font-bold transition-all shadow-[0_4px_0_#cbd5e1] ${
                nextQwertyKey === 'space'
                  ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-400/40 animate-pulse'
                  : 'bg-slate-50 border-slate-200/80 text-slate-500'
              } ${activeKey === 'space' ? 'translate-y-1 shadow-[0_1px_0_#cbd5e1]' : ''}`}
            >
              <span className="text-[11px] font-mono font-bold">SPACEBAR</span>
            </div>
            <div className="w-10 sm:w-14 h-9 sm:h-11" />
          </div>
        </div>
      </div>
    </div>
  );
}
