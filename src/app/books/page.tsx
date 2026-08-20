'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import {
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  FileText,
  Play,
  ArrowRight,
  Bookmark,
  GraduationCap
} from 'lucide-react';

export default function BooksPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Tiếng Hàn Màu Xanh Lá (TOPIK 1 - 6)
  const greenBooks = [
    { id: 'so-cap-1', num: 1, title: 'TOPIK 1', level: 'Sơ cấp 1', href: '/course/so-cap-1' },
    { id: 'so-cap-2', num: 2, title: 'TOPIK 2', level: 'Sơ cấp 2', href: '/course/so-cap-2' },
    { id: 'trung-cap-1', num: 3, title: 'TOPIK 3', level: 'Trung cấp 1', href: '/course/trung-cap-1' },
    { id: 'trung-cap-2', num: 4, title: 'TOPIK 4', level: 'Trung cấp 2', href: '/course/trung-cap-2' },
    { id: 'cao-cap-1', num: 5, title: 'TOPIK 5', level: 'Cao cấp 1', href: '/course/cao-cap-1' },
    { id: 'cao-cap-2', num: 6, title: 'TOPIK 6', level: 'Cao cấp 2', href: '/course/cao-cap-2' }
  ];

  // 2. Tiếng Hàn Màu Sắc (Seoul Book 1 - 6)
  const seoulBooks = [
    { id: 'seoul-1', num: 1, bgColor: 'rgb(255, 212, 0)', textColor: 'rgb(30, 139, 63)', badgeBg: 'rgb(30, 139, 63)', href: '/course/seoul-1' },
    { id: 'seoul-2', num: 2, bgColor: 'rgb(124, 179, 66)', textColor: 'rgb(42, 90, 26)', badgeBg: 'rgb(42, 90, 26)', href: '/course/seoul-2' },
    { id: 'seoul-3', num: 3, bgColor: 'rgb(251, 140, 0)', textColor: 'rgb(191, 54, 12)', badgeBg: 'rgb(191, 54, 12)', href: '/course/seoul-3' },
    { id: 'seoul-4', num: 4, bgColor: 'rgb(30, 136, 229)', textColor: 'rgb(10, 53, 122)', badgeBg: 'rgb(10, 53, 122)', href: '/course/seoul-4' },
    { id: 'seoul-5', num: 5, bgColor: 'rgb(46, 125, 50)', textColor: 'rgb(255, 235, 59)', badgeBg: 'rgb(255, 235, 59)', href: '/course/seoul-5' },
    { id: 'seoul-6', num: 6, bgColor: 'rgb(0, 131, 143)', textColor: 'rgb(255, 214, 0)', badgeBg: 'rgb(255, 214, 0)', href: '/course/seoul-6' }
  ];

  // 3. Tiếng Hàn Màu Vàng (Sejong 1 - 8)
  const sejongBooks = Array.from({ length: 8 }, (_, i) => ({
    id: `sejong-${i + 1}`,
    num: i + 1,
    href: `/course/sejong-${i + 1}`
  }));

  // 4. Tiếng Hàn Đại Học Bản Mới (Yonsei 1 - 6)
  const yonseiBooks = [
    { id: 'yonsei-1', num: 1, color: 'rgb(91, 127, 184)', href: '/course/yonsei-1' },
    { id: 'yonsei-2', num: 2, color: 'rgb(231, 111, 81)', href: '/course/yonsei-2' },
    { id: 'yonsei-3', num: 3, color: 'rgb(42, 157, 143)', href: '/course/yonsei-3' },
    { id: 'yonsei-4', num: 4, color: 'rgb(244, 162, 97)', href: '/course/yonsei-4' },
    { id: 'yonsei-5', num: 5, color: 'rgb(230, 57, 70)', href: '/course/yonsei-5' },
    { id: 'yonsei-6', num: 6, color: 'rgb(91, 44, 130)', href: '/course/yonsei-6' }
  ];

  // 5. Tiếng Hàn Hội Nhập (KIIP 1 & 3)
  const kiipBooks = [
    { id: 'kiip-1', cap: 1, color: 'rgb(217, 119, 6)', href: '/course/kiip-1' },
    { id: 'kiip-3', cap: 3, color: 'rgb(22, 163, 74)', href: '/course/kiip-3' }
  ];

  const categoriesFilter = [
    'Tất cả',
    'Tiếng Hàn Màu Xanh Lá',
    'Tiếng Hàn Màu Sắc',
    'Tiếng Hàn Màu Vàng',
    'Đại Học Bản Mới',
    'Hội Nhập KIIP'
  ];

  // SVG component for Yonsei Banner
  const YonseiBannerSVG = () => (
    <svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="400" height="110" fill="#ffffff" />
      <circle cx="200" cy="55" r="38" fill="#F4A261" opacity="0.35" />
      <g>
        <path d="M 14 26 Q 22 18 30 26 Z" fill="#F4C45A" />
        <circle cx="22" cy="32" r="7" fill="#F5D6A9" />
        <circle cx="19.5" cy="31" r="0.8" fill="#333" />
        <circle cx="24.5" cy="31" r="0.8" fill="#333" />
        <circle cx="18" cy="34" r="1" fill="#F2A0AA" />
        <circle cx="26" cy="34" r="1" fill="#F2A0AA" />
        <path d="M 14 39 L 30 39 L 36 60 L 8 60 Z" fill="#E11D2A" />
        <path d="M 14 39 L 30 39 L 28 43 L 16 43 Z" fill="#ffffff" />
      </g>
      <g>
        <circle cx="68" cy="28" r="6" fill="#F4C45A" />
        <circle cx="65" cy="33.2" r="6" fill="#F4C45A" />
        <circle cx="59" cy="33.2" r="6" fill="#F4C45A" />
        <circle cx="56" cy="28" r="6" fill="#F4C45A" />
        <circle cx="59" cy="22.8" r="6" fill="#F4C45A" />
        <circle cx="65" cy="22.8" r="6" fill="#F4C45A" />
        <circle cx="62" cy="28" r="4.5" fill="#E11D2A" />
        <circle cx="62" cy="28" r="2.1" fill="#ffffff" />
      </g>
    </svg>
  );

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* Sidebar Command Center */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenAITutor={() => setIsAITutorOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-28 md:pb-12 max-w-6xl w-full mx-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* USER PROGRESS DASHBOARD CARD (LYNKORE BRANDED) */}
          <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${themeConfig.primaryText} font-extrabold tracking-wide uppercase flex items-center gap-1`}>
                    <GraduationCap className="w-3.5 h-3.5" /> TIẾN ĐỘ HỌC TIẾNG HÀN CÁ NHÂN
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Chào mừng trở lại, <span className="text-blue-600">Van Bui Quoc</span> 👋
                </h1>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Khám phá toàn bộ 28+ bộ sách giáo trình tiếng Hàn chuẩn hóa dành cho người Việt!
                </p>
              </div>

              <Link
                href="/quiz"
                className={`px-5 py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all shrink-0`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Xem Thống Kê Ôn Luyện</span>
              </Link>
            </div>

            {/* 4 STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
                  <span>Điểm Bảng Xếp Hạng</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  0 / <span className="text-sm text-slate-500 font-bold">#5544</span>
                </div>
                <p className="text-[10px] text-amber-700 font-medium">(Hãy cố gắng hơn nữa nhé!)</p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Từ Vựng Đã Thuộc</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">0%</div>
                <p className="text-[10px] text-emerald-700 font-medium">0 / 100 từ</p>
              </div>

              <Link
                href="/quiz"
                className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-3.5 space-y-1 transition-all hover:bg-indigo-100/80 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Đề TOPIK Đã Làm</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  0 <span className="text-xs font-bold text-slate-500">đề</span>
                </div>
                <p className="text-[10px] text-indigo-700 font-medium">Luyện ngay →</p>
              </Link>

              <Link
                href="/quiz"
                className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3.5 space-y-1 transition-all hover:bg-rose-100/80 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <Award className="w-3.5 h-3.5 text-rose-600" />
                  <span>Tỉ Lệ Đỗ TOPIK</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">—</div>
                <p className="text-[10px] text-rose-700 font-medium">(Ước tính)</p>
              </Link>
            </div>
          </section>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoriesFilter.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? `${themeConfig.primaryBg} text-white shadow-xs`
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SECTION 1: TIẾNG HÀN MÀU XANH LÁ */}
          {(selectedCategory === 'Tất cả' || selectedCategory === 'Tiếng Hàn Màu Xanh Lá') && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="border-l-4 border-blue-600 pl-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" /> Tiếng Hàn Màu Xanh Lá
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Giáo trình luyện thi TOPIK chuẩn 6 cấp độ cho người Việt</p>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                  6 Cuốn
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {greenBooks.map((book) => (
                  <Link key={book.id} href={book.href} className="group">
                    <div className="bg-[#0076BE] border border-slate-900/10 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between p-3">
                      {/* Circle Dot Graphic Pattern */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[88%] aspect-square rounded-full flex items-center justify-center"
                        style={{
                          backgroundImage:
                            'radial-gradient(rgb(255, 255, 255) 20%, transparent 21%), radial-gradient(rgb(255, 255, 255) 20%, transparent 21%)',
                          backgroundPosition: '0px 0px, 6px 6px',
                          backgroundSize: '12px 12px'
                        }}
                      >
                        <div className="w-[74%] aspect-square bg-white rounded-full flex flex-col items-center justify-center text-center px-2 shadow-xs">
                          <span className="font-black text-slate-900 text-base sm:text-xl md:text-2xl tracking-tight uppercase leading-none">
                            TOPIK
                          </span>
                          <span className="text-[7px] sm:text-[9px] italic text-slate-600 mt-1 font-semibold leading-tight">
                            dành cho người Việt
                          </span>
                        </div>
                      </div>

                      {/* Number */}
                      <div className="absolute bottom-2 right-2 flex items-end">
                        <span className="font-black italic text-white text-4xl sm:text-5xl md:text-6xl leading-none">
                          {book.num}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 2: TIẾNG HÀN MÀU SẮC */}
          {(selectedCategory === 'Tất cả' || selectedCategory === 'Tiếng Hàn Màu Sắc') && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="border-l-4 border-emerald-600 pl-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" /> Tiếng Hàn Màu Sắc
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Bộ giáo trình Seoul Student&apos;s Book 6 cấp độ sinh động</p>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  6 Cuốn
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {seoulBooks.map((book) => (
                  <Link key={book.id} href={book.href} className="group">
                    <div
                      className="rounded-2xl border border-slate-900/10 aspect-[3/4] relative overflow-hidden shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 cursor-pointer p-3 flex flex-col justify-between"
                      style={{ backgroundColor: book.bgColor }}
                    >
                      <div className="font-extrabold text-[8px] sm:text-[10px]" style={{ color: book.textColor }}>
                        Dành cho người Việt
                      </div>

                      <div className="text-center my-auto">
                        <h3 className="font-black text-xs sm:text-base leading-none">
                          <span style={{ color: book.textColor }}>Tiếng Hàn</span> <span className="text-white">Màu Sắc</span>
                        </h3>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold" style={{ color: book.textColor }}>
                          Student&apos;s Book
                        </span>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs shadow-xs"
                          style={{ backgroundColor: book.badgeBg }}
                        >
                          {book.num}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3: TIẾNG HÀN MÀU VÀNG (EXACT SVG) */}
          {(selectedCategory === 'Tất cả' || selectedCategory === 'Tiếng Hàn Màu Vàng') && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="border-l-4 border-amber-600 pl-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-amber-600" /> Tiếng Hàn Màu Vàng (Sejong)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Giáo trình tiếng Hàn Hoàng Gia của Vua Sejong (8 Cấp độ)</p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                  8 Cuốn
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {sejongBooks.map((book) => (
                  <Link key={book.id} href={book.href} className="group">
                    <div className="relative aspect-[3/4] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
                        <path d="M0 0 L58 0 L0 64 Z" fill="#E3E6E9" />
                        <path d="M118 20 L300 358 L300 400 L0 400 L0 168 Z" fill="#B27B3E" />
                        <path d="M176 250 L288 400 L64 400 Z" fill="#ffffff" />
                        <path d="M236 300 L300 400 L208 400 Z" fill="#B27B3E" opacity="0.55" />
                      </svg>
                      <div className="absolute top-[5%] right-[9%]">
                        <svg width="20" height="20" viewBox="0 0 40 44" aria-hidden="true">
                          <path d="M20 2 L33 18 L29 18 L20 8 L11 18 L7 18 Z" fill="#2B2B2B" />
                          <circle cx="20" cy="30" r="11" fill="none" stroke="#2B2B2B" strokeWidth="2.4" />
                          <circle cx="20" cy="25.5" r="2.6" fill="#2B2B2B" />
                          <path d="M14.5 36 Q20 28 25.5 36 Z" fill="#2B2B2B" />
                        </svg>
                      </div>
                      <div className="absolute top-[20%] left-[6%] right-[6%] text-center">
                        <p className="text-[9px] font-bold text-slate-700">증보판</p>
                        <h1 className="font-black text-slate-900 text-3xl sm:text-4xl lg:text-5xl mt-0.5">
                          {book.num}
                        </h1>
                      </div>
                      <div className="absolute bottom-[4%] left-0 right-0 flex justify-center">
                        <svg width="20" height="20" viewBox="0 0 36 36" aria-hidden="true">
                          <circle cx="18" cy="9" r="6" fill="#9FB7CC" />
                          <circle cx="26.56" cy="15.22" r="6" fill="#9FB7CC" />
                          <circle cx="23.29" cy="25.28" r="6" fill="#9FB7CC" />
                          <circle cx="12.71" cy="25.28" r="6" fill="#9FB7CC" />
                          <circle cx="9.44" cy="15.22" r="6" fill="#9FB7CC" />
                          <circle cx="18" cy="18" r="6" fill="#fff" />
                          <path d="M18 12 A6 6 0 0 1 18 24 A3 3 0 0 1 18 18 A3 3 0 0 0 18 12 Z" fill="#C8102E" />
                          <path d="M18 24 A6 6 0 0 1 18 12 A3 3 0 0 1 18 18 A3 3 0 0 0 18 24 Z" fill="#003478" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: TIẾNG HÀN ĐẠI HỌC BẢN MỚI */}
          {(selectedCategory === 'Tất cả' || selectedCategory === 'Đại Học Bản Mới') && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="border-l-4 border-rose-600 pl-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-rose-600" /> Tiếng Hàn Đại Học Bản Mới (Yonsei)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Trọng tâm từ vựng &amp; cấu trúc ngữ pháp đại học Hàn Quốc</p>
                </div>
                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
                  6 Cuốn
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {yonseiBooks.map((book) => (
                  <Link key={book.id} href={book.href} className="group">
                    <div className="relative aspect-[3/4] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between">
                      <div className="h-[24%] w-full">
                        <YonseiBannerSVG />
                      </div>
                      <div className="text-center px-2 my-auto">
                        <h3 className="font-black text-slate-900 text-xs sm:text-sm">Tiếng Hàn</h3>
                        <h4 className="font-black text-xs sm:text-sm flex items-center justify-center gap-1 mt-0.5" style={{ color: book.color }}>
                          <span>Đại Học Bản Mới</span>
                          <span className="text-base font-black">{book.num}</span>
                        </h4>
                      </div>
                      <div className="h-[24%] w-full transform -scale-y-100">
                        <YonseiBannerSVG />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5: TIẾNG HÀN HỘI NHẬP (KIIP) */}
          {(selectedCategory === 'Tất cả' || selectedCategory === 'Hội Nhập KIIP') && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="border-l-4 border-indigo-600 pl-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" /> Tiếng Hàn Hội Nhập (KIIP)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Giáo trình hội nhập xã hội Hàn Quốc chính thức</p>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                  2 Cuốn
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kiipBooks.map((book) => (
                  <Link key={book.id} href={book.href} className="group">
                    <div className="bg-[#edf7f2] border border-emerald-200/80 rounded-2xl p-4 shadow-xs group-hover:shadow-md group-hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                          Chương Trình KIIP Cấp {book.cap}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          Tiếng Hàn Hội Nhập Xã Hội Hàn Quốc
                        </h3>
                        <p className="text-xs text-slate-600">
                          Bộ giáo trình xã hội học &amp; từ vựng sống tại Hàn Quốc.
                        </p>
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                          <span>Khám phá chương {book.cap}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="w-24 h-24 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center p-2 text-center shadow-2xs shrink-0">
                        <span className="text-2xl">🏛️</span>
                        <span className="text-[10px] font-black text-slate-900 mt-1">CẤP {book.cap}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {isAITutorOpen && (
        <AITutorDrawer
          card={{
            id: 'card-default',
            korean: '한국어',
            pronunciation: 'han-guk-eo',
            vietnamese: 'Tiếng Hàn Quốc'
          }}
          isOpen={isAITutorOpen}
          onClose={() => setIsAITutorOpen(false)}
        />
      )}
    </div>
  );
}
