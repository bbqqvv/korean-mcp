import { HTMLAttributes } from 'react';

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-4 rounded-full" />
        <Skeleton className="w-12 h-3 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-lg" />
      <Skeleton className="w-full h-10 rounded-lg" />
      <div className="pt-2 border-t border-slate-100 flex gap-2">
        <Skeleton className="flex-1 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
}

export function DeckDetailSkeleton() {
  return (
    <div className="space-y-4 max-w-5xl w-full mx-auto p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-1/2 h-8 rounded-xl" />
        <Skeleton className="w-3/4 h-4 rounded-lg" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="w-32 h-10 rounded-full" />
          <Skeleton className="w-28 h-10 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-2/3 h-4 rounded-lg" />
            <Skeleton className="w-1/2 h-4 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl w-full mx-auto p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-5 rounded-full" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="w-full h-32 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
