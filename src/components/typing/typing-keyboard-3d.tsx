'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowBigUp } from 'lucide-react';
import { EXACT_TYPE_TODAY_ROWS } from '@/lib/hangul-engine';
import { useTheme } from '@/lib/theme-context';

interface TypingKeyboard3DProps {
  nextQwertyKey: string | null;
  activeKey: string | null;
  isShiftActive: boolean;
  setIsShiftActive: (shift: boolean) => void;
  keyFeedback: 'correct' | 'wrong' | null;
  hoveredKeyChar: string | null;
  setHoveredKeyChar: (char: string | null) => void;
  perKeyStats: Record<
    string,
    {
      seen: number;
      correct: number;
      speedMs: number;
      masteryLevel: number;
      mistakes: { char: string; count: number }[];
    }
  >;
}

export default function TypingKeyboard3D({
  nextQwertyKey,
  activeKey,
  isShiftActive,
  setIsShiftActive,
  keyFeedback,
  hoveredKeyChar,
  setHoveredKeyChar,
  perKeyStats
}: TypingKeyboard3DProps) {
  const { themeConfig } = useTheme();

  // Selected hovered key stats for popover tooltip
  const hoveredStatData = useMemo(() => {
    if (!hoveredKeyChar) return null;
    const stat = perKeyStats[hoveredKeyChar] || {
      seen: 42,
      correct: 38,
      speedMs: 780,
      masteryLevel: 65,
      mistakes: [{ char: 'ㄱ', count: 3 }]
    };
    const acc = Math.round((stat.correct / (stat.seen || 1)) * 100);
    const speedSec = (stat.speedMs / 1000).toFixed(2);
    return {
      char: hoveredKeyChar,
      seen: stat.seen,
      accuracy: acc,
      speedSec,
      mistakes: stat.mistakes || []
    };
  }, [hoveredKeyChar, perKeyStats]);

  return (
    <div className="relative shrink-0 pb-2 [perspective:800px] font-sans select-none">
      {/* Hover Stat Popover Tooltip Box */}
      <AnimatePresence>
        {hoveredStatData && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 bg-[#121215] text-white rounded-2xl p-3.5 shadow-2xl border border-slate-800 min-w-[240px] pointer-events-none"
          >
            <div className="text-center border-b border-slate-800 pb-2 mb-2">
              <span className="text-2xl font-black text-white font-mono leading-none">
                {hoveredStatData.char}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Seen</span>
                <span className="font-bold text-white font-mono">{hoveredStatData.seen}x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Accuracy</span>
                <span className="font-bold text-white font-mono">{hoveredStatData.accuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Speed</span>
                <span className="font-bold text-white font-mono">{hoveredStatData.speedSec}s</span>
              </div>

              {hoveredStatData.mistakes.length > 0 && (
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                  <span className="text-slate-400 font-medium">Mistakes</span>
                  <div className="flex items-center gap-1">
                    {hoveredStatData.mistakes.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-200 flex items-center gap-0.5"
                      >
                        {m.char}
                        <span className="text-[9px] text-slate-400 font-mono">x{m.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Angled Container Floating Cleanly */}
      <div className="space-y-1.5 sm:space-y-2 [transform:rotateX(28deg)] transition-transform duration-300 origin-bottom">
        {EXACT_TYPE_TODAY_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map((item) => {
              if (item.isShiftKey) {
                return (
                  <div
                    key={item.key}
                    onClick={() => setIsShiftActive(!isShiftActive)}
                    className={`w-12 sm:w-16 h-11 sm:h-13 rounded-xl border border-b-4 text-xs font-bold shadow-md flex items-center justify-center cursor-pointer transition-all ${
                      isShiftActive
                        ? `${themeConfig.primaryBg} border-blue-800 text-white ring-4 ${themeConfig.accentRing}`
                        : 'bg-slate-100 border-slate-300 border-b-slate-400/80 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowBigUp className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  </div>
                );
              }

              const displayedHangul = isShiftActive && item.shiftHangul ? item.shiftHangul : item.hangul;
              const isTarget = nextQwertyKey === item.key;
              const isActive = activeKey === item.key;
              const stat = displayedHangul ? perKeyStats[displayedHangul] : null;
              const batteryLevel = stat ? stat.masteryLevel : 0;

              let keyCapStyle =
                'bg-white border border-slate-200/90 border-b-4 border-b-slate-300 text-slate-900 shadow-md hover:bg-slate-50';

              if (isTarget) {
                keyCapStyle = `${themeConfig.primaryBg} border-blue-600 border-b-4 border-b-blue-800 text-white font-black ring-4 ${themeConfig.accentRing} shadow-xl scale-105 animate-pulse`;
              }

              if (isActive) {
                if (keyFeedback === 'wrong') {
                  keyCapStyle =
                    'bg-rose-600 text-white border-rose-600 border-b-2 border-b-rose-800 translate-y-1 shadow-sm scale-95 transition-transform duration-75';
                } else {
                  keyCapStyle =
                    'bg-blue-600 text-white border-blue-600 border-b-2 border-b-blue-800 translate-y-1 shadow-sm scale-95 transition-transform duration-75';
                }
              }

              return (
                <div
                  key={item.key}
                  onMouseEnter={() => setHoveredKeyChar(displayedHangul || item.native || null)}
                  onMouseLeave={() => setHoveredKeyChar(null)}
                  className={`w-10 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col justify-between p-1.5 transition-all duration-100 relative cursor-pointer overflow-hidden ${keyCapStyle}`}
                >
                  {/* BATTERY GAUGE MASTERY FILL */}
                  {batteryLevel > 0 && !isTarget && !isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500/25 border-t border-blue-400/40 rounded-b-lg transition-all duration-500 pointer-events-none"
                      style={{ height: `${batteryLevel}%` }}
                    />
                  )}

                  {/* Top Hanguel Character (Dynamic Shift Support) */}
                  <span
                    className={`text-sm sm:text-lg font-black leading-none text-left z-10 ${
                      isTarget || isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {displayedHangul}
                  </span>

                  {/* Bottom Native QWERTY Character */}
                  <span
                    className={`text-[10px] font-mono font-bold uppercase text-right leading-none z-10 ${
                      isTarget || isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.native}
                  </span>

                  {/* Home Finger Dot Indicator */}
                  {item.isHomeFinger && (
                    <span
                      className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-10 ${
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
        <div className="flex justify-center gap-2 pt-0.5">
          <div className="w-12 sm:w-16 h-11 sm:h-13" />
          <div
            className={`w-72 sm:w-[26rem] h-11 sm:h-13 rounded-xl border border-slate-200/90 border-b-4 border-b-slate-300 flex items-center justify-center text-xs font-bold transition-all shadow-md ${
              nextQwertyKey === 'space'
                ? `${themeConfig.primaryBg} border-blue-600 border-b-blue-800 text-white ring-4 ${themeConfig.accentRing} animate-pulse`
                : activeKey === 'space'
                ? `${themeConfig.primaryBg} text-white border-b-2 translate-y-1 shadow-sm`
                : 'bg-white text-slate-500'
            }`}
          >
            <span
              className={`text-xs font-mono font-black ${
                activeKey === 'space' || nextQwertyKey === 'space' ? 'text-white' : 'text-slate-600'
              }`}
            >
              SPACEBAR
            </span>
          </div>
          <div className="w-12 sm:w-16 h-11 sm:h-13" />
        </div>
      </div>
    </div>
  );
}
