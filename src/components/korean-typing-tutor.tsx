'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Flashcard, Deck } from '@/lib/types';
import {
  QWERTY_TO_HANGUL,
  HANGUL_TO_QWERTY,
  decomposeTextToJamoSequence,
  JAMO_LESSONS,
  SENTENCE_LESSONS
} from '@/lib/hangul-engine';
import TypingHeader from './typing/typing-header';
import TypingStage from './typing/typing-stage';
import TypingKeyboard3D from './typing/typing-keyboard-3d';

interface KoreanTypingTutorProps {
  decks?: Deck[];
}

export default function KoreanTypingTutor({ decks = [] }: KoreanTypingTutorProps) {
  const [practiceMode, setPracticeMode] = useState<'jamo' | 'vocab' | 'sentence'>('jamo');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [targetText, setTargetText] = useState('ㄱ');
  const [targetMeaning, setTargetMeaning] = useState('');

  const [typedJamos, setTypedJamos] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [hoveredKeyChar, setHoveredKeyChar] = useState<string | null>(null);

  // Per-Key Statistics Engine
  const [perKeyStats] = useState<
    Record<
      string,
      {
        seen: number;
        correct: number;
        speedMs: number;
        masteryLevel: number;
        mistakes: { char: string; count: number }[];
      }
    >
  >({
    'ㅂ': { seen: 380, correct: 360, speedMs: 710, masteryLevel: 100, mistakes: [{ char: 'ㅃ', count: 12 }, { char: 'ㅍ', count: 4 }] },
    'ㅈ': { seen: 310, correct: 285, speedMs: 740, masteryLevel: 92, mistakes: [{ char: 'ㅉ', count: 8 }, { char: 'ㅊ', count: 5 }] },
    'ㄷ': { seen: 290, correct: 260, speedMs: 760, masteryLevel: 88, mistakes: [{ char: 'ㄸ', count: 10 }] },
    'ㄱ': { seen: 450, correct: 425, speedMs: 680, masteryLevel: 95, mistakes: [{ char: 'ㄲ', count: 15 }, { char: 'ㅋ', count: 3 }] },
    'ㅅ': { seen: 344, correct: 300, speedMs: 830, masteryLevel: 87, mistakes: [{ char: 'ㅆ', count: 16 }, { char: 'ㅈ', count: 3 }] },
    'ㅛ': { seen: 124, correct: 102, speedMs: 800, masteryLevel: 82, mistakes: [{ char: 'ㅕ', count: 16 }, { char: 'ㅅ', count: 3 }, { char: 'ㅠ', count: 3 }] },
    'ㅕ': { seen: 180, correct: 145, speedMs: 850, masteryLevel: 75, mistakes: [{ char: 'ㅑ', count: 9 }, { char: 'ㅛ', count: 4 }] },
    'ㅑ': { seen: 140, correct: 105, speedMs: 920, masteryLevel: 68, mistakes: [{ char: 'ㅕ', count: 14 }] },
    'ㅐ': { seen: 210, correct: 180, speedMs: 790, masteryLevel: 80, mistakes: [{ char: 'ㅔ', count: 11 }] },
    'ㅔ': { seen: 195, correct: 168, speedMs: 810, masteryLevel: 72, mistakes: [{ char: 'ㅐ', count: 13 }] },
    'ㅁ': { seen: 250, correct: 235, speedMs: 740, masteryLevel: 55, mistakes: [{ char: 'ㄴ', count: 6 }] },
    'ㄴ': { seen: 290, correct: 275, speedMs: 750, masteryLevel: 50, mistakes: [{ char: 'ㅇ', count: 8 }] },
    'ㅇ': { seen: 450, correct: 420, speedMs: 690, masteryLevel: 45, mistakes: [{ char: 'ㅁ', count: 5 }] },
    'ㄹ': { seen: 310, correct: 280, speedMs: 790, masteryLevel: 40, mistakes: [{ char: 'ㅎ', count: 7 }] },
    'ㅎ': { seen: 230, correct: 200, speedMs: 820, masteryLevel: 35, mistakes: [{ char: 'ㅗ', count: 6 }] },
    'ㅗ': { seen: 410, correct: 390, speedMs: 680, masteryLevel: 30, mistakes: [{ char: 'ㅜ', count: 9 }] },
    'ㅓ': { seen: 380, correct: 350, speedMs: 710, masteryLevel: 25, mistakes: [{ char: 'ㅏ', count: 10 }] },
    'ㅏ': { seen: 510, correct: 490, speedMs: 650, masteryLevel: 20, mistakes: [{ char: 'ㅣ', count: 4 }] },
    'ㅣ': { seen: 490, correct: 470, speedMs: 640, masteryLevel: 15, mistakes: [{ char: 'ㅡ', count: 5 }] }
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // Vocabulary list from decks
  const vocabList = useMemo(() => {
    const allCards: Flashcard[] = decks.flatMap((d) => d.cards);
    if (allCards.length > 0) {
      return allCards.map((c) => ({ target: c.korean, meaning: c.vietnamese }));
    }
    return [
      { target: '마트', meaning: 'Siêu thị (Mart)' },
      { target: '거실', meaning: 'Phòng khách' },
      { target: '집', meaning: 'Nhà / Căn nhà' },
      { target: '시장', meaning: 'Chợ / Thị trường' },
      { target: '식당', meaning: 'Nhà ăn / Nhà hàng' },
      { target: '화장실', meaning: 'Nhà vệ sinh / Phòng tắm' },
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

  const { jamos: targetJamoSeq, boundaries: syllableBoundaries } = useMemo(() => {
    return decomposeTextToJamoSequence(targetText);
  }, [targetText]);

  useEffect(() => {
    setTypedJamos([]);
    setHasError(false);
    setIsLessonComplete(false);
    setStartTime(null);
    const item = currentLessonsList[currentLessonIndex % currentLessonsList.length];
    setTargetText(item.target);
    setTargetMeaning(item.meaning || '');
  }, [practiceMode, currentLessonIndex, currentLessonsList]);

  const nextJamoChar = targetJamoSeq[typedJamos.length] || '';
  const nextQwertyKey = HANGUL_TO_QWERTY[nextJamoChar] || (nextJamoChar === ' ' ? 'space' : null);

  const completedSyllableCount = useMemo(() => {
    let completed = 0;
    for (let i = 0; i < syllableBoundaries.length; i++) {
      if (typedJamos.length >= syllableBoundaries[i].end) {
        completed++;
      } else {
        break;
      }
    }
    return completed;
  }, [typedJamos, syllableBoundaries]);

  const activeSyllableBound = syllableBoundaries[completedSyllableCount];
  const activeTypedJamoSlice = useMemo(() => {
    if (!activeSyllableBound) return [];
    const startPos = activeSyllableBound.start;
    return typedJamos.slice(startPos);
  }, [typedJamos, activeSyllableBound]);

  const speakKorean = useCallback(
    (text: string) => {
      if (isSoundOn && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSoundOn]
  );

  const handleNextLesson = useCallback(() => {
    setCurrentLessonIndex((prev) => prev + 1);
  }, []);

  const handleResetLesson = useCallback(() => {
    setTypedJamos([]);
    setHasError(false);
    setIsLessonComplete(false);
    setStartTime(null);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftActive(true);
        return;
      }

      if (isLessonComplete) {
        if (['Enter', 'Space'].includes(e.code)) {
          e.preventDefault();
          handleNextLesson();
        }
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (hasError) {
          setHasError(false);
        } else {
          setTypedJamos((prev) => prev.slice(0, -1));
        }
        return;
      }

      let inputHangulChar = '';
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        inputHangulChar = ' ';
        setActiveKey('space');
        setTimeout(() => setActiveKey(null), 180);
      } else if (QWERTY_TO_HANGUL[e.key]) {
        inputHangulChar = QWERTY_TO_HANGUL[e.key];
        const qwertyKeyLower = HANGUL_TO_QWERTY[inputHangulChar] || e.key.toLowerCase();
        setActiveKey(qwertyKeyLower);
        setTimeout(() => setActiveKey(null), 180);
      } else if (HANGUL_TO_QWERTY[e.key]) {
        inputHangulChar = e.key;
        const qwertyKeyLower = HANGUL_TO_QWERTY[inputHangulChar] || e.key.toLowerCase();
        setActiveKey(qwertyKeyLower);
        setTimeout(() => setActiveKey(null), 180);
      } else {
        return;
      }

      if (!startTime) {
        setStartTime(Date.now());
      }

      const expectedJamo = targetJamoSeq[typedJamos.length];

      if (hasError) {
        setKeyFeedback('wrong');
        return;
      }

      if (inputHangulChar === expectedJamo) {
        setKeyFeedback('correct');
        setHasError(false);

        const newTyped = [...typedJamos, inputHangulChar];
        setTypedJamos(newTyped);

        if (practiceMode === 'jamo' && inputHangulChar) {
          speakKorean(inputHangulChar);
        }

        if (newTyped.length === targetJamoSeq.length) {
          setIsLessonComplete(true);
          if (practiceMode !== 'jamo') {
            speakKorean(targetText);
          }
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
        }
      } else {
        setKeyFeedback('wrong');
        setHasError(true);
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setIsShiftActive(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [typedJamos, targetJamoSeq, targetText, isLessonComplete, startTime, practiceMode, hasError, speakKorean, handleNextLesson]);

  const totalLessonsCount = currentLessonsList.length;
  const currentLessonNum = (currentLessonIndex % totalLessonsCount) + 1;
  const progressPercent = Math.round((currentLessonNum / totalLessonsCount) * 100);

  return (
    <div className="h-full flex flex-col justify-between select-none font-sans overflow-hidden relative">
      {/* Top Header Bar */}
      <TypingHeader
        currentLessonNum={currentLessonNum}
        totalLessonsCount={totalLessonsCount}
        progressPercent={progressPercent}
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
        isSoundOn={isSoundOn}
        setIsSoundOn={setIsSoundOn}
      />

      {/* Center Stage */}
      <TypingStage
        targetText={targetText}
        targetMeaning={targetMeaning}
        completedSyllableCount={completedSyllableCount}
        activeTypedJamoSlice={activeTypedJamoSlice}
        hasError={hasError}
        isLessonComplete={isLessonComplete}
        practiceMode={practiceMode}
        handleResetLesson={handleResetLesson}
        handleNextLesson={handleNextLesson}
      />

      {/* 3D Perspective Keyboard */}
      <TypingKeyboard3D
        nextQwertyKey={nextQwertyKey}
        activeKey={activeKey}
        isShiftActive={isShiftActive}
        setIsShiftActive={setIsShiftActive}
        keyFeedback={keyFeedback}
        hoveredKeyChar={hoveredKeyChar}
        setHoveredKeyChar={setHoveredKeyChar}
        perKeyStats={perKeyStats}
      />
    </div>
  );
}
