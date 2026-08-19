'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailSettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=email');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Đang chuyển sang Lịch Nhắc Mail...</p>
      </div>
    </div>
  );
}
