'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import {
  Award,
  Home,
  Plus,
  X,
  Flame,
  FolderOpen,
  ChevronDown,
  Settings,
  Keyboard,
  BookOpen,
  Search,
  Bot,
  PanelLeftClose,
  PanelLeft,
  Mic
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
  const { themeConfig } = useTheme();

  const isBooksActive = pathname === '/books' || pathname.startsWith('/course');
  const [isBooksExpanded, setIsBooksExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavLinks = [
    { href: '/', label: 'Trang Chủ', icon: Home },
    { href: '/speaking', label: 'Luyện Nói & Shadowing', icon: Mic },
    { href: '/ai-tutor', label: 'Trợ Lý AI', icon: Bot },
    { href: '/books', label: 'Sách & Giáo Trình', icon: BookOpen, isBooks: true },
    { href: '/dictionary', label: 'Tra Từ Điển', icon: Search },
    { href: '/typing', label: 'Luyện Gõ Phím', icon: Keyboard },
    { href: '/quiz', label: 'Ôn Luyện Quiz', icon: Award },
    { href: '/settings', label: 'Cài Đặt Hệ Thống', icon: Settings }
  ];

  const bookSubMenu = [
    { label: 'TOPIK Xanh Lá', color: 'bg-blue-600' },
    { label: 'Seoul Màu Sắc', color: 'bg-emerald-600' },
    { label: 'Sejong Màu Vàng', color: 'bg-amber-600' },
    { label: 'Yonsei Đại Học', color: 'bg-rose-600' },
    { label: 'Hội Nhập KIIP', color: 'bg-indigo-600' }
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

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-all duration-300 ease-in-out shrink-0`}
    >
      <div
        className={`flex flex-col h-full bg-white border-r border-slate-200/80 text-slate-900 select-none transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header & Collapse Toggle Button */}
        <div className="p-3.5 border-b border-slate-100">
          {isCollapsed ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Link href="/" title="Trang chủ LynKore">
                <Image
                  src="/krlogo.png"
                  alt="LynKore Logo"
                  width={34}
                  height={34}
                  className="w-8.5 h-8.5 rounded-xl object-contain hover:scale-105 transition-transform shadow-xs"
                />
              </Link>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Mở rộng Sidebar"
              >
                <PanelLeft className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/krlogo.png"
                  alt="LynKore Logo"
                  width={34}
                  height={34}
                  className="w-8.5 h-8.5 rounded-xl object-contain group-hover:scale-105 transition-transform shadow-xs shrink-0"
                />
                <div>
                  <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">
                    LynKore
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mt-1">
                    Korean Learning
                  </span>
                </div>
              </Link>

              {/* Desktop Sidebar Collapse Toggle Button */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                title="Thu hẹp Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Navigation & Category List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Main Routes */}
          <div className="space-y-1.5">
            {!isCollapsed && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                ĐIỀU HƯỚNG BÀI HỌC
              </span>
            )}
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.isBooks ? isBooksActive : pathname === link.href;

              if (isCollapsed) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onCloseMobile}
                    title={link.label}
                    className={`w-11 h-11 mx-auto rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.href === '/ai-tutor' ? (
                      <Image
                        src="/krlogo.png"
                        alt="LynKore AI"
                        width={22}
                        height={22}
                        className="w-5.5 h-5.5 rounded-md object-contain shrink-0"
                      />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </Link>
                );
              }

              if (link.isBooks) {
                return (
                  <div key={link.href} className="space-y-1">
                    <div
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? `${themeConfig.badgeBg} font-bold`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        if (!isActive) {
                          router.push(link.href);
                          if (onCloseMobile) onCloseMobile();
                        } else {
                          setIsBooksExpanded(!isBooksExpanded);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? themeConfig.primaryText : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 ${isActive ? themeConfig.primaryText : 'text-slate-400'} transition-transform ${
                          isBooksExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Submenu for Books */}
                    {isActive && isBooksExpanded && (
                      <div className="pl-8 space-y-1 pt-0.5">
                        {bookSubMenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href="/books"
                            onClick={onCloseMobile}
                            className="flex items-center gap-2 py-1.5 px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? `${themeConfig.badgeBg} font-bold`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {link.href === '/ai-tutor' ? (
                      <Image
                        src="/krlogo.png"
                        alt="LynKore AI"
                        width={18}
                        height={18}
                        className="w-4 h-4 rounded-md object-contain shrink-0"
                      />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? themeConfig.primaryText : 'text-slate-400'}`} />
                    )}
                    <span>{link.label}</span>
                  </div>
                  {isActive && <div className={`w-1.5 h-1.5 rounded-full ${themeConfig.primaryBg}`} />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Streak Progress Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 pb-4">
          {isCollapsed ? (
            <div
              className="w-11 h-11 mx-auto rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-2xs cursor-pointer hover:scale-105 transition-transform"
              title="Chuỗi 5 Ngày (32/100 từ)"
            >
              <Flame className="w-5 h-5 text-amber-500 fill-current" />
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-slate-800">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" /> Chuỗi 5 Ngày
                </span>
                <span className="text-[10px] text-blue-600">32/100 từ</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[32%]" />
              </div>
              <p className="text-[10px] text-slate-400 italic">«Học từ vựng tiếng Hàn mỗi ngày»</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
