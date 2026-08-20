'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useTheme } from '@/lib/theme-context';
import {
  USER_STATS,
  generateHeatmapData,
  SKILL_PRACTICE_DATA,
  LEADERBOARD_USERS,
  HeatmapDay
} from '@/lib/progress-data';
import {
  Flame,
  BookOpen,
  Clock,
  Target,
  Trophy,
  BarChart3,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

type SkillTab = 'dictation' | 'shadowing' | 'speaking' | 'vocabulary' | 'writing';
type ViewTab = 'activity' | 'leaderboard';

export default function ProgressPage() {
  const { themeConfig } = useTheme();
  const [activeView, setActiveView] = useState<ViewTab>('activity');
  const [activeSkill, setActiveSkill] = useState<SkillTab>('dictation');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number } | null>(null);

  // Generate 6 months of heatmap days
  const heatmapDays = useMemo(() => generateHeatmapData(), []);

  // Group heatmapDays into 52 weeks (each week has 7 days) for 1 full year GitHub style card coverage
  const heatmapWeeks = useMemo(() => {
    const weeks: Array<{ monthLabel?: string; days: HeatmapDay[] }> = [];
    for (let w = 0; w < 52; w++) {
      const days = heatmapDays.slice(w * 7, (w + 1) * 7);
      let monthLabel: string | undefined = undefined;
      if (days[0]) {
        const d = new Date(days[0].date);
        const m = d.getMonth() + 1;
        if (w === 0) {
          monthLabel = `Thg ${m}`;
        } else {
          const prevDay = heatmapDays[(w - 1) * 7];
          if (prevDay) {
            const prevM = new Date(prevDay.date).getMonth() + 1;
            if (m !== prevM) {
              monthLabel = `Thg ${m}`;
            }
          }
        }
      }
      weeks.push({ monthLabel, days });
    }
    return weeks;
  }, [heatmapDays]);

  // Calculate practice stats
  const skillChartData = SKILL_PRACTICE_DATA[activeSkill] || SKILL_PRACTICE_DATA.dictation;

  const totalMinutesSkill = skillChartData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalExercisesSkill = skillChartData.reduce((acc, curr) => acc + curr.exercises, 0);

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* Left Sidebar Command Center */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-20 md:pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-6xl w-full mx-auto">
          {/* Header Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] ${themeConfig.primaryText} font-semibold tracking-wide uppercase`}>
                LYNKORE ANALYTICS &amp; DASHBOARD
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tiến Trình Học Tập
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Theo dõi hoạt động hàng ngày, chuỗi ngày học và thứ hạng của bạn so với người học khác.
            </p>
          </div>

          {/* 5 Top Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 1. Chuỗi dài nhất */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-500 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {USER_STATS.longestStreak}
                  <span className="ml-1 text-xs font-semibold text-slate-500">ngày</span>
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">Chuỗi dài nhất</p>
              </div>
            </div>

            {/* 2. Từ đã lưu */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {USER_STATS.savedWords}
                  <span className="ml-1 text-xs font-semibold text-slate-500">từ</span>
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">Từ đã lưu</p>
              </div>
            </div>

            {/* 3. Thời gian luyện tập */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {USER_STATS.practiceTimeMinutes}m
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">Thời gian luyện tập</p>
              </div>
            </div>

            {/* 4. Tổng XP */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {USER_STATS.totalXp}
                  <span className="ml-1 text-xs font-semibold text-slate-500">XP</span>
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">Tổng XP</p>
              </div>
            </div>

            {/* 5. Hạng của bạn */}
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  #{USER_STATS.weeklyRank}
                  <span className="ml-1 text-xs font-semibold text-slate-500">Tuần</span>
                </p>
                <p className="truncate text-[11px] text-slate-500 font-medium">Hạng của bạn</p>
              </div>
            </div>
          </div>

          {/* View Tab Switcher: Hoạt động của tôi vs Bảng xếp hạng */}
          <div className="border-b border-slate-200 flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveView('activity')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
                activeView === 'activity'
                  ? `border-slate-900 text-slate-900`
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Hoạt động của tôi
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 ${
                activeView === 'leaderboard'
                  ? `border-slate-900 text-slate-900`
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Bảng xếp hạng
            </button>
          </div>

          {/* TAB 1: HOẠT ĐỘNG CỦA TÔI */}
          {activeView === 'activity' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Card 1: 12-Month Activity Heatmap Grid (52-Week Full Stretch GitHub Style) */}
              <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                    Tổng quan hoạt động (12 tháng gần đây)
                  </h2>
                  <div className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full transition-all">
                    {hoveredDay ? (
                      <span className="text-blue-600 font-bold">{hoveredDay.date}: Mức độ học {hoveredDay.level}/4</span>
                    ) : (
                      <span>365 Ngày hoạt động</span>
                    )}
                  </div>
                </div>

                {/* 52-Week Full-Width Heatmap Grid Container */}
                <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="min-w-[760px] flex items-start gap-2.5 w-full">
                    {/* Weekday Labels Column (Exact Row Alignment) */}
                    <div className="pt-4 space-y-1 text-[9px] font-bold text-slate-400 select-none shrink-0 text-right w-4">
                      <div className="h-3 leading-3">T2</div>
                      <div className="h-3 leading-3 opacity-0">T3</div>
                      <div className="h-3 leading-3">T4</div>
                      <div className="h-3 leading-3 opacity-0">T5</div>
                      <div className="h-3 leading-3">T6</div>
                    </div>

                    {/* 52 Week Columns (Spread Evenly across full card width) */}
                    <div className="flex items-start justify-between gap-0.5 flex-1 min-w-0">
                      {heatmapWeeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1 items-center flex-1">
                          {/* Month Header Label */}
                          <div className="h-3.5 text-[9px] font-bold text-slate-400 whitespace-nowrap select-none">
                            {week.monthLabel || ''}
                          </div>

                          {/* 7 Days in Week Column */}
                          {week.days.map((day, dayIdx) => {
                            const levelColors = [
                              'bg-slate-100 border-slate-200/70 hover:bg-slate-200',
                              'bg-emerald-200 border-emerald-300 hover:bg-emerald-300',
                              'bg-emerald-400 border-emerald-500 hover:bg-emerald-500',
                              'bg-emerald-600 border-emerald-700 text-white',
                              'bg-emerald-800 border-emerald-900 text-white'
                            ];

                            return (
                              <div
                                key={dayIdx}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                title={`${day.date}: Mức độ học ${day.level}/4`}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border transition-all hover:scale-125 cursor-pointer ${levelColors[day.level]}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heatmap Footer Legend */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100 gap-2">
                  <span>365 ngày hoạt động gần đây</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-slate-400">Ít học</span>
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 border border-slate-200/80" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200 border border-emerald-300" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-500" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-700" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800 border border-emerald-900" />
                    <span className="text-[9px] font-semibold text-slate-400">Chăm học</span>
                  </div>
                </div>
              </div>

              {/* Card 2: 30-Day Daily Practice Breakdown */}
              <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Luyện tập hàng ngày (30 ngày gần đây)
                  </h2>

                  {/* Skill Selector Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
                    {[
                      { id: 'dictation', label: 'Dictation' },
                      { id: 'shadowing', label: 'Shadowing' },
                      { id: 'speaking', label: 'Nói' },
                      { id: 'vocabulary', label: 'Từ vựng' },
                      { id: 'writing', label: 'Viết' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSkill(tab.id as SkillTab)}
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                          activeSkill === tab.id
                            ? `${themeConfig.primaryBg} text-white shadow-2xs`
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 30-Day Practice Bar Visualizer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Chart: Phút luyện tập */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        PHÚT LUYỆN TẬP (30 NGÀY)
                      </p>
                      <span className="text-xs font-bold text-blue-600">
                        Tổng: {totalMinutesSkill} phút
                      </span>
                    </div>

                    {/* Bar chart representation */}
                    <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-slate-200">
                      {skillChartData.slice(0, 20).map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div
                            style={{ height: `${(item.minutes / 30) * 100}%` }}
                            className={`w-full rounded-t-sm transition-all ${
                              i % 2 === 0 ? 'bg-blue-600' : 'bg-blue-400'
                            } group-hover:bg-amber-500`}
                          />
                          {/* Tooltip */}
                          <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none transition-opacity font-mono z-10 whitespace-nowrap">
                            {item.minutes}m
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Chart: Bài tập đã làm */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        BÀI TẬP ĐÃ HOÀN THÀNH
                      </p>
                      <span className="text-xs font-bold text-emerald-600">
                        Tổng: {totalExercisesSkill} bài
                      </span>
                    </div>

                    {/* Bar chart representation */}
                    <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-slate-200">
                      {skillChartData.slice(0, 20).map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div
                            style={{ height: `${(item.exercises / 12) * 100}%` }}
                            className={`w-full rounded-t-sm transition-all ${
                              i % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-400'
                            } group-hover:bg-amber-500`}
                          />
                          {/* Tooltip */}
                          <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none transition-opacity font-mono z-10 whitespace-nowrap">
                            {item.exercises} bài
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BẢNG XẾP HẠNG LEADERBOARD */}
          {activeView === 'leaderboard' && (
            <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Bảng Xếp Hạng Siêng Năng Tuần Này
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Tích lũy điểm XP qua các bài học Flashcard, Shadowing &amp; Quiz để thăng hạng!
                  </p>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="space-y-2.5">
                {LEADERBOARD_USERS.map((user) => (
                  <div
                    key={user.rank}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                      user.isCurrentUser
                        ? 'bg-blue-50 border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Badge */}
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                      </div>

                      {/* Avatar */}
                      <span className="text-2xl shrink-0">{user.avatar}</span>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {user.name}
                          </h4>
                          {user.isCurrentUser && (
                            <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded-md shrink-0">
                              BẠN
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          {user.badge}
                        </span>
                      </div>
                    </div>

                    {/* XP & Streak */}
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="hidden sm:block">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">CHUỖI NGÀY</span>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1 justify-end">
                          <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak} ngày
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">ĐIỂM XP</span>
                        <span className="text-sm font-bold text-slate-900">
                          {user.xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
