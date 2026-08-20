'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import { Play, Zap, Percent, FileText, Award, Crown, Home, Sun, Trees, Circle } from 'lucide-react';

export default function BooksPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  // Section 1: Green Books (TOPIK)
  const greenBooks = [
    { id: 'so-cap-1', num: 1, title: 'TOPIK 1', level: 'Sơ cấp 1', href: '/course/so-cap-1' },
    { id: 'so-cap-2', num: 2, title: 'TOPIK 2', level: 'Sơ cấp 2', href: '/course/so-cap-2' },
    { id: 'trung-cap-1', num: 3, title: 'TOPIK 3', level: 'Trung cấp 1', href: '/course/trung-cap-1' },
    { id: 'trung-cap-2', num: 4, title: 'TOPIK 4', level: 'Trung cấp 2', href: '/course/trung-cap-2' },
    { id: 'cao-cap-1', num: 5, title: 'TOPIK 5', level: 'Cao cấp 1', href: '/course/cao-cap-1' },
    { id: 'cao-cap-2', num: 6, title: 'TOPIK 6', level: 'Cao cấp 2', href: '/course/cao-cap-2' }
  ];

  // Section 2: Colorful Seoul Books
  const seoulBooks = [
    {
      id: 'seoul-1',
      num: 1,
      bgColor: 'rgb(255, 212, 0)',
      textColor: 'rgb(30, 139, 63)',
      badgeBg: 'rgb(30, 139, 63)',
      href: '/course/seoul-1'
    },
    {
      id: 'seoul-2',
      num: 2,
      bgColor: 'rgb(124, 179, 66)',
      textColor: 'rgb(42, 90, 26)',
      badgeBg: 'rgb(42, 90, 26)',
      href: '/course/seoul-2'
    },
    {
      id: 'seoul-3',
      num: 3,
      bgColor: 'rgb(251, 140, 0)',
      textColor: 'rgb(191, 54, 12)',
      badgeBg: 'rgb(191, 54, 12)',
      href: '/course/seoul-3'
    },
    {
      id: 'seoul-4',
      num: 4,
      bgColor: 'rgb(30, 136, 229)',
      textColor: 'rgb(10, 53, 122)',
      badgeBg: 'rgb(10, 53, 122)',
      href: '/course/seoul-4'
    },
    {
      id: 'seoul-5',
      num: 5,
      bgColor: 'rgb(46, 125, 50)',
      textColor: 'rgb(255, 235, 59)',
      badgeBg: 'rgb(255, 235, 59)',
      href: '/course/seoul-5'
    },
    {
      id: 'seoul-6',
      num: 6,
      bgColor: 'rgb(0, 131, 143)',
      textColor: 'rgb(255, 214, 0)',
      badgeBg: 'rgb(255, 214, 0)',
      href: '/course/seoul-6'
    }
  ];

  // Section 3: Yellow King Books (Tiếng Hàn Màu Vàng - 8 Books)
  const yellowKingBooks = Array.from({ length: 8 }, (_, i) => ({
    id: `vua-${i + 1}`,
    num: i + 1,
    href: `/course/vua-${i + 1}`
  }));

  // Section 4: University New Version Books (Tiếng Hàn Đại Học Bản Mới - 6 Books)
  const universityBooks = Array.from({ length: 6 }, (_, i) => ({
    id: `dai-hoc-${i + 1}`,
    num: i + 1,
    href: `/course/dai-hoc-${i + 1}`
  }));

  // Section 5: KIIP Integration Books (Tiếng Hàn Hội Nhập - KIIP)
  const kiipBooks = [
    { id: 'kiip-1', cap: 1, capColor: 'bg-amber-500 text-white', href: '/course/kiip-1' },
    { id: 'kiip-3', cap: 3, capColor: 'bg-emerald-600 text-white', href: '/course/kiip-3' }
  ];

  // Helper for polygon grid tiles in "Tiếng Hàn Màu Sắc"
  const gridColors = [
    [
      { c1: 'rgb(230, 57, 70)', c2: 'rgb(29, 53, 87)' },
      { c1: 'rgb(42, 157, 143)', c2: 'rgb(241, 196, 83)' },
      { c1: 'rgb(241, 196, 83)', c2: 'rgb(10, 110, 58)' },
      { c1: 'rgb(91, 44, 130)', c2: 'rgb(231, 111, 81)' }
    ],
    [
      { c1: 'rgb(230, 57, 70)', c2: 'rgb(91, 44, 130)' },
      { c1: 'rgb(42, 157, 143)', c2: 'rgb(244, 162, 97)' },
      { c1: 'rgb(241, 196, 83)', c2: 'rgb(6, 167, 125)' },
      { c1: 'rgb(91, 44, 130)', c2: 'rgb(230, 57, 70)' }
    ],
    [
      { c1: 'rgb(230, 57, 70)', c2: 'rgb(38, 70, 83)' },
      { c1: 'rgb(42, 157, 143)', c2: 'rgb(255, 212, 0)' },
      { c1: 'rgb(241, 196, 83)', c2: 'rgb(42, 157, 143)' },
      { c1: 'rgb(91, 44, 130)', c2: 'rgb(156, 44, 44)' }
    ],
    [
      { c1: 'rgb(230, 57, 70)', c2: 'rgb(29, 53, 87)' },
      { c1: 'rgb(42, 157, 143)', c2: 'rgb(241, 196, 83)' },
      { c1: 'rgb(241, 196, 83)', c2: 'rgb(10, 110, 58)' },
      { c1: 'rgb(91, 44, 130)', c2: 'rgb(231, 111, 81)' }
    ]
  ];

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenAITutor={() => setIsAITutorOpen(true)}
        />

        <main className="relative flex flex-col gap-8 min-h-[calc(98vh-24px)] px-4 lg:px-8 py-8 max-w-[1215px] mx-auto w-full overflow-y-auto pb-32 md:pb-16">
          {/* USER PROGRESS DASHBOARD CARD */}
          <div className="w-full bg-secondary-background border-2 border-border rounded-base shadow-shadow p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs text-slate-500 font-heading uppercase tracking-wide">
                  Tiến độ học của bạn
                </p>
                <h2 className="text-xl lg:text-2xl font-heading text-slate-900">
                  Chào, <span className="bg-blue-100 px-1.5 py-0.5 rounded-md text-blue-900">Van Bui Quoc</span> 👋
                </h2>
              </div>

              <Link
                href="/quiz"
                className="inline-flex items-center gap-1.5 bg-main text-main-foreground px-4 py-2 rounded-base border-2 border-border font-heading text-sm shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Xem thống kê</span>
              </Link>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="rounded-base border-2 border-border shadow-shadow p-3 flex flex-col gap-1 bg-yellow-100 text-slate-900">
                <div className="flex items-center gap-1.5 text-xs font-heading text-slate-700">
                  <Zap className="h-4 w-4 text-green-700 fill-current" />
                  <span>Điểm trên bảng xếp hạng</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold leading-none">
                  0 / <span className="text-lg lg:text-xl text-slate-600">#5544</span>
                </div>
                <p className="text-[11px] text-slate-600">(Hãy cố gắng hơn nữa nhé!)</p>
              </div>

              {/* Stat 2 */}
              <div className="rounded-base border-2 border-border shadow-shadow p-3 flex flex-col gap-1 bg-emerald-100 text-slate-900">
                <div className="flex items-center gap-1.5 text-xs font-heading text-slate-700">
                  <Percent className="h-4 w-4 text-emerald-700" />
                  <span>Từ vựng đã học</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold leading-none">0%</div>
                <p className="text-[11px] text-slate-600">0 từ</p>
              </div>

              {/* Stat 3 */}
              <Link
                href="/quiz"
                className="rounded-base border-2 border-border shadow-shadow p-3 flex flex-col gap-1 bg-indigo-100 text-slate-900 transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                <div className="flex items-center gap-1.5 text-xs font-heading text-slate-700">
                  <FileText className="h-4 w-4 text-indigo-700" />
                  <span>Đề đã làm</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold leading-none">
                  0<span className="ml-1 text-sm font-normal text-slate-600">đề</span>
                </div>
              </Link>

              {/* Stat 4 */}
              <Link
                href="/quiz"
                className="rounded-base border-2 border-border shadow-shadow p-3 flex flex-col gap-1 bg-pink-100 text-slate-900 transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                <div className="flex items-center gap-1.5 text-xs font-heading text-slate-700">
                  <Award className="h-4 w-4 text-pink-700" />
                  <span>Tỉ lệ đỗ TOPIK</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold leading-none">—</div>
                <p className="text-[11px] text-slate-600">(ước tính)</p>
              </Link>
            </div>
          </div>

          {/* SECTION 1: TIẾNG HÀN MÀU XANH LÁ (DÀNH CHO NGƯỜI VIỆT) */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#0076BE] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl text-slate-900">Tiếng Hàn Màu Xanh Lá</h2>
              <p className="text-sm text-gray-600 font-medium">Dành cho người Việt</p>
            </header>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {greenBooks.map((book) => (
                <Link key={book.id} href={book.href}>
                  <div
                    data-slot="card"
                    className="rounded-base flex flex-col shadow-shadow border-2 border-border text-foreground font-base aspect-[3/4] p-0 gap-0 relative overflow-hidden bg-[#0076BE] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all group cursor-pointer"
                  >
                    {/* Circle Pattern */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[88%] aspect-square rounded-full flex items-center justify-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgb(255, 255, 255) 20%, transparent 21%), radial-gradient(rgb(255, 255, 255) 20%, transparent 21%)',
                        backgroundPosition: '0px 0px, 6px 6px',
                        backgroundSize: '12px 12px'
                      }}
                    >
                      <div className="w-[74%] aspect-square bg-white rounded-full flex flex-col items-center justify-center text-center px-2 lg:px-3 shadow-sm">
                        <span className="font-heading text-black text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase leading-none">
                          TOPIK
                        </span>
                        <span className="text-[7px] sm:text-[9px] lg:text-xs italic text-black mt-1 lg:mt-2 font-bold leading-tight">
                          dành cho người Việt
                        </span>
                      </div>
                    </div>

                    {/* Book Number */}
                    <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 flex items-end">
                      <div className="font-heading italic text-white text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] leading-[0.75]">
                        {book.num}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 2: TIẾNG HÀN MÀU SẮC (BỘ GIÁO TRÌNH 6 CẤP ĐỘ) */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#0a6e3a] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl text-slate-900">Tiếng Hàn Màu Sắc</h2>
              <p className="text-sm text-gray-600 font-medium">Bộ giáo trình 6 cấp độ</p>
            </header>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {seoulBooks.map((book) => (
                <Link key={book.id} href={book.href}>
                  <div
                    className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                    style={{ backgroundColor: book.bgColor }}
                  >
                    {/* Top Left Tag */}
                    <div
                      className="absolute top-1.5 left-1.5 lg:top-2 lg:left-2 font-heading leading-none text-[6px] sm:text-[8px] lg:text-[10px]"
                      style={{ color: book.textColor }}
                    >
                      Dành cho người Việt
                    </div>

                    {/* Top Right Decorative Pin */}
                    <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 flex items-center gap-0.5">
                      <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-700 flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4">
                        <div className="rounded-full bg-white w-0.5 h-0.5 lg:w-1 lg:h-1" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-[14%] left-0 right-0 px-2 sm:px-3 text-center">
                      <h3 className="font-heading leading-none whitespace-nowrap text-base sm:text-xl md:text-2xl lg:text-[26px]">
                        <span style={{ color: book.textColor }}>Tiếng Hàn</span>{' '}
                        <span className="text-white">Màu Sắc</span>
                      </h3>
                    </div>

                    {/* Geometric Polygon Grid */}
                    <div className="absolute top-[34%] right-[6%] w-[58%] aspect-square">
                      <div className="grid grid-cols-4 grid-rows-4 w-full h-full border border-white/30">
                        {gridColors.map((row, rIdx) =>
                          row.map((cell, cIdx) => (
                            <div key={`${rIdx}-${cIdx}`} className="relative">
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: cell.c1,
                                  clipPath: 'polygon(0px 0px, 100% 0px, 0px 100%)'
                                }}
                              />
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: cell.c2,
                                  clipPath: 'polygon(100% 0px, 100% 100%, 0px 100%)'
                                }}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Bottom Right Student's Book Badge */}
                    <div className="absolute bottom-1.5 right-1.5 lg:bottom-2 lg:right-2 flex items-center gap-1">
                      <span
                        className="font-heading leading-tight text-[10px] sm:text-xs lg:text-sm text-right"
                        style={{ color: book.textColor }}
                      >
                        Student&apos;s
                        <br />
                        Book
                      </span>
                      <div
                        className="rounded-full border-2 border-border flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 shadow-xs"
                        style={{ backgroundColor: book.badgeBg }}
                      >
                        <span className="font-heading text-white leading-none text-[10px] sm:text-sm lg:text-base">
                          {book.num}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 3: TIẾNG HÀN MÀU VÀNG (GIÁO TRÌNH TIẾNG HÀN CỦA VUA - 8 BOOKS) */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-amber-600 pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl text-slate-900">Tiếng Hàn Màu Vàng</h2>
              <p className="text-sm text-gray-600 font-medium">Giáo trình tiếng Hàn của Vua</p>
            </header>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {yellowKingBooks.map((book) => (
                <Link key={book.id} href={book.href}>
                  <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden bg-[#fdfbf7] p-2 flex flex-col justify-between transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    {/* Top Right Symbol */}
                    <div className="absolute top-2 right-2 text-slate-700 font-bold text-xs border border-slate-300 rounded-full w-5 h-5 flex items-center justify-center bg-white shadow-2xs">
                      ㅎ
                    </div>

                    {/* Brown Mountain Triangle Shape */}
                    <div className="absolute inset-x-3 top-[25%] bottom-2 bg-[#b45309] rounded-t-full clip-triangle flex flex-col items-center justify-between p-2 pt-3 shadow-inner">
                      <span className="text-[9px] sm:text-[10px] text-amber-200/90 font-bold uppercase tracking-widest">
                        증보판
                      </span>

                      {/* Large Center Number */}
                      <span className="font-heading text-slate-900 text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-none">
                        {book.num}
                      </span>

                      {/* Bottom Taegeuk Badge Circle */}
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-slate-700 flex items-center justify-center p-0.5 shadow-xs mb-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-red-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 4: TIẾNG HÀN ĐẠI HỌC BẢN MỚI (TRỌNG TÂM TỪ VỰNG & NGỮ PHÁP) */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-red-600 pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl text-slate-900">Tiếng Hàn Đại Học Bản Mới</h2>
              <p className="text-sm text-gray-600 font-medium">Trọng tâm từ vựng & ngữ pháp</p>
            </header>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {universityBooks.map((book) => (
                <Link key={book.id} href={book.href}>
                  <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden bg-white p-3 flex flex-col justify-between items-center text-center transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    {/* Top Decorative Icons Bar */}
                    <div className="w-full flex items-center justify-around border-b border-slate-100 pb-1.5 text-slate-400">
                      <Circle className="w-2.5 h-2.5 fill-red-400 text-red-500" />
                      <Home className="w-2.5 h-2.5 text-amber-500" />
                      <Sun className="w-2.5 h-2.5 text-amber-400" />
                      <Trees className="w-2.5 h-2.5 text-emerald-500" />
                    </div>

                    {/* Center Book Title */}
                    <div className="my-auto space-y-1">
                      <h3 className="font-heading text-slate-900 text-base sm:text-lg md:text-xl leading-tight">
                        Tiếng Hàn
                      </h3>
                      <p className="font-heading text-rose-600 text-xs sm:text-sm leading-tight flex items-center justify-center gap-1">
                        <span>Đại Học Bản Mới</span>
                        <span className="text-blue-600 text-base sm:text-xl font-black">{book.num}</span>
                      </p>
                    </div>

                    {/* Bottom Decorative Icons Bar & Subtitle */}
                    <div className="w-full space-y-1 border-t border-slate-100 pt-1.5">
                      <div className="w-full flex items-center justify-around text-slate-400">
                        <Circle className="w-2 h-2 fill-emerald-400 text-emerald-500" />
                        <Home className="w-2 h-2 text-blue-500" />
                        <Sun className="w-2 h-2 text-rose-400" />
                        <Trees className="w-2 h-2 text-teal-500" />
                      </div>
                      <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium truncate">
                        Giáo trình tiếng Hàn cho người Việt
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 5: TIẾNG HÀN HỘI NHẬP (KIIP) */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-orange-600 pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl text-slate-900">Tiếng Hàn Hội Nhập</h2>
              <p className="text-sm text-gray-600 font-medium">Giáo trình tiếng Hàn hội nhập xã hội Hàn Quốc (KIIP)</p>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {kiipBooks.map((book) => (
                <Link key={book.id} href={book.href}>
                  <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden bg-[#edf7f2] p-4 flex flex-col justify-between transition-all cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-emerald-200/80 pb-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 block uppercase">
                          Chương trình hội nhập (KIIP)
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-heading rounded-md shadow-2xs ${book.capColor}`}>
                        Cấp {book.cap}
                      </span>
                    </div>

                    {/* Center Title */}
                    <div className="my-auto space-y-1">
                      <h3 className="font-heading text-slate-900 text-xl sm:text-2xl lg:text-3xl leading-tight">
                        Tiếng Hàn
                      </h3>
                      <h4 className="font-heading text-slate-900 text-xl sm:text-2xl lg:text-3xl leading-tight">
                        Hội Nhập
                      </h4>
                    </div>

                    {/* Bottom Illustration Mockup */}
                    <div className="bg-white border border-emerald-200 rounded-xl p-2.5 space-y-1 shadow-xs">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                          🏛️
                        </div>
                        <div className="h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-800">
                          🏙️
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
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
