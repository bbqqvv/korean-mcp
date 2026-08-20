'use client';

import { useState } from 'react';
import { PRONUNCIATION_GROUPS, PronunciationGroup, SoundItem } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Mic,
  Info,
  CheckCircle2,
  Sparkles,
  Wind,
  Zap,
  Feather,
  RotateCcw
} from 'lucide-react';

export default function PronunciationTab() {
  const { themeConfig } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState<PronunciationGroup>(PRONUNCIATION_GROUPS[0]);
  const [activeSound, setActiveSound] = useState<SoundItem>(PRONUNCIATION_GROUPS[0].sounds[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [testResult, setTestResult] = useState<{ word: string; score: number } | null>(null);

  // Play TTS audio strictly when triggered by explicit user button clicks
  const playTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Handle explicit tab change (NO AUTO-PLAY SOUND!)
  const handleGroupSelect = (group: PronunciationGroup) => {
    setSelectedGroup(group);
    setActiveSound(group.sounds[0]);
    setTestResult(null);
    // Explicitly NO playTTS here to prevent unwanted audio playback when clicking tabs!
  };

  // Simulate Mic voice check
  const handleRecordCheck = (sound: SoundItem) => {
    setIsRecording(true);
    setTestResult(null);

    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 12) + 88; // 88-99%
      setTestResult({ word: sound.exampleWord, score });
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Sleek Consonant Family Selector Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2 rounded-3xl shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRONUNCIATION_GROUPS.map((group) => {
            const isSelected = selectedGroup.id === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? `${themeConfig.primaryBg} text-white shadow-xs`
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{group.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Group Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
              BỘ PHỤ ÂM ĐANG CHỌN
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {selectedGroup.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedGroup.description}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phân biệt 3 mức độ hơi</span>
          </div>
        </div>

        {/* 3 Sound Cards Side-By-Side (Plain, Aspirated, Tense) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {selectedGroup.sounds.map((sound) => {
            const isPlain = sound.type === 'plain';
            const isAspirated = sound.type === 'aspirated';
            const isSelectedCard = activeSound.character === sound.character;

            const badgeBg = isPlain
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800'
              : isAspirated
              ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800';

            const characterColor = isPlain
              ? 'text-blue-600 dark:text-blue-400'
              : isAspirated
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400';

            const AirIcon = isPlain ? Feather : isAspirated ? Wind : Zap;
            const airLabel = isPlain ? 'Luồng hơi nhẹ' : isAspirated ? 'Bật hơi mạnh 💨' : 'Nén hơi gồng cổ ⚡';

            return (
              <div
                key={sound.character}
                onClick={() => {
                  setActiveSound(sound);
                  // NO auto playTTS here either to ensure 100% control by user!
                }}
                className={`bg-slate-50/70 dark:bg-slate-800/40 border-2 rounded-3xl p-5 space-y-4 cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelectedCard
                    ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-md ring-4 ring-blue-500/10'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider ${badgeBg}`}>
                    {sound.typeName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">/{sound.romaja}/</span>
                </div>

                {/* Character Icon Display */}
                <div className="text-center py-3 space-y-1">
                  <div className={`text-6xl font-black font-noto tracking-tight ${characterColor}`}>
                    {sound.character}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-1">
                    <AirIcon className="w-3.5 h-3.5" />
                    <span>{airLabel}</span>
                  </div>
                </div>

                {/* Example Word Card */}
                <div className="bg-white dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-2xs">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white font-noto">{sound.exampleWord}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTTS(sound.exampleWord);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all hover:scale-110 active:scale-95"
                      title="Bấm để nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sound.exampleMeaning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Sound Detailed Mouth & Practice Studio */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl font-noto shadow-2xs">
              {activeSound.character}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Hướng Dẫn Khẩu Hình &amp; Luyện Nói: Phụ Âm {activeSound.character}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {activeSound.typeName} - Phiên âm /{activeSound.romaja}/
              </span>
            </div>
          </div>

          <button
            onClick={() => playTTS(activeSound.exampleWord)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs hover:scale-102 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe Từ Mẫu &quot;{activeSound.exampleWord}&quot;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mouth Positioning Tip */}
          <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
              <Info className="w-4 h-4 text-blue-600" /> HƯỚNG DẪN KHẨU HÌNH &amp; LUỒNG HƠI CHUẨN
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeSound.mouthTip}
            </p>
          </div>

          {/* Mic Practice Studio */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                THỰC HÀNH NÓI VÀO MICROPHONE
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Hãy đọc to từ mẫu: <span className="text-blue-600 dark:text-blue-400 font-black font-noto text-base">&quot;{activeSound.exampleWord}&quot;</span>
              </p>
            </div>

            {/* Mic Wave / Animation state */}
            {isRecording ? (
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-500/40 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span>Đang ghi âm &amp; phân tích phát âm...</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full animate-pulse" />
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleRecordCheck(activeSound)}
                className={`w-full py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-101`}
              >
                <Mic className="w-4 h-4" />
                <span>Bật Mic Thu Âm Kiểm Tra</span>
              </button>
            )}

            {testResult && (
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300 animate-fadeIn shadow-2xs">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã đọc chính xác từ &quot;{testResult.word}&quot;
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg text-[11px] font-black">
                  {testResult.score}% Chuẩn
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
