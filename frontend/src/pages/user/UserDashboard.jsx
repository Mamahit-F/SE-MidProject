import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  Loader2,
  CheckCircle2,
  CheckCircle,
  XCircle,
  FileText,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reportApi } from '../../api/reportApi';
import { userApi } from '../../api/userApi';
import { StatCard, Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { LoadingSpinner, CardSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusDistributionChart } from '../../components/ui/SimpleChart';
import { formatDate, timeAgo, resolveImageUrl } from '../../utils/formatters';
import { REPORT_STATUS } from '../../utils/constants';

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [statsData, reportsData] = await Promise.all([
          userApi.getDashboardStats(),
          reportApi.getMyReports(currentUser?.id, { size: 10 }),
        ]);
        setStats(statsData);
        setReports(Array.isArray(reportsData) ? reportsData : (reportsData?.content || []));
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser?.id]);

  const total = stats?.totalReports ?? reports.length;
  const pending = stats?.pendingVerification ?? reports.filter((r) => r.status === REPORT_STATUS.PENDING_VERIFICATION).length;
  const approved = stats?.approvedReports ?? reports.filter((r) => r.status === REPORT_STATUS.APPROVED).length;
  const processing = stats?.processingReports ?? reports.filter((r) => r.status === REPORT_STATUS.PROCESSING).length;
  const resolved = stats?.resolvedReports ?? reports.filter((r) => r.status === REPORT_STATUS.RESOLVED).length;
  const rejected = stats?.rejectedReports ?? reports.filter((r) => r.status === REPORT_STATUS.REJECTED).length;

  const recentReports = reports.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Pelaporan Kebersihan Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Halo, {currentUser?.name || currentUser?.fullName || 'Pengguna'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Laporkan masalah kebersihan di gedung kampus Anda. Semua laporan baru akan diverifikasi oleh Admin sebelum diteruskan kepada Petugas Kebersihan.
          </p>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              icon={PlusCircle}
              onClick={() => navigate('/user/report/create')}
              className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-md"
            >
              Buat Laporan Baru
            </Button>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards: Total, Pending, Approved, Processing, Resolved, Rejected */}
      {loading ? (
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
            value={total}
            subtitle="Laporan dibuat"
            icon={FileText}
            color="slate"
            onClick={() => navigate('/user/reports')}
          />
          <StatCard
            title="Menunggu Verifikasi"
            value={pending}
            subtitle="Pemeriksaan Admin"
            icon={Clock}
            color="amber"
            onClick={() => navigate('/user/reports?status=PENDING_VERIFICATION')}
          />
          <StatCard
            title="Disetujui"
            value={approved}
            subtitle="Siap ditangani"
            icon={CheckCircle}
            color="teal"
            onClick={() => navigate('/user/reports?status=APPROVED')}
          />
          <StatCard
            title="Diproses"
            value={processing}
            subtitle="Pembersihan aktif"
            icon={Loader2}
            color="sky"
            onClick={() => navigate('/user/reports?status=PROCESSING')}
          />
          <StatCard
            title="Ditangani"
            value={resolved}
            subtitle="Selesai tuntas"
            icon={CheckCircle2}
            color="emerald"
            onClick={() => navigate('/user/reports?status=RESOLVED')}
          />
          <StatCard
            title="Ditolak"
            value={rejected}
            subtitle="Tidak valid"
            icon={XCircle}
            color="rose"
            onClick={() => navigate('/user/reports?status=REJECTED')}
          />
        </div>
      )}

      {/* Main Grid: Recent Reports & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Laporan Terbaru Anda"
              subtitle="Pantau perkembangan penanganan laporan yang telah diajukan"
              action={
                <Link
                  to="/user/reports"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
                >
                  <span>Lihat Semua Riwayat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              }
            />
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8">
                  <LoadingSpinner text="Memuat laporan..." />
                </div>
              ) : reports.length === 0 ? (
                <div className="p-8 text-center">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Belum Ada Laporan</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Anda belum pernah membuat laporan kebersihan. Klik tombol di bawah untuk membuat laporan baru.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={PlusCircle}
                    onClick={() => navigate('/user/report/create')}
                    className="mt-4"
                  >
                    Buat Laporan Sekarang
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => navigate(`/user/reports/${report.id}`)}
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
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
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
                            navigate(`/user/reports/${report.id}`);
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

        {/* Status Breakdown Visualization */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Status Penanganan"
              subtitle="Rasio status laporan Anda"
            />
            <CardContent>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <StatusDistributionChart
                  waiting={pending}
                  inProgress={processing}
                  resolved={resolved}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
