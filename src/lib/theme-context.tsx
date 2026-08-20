'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModeType = 'light' | 'dark' | 'system';
export type SubStyleId = 'default' | 'purple' | 'pink' | 'blue';

export type AppThemeId =
  | 'light'
  | 'dark'
  | 'purple-light'
  | 'purple-dark'
  | 'pink-light'
  | 'pink-dark'
  | 'blue-light'
  | 'blue-dark';

// Backward compatibility ThemeId
export type ThemeId = AppThemeId | 'ocean' | 'lime' | 'crimson';

export interface ThemePreset {
  id: AppThemeId;
  name: string;
  isDark: boolean;
  type: 'sun' | 'moon';
  iconColor: string;
  badgeBg: string;
  canvasBg: string;
  canvasText: string;
  cardBg: string;
  cardBorder: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
}

export const THEME_PRESETS: Record<AppThemeId, ThemePreset> = {
  light: {
    id: 'light',
    name: 'Sáng',
    isDark: false,
    type: 'sun',
    iconColor: 'text-amber-500',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    canvasBg: 'bg-slate-50',
    canvasText: 'text-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600'
  },
  dark: {
    id: 'dark',
    name: 'Tối',
    isDark: true,
    type: 'moon',
    iconColor: 'text-slate-300',
    badgeBg: 'bg-slate-800 text-blue-300 border-slate-700',
    canvasBg: 'bg-slate-900',
    canvasText: 'text-slate-100',
    cardBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryText: 'text-blue-400'
  },
  'purple-light': {
    id: 'purple-light',
    name: 'Tím Sáng',
    isDark: false,
    type: 'sun',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    canvasBg: 'bg-[#faf5ff]',
    canvasText: 'text-[#3b0764]',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-100',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600'
  },
  'purple-dark': {
    id: 'purple-dark',
    name: 'Tím Tối',
    isDark: true,
    type: 'moon',
    iconColor: 'text-purple-400',
    badgeBg: 'bg-[#2a123d] text-purple-300 border-[#3e1d59]',
    canvasBg: 'bg-[#1a0927]',
    canvasText: 'text-[#faf5ff]',
    cardBg: 'bg-[#2a123d]',
    cardBorder: 'border-[#3e1d59]',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-500',
    primaryText: 'text-purple-400'
  },
  'pink-light': {
    id: 'pink-light',
    name: 'Hồng Sáng',
    isDark: false,
    type: 'sun',
    iconColor: 'text-pink-600',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    canvasBg: 'bg-[#fff5f7]',
    canvasText: 'text-[#831843]',
    cardBg: 'bg-white',
    cardBorder: 'border-pink-100',
    primaryBg: 'bg-pink-600',
    primaryHover: 'hover:bg-pink-700',
    primaryText: 'text-pink-600'
  },
  'pink-dark': {
    id: 'pink-dark',
    name: 'Hồng Tối',
    isDark: true,
    type: 'moon',
    iconColor: 'text-pink-400',
    badgeBg: 'bg-[#3b1223] text-pink-300 border-[#541a34]',
    canvasBg: 'bg-[#240a15]',
    canvasText: 'text-[#fff5f7]',
    cardBg: 'bg-[#3b1223]',
    cardBorder: 'border-[#541a34]',
    primaryBg: 'bg-pink-600',
    primaryHover: 'hover:bg-pink-500',
    primaryText: 'text-pink-400'
  },
  'blue-light': {
    id: 'blue-light',
    name: 'Xanh Sáng',
    isDark: false,
    type: 'sun',
    iconColor: 'text-sky-500',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    canvasBg: 'bg-[#f0f9ff]',
    canvasText: 'text-[#0c4a6e]',
    cardBg: 'bg-white',
    cardBorder: 'border-sky-100',
    primaryBg: 'bg-sky-600',
    primaryHover: 'hover:bg-sky-700',
    primaryText: 'text-sky-600'
  },
  'blue-dark': {
    id: 'blue-dark',
    name: 'Xanh Tối',
    isDark: true,
    type: 'moon',
    iconColor: 'text-sky-400',
    badgeBg: 'bg-[#0e2a47] text-sky-300 border-[#173d63]',
    canvasBg: 'bg-[#081c2e]',
    canvasText: 'text-[#f0f9ff]',
    cardBg: 'bg-[#0e2a47]',
    cardBorder: 'border-[#173d63]',
    primaryBg: 'bg-sky-600',
    primaryHover: 'hover:bg-sky-500',
    primaryText: 'text-sky-400'
  }
};

