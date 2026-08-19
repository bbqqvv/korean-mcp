'use client';

import { Menu, Search, Bot } from 'lucide-react';

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
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          title="Mở Menu Danh Mục"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm bài học, từ vựng tiếng Hàn..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right: AI Assistant Action */}
      {onOpenAITutor && (
        <button
          onClick={onOpenAITutor}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-xs transition-all"
        >
          <Bot className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Hỏi Gia Sư AI</span>
        </button>
      )}
    </header>
  );
}
