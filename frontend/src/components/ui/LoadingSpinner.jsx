import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Memuat data...', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeMap[size]} text-emerald-600 animate-spin`} />
      {text && <p className="text-xs sm:text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '', rounded = 'rounded-md' }) => {
  return <div className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`} />;
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex gap-4 border-b border-slate-200 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`head-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`row-${r}`} className="flex gap-4 py-2 border-b border-slate-100 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`cell-${r}-${c}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};
