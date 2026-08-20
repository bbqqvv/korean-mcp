'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import AITutorDrawer from '@/components/ai-tutor-drawer';
import { useTheme } from '@/lib/theme-context';

export default function BooksPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 max-w-6xl w-full mx-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* SECTION 1: TIẾNG HÀN MÀU XANH LÁ */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#0076BE] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl">Tiếng Hàn Màu Xanh Lá</h2>
              <p className="text-sm text-gray-600">Dành cho người Việt</p>
            </header>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { href: '/course/so-cap-1', num: '1' },
                { href: '/course/so-cap-2', num: '2' },
                { href: '/course/trung-cap-1', num: '3' },
                { href: '/course/trung-cap-2', num: '4' },
                { href: '/course/cao-cap-1', num: '5' },
                { href: '/course/cao-cap-2', num: '6' }
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    data-slot="card"
                    className="rounded-base flex flex-col shadow-shadow border-2 border-border text-foreground font-base aspect-[3/4] p-0 gap-0 relative overflow-hidden bg-[#0076BE] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all group cursor-pointer"
                  >
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[88%] aspect-square rounded-full flex items-center justify-center"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgb(255, 255, 255) 20%, transparent 21%), radial-gradient(rgb(255, 255, 255) 20%, transparent 21%)',
                        backgroundPosition: '0px 0px, 6px 6px',
                        backgroundSize: '12px 12px'
                      }}
                    >
                      <div className="w-[74%] aspect-square bg-white rounded-full flex flex-col items-center justify-center text-center px-2 lg:px-3">
                        <span className="font-heading text-black text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight uppercase">
                          TOPIK
                        </span>
                        <span className="text-[7px] sm:text-[9px] lg:text-xs italic text-black mt-1 lg:mt-2">
                          dành cho người Việt
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 flex items-end">
                      <div className="font-heading italic text-white text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] leading-[0.75]">
                        {item.num}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 2: TIẾNG HÀN MÀU SẮC */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#0a6e3a] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl">Tiếng Hàn Màu Sắc</h2>
              <p className="text-sm text-gray-600">Bộ giáo trình 6 cấp độ</p>
            </header>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
                    className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                    style={{ backgroundColor: item.bg }}
                  >
                    <div
                      className="absolute top-1.5 left-1.5 lg:top-2 lg:left-2 font-heading leading-none text-[6px] sm:text-[8px] lg:text-[10px]"
                      style={{ color: item.textColor }}
                    >
                      Dành cho người Việt
                    </div>
                    <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 flex items-center gap-0.5">
                      <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-700 flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4">
                        <div className="rounded-full bg-white w-0.5 h-0.5 lg:w-1 lg:h-1" />
                      </div>
                    </div>
                    <div className="absolute top-[14%] left-0 right-0 px-2 sm:px-3 text-center">
                      <h3 className="font-heading leading-none whitespace-nowrap text-base sm:text-xl md:text-2xl lg:text-[26px]">
                        <span style={{ color: item.textColor }}>Tiếng Hàn</span> <span className="text-white">Màu Sắc</span>
                      </h3>
                    </div>
                    <div className="absolute top-[34%] right-[6%] w-[58%] aspect-square">
                      <div className="grid grid-cols-4 grid-rows-4 w-full h-full border border-white/30">
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
                    <div className="absolute bottom-1.5 right-1.5 lg:bottom-2 lg:right-2 flex items-center gap-1">
                      <span
                        className="font-heading leading-none text-[10px] sm:text-xs lg:text-sm text-right"
                        style={{ color: item.textColor }}
                      >
                        Student&apos;s
                        <br />
                        Book
                      </span>
                      <div
                        className="rounded-full border-2 border-border flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11"
                        style={{ backgroundColor: item.badgeBg }}
                      >
                        <span className="font-heading text-white leading-none text-[10px] sm:text-sm lg:text-base">
                          {item.num}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 3: TIẾNG HÀN MÀU VÀNG */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#B27B3E] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl">Tiếng Hàn Màu Vàng</h2>
              <p className="text-sm text-gray-600">Giáo trình tiếng Hàn của Vua</p>
            </header>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Link key={num} href={`/course/sejong-${num}`}>
                  <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden bg-white transition-all cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
                      <path d="M0 0 L58 0 L0 64 Z" fill="#E3E6E9" />
                      <path d="M118 20 L300 358 L300 400 L0 400 L0 168 Z" fill="#B27B3E" />
                      <path d="M176 250 L288 400 L64 400 Z" fill="#ffffff" />
                      <path d="M236 300 L300 400 L208 400 Z" fill="#B27B3E" opacity="0.55" />
                    </svg>
                    <div className="absolute top-[5%] right-[9%]">
                      <svg width="24" height="24" viewBox="0 0 40 44" aria-hidden="true" className="shrink-0">
                        <path d="M20 2 L33 18 L29 18 L20 8 L11 18 L7 18 Z" fill="#2B2B2B" />
                        <circle cx="20" cy="30" r="11" fill="none" stroke="#2B2B2B" strokeWidth="2.4" />
                        <circle cx="20" cy="25.5" r="2.6" fill="#2B2B2B" />
                        <path d="M14.5 36 Q20 28 25.5 36 Z" fill="#2B2B2B" />
                      </svg>
                    </div>
                    <div className="absolute top-[20%] left-[6%] right-[6%] text-center">
                      <p className="font-base text-foreground/55 leading-none text-[7px] sm:text-[9px] md:text-[11px]">증보판</p>
                      <h1 className="font-heading text-foreground leading-none whitespace-nowrap mt-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                        {num}
                      </h1>
                    </div>
                    <div className="absolute bottom-[4%] left-0 right-0 flex justify-center">
                      <svg width="24" height="24" viewBox="0 0 36 36" aria-hidden="true">
                        <circle cx="18" cy="9" r="6" fill="#9FB7CC" />
                        <circle cx="26.559508646656383" cy="15.218847050625474" r="6" fill="#9FB7CC" />
                        <circle cx="23.290067270632257" cy="25.281152949374526" r="6" fill="#9FB7CC" />
                        <circle cx="12.709932729367743" cy="25.281152949374526" r="6" fill="#9FB7CC" />
                        <circle cx="9.440491353343617" cy="15.218847050625474" r="6" fill="#9FB7CC" />
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

          {/* SECTION 4: TIẾNG HÀN ĐẠI HỌC BẢN MỚI */}
          <section className="flex flex-col gap-3">
            <header className="border-l-4 border-[#E11D2A] pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl">Tiếng Hàn Đại Học Bản Mới</h2>
              <p className="text-sm text-gray-600">Trọng tâm từ vựng &amp; ngữ pháp</p>
            </header>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { num: 1, color: 'rgb(91, 127, 184)' },
                { num: 2, color: 'rgb(231, 111, 81)' },
                { num: 3, color: 'rgb(42, 157, 143)' },
                { num: 4, color: 'rgb(244, 162, 97)' },
                { num: 5, color: 'rgb(230, 57, 70)' },
                { num: 6, color: 'rgb(91, 44, 130)' }
              ].map((item) => (
                <Link key={item.num} href={`/course/yonsei-${item.num}`}>
                  <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all bg-white cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
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
                    <div className="absolute top-[40%] left-[6%] right-[6%] flex items-start">
                      <div className="flex-1 min-w-0 leading-[0.95] text-center">
                        <h1 className="font-heading text-foreground leading-[0.95] whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-base">
                          Tiếng Hàn
                        </h1>
                        <h2 className="font-heading leading-[0.95] mt-0.5 whitespace-nowrap inline-flex items-end gap-1 text-[9px] sm:text-[11px] md:text-xs lg:text-sm" style={{ color: item.color }}>
                          Đại Học Bản Mới<span className="font-heading leading-none text-base sm:text-xl md:text-2xl lg:text-3xl" style={{ color: item.color }}>{item.num}</span>
                        </h2>
                      </div>
                    </div>
                    <div className="absolute bottom-[1.5%] left-0 right-0 text-center">
                      <p className="font-heading text-foreground/80 leading-none text-[3px] sm:text-[5px] lg:text-[7px]">
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
            <header className="border-l-4 border-emerald-600 pl-3">
              <h2 className="font-heading text-2xl lg:text-3xl">Tiếng Hàn Hội Nhập</h2>
              <p className="text-sm text-gray-600">Giáo trình tiếng Hàn hội nhập xã hội Hàn Quốc (KIIP)</p>
            </header>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* KIIP 1 Card */}
              <Link href="/course/kiip-1">
                <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all bg-[#e1efd8] cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                  <div className="absolute left-[6%] right-[6%] flex items-start justify-between gap-1 top-[4%]">
                    <p className="text-foreground/80 leading-tight whitespace-nowrap text-[4px] sm:text-[5px] lg:text-[7px]">
                      Chương trình hội nhập<span className="font-heading text-foreground"> (KIIP)</span>
                    </p>
                    <div className="flex items-end gap-0.5 leading-none" style={{ color: 'rgb(217, 119, 6)' }}>
                      <span className="font-heading text-[5px] sm:text-[6px] lg:text-[8px]">Cấp</span>
                      <span className="font-heading leading-none text-[14px] sm:text-lg md:text-xl lg:text-2xl">1</span>
                    </div>
                  </div>
                  <div className="absolute top-[14%] left-[6%] right-[6%]">
                    <h1 className="font-heading text-foreground leading-tight tracking-wider whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl">Tiếng Hàn</h1>
                    <h1 className="font-heading text-foreground leading-tight tracking-wider mt-1.5 sm:mt-2 whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl">Hội Nhập</h1>
                  </div>
                  <div className="absolute right-[4%] top-[50%] w-[66%] h-[33%] rounded-base overflow-hidden">
                    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
                      <rect x="0" y="0" width="300" height="200" fill="#FCE3BE" />
                      <rect x="0" y="0" width="300" height="80" fill="#FFFAEC" />
                      <g>
                        <rect x="0" y="0" width="150" height="100" fill="#F4C45A" />
                        <rect x="20" y="70" width="110" height="6" fill="#A14A2F" />
                        <ellipse cx="50" cy="68" rx="6" ry="2" fill="#fff" />
                        <ellipse cx="80" cy="68" rx="6" ry="2" fill="#fff" />
                        <ellipse cx="110" cy="68" rx="6" ry="2" fill="#fff" />
                        <circle cx="40" cy="50" r="6" fill="#F5D6A9" />
                        <path d="M 32 56 L 48 56 L 50 70 L 30 70 Z" fill="#E63946" />
                        <circle cx="75" cy="50" r="6" fill="#F5D6A9" />
                        <path d="M 67 56 L 83 56 L 85 70 L 65 70 Z" fill="#1D6FB4" />
                        <circle cx="110" cy="50" r="6" fill="#F5D6A9" />
                        <path d="M 102 56 L 118 56 L 120 70 L 100 70 Z" fill="#1D8B5E" />
                        <rect x="150" y="0" width="150" height="100" fill="#7AB3F0" />
                        <ellipse cx="190" cy="18" rx="10" ry="4" fill="#fff" opacity="0.85" />
                        <ellipse cx="260" cy="14" rx="12" ry="4" fill="#fff" opacity="0.85" />
                        <path d="M 158 60 L 178 50 L 198 60 L 198 90 L 158 90 Z" fill="#E8C690" />
                        <path d="M 158 60 L 178 50 L 198 60 L 188 62 L 178 56 L 168 62 Z" fill="#7A2A0F" />
                        <path d="M 200 60 L 220 50 L 240 60 L 240 90 L 200 90 Z" fill="#F2D5A7" />
                        <path d="M 200 60 L 220 50 L 240 60 L 230 62 L 220 56 L 210 62 Z" fill="#A14A2F" />
                        <path d="M 242 60 L 262 50 L 282 60 L 282 90 L 242 90 Z" fill="#E8C690" />
                        <path d="M 242 60 L 262 50 L 282 60 L 272 62 L 262 56 L 252 62 Z" fill="#7A2A0F" />
                        <rect x="155" y="86" width="140" height="6" fill="#C9A973" />
                        <circle cx="210" cy="76" r="4" fill="#F5D6A9" />
                        <rect x="206" y="80" width="8" height="12" fill="#E63946" />
                        <circle cx="230" cy="76" r="4" fill="#F5D6A9" />
                        <rect x="226" y="80" width="8" height="12" fill="#7A2CA8" />
                        <rect x="0" y="100" width="150" height="100" fill="#CDE3F2" />
                        <circle cx="45" cy="135" r="9" fill="#F5D6A9" />
                        <path d="M 33 145 L 57 145 L 62 195 L 28 195 Z" fill="#E63946" />
                        <circle cx="100" cy="135" r="9" fill="#F5D6A9" />
                        <path d="M 88 145 L 112 145 L 117 195 L 83 195 Z" fill="#1D8B5E" />
                        <ellipse cx="72" cy="120" rx="10" ry="5" fill="#fff" />
                        <rect x="150" y="100" width="150" height="100" fill="#F2D7DC" />
                        <circle cx="190" cy="135" r="9" fill="#F5D6A9" />
                        <path d="M 178 145 L 202 145 L 207 195 L 173 195 Z" fill="#1D6FB4" />
                        <circle cx="225" cy="135" r="9" fill="#F5D6A9" />
                        <path d="M 213 145 L 237 145 L 242 195 L 208 195 Z" fill="#F4C45A" />
                        <circle cx="260" cy="135" r="9" fill="#F5D6A9" />
                        <path d="M 248 145 L 272 145 L 277 195 L 243 195 Z" fill="#E76F51" />
                        <path d="M 0 100 Q 75 70 150 110 T 300 100" stroke="#fff" strokeWidth="6" fill="none" />
                        <path d="M 150 0 Q 130 50 150 110 Q 170 160 150 200" stroke="#fff" strokeWidth="6" fill="none" />
                      </g>
                      <line x1="0" y1="200" x2="300" y2="200" stroke="#5B3A1E" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* KIIP 3 Card */}
              <Link href="/course/kiip-3">
                <div className="relative aspect-[3/4] rounded-base border-2 border-border shadow-shadow overflow-hidden transition-all bg-[#e1efd8] cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none">
                  <div className="absolute left-[6%] right-[6%] flex items-start justify-between gap-1 top-[4%]">
                    <p className="text-foreground/80 leading-tight whitespace-nowrap text-[4px] sm:text-[5px] lg:text-[7px]">
                      Chương trình hội nhập<span className="font-heading text-foreground"> (KIIP)</span>
                    </p>
                    <div className="flex items-end gap-0.5 leading-none" style={{ color: 'rgb(22, 163, 74)' }}>
                      <span className="font-heading text-[5px] sm:text-[6px] lg:text-[8px]">Cấp</span>
                      <span className="font-heading leading-none text-[14px] sm:text-lg md:text-xl lg:text-2xl">3</span>
                    </div>
                  </div>
                  <div className="absolute top-[14%] left-[6%] right-[6%]">
                    <h1 className="font-heading text-foreground leading-tight tracking-wider whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl">Tiếng Hàn</h1>
                    <h1 className="font-heading text-foreground leading-tight tracking-wider mt-1.5 sm:mt-2 whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl">Hội Nhập</h1>
                  </div>
                  <div className="absolute right-[4%] top-[50%] w-[66%] h-[33%] rounded-base overflow-hidden">
                    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
                      <rect x="0" y="0" width="300" height="200" fill="#DDEFD2" />
                      <rect x="0" y="0" width="300" height="80" fill="#FFFAEC" />
                      <g>
                        <path d="M 20 90 Q 55 50 90 90 L 84 96 Q 55 70 26 96 Z" fill="#A14A2F" />
                        <rect x="26" y="96" width="58" height="40" fill="#F2D5A7" />
                        <rect x="30" y="100" width="20" height="18" fill="#5B3A1E" />
                        <rect x="58" y="100" width="20" height="18" fill="#5B3A1E" />
                        <rect x="26" y="130" width="58" height="6" fill="#A14A2F" />
                        <path d="M 200 95 Q 235 55 270 95 L 264 101 Q 235 75 206 101 Z" fill="#7A2A0F" />
                        <rect x="206" y="101" width="58" height="38" fill="#E8C690" />
                        <rect x="212" y="106" width="16" height="16" fill="#5B3A1E" />
                        <rect x="240" y="106" width="16" height="16" fill="#5B3A1E" />
                        <rect x="206" y="133" width="58" height="6" fill="#7A2A0F" />
                        <line x1="150" y1="0" x2="150" y2="40" stroke="#5B3A1E" strokeWidth="1" />
                        <ellipse cx="150" cy="55" rx="14" ry="18" fill="#E63946" />
                        <rect x="136" y="45" width="28" height="3" fill="#5B3A1E" />
                        <rect x="136" y="65" width="28" height="3" fill="#5B3A1E" />
                        <path d="M 144 75 L 156 75 L 152 85 L 148 85 Z" fill="#FFD400" />
                      </g>
                      <g>
                        <g>
                          <path d="M 21 145 Q 30 134 39 145 Z" fill="#1D6FB4" />
                          <circle cx="30" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="27.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="32.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="25.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="34.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 20 160 L 40 160 L 46 195 L 14 195 Z" fill="#E63946" />
                          <path d="M 20 160 L 40 160 L 37 165 L 23 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 56 145 Q 65 134 74 145 Z" fill="#F4C45A" />
                          <circle cx="65" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="62.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="67.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="60.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="69.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 55 160 L 75 160 L 81 195 L 49 195 Z" fill="#1D6FB4" />
                          <path d="M 55 160 L 75 160 L 72 165 L 58 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 91 145 Q 100 134 109 145 Z" fill="#E11D2A" />
                          <circle cx="100" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="97.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="102.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="95.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="104.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 90 160 L 110 160 L 116 195 L 84 195 Z" fill="#16A34A" />
                          <path d="M 90 160 L 110 160 L 107 165 L 93 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 126 145 Q 135 134 144 145 Z" fill="#1D8B5E" />
                          <circle cx="135" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="132.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="137.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="130.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="139.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 125 160 L 145 160 L 151 195 L 119 195 Z" fill="#F4C45A" />
                          <path d="M 125 160 L 145 160 L 142 165 L 128 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 161 145 Q 170 134 179 145 Z" fill="#E76F51" />
                          <circle cx="170" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="167.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="172.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="165.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="174.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 160 160 L 180 160 L 186 195 L 154 195 Z" fill="#1D8B5E" />
                          <path d="M 160 160 L 180 160 L 177 165 L 163 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 196 145 Q 205 134 214 145 Z" fill="#F4C45A" />
                          <circle cx="205" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="202.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="207.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="200.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="209.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 195 160 L 215 160 L 221 195 L 189 195 Z" fill="#7A2CA8" />
                          <path d="M 195 160 L 215 160 L 212 165 L 198 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 231 145 Q 240 134 249 145 Z" fill="#1D6FB4" />
                          <circle cx="240" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="237.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="242.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="235.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="244.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 230 160 L 250 160 L 256 195 L 224 195 Z" fill="#EE8A6A" />
                          <path d="M 230 160 L 250 160 L 247 165 L 233 165 Z" fill="#fff" />
                        </g>
                        <g>
                          <path d="M 266 145 Q 275 134 284 145 Z" fill="#E11D2A" />
                          <circle cx="275" cy="152" r="8" fill="#F5D6A9" />
                          <circle cx="272.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="277.5" cy="150" r="0.9" fill="#333" />
                          <circle cx="270.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <circle cx="279.5" cy="154" r="1.2" fill="#F2A0AA" />
                          <path d="M 265 160 L 285 160 L 291 195 L 259 195 Z" fill="#2A9D8F" />
                          <path d="M 265 160 L 285 160 L 282 165 L 268 165 Z" fill="#fff" />
                        </g>
                      </g>
                      <line x1="0" y1="200" x2="300" y2="200" stroke="#5B3A1E" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </Link>
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
