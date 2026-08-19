'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Book01Icon, Idea01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const TABS: { id: 'study' | 'hint'; title: string; short: string; icon: IconSvgElement }[] = [
  { id: 'study', title: 'Study', short: 'Học Thẻ', icon: Book01Icon },
  { id: 'hint', title: 'Hint', short: 'Gợi Ý / Ví Dụ', icon: Idea01Icon }
];

type TabId = 'study' | 'hint';

export function HintDiscreteTabs({ hint }: { hint: string | undefined }) {
  const [active, setActive] = useState<TabId>('study');
  const [showShine, setShowShine] = useState(false);
  const [refPanel, bounds] = useMeasure();
  const hasHint = Boolean(hint?.trim());

  useEffect(() => {
    setActive('study');
  }, [hint]);

  useEffect(() => {
    if (active === 'hint' && hasHint) {
      setShowShine(true);
      const t = setTimeout(() => setShowShine(false), 700);
      return () => clearTimeout(t);
    }
  }, [active, hasHint]);

  const expanded = active === 'hint' && hasHint;

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full gap-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.06] bg-black/5 dark:bg-black/20 p-1 backdrop-blur-md sm:inline-flex sm:w-auto">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const disabled = tab.id === 'hint' && !hasHint;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) setActive(tab.id);
              }}
              className={cn(
                'relative flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium transition-colors sm:min-h-0 sm:flex-none sm:justify-start sm:px-3.5 sm:py-1.5',
                disabled && 'cursor-not-allowed opacity-35',
                isActive ? 'text-fg' : 'text-fg/50 hover:text-fg/75'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="discreteTabBg"
                  className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/12"
                  transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 400,
                    mass: 0.75
                  }}
                />
              )}
              <HugeiconsIcon icon={tab.icon} className="relative z-10 size-[18px]" />
              <span className="relative z-10">{tab.short}</span>
              {isActive && showShine && tab.id === 'hint' && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
                  initial={false}
                >
                  <motion.span
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    initial={{ left: '-50%', opacity: 0 }}
                    animate={{ left: '120%', opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                  />
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{
          height: expanded ? bounds.height : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{
          type: 'spring',
          damping: 32,
          stiffness: 380,
          mass: 0.85
        }}
      >
        <div ref={refPanel}>
          {expanded && hint ? (
            <p className="ios-hint-panel px-5 py-4 text-[17px] font-normal leading-relaxed text-fg">
              {hint}
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
