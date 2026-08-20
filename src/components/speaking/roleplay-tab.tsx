'use client';

import { useState, useEffect } from 'react';
import { ROLEPLAY_SCENARIOS, RoleplayScenario, DialogueLine } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  Send,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Award,
  ArrowRight
} from 'lucide-react';

export default function RoleplayTab() {
  const { themeConfig } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario>(ROLEPLAY_SCENARIOS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [dialogueHistory, setDialogueHistory] = useState<DialogueLine[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize first line of dialogue when scenario changes
  useEffect(() => {
    resetScenario(selectedScenario);
  }, [selectedScenario]);

  const resetScenario = (scenario: RoleplayScenario) => {
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    const firstLine = scenario.dialogue[0];
    setDialogueHistory(firstLine ? [firstLine] : []);
    setIsCompleted(false);
  };

  const playTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // User responds to dialogue step
  const handleUserRespond = (spokenText?: string) => {
    const nextStepIdx = currentStepIndex + 1;
    const currentLine = selectedScenario.dialogue[currentStepIndex + 1];

    if (!currentLine) {
      setIsCompleted(true);
      return;
    }

    // Add user response to history
    const userLine = currentLine;
    setDialogueHistory((prev) => [...prev, userLine]);
    setCurrentStepIndex(nextStepIdx);

    // Check if there is a following system response
    const followUpIdx = nextStepIdx + 1;
    const followUpLine = selectedScenario.dialogue[followUpIdx];

    if (followUpLine && followUpLine.speaker === 'system') {
      setTimeout(() => {
        setDialogueHistory((prev) => [...prev, followUpLine]);
        setCurrentStepIndex(followUpIdx);
        playTTS(followUpLine.korean);

        if (followUpIdx >= selectedScenario.dialogue.length - 1) {
          setIsCompleted(true);
        }
      }, 1000);
    } else if (nextStepIdx >= selectedScenario.dialogue.length - 1) {
      setIsCompleted(true);
    }
  };

  const handleMicResponse = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleUserRespond();
    }, 1800);
  };

  const currentDialogue = selectedScenario.dialogue[currentStepIndex];
  const isUserTurn = currentDialogue && currentDialogue.speaker === 'user';

  return (
    <div className="space-y-6">
      {/* Scenario Selector Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLEPLAY_SCENARIOS.map((scenario) => {
          const isSelected = selectedScenario.id === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => resetScenario(scenario)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? `bg-white ${themeConfig.accentRing} shadow-md`
                  : 'bg-white border-slate-200/80 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                  {scenario.category}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                  <MapPin className="w-3 h-3 text-slate-400" /> {scenario.location}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900">{scenario.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Roleplay Chat Simulator */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 shadow-xs space-y-6">
        {/* Scenario Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              ĐANG THỰC HÀNH KỊCH BẢN
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{selectedScenario.title}</span>
              <span className="text-xs text-slate-500 font-semibold">({selectedScenario.avatar})</span>
            </h3>
          </div>

          <button
            onClick={() => resetScenario(selectedScenario)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thực Hành Lai Từ Đầu</span>
          </button>
        </div>

        {/* Dialogue Feed Window */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 min-h-[280px] max-h-[420px] overflow-y-auto">
          {dialogueHistory.map((line, idx) => {
            const isSystem = line.speaker === 'system';
            return (
              <div
                key={idx}
                className={`flex flex-col space-y-1 animate-fadeIn ${
                  isSystem ? 'items-start' : 'items-end'
                }`}
              >
                <span className="text-[10px] font-extrabold text-slate-400 px-1">
                  {line.speakerName}
                </span>

                <div
                  className={`max-w-md p-4 rounded-2xl space-y-1.5 text-xs sm:text-sm font-medium border shadow-2xs ${
                    isSystem
                      ? 'bg-white text-slate-900 border-slate-200 rounded-tl-none'
                      : `${themeConfig.primaryBg} text-white border-transparent rounded-tr-none`
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 font-noto font-extrabold">
                    <span>{line.korean}</span>
                    {isSystem && (
                      <button
                        onClick={() => playTTS(line.korean)}
                        className="p-1 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    )}
                  </div>
                  <p className={`text-[11px] ${isSystem ? 'text-slate-500' : 'text-blue-100'}`}>
                    {line.vietnamese}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Scenario Completed Banner */}
          {isCompleted && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-2 animate-fadeIn">
              <Award className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-black text-emerald-950">
                🎉 Hoàn Thành Kịch Bản Giao Tiếp!
              </h4>
              <p className="text-xs text-emerald-800 font-medium max-w-md mx-auto">
                Bạn đã hoàn thành xuất sắc đối thoại hội thoại thực tế. Hãy thử chọn kịch bản tiếp theo!
              </p>
            </div>
          )}
        </div>

        {/* User Interaction Control Box */}
        {!isCompleted && isUserTurn && currentDialogue && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" /> LƯỢT NÓI CỦA BẠN:
              </span>
              {currentDialogue.hints && (
                <div className="flex items-center gap-1">
                  {currentDialogue.hints.map((hint, hIdx) => (
                    <span key={hIdx} className="text-[10px] bg-white text-blue-700 font-extrabold px-2 py-0.5 rounded-md border border-blue-200">
                      💡 {hint}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Response Pill */}
            <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block">GỢI Ý CÂU TRẢ LỜI CỦA BẠN:</span>
              <p className="text-sm font-black text-slate-900 font-noto">
                {currentDialogue.suggestedResponse || currentDialogue.korean}
              </p>
              <p className="text-xs text-slate-500">{currentDialogue.vietnamese}</p>
            </div>

            {/* Mic and Fast Send Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleMicResponse}
                disabled={isRecording}
                className={`flex-1 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]`}
              >
                <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse text-amber-300' : ''}`} />
                <span>{isRecording ? 'Đang lắng nghe...' : 'Bấm Mic Nói Trực Tiếp'}</span>
              </button>

              <button
                onClick={() => handleUserRespond(currentDialogue.suggestedResponse)}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                title="Gửi phản hồi nhanh"
              >
                <span>Gửi Đáp Án</span>
                <Send className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
