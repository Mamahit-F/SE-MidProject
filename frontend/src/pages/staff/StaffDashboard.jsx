import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  Clock,
  Loader2,
  CheckCircle2,
  CheckCircle,
  ClipboardList,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { staffApi } from '../../api/staffApi';
import { StatCard, Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { LoadingSpinner, CardSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusDistributionChart } from '../../components/ui/SimpleChart';
import { formatDate, timeAgo, resolveImageUrl } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, reportsData] = await Promise.all([
          staffApi.getDashboardStats(),
          staffApi.getReports({ size: 10 }),
        ]);
        setStats(statsData);
        setReports(Array.isArray(reportsData) ? reportsData : (reportsData?.content || []));
      } catch (err) {
        console.error('Failed to load staff dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApproved = stats?.totalApproved ?? stats?.waiting ?? 0;
  const totalProcessing = stats?.totalProcessing ?? stats?.inProgress ?? 0;
  const totalResolved = stats?.totalResolved ?? stats?.resolved ?? 0;
  const totalReports = stats?.totalReports ?? (totalApproved + totalProcessing + totalResolved);

  const activeQueue = reports
    .filter((r) => r.status === REPORT_STATUS.APPROVED || r.status === REPORT_STATUS.PROCESSING)
    .slice(0, 5);

  const urgentReports = reports.filter(
    (r) => (r.status === REPORT_STATUS.APPROVED || r.status === REPORT_STATUS.PROCESSING) && r.urgency === 'HIGH'
  );

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-semibold backdrop-blur-xs border border-teal-400/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>Petugas Kebersihan Gedung Aktif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Bertugas, {currentUser?.name || currentUser?.fullName || 'Petugas'}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Berikut daftar laporan kebersihan yang telah diverifikasi dan disetujui Admin. Siap untuk ditindaklanjuti.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Laporan Baru (Disetujui)"
            value={totalApproved}
            subtitle="Siap ditangani"
            icon={CheckCircle}
            color="teal"
            onClick={() => navigate('/staff/reports?status=APPROVED')}
          />
          <StatCard
            title="Sedang Diproses"
            value={totalProcessing}
            subtitle="Pengerjaan aktif"
            icon={Loader2}
            color="sky"
            onClick={() => navigate('/staff/reports?status=PROCESSING')}
          />
          <StatCard
            title="Ditangani"
            value={totalResolved}
            subtitle="Pekerjaan tuntas"
            icon={CheckCircle2}
            color="emerald"
            onClick={() => navigate('/staff/reports?status=RESOLVED')}
          />
          <StatCard
            title="Total Pekerjaan"
            value={totalReports}
            subtitle="Kumulatif tugas"
            icon={ClipboardList}
            color="slate"
            onClick={() => navigate('/staff/reports')}
          />
        </div>
      )}

      {/* Urgent Alert Banner */}
      {!loading && urgentReports.length > 0 && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900">
                Perhatian: Terdapat {urgentReports.length} Laporan dengan Prioritas Mendesak!
              </p>
              <p className="text-xs text-rose-700">
                Harap prioritaskan lokasi-lokasi mendesak untuk segera dilakukan tindakan pembersihan.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/staff/reports')}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 text-xs shrink-0"
          >
            Lihat Tugas
          </Button>
        </div>
      )}

      {/* Main Grid: Active Queue & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Work Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Antrean Pekerjaan Aktif"
              subtitle="Laporan terverifikasi yang memerlukan penanganan segera"
              action={
                <Link
                  to="/staff/reports"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              }
            />
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8">
                  <LoadingSpinner text="Memuat antrean..." />
                </div>
              ) : activeQueue.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Semua Pekerjaan Tuntas!</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tidak ada laporan yang sedang menunggu penanganan saat ini.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeQueue.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => navigate(`/staff/reports/${report.id}`)}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <img
                          src={resolveImageUrl(report.imageUrl)}
                          alt={report.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              #{report.id}
                            </span>
                            <StatusBadge status={report.status} size="sm" />
                            {report.urgency === 'HIGH' && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                                Mendesak
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                            {report.title || report.description}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{report.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto text-xs text-slate-400 gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span>{timeAgo(report.createdAt)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/staff/reports/${report.id}`);
                          }}
                        >
                          Tangani
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution Visualization */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Status Penanganan"
              subtitle="Rasio pengerjaan tugas kebersihan"
            />
            <CardContent>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <StatusDistributionChart
                  waiting={totalApproved}
                  inProgress={totalProcessing}
                  resolved={totalResolved}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
