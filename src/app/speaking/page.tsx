'use client';

import { useState, Suspense } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useTheme } from '@/lib/theme-context';
import ShadowingTab from '@/components/speaking/shadowing-tab';
import PronunciationTab from '@/components/speaking/pronunciation-tab';
import RoleplayTab from '@/components/speaking/roleplay-tab';
import {
  Mic,
  Volume2,
  MessageSquare,
  Sparkles,
  Award,
  Layers,
  Flame
} from 'lucide-react';

type SubTab = 'shadowing' | 'pronunciation' | 'roleplay';

export default function SpeakingPage() {
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<SubTab>('shadowing');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* Left Sidebar */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-20 md:pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-6xl w-full mx-auto">
          {/* Welcome & Feature Hero Header */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${themeConfig.primaryText} font-extrabold tracking-wide uppercase flex items-center gap-1`}>
                    <Mic className="w-3.5 h-3.5" /> LYNKORE SPEAKING HUB
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Luyện Nói &amp; Phát Âm Chuẩn Giọng Seoul 🇰🇷
                </h1>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Luyện nói nhại Shadowing K-Drama, phân biệt 3 nhóm phụ âm khó trong tiếng Hàn &amp; thực hành đóng vai giao tiếp tình huống 2 chiều.
                </p>
              </div>

              {/* Stats Badge */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-amber-500 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">MỤC TIÊU NÓI</span>
                    <span className="text-xs font-black text-slate-900">5 Mẫu câu / Ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setActiveTab('shadowing')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'shadowing'
                    ? `${themeConfig.primaryBg} text-white shadow-xs scale-102`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>1. Shadowing (Nói Nhại Mẫu)</span>
              </button>

              <button
                onClick={() => setActiveTab('pronunciation')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'pronunciation'
                    ? `${themeConfig.primaryBg} text-white shadow-xs scale-102`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>2. Phân Biệt Âm &amp; Khẩu Hình</span>
              </button>

              <button
                onClick={() => setActiveTab('roleplay')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'roleplay'
                    ? `${themeConfig.primaryBg} text-white shadow-xs scale-102`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>3. Đóng Vai Tình Huống</span>
              </button>
            </div>
          </div>

          {/* Active Sub-Tab View Container */}
          <div>
            {activeTab === 'shadowing' && <ShadowingTab />}
            {activeTab === 'pronunciation' && <PronunciationTab />}
            {activeTab === 'roleplay' && <RoleplayTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
