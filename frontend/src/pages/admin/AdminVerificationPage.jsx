import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { reportApi } from '../../api/reportApi';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmationModal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, timeAgo, resolveImageUrl } from '../../utils/formatters';

export const AdminVerificationPage = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Approve / Reject Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPendingReports({ search: searchQuery });
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load pending reports:', err);
      toastError('Gagal Memuat Data', err.message || 'Tidak dapat mengambil laporan.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, toastError]);

  useEffect(() => {
    fetchPendingReports();
  }, [fetchPendingReports]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPendingReports();
  };

  const handleOpenApproveModal = (report, e) => {
    e.stopPropagation();
    setSelectedReport(report);
    setApproveModalOpen(true);
  };

  const handleOpenRejectModal = (report, e) => {
    e.stopPropagation();
    setSelectedReport(report);
    setRejectionReason('');
    setRejectionError('');
    setRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    try {
      await adminApi.approveReport(selectedReport.id);
      success('Laporan Berhasil Disetujui', `Laporan #${selectedReport.id} kini masuk ke antrean Petugas Kebersihan.`);
      setApproveModalOpen(false);
      fetchPendingReports();
    } catch (err) {
      toastError('Gagal Menyetujui', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason || !rejectionReason.trim()) {
      setRejectionError('Alasan penolakan laporan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.rejectReport(selectedReport.id, rejectionReason.trim());
      success('Laporan Telah Ditolak', `Laporan #${selectedReport.id} telah ditandai ditolak.`);
      setRejectModalOpen(false);
      fetchPendingReports();
    } catch (err) {
      toastError('Gagal Menolak', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>Verifikasi & Screening Laporan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Verifikasi Laporan Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Periksa keabsahan laporan dari pengguna sebelum diteruskan menjadi pekerjaan Petugas Kebersihan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{reports.length} Laporan Menunggu</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lokasi, deskripsi, pelapor..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reports Table / Card List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <TableSkeleton rows={5} cols={6} />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="Tidak Ada Laporan Menunggu Verifikasi"
          description="Semua laporan baru dari pengguna telah selesai diperiksa dan diverifikasi."
          actionText="Lihat Semua Laporan"
          onAction={() => navigate('/admin/reports')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3">Laporan & Bukti</th>
                  <th scope="col" className="px-3 py-3.5">Lokasi & Kategori</th>
                  <th scope="col" className="px-3 py-3.5">Pelapor</th>
                  <th scope="col" className="px-3 py-3.5">Tanggal</th>
                  <th scope="col" className="px-3 py-3.5">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => navigate(`/admin/reports/${report.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-start gap-3.5 min-w-0 max-w-sm">
                        <img
                          src={resolveImageUrl(report.imageUrl)}
                          alt={report.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-amber-500/30 transition-all"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{report.id}
                          </span>
                          <p className="font-semibold text-slate-900 text-xs line-clamp-1 group-hover:text-amber-700 transition-colors">
                            {report.title || report.description}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-xs">
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{report.location}</span>
                      </p>
                      <p className="text-slate-500 mt-0.5">{report.category || 'Kebersihan'}</p>
                    </td>

                    <td className="px-3 py-4 text-xs whitespace-nowrap">
                      <p className="font-medium text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{report.userName || report.reporterName}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{report.userEmail || report.reporterEmail}</p>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap text-xs text-slate-500">
                      <p className="font-medium text-slate-700">{timeAgo(report.createdAt)}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(report.createdAt)}</p>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/reports/${report.id}`);
                          }}
                          title="Lihat Rincian Laporan"
                        >
                          Detail
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle}
                          onClick={(e) => handleOpenApproveModal(report, e)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          title="Setujui Laporan"
                        >
                          Setujui
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={XCircle}
                          onClick={(e) => handleOpenRejectModal(report, e)}
                          className="text-rose-600 hover:bg-rose-50 text-xs"
                          title="Tolak Laporan"
                        >
                          Tolak
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal Approve */}
      <ConfirmationModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
        isLoading={isSubmitting}
        title="Setujui Laporan Kebersihan?"
        message="Apakah Anda yakin ingin menyetujui laporan ini? Setelah disetujui, laporan akan masuk ke daftar pekerjaan Petugas Kebersihan."
        confirmText="Ya, Setujui Laporan"
        variant="success"
      />

      {/* Modal Reject with Required Reason */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Laporan Kebersihan"
        subtitle="Berikan alasan mengapa laporan ini ditolak agar pelapor mendapatkan informasi yang jelas."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <Textarea
            label="Alasan Penolakan"
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (rejectionError) setRejectionError('');
            }}
            placeholder="Masukkan alasan mengapa laporan ini ditolak... (Contoh: Foto tidak jelas / Lokasi tidak lengkap / Laporan duplikat)"
            rows={4}
            error={rejectionError}
            required
            helperText="Alasan penolakan akan ditampilkan pada riwayat laporan pengguna."
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
