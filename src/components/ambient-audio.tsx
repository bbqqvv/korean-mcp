'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme, AudioId } from '@/lib/theme-context';

export default function AmbientAudio() {
  const { ambientAudio } = useTheme();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<AudioNode | { stop: () => void }>>([]);

  useEffect(() => {
    stopAllAudio();

    if (ambientAudio === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

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

  // 1. Natural Soft Binaural Rain
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
      output[i] *= 0.11; // Soothing volume
      b6 = white * 0.115926;
    }

    const rainNoise = ctx.createBufferSource();
    rainNoise.buffer = noiseBuffer;
    rainNoise.loop = true;

    // Dual Cascaded Low-pass filters for ultra-smooth rain sound
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 650;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 320;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.09;

    rainNoise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gainNode);
    gainNode.connect(ctx.destination);

    rainNoise.start();
    activeNodesRef.current.push(rainNoise, filter1, filter2, gainNode);
  };

  // 2. Warm Electric Piano Lofi Chords & Subtle Vinyl Grain
  const playLofiBeats = (ctx: AudioContext) => {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.08; // Soothing volume
    masterGain.connect(ctx.destination);

    // Warm Fender Rhodes Lofi Progression (FM7 -> Em7 -> Dm7 -> Cmaj7)
    const chordNotes = [
      [174.61, 220.0, 261.63, 329.63, 392.0],  // Fmaj7(9)
      [164.81, 196.0, 246.94, 293.66, 349.23], // Em7(9)
      [146.83, 174.61, 220.0, 261.63, 329.63], // Dm7(9)
      [130.81, 164.81, 196.0, 246.94, 329.63]  // Cmaj7(9)
    ];

    let step = 0;
    let timerId: NodeJS.Timeout | null = null;

    const playChordStep = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

      const notes = chordNotes[step % chordNotes.length];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 500;

        const arpeggioDelay = idx * 0.04;
        const startTime = ctx.currentTime + arpeggioDelay;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.035, startTime + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.6);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 2.8);
      });

      step++;
      timerId = setTimeout(playChordStep, 2800);
    };

    playChordStep();

    activeNodesRef.current.push({
      stop: () => {
        if (timerId) clearTimeout(timerId);
      }
    });
  };

  // 3. Acoustic Cafe Ambience
  const playCafeAmbience = (ctx: AudioContext) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    activeNodesRef.current.push(noise, filter, gain);
  };

  return null;
}
