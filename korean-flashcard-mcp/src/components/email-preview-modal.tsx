'use client';

import { ExternalLink, Sparkles, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail?: string;
  deckTitle?: string;
  cardCount?: number;
  studyUrl?: string;
  note?: string;
}

export default function EmailPreviewModal({
  isOpen,
  onClose,
  recipientEmail = 'vanbuiquoc@gmail.com',
  deckTitle = 'Địa Điểm & Công Sở (Công ty, Thị trường)',
  cardCount = 9,
  studyUrl = '/deck/deck-places-work',
  note = 'Gemini Spark đã trích xuất danh sách từ vựng hôm nay cho bạn từ clip YouTube!'
}: EmailPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Email Header bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
              M
            </div>
            <div>
              <span className="text-[13px] font-bold text-slate-900 block">Giả Lập Hộp Thư Gmail (Email Preview)</span>
              <span className="text-[11px] text-slate-500">Gửi tới: {recipientEmail}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 text-[12px] font-bold text-slate-600 hover:bg-slate-200 rounded-full"
          >
            Đóng
          </button>
        </div>

        {/* Email Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-900 text-[14px]">
          {/* Subject Line */}
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              [LynKore] 🇰🇷 Bài Học Từ Vựng Tiếng Hàn Hôm Nay Cho Bạn!
            </h3>
            <div className="flex items-center gap-3 text-[12px] text-slate-500 mt-1">
              <span>Nguồn: LynKore Bot</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> 08:00 AM Hằng ngày
              </span>
            </div>
          </div>

          {/* Styled HTML Email Content */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[12px] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Lịch Nhắc Học Hằng Ngày
            </div>

            <h4 className="text-lg font-black text-slate-900">Xin chào {recipientEmail.split('@')[0]}! 👋</h4>

            <p className="text-slate-600 leading-relaxed text-[14px]">
              Gemini Spark vừa tự động tổng hợp bộ từ vựng mới nhất dành riêng cho bạn. Hãy dành 5 phút lật thẻ Flashcard để duy trì chuỗi học tập hôm nay nhé!
            </p>

            {note && (
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-[12px] text-slate-800">
                <span className="font-bold text-rose-600">🤖 Ghi chú Gemini:</span> &quot;{note}&quot;
              </div>
            )}

            {/* Deck Summary Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
              <div className="text-[12px] text-slate-500">Bộ từ vựng hôm nay:</div>
              <div className="text-base font-bold text-slate-900">
                {deckTitle}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-slate-500 pt-1">
                <span>📚 Số lượng: <strong>{cardCount} từ vựng</strong></span>
                <span>•</span>
                <span>⏱️ Thời gian: <strong>3-5 phút</strong></span>
              </div>
            </div>

            {/* Direct Link Button */}
            <div className="pt-2 text-center">
              <Link
                href={studyUrl}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] rounded-full shadow-md"
              >
                <span>🔥 MỞ BỘ THẺ & HỌC NGAY</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="text-center text-[12px] text-slate-500">
            Email gửi tự động bởi hệ thống MCP Server kết nối với Gemini Spark.
          </div>
        </div>
      </div>
    </div>
  );
}
