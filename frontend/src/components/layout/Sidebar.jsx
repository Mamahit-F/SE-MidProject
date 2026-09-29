import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  ClipboardList,
  Users,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { RoleBadge } from '../ui/Badge';
import { adminApi } from '../../api/adminApi';
import { resolveAvatarUrl } from '../../utils/formatters';

export const Sidebar = ({ onCloseMobile }) => {
  const { currentUser, role, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (role === ROLES.ADMIN) {
      const fetchPending = async () => {
        try {
          const stats = await adminApi.getDashboardStats();
          if (stats && stats.pendingVerification !== undefined) {
            setPendingCount(stats.pendingVerification);
          }
        } catch (err) {
          // silently ignore in background
        }
      };
      fetchPending();
      const interval = setInterval(fetchPending, 15000); // refresh count every 15s
      return () => clearInterval(interval);
    }
  }, [role]);

  const handleLogout = async () => {
    await logout();
    success('Logout Berhasil', 'Sampai jumpa kembali!');
    navigate('/login');
  };

  const getNavItems = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { label: 'Dashboard Monitoring', path: '/admin/dashboard', icon: LayoutDashboard },
          {
            label: 'Verifikasi Laporan',
            path: '/admin/verification',
            icon: Clock,
            badge: pendingCount > 0 ? pendingCount : null,
          },
          { label: 'Semua Laporan', path: '/admin/reports', icon: ClipboardList },
          { label: 'Manajemen Pengguna', path: '/admin/users', icon: Users },
          { label: 'Data Petugas', path: '/admin/staff', icon: ShieldCheck },
          { label: 'Profil Admin', path: '/admin/profile', icon: User },
        ];
      case ROLES.STAFF:
        return [
          { label: 'Dashboard Petugas', path: '/staff/dashboard', icon: LayoutDashboard },
          { label: 'Daftar Pekerjaan', path: '/staff/reports', icon: ClipboardList },
          { label: 'Profil Petugas', path: '/staff/profile', icon: User },
        ];
      case ROLES.USER:
      default:
        return [
          { label: 'Dashboard Pelapor', path: '/user/dashboard', icon: LayoutDashboard },
          { label: 'Buat Laporan Baru', path: '/user/report/create', icon: PlusCircle, highlight: true },
          { label: 'Riwayat Laporan Saya', path: '/user/reports', icon: FileText },
          { label: 'Profil Saya', path: '/user/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
            Uclean
          </h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Facility Care System
          </span>
        </div>
      </div>

      {/* User Info Capsule */}
      <div className="p-4 mx-3 my-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
        <img
          src={resolveAvatarUrl(currentUser?.avatar)}
          alt={currentUser?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name || currentUser?.fullName || 'Pengguna'}</p>
          <div className="mt-0.5">
            <RoleBadge role={role} size="sm" />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Menu Navigasi
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                    : item.highlight
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 my-1 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-emerald-600'
                          : item.highlight
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white animate-pulse shadow-xs">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
