'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import ShadowingTab from '@/components/speaking/shadowing-tab';
import { useTheme } from '@/lib/theme-context';
import { Film, Sparkles, Flame } from 'lucide-react';

export default function ShadowingPage() {
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
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${themeConfig.primaryText} font-extrabold tracking-wide uppercase flex items-center gap-1`}>
                    <Film className="w-3.5 h-3.5" /> LYNKORE VIDEO SHADOWING STUDIO
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Luyện Nhại Video Shadowing Chuẩn K-Style 🎬
                </h1>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Luyện nói nhại theo các đoạn clip YouTube Hàn Quốc thực tế (K-Drama, Vlog đời sống, K-Pop) kèm phụ đề chạy đồng bộ và tính năng lặp phân đoạn.
                </p>
              </div>

              {/* Compact Goal Badge */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-600 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">MỤC TIÊU MỖI NGÀY</span>
                  <span className="text-xs font-black text-slate-900">3 Video Clips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standalone Shadowing Studio Component */}
          <ShadowingTab />
        </main>
      </div>
    </div>
  );
}
