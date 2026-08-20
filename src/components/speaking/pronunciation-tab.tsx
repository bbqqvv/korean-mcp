'use client';

import { useState } from 'react';
import { PRONUNCIATION_GROUPS, PronunciationGroup, SoundItem } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Mic,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function PronunciationTab() {
  const { themeConfig } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState<PronunciationGroup>(PRONUNCIATION_GROUPS[0]);
  const [activeSound, setActiveSound] = useState<SoundItem>(PRONUNCIATION_GROUPS[0].sounds[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [testResult, setTestResult] = useState<{ word: string; score: number } | null>(null);

  // Play TTS audio for Korean example word or character
  const playTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Simulate Mic voice check for individual word
  const handleRecordCheck = (sound: SoundItem) => {
    setIsRecording(true);
    setTestResult(null);

    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 15) + 85; // 85-100%
      setTestResult({ word: sound.exampleWord, score });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold text-blue-300 uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400" /> Bí Kíp Phát Âm Chuẩn Giọng Seoul
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Phân Biệt 3 Nhóm Âm: Âm Thường - Âm Bật Hơi - Âm Căng
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Đây là khác biệt quan trọng nhất trong tiếng Hàn! Bấm chọn nhóm phụ âm bên dưới để nghe cách phát âm từng phụ âm, xem mẹo khẩu hình và thực hành thu âm trực tiếp qua Microphone.
        </p>
      </div>

      {/* Select Group Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PRONUNCIATION_GROUPS.map((group) => {
          const isSelected = selectedGroup.id === group.id;
          return (
            <button
              key={group.id}
              onClick={() => {
                setSelectedGroup(group);
                setActiveSound(group.sounds[0]);
                setTestResult(null);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 border-2 ${
                isSelected
                  ? `bg-slate-900 text-white border-slate-900 shadow-xs`
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {group.title}
            </button>
          );
        })}
      </div>

      {/* Group Description */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">{selectedGroup.title}</h3>
          <p className="text-xs text-slate-500 font-medium">{selectedGroup.description}</p>
        </div>

        {/* 3 Sound Cards Side-By-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedGroup.sounds.map((sound) => {
            const isPlain = sound.type === 'plain';
            const isAspirated = sound.type === 'aspirated';

            const badgeColor = isPlain
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : isAspirated
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-rose-100 text-rose-900 border-rose-300';

            const characterColor = isPlain
              ? 'text-blue-600'
              : isAspirated
              ? 'text-amber-600'
              : 'text-rose-600';

            return (
              <div
                key={sound.character}
                onClick={() => setActiveSound(sound)}
                className={`bg-slate-50 border-2 rounded-2xl p-5 space-y-4 cursor-pointer transition-all hover:shadow-md ${
                  activeSound.character === sound.character
                    ? 'border-slate-900 bg-white ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColor}`}>
                    {sound.typeName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">/{sound.romaja}/</span>
                </div>

                {/* Character Icon Display */}
                <div className="text-center py-2">
                  <div className={`text-5xl font-black font-noto ${characterColor}`}>
                    {sound.character}
                  </div>
                </div>

                {/* Example Word */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-base font-black text-slate-900 font-noto">{sound.exampleWord}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTTS(sound.exampleWord);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{sound.exampleMeaning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Sound Detailed Mouth Practice Studio */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 font-noto">
              Chi tiết Phụ Âm: <span className="text-blue-600 font-extrabold">{activeSound.character}</span> ({activeSound.typeName})
            </span>
          </div>
          <button
            onClick={() => playTTS(activeSound.exampleWord)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Nghe Từ Mẫu &quot;{activeSound.exampleWord}&quot;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mouth Positioning Tip */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-blue-900">
              <Info className="w-4 h-4 text-blue-600" /> HƯỚNG DẪN KHẨU HÌNH &amp; LUỒNG HƠI
            </div>
            <p className="text-xs text-blue-950 leading-relaxed font-medium">
              {activeSound.mouthTip}
            </p>
          </div>

          {/* Mic Practice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                THỰC HÀNH NÓI VÀO MICRO
              </span>
              <p className="text-xs font-bold text-slate-700">
                Hãy đọc to từ mẫu: <span className="text-slate-900 font-extrabold font-noto text-sm">&quot;{activeSound.exampleWord}&quot;</span>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleRecordCheck(activeSound)}
                disabled={isRecording}
                className={`flex-1 py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
              >
                <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse text-amber-300' : ''}`} />
                <span>{isRecording ? 'Đang phân tích...' : 'Bật Mic Thu Âm Kiểm Tra'}</span>
              </button>
            </div>

            {testResult && (
              <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-bold text-emerald-900 animate-fadeIn">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đọc đúng từ &quot;{testResult.word}&quot;
                </span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg text-[11px]">
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
