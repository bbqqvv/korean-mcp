export interface UserProgressStats {
  longestStreak: number;
  savedWords: number;
  practiceTimeMinutes: number;
  totalXp: number;
  weeklyRank: number;
}

export interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface SkillDailyItem {
  date: string;
  label: string;
  minutes: number;
  exercises: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const USER_STATS: UserProgressStats = {
  longestStreak: 12,
  savedWords: 128,
  practiceTimeMinutes: 245,
  totalXp: 3450,
  weeklyRank: 12
};

// Generate 1 year of activity heatmap data (52 weeks = 364 days)
export const generateHeatmapData = (): HeatmapDay[] => {
  const days: HeatmapDay[] = [];
  const fixedBaseDate = new Date('2026-08-20T00:00:00.000Z');

  for (let i = 363; i >= 0; i--) {
    const d = new Date(fixedBaseDate);
    d.setDate(fixedBaseDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Deterministic pseudo-random algorithm based on day index 'i'
    const pseudoRandom = (Math.abs(Math.sin(i * 997 + 13)) * 10000) % 1;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (pseudoRandom > 0.45 && pseudoRandom <= 0.65) level = 1;
    else if (pseudoRandom > 0.65 && pseudoRandom <= 0.8) level = 2;
    else if (pseudoRandom > 0.8 && pseudoRandom <= 0.92) level = 3;
    else if (pseudoRandom > 0.92) level = 4;

    days.push({ date: dateStr, level });
  }

  return days;
};

// 30 Days Practice Chart Data for each Skill
export const SKILL_PRACTICE_DATA: Record<string, SkillDailyItem[]> = {
  dictation: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    label: `Ngày ${i + 1}`,
    minutes: Math.floor(Math.sin(i * 0.5) * 8 + 12),
    exercises: Math.floor(Math.cos(i * 0.5) * 3 + 5)
  })),
  shadowing: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    label: `Ngày ${i + 1}`,
    minutes: Math.floor(Math.cos(i * 0.4) * 10 + 15),
    exercises: Math.floor(Math.sin(i * 0.4) * 4 + 6)
  })),
  speaking: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    label: `Ngày ${i + 1}`,
    minutes: Math.floor(Math.sin(i * 0.6) * 7 + 10),
    exercises: Math.floor(Math.cos(i * 0.6) * 3 + 4)
  })),
  vocabulary: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    label: `Ngày ${i + 1}`,
    minutes: Math.floor(Math.cos(i * 0.3) * 12 + 18),
    exercises: Math.floor(Math.sin(i * 0.3) * 5 + 8)
  })),
  writing: Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    label: `Ngày ${i + 1}`,
    minutes: Math.floor(Math.sin(i * 0.7) * 9 + 11),
    exercises: Math.floor(Math.cos(i * 0.7) * 4 + 5)
  }))
};

// Weekly Leaderboard Users
export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Min-jun Kim 🇰🇷',
    avatar: '/krlogo.png',
    xp: 12450,
    streak: 45,
    badge: '🥇 Quán Quân Tuần'
  },
  {
    rank: 2,
    name: 'Phương Anh 🇻🇳',
    avatar: '/krlogo.png',
    xp: 9820,
    streak: 32,
    badge: '🥈 Á Quân Tuần'
  },
  {
    rank: 3,
    name: 'Ji-won Park 🇰🇷',
    avatar: '/krlogo.png',
    xp: 8750,
    streak: 28,
    badge: '🥉 Hạng Ba Tuần'
  },
  {
    rank: 4,
    name: 'Trần Văn Hoàng',
    avatar: '/krlogo.png',
    xp: 7640,
    streak: 21,
    badge: 'Chuyên Gia Tiếng Hàn'
  },
  {
    rank: 5,
    name: 'Soo-jin Lee',
    avatar: '/krlogo.png',
    xp: 6900,
    streak: 19,
    badge: 'Thần Gõ Phím Hangul'
  },
  {
    rank: 12,
    name: 'Bạn (LynKore Learner)',
    avatar: '/krlogo.png',
    xp: 3450,
    streak: 12,
    badge: 'Tân Binh Siêng Năng',
    isCurrentUser: true
  }
];
