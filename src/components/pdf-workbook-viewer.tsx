'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Pen,
  Highlighter,
  Eraser,
  Type,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Music,
  Upload,
  FilePlus,
  BookOpen,
  CheckCircle,
  FileText,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Search,
  MousePointer,
  SkipBack,
  SkipForward,
  BookMarked,
  Minus,
  Plus,
  Maximize2,
  RotateCw
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

interface PDFWorkbookViewerProps {
  courseId: string;
  courseTitle: string;
  courseCategory: string;
}

type ToolMode = 'select' | 'pen' | 'highlighter' | 'eraser' | 'text';

interface DrawingStroke {
  tool: 'pen' | 'highlighter';
  color: string;
  size: number;
  points: Array<{ x: number; y: number }>;
}

interface TextNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface AudioTrack {
  id: string;
  lessonId: number;
  lessonTitle: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

const LESSON_MAP: Record<number, string> = {
  1: 'Bài 1: Giới thiệu bản thân (자기소개)',
  2: 'Bài 2: Trường học & Địa điểm (학교와 장소)',
  3: 'Bài 3: Sinh hoạt hàng ngày (일상생활)',
  4: 'Bài 4: Ngày và Thứ (날짜와 요일)',
  5: 'Bài 5: Công việc hàng ngày (하루 일과)',
  6: 'Bài 6: Cuối tuần & Giải trí (주말)',
  7: 'Bài 7: Mua sắm & Giá cả (쇼핑)',
  8: 'Bài 8: Món ăn & Nấu nướng (음식)',
  9: 'Bài 9: Nhà cửa & Phòng ở (집)',
  10: 'Bài 10: Gia đình & Thân nhân (가족)',
  11: 'Bài 11: Thời tiết & Mùa (날씨)',
  12: 'Bài 12: Điện thoại & Tin nhắn (전화)',
  13: 'Bài 13: Bệnh viện & Sức khỏe (병원)',
  14: 'Bài 14: Giao thông & Phương tiện (교통)',
  15: 'Bài 15: Du lịch & Kì nghỉ (여행)'
};

// Generate Index of all 153 extracted MP3 tracks from books_content/audio_tracks
const ALL_153_AUDIO_TRACKS: AudioTrack[] = Array.from({ length: 153 }, (_, i) => {
  const trackNum = i + 1;
  const pad = trackNum.toString().padStart(3, '0');
  const lessonId = Math.min(15, Math.floor(i / 10) + 1);
  const partInLesson = (i % 10) + 1;
  return {
    id: `track-${pad}`,
    lessonId,
    lessonTitle: LESSON_MAP[lessonId] || `Bài ${lessonId}`,
    name: `Track ${pad} — ${LESSON_MAP[lessonId] || `Bài ${lessonId}`} (Phần ${partInLesson})`,
    url: `/books_content/audio_tracks/Nghe GT Tieng Han Tong Hop 1/tieng Han tong hop 1 - nghe/${pad}.mp3`
  };
});

// Sample Korean Textbook Content
const SAMPLE_TEXTBOOK_PAGES = [
  {
    pageNumber: 1,
    title: '제1과: 자기소개 (Bài 1: Giới thiệu bản thân)',
    subtitle: 'Nền tảng giao tiếp Sơ cấp 1 — Bảng chữ cái & Danh từ xưng hô',
    vocab: [
      { kr: '안녕하세요', vi: 'Xin chào', pron: 'an-nyeong-ha-se-yo' },
      { kr: '한국', vi: 'Hàn Quốc', pron: 'han-guk' },
      { kr: '베트남', vi: 'Việt Nam', pron: 'be-teu-nam' },
      { kr: '학생', vi: 'Học sinh', pron: 'hak-saeng' },
      { kr: '선생님', vi: 'Giáo viên', pron: 'seon-saeng-nim' },
      { kr: '회사원', vi: 'Nhân viên công ty', pron: 'hoe-sa-won' }
    ],
    grammar: {
      title: 'N + 입니다 / N + 이/가 아닙니다',
      desc: 'Đuôi câu khẳng định "Là N" và phủ định "Không phải là N" dùng trong ngữ cảnh trang trọng.',
      example: '저는 베트남 사람입니다. (Tôi là người Việt Nam.)'
    },
    dialogue: [
      { speaker: '민수', kr: '안녕하세요? 저는 김민수입니다.', vi: 'Xin chào? Tôi là Kim Min-su.' },
      { speaker: '남', kr: '안녕하세요, 민수 씨? 저는 남입니다.', vi: 'Xin chào anh Min-su? Tôi là Nam.' },
      { speaker: '민수', kr: '남 씨는 학생입니까?', vi: 'Anh Nam có phải là học sinh không?' },
      { speaker: '남', kr: '네, 저는 학생입니다.', vi: 'Vâng, tôi là học sinh.' }
    ],
    exercises: [
      { question: '1. Điền đuôi câu phù hợp: 저는 베트남 사람(________).', hint: 'Gợi ý: 입니다' },
      { question: '2. Dịch sang tiếng Hàn: "Tôi là giáo viên."', hint: 'Gợi ý: 저는 선생님입니다.' },
      { question: '3. Phủ định câu: 저는 학생이 (________).', hint: 'Gợi ý: 아닙니다' }
    ]
  },
  {
    pageNumber: 2,
    title: '제2과: 학교와 장소 (Bài 2: Trường học & Địa điểm)',
    subtitle: 'Từ vựng đồ dùng học tập & Cấu trúc 이에요/예요',
    vocab: [
      { kr: '학교', vi: 'Trường học', pron: 'hak-gyo' },
      { kr: '교실', vi: 'Phòng học', pron: 'gyo-sil' },
      { kr: '책상', vi: 'Bàn học', pron: 'chaek-sang' },
      { kr: '의자', vi: 'Ghế', pron: 'ui-ja' },
      { kr: '시계', vi: 'Đồng hồ', pron: 'si-gye' },
      { kr: '컴퓨터', vi: 'Máy tính', pron: 'keom-pyu-teo' }
    ],
    grammar: {
      title: 'N + 이에요/예요 & 여기/거기/저기',
      desc: 'Đuôi câu gắn sau danh từ trong giao tiếp thân mật lịch sự.',
      example: '이것은 책이에요. (Cái này là sách.) / 저것은 의자예요. (Cái kia là ghế.)'
    },
    dialogue: [
      { speaker: '수진', kr: '여기가 어디예요?', vi: 'Đây là đâu vậy?' },
      { speaker: '투안', kr: '여기는 우리 교실이에요.', vi: 'Đây là phòng học của chúng tôi.' },
      { speaker: '수진', kr: '이것은 한국어 책이에요?', vi: 'Cái này có phải sách tiếng Hàn không?' },
      { speaker: '투안', kr: '네, 한국어 책이에요.', vi: 'Vâng, là sách tiếng Hàn.' }
    ],
    exercises: [
      { question: '1. Chia đuôi 이에요/예요: 이것은 시계(________).', hint: 'Gợi ý: 예요' },
      { question: '2. Chia đuôi 이에요/예요: 저것은 책상(________).', hint: 'Gợi ý: 이에요' },
      { question: '3. Trả lời câu hỏi: 여기가 어디예요? (Trường học)', hint: 'Gợi ý: 학교예요.' }
    ]
  }
];

export default function PDFWorkbookViewer({ courseId, courseTitle, courseCategory }: PDFWorkbookViewerProps) {
  const { themeConfig } = useTheme();

  // PDF File Upload State (Default to extracted Korean textbook PDF)
  const defaultPdfPath = '/books_content/Ebook GT Tieng Han Tong Hop - So Cap 1-dang-khoa-edu.pdf';
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(defaultPdfPath);
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>('Tiếng Hàn Tổng Hợp Sơ Cấp 1.pdf');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Audio Tracks State (All 153 Extracted MP3 tracks from zip)
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(ALL_153_AUDIO_TRACKS);
  const [audioSearchQuery, setAudioSearchQuery] = useState('');
  const [selectedLessonFilter, setSelectedLessonFilter] = useState<number | 'all'>('all');

  const [activeTrack, setActiveTrack] = useState<AudioTrack>(ALL_153_AUDIO_TRACKS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeRightTab, setActiveRightTab] = useState<'audio' | 'draw'>('audio');
  const audioInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Physical Book Page Navigation State
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const pdfTotalPages = 153;
  const [readingViewMode, setReadingViewMode] = useState<'page' | 'continuous'>('page');
  const [pageInputVal, setPageInputVal] = useState('1');
  const [pdfRotation, setPdfRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [useCanvasPdf, setUseCanvasPdf] = useState(true);
  const pdfRenderCanvasRef = useRef<HTMLCanvasElement>(null);

  // PDF.js Clean Canvas Renderer (Eliminates Chrome PDFium Extracting text dialog 100%)
  useEffect(() => {
    if (!uploadedPdfUrl || !useCanvasPdf) return;

    let isMounted = true;
    const renderPdfCanvas = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
          if ((window as any).pdfjsLib) {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }
        }

        const pdfjs = (window as any).pdfjsLib;
        if (!pdfjs) return;

        const pdfDoc = await pdfjs.getDocument(uploadedPdfUrl).promise;
        if (!isMounted) return;

        const page = await pdfDoc.getPage(pdfPageNumber);
        if (!isMounted) return;

        const canvas = pdfRenderCanvasRef.current;
        if (!canvas) return;

        const scale = (zoomLevel / 100) * 1.4;
        const viewport = page.getViewport({ scale, rotation: pdfRotation });
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
        }
      } catch (err) {
        console.warn('PDF.js Canvas rendering fallback:', err);
        setUseCanvasPdf(false);
      }
    };

