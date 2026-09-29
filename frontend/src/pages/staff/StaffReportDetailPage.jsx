import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Wrench,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reportApi } from '../../api/reportApi';
import { staffApi } from '../../api/staffApi';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { ConfirmationModal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatDate, timeAgo, resolveImageUrl, formatBuilding } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const StaffReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Action state & Modals
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetAction, setTargetAction] = useState(null); // 'process' | 'resolve'
  const [actionLoading, setActionLoading] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportApi.getById(id);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Laporan tidak dapat diakses atau tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleOpenProcessModal = () => {
    setTargetAction('process');
    setStaffNotes('Petugas telah menuju ke lokasi dan menyiapkan peralatan pembersihan.');
    setConfirmModalOpen(true);
  };

  const handleOpenResolveModal = () => {
    setTargetAction('resolve');
    setStaffNotes('Pembersihan telah selesai dilakukan secara menyeluruh dan area telah bersih serta rapi.');
    setConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!report || !targetAction) return;

    setActionLoading(true);
    try {
      if (targetAction === 'process') {
        const updated = await staffApi.processReport(report.id, staffNotes);
        setReport(updated);
        setConfirmModalOpen(false);
        success('Pengerjaan Dimulai', 'Status laporan kini "Diproses".');
      } else if (targetAction === 'resolve') {
        const updated = await staffApi.resolveReport(report.id, staffNotes);
        setReport(updated);
        setConfirmModalOpen(false);
        success('Laporan Selesai Ditangani', 'Status laporan kini "Ditangani".');
      }
    } catch (err) {
      toastError('Gagal Memperbarui Status', err.message || 'Terjadi kesalahan.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="Memuat rincian tugas..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Laporan Tidak Dapat Diakses"
          message={error || 'Laporan ini mungkin belum disetujui Admin atau tidak ditemukan.'}
          onRetry={() => navigate('/staff/reports')}
        />
      </div>
    );
  }

  const isApproved = report.status === REPORT_STATUS.APPROVED;
  const isProcessing = report.status === REPORT_STATUS.PROCESSING;
  const isResolved = report.status === REPORT_STATUS.RESOLVED;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/staff/reports')}
        >
          Kembali ke Daftar Pekerjaan
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
            <p className="font-medium text-slate-700">Dilaporkan oleh:</p>
            <p className="font-semibold text-slate-900">{report.userName || report.reporterName}</p>
            <p className="text-slate-400">{formatDate(report.createdAt)}</p>
          </div>
        </div>

        {/* Action Banner for Staff (Section #16) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Tindakan Petugas Kebersihan:
            </span>
            <p className="text-xs text-slate-300">
              {isApproved
                ? 'Laporan ini telah disetujui Admin. Klik tombol "Mulai Proses" untuk mencatat pengerjaan.'
                : isProcessing
                ? 'Laporan sedang dalam penanganan Anda. Klik "Selesaikan" jika pembersihan telah selesai.'
                : 'Laporan ini telah tuntas diselesaikan.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isApproved && (
              <Button
                variant="primary"
                size="md"
                icon={Wrench}
                onClick={handleOpenProcessModal}
                className="bg-sky-600 hover:bg-sky-700 shadow-md font-bold"
              >
                Mulai Proses
              </Button>
            )}

            {isProcessing && (
              <Button
                variant="success"
                size="md"
                icon={CheckCircle2}
                onClick={handleOpenResolveModal}
                className="bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold"
              >
                Selesaikan
              </Button>
            )}

            {isResolved && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Pekerjaan Tuntas Selesai
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image, Location, Description */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Foto Bukti Masalah:
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                <img
                  src={resolveImageUrl(report.imageUrl)}
                  alt={report.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Deskripsi Masalah dari Pelapor:
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {report.description}
              </div>
            </div>

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
                  Kontak Pelapor:
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{report.userName || report.reporterName}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{report.userEmail || report.reporterEmail}</p>
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
            </div>

            {report.notes && (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  Catatan Penanganan Petugas:
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
          </div>
        </div>
      </div>

      {/* Status Transition Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        isLoading={actionLoading}
        title={
          targetAction === 'process'
            ? 'Mulai Pengerjaan Laporan Ini?'
            : 'Tandai Laporan Selesai Ditangani?'
        }
        message={
          targetAction === 'process'
            ? 'Apakah Anda yakin ingin memulai pengerjaan laporan ini? Status akan berubah menjadi "Diproses".'
            : 'Apakah Anda yakin area kebersihan telah tuntas dibersihkan dan siap digunakan kembali?'
        }
        confirmText={
          targetAction === 'process'
            ? 'Ya, Mulai Proses'
            : 'Ya, Tandai Selesai'
        }
        cancelText="Batal"
        variant={targetAction === 'process' ? 'primary' : 'success'}
      />
    </div>
  );
};
