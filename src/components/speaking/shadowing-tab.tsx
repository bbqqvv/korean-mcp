'use client';

import { useState, useEffect, useRef } from 'react';
import { SHADOWING_VIDEOS, ShadowingVideoItem, SubtitleSegment } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Film,
  Zap,
  Repeat,
  Clock,
  PlayCircle,
  Link2,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function ShadowingTab() {
  const { themeConfig } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<ShadowingVideoItem>(SHADOWING_VIDEOS[0]);
  const [activeSegment, setActiveSegment] = useState<SubtitleSegment>(SHADOWING_VIDEOS[0].subtitles[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLoopingSegment, setIsLoopingSegment] = useState<boolean>(false);
  const [customYoutubeInput, setCustomYoutubeInput] = useState<string>('');

  // Extract YouTube ID from full URL or return plain ID
  const extractYoutubeId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return '';
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  // Handle adding custom YouTube link
  const handleLoadCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYoutubeId(customYoutubeInput);
    if (!ytId) {
      alert('Vui lòng nhập Link YouTube hợp lệ (Ví dụ: https://www.youtube.com/watch?v=3JZ_D3ELwOQ)');
      return;
    }

    const newCustomVideo: ShadowingVideoItem = {
      id: `custom-${Date.now()}`,
      title: '🎥 Video YouTube Tùy Chỉnh Của Bạn',
      youtubeId: ytId,
      category: 'daily',
      categoryLabel: 'Video Tùy Chỉnh',
      difficulty: 'Sơ cấp',
      duration: 'Tự chọn',
      description: 'Video do bạn nhập link trực tiếp.',
      subtitles: [
        {
          id: 1,
          startTime: 0,
          endTime: 10,
          korean: '동영상을 보면서 자막에 맞춰 말하기를 연습하세요!',
          romaja: 'Dong-yeong-sang-eul bo-myeon-seo ja-mak-e mat-chwa mal-ha-gi-reul yeon-seup-ha-se-yo!',
          vietnamese: 'Vừa xem video vừa thực hành đọc nhại theo từng câu nhé!',
          speaker: 'Bản xí Hàn'
        }
      ]
    };

    setSelectedVideo(newCustomVideo);
    setActiveSegment(newCustomVideo.subtitles[0]);
    setCustomYoutubeInput('');
  };

  // Filter video clips
  const filteredVideos = filterCategory === 'all'
    ? SHADOWING_VIDEOS
    : SHADOWING_VIDEOS.filter((vid) => vid.category === filterCategory);

  // When video changes, reset segment to first subtitle
  useEffect(() => {
    if (selectedVideo.subtitles.length > 0) {
      setActiveSegment(selectedVideo.subtitles[0]);
    }
  }, [selectedVideo]);

  // Jump YouTube player to specific start time
  const handleJumpToTimestamp = (segment: SubtitleSegment) => {
    setActiveSegment(segment);
  };

  // Play Korean TTS fallback
  const playKoreanTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = playbackSpeed;
    window.speechSynthesis.speak(utterance);
  };

  // Build embed URL for YouTube segment
  const embedUrl = `https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&start=${Math.floor(activeSegment.startTime)}&end=${Math.ceil(activeSegment.endTime)}&rel=0`;

  return (
    <div className="space-y-6">
      {/* Top Custom YouTube Link Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-4 shadow-xs">
        <form onSubmit={handleLoadCustomVideo} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 w-full">
            <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={customYoutubeInput}
              onChange={(e) => setCustomYoutubeInput(e.target.value)}
              placeholder="Dán Link YouTube bất kỳ (Ví dụ: https://www.youtube.com/watch?v=...)"
              className="w-full text-xs bg-transparent border-none outline-none font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto px-5 py-2.5 ${themeConfig.primaryBg} ${themeConfig.primaryHover} text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0`}
          >
            <Plus className="w-4 h-4" />
            <span>Tải Video Này</span>
          </button>
        </form>
      </div>

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
          onClick={() => setFilterCategory('daily')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'daily'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ☕ Giao Tiếp Thực Tế
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
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
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                  title="Nghe phát âm chuẩn TTS"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nghe Đọc Mẫu</span>
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
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-5 space-y-2.5 border-2 border-slate-900 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-blue-300 uppercase tracking-wide">
                <span>CÂU THOẠI ĐANG SHADOWING ({activeSegment.speaker || 'Nhân vật'})</span>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  Mốc {activeSegment.startTime}s - {activeSegment.endTime}s
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-noto tracking-tight text-white leading-snug">
                {activeSegment.korean}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-700/80 text-xs">
                <p className="text-blue-300 font-semibold">🗣️ Phiên âm: {activeSegment.romaja}</p>
                <p className="text-slate-300 font-medium">🇻🇳 Nghĩa: {activeSegment.vietnamese}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Time-synced Subtitle Timeline & Video Playlist */}
        <div className="lg:col-span-5 space-y-4">
          {/* Subtitle Timeline Card */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Film className={`w-4 h-4 ${themeConfig.primaryText}`} />
                DANH SÁCH CÂU THOẠI (BẤM ĐỂ NÓI NHẠI)
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

                    <p className={`text-xs sm:text-sm font-black font-noto ${isActive ? 'text-white' : 'text-slate-900'}`}>
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
              CHỌN CLIP VIDEO SHADOWING MẪU
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
