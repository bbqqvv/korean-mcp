'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme, THEME_CONFIGS, ThemeId, SubStyleId } from '@/lib/theme-context';
import CreateDeckModal from '@/components/create-deck-modal';
import EmailPreviewModal from '@/components/email-preview-modal';
import { EmailLog } from '@/lib/types';
import {
  User,
  Shield,
  Link as LinkIcon,
  Bell,
  Laptop,
  Palette,
  Bot,
  Mail,
  Sliders,
  Users,
  BarChart3,
  Key,
  AlertTriangle,
  ChevronLeft,
  Upload,
  Trash2,
  Check,
  Copy,
  Play,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Sun,
  Moon,
  LogOut,
  Settings
} from 'lucide-react';

type SettingsTab =
  | 'profile'
  | 'security'
  | 'linked'
  | 'notifications'
  | 'sessions'
  | 'theme'
  | 'mcp'
  | 'email'
  | 'ai'
  | 'members'
  | 'usage'
  | 'api'
  | 'danger';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'profile';

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const { mode, subStyle, ambientEffect, ambientAudio, setMode, setSubStyle, setAmbientEffect, setAmbientAudio, theme, setTheme, themeConfig } = useTheme();

  // Profile Form State
  const [fullName, setFullName] = useState('LynKore Learner');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  // MCP Tab State
  const [copied, setCopied] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('create_vocab_deck');
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      {
        title: 'Từ vựng Tiếng Hàn Công Sở (Gemini Spark)',
        category: 'Công sở & Địa điểm',
        description: 'Được tự động trích xuất bởi Gemini Spark',
        vocabulary: [
          {
            korean: '회의',
            pronunciation: 'hoe-ui',
            vietnamese: 'Cuộc họp / Khóa họp',
            hanja: '會議 (Hội nghị)',
            example_kr: '오후 2시에 회의가 있습니다.',
            example_vi: 'Có cuộc họp lúc 2 giờ chiều.'
          }
        ]
      },
      null,
      2
    )
  );
  const [mcpEmailInput, setMcpEmailInput] = useState({
    recipient_email: 'learner@lynkore.edu.vn',
    note_for_today: 'Chào bạn! Hôm nay hãy ôn từ vựng mới nhé!'
  });
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isTestingTool, setIsTestingTool] = useState(false);

  // Email Tab State
  const [userEmail, setUserEmail] = useState('learner@lynkore.edu.vn');
  const [notifyTime, setNotifyTime] = useState('08:00');
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isSavedEmail, setIsSavedEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  // AI Tab State
  const [speechRate, setSpeechRate] = useState('0.85');
  const [isSavedAI, setIsSavedAI] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const mcpEndpointUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/mcp`
      : 'http://localhost:3000/api/mcp';

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/email');
        const data = await res.json();
        if (data.success) setLogs(data.logs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsTab;
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`);
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(mcpEndpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedProfile(true);
    setTimeout(() => setIsSavedProfile(false), 2500);
  };

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* LEFT SETTINGS SUB-SIDEBAR (EXACT LAYOUT FROM IMAGE 2!) */}
      <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 select-none overflow-y-auto">
        {/* Brand & Back Button */}
        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Image
              src="/krlogo.png"
              alt="LynKore Logo"
              width={34}
              height={34}
              className="w-8.5 h-8.5 rounded-xl object-contain shadow-2xs"
            />
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">LynKore</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Trang Chủ
          </Link>
        </div>

        {/* Navigation Group Menu Items */}
        <div className="flex-1 p-3 space-y-5 text-xs">
          {/* GROUP 1: THIẾT LẬP TÀI KHOẢN */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Thiết lập tài khoản
            </span>

            {[
              { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
              { id: 'security', label: 'Bảo mật', icon: Shield },
              { id: 'linked', label: 'Tài khoản liên kết', icon: LinkIcon },
              { id: 'notifications', label: 'Thông báo', icon: Bell },
              { id: 'sessions', label: 'Phiên đăng nhập', icon: Laptop }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as SettingsTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all text-left ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* GROUP 2: THIẾT LẬP HỆ THỐNG */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Cài đặt hệ thống
            </span>

            {[
              { id: 'theme', label: 'Giao diện & Hiệu ứng', icon: Palette },
              { id: 'mcp', label: 'MCP Server', icon: Bot },
              { id: 'email', label: 'Lịch Mail Nhắc Học', icon: Mail },
              { id: 'ai', label: 'AI Gia Sư & TTS', icon: Sliders },
              { id: 'members', label: 'Thành viên', icon: Users },
              { id: 'usage', label: 'Mức sử dụng', icon: BarChart3 },
              { id: 'api', label: 'Tích hợp & API', icon: Key },
              { id: 'danger', label: 'Vùng nguy hiểm', icon: AlertTriangle }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as SettingsTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all text-left ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Sidebar Footer User Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
          <Image
            src="/krlogo.png"
            alt="LynKore Learner"
            width={32}
            height={32}
            className="w-8 h-8 rounded-xl object-contain shadow-2xs shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">LynKore Learner</p>
            <p className="text-[10px] text-slate-400 truncate">learner@lynkore.edu.vn</p>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA (EXACT LAYOUT FROM IMAGE 2!) */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* TAB 1: HỒ SƠ CÁ NHÂN (EXACT DESIGN MATCHING IMAGE 2!) */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Hồ sơ cá nhân
                </h1>
              </div>

              {/* Thông tin cá nhân Section */}
              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Thông tin cá nhân
                    </h2>
                    <p className="text-xs text-slate-500">
                      Cập nhật ảnh đại diện và thông tin cá nhân của bạn.
                    </p>
                  </div>

                  {/* Ảnh đại diện row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ảnh đại diện
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Khuyến nghị 200x200px. JPG, PNG. Tối đa 2MB.
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-4">
                      <Image
                        src="/krlogo.png"
                        alt="LynKore Avatar"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-contain bg-white border border-slate-200 dark:border-slate-700 shadow-xs"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-slate-500" /> Tải ảnh mới
                        </button>
                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Họ và tên row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Họ và tên
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tên hiển thị công khai trong hệ thống.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Email row (Fixed) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        Email <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-bold uppercase">CỐ ĐỊNH</span>
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Liên hệ quản trị viên để thay đổi.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="email"
                        disabled
                        value="learner@lynkore.edu.vn"
                        className="w-full bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Ngôn ngữ row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-200/70 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ngôn ngữ
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ngôn ngữ hiển thị ưu tiên.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none shadow-2xs"
                      >
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="한국어">한국어 (Tiếng Hàn)</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102"
                  >
                    {isSavedProfile ? '✓ Đã Lưu Thay Đổi!' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: GIAO DIỆN & HIỆU ỨNG */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Giao diện & Hiệu ứng 🎨</h1>
                <p className="text-xs text-slate-500">Tùy chỉnh chế độ Sáng/Tối, bộ màu chủ đạo, hiệu ứng rơi và nhạc nền Lofi.</p>
              </div>

              {/* Mode Selection */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chế độ hiển thị:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Sáng ☀️', icon: Sun },
                    { id: 'dark', label: 'Tối 🌙', icon: Moon },
                    { id: 'system', label: 'Tự động 💻', icon: Laptop }
                  ].map((m) => {
                    const IconComp = m.icon;
                    const isSelected = mode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 font-bold text-xs transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ambient Effects */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hiệu ứng rơi môi trường:</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'none', label: 'Tắt 🚫' },
                    { id: 'sakura', label: 'Hoa Anh Đào 🌸' },
                    { id: 'snow', label: 'Tuyết Rơi ❄️' },
                    { id: 'stars', label: 'Ngôi Sao ✨' }
                  ].map((ef) => (
                    <button
                      key={ef.id}
                      onClick={() => setAmbientEffect(ef.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        ambientEffect === ef.id
                          ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {ef.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Audio */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nhạc nền Lofi & Âm thanh thư giãn:</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'none', label: 'Tắt 🔇' },
                    { id: 'lofi', label: 'Lofi Chill 🎵' },
                    { id: 'rain', label: 'Tiếng Mưa 🌧️' },
                    { id: 'cafe', label: 'Cà Phê ☕' }
                  ].map((au) => (
                    <button
                      key={au.id}
                      onClick={() => setAmbientAudio(au.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        ambientAudio === au.id
                          ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {au.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MCP SERVER */}
          {activeTab === 'mcp' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">MCP Server Endpoint 🤖</h1>
                <p className="text-xs text-slate-500">Kết nối Gemini Spark hoặc Cursor với ứng dụng LynKore.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600">{mcpEndpointUrl}</span>
                  <button
                    onClick={copyEndpoint}
                    className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700"
                  >
                    {copied ? 'Đã sao chép!' : 'Sao chép URL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS FALLBACK */}
          {['security', 'linked', 'notifications', 'sessions', 'email', 'ai', 'members', 'usage', 'api', 'danger'].includes(activeTab) && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
                <Settings className="w-6 h-6 animate-spin" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                Cài đặt {activeTab}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Mục thiết lập này được bảo vệ với xác thực mã hóa an toàn.
              </p>
            </div>
          )}
        </div>
      </main>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        recipientEmail={userEmail}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] p-8 max-w-5xl mx-auto space-y-6">
          <div className="animate-pulse h-10 w-1/3 bg-slate-200 rounded-xl" />
          <div className="animate-pulse h-64 w-full bg-slate-200 rounded-3xl" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
