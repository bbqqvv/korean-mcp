'use client';

import { useState, useEffect, useRef } from 'react';
import { SHADOWING_VIDEOS, ShadowingVideoItem, SubtitleSegment } from '@/lib/speaking-data';
import { useTheme } from '@/lib/theme-context';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Film,
  Zap,
  Repeat,
  Clock,
  PlayCircle,
  PauseCircle,
  Flame,
  ArrowRight,
  CheckCircle2,
  ListVideo
} from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function ShadowingTab() {
  const { themeConfig } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<ShadowingVideoItem>(SHADOWING_VIDEOS[0]);
  const [activeSegment, setActiveSegment] = useState<SubtitleSegment>(SHADOWING_VIDEOS[0].subtitles[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Smart Shadowing Controls
  const [isLoopingSegment, setIsLoopingSegment] = useState<boolean>(false);
  const [autoPauseSegment, setAutoPauseSegment] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const playerRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Filter video list
  const filteredVideos = filterCategory === 'all'
    ? SHADOWING_VIDEOS
    : SHADOWING_VIDEOS.filter((vid) => vid.category === filterCategory);

  // Load YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize YT Player when selectedVideo changes
  useEffect(() => {
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {}
        }

        playerRef.current = new window.YT.Player(`yt-player-${selectedVideo.id}`, {
          height: '100%',
          width: '100%',
          videoId: selectedVideo.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event: any) => {
              event.target.setPlaybackRate(playbackSpeed);
              setIsPlaying(true);
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    if (selectedVideo.subtitles.length > 0) {
      setActiveSegment(selectedVideo.subtitles[0]);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedVideo]);

  // Handle Playback Speed change
  useEffect(() => {
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      try {
        playerRef.current.setPlaybackRate(playbackSpeed);
      } catch (e) {}
    }
  }, [playbackSpeed]);

  // Real-time Karaoke Subtitle Synchronization Loop
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        try {
          const t = playerRef.current.getCurrentTime();
          setCurrentTime(t);

          // Find subtitle segment matching current video timestamp
          const currentSeg = selectedVideo.subtitles.find(
            (s) => t >= s.startTime && t <= s.endTime
          );

          if (currentSeg && currentSeg.id !== activeSegment.id) {
            setActiveSegment(currentSeg);

            // Auto-scroll subtitle item into view
            const elem = document.getElementById(`sub-item-${currentSeg.id}`);
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }

          // Loop Segment logic
          if (isLoopingSegment && t >= activeSegment.endTime) {
            playerRef.current.seekTo(activeSegment.startTime);
          }

          // Auto Pause after sentence logic
          if (autoPauseSegment && t >= activeSegment.endTime) {
            playerRef.current.pauseVideo();
            setAutoPauseSegment(false); // trigger once
          }
        } catch (e) {}
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedVideo, activeSegment, isLoopingSegment, autoPauseSegment]);

  // Seek YouTube player to subtitle timestamp
  const handleSeekToSegment = (seg: SubtitleSegment) => {
    setActiveSegment(seg);
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seg.startTime, true);
        playerRef.current.playVideo();
      } catch (e) {}
    }
  };

  // Play TTS fallback
  const playKoreanTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = playbackSpeed;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Video Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'all'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả Video ({SHADOWING_VIDEOS.length})
        </button>
        <button
          onClick={() => setFilterCategory('daily')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'daily'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Giao Tiếp Thực Tế
        </button>
        <button
          onClick={() => setFilterCategory('vlog')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterCategory === 'vlog'
              ? `${themeConfig.primaryBg} text-white shadow-xs`
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Vlog Đời Sống
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Real-time YouTube Player Studio */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 shadow-xs space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${themeConfig.badgeBg}`}>
                  {selectedVideo.categoryLabel}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedVideo.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
              </span>
            </div>

            {/* YouTube Player Container with Real-time API */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-black shadow-md">
              <div id={`yt-player-${selectedVideo.id}`} className="w-full h-full" />
            </div>

            {/* Smart Shadowing Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {/* Loop Segment Toggle */}
                <button
                  onClick={() => setIsLoopingSegment(!isLoopingSegment)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    isLoopingSegment
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{isLoopingSegment ? 'Đang Lặp Câu' : 'Lặp Câu Này'}</span>
                </button>

                {/* Auto Pause Toggle */}
                <button
                  onClick={() => setAutoPauseSegment(!autoPauseSegment)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    autoPauseSegment
                      ? 'bg-amber-500 text-slate-950 shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>{autoPauseSegment ? 'Dừng Hết Câu' : 'Tạm Dừng Hết Câu'}</span>
                </button>

                {/* TTS Audio */}
                <button
                  onClick={() => playKoreanTTS(activeSegment.korean)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-200 flex items-center gap-1 transition-colors"
                  title="Nghe chuẩn giọng đọc mượt"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đọc Mẫu</span>
                </button>
              </div>

              {/* Playback Speed Pills */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 px-1">Tốc độ:</span>
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
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

            {/* Active Karaoke Subtitle Highlight Card */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 space-y-2.5 border border-slate-200/80 shadow-xs shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-blue-300 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  PHỤ ĐỀ KARAOKE THEO THỜI GIAN THỰC
                </span>
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                  {Math.floor(currentTime)}s / {activeSegment.startTime}s - {activeSegment.endTime}s
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-bold font-noto tracking-tight text-white leading-snug">
                {activeSegment.korean}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-700/80 text-xs">
                <p className="text-blue-300 font-semibold">Phiên âm: {activeSegment.romaja}</p>
                <p className="text-slate-300 font-medium">Nghĩa: {activeSegment.vietnamese}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Synchronized Karaoke Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                PHỤ ĐỀ KARAOKE (TỰ ĐỘNG CUỘN SÁNG)
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {selectedVideo.subtitles.length} câu
              </span>
            </div>

            <div
              ref={timelineRef}
              className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {selectedVideo.subtitles.map((sub) => {
                const isActive = activeSegment.id === sub.id;
                return (
                  <div
                    key={sub.id}
                    id={`sub-item-${sub.id}`}
                    onClick={() => handleSeekToSegment(sub)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1.5 ${
                      isActive
                        ? `bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-400/40 scale-[1.01]`
                        : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-400 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className={isActive ? 'text-amber-400' : 'text-blue-600'}>
                        {sub.startTime}s - {sub.endTime}s
                      </span>
                      {isActive && (
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                          ▶ ĐANG PHÁT
                        </span>
                      )}
                    </div>

                    <p className={`text-xs sm:text-sm font-bold font-noto ${isActive ? 'text-white' : 'text-slate-900'}`}>
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

          {/* Curated Video Playlist */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              THƯ VIỆN VIDEO CHỌN LỌC
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
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{video.title}</h5>
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
