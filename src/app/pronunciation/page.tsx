'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import PronunciationTab from '@/components/speaking/pronunciation-tab';
import { useTheme } from '@/lib/theme-context';
import { Volume2, Sparkles, Flame } from 'lucide-react';

export default function PronunciationPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* Left Sidebar Command Center */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-20 md:pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-6xl w-full mx-auto">
          {/* Hero Header */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${themeConfig.primaryText} font-extrabold tracking-wide uppercase flex items-center gap-1`}>
                    <Volume2 className="w-3.5 h-3.5" /> LYNKORE PRONUNCIATION DRILL
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Phân Biệt Âm &amp; Khẩu Hình Tiếng Hàn 🔊
                </h1>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Bí kíp phân biệt 3 nhóm phụ âm gây khó nhất cho người Việt: Âm nhẹ thường, Âm bật hơi mạnh &amp; Âm căng gãi gọn.
                </p>
              </div>

              {/* Goal Badge */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-emerald-600 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">MỤC TIÊU LẬP TẬP</span>
                  <span className="text-xs font-black text-slate-900">5 Phụ âm / Ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standalone Pronunciation Tab Component */}
          <PronunciationTab />
        </main>
      </div>
    </div>
  );
}
