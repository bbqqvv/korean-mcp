'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';
import AmbientAudio from '@/components/ambient-audio';

export default function BooksPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24 max-w-6xl w-full mx-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* SECTION 1: TIẾNG HÀN MÀU XANH LÁ (TOPIK 1 - 6) */}
          <section className="flex flex-col gap-4">
            <header className="border-l-4 border-[#0076BE] pl-3.5">
              <h2 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white">
                Tiếng Hàn Màu Xanh Lá
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Dành cho người Việt (Luyện thi TOPIK)</p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { href: '/course/so-cap-1', num: '1' },
                { href: '/course/so-cap-2', num: '2' },
                { href: '/course/trung-cap-1', num: '3' },
                { href: '/course/trung-cap-2', num: '4' },
                { href: '/course/cao-cap-1', num: '5' },
                { href: '/course/cao-cap-2', num: '6' }
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden bg-[#0076BE] group cursor-pointer">
                    {/* 3D Spine Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />
                    {/* Glossy sheen */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />

                    {/* Dotted Center Emblem */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[88%] aspect-square rounded-full flex items-center justify-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgb(255, 255, 255) 20%, transparent 21%), radial-gradient(rgb(255, 255, 255) 20%, transparent 21%)',
                        backgroundPosition: '0px 0px, 6px 6px',
                        backgroundSize: '12px 12px'
                      }}
                    >
                      <div className="w-[74%] aspect-square bg-white rounded-full flex flex-col items-center justify-center text-center px-2 lg:px-3 shadow-inner">
                        <span className="font-black text-slate-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight uppercase">
                          TOPIK
                        </span>
                        <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold italic text-slate-700 mt-1">
                          dành cho người Việt
                        </span>
                      </div>
                    </div>

                    {/* Big White Number */}
                    <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 flex items-end">
                      <div className="font-black italic text-white text-[45px] sm:text-[56px] md:text-[68px] lg:text-[76px] leading-[0.75] drop-shadow-md">
                        {item.num}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 2: TIẾNG HÀN MÀU SẮC (SEOUL KOREAN 1 - 6) */}
          <section className="flex flex-col gap-4">
            <header className="border-l-4 border-[#0a6e3a] pl-3.5">
              <h2 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white">
                Tiếng Hàn Màu Sắc
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Bộ giáo trình 6 cấp độ</p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { href: '/course/seoul-1', bg: 'rgb(255, 212, 0)', textColor: 'rgb(30, 139, 63)', badgeBg: 'rgb(30, 139, 63)', num: '1' },
                { href: '/course/seoul-2', bg: 'rgb(124, 179, 66)', textColor: 'rgb(42, 90, 26)', badgeBg: 'rgb(42, 90, 26)', num: '2' },
                { href: '/course/seoul-3', bg: 'rgb(251, 140, 0)', textColor: 'rgb(191, 54, 12)', badgeBg: 'rgb(191, 54, 12)', num: '3' },
                { href: '/course/seoul-4', bg: 'rgb(30, 136, 229)', textColor: 'rgb(10, 53, 122)', badgeBg: 'rgb(10, 53, 122)', num: '4' },
                { href: '/course/seoul-5', bg: 'rgb(46, 125, 50)', textColor: 'rgb(255, 235, 59)', badgeBg: 'rgb(255, 235, 59)', num: '5' },
                { href: '/course/seoul-6', bg: 'rgb(0, 131, 143)', textColor: 'rgb(255, 214, 0)', badgeBg: 'rgb(255, 214, 0)', num: '6' }
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer group"
                    style={{ backgroundColor: item.bg }}
                  >
                    {/* 3D Spine Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10 pointer-events-none" />

                    <div
                      className="absolute top-2 left-3 font-bold leading-none text-[8px] sm:text-[9px] lg:text-[10px]"
                      style={{ color: item.textColor }}
                    >
                      Dành cho người Việt
                    </div>
                    <div className="absolute top-2 right-2.5 flex items-center gap-0.5">
                      <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-700 flex items-center justify-center w-3 h-3 lg:w-4 lg:h-4">
                        <div className="rounded-full bg-white w-1 h-1" />
                      </div>
                    </div>
                    <div className="absolute top-[14%] left-0 right-0 px-2 text-center">
                      <h3 className="font-black leading-none whitespace-nowrap text-sm sm:text-base md:text-lg lg:text-xl">
                        <span style={{ color: item.textColor }}>Tiếng Hàn</span> <span className="text-white drop-shadow-sm">Màu Sắc</span>
                      </h3>
                    </div>
                    <div className="absolute top-[34%] right-[6%] w-[58%] aspect-square">
                      <div className="grid grid-cols-4 grid-rows-4 w-full h-full border border-white/40 shadow-inner">
                        {Array.from({ length: 16 }).map((_, idx) => (
                          <div key={idx} className="relative">
                            <div
                              className="absolute inset-0"
                              style={{ background: 'rgb(230, 57, 70)', clipPath: 'polygon(0px 0px, 100% 0px, 0px 100%)' }}
                            />
                            <div
                              className="absolute inset-0"
                              style={{ background: 'rgb(29, 53, 87)', clipPath: 'polygon(100% 0px, 100% 100%, 0px 100%)' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5">
                      <span
                        className="font-bold leading-tight text-[9px] sm:text-[10px] lg:text-xs text-right"
                        style={{ color: item.textColor }}
                      >
                        Student&apos;s
                        <br />
                        Book
                      </span>
                      <div
                        className="rounded-full border-2 border-white/80 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shadow-md"
                        style={{ backgroundColor: item.badgeBg }}
                      >
                        <span className="font-black text-white leading-none text-xs sm:text-sm lg:text-base">
                          {item.num}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 3: TIẾNG HÀN MÀU VÀNG (SEJONG KOREAN 1 - 8) */}
          <section className="flex flex-col gap-4">
            <header className="border-l-4 border-[#B27B3E] pl-3.5">
              <h2 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white">
                Tiếng Hàn Màu Vàng
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Giáo trình tiếng Hàn của Vua (Sejong)</p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Link key={num} href={`/course/sejong-${num}`}>
                  <div className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden bg-[#fafafa] group cursor-pointer">
                    {/* 3D Spine Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-10 pointer-events-none" />

                    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
                      <path d="M0 0 L58 0 L0 64 Z" fill="#E3E6E9" />
                      <path d="M118 20 L300 358 L300 400 L0 400 L0 168 Z" fill="#B27B3E" />
                      <path d="M176 250 L288 400 L64 400 Z" fill="#ffffff" />
                      <path d="M236 300 L300 400 L208 400 Z" fill="#B27B3E" opacity="0.55" />
                    </svg>

                    <div className="absolute top-[5%] right-[9%]">
                      <svg width="22" height="22" viewBox="0 0 40 44" aria-hidden="true" className="shrink-0">
                        <path d="M20 2 L33 18 L29 18 L20 8 L11 18 L7 18 Z" fill="#2B2B2B" />
                        <circle cx="20" cy="30" r="11" fill="none" stroke="#2B2B2B" strokeWidth="2.4" />
                        <circle cx="20" cy="25.5" r="2.6" fill="#2B2B2B" />
                        <path d="M14.5 36 Q20 28 25.5 36 Z" fill="#2B2B2B" />
                      </svg>
                    </div>

                    {/* FIXED CHARCOAL TEXT (Never turns white in dark mode!) */}
                    <div className="absolute top-[18%] left-[6%] right-[6%] text-center">
                      <p className="font-bold text-slate-600 leading-none text-[8px] sm:text-[10px] md:text-[11px]">증보판</p>
                      <h1 className="font-black text-slate-900 leading-none whitespace-nowrap mt-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                        {num}
                      </h1>
                    </div>

                    <div className="absolute bottom-[4%] left-0 right-0 flex justify-center">
                      <svg width="22" height="22" viewBox="0 0 36 36" aria-hidden="true">
                        <circle cx="18" cy="9" r="6" fill="#9FB7CC" />
                        <circle cx="26.559" cy="15.218" r="6" fill="#9FB7CC" />
                        <circle cx="23.290" cy="25.281" r="6" fill="#9FB7CC" />
                        <circle cx="12.709" cy="25.281" r="6" fill="#9FB7CC" />
                        <circle cx="9.440" cy="15.218" r="6" fill="#9FB7CC" />
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

          {/* SECTION 4: TIẾNG HÀN ĐẠI HỌC BẢN MỚI (YONSEI KOREAN 1 - 6) */}
          <section className="flex flex-col gap-4">
            <header className="border-l-4 border-[#E11D2A] pl-3.5">
              <h2 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white">
                Tiếng Hàn Đại Học Bản Mới
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Trọng tâm từ vựng &amp; ngữ pháp (Yonsei)</p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { num: 1, color: 'rgb(91, 127, 184)' },
                { num: 2, color: 'rgb(231, 111, 81)' },
                { num: 3, color: 'rgb(42, 157, 143)' },
                { num: 4, color: 'rgb(244, 162, 97)' },
                { num: 5, color: 'rgb(230, 57, 70)' },
                { num: 6, color: 'rgb(91, 44, 130)' }
              ].map((item) => (
                <Link key={item.num} href={`/course/yonsei-${item.num}`}>
                  <div className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden bg-white group cursor-pointer">
                    {/* 3D Spine Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent z-10 pointer-events-none" />

                    <div className="absolute inset-x-0 top-0 h-[24%]">
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
                          <circle cx="65" cy="33.196" r="6" fill="#F4C45A" />
                          <circle cx="59" cy="33.196" r="6" fill="#F4C45A" />
                          <circle cx="56" cy="28" r="6" fill="#F4C45A" />
                          <circle cx="59" cy="22.803" r="6" fill="#F4C45A" />
                          <circle cx="65" cy="22.803" r="6" fill="#F4C45A" />
                          <circle cx="62" cy="28" r="4.5" fill="#E11D2A" />
                          <circle cx="62" cy="28" r="2.1" fill="#ffffff" />
                        </g>
                      </svg>
                    </div>

                    <div className="absolute inset-x-0 bottom-[6%] h-[24%]">
                      <svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true" style={{ transform: 'scaleY(-1)' }}>
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
                      </svg>
                    </div>

                    {/* FIXED CHARCOAL TEXT (Never turns white in dark mode!) */}
                    <div className="absolute top-[40%] left-[6%] right-[6%] flex items-start">
                      <div className="flex-1 min-w-0 leading-[0.95] text-center">
                        <h1 className="font-black text-slate-900 leading-[0.95] whitespace-nowrap text-xs sm:text-sm md:text-base">
                          Tiếng Hàn
                        </h1>
                        <h2 className="font-bold leading-[0.95] mt-1 whitespace-nowrap inline-flex items-end justify-center gap-1 text-[10px] sm:text-[11px] md:text-xs" style={{ color: item.color }}>
                          Đại Học Bản Mới <span className="font-black leading-none text-base sm:text-xl md:text-2xl" style={{ color: item.color }}>{item.num}</span>
                        </h2>
                      </div>
                    </div>

                    <div className="absolute bottom-[2%] left-0 right-0 text-center">
                      <p className="font-semibold text-slate-600 leading-none text-[7px] sm:text-[8px]">
                        Giáo trình tiếng Hàn cho người Việt
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 5: TIẾNG HÀN HỘI NHẬP (KIIP 1 & 3) */}
          <section className="flex flex-col gap-4">
            <header className="border-l-4 border-emerald-600 pl-3.5">
              <h2 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white">
                Tiếng Hàn Hội Nhập
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Giáo trình tiếng Hàn hội nhập xã hội Hàn Quốc (KIIP)</p>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* KIIP 1 Card */}
              <Link href="/course/kiip-1">
                <div className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden bg-[#e1efd8] group cursor-pointer">
                  {/* 3D Spine Shadow */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-10 pointer-events-none" />

                  <div className="absolute left-[6%] right-[6%] flex items-start justify-between gap-1 top-[5%]">
                    <p className="font-bold text-slate-800 leading-tight whitespace-nowrap text-[8px] sm:text-[9px]">
                      Chương trình hội nhập<span className="font-black text-slate-900"> (KIIP)</span>
                    </p>
                    <div className="flex items-end gap-0.5 leading-none" style={{ color: 'rgb(217, 119, 6)' }}>
                      <span className="font-bold text-[8px]">Cấp</span>
                      <span className="font-black leading-none text-base sm:text-xl">1</span>
                    </div>
                  </div>

                  {/* FIXED CHARCOAL TEXT */}
                  <div className="absolute top-[16%] left-[6%] right-[6%]">
                    <h1 className="font-black text-slate-900 leading-tight tracking-wider whitespace-nowrap text-sm sm:text-base md:text-lg">Tiếng Hàn</h1>
                    <h1 className="font-black text-slate-900 leading-tight tracking-wider mt-1 whitespace-nowrap text-sm sm:text-base md:text-lg">Hội Nhập</h1>
                  </div>

                  <div className="absolute right-[4%] top-[50%] w-[66%] h-[33%] rounded-lg overflow-hidden border border-slate-300 shadow-xs">
                    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
                      <rect x="0" y="0" width="300" height="200" fill="#FCE3BE" />
                      <rect x="0" y="0" width="300" height="80" fill="#FFFAEC" />
                      <g>
                        <rect x="0" y="0" width="150" height="100" fill="#F4C45A" />
                        <circle cx="40" cy="50" r="6" fill="#F5D6A9" />
                        <path d="M 32 56 L 48 56 L 50 70 L 30 70 Z" fill="#E63946" />
                        <circle cx="75" cy="50" r="6" fill="#F5D6A9" />
                        <path d="M 67 56 L 83 56 L 85 70 L 65 70 Z" fill="#1D6FB4" />
                      </g>
                    </svg>
                  </div>
                </div>
              </Link>

              {/* KIIP 3 Card */}
              <Link href="/course/kiip-3">
                <div className="relative aspect-[3/4] rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden bg-[#e1efd8] group cursor-pointer">
                  {/* 3D Spine Shadow */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-10 pointer-events-none" />

                  <div className="absolute left-[6%] right-[6%] flex items-start justify-between gap-1 top-[5%]">
                    <p className="font-bold text-slate-800 leading-tight whitespace-nowrap text-[8px] sm:text-[9px]">
                      Chương trình hội nhập<span className="font-black text-slate-900"> (KIIP)</span>
                    </p>
                    <div className="flex items-end gap-0.5 leading-none" style={{ color: 'rgb(22, 163, 74)' }}>
                      <span className="font-bold text-[8px]">Cấp</span>
                      <span className="font-black leading-none text-base sm:text-xl">3</span>
                    </div>
                  </div>

                  {/* FIXED CHARCOAL TEXT */}
                  <div className="absolute top-[16%] left-[6%] right-[6%]">
                    <h1 className="font-black text-slate-900 leading-tight tracking-wider whitespace-nowrap text-sm sm:text-base md:text-lg">Tiếng Hàn</h1>
                    <h1 className="font-black text-slate-900 leading-tight tracking-wider mt-1 whitespace-nowrap text-sm sm:text-base md:text-lg">Hội Nhập</h1>
                  </div>

                  <div className="absolute right-[4%] top-[50%] w-[66%] h-[33%] rounded-lg overflow-hidden border border-slate-300 shadow-xs">
                    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
                      <rect x="0" y="0" width="300" height="200" fill="#DDEFD2" />
                      <rect x="0" y="0" width="300" height="80" fill="#FFFAEC" />
                      <g>
                        <rect x="26" y="96" width="58" height="40" fill="#F2D5A7" />
                        <rect x="30" y="100" width="20" height="18" fill="#5B3A1E" />
                      </g>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>

      <AmbientAudio />

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
