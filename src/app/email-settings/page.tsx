'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmailSettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=email');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf9f6] p-8 max-w-4xl mx-auto space-y-4">
      <Skeleton className="w-1/3 h-8 rounded-xl" />
      <Skeleton className="w-full h-48 rounded-3xl" />
    </div>
  );
}
