import { REPORT_STATUS, STATUS_LABELS, BUILDING_LABELS } from './constants';

export const formatBuilding = (code) => {
  if (!code) return '';
  return BUILDING_LABELS[code] || code;
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateOnly = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Baru saja';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  return formatDateOnly(dateString);
};

export const getStatusConfig = (status) => {
  switch (status) {
    case REPORT_STATUS.PENDING_VERIFICATION:
    case 'Menunggu':
    case 'Menunggu Verifikasi':
      return {
        label: 'Menunggu Verifikasi',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-600',
        bgLight: 'bg-amber-50',
        borderClass: 'border-amber-300',
        icon: 'Clock',
      };
    case REPORT_STATUS.APPROVED:
    case 'Disetujui':
      return {
        label: 'Disetujui',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-500/20',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-600',
        bgLight: 'bg-blue-50',
        borderClass: 'border-blue-300',
        icon: 'CheckCircle',
      };
    case REPORT_STATUS.PROCESSING:
    case 'Diproses':
      return {
        label: 'Diproses',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 ring-sky-500/20',
        dotClass: 'bg-sky-500',
        textClass: 'text-sky-600',
        bgLight: 'bg-sky-50',
        borderClass: 'border-sky-300',
        icon: 'Loader2',
      };
    case REPORT_STATUS.RESOLVED:
    case 'Ditangani':
      return {
        label: 'Ditangani',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-600',
        bgLight: 'bg-emerald-50',
        borderClass: 'border-emerald-300',
        icon: 'CheckCircle2',
      };
    case REPORT_STATUS.REJECTED:
    case 'Ditolak':
      return {
        label: 'Ditolak',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 ring-rose-500/20',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-600',
        bgLight: 'bg-rose-50',
        borderClass: 'border-rose-300',
        icon: 'XCircle',
      };
    default:
      return {
        label: STATUS_LABELS[status] || status || 'Unknown',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
        dotClass: 'bg-slate-400',
        textClass: 'text-slate-600',
        bgLight: 'bg-slate-50',
        borderClass: 'border-slate-200',
        icon: 'HelpCircle',
      };
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const resolveImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800';
  if (url.startsWith('/uploads/')) {
    const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
    return `${backendBase}${url}`;
  }
  return url;
};

export const resolveAvatarUrl = (url, fallbackName = '') => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  }
  if (url.startsWith('/uploads/')) {
    const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
    return `${backendBase}${url}`;
  }
  return url;
};


