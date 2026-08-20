'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme, SubStyleId } from '@/lib/theme-context';
import {
  Award,
  Home,
  Plus,
  X,
  Flame,
  FolderOpen,
  ChevronDown,
  ChevronsUpDown,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Settings,
  Keyboard,
  BookOpen,
  Search,
  Bot,
  PanelLeftClose,
  PanelLeft,
  Mic,
  Film,
  Volume2,
  MessageSquare,
  TrendingUp
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
  const { mode, subStyle, ambientEffect, ambientAudio, setMode, setSubStyle, setAmbientEffect, setAmbientAudio, themeConfig } = useTheme();

  const isBooksActive = pathname === '/books' || pathname.startsWith('/course');
  const isSpeakingActive =
    pathname === '/speaking' ||
    pathname === '/shadowing' ||
    pathname === '/pronunciation' ||
    pathname === '/roleplay';

  const [isBooksExpanded, setIsBooksExpanded] = useState(true);
  const [isSpeakingExpanded, setIsSpeakingExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const mainNavLinks = [
    { href: '/', label: 'Trang Chủ', icon: Home },
    { href: '/progress', label: 'Tiến Trình Học Tập', icon: TrendingUp },
    { href: '/speaking', label: 'Luyện Nói', icon: Mic, isSpeaking: true },
    { href: '/ai-tutor', label: 'Trợ Lý AI', icon: Bot },
    { href: '/books', label: 'Sách & Giáo Trình', icon: BookOpen, isBooks: true },
    { href: '/dictionary', label: 'Tra Từ Điển', icon: Search },
    { href: '/typing', label: 'Luyện Gõ Phím', icon: Keyboard },
    { href: '/quiz', label: 'Ôn Luyện Quiz', icon: Award },
    { href: '/settings', label: 'Cài Đặt Hệ Thống', icon: Settings }
  ];

  const speakingSubMenu = [
    { label: 'Shadowing Video', href: '/shadowing', icon: Film, color: 'text-blue-600' },
    { label: 'Phân Biệt Âm', href: '/pronunciation', icon: Volume2, color: 'text-emerald-600' },
    { label: 'Đóng Vai Roleplay', href: '/roleplay', icon: MessageSquare, color: 'text-amber-600' }
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
        className={`flex flex-col h-full bg-white shadow-xs text-slate-900 select-none transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header & Collapse Toggle Button */}
        <div className="p-3.5">
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
                  <span className="font-bold text-lg tracking-tight text-slate-900 block leading-none">
                    LynKore
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-1">
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
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                ĐIỀU HƯỚNG BÀI HỌC
              </span>
            )}
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.isSpeaking
                ? isSpeakingActive
                : link.isBooks
                ? isBooksActive
                : pathname === link.href;

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

              if (link.isSpeaking) {
                return (
                  <div key={link.href} className="space-y-1">
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? `${themeConfig.badgeBg} ${themeConfig.primaryText} font-semibold`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        setIsSpeakingExpanded(!isSpeakingExpanded);
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? themeConfig.primaryText : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 ${isActive ? themeConfig.primaryText : 'text-slate-400'} transition-transform ${
                          isSpeakingExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Submenu for Speaking */}
                    {isSpeakingExpanded && (
                      <div className="pl-7 space-y-1 pt-0.5">
                        {speakingSubMenu.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={onCloseMobile}
                              className={`flex items-center gap-2 py-1.5 px-2.5 text-[11px] font-medium rounded-xl transition-all ${
                                isSubActive
                                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : sub.color}`} />
                              <span className="truncate">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? `${themeConfig.badgeBg} ${themeConfig.primaryText} font-semibold`
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

        {/* Footer Profile Component */}
        <div className="p-2.5 bg-white relative">
          {isCollapsed ? (
            <button
              onClick={() => router.push('/settings')}
              className="w-10 h-10 mx-auto rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
              title="LynKore Learner (Tài khoản)"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                LK
              </div>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-full p-2 rounded-xl hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-2.5 group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    LK
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-900 block truncate leading-tight group-hover:text-blue-600 transition-colors">
                      LynKore Learner
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal block truncate">
                      learner@lynkore.edu.vn
                    </span>
                  </div>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Profile Popover Menu (Pops Out to the Right Side Outside Sidebar) */}
              {isProfileMenuOpen && (
                <>
                  {/* Backdrop overlay to close on outside click */}
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />

                  <div className="absolute left-[calc(100%+10px)] bottom-0 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-3.5 space-y-3 z-50 animate-fadeIn">
                    {/* User Header */}
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        LK
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">
                          LynKore Learner
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal block truncate">
                          learner@lynkore.edu.vn
                        </span>
                      </div>
                    </div>

                    {/* Top 3 Main Mode Tabs (Exact Layout from Image 1!) */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <button
                        onClick={() => setMode('light')}
                        className={`flex-1 py-1.5 px-1 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                          mode === 'light'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Sáng
                      </button>
                      <button
                        onClick={() => setMode('dark')}
                        className={`flex-1 py-1.5 px-1 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                          mode === 'dark'
                            ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-blue-400" /> Tối
                      </button>
                      <button
                        onClick={() => setMode('system')}
                        className={`flex-1 py-1.5 px-1 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                          mode === 'system'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5 text-slate-400" /> Tự động
                      </button>
                    </div>

                    {/* Sub-Options Color Grid (4 Buttons matching Image 1!) */}
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {(
                        [
                          { id: 'default', label: 'Dimmed', colorBg: mode === 'dark' ? 'bg-[#1c2128]' : 'bg-slate-100', dot: 'bg-slate-400' },
                          { id: 'purple', label: 'Tím', colorBg: mode === 'dark' ? 'bg-[#2a123d]' : 'bg-purple-100', dot: 'bg-purple-500' },
                          { id: 'pink', label: 'Hồng', colorBg: mode === 'dark' ? 'bg-[#3b1223]' : 'bg-pink-100', dot: 'bg-pink-500' },
                          { id: 'blue', label: 'Xanh', colorBg: mode === 'dark' ? 'bg-[#0e2a47]' : 'bg-sky-100', dot: 'bg-sky-500' }
                        ] as const
                      ).map((item) => {
                        const isSelected = subStyle === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSubStyle(item.id as SubStyleId)}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20 text-blue-600 dark:text-blue-400 font-bold'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 font-medium'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 ${item.colorBg} flex items-center justify-center shadow-2xs`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                            </span>
                            <span className="text-[10px] truncate w-full text-center leading-none">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Ambient Effects Section */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Hiệu ứng môi trường
                      </span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: 'none', label: 'Tắt 🚫' },
                          { id: 'sakura', label: 'Anh Đào 🌸' },
                          { id: 'snow', label: 'Tuyết ❄️' },
                          { id: 'stars', label: 'Sao ✨' }
                        ].map((ef) => (
                          <button
                            key={ef.id}
                            onClick={() => setAmbientEffect(ef.id as any)}
                            className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all text-center ${
                              ambientEffect === ef.id
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {ef.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ambient Audio / Lofi Beats Section */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Nhạc nền Lofi & Ambient
                        </span>
                        {ambientAudio !== 'none' && (
                          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 animate-pulse flex items-center gap-0.5">
                            <Volume2 className="w-2.5 h-2.5" /> Đang phát
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: 'none', label: 'Tắt 🔇' },
                          { id: 'lofi', label: 'Lofi 🎵' },
                          { id: 'rain', label: 'Mưa 🌧️' },
                          { id: 'cafe', label: 'Cà phê ☕' }
                        ].map((au) => (
                          <button
                            key={au.id}
                            onClick={() => setAmbientAudio(au.id as any)}
                            className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all text-center ${
                              ambientAudio === au.id
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {au.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Settings Item */}
                    <div className="space-y-0.5 text-xs font-medium pt-0.5">
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Thiết lập Tài khoản</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-medium transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
