'use client';

import React from 'react';

export function KoreaFlag({ className = "w-4 h-3 inline-block" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      className={`inline-block align-middle rounded-[2px] shadow-3xs border border-slate-300/60 dark:border-zinc-700/60 shrink-0 ${className}`}
      aria-label="Cờ Hàn Quốc"
    >
      <rect width="36" height="24" fill="#ffffff" />
      {/* Taegeuk Red/Blue Circle */}
      <path d="M 18 6 A 6 6 0 0 1 18 18 A 3 3 0 0 1 18 12 A 3 3 0 0 0 18 6 Z" fill="#CD2E3A" />
      <path d="M 18 18 A 6 6 0 0 1 18 6 A 3 3 0 0 1 18 12 A 3 3 0 0 0 18 18 Z" fill="#0047A0" />
      {/* 4 Trigrams */}
      <g stroke="#000000" strokeWidth="1.2" strokeLinecap="square">
        {/* Top-Left: Geon */}
        <g transform="translate(10, 7) rotate(33.79)">
          <line x1="-4" y1="-2.2" x2="4" y2="-2.2" />
          <line x1="-4" y1="0" x2="4" y2="0" />
          <line x1="-4" y1="2.2" x2="4" y2="2.2" />
        </g>
        {/* Bottom-Right: Gon */}
        <g transform="translate(26, 17) rotate(33.79)">
          <line x1="-4" y1="-2.2" x2="-0.6" y2="-2.2" /><line x1="0.6" y1="-2.2" x2="4" y2="-2.2" />
          <line x1="-4" y1="0" x2="-0.6" y2="0" /><line x1="0.6" y1="0" x2="4" y2="0" />
          <line x1="-4" y1="2.2" x2="-0.6" y2="2.2" /><line x1="0.6" y1="2.2" x2="4" y2="2.2" />
        </g>
        {/* Top-Right: Gam */}
        <g transform="translate(26, 7) rotate(-33.79)">
          <line x1="-4" y1="-2.2" x2="-0.6" y2="-2.2" /><line x1="0.6" y1="-2.2" x2="4" y2="-2.2" />
          <line x1="-4" y1="0" x2="4" y2="0" />
          <line x1="-4" y1="2.2" x2="-0.6" y2="2.2" /><line x1="0.6" y1="2.2" x2="4" y2="2.2" />
        </g>
        {/* Bottom-Left: Ri */}
        <g transform="translate(10, 17) rotate(-33.79)">
          <line x1="-4" y1="-2.2" x2="4" y2="-2.2" />
          <line x1="-4" y1="0" x2="-0.6" y2="0" /><line x1="0.6" y1="0" x2="4" y2="0" />
          <line x1="-4" y1="2.2" x2="4" y2="2.2" />
        </g>
      </g>
    </svg>
  );
}
