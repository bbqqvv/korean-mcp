'use client';

import { Menu, Search, Sparkles, Plus, Bot } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenMobileSidebar?: () => void;
  onOpenCreateModal?: () => void;
  onOpenAITutor?: () => void;
}

export default function Header({
  searchQuery = '',
  onSearchChange,
  onOpenMobileSidebar,
  onOpenCreateModal,
  onOpenAITutor
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 px-4 sm:px-6 h-16 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          title="Mở Menu Danh Mục"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bài học, từ vựng tiếng Hàn..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCreateModal}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo Bài AI</span>
        </button>

        {onOpenAITutor && (
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-full transition-all"
            title="Hỏi Gia sư AI"
          >
            <Bot className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Hỏi AI</span>
          </button>
        )}
      </div>
    </header>
  );
}
