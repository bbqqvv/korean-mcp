'use client';

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useTheme } from '@/lib/theme-context';
import ProgressAnalytics from '@/components/progress-analytics';

export default function ProgressPage() {
  const { themeConfig } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen ${themeConfig.canvasBg} ${themeConfig.canvasText} overflow-hidden font-sans`}>
      {/* Left Sidebar Command Center */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-20 md:pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-6xl w-full mx-auto">
          <ProgressAnalytics showHeaderAndCards={true} />
        </main>
      </div>
    </div>
  );
}
