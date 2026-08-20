'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme, AudioId } from '@/lib/theme-context';

export default function AmbientAudio() {
  const { ambientAudio } = useTheme();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<AudioNode | { stop: () => void }>>([]);

  useEffect(() => {
    // Stop previous audio nodes
    stopAllAudio();

    if (ambientAudio === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ambientAudio === 'rain') {
        playRainSound(ctx);
      } else if (ambientAudio === 'lofi') {
        playLofiBeats(ctx);
      } else if (ambientAudio === 'cafe') {
        playCafeAmbience(ctx);
      }
    } catch (err) {
      console.warn('Ambient Audio initialization error:', err);
    }

    return () => {
      stopAllAudio();
    };
  }, [ambientAudio]);

  const stopAllAudio = () => {
    activeNodesRef.current.forEach((item) => {
      try {
        if ('stop' in item && typeof item.stop === 'function') {
          item.stop();
        } else if ('disconnect' in item && typeof item.disconnect === 'function') {
          (item as AudioNode).disconnect();
        }
      } catch {}
    });
    activeNodesRef.current = [];

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  // 1. Cozy Rain Noise Generator
  const playRainSound = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low-pass filter for cozy rain sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.12;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    activeNodesRef.current.push(whiteNoise, filter, gainNode);
  };

  // 2. Chill Lofi Chords & Beat Synth Loop
  const playLofiBeats = (ctx: AudioContext) => {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);

    // Warm Lofi Chord Frequencies (Cmaj7 / Am7 vibe)
    const chordNotes = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23]  // G7
    ];

    let step = 0;
    let timerId: NodeJS.Timeout | null = null;

    const playChordStep = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

      const notes = chordNotes[step % chordNotes.length];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        // Warm Lofi Envelope
        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3.0);
      });

      step++;
      timerId = setTimeout(playChordStep, 3000);
    };

    playChordStep();

    activeNodesRef.current.push({
      stop: () => {
        if (timerId) clearTimeout(timerId);
      }
    });
  };

  // 3. Cafe Ambience Generator
  const playCafeAmbience = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.08;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    activeNodesRef.current.push(noise, filter, gain);
  };

  return null;
}
