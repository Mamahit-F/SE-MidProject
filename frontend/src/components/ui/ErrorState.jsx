import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data dari server. Silakan coba beberapa saat lagi.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-xl border border-rose-200 ${className}`}>
      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-rose-700 max-w-md mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
