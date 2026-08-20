'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { composeJamosToHangul, decomposeSyllableToJamo } from '@/lib/hangul-engine';
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
            const targetJamos = decomposeSyllableToJamo(originalChar);
            const typedCount = activeTypedJamoSlice.length;
            const totalJamos = targetJamos.length;
            
            // Structure-Aware SVG-Equivalent Clip-Mask Engine (L-Shaped Polygons)
            let clipMaskStyle: React.CSSProperties = {};
            if (typedCount === 0) {
              clipMaskStyle = { opacity: 0 };
            } else if (typedCount >= totalJamos) {
              clipMaskStyle = { clipPath: 'inset(0)' };
            } else {
              const isHorizontal = ['ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ'].includes(targetJamos[1]);
              const isCompound = totalJamos >= 3 && ['ㅗ', 'ㅜ', 'ㅡ'].includes(targetJamos[1]) && ['ㅏ', 'ㅐ', 'ㅣ', 'ㅓ', 'ㅔ'].includes(targetJamos[2]);
              const hasBatchim = totalJamos > (isCompound ? 3 : 2);

              if (typedCount === 1) {
                if (isCompound) {
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 65% 0, 65% 35%, 0 35%)' : 'polygon(0 0, 65% 0, 65% 50%, 0 50%)' };
                } else if (isHorizontal) {
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 100% 0, 100% 35%, 0 35%)' : 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' };
                } else {
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 60% 0, 60% 65%, 0 65%)' : 'polygon(0 0, 60% 0, 60% 100%, 0 100%)' };
                }
              } else if (typedCount === 2) {
                if (isCompound) {
                  // L-Shape: Covers Top-Left (ㅎ) + Bottom-Left (ㅗ), dodges Right (ㅣ) and Bottom Batchim
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 65% 0, 65% 35%, 85% 35%, 85% 65%, 0 65%)' : 'polygon(0 0, 65% 0, 65% 45%, 85% 45%, 85% 100%, 0 100%)' };
                } else if (isHorizontal) {
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 100% 0, 100% 65%, 0 65%)' : 'inset(0)' };
                } else {
                  clipMaskStyle = { clipPath: hasBatchim ? 'polygon(0 0, 100% 0, 100% 65%, 0 65%)' : 'inset(0)' };
                }
              } else if (typedCount === 3) {
                if (isCompound) {
                  clipMaskStyle = { clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 65%)' };
                } else {
                  // Double Batchim (e.g. 읽, ㅄ) -> Top 65% + Bottom-Left 50%
                  clipMaskStyle = { clipPath: 'polygon(0 0, 100% 0, 100% 65%, 50% 65%, 50% 100%, 0 100%)' };
                }
              } else if (typedCount === 4) {
                // Compound Vowel + Double Batchim (e.g. 왅) -> Top 65% + Bottom-Left 50%
                clipMaskStyle = { clipPath: 'polygon(0 0, 100% 0, 100% 65%, 50% 65%, 50% 100%, 0 100%)' };
              }
            }

            return (
              <span
                key={index}
                className={`inline-flex items-center justify-center min-w-[1.2em] sm:min-w-[1.4em] ${focusBoxPaddingClass} rounded-2xl transition-all border shadow-xs animate-pulse ${
                  hasError
                    ? 'bg-rose-100/90 border-rose-300 text-rose-600'
                    : 'bg-blue-50/70 border-blue-200/90'
                }`}
              >
                {/* SVG-EQUIVALENT CLIP-MASK ENGINE OVERLAY */}
                <span className="relative flex items-center justify-center font-black">
                  {/* Layer 1 (Background): Original Char in Soft Neutral Gray */}
                  <span className={`${hasError ? 'text-rose-200' : 'text-slate-300'}`}>
                    {originalChar === ' ' ? '␣' : originalChar}
                  </span>
                  
                  {/* Layer 2 (Foreground Overlay): Identical Original Char in Theme Blue (clipped) */}
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-100 ${
                       hasError 
                        ? 'text-rose-600' 
                        : (typedCount >= 3 ? 'text-emerald-600' : themeConfig.primaryText)
                    }`}
                    style={clipMaskStyle}
                  >
                    {originalChar === ' ' ? '␣' : originalChar}
                  </span>
                </span>

                {/* THIN GRAY BLINKING CURSOR (|) INSIDE THE ACTIVE FOCUS BOX */}
                {!isLessonComplete && (
                  <span
                    className={`w-[2.5px] ${cursorHeightClass} ${
                      hasError ? 'bg-rose-500' : 'bg-slate-400'
                    } animate-pulse rounded-full inline-block ml-1 shrink-0 align-middle z-10`}
                  />
                )}
                
                {/* BACKSPACE TOAST IF ERROR */}
                <AnimatePresence>
                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg flex items-center gap-2 z-50 font-medium tracking-normal"
                    >
                      Press 
                      <span className="bg-slate-700/50 border border-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold text-slate-200">
                        Backspace
                      </span> 
                      fix your mistake
                    </motion.div>
                  )}
                </AnimatePresence>
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
