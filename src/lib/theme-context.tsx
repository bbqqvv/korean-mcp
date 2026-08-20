'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModeType = 'light' | 'dark' | 'system';
export type DarkStyleId = 'dimmed' | 'midnight' | 'slate' | 'oled';
export type LightStyleId = 'default' | 'paper' | 'indigo' | 'pure';

// Backward compatibility ThemeId
export type ThemeId = 'ocean' | 'lime' | 'crimson' | 'dark';

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
    name: 'Xanh Biển (Royal Ocean Blue)',
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

export const DARK_STYLES: Record<DarkStyleId, { name: string; canvasBg: string; cardBg: string; cardBorder: string; text: string; swatchBg: string }> = {
  dimmed: {
    name: 'Dimmed',
    canvasBg: 'bg-[#1c2128]',
    cardBg: 'bg-[#22272e]',
    cardBorder: 'border-[#30363d]',
    text: 'text-slate-100',
    swatchBg: 'bg-[#22272e]'
  },
  midnight: {
    name: 'Midnight',
    canvasBg: 'bg-[#0d1117]',
    cardBg: 'bg-[#161b22]',
    cardBorder: 'border-[#21262d]',
    text: 'text-slate-100',
    swatchBg: 'bg-[#0d1117]'
  },
  slate: {
    name: 'Slate',
    canvasBg: 'bg-slate-900',
    cardBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    text: 'text-slate-100',
    swatchBg: 'bg-slate-800'
  },
  oled: {
    name: 'OLED',
    canvasBg: 'bg-black',
    cardBg: 'bg-zinc-950',
    cardBorder: 'border-zinc-800',
    text: 'text-slate-100',
    swatchBg: 'bg-black'
  }
};

export const LIGHT_STYLES: Record<LightStyleId, { name: string; canvasBg: string; cardBg: string; cardBorder: string; text: string; swatchBg: string }> = {
  default: {
    name: 'Default',
    canvasBg: 'bg-slate-50',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    text: 'text-slate-900',
    swatchBg: 'bg-slate-100'
  },
  paper: {
    name: 'Paper',
    canvasBg: 'bg-[#faf8f5]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#e8e4df]',
    text: 'text-slate-900',
    swatchBg: 'bg-[#faf8f5]'
  },
  indigo: {
    name: 'Indigo',
    canvasBg: 'bg-[#f5f7fb]',
    cardBg: 'bg-white',
    cardBorder: 'border-indigo-100',
    text: 'text-slate-900',
    swatchBg: 'bg-[#f5f7fb]'
  },
  pure: {
    name: 'Pure',
    canvasBg: 'bg-white',
    cardBg: 'bg-slate-50/80',
    cardBorder: 'border-slate-200/80',
    text: 'text-slate-900',
    swatchBg: 'bg-white'
  }
};

interface ThemeContextType {
  mode: ModeType;
  darkStyle: DarkStyleId;
  lightStyle: LightStyleId;
  theme: ThemeId;
  themeConfig: ThemeConfig;
  setMode: (mode: ModeType) => void;
  setDarkStyle: (style: DarkStyleId) => void;
  setLightStyle: (style: LightStyleId) => void;
  setTheme: (theme: ThemeId) => void;
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  id: 'ocean',
  name: 'Default Light',
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
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  darkStyle: 'dimmed',
  lightStyle: 'default',
  theme: 'ocean',
  themeConfig: DEFAULT_THEME_CONFIG,
  setMode: () => {},
  setDarkStyle: () => {},
  setLightStyle: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ModeType>('light');
  const [darkStyle, setDarkStyleState] = useState<DarkStyleId>('dimmed');
  const [lightStyle, setLightStyleState] = useState<LightStyleId>('default');
  const [theme, setThemeState] = useState<ThemeId>('ocean');

  useEffect(() => {
    const savedMode = localStorage.getItem('lynkore-mode') as ModeType;
    const savedDarkStyle = localStorage.getItem('lynkore-dark-style') as DarkStyleId;
    const savedLightStyle = localStorage.getItem('lynkore-light-style') as LightStyleId;
    const savedTheme = localStorage.getItem('lynkore-theme') as ThemeId;

    if (savedMode) setModeState(savedMode);
    if (savedDarkStyle && DARK_STYLES[savedDarkStyle]) setDarkStyleState(savedDarkStyle);
    if (savedLightStyle && LIGHT_STYLES[savedLightStyle]) setLightStyleState(savedLightStyle);
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  const setMode = (newMode: ModeType) => {
    setModeState(newMode);
    localStorage.setItem('lynkore-mode', newMode);
  };

  const setDarkStyle = (newStyle: DarkStyleId) => {
    setDarkStyleState(newStyle);
    localStorage.setItem('lynkore-dark-style', newStyle);
  };

  const setLightStyle = (newStyle: LightStyleId) => {
    setLightStyleState(newStyle);
    localStorage.setItem('lynkore-light-style', newStyle);
  };

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('lynkore-theme', newTheme);
  };

  // Compute active ThemeConfig based on mode, darkStyle & lightStyle
  const isDarkActive = mode === 'dark' || (mode === 'system' && false); // default to light if system unless specified
  const activeStyle = isDarkActive ? DARK_STYLES[darkStyle] : LIGHT_STYLES[lightStyle];

  const computedThemeConfig: ThemeConfig = {
    ...DEFAULT_THEME_CONFIG,
    id: isDarkActive ? darkStyle : lightStyle,
    name: activeStyle.name,
    canvasBg: activeStyle.canvasBg,
    canvasText: activeStyle.text,
    cardBg: activeStyle.cardBg,
    cardBorder: activeStyle.cardBorder,
    badgeBg: isDarkActive
      ? 'bg-slate-800 text-blue-300 border-slate-700'
      : 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        darkStyle,
        lightStyle,
        theme,
        themeConfig: computedThemeConfig,
        setMode,
        setDarkStyle,
        setLightStyle,
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
