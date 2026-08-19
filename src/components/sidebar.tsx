'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Award,
  Home,
  Plus,
  X,
  Flame,
  FolderOpen,
  ChevronRight,
  Settings
} from 'lucide-react';

interface SidebarProps {
  categories?: Array<{ name: string; count: number }>;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenCreateModal?: () => void;
}

export default function Sidebar({
  categories = [
    { name: 'Tất cả', count: 9 },
    { name: 'YouTube Video', count: 3 },
    { name: 'Công sở & Địa điểm', count: 2 },
    { name: 'Nhà cửa & Vật dụng', count: 2 },
    { name: 'Giao tiếp hàng ngày', count: 1 },
    { name: 'Nâng cao', count: 1 }
  ],
  activeCategory = 'Tất cả',
  onSelectCategory,
  isOpenMobile = false,
  onCloseMobile,
  onOpenCreateModal
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const mainNavLinks = [
    { href: '/', label: 'Trang Chủ', icon: Home },
    { href: '/quiz', label: 'Ôn Luyện Quiz', icon: Award },
    { href: '/settings', label: 'Cài Đặt Hệ Thống', icon: Settings }
  ];

  const handleCategoryClick = (catName: string) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    if (pathname !== '/') {
      router.push(`/?category=${encodeURIComponent(catName)}`);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 text-slate-900 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8.5 h-8.5 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs font-black text-base">
            한
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">
              LynKore
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mt-1">
              Korean Learning
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Action Button (Bright Taegeuk Crimson Red) */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={() => {
            if (onOpenCreateModal) onOpenCreateModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all hover:shadow-sm"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tạo Bộ Bài AI Mới</span>
        </button>
      </div>

      {/* Main Navigation & Category List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Main Routes */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            ĐIỀU HƯỚNG BÀI HỌC
          </span>
          {mainNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-600" />}
              </Link>
            );
          })}
        </div>

        {/* Category List */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 px-3 block mb-2 flex items-center justify-between">
            <span>DANH MỤC TIẾNG HÀN</span>
            <FolderOpen className="w-3.5 h-3.5" />
          </span>

          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Streak Progress Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-800">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> Chuỗi 5 Ngày
            </span>
            <span className="text-rose-600 text-[11px] font-extrabold">
              32/100 từ
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-600 h-full w-[32%]" />
          </div>
          <p className="text-[10px] text-slate-500 text-center font-medium">
            Học từ vựng tiếng Hàn mỗi ngày 🇰🇷
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
