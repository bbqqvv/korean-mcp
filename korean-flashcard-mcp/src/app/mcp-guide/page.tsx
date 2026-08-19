'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import CreateDeckModal from '@/components/create-deck-modal';
import EmailPreviewModal from '@/components/email-preview-modal';
import { Bot, Sparkles, Terminal, Play, Copy, Check } from 'lucide-react';

export default function MCPGuidePage() {
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

  const [emailInput, setEmailInput] = useState({
    recipient_email: 'vanbuiquoc@gmail.com',
    note_for_today: 'Chào bạn! Hôm nay hãy ôn 2 từ vựng mới về công sở nhé!'
  });

  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // App Shell State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const mcpEndpointUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/mcp`
      : 'http://localhost:3001/api/mcp';

  const copyEndpoint = () => {
    navigator.clipboard.writeText(mcpEndpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestTool = async () => {
    setIsLoading(true);
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

    if (activeTool === 'create_vocab_deck') {
      try {
        payload.params.arguments = JSON.parse(jsonInput);
      } catch (err) {
        setResponseLog('Lỗi JSON Input không hợp lệ!');
        setIsLoading(false);
        return;
      }
    } else if (activeTool === 'send_daily_study_email') {
      payload.params.arguments = emailInput;
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
        setIsEmailModalOpen(true);
      }
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#faf9f6] text-slate-900 overflow-hidden font-sans">
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          {/* HEADER */}
          <section className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] sm:text-[12px] font-bold">
              <Bot className="w-3.5 h-3.5 text-rose-600" />
              <span>Model Context Protocol (MCP) Standard</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kết Nối Gemini Spark / Cursor Với Website 🇰🇷
            </h1>
            <p className="text-slate-600 text-[13px] sm:text-[14px] leading-relaxed">
              MCP Server Endpoint đã được tích hợp sẵn tại đường dẫn Backend Next.js của bạn. Bên dưới là hướng dẫn cấu hình và bộ công cụ chạy thử nghiệm thực tế (Playground).
            </p>
          </section>

          {/* ENDPOINT URL BOX */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] sm:text-[12px] font-bold text-rose-600 uppercase tracking-wider block">
                  MCP SERVER ENDPOINT URL (JSON-RPC 2.0)
                </span>
                <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5">Dùng URL này để điền vào phần MCP Connectors trong Gemini Spark</p>
              </div>
              <button
                onClick={copyEndpoint}
                className="px-4 py-1.5 text-[12px] sm:text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm w-full sm:w-auto flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã Sao Chép!' : 'Sao Chép URL'}</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 font-mono text-[12px] sm:text-[13px] text-slate-800 flex items-center justify-between overflow-x-auto">
              <span className="truncate mr-2 font-bold">{mcpEndpointUrl}</span>
              <span className="shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold rounded border border-emerald-300">
                HTTP POST
              </span>
            </div>
          </section>

          {/* STEP BY STEP GUIDE */}
          <section className="space-y-4">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Các Bước Kết Nối Gemini Spark
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[12px]">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-[13px] sm:text-[14px]">Cấu hình MCP Extension</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Vào mục <strong>Cài đặt Kỹ năng / Extensions</strong> trên Gemini Spark hoặc Cursor, chọn thêm custom MCP Server với URL bên trên.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[12px]">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-[13px] sm:text-[14px]">Gửi Link YouTube Cho Gemini</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Dán link YouTube tiếng Hàn vào khung chat và ra lệnh: <em>&quot;Trích xuất từ vựng clip này và đẩy lên website giúp tôi&quot;</em>.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[12px]">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-[13px] sm:text-[14px]">Nhận Mail & Click Học</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Gemini sẽ gọi tool <code>send_daily_study_email</code> gửi mail thông báo. Bạn bấm link trong email để mở thẳng Flashcard học ngay!
                </p>
              </div>
            </div>
          </section>

          {/* INTERACTIVE MCP TESTER SANDBOX */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">Trình Chạy Thử Tool MCP (Live Sandbox)</h2>
                </div>
                <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5">Giả lập việc Gemini Spark gọi vào các Tool của MCP Server</p>
              </div>

              {/* Tool selectors */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200 max-w-full overflow-x-auto">
                {['create_vocab_deck', 'send_daily_study_email', 'get_decks'].map((tool) => (
                  <button
                    key={tool}
                    onClick={() => setActiveTool(tool)}
                    className={`px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-bold whitespace-nowrap transition ${
                      activeTool === tool
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Input */}
              <div className="space-y-3">
                <label className="block text-[12px] font-bold text-slate-700">
                  Payload Tham Số ({activeTool}):
                </label>

                {activeTool === 'create_vocab_deck' && (
                  <textarea
                    rows={9}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[12px] font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                )}

                {activeTool === 'send_daily_study_email' && (
                  <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[12px]">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Recipient Email:</label>
                      <input
                        type="email"
                        value={emailInput.recipient_email}
                        onChange={(e) => setEmailInput({ ...emailInput, recipient_email: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ghi chú Gemini:</label>
                      <textarea
                        rows={2}
                        value={emailInput.note_for_today}
                        onChange={(e) => setEmailInput({ ...emailInput, note_for_today: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {activeTool === 'get_decks' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[12px] text-slate-600">
                    Lấy toàn bộ danh sách bộ từ vựng hiện có trên website.
                  </div>
                )}

                <button
                  onClick={handleTestTool}
                  disabled={isLoading}
                  className="w-full py-2.5 text-[12px] sm:text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isLoading ? 'Đang gọi MCP Server...' : 'Chạy Thử Tool MCP'}</span>
                </button>
              </div>

              {/* Right: Output */}
              <div className="space-y-3">
                <label className="block text-[12px] font-bold text-slate-700">
                  Phản Hồi JSON-RPC 2.0 Từ Server:
                </label>

                <div className="h-[220px] sm:h-[250px] bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] sm:text-[12px] text-emerald-400 overflow-auto">
                  {responseLog ? (
                    <pre className="whitespace-pre-wrap">{responseLog}</pre>
                  ) : (
                    <span className="text-slate-500 italic">Bấm nút &quot;Chạy Thử Tool MCP&quot; để xem kết quả...</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EmailPreviewModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </div>
  );
}
