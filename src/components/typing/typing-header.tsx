'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface TypingHeaderProps {
  currentLessonNum: number;
  totalLessonsCount: number;
  progressPercent: number;
  practiceMode: 'jamo' | 'vocab' | 'sentence';
  setPracticeMode: (mode: 'jamo' | 'vocab' | 'sentence') => void;
  isSoundOn: boolean;
  setIsSoundOn: (sound: boolean) => void;
}

export default function TypingHeader({
  currentLessonNum,
  totalLessonsCount,
  progressPercent,
  practiceMode,
  setPracticeMode,
  isSoundOn,
  setIsSoundOn
}: TypingHeaderProps) {
  const { themeConfig } = useTheme();

  return (
    <div className="bg-white text-slate-900 border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs flex items-center justify-between gap-4 shrink-0 font-sans select-none">
      {/* Left: Exercise Counter & Progress Bar */}
      <div className="flex items-center gap-3 flex-1">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-slate-700 block">
            Exercise {currentLessonNum} of {totalLessonsCount}
          </span>
          <div className="w-32 sm:w-44 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/80">
            <div
              className={`${themeConfig.primaryBg} h-full transition-all duration-300`}
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
              practiceMode === 'jamo' ? `${themeConfig.primaryBg} text-white shadow-2xs` : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phím
          </button>
          <button
            onClick={() => setPracticeMode('vocab')}
            className={`px-2.5 py-0.5 rounded-full transition-all ${
              practiceMode === 'vocab' ? `${themeConfig.primaryBg} text-white shadow-2xs` : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Từ Vựng
          </button>
          <button
            onClick={() => setPracticeMode('sentence')}
            className={`px-2.5 py-0.5 rounded-full transition-all ${
              practiceMode === 'sentence' ? `${themeConfig.primaryBg} text-white shadow-2xs` : 'text-slate-600 hover:text-slate-900'
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
          {isSoundOn ? <Volume2 className={`w-3.5 h-3.5 ${themeConfig.primaryText}`} /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>
    </div>
  );
}
