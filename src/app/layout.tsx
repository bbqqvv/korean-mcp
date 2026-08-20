import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro'
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-kr'
});

export const metadata: Metadata = {
  title: 'LynKore 🇰🇷 - Học Tiếng Hàn Flashcard K-Style Tích Hợp MCP Server',
  description:
    'Ứng dụng học từ vựng tiếng Hàn bằng Flashcard tương tác cao cấp tích hợp MCP Server cho Gemini Spark kết nối tự động trích xuất bài học từ YouTube và gửi email nhắc nhở hằng ngày.',
  keywords: ['LynKore', 'Korean Flashcards', 'Học tiếng Hàn', 'Gemini Spark', 'MCP Server', 'Model Context Protocol', 'Next.js'],
  icons: {
    icon: '/krlogo.png',
    shortcut: '/krlogo.png',
    apple: '/krlogo.png',
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${notoSansKR.variable}`}>
      <body className="bg-[var(--bg-canvas,#f8fafc)] text-[var(--text-main,#0f172a)] antialiased font-sans selection:bg-blue-500 selection:text-white min-h-screen flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
