import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Users,
  Wrench,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { reportApi } from '../../api/reportApi';
import { StatCard, Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { LoadingSpinner, CardSkeleton } from '../../components/ui/LoadingSpinner';
import {
  StatusDistributionChart,
  WeeklyTrendChart,
  LocationRankingList,
} from '../../components/ui/SimpleChart';
import { formatDate, timeAgo, resolveImageUrl } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, allReports] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getAllReports({ size: 10 }),
        ]);
        setStats(statsData);
        setRecentReports(Array.isArray(allReports) ? allReports.slice(0, 5) : (allReports?.content?.slice(0, 5) || []));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingCount = stats?.pendingVerification ?? stats?.waiting ?? 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Admin Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
              Super Administrator
            </span>
            <span className="text-xs text-slate-400">Monitoring & Verifikasi Real-time</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Dashboard Manajemen Fasilitas
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Clock}
            onClick={() => navigate('/admin/verification')}
            className="border-amber-300 text-amber-900 hover:bg-amber-50"
          >
            Verifikasi Laporan ({pendingCount})
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FileText}
            onClick={() => navigate('/admin/reports')}
            className="bg-purple-600 hover:bg-purple-700 shadow-sm"
          >
            Semua Laporan
          </Button>
        </div>
      </div>

      {/* PROMINENT SECTION: LAPORAN MENUNGGU VERIFIKASI */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-semibold backdrop-blur-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            <span>Tindakan Verifikasi Diperlukan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            LAPORAN MENUNGGU VERIFIKASI
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            Laporan baru dari pengguna harus disetujui atau ditolak oleh Admin sebelum diteruskan menjadi tugas pengerjaan Petugas Kebersihan.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 text-center border border-white/30">
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              {loading ? '...' : pendingCount}
            </span>
            <span className="text-[11px] font-medium text-amber-100 uppercase tracking-wider">
              Antrean Pending
            </span>
          </div>

          <Button
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate('/admin/verification')}
            className="bg-white text-amber-900 hover:bg-amber-50 font-bold shadow-md"
          >
            Lihat Laporan
          </Button>
        </div>
      </div>

      {/* 6 Key Stat Cards: Total, Pending, Approved, Processing, Resolved, Rejected */}
      {loading || !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Total Laporan"
            value={stats.totalReports || 0}
            subtitle="Seluruh sistem"
            icon={FileText}
            color="slate"
            onClick={() => navigate('/admin/reports')}
          />
          <StatCard
            title="Menunggu Verifikasi"
            value={pendingCount}
            subtitle="Belum disetujui"
            icon={Clock}
            color="amber"
            onClick={() => navigate('/admin/verification')}
          />
          <StatCard
            title="Disetujui"
            value={stats.approvedReports ?? 0}
            subtitle="Siap dikerjakan"
            icon={CheckCircle}
            color="teal"
            onClick={() => navigate('/admin/reports?status=APPROVED')}
          />
          <StatCard
            title="Diproses"
            value={stats.processingReports ?? stats.inProgress ?? 0}
            subtitle="Pengerjaan aktif"
            icon={Loader2}
            color="sky"
            onClick={() => navigate('/admin/reports?status=PROCESSING')}
          />
          <StatCard
            title="Ditangani"
            value={stats.resolvedReports ?? stats.resolved ?? 0}
            subtitle="Telah tuntas"
            icon={CheckCircle2}
            color="emerald"
            onClick={() => navigate('/admin/reports?status=RESOLVED')}
          />
          <StatCard
            title="Ditolak"
            value={stats.rejectedReports ?? 0}
            subtitle="Tidak valid"
            icon={XCircle}
            color="rose"
            onClick={() => navigate('/admin/reports?status=REJECTED')}
          />
        </div>
      )}

      {/* 3 Analytics Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader
            title="Distribusi Status Laporan"
            subtitle="Rasio status seluruh laporan kebersihan"
          />
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <StatusDistributionChart
                waiting={pendingCount}
                inProgress={stats?.processingReports ?? stats?.inProgress ?? 0}
                resolved={stats?.resolvedReports ?? stats?.resolved ?? 0}
              />
            )}
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader
            title="Tren Laporan Mingguan"
            subtitle="Aktivitas laporan masuk 7 hari terakhir"
          />
          <CardContent>
            <WeeklyTrendChart />
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader
            title="Area Paling Sering Dilaporkan"
            subtitle="Frekuensi keluhan per gedung"
          />
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <LocationRankingList locationCounts={stats?.locationCounts || {}} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent System Activities Table */}
      <Card>
        <CardHeader
          title="Aktivitas Laporan Terbaru"
          subtitle="Pemantauan real-time laporan yang masuk ke sistem"
          action={
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              <span>Lihat Seluruh Laporan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8">
              <LoadingSpinner text="Memuat aktivitas..." />
            </div>
          ) : recentReports.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Belum ada data laporan.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/admin/reports/${report.id}`)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <img
                      src={resolveImageUrl(report.imageUrl)}
                      alt={report.title}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{report.id}
                        </span>
                        <StatusBadge status={report.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {report.title || report.description}
                      </h4>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {report.location}
                        </span>
                        <span>•</span>
                        <span>Pelapor: <strong>{report.userName || report.reporterName}</strong></span>
                        {report.assignedStaffName && (
                          <>
                            <span>•</span>
                            <span className="text-teal-700">Petugas: <strong>{report.assignedStaffName}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto text-xs text-slate-400 gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span>{timeAgo(report.createdAt)}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/reports/${report.id}`);
                      }}
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
