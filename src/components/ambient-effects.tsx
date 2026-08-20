'use client';

import React, { useEffect, useState } from 'react';
import { useTheme, EffectId } from '@/lib/theme-context';

export default function AmbientEffects() {
  const { ambientEffect } = useTheme();
  const [particles, setParticles] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number; rotation: number }>>([]);

  useEffect(() => {
    if (ambientEffect === 'none') {
      setParticles([]);
      return;
    }

    // Generate 24 random particles
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // % left position
      duration: 6 + Math.random() * 8, // 6s - 14s fall duration
      delay: Math.random() * 5, // 0s - 5s delay
      size: 10 + Math.random() * 16, // 10px - 26px size
      rotation: Math.random() * 360
    }));

    setParticles(newParticles);
  }, [ambientEffect]);

  if (ambientEffect === 'none' || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {particles.map((p) => {
        let content: React.ReactNode = null;

        if (ambientEffect === 'sakura') {
          content = (
            <span
              className="inline-block text-pink-400/80 drop-shadow-xs"
              style={{ fontSize: `${p.size}px`, transform: `rotate(${p.rotation}deg)` }}
            >
              🌸
            </span>
          );
        } else if (ambientEffect === 'snow') {
          content = (
            <span
              className="inline-block text-sky-200/90 drop-shadow-xs"
              style={{ fontSize: `${p.size}px` }}
            >
              ❄️
            </span>
          );
        } else if (ambientEffect === 'stars') {
          content = (
            <span
              className="inline-block text-amber-300/80 drop-shadow-xs"
              style={{ fontSize: `${p.size}px` }}
            >
              ✨
            </span>
          );
        }

        return (
          <div
            key={p.id}
            className="absolute -top-10 animate-ambientFall"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear'
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
