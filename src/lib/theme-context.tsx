'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'ocean' | 'lime' | 'crimson' | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  badgeBg: string;
  canvasBg: string;
  canvasText: string;
  accentRing: string;
  swatchGradient: string;
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  ocean: {
    id: 'ocean',
    name: 'Xanh Biển (Royal Ocean Blue)',
    description: 'Tông xanh biển hoàng gia êm dịu, dễ chịu cho mắt khi học lâu',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    canvasBg: 'bg-slate-50',
    canvasText: 'text-slate-900',
    accentRing: 'ring-blue-400/40 border-blue-600',
    swatchGradient: 'from-blue-600 to-indigo-700'
  },
  lime: {
    id: 'lime',
    name: 'Xanh Chuối (Electric Lime)',
    description: 'Tông xanh chuối tươi trẻ, tràn đầy năng lượng & phong cách hiện đại',
    primaryBg: 'bg-lime-600',
    primaryHover: 'hover:bg-lime-700',
    primaryText: 'text-lime-600',
    badgeBg: 'bg-lime-50 text-lime-800 border-lime-300',
    canvasBg: 'bg-slate-50',
    canvasText: 'text-slate-900',
    accentRing: 'ring-lime-400/40 border-lime-600',
    swatchGradient: 'from-lime-500 to-emerald-600'
  },
  crimson: {
    id: 'crimson',
    name: 'Đỏ Hàn Quốc (Taegeuk Crimson)',
    description: 'Tông đỏ Taegeuk truyền thống Hàn Quốc nổi bật & sang trọng',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    canvasBg: 'bg-slate-50',
    canvasText: 'text-slate-900',
    accentRing: 'ring-rose-400/40 border-rose-600',
    swatchGradient: 'from-rose-600 to-red-700'
  },
  dark: {
    id: 'dark',
    name: 'Đêm Obsidian (K-Obsidian Dark)',
    description: 'Giao diện huyền bí Obsidian tối thượng bảo vệ mắt tuyệt đối ban đêm',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryText: 'text-blue-400',
    badgeBg: 'bg-slate-800 text-blue-300 border-slate-700',
    canvasBg: 'bg-slate-900',
    canvasText: 'text-white',
    accentRing: 'ring-blue-400/40 border-blue-500',
    swatchGradient: 'from-slate-900 via-slate-800 to-blue-900'
  }
};

interface ThemeContextType {
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'ocean',
  themeConfig: THEME_CONFIGS.ocean,
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('ocean');

  useEffect(() => {
    const saved = localStorage.getItem('lynkore-theme') as ThemeId;
    if (saved && THEME_CONFIGS[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('lynkore-theme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEME_CONFIGS[theme],
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