export interface ThemeConfig {
  id: string;
  name: string;
  description?: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  badgeBg: string;
  canvasBg: string;
  canvasText: string;
  cardBg: string;
  cardBorder: string;
  accentRing: string;
  swatchGradient: string;
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  ocean: {
    id: 'ocean',
    name: 'Xanh Biển',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    canvasBg: 'bg-slate-50',
    canvasText: 'text-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    accentRing: 'ring-blue-400/40 border-blue-600',
    swatchGradient: 'from-blue-600 to-indigo-700'
  }
};

interface ThemeContextType {
  mode: ModeType;
  subStyle: SubStyleId;
  activeThemeId: AppThemeId;
  themePreset: ThemePreset;
  themeConfig: ThemeConfig;
  setMode: (mode: ModeType) => void;
  setSubStyle: (sub: SubStyleId) => void;
  setAppTheme: (themeId: AppThemeId) => void;
  // Backward compatibility
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  subStyle: 'default',
  activeThemeId: 'light',
  themePreset: THEME_PRESETS.light,
  themeConfig: THEME_PRESETS.light as unknown as ThemeConfig,
  setMode: () => {},
  setSubStyle: () => {},
  setAppTheme: () => {},
  theme: 'light',
  setTheme: () => {}
});

function resolveThemeId(mode: ModeType, subStyle: SubStyleId): AppThemeId {
  const isDark = mode === 'dark';
  if (subStyle === 'purple') return isDark ? 'purple-dark' : 'purple-light';
  if (subStyle === 'pink') return isDark ? 'pink-dark' : 'pink-light';
  if (subStyle === 'blue') return isDark ? 'blue-dark' : 'blue-light';
  return isDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ModeType>('light');
  const [subStyle, setSubStyleState] = useState<SubStyleId>('default');

  const activeThemeId = resolveThemeId(mode, subStyle);

  useEffect(() => {
    const savedMode = localStorage.getItem('lynkore-mode') as ModeType;
    const savedSub = localStorage.getItem('lynkore-sub-style') as SubStyleId;
    if (savedMode) setModeState(savedMode);
    if (savedSub) setSubStyleState(savedSub);
  }, []);

  useEffect(() => {
    applyThemeDOM(activeThemeId);
  }, [activeThemeId]);

  const applyThemeDOM = (id: AppThemeId) => {
    const preset = THEME_PRESETS[id];
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = id;
      if (preset.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const setMode = (m: ModeType) => {
    setModeState(m);
    localStorage.setItem('lynkore-mode', m);
  };

  const setSubStyle = (s: SubStyleId) => {
    setSubStyleState(s);
    localStorage.setItem('lynkore-sub-style', s);
  };

  const setAppTheme = (id: AppThemeId) => {
    if (id.includes('dark')) setModeState('dark');
    else setModeState('light');

    if (id.includes('purple')) setSubStyleState('purple');
    else if (id.includes('pink')) setSubStyleState('pink');
    else if (id.includes('blue')) setSubStyleState('blue');
    else setSubStyleState('default');
  };

  const setTheme = (t: ThemeId) => {
    if (THEME_PRESETS[t as AppThemeId]) {
      setAppTheme(t as AppThemeId);
    }
  };

  const currentPreset = THEME_PRESETS[activeThemeId] || THEME_PRESETS.light;
  const currentConfig: ThemeConfig = {
    id: currentPreset.id,
    name: currentPreset.name,
    primaryBg: currentPreset.primaryBg,
    primaryHover: currentPreset.primaryHover,
    primaryText: currentPreset.primaryText,
    badgeBg: currentPreset.badgeBg,
    canvasBg: currentPreset.canvasBg,
    canvasText: currentPreset.canvasText,
    cardBg: currentPreset.cardBg,
    cardBorder: currentPreset.cardBorder,
    accentRing: 'ring-blue-400/40 border-blue-600',
    swatchGradient: 'from-blue-600 to-indigo-700'
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        subStyle,
        activeThemeId,
        themePreset: currentPreset,
        themeConfig: currentConfig,
        setMode,
        setSubStyle,
        setAppTheme,
        theme: activeThemeId,
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
