import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Wrench,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Tag,
  Share2,
} from 'lucide-react';
import { reportApi } from '../../api/reportApi';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatDate, timeAgo, resolveImageUrl, formatBuilding } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const UserReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportApi.getById(id);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Laporan tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReportDetail();
  }, [fetchReportDetail]);

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="Memuat rincian laporan..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Laporan Tidak Ditemukan"
          message={error || 'Data laporan dengan ID ini tidak tersedia di sistem.'}
          onRetry={() => navigate('/user/reports')}
        />
      </div>
    );
  }

  const isRejected = report.status === REPORT_STATUS.REJECTED;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/user/reports')}
        >
          Kembali ke Riwayat
        </Button>
        <span className="text-xs text-slate-400 font-mono">
          ID: #{report.id}
        </span>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                #{report.id}
              </span>
              <StatusBadge status={report.status} size="md" />
              {report.urgency === 'HIGH' && (
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Mendesak
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {report.title || report.description}
            </h1>
          </div>

          <div className="text-xs text-slate-500 sm:text-right">
            <p className="font-medium text-slate-700">Dibuat pada:</p>
            <p>{formatDate(report.createdAt)}</p>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image and Description */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image display */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Foto Bukti Kondisi:
              </label>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
                <img
                  src={resolveImageUrl(report.imageUrl)}
                  alt={report.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Keterangan Masalah:
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {report.description}
              </div>
            </div>

            {/* Rejection notice if status is REJECTED (Section #7, #8) */}
            {isRejected && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1 animate-fade-in">
                <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  Laporan Ditolak oleh Admin
                </h5>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  {report.rejectionReason
                    ? `Alasan penolakan: "${report.rejectionReason}"`
                    : 'Laporan ditolak oleh Admin karena informasi tidak lengkap atau tidak valid.'}
                </p>
              </div>
            )}

            {/* Location & Metadata info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Gedung / Lokasi:
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formatBuilding(report.building) || report.buildingDisplayName || report.location}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Ruangan / Lokasi Spesifik:
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{report.room || report.location}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Kategori Masalah:
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{report.category || 'Kebersihan Umum'}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">
                  Tingkat Urgensi:
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{report.urgency === 'HIGH' ? 'Mendesak' : report.urgency === 'LOW' ? 'Biasa' : 'Sedang'}</span>
                </p>
              </div>
            </div>

            {/* Notes if provided by staff */}
            {report.notes && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  Catatan dari Petugas Kebersihan:
                </h5>
                <p className="text-xs text-amber-800 leading-relaxed">
                  "{report.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Status Stepper & Timeline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200">
              <StatusTimeline
                currentStatus={report.status}
                timeline={report.timeline}
                createdAt={report.createdAt}
                approvedAt={report.approvedAt}
                processedAt={report.processedAt}
                resolvedAt={report.resolvedAt}
                rejectionReason={report.rejectionReason}
              />
            </div>

            {/* Staff Assigned Details if active */}
            {report.assignedStaffName && (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
                  Petugas yang Menangani:
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                    {report.assignedStaffName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{report.assignedStaffName}</h5>
                    <p className="text-[11px] text-teal-700">Divisi Petugas Kebersihan Shift Aktif</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
