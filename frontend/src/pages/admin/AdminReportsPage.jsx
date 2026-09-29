import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Eye,
  ArrowRight,
  ClipboardList,
  User,
  Wrench,
  Download,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { LoadingSpinner, TableSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, timeAgo, resolveImageUrl } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllReports({
        status: statusFilter === 'ALL' ? null : statusFilter,
        search: searchQuery,
      });
      setReports(Array.isArray(data) ? data : (data?.content || []));
    } catch (err) {
      console.error('Failed to load admin reports:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    if (status === 'ALL') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const filterTabs = [
    { key: 'ALL', label: 'Semua Laporan' },
    { key: REPORT_STATUS.PENDING_VERIFICATION, label: 'Menunggu Verifikasi' },
    { key: REPORT_STATUS.APPROVED, label: 'Disetujui' },
    { key: REPORT_STATUS.PROCESSING, label: 'Diproses' },
    { key: REPORT_STATUS.RESOLVED, label: 'Ditangani' },
    { key: REPORT_STATUS.REJECTED, label: 'Ditolak' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Seluruh Laporan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar komprehensif seluruh laporan kebersihan fasilitas gedung
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/verification')}
            className="border-amber-300 text-amber-900 hover:bg-amber-50"
          >
            Verifikasi Pending
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <Card>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleStatusFilterChange(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === tab.key
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full lg:w-80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lokasi, isi masalah, pelapor..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Cari
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table View */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="Tidak Ada Laporan Ditemukan"
          description="Tidak ditemukan laporan yang sesuai dengan kriteria filter saat ini."
          actionText="Tampilkan Semua Laporan"
          onAction={() => handleStatusFilterChange('ALL')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3">Laporan & Bukti</th>
                  <th scope="col" className="px-3 py-3.5">Lokasi & Kategori</th>
                  <th scope="col" className="px-3 py-3.5">Pelapor & Petugas</th>
                  <th scope="col" className="px-3 py-3.5">Tanggal</th>
                  <th scope="col" className="px-3 py-3.5">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">Aksi</th>
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
                      <div className="flex items-start gap-3.5 min-w-0 max-w-xs">
                        <img
                          src={resolveImageUrl(report.imageUrl)}
                          alt={report.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{report.id}
                          </span>
                          <p className="font-semibold text-slate-900 text-xs truncate group-hover:text-purple-700 transition-colors">
                            {report.title || report.description}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-xs">
                      <p className="font-medium text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[200px]">{report.location}</span>
                      </p>
                      <p className="text-slate-400 mt-0.5">{report.category || 'Kebersihan'}</p>
                    </td>

                    <td className="px-3 py-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="font-medium">{report.userName || report.reporterName}</span>
                        </p>
                        {report.assignedStaffName ? (
                          <p className="text-teal-700 font-medium flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-teal-600 shrink-0" />
                            <span>{report.assignedStaffName}</span>
                          </p>
                        ) : (
                          <span className="text-slate-400 text-[11px] block">Belum ada petugas</span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap text-xs text-slate-500">
                      <p className="font-medium text-slate-700">{timeAgo(report.createdAt)}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(report.createdAt)}</p>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/reports/${report.id}`);
                        }}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
