'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import EmailPreviewModal from '@/components/email-preview-modal';
import { EmailLog } from '@/lib/types';
import { Mail, Clock, Sparkles, Send, Bell, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EmailSettingsPage() {
  const [email, setEmail] = useState('vanbuiquoc@gmail.com');
  const [time, setTime] = useState('08:00');
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/email');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSendTestNow = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: email,
          note: 'Gửi thử nghiệm ngẫu nhiên từ cài đặt email hằng ngày!'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-20 md:pb-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">Lịch Nhắc Học Hằng Ngày Qua Email 🇰🇷</h1>
          </div>
          <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400">Cấu hình thời gian gửi và địa chỉ email nhận bài học tiếng Hàn tự động</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Form settings */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Cấu Hình Lịch Nhắc
            </h2>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email Nhận Thông Báo:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Thời Gian Gửi Mỗi Ngày:
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                Gemini Spark sẽ kết nối qua <strong>MCP Server</strong> tự động gửi bộ từ vựng mới nhất vào <strong>{time} sáng</strong> hàng ngày.
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 text-[12px] sm:text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm"
              >
                {isSaved ? '✓ Đã Lưu Cấu Hình!' : 'Lưu Thay Đổi'}
              </button>

              <button
                type="button"
                onClick={handleSendTestNow}
                disabled={isSending}
                className="px-4 py-2.5 text-[12px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-full flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Gửi Thử</span>
              </button>
            </div>
          </form>

          {/* Info Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-rose-50 text-rose-700 dark:bg-slate-700 dark:text-rose-300 border border-rose-200 dark:border-slate-600 rounded-full text-[11px] font-bold">
                <Bell className="w-3.5 h-3.5 text-rose-600" /> Tự Động Hóa MCP
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Cách Hoạt Động Của Email Nhắc Học</h3>
              <p className="text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Mỗi khi Gemini Spark trích xuất từ vựng từ video YouTube hoặc tạo bộ bài học mới, nó sẽ gọi Tool <code>send_daily_study_email</code> trên website.
              </p>
              <p className="text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Email chứa đường link trực tiếp giúp bạn mở đúng bộ thẻ Flashcard để học ngay lập tức.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2.5 text-[12px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center gap-1.5 hover:bg-slate-100"
            >
              <span>Xem Trước Mẫu Email</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* LOGS HISTORY TABLE */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" /> Lịch Sử Email Đã Gửi ({logs.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5 sm:p-3">Thời gian</th>
                  <th className="p-2.5 sm:p-3">Người nhận</th>
                  <th className="p-2.5 sm:p-3">Bộ từ vựng</th>
                  <th className="p-2.5 sm:p-3">Số thẻ</th>
                  <th className="p-2.5 sm:p-3">Trạng thái</th>
                  <th className="p-2.5 sm:p-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-2.5 sm:p-3 text-[11px] sm:text-[12px] whitespace-nowrap">{new Date(log.sentAt).toLocaleString()}</td>
                    <td className="p-2.5 sm:p-3 font-mono text-slate-900 dark:text-white">{log.recipient}</td>
                    <td className="p-2.5 sm:p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{log.deckTitle}</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap">{log.cardCount} từ</td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full font-bold text-[10px] sm:text-[11px]">
                        ✓ Đã Gửi
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-right whitespace-nowrap">
                      <Link
                        href={log.previewUrl || '#'}
                        className="px-3 py-1 text-[11px] sm:text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                      >
                        Mở Thẻ Học
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <EmailPreviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipientEmail={email} />
    </div>
  );
}
