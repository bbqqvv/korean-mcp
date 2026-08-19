'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MCPGuideRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=mcp');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Đang chuyển sang Cài Đặt MCP Server...</p>
      </div>
    </div>
  );
}
