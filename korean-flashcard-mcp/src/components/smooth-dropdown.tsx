'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import useMeasure from 'react-use-measure';
import {
  CreditCardIcon,
  File01Icon,
  Folder01Icon,
  HelpCircleIcon,
  Logout01Icon,
  MoreHorizontalCircle01Icon,
  Settings01Icon,
  UserIcon
} from '@hugeicons/core-free-icons';

export type DropdownMenuItem = {
  id: string;
  label: string;
  icon: IconSvgElement | null;
};

const defaultMenuItems: DropdownMenuItem[] = [
  { id: 'mcp-guide', label: 'Kết nối Gemini MCP', icon: Folder01Icon },
  { id: 'quiz', label: 'Ôn Luyện Quiz', icon: File01Icon },
  { id: 'email-settings', label: 'Lịch Gửi Mail', icon: Settings01Icon },
  { id: 'divider', label: '', icon: null },
  { id: 'help', label: 'Trợ Giúp', icon: HelpCircleIcon }
];

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

type Props = {
  items?: DropdownMenuItem[];
  onSelect?: (id: string) => void;
};

const MOBILE_MQ = '(max-width: 639.98px)';

export function SmoothDropdown({ items = defaultMenuItems, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('mcp-guide');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [closedSize, setClosedSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

  const [contentRef, contentBounds] = useMeasure();

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => setClosedSize(mq.matches ? 44 : 40);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const handlePointerOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerOutside);
    }
    return () => document.removeEventListener('pointerdown', handlePointerOutside);
  }, [isOpen]);

  const openHeight = Math.max(closedSize, Math.ceil(contentBounds.height));

  return (
    <div ref={containerRef} className="relative h-11 w-11 shrink-0 not-prose sm:h-10 sm:w-10">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? 220 : closedSize,
          height: isOpen ? openHeight : closedSize,
          borderRadius: isOpen ? 14 : 12
        }}
        transition={{
          type: 'spring',
          damping: 34,
          stiffness: 380,
          mass: 0.8
        }}
        className="ios-dropdown-panel absolute top-0 right-0 cursor-pointer overflow-hidden backdrop-blur-xl origin-top-right z-50"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.8 : 1
          }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center text-fg"
          style={{
            pointerEvents: isOpen ? 'none' : 'auto',
            willChange: 'transform'
          }}
        >
          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} className="size-6 text-fg/55" />
        </motion.div>

        <div ref={contentRef}>
          <motion.div
            layout
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0
            }}
            transition={{
              duration: 0.2,
              delay: isOpen ? 0.08 : 0
            }}
            className="p-2"
            style={{
              pointerEvents: isOpen ? 'auto' : 'none',
              willChange: 'transform'
            }}
          >
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {items.map((item, index) => {
                if (item.id === 'divider') {
                  return (
                    <motion.hr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{ delay: isOpen ? 0.12 + index * 0.015 : 0 }}
                      className="ios-dropdown-divider my-1.5"
                    />
                  );
                }

                const iconRef = item.icon!;
                const isActive = activeItem === item.id;
                const showIndicator = hoveredItem ? hoveredItem === item.id : isActive;

                const itemDuration = 0.15;
                const itemDelay = isOpen ? 0.06 + index * 0.02 : 0;

                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      x: isOpen ? 0 : 8
                    }}
                    transition={{
                      delay: itemDelay,
                      duration: itemDuration,
                      ease: easeOutQuint
                    }}
                    onClick={() => {
                      setActiveItem(item.id);
                      onSelect?.(item.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative m-0 flex cursor-pointer items-center gap-3 rounded-lg py-2! pl-3! text-sm transition-colors duration-200 ease-out ${
                      isActive ? 'text-fg' : 'text-fg/50 hover:text-fg'
                    }`}
                  >
                    {showIndicator && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 rounded-lg ios-dropdown-indicator"
                        transition={{
                          type: 'spring',
                          damping: 30,
                          stiffness: 520,
                          mass: 0.8
                        }}
                      />
                    )}
                    {showIndicator && (
                      <motion.div
                        layoutId="leftBar"
                        className="absolute top-0 bottom-0 left-0 my-auto h-5 w-[3px] rounded-full bg-fg"
                        transition={{
                          type: 'spring',
                          damping: 30,
                          stiffness: 520,
                          mass: 0.8
                        }}
                      />
                    )}
                    <HugeiconsIcon icon={iconRef} className="relative z-10 size-[18px]" />
                    <span className="relative z-10 font-medium">{item.label}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
