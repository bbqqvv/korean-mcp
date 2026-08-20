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
  Bell,
  Palette,
  Bot,
  Mail,
  Sliders,
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
  Laptop,
  GraduationCap,
  Target,
  Sparkle,
  Terminal,
  VolumeX,
  Languages,
  KeyRound,
  Smartphone,
  BookOpen,
  Lock
} from 'lucide-react';

type SettingsTab =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'ai'
  | 'theme'
  | 'email'
  | 'mcp';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'profile';

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const { mode, subStyle, ambientEffect, ambientAudio, setMode, setSubStyle, setAmbientEffect, setAmbientAudio, theme, setTheme, themeConfig } = useTheme();

  // Profile Form State
  const [fullName, setFullName] = useState('LynKore Learner');
  const [topikLevel, setTopikLevel] = useState('TOPIK I (Cấp 1 - 2)');
  const [dailyGoal, setDailyGoal] = useState('15 từ vựng / ngày');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  // AI & TTS State
  const [voiceGender, setVoiceGender] = useState('female');
  const [speechRate, setSpeechRate] = useState('0.85');
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isSavedAI, setIsSavedAI] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSavedSecurity, setIsSavedSecurity] = useState(false);

  // Notifications State
  const [streakRemind, setStreakRemind] = useState(true);
  const [emailRemind, setEmailRemind] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [isSavedNotify, setIsSavedNotify] = useState(false);

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
    if (tabParam && ['profile', 'security', 'notifications', 'ai', 'theme', 'email', 'mcp'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
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

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAI(true);
    setTimeout(() => setIsSavedAI(false), 2500);
  };

  const handleTestTool = async () => {
    setIsTestingTool(true);
    setResponseLog(null);

    let payload: any = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: activeTool, arguments: {} }
    };

    if (activeTool === 'create_vocab_deck' || activeTool === 'add_flashcards') {
      try {
        payload.params.arguments = JSON.parse(jsonInput);
      } catch (err) {
        setResponseLog('Lỗi JSON Input không hợp lệ!');
        setIsTestingTool(false);
        return;
      }
    } else if (activeTool === 'send_daily_study_email') {
      payload.params.arguments = mcpEmailInput;
    }

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));

      if (activeTool === 'send_daily_study_email' && data.result) {
        setIsEmailPreviewOpen(true);
      }
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    } finally {
      setIsTestingTool(false);
    }
  };

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* LEFT SUB-SIDEBAR: FOCUS 100% ON KOREAN LEARNING */}
      <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 select-none overflow-y-auto">
        {/* Brand & Back Link */}
        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Image
              src="/krlogo.png"
              alt="LynKore Logo"
              width={34}
              height={34}
              className="w-8.5 h-8.5 rounded-xl object-contain shadow-2xs"
            />
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight block leading-none">LynKore</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">Cài Đặt Học Tập</span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại Trang Chủ
          </Link>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 p-3 space-y-5 text-xs">
          {/* GROUP 1: TÀI KHOẢN HỌC VIÊN */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Tài khoản học viên
            </span>

            {[
              { id: 'profile', label: 'Hồ sơ & Trình độ', icon: User },
              { id: 'security', label: 'Bảo mật tài khoản', icon: Shield },
              { id: 'notifications', label: 'Thông báo nhắc học', icon: Bell }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as SettingsTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* GROUP 2: CÀI ĐẶT HỌC TẬP & AI */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Cài đặt học tập & AI
            </span>

            {[
              { id: 'ai', label: 'Gia Sư AI & Giọng Đọc', icon: Bot },
              { id: 'theme', label: 'Giao diện & Hiệu ứng', icon: Palette },
              { id: 'email', label: 'Lịch Mail Ôn Bài', icon: Mail },
              { id: 'mcp', label: 'Kết nối Gemini MCP', icon: Sliders }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as SettingsTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
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

        {/* Sub-Sidebar Footer */}
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

      {/* RIGHT CONTENT PANEL */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* TAB 1: HỒ SƠ & TRÌNH ĐỘ TOPIK */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Hồ sơ & Trình độ Học viên 🇰🇷
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Cập nhật ảnh đại diện, trình độ TOPIK và mục tiêu từ vựng mỗi ngày của bạn.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
                  {/* Avatar row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ảnh đại diện
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ảnh hiển thị góc dưới Sidebar và bảng điểm.
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-4">
                      <Image
                        src="/krlogo.png"
                        alt="LynKore Avatar"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-2xl object-contain bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
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

                  {/* Họ tên */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Họ và tên
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tên học viên hiển thị công khai.
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

                  {/* Trình độ TOPIK */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-600" /> Trình độ Tiếng Hàn
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Để AI đề xuất độ khó từ vựng phù hợp.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={topikLevel}
                        onChange={(e) => setTopikLevel(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none shadow-2xs"
                      >
                        <option value="Sơ cấp 1 (Chữ Hangeul & Câu cơ bản)">Sơ cấp 1 (Chữ Hangeul & Câu cơ bản)</option>
                        <option value="Sơ cấp 2 (Giao tiếp hàng ngày)">Sơ cấp 2 (Giao tiếp hàng ngày)</option>
                        <option value="TOPIK I (Cấp 1 - 2)">TOPIK I (Cấp 1 - 2)</option>
                        <option value="TOPIK II (Cấp 3 - 4 trung cấp)">TOPIK II (Cấp 3 - 4 trung cấp)</option>
                        <option value="TOPIK II (Cấp 5 - 6 cao cấp)">TOPIK II (Cấp 5 - 6 cao cấp)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mục tiêu từ vựng */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-emerald-600" /> Mục tiêu từ vựng / ngày
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Số lượng từ vựng tối thiểu cần ôn hằng ngày.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none shadow-2xs"
                      >
                        <option value="5 từ vựng / ngày">5 từ vựng / ngày (Thư thả)</option>
                        <option value="15 từ vựng / ngày">15 từ vựng / ngày (Khuyên dùng)</option>
                        <option value="30 từ vựng / ngày">30 từ vựng / ngày (Tăng tốc TOPIK)</option>
                        <option value="50 từ vựng / ngày">50 từ vựng / ngày (Chuyên sâu)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ngôn ngữ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-purple-600" /> Ngôn ngữ hiển thị
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ngôn ngữ mặc định dịch nghĩa từ vựng.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none shadow-2xs"
                      >
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="한국어">한국어 (Tiếng Hàn)</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102"
                  >
                    {isSavedProfile ? '✓ Đã Lưu Thay Đổi!' : 'Lưu Thay Đổi Hồ Sơ'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: GIA SƯ AI & GIỌNG ĐỌC TTS */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Bot className="w-7 h-7 text-blue-600" /> Gia Sư AI & Giọng Đọc Phát Âm (TTS) 🤖
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tùy chỉnh giọng đọc chuẩn Hàn Quốc, tốc độ phát âm và mô hình trí tuệ nhân tạo LynKore AI.
                </p>
              </div>

              <form onSubmit={handleSaveAI} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
                  {/* Giọng đọc Nam/Nữ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-blue-600" /> Giọng đọc phát âm Tiếng Hàn
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Áp dụng khi bấm phát âm ở từ vựng và câu ví dụ.
                      </p>
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setVoiceGender('female')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          voiceGender === 'female'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        👩 Giọng Nữ (Su-jin - Chuẩn Seoul)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVoiceGender('male')}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          voiceGender === 'male'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        👨 Giọng Nam (Min-jun - Chuẩn Seoul)
                      </button>
                    </div>
                  </div>

                  {/* Tốc độ đọc */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Tốc độ đọc phát âm
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tùy chỉnh độ nhanh chậm khi nghe thẻ Flashcard.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none shadow-2xs"
                      >
                        <option value="0.7">0.7x (Đọc chậm rõ từng âm - Cho người mới học)</option>
                        <option value="0.85">0.85x (Tốc độ tiêu chuẩn khuyên dùng)</option>
                        <option value="1.0">1.0x (Tốc độ nói thực tế người bản xứ Hàn Quốc)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tự động phát âm khi lật thẻ */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Tự động phát âm khi lật thẻ
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tự động đọc âm thanh ngay khi bạn lật sang từ mới.
                      </p>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {autoPlayAudio ? '🔊 Đang BẬT tự động phát âm' : '🔇 Đang TẮT tự động phát âm'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          autoPlayAudio
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {autoPlayAudio ? 'Bật' : 'Tắt'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102"
                  >
                    {isSavedAI ? '✓ Đã Lưu Cấu Hình AI!' : 'Lưu Cấu Hình AI & Giọng Đọc'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: GIAO DIỆN & HIỆU ỨNG */}
          {activeTab === 'theme' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Palette className="w-7 h-7 text-purple-600" /> Giao Diện & Hiệu Ứng Rơi 🎨
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tùy chỉnh Chế độ Sáng/Tối, bộ màu chủ đạo, hiệu ứng rơi môi trường và nhạc nền Lofi.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
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
                        className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 font-bold text-xs transition-all ${
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
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hiệu ứng rơi môi trường:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'none', label: 'Tắt 🚫' },
                    { id: 'sakura', label: 'Hoa Anh Đào 🌸' },
                    { id: 'snow', label: 'Tuyết Rơi ❄️' },
                    { id: 'stars', label: 'Ngôi Sao ✨' }
                  ].map((ef) => (
                    <button
                      key={ef.id}
                      onClick={() => setAmbientEffect(ef.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center ${
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
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nhạc nền Lofi & Âm thanh thư giãn:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'none', label: 'Tắt 🔇' },
                    { id: 'lofi', label: 'Lofi Chill 🎵' },
                    { id: 'rain', label: 'Tiếng Mưa 🌧️' },
                    { id: 'cafe', label: 'Cà Phê ☕' }
                  ].map((au) => (
                    <button
                      key={au.id}
                      onClick={() => setAmbientAudio(au.id as any)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center ${
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

          {/* TAB 4: LỊCH MAIL ÔN BÀI */}
          {activeTab === 'email' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Mail className="w-7 h-7 text-rose-600" /> Lịch Gửi Mail Ôn Bài Tự Động ✉️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Cấu hình thời gian nhận email nhắc nhở từ vựng và xem lại lịch sử các bài học đã gửi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={(e) => { e.preventDefault(); setIsSavedEmail(true); setTimeout(() => setIsSavedEmail(false), 2000); }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Cấu Hình Lịch Nhắc Học</h2>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Nhận Bài Học:</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Giờ Gửi Email Hằng Ngày:
                    </label>
                    <input
                      type="time"
                      value={notifyTime}
                      onChange={(e) => setNotifyTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs"
                    >
                      {isSavedEmail ? '✓ Đã Lưu!' : 'Lưu Cấu Hình Mail'}
                    </button>
                  </div>
                </form>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-full text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Tự Động Hóa Bài Học
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Mẫu Email Học Viên Nhận Được</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Mỗi ngày hệ thống tổng hợp bộ thẻ Flashcard mới nhất kèm link học trực tiếp gửi thẳng vào hộp thư của bạn.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEmailPreviewOpen(true)}
                    className="w-full py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>Xem Mẫu Email Gửi Học Viên</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KẾT NỐI GEMINI MCP */}
          {activeTab === 'mcp' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Sliders className="w-7 h-7 text-emerald-600" /> Kết Nối Gemini MCP Server 🤖
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  URL kết nối JSON-RPC 2.0 giúp Gemini Spark trích xuất từ vựng từ YouTube tự động.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                      MCP SERVER ENDPOINT URL
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">Dùng URL này để kết nối Gemini Spark hoặc Cursor</p>
                  </div>
                  <button
                    onClick={copyEndpoint}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép URL'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="truncate mr-2 font-bold">{mcpEndpointUrl}</span>
                  <span className="shrink-0 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                    POST
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BẢO MẬT (EXACT MATCH WITH SCREENSHOT!) */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Bảo mật
                </h1>
              </div>

              {/* Card 1: Đổi mật khẩu */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-6 space-y-5">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Đổi mật khẩu
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cập nhật mật khẩu đăng nhập của bạn.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <span className="text-slate-400 font-serif font-bold">ⓘ</span>
                      <span>Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      setIsSavedSecurity(true);
                      setTimeout(() => setIsSavedSecurity(false), 2000);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102"
                  >
                    {isSavedSecurity ? '✓ Đã Cập Nhật!' : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </div>

              {/* Card 2: Xác thực hai bước (2FA) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Xác thực hai bước (2FA)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bảo vệ tài khoản với mã OTP mỗi lần đăng nhập.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                    {is2FAEnabled ? 'ĐÃ BẬT' : 'CHƯA BẬT'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-2xs">
                    <Shield className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Thêm lớp bảo vệ cho tài khoản
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Thêm một lớp bảo vệ bằng mã OTP từ ứng dụng xác thực. Sau khi bật, mỗi lần đăng nhập bạn sẽ cần nhập mã từ ứng dụng như Google Authenticator.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{is2FAEnabled ? 'Tắt 2FA' : 'Bật 2FA'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Mã khôi phục */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Mã khôi phục
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mã dự phòng để đăng nhập khi mất thiết bị 2FA.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center py-6">
                  <p className="text-xs text-slate-400 italic">
                    {is2FAEnabled ? 'Danh sách 8 mã dự phòng: [ 8492-4910, 9301-5820, 2049-1829, ... ]' : 'Bật xác thực hai bước để tạo mã khôi phục.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: THÔNG BÁO NHẮC HỌC */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Bell className="w-7 h-7 text-amber-500" /> Thông Báo & Nhắc Học 🔔
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Cài đặt thông báo chuỗi học Streak và âm thanh.</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Nhắc nhở giữ chuỗi Streak 🔥</span>
                    <span className="text-[11px] text-slate-500">Thông báo khi bạn sắp bỏ lỡ chuỗi ngày học liên tục.</span>
                  </div>
                  <button
                    onClick={() => setStreakRemind(!streakRemind)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      streakRemind ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                    }`}
                  >
                    {streakRemind ? 'Bật' : 'Tắt'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Âm thanh chúc mừng khi xong Quiz 🎉</span>
                    <span className="text-[11px] text-slate-500">Phát âm thanh hoa hòe khi làm đúng 100% câu hỏi.</span>
                  </div>
                  <button
                    onClick={() => setSoundEffects(!soundEffects)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      soundEffects ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                    }`}
                  >
                    {soundEffects ? 'Bật' : 'Tắt'}
                  </button>
                </div>
              </div>
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
