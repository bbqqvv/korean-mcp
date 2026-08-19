import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
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
  keywords: ['LynKore', 'Korean Flashcards', 'Học tiếng Hàn', 'Gemini Spark', 'MCP Server', 'Model Context Protocol', 'Next.js']
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${notoSansKR.variable}`}>
      <body className="bg-[#faf9f6] text-slate-900 antialiased font-sans selection:bg-rose-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
