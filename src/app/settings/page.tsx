'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import EmailPreviewModal from '@/components/email-preview-modal';
import { EmailLog } from '@/lib/types';
import { useTheme, THEME_CONFIGS, ThemeId } from '@/lib/theme-context';
import {
  Settings,
  Bot,
  Mail,
  Sparkles,
  Terminal,
  Play,
  Copy,
  Check,
  Clock,
  Send,
  Bell,
  ExternalLink,
  Volume2,
  Sliders,
  Palette,
  CheckCircle2
} from 'lucide-react';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get('tab') as 'mcp' | 'email' | 'theme' | 'ai') || 'mcp';

  const [activeTab, setActiveTab] = useState<'mcp' | 'email' | 'theme' | 'ai'>(initialTab);
  const { theme, setTheme, themeConfig } = useTheme();

  // MCP Tab state
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
          },
          {
            korean: '출장',
            pronunciation: 'chul-jjang',
            vietnamese: 'Đi công tác',
            hanja: '出張 (Xuất trướng)',
            example_kr: '다음 주에 서울로 출장을 가요.',
            example_vi: 'Tuần sau tôi đi công tác Seoul.'
          }
        ]
      },
      null,
      2
    )
  );
  const [mcpEmailInput, setMcpEmailInput] = useState({
    recipient_email: 'vanbuiquoc@gmail.com',
    note_for_today: 'Chào bạn! Hôm nay hãy ôn 2 từ vựng mới về công sở nhé!'
  });
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isTestingTool, setIsTestingTool] = useState(false);

  // Email Tab state
  const [userEmail, setUserEmail] = useState('vanbuiquoc@gmail.com');
  const [notifyTime, setNotifyTime] = useState('08:00');
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isSavedEmail, setIsSavedEmail] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  // AI Tab state
  const [speechRate, setSpeechRate] = useState('0.85');
  const [isSavedAI, setIsSavedAI] = useState(false);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const mcpEndpointUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/mcp`
      : 'http://localhost:3001/api/mcp';

  const fetchEmailLogs = async () => {
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
    fetchEmailLogs();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as 'mcp' | 'email' | 'theme' | 'ai';
    if (tabParam && ['mcp', 'email', 'theme', 'ai'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'mcp' | 'email' | 'theme' | 'ai') => {
    setActiveTab(tab);
    router.push(`/settings?tab=${tab}`);
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(mcpEndpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestTool = async () => {
    setIsTestingTool(true);
    setResponseLog(null);

    let payload: any = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: activeTool,
        arguments: {}
      }
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
    } else if (activeTool === 'get_decks') {
      payload.params.arguments = {};
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

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedEmail(true);
    setTimeout(() => setIsSavedEmail(false), 2500);
  };

  const handleSendTestEmailNow = async () => {
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: userEmail,
          note: 'Gửi thử nghiệm từ trang Cài Đặt LynKore!'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchEmailLogs();
        setIsEmailPreviewOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          {/* Header Title */}
          <div className="border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-2xl ${themeConfig.primaryBg} text-white flex items-center justify-center shadow-xs`}>
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Cài Đặt Hệ Thống & Bộ Màu Thiết Kế 🇰🇷
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Tùy chọn tông màu giao diện (Xanh Chuối, Xanh Biển, Taegeuk, Obsidian), MCP Server và lịch gửi mail
                </p>
              </div>
            </div>
          </div>

          {/* DISCRETE TABS */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => handleTabChange('theme')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'theme'
                  ? `${themeConfig.primaryBg} text-white shadow-sm`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Bộ Màu Website</span>
            </button>

            <button
              onClick={() => handleTabChange('mcp')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'mcp'
                  ? `${themeConfig.primaryBg} text-white shadow-sm`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>MCP Server</span>
            </button>

            <button
              onClick={() => handleTabChange('email')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'email'
                  ? `${themeConfig.primaryBg} text-white shadow-sm`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Lịch Mail</span>
            </button>

            <button
              onClick={() => handleTabChange('ai')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ai'
                  ? `${themeConfig.primaryBg} text-white shadow-sm`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>AI & TTS</span>
            </button>
          </div>

          {/* TAB: THEME COLOR CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="border-b border-slate-200/80 pb-3">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Palette className={`w-5 h-5 ${themeConfig.primaryText}`} /> Bộ Thiết Kế Màu Sắc Toàn Website (Design Patterns)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn màu sắc bạn yêu thích. Cấu hình màu sẽ tự động lưu và áp dụng đồng bộ lên tất cả 14 trang học!
                  </p>
                </div>

                {/* THEME GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(THEME_CONFIGS) as ThemeId[]).map((id) => {
                    const cfg = THEME_CONFIGS[id];
                    const isActive = theme === id;

                    return (
                      <div
                        key={id}
                        onClick={() => setTheme(id)}
                        className={`border-2 border-slate-900 rounded-3xl p-5 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                          isActive
                            ? `bg-white shadow-md ring-4 ${cfg.accentRing}`
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Header Swatch */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.swatchGradient} shadow-xs shrink-0`} />
                            <div>
                              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                                {cfg.name}
                              </h3>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                                {id === 'lime' ? '⚡ MÀU XANH CHUỐI TƯƠI' : id === 'ocean' ? '🌊 XANH BIỂN HOÀNG GIA' : id === 'crimson' ? '🌺 ĐỎ TAEGEUK HÀN QUỐC' : '🌙 OBSIDIAN DARK MODE'}
                              </span>
                            </div>
                          </div>

                          {isActive && (
                            <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-full ${cfg.primaryBg} shadow-2xs flex items-center gap-1 shrink-0`}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đang Dùng
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {cfg.description}
                        </p>

                        {/* Swatches preview pills */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Mẫu xem trước:</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-4 h-4 rounded-full ${cfg.primaryBg}`} />
                            <span className="w-4 h-4 rounded-full bg-emerald-500" />
                            <span className="w-4 h-4 rounded-full bg-slate-900" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: MCP SERVER & SANDBOX */}
          {activeTab === 'mcp' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Endpoint Box */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] sm:text-[12px] font-bold text-rose-600 uppercase tracking-wider block">
                      MCP SERVER ENDPOINT URL (JSON-RPC 2.0)
                    </span>
                    <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5">
                      Dùng URL này để kết nối Gemini Spark hoặc Cursor với ứng dụng LynKore
                    </p>
                  </div>
                  <button
                    onClick={copyEndpoint}
                    className={`px-4 py-1.5 text-[12px] sm:text-[13px] font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full shadow-sm w-full sm:w-auto flex items-center justify-center gap-1.5 transition-colors`}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép URL'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 flex items-center justify-between overflow-x-auto">
                  <span className="truncate mr-2 font-bold">{mcpEndpointUrl}</span>
                  <span className="shrink-0 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-300">
                    HTTP POST
                  </span>
                </div>
              </section>

              {/* Guide steps */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2 shadow-sm">
                  <div className={`w-8 h-8 rounded-full ${themeConfig.primaryBg} text-white font-bold flex items-center justify-center text-xs`}>
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Cấu hình Extension</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vào mục Cài đặt Kỹ năng / Extensions trên Gemini Spark hoặc Cursor, chọn thêm custom MCP Server với URL bên trên.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Gửi Link YouTube</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dán link YouTube tiếng Hàn vào khung chat Gemini: <em>&quot;Trích xuất từ vựng clip này và đẩy lên LynKore giúp tôi&quot;</em>.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Tự Động Gửi Email</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gemini sẽ gọi tool <code>send_daily_study_email</code> gửi mail thông báo. Bạn bấm link trong email để học bài ngay!
                  </p>
                </div>
              </section>

              {/* Live Sandbox */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Terminal className={`w-4 h-4 ${themeConfig.primaryText}`} />
                      <h2 className="text-base font-black text-slate-900">Trình Chạy Thử Tool MCP (Live Sandbox)</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Giả lập việc AI Agent gọi trực tiếp vào các Tool của MCP Server</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {['create_vocab_deck', 'add_flashcards', 'get_decks', 'send_daily_study_email'].map((tool) => (
                      <button
                        key={tool}
                        onClick={() => {
                          setActiveTool(tool);
                          if (tool === 'add_flashcards') {
                            setJsonInput(
                              JSON.stringify(
                                {
                                  deck_id: 'deck-places-work',
                                  vocabulary: [
                                    {
                                      korean: '사무실',
                                      pronunciation: 'sa-mu-sil',
                                      vietnamese: 'Văn phòng',
                                      hanja: '事務室 (Sự vụ thất)',
                                      example_kr: '사무실에서 일하고 있습니다.',
                                      example_vi: 'Tôi đang làm việc ở văn phòng.'
                                    }
                                  ]
                                },
                                null,
                                2
                              )
                            );
                          } else if (tool === 'create_vocab_deck') {
                            setJsonInput(
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
                          }
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          activeTool === tool
                            ? `${themeConfig.primaryBg} text-white shadow-xs`
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Payload Tham Số ({activeTool}):
                    </label>

                    {(activeTool === 'create_vocab_deck' || activeTool === 'add_flashcards') && (
                      <textarea
                        rows={9}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    )}

                    {activeTool === 'send_daily_study_email' && (
                      <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Recipient Email:</label>
                          <input
                            type="email"
                            value={mcpEmailInput.recipient_email}
                            onChange={(e) => setMcpEmailInput({ ...mcpEmailInput, recipient_email: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Ghi chú Gemini:</label>
                          <textarea
                            rows={2}
                            value={mcpEmailInput.note_for_today}
                            onChange={(e) => setMcpEmailInput({ ...mcpEmailInput, note_for_today: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    {activeTool === 'get_decks' && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
                        Lấy toàn bộ danh sách bộ từ vựng hiện có trên website.
                      </div>
                    )}

                    <button
                      onClick={handleTestTool}
                      disabled={isTestingTool}
                      className={`w-full py-2.5 text-xs font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isTestingTool ? 'Đang gọi MCP Server...' : 'Chạy Thử Tool MCP'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Phản Hồi JSON-RPC 2.0 Từ Server:
                    </label>

                    <div className="h-[220px] sm:h-[250px] bg-slate-900 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-emerald-400 overflow-auto">
                      {responseLog ? (
                        <pre className="whitespace-pre-wrap">{responseLog}</pre>
                      ) : (
                        <span className="text-slate-500 italic">Bấm nút &quot;Chạy Thử Tool MCP&quot; để xem kết quả...</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: EMAIL REMINDERS */}
          {activeTab === 'email' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Form Settings */}
                <form onSubmit={handleSaveEmailConfig} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Mail className={`w-4 h-4 ${themeConfig.primaryText}`} /> Cấu Hình Lịch Nhắc Học Qua Email
                  </h2>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Nhận Thông Báo:</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Thời Gian Gửi Mỗi Ngày:
                    </label>
                    <input
                      type="time"
                      value={notifyTime}
                      onChange={(e) => setNotifyTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      Hệ thống sẽ tự động tổng hợp bài học mới nhất và gửi vào mail của bạn lúc <strong>{notifyTime} sáng</strong> hằng ngày.
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className={`flex-1 py-2.5 text-xs font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full shadow-xs`}
                    >
                      {isSavedEmail ? '✓ Đã Lưu Cấu Hình!' : 'Lưu Thay Đổi'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendTestEmailNow}
                      disabled={isSendingEmail}
                      className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-full flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className={`w-3.5 h-3.5 ${themeConfig.primaryText}`} />
                      <span>Gửi Thử</span>
                    </button>
                  </div>
                </form>

                {/* Info Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">
                      <Bell className="w-3.5 h-3.5 text-rose-600" /> Tự Động Hóa Nhắc Học
                    </div>
                    <h3 className="text-base font-black text-slate-900">Cách Hoạt Động Của Email Nhắc Học</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Mỗi khi Gemini Spark trích xuất từ vựng từ video YouTube hoặc bạn tạo bộ bài học mới, hệ thống sẽ tự động kích hoạt thông báo email.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Email chứa đường link trực tiếp giúp bạn mở đúng bộ thẻ Flashcard để lật bài học ngay.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEmailPreviewOpen(true)}
                    className="w-full py-2.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center gap-1.5 hover:bg-slate-100"
                  >
                    <span>Xem Trước Mẫu Email Gửi Học Viên</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Logs History Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${themeConfig.primaryText}`} /> Lịch Sử Email Đã Gửi ({logs.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Người nhận</th>
                        <th className="p-3">Bộ từ vựng</th>
                        <th className="p-3">Số thẻ</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 text-xs whitespace-nowrap">{new Date(log.sentAt).toLocaleString()}</td>
                          <td className="p-3 font-mono text-slate-900">{log.recipient}</td>
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{log.deckTitle}</td>
                          <td className="p-3 whitespace-nowrap">{log.cardCount} từ</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-xs">
                              ✓ Đã Gửi
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => router.push(log.previewUrl || '/')}
                              className={`px-3 py-1 text-xs font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full`}
                            >
                              Mở Thẻ Học
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI & TTS PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Bot className={`w-5 h-5 ${themeConfig.primaryText}`} /> Cấu Hình Gia Sư AI & Giọng Đọc Phát Âm
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Tùy chỉnh tốc độ đọc tiếng Hàn và mô hình trí tuệ nhân tạo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Model Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">MÔ HÌNH AI HIỆN TẠI</span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold text-xs rounded-full">
                        Groq Cloud
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">llama-3.3-70b-versatile</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mô hình AI siêu tốc xử lý phân tích ngữ pháp, dịch từ Hán Hàn và tạo câu ví dụ tiếng Hàn sắc nét dưới 1 giây.
                    </p>
                  </div>

                  {/* Speech Rate Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${themeConfig.primaryText} uppercase tracking-wider`}>TỐC ĐỘ PHÁT ÂM TIẾNG HÀN (TTS)</span>
                      <Volume2 className="w-4 h-4 text-slate-600" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tốc Độ Đọc Phát Âm:</label>
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="0.7">0.7x (Đọc chậm dễ nghe cho người mới học)</option>
                        <option value="0.85">0.85x (Chuẩn mực khuyên dùng)</option>
                        <option value="1.0">1.0x (Tốc độ nói của người bản xứ Hàn Quốc)</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-500">Áp dụng cho nút loa phát âm ở tất cả các thẻ Flashcard.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setIsSavedAI(true);
                      setTimeout(() => setIsSavedAI(false), 2000);
                    }}
                    className={`px-6 py-2.5 text-xs font-bold text-white ${themeConfig.primaryBg} ${themeConfig.primaryHover} rounded-full shadow-xs`}
                  >
                    {isSavedAI ? '✓ Đã Lưu Cấu Hình AI!' : 'Lưu Cấu Hình AI'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
