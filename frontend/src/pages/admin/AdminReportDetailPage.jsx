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
  XCircle,
  AlertTriangle,
  FileText,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { reportApi } from '../../api/reportApi';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { Modal, ConfirmationModal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatDate, timeAgo, resolveImageUrl, formatBuilding } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const AdminReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals for verification
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReport = useCallback(async () => {
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
    fetchReport();
  }, [fetchReport]);

  const handleOpenApproveModal = () => {
    setApproveModalOpen(true);
  };

  const handleOpenRejectModal = () => {
    setRejectionReason('');
    setRejectionError('');
    setRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!report) return;
    setIsSubmitting(true);
    try {
      const updated = await adminApi.approveReport(report.id);
      setReport(updated);
      setApproveModalOpen(false);
      success('Laporan Berhasil Disetujui', 'Laporan berhasil disetujui.');
    } catch (err) {
      toastError('Gagal Menyetujui', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason || !rejectionReason.trim()) {
      setRejectionError('Alasan penolakan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await adminApi.rejectReport(report.id, rejectionReason.trim());
      setReport(updated);
      setRejectModalOpen(false);
      success('Laporan Berhasil Ditolak', 'Laporan telah ditolak.');
    } catch (err) {
      toastError('Gagal Menolak', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="Memuat detail laporan..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState
          title="Laporan Tidak Ditemukan"
          message={error}
          onRetry={() => navigate('/admin/reports')}
        />
      </div>
    );
  }

  const isPending = report.status === REPORT_STATUS.PENDING_VERIFICATION;
  const isRejected = report.status === REPORT_STATUS.REJECTED;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Kembali
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

        {/* Verification Action Banner (Sections #11, #12, #13) */}
        {isPending && (
          <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-100" />
                <span className="text-sm font-bold tracking-tight">Verifikasi Laporan Masuk</span>
              </div>
              <p className="text-xs text-amber-100 max-w-lg leading-relaxed">
                Tinjau laporan ini. Setujui agar masuk ke antrean pengerjaan Petugas Kebersihan, atau tolak dengan alasan yang jelas.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="secondary"
                size="md"
                icon={CheckCircle}
                onClick={handleOpenApproveModal}
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md"
              >
                Setujui Laporan
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={XCircle}
                onClick={handleOpenRejectModal}
                className="bg-rose-700 text-white hover:bg-rose-800 border-rose-600 font-bold shadow-md"
              >
                Tolak Laporan
              </Button>
            </div>
          </div>
        )}

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
                Deskripsi Masalah:
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                {report.description}
              </div>
            </div>

            {/* Rejection Alert if Rejected */}
            {isRejected && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Alasan Penolakan oleh Admin:
                </h5>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  "{report.rejectionReason || 'Laporan tidak dapat diverifikasi.'}"
                </p>
              </div>
            )}

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
                  Informasi Pelapor:
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
                  Catatan Lapangan Petugas:
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

            {report.assignedStaffName && (
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
                  Petugas Ditugaskan:
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                    {report.assignedStaffName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{report.assignedStaffName}</h5>
                    <p className="text-[11px] text-teal-700">Petugas Kebersihan Shift Aktif</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal (Section #12) */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        isLoading={isSubmitting}
        title="Setujui Laporan Ini?"
        message="Apakah Anda yakin ingin menyetujui laporan ini? Setelah disetujui, laporan akan masuk ke daftar pekerjaan Petugas Kebersihan."
        confirmText="Setujui"
        cancelText="Batal"
        variant="success"
      />

      {/* Reject Modal with Textarea (Section #13) */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Laporan"
        subtitle="Berikan alasan mengapa laporan ini ditolak."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <Textarea
            label="Alasan Penolakan"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (rejectionError) setRejectionError('');
            }}
            placeholder="Masukkan alasan mengapa laporan ini ditolak..."
            rows={4}
            error={rejectionError}
            required
            helperText="Alasan penolakan wajib diisi dan akan disampaikan kepada pelapor."
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isSubmitting}
            >
              Tolak Laporan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
