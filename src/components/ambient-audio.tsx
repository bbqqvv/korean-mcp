'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme-context';

export default function AmbientAudio() {
  const { ambientAudio } = useTheme();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<AudioNode | { stop: () => void }>>([]);

  useEffect(() => {
    stopAllAudio();

    if (ambientAudio === 'none') return;

    const startAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        let ctx = audioCtxRef.current;
        if (!ctx || ctx.state === 'closed') {
          ctx = new AudioCtx();
          audioCtxRef.current = ctx;
        }

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        stopAllAudioNodesOnly();

        if (ambientAudio === 'rain') {
          playRainSound(ctx);
        } else if (ambientAudio === 'lofi') {
          playLofiBeats(ctx);
        } else if (ambientAudio === 'cafe') {
          playCafeAmbience(ctx);
        }
      } catch (err) {
        console.warn('Ambient Audio error:', err);
      }
    };

    startAudio();

    // Unlock audio context on user gesture if browser suspended autoplay
    const unlockAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      stopAllAudio();
    };
  }, [ambientAudio]);

  const stopAllAudioNodesOnly = () => {
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
  };

  const stopAllAudio = () => {
    stopAllAudioNodesOnly();
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  // 1. Natural Soft Binaural Rain (Audible & Soothing)
  const playRainSound = (ctx: AudioContext) => {
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.25;
      b6 = white * 0.115926;
    }

    const rainNoise = ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 850;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.28; // Clear audible gain

    rainNoise.connect(filter1);
    filter1.connect(gainNode);
    gainNode.connect(ctx.destination);

    rainNoise.start();
    activeNodesRef.current.push(rainNoise, filter1, gainNode);
  };

  // 2. Warm Fender Rhodes Lofi Piano (Audible, Clear & Melodic)
  const playLofiBeats = (ctx: AudioContext) => {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.35; // Clear audible volume
    masterGain.connect(ctx.destination);

    // Beautiful Melodic Lofi Progression (Cmaj7 -> Am7 -> Fmaj7 -> G7)
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
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const notes = chordNotes[step % chordNotes.length];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const arpeggioDelay = idx * 0.05;
        const startTime = ctx.currentTime + arpeggioDelay;

        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.12, startTime + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.2);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 2.3);
      });

      step++;
      timerId = setTimeout(playChordStep, 2400);
    };

    playChordStep();

    activeNodesRef.current.push({
      stop: () => {
        if (timerId) clearTimeout(timerId);
      }
    });
  };

  // 3. Acoustic Cafe Ambience (Warm & Pleasant)
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
    filter.frequency.value = 550;
    filter.Q.value = 1.0;

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    activeNodesRef.current.push(noise, filter, gain);
  };

  return null;
}