    renderPdfCanvas();

    return () => {
      isMounted = false;
    };
  }, [uploadedPdfUrl, pdfPageNumber, zoomLevel, pdfRotation, useCanvasPdf]);

  // Page Navigation (Sample pages fallback)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = uploadedPdfUrl ? pdfTotalPages : SAMPLE_TEXTBOOK_PAGES.length;
  const currentPage = SAMPLE_TEXTBOOK_PAGES[currentPageIndex] || SAMPLE_TEXTBOOK_PAGES[0];

  // Sync keyboard left/right arrow keys for physical book page turning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;
      
      if (e.key === 'ArrowLeft') {
        setPdfPageNumber((p) => {
          const prev = Math.max(1, p - 1);
          setPageInputVal(String(prev));
          return prev;
        });
      } else if (e.key === 'ArrowRight') {
        setPdfPageNumber((p) => {
          const next = Math.min(pdfTotalPages, p + 1);
          setPageInputVal(String(next));
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfTotalPages]);

  // Auto-sync audio track lesson filter based on current textbook page number
  useEffect(() => {
    const estimatedLesson = Math.min(15, Math.max(1, Math.ceil((pdfPageNumber - 5) / 10)));
    if (estimatedLesson >= 1 && estimatedLesson <= 15) {
      setSelectedLessonFilter(estimatedLesson);
    }
  }, [pdfPageNumber]);

  // Tool Controls State (Default to Mouse Select for smooth PDF scrolling & text selection)
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [penColor, setPenColor] = useState('#ef4444'); // Red default for workbook marking
  const [penSize, setPenSize] = useState(4);

  // Canvas Annotations per Page Index
  const [pageStrokes, setPageStrokes] = useState<Record<number, DrawingStroke[]>>({});
  const [pageTextNotes, setPageTextNotes] = useState<Record<number, TextNote[]>>({});
  const [activeTextInput, setActiveTextInput] = useState<{ id: string; x: number; y: number } | null>(null);
  const [newTextValue, setNewTextValue] = useState('');

  // Refs for Precise Bounding Box Mapping
  const paperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Array<{ x: number; y: number }>>([]);

  // Redraw Canvas Overlay
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = pageStrokes[currentPageIndex] || [];
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'highlighter' ? 'rgba(253, 224, 71, 0.55)' : stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [currentPageIndex, pageStrokes]);

  // Synchronize Canvas Dimensions 1:1 with paperRef
  useEffect(() => {
    const updateDimensions = () => {
      const paper = paperRef.current;
      const canvas = canvasRef.current;
      if (!paper || !canvas) return;

      canvas.width = paper.clientWidth;
      canvas.height = paper.clientHeight;
      redrawCanvas();
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [redrawCanvas, zoomLevel, currentPageIndex, uploadedPdfUrl]);

  // Handle PDF Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPdfUrl(url);
      setUploadedPdfName(file.name);
    }
  };

  // Handle Audio Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newTrack: AudioTrack = {
        id: `custom-${Date.now()}`,
        lessonId: 0,
        lessonTitle: 'File MP3 Tải Lên',
        name: `File MP3: ${file.name}`,
        url,
        isCustom: true
      };
      setAudioTracks((prev) => [newTrack, ...prev]);
      setActiveTrack(newTrack);
      setIsPlayingAudio(true);
    }
  };

  // Precise Canvas Coordinate Calculation (Fix Stroke Offset Bug)
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode === 'text') {
      const coords = getCanvasCoords(e);
      setActiveTextInput({ id: `note-${Date.now()}`, x: coords.x, y: coords.y });
      setNewTextValue('');
      return;
    }

    if (toolMode === 'eraser') {
      const coords = getCanvasCoords(e);
      const currentList = pageStrokes[currentPageIndex] || [];
      const filtered = currentList.filter((stroke) => {
        return !stroke.points.some(
          (p) => Math.hypot(p.x - coords.x, p.y - coords.y) < stroke.size * 3
        );
      });
      setPageStrokes((prev) => ({ ...prev, [currentPageIndex]: filtered }));
      return;
    }

    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    currentStrokeRef.current = [coords];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const coords = getCanvasCoords(e);
    currentStrokeRef.current.push(coords);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const points = currentStrokeRef.current;
    if (points.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = toolMode === 'highlighter' ? 'rgba(253, 224, 71, 0.55)' : penColor;
      ctx.lineWidth = toolMode === 'highlighter' ? 18 : penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current.length > 0) {
      const newStroke: DrawingStroke = {
        tool: toolMode === 'highlighter' ? 'highlighter' : 'pen',
        color: penColor,
        size: toolMode === 'highlighter' ? 18 : penSize,
        points: [...currentStrokeRef.current]
      };

      setPageStrokes((prev) => ({
        ...prev,
        [currentPageIndex]: [...(prev[currentPageIndex] || []), newStroke]
      }));

      currentStrokeRef.current = [];
    }
  };

  // Add Text Note
  const saveTextNote = () => {
    if (!activeTextInput || !newTextValue.trim()) {
      setActiveTextInput(null);
      return;
    }

    const note: TextNote = {
      id: activeTextInput.id,
      x: activeTextInput.x,
      y: activeTextInput.y,
      text: newTextValue.trim(),
      color: penColor
    };

    setPageTextNotes((prev) => ({
      ...prev,
      [currentPageIndex]: [...(prev[currentPageIndex] || []), note]
    }));

    setActiveTextInput(null);
    setNewTextValue('');
  };

  // Undo & Clear
  const handleUndo = () => {
    setPageStrokes((prev) => {
      const list = prev[currentPageIndex] || [];
      if (list.length === 0) return prev;
      return { ...prev, [currentPageIndex]: list.slice(0, -1) };
    });
  };

  const handleClearPage = () => {
    setPageStrokes((prev) => ({ ...prev, [currentPageIndex]: [] }));
    setPageTextNotes((prev) => ({ ...prev, [currentPageIndex]: [] }));
  };

  // Speech TTS Korean
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = playbackRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Format Time (seconds to 00:00)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-sans overflow-hidden">
      {/* Hidden File Inputs for PDF & MP3 Upload */}
      <input
        type="file"
        ref={pdfInputRef}
        accept="application/pdf"
        className="hidden"
        onChange={handlePdfUpload}
      />
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*"
        className="hidden"
        onChange={handleAudioUpload}
      />

      {/* 2-Column Split Layout: Main Physical E-Book View (Left 75%) + Light Premium Control Sidebar (Right 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-0 overflow-hidden font-sans">
        {/* Main 3D Physical Textbook View (3/4 Width) */}
        <div className="lg:col-span-3 h-full flex flex-col min-h-0 overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Main Book Canvas / Page Viewport */}
          <div
            ref={paperRef}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="relative w-full h-full flex-1 bg-white dark:bg-slate-900 select-none flex flex-col overflow-hidden transition-all"
          >
            {/* Drawing Canvas Layer Overlay (100% Bound to Paper) */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`absolute inset-0 z-20 ${
                toolMode === 'select' ? 'pointer-events-none' : 'cursor-crosshair touch-none pointer-events-auto'
              }`}
            />

            {/* Text Note Layer */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {(pageTextNotes[currentPageIndex] || []).map((note) => (
                <div
                  key={note.id}
                  style={{ left: note.x, top: note.y, color: note.color }}
                  className="absolute font-mono font-bold text-xs sm:text-sm bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded shadow-xs pointer-events-auto"
                >
                  {note.text}
                </div>
              ))}

              {activeTextInput && (
                <div
                  style={{ left: activeTextInput.x, top: activeTextInput.y }}
                  className="absolute pointer-events-auto flex items-center gap-1 bg-white border-2 border-blue-600 p-1.5 rounded-xl shadow-lg z-40"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Gõ đáp án vào bài..."
                    value={newTextValue}
                    onChange={(e) => setNewTextValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTextNote();
                    }}
                    className="text-xs font-bold text-slate-900 px-2 py-1 outline-none w-44"
                  />
                  <button
                    onClick={saveTextNote}
                    className="px-2.5 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {/* Real PDF Page Viewer Container */}
            {uploadedPdfUrl ? (
              <div className="relative z-10 w-full h-full flex-1 flex flex-col items-center justify-center overflow-auto bg-slate-100 dark:bg-slate-950 p-4">
                {useCanvasPdf ? (
                  <canvas
                    ref={pdfRenderCanvasRef}
                    className="shadow-xl rounded-xl bg-white max-w-full h-auto transition-all"
                  />
                ) : (
                  <object
                    key={`pdf-page-${pdfPageNumber}-${readingViewMode}`}
                    data={`${uploadedPdfUrl}#page=${pdfPageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=${
                      readingViewMode === 'page' ? 'Fit' : 'FitH'
                    }`}
                    type="application/pdf"
                    className="w-full h-full flex-1 border-none bg-white pointer-events-auto"
                  >
                    <embed
                      src={`${uploadedPdfUrl}#page=${pdfPageNumber}&toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-full flex-1 border-none bg-white"
                    />
                  </object>
                )}
              </div>
            ) : (
              /* Interactive Sample Page */
              <div className="relative z-10 p-6 space-y-6 font-sans overflow-y-auto h-full">
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
                      {courseCategory} — TRANG {currentPage.pageNumber}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {currentPage.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => speakText(currentPage.title)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Section 1: Vocab Grid */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    1. 어휘 (TỪ VỰNG BÀI HỌC)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPage.vocab.map((v, i) => (
                      <div
                        key={i}
                        onClick={() => speakText(v.kr)}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl hover:border-blue-500 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{v.kr}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{v.vi}</p>
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Grammar */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white border-l-4 border-emerald-600 pl-2">
                    2. 문법 및 표현 (NGỮ PHÁP)
                  </h3>
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-300 rounded-xl p-3 text-xs space-y-1">
                    <p className="font-black text-emerald-900 dark:text-emerald-300">{currentPage.grammar.title}</p>
                    <p className="text-slate-700 dark:text-slate-300">{currentPage.grammar.desc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ultra-Sleek & Compact PDF Acrobat Reader Toolbar */}
          <div className="shrink-0 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-3 py-1 flex items-center justify-center gap-2 select-none">
            {/* Zoom Out (-) */}
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
              title="Thu nhỏ (-)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Zoom In (+) */}
            <button
              onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
              title="Phóng to (+)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Fit Width (↔) */}
            <button
              onClick={() => setReadingViewMode((m) => (m === 'page' ? 'continuous' : 'page'))}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
              title="Khớp chiều rộng trang"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Vertical Separator */}
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* Page Number Box [ 55 ] of 378 */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={pageInputVal}
                onChange={(e) => setPageInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const num = parseInt(pageInputVal, 10);
                    if (!isNaN(num) && num >= 1 && num <= pdfTotalPages) {
                      setPdfPageNumber(num);
                    } else {
                      setPageInputVal(String(pdfPageNumber));
                    }
                  }
                }}
                onBlur={() => {
                  const num = parseInt(pageInputVal, 10);
                  if (!isNaN(num) && num >= 1 && num <= pdfTotalPages) {
                    setPdfPageNumber(num);
                  } else {
                    setPageInputVal(String(pdfPageNumber));
                  }
                }}
                className="w-9 h-6 bg-white border border-slate-300 dark:border-slate-700 rounded text-center text-blue-600 dark:text-blue-400 font-mono font-bold text-xs outline-none focus:border-blue-600"
              />
              <span className="text-sky-700 dark:text-sky-400 font-medium text-[11px] font-sans">
                of {pdfTotalPages}
              </span>
            </div>

            {/* Vertical Separator */}
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* Rotate Page Button (🔄) */}
            <button
              onClick={() => setPdfRotation((r) => (r + 90) % 360)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
              title="Xoay trang 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Vertical Separator */}
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700 mx-0.5" />

            {/* Page Selection / Spread Mode (📄) */}
            <button
              onClick={() => setToolMode('select')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
              title="Chọn trang / Con trỏ chuột"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Light Premium Control Sidebar (1/4 Width) */}
        <div className="lg:col-span-1 h-full flex flex-col min-h-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 shadow-sm space-y-3 overflow-hidden">
          {/* Top Segmented Control Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setActiveRightTab('audio')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeRightTab === 'audio'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Kho Bài Nghe</span>
            </button>

            <button
              onClick={() => setActiveRightTab('draw')}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeRightTab === 'draw'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
              <span>Bảng Viết / Vẽ</span>
            </button>
          </div>

          {/* TAB 1: KHO BÀI NGHE (AUDIO & LESSONS) */}
          {activeRightTab === 'audio' && (
            <div className="flex-1 min-h-0 flex flex-col space-y-2.5 overflow-hidden">
              <audio
                ref={audioRef}
                src={activeTrack?.url || ''}
                onTimeUpdate={() => {
                  if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime);
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) setAudioDuration(audioRef.current.duration);
                }}
                onEnded={() => setIsPlayingAudio(false)}
              />

              {/* Upload Actions & Track Count */}
              <div className="flex items-center justify-between shrink-0 px-0.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  153 Tracks Tiếng Hàn
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                    title="Tải sách PDF mới"
                  >
                    <Upload className="w-3 h-3 text-blue-600" /> PDF
                  </button>
                  <button
                    onClick={() => audioInputRef.current?.click()}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                    title="Tải MP3 mới"
                  >
                    <Music className="w-3 h-3 text-emerald-600" /> MP3
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo Track 01, Bài 2..."
                  value={audioSearchQuery}
                  onChange={(e) => setAudioSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-xs font-medium pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Lesson Filter Dropdown */}
              <select
                value={selectedLessonFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedLessonFilter(val === 'all' ? 'all' : Number(val));
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-xs font-medium rounded-xl p-2 border border-slate-200 dark:border-slate-800 focus:outline-none shrink-0"
              >
                <option value="all">Tất cả 15 Bài học (153 Tracks)</option>
                {Object.entries(LESSON_MAP).map(([id, title]) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))}
              </select>

              {/* Scrollable Track Playlist */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 bg-slate-50/60 dark:bg-slate-950/60 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {audioTracks
                  .filter((tr) => {
                    const matchSearch = tr.name.toLowerCase().includes(audioSearchQuery.toLowerCase());
                    const matchLesson = selectedLessonFilter === 'all' || tr.lessonId === selectedLessonFilter;
                    return matchSearch && matchLesson;
                  })
                  .map((tr) => {
                    const isActive = activeTrack.id === tr.id;
                    return (
                      <button
                        key={tr.id}
                        onClick={() => {
                          setActiveTrack(tr);
                          setIsPlayingAudio(true);
                          setTimeout(() => audioRef.current?.play(), 50);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium'
                        }`}
                      >
                        <span className="truncate pr-2">{tr.name}</span>
                        {isActive && isPlayingAudio ? (
                          <Pause className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Play className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Sticky Active Track Player Bar */}
              <div className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      if (isPlayingAudio) {
                        audioRef.current?.pause();
                        setIsPlayingAudio(false);
                      } else {
                        audioRef.current?.play();
                        setIsPlayingAudio(true);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{activeTrack?.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>{formatTime(audioCurrentTime)}</span>
                      <span>{formatTime(audioDuration || 130)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Slider */}
                <input
                  type="range"
                  min={0}
                  max={audioDuration || 100}
                  value={audioCurrentTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAudioCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                {/* Speed Controller */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="font-medium">Tốc độ:</span>
                  <div className="flex items-center gap-1">
                    {[0.8, 1.0, 1.25].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate);
                          if (audioRef.current) audioRef.current.playbackRate = rate;
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                          playbackRate === rate ? 'bg-blue-600 text-white shadow-2xs font-semibold' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÔNG CỤ VIẾT / VẼ (WRITING TOOLS) */}
          {activeRightTab === 'draw' && (
            <div className="flex-1 min-h-0 flex flex-col space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Chế độ vẽ trên sách
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleUndo}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-300 dark:border-slate-700"
                    title="Quay lại nét vẽ"
                  >
                    <RotateCcw className="w-3 h-3" /> Undo
                  </button>
                  <button
                    onClick={handleClearPage}
                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-rose-200"
                    title="Xóa tất cả nét"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa trang
                  </button>
                </div>
              </div>

              {/* Mode Selection Cards */}
              <div className="space-y-1.5">
                {[
                  { mode: 'select', name: 'Con trỏ chuột', desc: 'Đọc & Cuộn trang bình thường', icon: MousePointer, color: 'text-blue-600' },
                  { mode: 'pen', name: 'Bút vẽ tay', desc: 'Viết đáp án hoặc khoanh tròn câu hỏi', icon: Pen, color: 'text-blue-600' },
                  { mode: 'highlighter', name: 'Bút dạ quang', desc: 'Tô sáng từ vựng hoặc ngữ pháp', icon: Highlighter, color: 'text-amber-500' },
                  { mode: 'text', name: 'Gõ văn bản', desc: 'Nhấp vào vị trí bất kỳ để gõ chữ', icon: Type, color: 'text-emerald-600' },
                  { mode: 'eraser', name: 'Cục tẩy', desc: 'Xóa nét vẽ hoặc văn bản thừa', icon: Eraser, color: 'text-rose-600' }
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = toolMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      onClick={() => setToolMode(item.mode as any)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-2xs'
                          : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-white shadow-2xs ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Colors Picker */}
              {toolMode === 'pen' && (
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Màu nét vẽ:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { color: '#ef4444', name: 'Đỏ' },
                      { color: '#3b82f6', name: 'Xanh' },
                      { color: '#10b981', name: 'Lá' },
                      { color: '#1e293b', name: 'Đen' }
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => setPenColor(c.color)}
                        style={{ backgroundColor: c.color }}
                        className={`h-7 rounded-xl flex items-center justify-center text-white font-bold text-[10px] transition-all ${
                          penColor === c.color ? 'ring-2 ring-blue-600 scale-105 shadow-xs' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
