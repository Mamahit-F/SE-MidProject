import React from 'react';
import { Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Belum Ada Data',
  description = 'Tidak ada item yang ditemukan untuk kategori atau pencarian ini.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 ${className}`}>
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

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
