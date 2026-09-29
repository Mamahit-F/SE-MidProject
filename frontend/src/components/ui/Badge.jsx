import React from 'react';
import { Clock, Loader2, CheckCircle2, CheckCircle, XCircle, ShieldCheck, User, Wrench, AlertCircle } from 'lucide-react';
import { REPORT_STATUS, ROLES } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    success: 'bg-teal-50 text-teal-700 border-teal-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, size = 'md', showIcon = true, className = '' }) => {
  switch (status) {
    case REPORT_STATUS.PENDING_VERIFICATION:
    case 'Menunggu':
    case 'Menunggu Verifikasi':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-amber-50 text-amber-800 border-amber-200/80 shadow-xs ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />}
          <span>Menunggu Verifikasi</span>
        </span>
      );

    case REPORT_STATUS.APPROVED:
    case 'Disetujui':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-blue-50 text-blue-800 border-blue-200/80 shadow-xs ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
          <span>Disetujui</span>
        </span>
      );

    case REPORT_STATUS.PROCESSING:
    case 'Diproses':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-sky-50 text-sky-800 border-sky-200/80 shadow-xs ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin shrink-0" />}
          <span>Diproses</span>
        </span>
      );

    case REPORT_STATUS.RESOLVED:
    case 'Ditangani':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-xs ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>Ditangani</span>
        </span>
      );

    case REPORT_STATUS.REJECTED:
    case 'Ditolak':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-rose-50 text-rose-800 border-rose-200/80 shadow-xs ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>Ditolak</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full border bg-slate-100 text-slate-700 border-slate-200 ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>{status || 'Unknown'}</span>
        </span>
      );
  }
};

export const RoleBadge = ({ role, size = 'sm' }) => {
  switch (role) {
    case ROLES.ADMIN:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Administrator</span>
        </span>
      );
    case ROLES.STAFF:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-medium ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-teal-600" />
          <span>Petugas Kebersihan</span>
        </span>
      );
    case ROLES.USER:
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Pelapor</span>
        </span>
      );
  }
};
