'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { composeJamosToHangul } from '@/lib/hangul-engine';
import { useTheme } from '@/lib/theme-context';

interface TypingStageProps {
  targetText: string;
  targetMeaning: string;
  completedSyllableCount: number;
  activeTypedJamoSlice: string[];
  hasError: boolean;
  isLessonComplete: boolean;
  practiceMode: 'jamo' | 'vocab' | 'sentence';
  handleResetLesson: () => void;
  handleNextLesson: () => void;
}

export default function TypingStage({
  targetText,
  targetMeaning,
  completedSyllableCount,
  activeTypedJamoSlice,
  hasError,
  isLessonComplete,
  practiceMode,
  handleResetLesson,
  handleNextLesson
}: TypingStageProps) {
  const { themeConfig } = useTheme();

  // Live composed Hangul from currently typed Jamos for active syllable
  const livePartialHangul = useMemo(() => {
    return composeJamosToHangul(activeTypedJamoSlice);
  }, [activeTypedJamoSlice]);

  // Dynamic Font Size & Responsive Cursor Metrics Matrix
  const { fontSizeClass, focusBoxPaddingClass, cursorHeightClass } = useMemo(() => {
    const textLen = targetText.length;
    if (practiceMode === 'sentence' || textLen > 5) {
      if (textLen > 14) {
        return {
          fontSizeClass: 'text-2xl sm:text-3xl md:text-4xl',
          focusBoxPaddingClass: 'px-2 py-0.5 sm:px-3 sm:py-1',
          cursorHeightClass: 'h-6 sm:h-8 md:h-10'
        };
      }
      if (textLen > 8) {
        return {
          fontSizeClass: 'text-3xl sm:text-4xl md:text-5xl',
          focusBoxPaddingClass: 'px-2.5 py-0.5 sm:px-3.5 sm:py-1',
          cursorHeightClass: 'h-8 sm:h-10 md:h-12'
        };
      }
      return {
        fontSizeClass: 'text-4xl sm:text-5xl md:text-6xl',
        focusBoxPaddingClass: 'px-3 py-1 sm:px-4 sm:py-1.5',
        cursorHeightClass: 'h-10 sm:h-12 md:h-14'
      };
    }
    if (practiceMode === 'vocab' || textLen > 1) {
      return {
        fontSizeClass: 'text-6xl sm:text-7xl md:text-8xl',
        focusBoxPaddingClass: 'px-3.5 py-1 sm:px-5 sm:py-2',
        cursorHeightClass: 'h-14 sm:h-18'
      };
    }
    return {
      fontSizeClass: 'text-7xl sm:text-8xl md:text-9xl',
      focusBoxPaddingClass: 'px-4 py-1.5 sm:px-6 sm:py-2.5',
      cursorHeightClass: 'h-16 sm:h-20'
    };
  }, [targetText, practiceMode]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl flex-1 flex flex-col items-center justify-center text-center space-y-3 cursor-text relative overflow-hidden py-4 shadow-xs my-2 font-sans select-none">
      {/* GIANT TARGET KOREAN CHARACTER - ACCURATE LIVE PARTIAL SYLLABLE COMPOSED HIGHLIGHT ENGINE */}
      <div className={`${fontSizeClass} font-black tracking-widest flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-full px-4 transition-all`}>
        {targetText.split('').map((originalChar, index) => {
          const isCompleted = index < completedSyllableCount;
          const isActive = index === completedSyllableCount;

          if (isCompleted) {
            return (
              <span key={index} className="text-emerald-600 font-black px-0.5 sm:px-1">
                {originalChar === ' ' ? '␣' : originalChar}
              </span>
            );
          }

          if (isActive) {
            return (
              <span
                key={index}
                className={`inline-flex items-center justify-center min-w-[1.2em] sm:min-w-[1.4em] ${focusBoxPaddingClass} rounded-2xl transition-all border shadow-xs animate-pulse ${
                  hasError
                    ? 'bg-rose-100/90 border-rose-300 text-rose-600'
                    : 'bg-blue-50/70 border-blue-200/90 text-blue-600'
                }`}
              >
                {/* RENDER LIVE TYPED COMPOSED HANGUL (ㄴ -> 녀 -> 녕) IN THEME BLUE WHEN TYPED OR SOFT NEUTRAL GRAY ORIGINAL CHAR WHEN UNTYPED */}
                <span
                  className={`${
                    hasError
                      ? 'text-rose-600'
                      : activeTypedJamoSlice.length > 0
                      ? themeConfig.primaryText
                      : 'text-slate-300'
                  } font-black`}
                >
                  {activeTypedJamoSlice.length > 0
                    ? livePartialHangul
                    : originalChar === ' '
                    ? '␣'
                    : originalChar}
                </span>

                {/* THIN GRAY BLINKING CURSOR (|) INSIDE THE ACTIVE FOCUS BOX */}
                {!isLessonComplete && (
                  <span
                    className={`w-[2.5px] ${cursorHeightClass} ${
                      hasError ? 'bg-rose-500' : 'bg-slate-400'
                    } animate-pulse rounded-full inline-block ml-1 shrink-0 align-middle z-10`}
                  />
                )}
              </span>
            );
          }

          // Upcoming characters: Soft Neutral Gray text-slate-300 font-medium
          return (
            <span key={index} className="text-slate-300 font-medium px-0.5 sm:px-1">
              {originalChar === ' ' ? '␣' : originalChar}
            </span>
          );
        })}
      </div>

      {/* Clean Subtext */}
      <div className="text-xs sm:text-sm font-bold text-slate-400 tracking-wide">
        {isLessonComplete ? (
          <span className="text-emerald-600 font-bold flex items-center gap-1.5 justify-center">
            <CheckCircle2 className="w-4 h-4" /> Hoàn thành bài tập! Bấm phím tiếp theo (Enter ↵)
          </span>
        ) : targetMeaning ? (
          <span className="text-slate-500 font-medium text-sm sm:text-base">{targetMeaning}</span>
        ) : (
          <span>Press key to continue</span>
        )}
      </div>

      {/* Inline Completion Action Buttons */}
      <AnimatePresence>
        {isLessonComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-1 flex items-center justify-center gap-3"
          >
            <button
              onClick={handleResetLesson}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center gap-1.5 transition-colors border border-slate-200/80"
            >
              <RotateCw className="w-3.5 h-3.5" /> Gõ Lại
            </button>

            <button
              onClick={handleNextLesson}
              className={`px-5 py-1.5 text-xs font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full shadow-xs flex items-center gap-1.5 transition-all`}
            >
              <span>Bài Tiếp Theo (Enter ↵)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
