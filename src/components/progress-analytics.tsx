'use client';

import React, { useState, useMemo } from 'react';
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

interface ProgressAnalyticsProps {
  showHeaderAndCards?: boolean;
}

export default function ProgressAnalytics({ showHeaderAndCards = false }: ProgressAnalyticsProps) {
  const { themeConfig } = useTheme();
  const [activeView, setActiveView] = useState<ViewTab>('activity');
  const [activeSkill, setActiveSkill] = useState<SkillTab>('dictation');
  const [hoveredDay, setHoveredDay] = useState<{ date: string; level: number } | null>(null);

  // Generate 6 months of heatmap days
  const heatmapDays = useMemo(() => generateHeatmapData(), []);

  // Group heatmapDays into 52 weeks (each week has 7 days) for 1 full year GitHub style card coverage
  const heatmapWeeks = useMemo(() => {
    const weeks: Array<{ days: HeatmapDay[] }> = [];
    for (let w = 0; w < 52; w++) {
      const days = heatmapDays.slice(w * 7, (w + 1) * 7);
      weeks.push({ days });
    }
    return weeks;
  }, [heatmapDays]);

  // Compute Month Header Positions in px for the 52 weeks (28px left offset + weekIndex * 18px)
  const monthHeaderPositions = useMemo(() => {
    const positions: Array<{ label: string; leftPx: number }> = [];
    let lastMonth = -1;

    heatmapDays.forEach((day, idx) => {
      if (idx % 7 === 0) {
        const weekIndex = Math.floor(idx / 7);
        const d = new Date(day.date);
        const m = d.getMonth() + 1;
        if (m !== lastMonth) {
          lastMonth = m;
          positions.push({
            label: `Thg ${m}`,
            leftPx: 28 + weekIndex * 18
          });
        }
      }
    });

    return positions;
  }, [heatmapDays]);

  // Calculate practice stats
  const skillChartData = SKILL_PRACTICE_DATA[activeSkill] || SKILL_PRACTICE_DATA.dictation;
  const totalMinutesSkill = skillChartData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalExercisesSkill = skillChartData.reduce((acc, curr) => acc + curr.exercises, 0);

  return (
    <section className="space-y-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
      {/* Section Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {showHeaderAndCards ? (
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] ${themeConfig.primaryText} font-semibold tracking-wider uppercase`}>
                LYNKORE ANALYTICS & DASHBOARD
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Tiến Trình Học Tập
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Theo dõi hoạt động hàng ngày, chuỗi ngày học và thứ hạng của bạn so với người học khác.
            </p>
          </div>
        ) : (
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Biểu Đồ Luyện Tập &amp; Hoạt Động
          </h2>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('activity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'activity'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
            }`}
          >
            Hoạt động của tôi
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'leaderboard'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
            }`}
          >
            Bảng xếp hạng
          </button>
        </div>
      </div>

      {/* 5 Top Key Metric Cards (Only shown if showHeaderAndCards is true) */}
      {showHeaderAndCards && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Chuỗi dài nhất */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-500 fill-current" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {USER_STATS.longestStreak}
                <span className="ml-1 text-xs font-normal text-slate-500">ngày</span>
              </p>
              <p className="truncate text-[11px] text-slate-500 font-normal">Chuỗi dài nhất</p>
            </div>
          </div>

          {/* 2. Từ đã lưu */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {USER_STATS.savedWords}
                <span className="ml-1 text-xs font-normal text-slate-500">từ</span>
              </p>
              <p className="truncate text-[11px] text-slate-500 font-normal">Từ đã lưu</p>
            </div>
          </div>

          {/* 3. Thời gian luyện tập */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {USER_STATS.practiceTimeMinutes}m
              </p>
              <p className="truncate text-[11px] text-slate-500 font-normal">Thời gian luyện tập</p>
            </div>
          </div>

          {/* 4. Tổng XP */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 dark:bg-purple-950/40 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                {USER_STATS.totalXp}
                <span className="ml-1 text-[10px] font-bold text-purple-600">XP</span>
              </p>
              <p className="truncate text-[11px] text-slate-500 font-normal">Tổng XP</p>
            </div>
          </div>

          {/* 5. Hạng của bạn */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                #{USER_STATS.weeklyRank}
                <span className="ml-1 text-xs font-normal text-slate-500">Tuần</span>
              </p>
              <p className="truncate text-[11px] text-slate-500 font-normal">Hạng của bạn</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area Based on Active View */}
      {activeView === 'activity' ? (
        <div className="space-y-6">
          {/* GitHub-Style Activity Heatmap Component */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Tổng quan hoạt động (12 tháng gần đây)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                365 Ngày hoạt động
              </span>
            </div>

            {/* Heatmap Matrix (52 Weeks x 7 Days Grid - PERFECTLY CENTERED!) */}
            <div className="overflow-x-auto pb-2 flex justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="w-fit mx-auto space-y-1.5 select-none pt-1">
                {/* Positioned Month Labels */}
                <div className="relative h-4 text-[11px] font-bold text-slate-400">
                  {monthHeaderPositions.map((m, idx) => (
                    <span
                      key={idx}
                      className="absolute whitespace-nowrap font-semibold"
                      style={{ left: `${m.leftPx}px` }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5 items-start">
                  {/* Day of Week Labels (Exact 14px row height matching cells) */}
                  <div className="flex flex-col gap-1 text-[10px] font-semibold text-slate-400 pr-1 select-none">
                    <span className="h-3.5 leading-none flex items-center"></span>
                    <span className="h-3.5 leading-none flex items-center">T2</span>
                    <span className="h-3.5 leading-none flex items-center"></span>
                    <span className="h-3.5 leading-none flex items-center">T4</span>
                    <span className="h-3.5 leading-none flex items-center"></span>
                    <span className="h-3.5 leading-none flex items-center">T6</span>
                    <span className="h-3.5 leading-none flex items-center"></span>
                  </div>

                  {/* 52 Columns of Weeks */}
                  <div className="flex gap-1">
                    {heatmapWeeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1">
                        {week.days.map((day, dIdx) => {
                          let levelClass = 'bg-slate-100 dark:bg-slate-800/60';
                          if (day.level === 1) levelClass = 'bg-emerald-200 dark:bg-emerald-900/60';
                          if (day.level === 2) levelClass = 'bg-emerald-400 dark:bg-emerald-700';
                          if (day.level === 3) levelClass = 'bg-emerald-600 dark:bg-emerald-500';
                          if (day.level === 4) levelClass = 'bg-emerald-800 dark:bg-emerald-400';

                          return (
                            <div
                              key={dIdx}
                              onMouseEnter={() => setHoveredDay({ date: day.date, level: day.level })}
                              onMouseLeave={() => setHoveredDay(null)}
                              className={`w-3.5 h-3.5 rounded-xs ${levelClass} transition-transform hover:scale-125 cursor-pointer relative group`}
                              title={`${day.date}: Level ${day.level} học`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Legend */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
                  <span>365 ngày hoạt động gần đây</span>
                  <div className="flex items-center gap-1.5">
                    <span>Ít học</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800" />
                      <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-900/60" />
                      <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
                      <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
                      <span className="w-3 h-3 rounded-xs bg-emerald-800 dark:bg-emerald-400" />
                    </div>
                    <span>Chăm học</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 30-Day Skill Practice Section */}
          <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Luyện tập hàng ngày (30 ngày gần đây)
              </h3>

              {/* Skill Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto">
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
                    className={`px-3 py-1 rounded-xl text-xs transition-all shrink-0 ${
                      activeSkill === tab.id
                        ? `${themeConfig.primaryBg} text-white font-semibold shadow-2xs`
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
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
              <div className="space-y-3 bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    PHÚT LUYỆN TẬP (30 NGÀY)
                  </p>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Tổng: {totalMinutesSkill} phút
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-1 pt-4">
                  {skillChartData.slice(0, 20).map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${(item.minutes / 30) * 100}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          i % 2 === 0 ? 'bg-blue-600' : 'bg-blue-400'
                        } group-hover:bg-amber-500`}
                      />
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none transition-opacity font-mono z-10 whitespace-nowrap">
                        {item.minutes}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Chart: Bài tập đã làm */}
              <div className="space-y-3 bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    BÀI TẬP ĐÃ HOÀN THÀNH
                  </p>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Tổng: {totalExercisesSkill} bài
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-slate-200/60 dark:border-slate-800">
                  {skillChartData.slice(0, 20).map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        style={{ height: `${(item.exercises / 12) * 100}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          i % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-400'
                        } group-hover:bg-amber-500`}
                      />
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
      ) : (
        /* Leaderboard Tab Content */
        <div className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Bảng Xếp Hạng Người Học Tuần Này
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Cập nhật mỗi giờ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">HẠNG</th>
                  <th className="py-2.5 px-3">NGƯỜI HỌC</th>
                  <th className="py-2.5 px-3 text-center">CHUỖI NGÀY</th>
                  <th className="py-2.5 px-3 text-right">TỔNG XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {LEADERBOARD_USERS.map((usr) => (
                  <tr
                    key={usr.rank}
                    className={`transition-all ${
                      usr.isCurrentUser
                        ? 'bg-blue-50/70 dark:bg-slate-800/80 border-l-4 border-l-blue-600 dark:border-l-blue-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          usr.rank === 1
                            ? 'bg-amber-400 text-white'
                            : usr.rank === 2
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            : usr.rank === 3
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {usr.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <img
                            src={usr.avatar || '/krlogo.png'}
                            alt={usr.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {usr.name}
                            {usr.isCurrentUser && (
                              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                                Bạn
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {usr.streak} ngày
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {usr.xp.toLocaleString()} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
