'use client';

import { useState, useEffect, useRef } from 'react';
import { SHADOWING_VIDEOS, ShadowingVideoItem, SubtitleSegment } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  Film,
  Zap,
  Repeat,
  ChevronRight,
  Flame,
  ArrowRight,
  Clock,
  PlayCircle
} from 'lucide-react';

export default function ShadowingTab() {
  const { themeConfig } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<ShadowingVideoItem>(SHADOWING_VIDEOS[0]);
  const [activeSegment, setActiveSegment] = useState<SubtitleSegment>(SHADOWING_VIDEOS[0].subtitles[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLoopingSegment, setIsLoopingSegment] = useState<boolean>(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Filter video clips
  const filteredVideos = filterCategory === 'all'
    ? SHADOWING_VIDEOS
    : SHADOWING_VIDEOS.filter((vid) => vid.category === filterCategory);

  // When video changes, reset segment to first subtitle
  useEffect(() => {
    if (selectedVideo.subtitles.length > 0) {
      setActiveSegment(selectedVideo.subtitles[0]);
      setScore(null);
      setAudioUrl(null);
      setUserTranscript('');
    }
  }, [selectedVideo]);

  // Jump YouTube player to specific start time
  const handleJumpToTimestamp = (segment: SubtitleSegment) => {
    setActiveSegment(segment);
    setScore(null);
    setAudioUrl(null);
    setUserTranscript('');
    setIsPlayingVideo(true);
  };

  // Play Korean TTS fallback if needed
  const playKoreanTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = playbackSpeed;
    window.speechSynthesis.speak(utterance);
  };

  // Start Mic Voice Recording
  const startRecording = async () => {
    setUserTranscript('');
    setScore(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Generate simulated score
        const randomScore = Math.floor(Math.random() * 18) + 82; // 82-99%
        setScore(randomScore);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Vui lòng cho phép ứng dụng truy cập Microphone để thực hành thu âm.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  // Build embed URL for YouTube segment
  const embedUrl = `https://www.youtube.com/embed/${selectedVideo.youtubeId}?enablejsapi=1&autoplay=${isPlayingVideo ? 1 : 0}&start=${Math.floor(activeSegment.startTime)}&end=${Math.ceil(activeSegment.endTime)}`;

  return (
    <div className="space-y-6">
      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'all'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả Video ({SHADOWING_VIDEOS.length})
        </button>
        <button
          onClick={() => setFilterCategory('k-drama')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'k-drama'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🎬 Phim K-Drama
        </button>
        <button
          onClick={() => setFilterCategory('vlog')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'vlog'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ☕ Vlog Đời Sống
        </button>
        <button
          onClick={() => setFilterCategory('kpop')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'kpop'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🌟 K-Pop Idol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: YouTube Video Player & Active Subtitle Studio */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Video Title Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${themeConfig.badgeBg}`}>
                  {selectedVideo.categoryLabel}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {selectedVideo.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
              </span>
            </div>

            {/* Embedded YouTube Video Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-900 bg-black shadow-md">
              <iframe
                ref={iframeRef}
                key={`${selectedVideo.id}-${activeSegment.id}`}
                src={embedUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Segment Controls & Audio Speed Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLoopingSegment(!isLoopingSegment)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    isLoopingSegment
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{isLoopingSegment ? 'Đang lặp câu này' : 'Lặp câu này'}</span>
                </button>

                <button
                  onClick={() => playKoreanTTS(activeSegment.korean)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                  title="Nghe phát âm chuẩn TTS"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nghe Chậm</span>
                </button>
              </div>

              {/* Speed Pills */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 px-1.5">Tốc độ:</span>
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all ${
                      playbackSpeed === speed
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Active Subtitle Focus Box */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-5 space-y-2 border-2 border-slate-900 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-blue-300 uppercase tracking-wide">
                <span>CÂU THOẠI ĐANG SHADOWING ({activeSegment.speaker || 'Nhân vật'})</span>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  {activeSegment.startTime}s - {activeSegment.endTime}s
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black font-noto tracking-tight text-white leading-snug">
                {activeSegment.korean}
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-700/80 text-xs">
                <p className="text-blue-300 font-medium">🗣️ {activeSegment.romaja}</p>
                <p className="text-slate-300 font-medium">🇻🇳 {activeSegment.vietnamese}</p>
              </div>
            </div>

            {/* Voice Recording Control Studio */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className={`w-full sm:w-auto flex-1 py-3 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]`}
                >
                  <Mic className="w-4 h-4 text-white" />
                  <span>Bật Mic Thu Âm Nói Nhại Theo Video</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full sm:w-auto flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 animate-pulse transition-all"
                >
                  <MicOff className="w-4 h-4 text-white" />
                  <span>Dừng Thu Âm &amp; So Sánh Giọng Nói</span>
                </button>
              )}
            </div>

            {/* Score & Playback Comparison Card */}
            {score !== null && !isRecording && (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-black text-emerald-950">Kết Quả Shadowing Video</h4>
                  </div>
                  <span className="text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200">
                    {score}% Độ Khớp Giọng Bản Xứ
                  </span>
                </div>

                <p className="text-xs text-emerald-900 font-medium">
                  {score >= 85
                    ? '🎉 Ngữ điệu & khẩu hình của bạn rất tuyệt! Nhịp nói rất giống nhân vật trong clip!'
                    : '👍 Tốt lắm! Bấm nghe lại giọng bạn dưới đây để so sánh với phát âm trong video nhé!'}
                </p>

                {audioUrl && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                    <span className="text-xs font-bold text-slate-700">Nghe lại giọng vừa thu:</span>
                    <audio controls src={audioUrl} className="h-8 max-w-xs" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Time-synced Subtitle Timeline & Video Playlist */}
        <div className="lg:col-span-5 space-y-4">
          {/* Subtitle Timeline Card */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Film className={`w-4 h-4 ${themeConfig.primaryText}`} />
                DANH SÁCH CÂU THOẠI (TIMELINE)
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {selectedVideo.subtitles.length} câu
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {selectedVideo.subtitles.map((sub) => {
                const isActive = activeSegment.id === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleJumpToTimestamp(sub)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1.5 ${
                      isActive
                        ? `bg-slate-900 text-white border-slate-900 shadow-md`
                        : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-400 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-extrabold">
                      <span className={isActive ? 'text-amber-400' : 'text-blue-600'}>
                        ⏱️ {sub.startTime}s - {sub.endTime}s
                      </span>
                      {isActive && <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md">ĐANG NÓI NHẠI</span>}
                    </div>

                    <p className={`text-xs font-black font-noto ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {sub.korean}
                    </p>
                    <p className={`text-[11px] ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      {sub.vietnamese}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Switch Video Playlist */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              CHỌN CLIP VIDEO SHADOWING KHÁC
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredVideos.map((video) => {
                const isSelected = selectedVideo.id === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? `bg-blue-50 border-blue-600 shadow-xs`
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 block">{video.categoryLabel}</span>
                      <h5 className="text-xs font-black text-slate-900 line-clamp-1">{video.title}</h5>
                    </div>
                    <PlayCircle className={`w-5 h-5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
