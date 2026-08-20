'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Layers, Award, Bot, BookOpen } from 'lucide-react';
import { SmoothDropdown } from '@/components/smooth-dropdown';
import { useTheme } from '@/lib/theme-context';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { themeConfig } = useTheme();

  const navLinks = [
    { href: '/', label: 'Trang Chủ', icon: Layers },
    { href: '/books', label: 'Sách & Giáo Trình', icon: BookOpen },
    { href: '/mcp-guide', label: 'Cấu Hình MCP', icon: Bot, badge: 'Spark' },
    { href: '/quiz', label: 'Ôn Quiz', icon: Award }
  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 text-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo with Korean Taegeuk solid badge */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl ${themeConfig.primaryBg} text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm`}>
                <span className="font-black text-sm sm:text-base">한</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                    LynKore
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 -mt-0.5">
                  Flashcard Tiếng Hàn K-Style
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] lg:text-[14px] font-medium transition-all ${
                      isActive
                        ? `${themeConfig.primaryBg} text-white font-semibold shadow-sm`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                          isActive
                            ? 'bg-white text-slate-900'
                            : `${themeConfig.badgeBg}`
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/mcp-guide"
                className="hidden sm:inline-flex ios-chip gap-1.5 px-3.5 py-[7px] text-[12px] font-semibold text-slate-800 bg-white border border-slate-200 shadow-sm"
              >
                <Bot className={`size-[15px] ${themeConfig.primaryText}`} />
                <span>MCP Endpoint</span>
              </Link>

              <SmoothDropdown
                onSelect={(id) => {
                  if (id === 'mcp-guide') router.push('/mcp-guide');
                  else if (id === 'quiz') router.push('/quiz');
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 pointer-events-auto">
        <div className="ios-toolbar flex items-center justify-around py-2 px-3 bg-white/95 border border-slate-200 rounded-full shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition ${
                  isActive
                    ? `${themeConfig.primaryText} font-bold`
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? `${themeConfig.primaryText} scale-110` : 'text-slate-400'}`} />
                <span className="text-[10px]">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
