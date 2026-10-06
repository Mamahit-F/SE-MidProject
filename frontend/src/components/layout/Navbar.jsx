import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, PlusCircle, LogOut, User, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RoleBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { resolveAvatarUrl } from '../../utils/formatters';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { currentUser, role, isUser, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Logout Berhasil', 'Sampai jumpa kembali!');
    navigate('/login');
  };

  const getProfilePath = () => {
    if (role === 'ADMIN') return '/admin/profile';
    if (role === 'STAFF') return '/staff/profile';
    return '/user/profile';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Context Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-slate-800">
              Sistem Pelaporan Fasilitas & Kebersihan
            </h2>
          </div>
        </div>

        {/* Right Side: Quick Action & User Menu */}
        <div className="flex items-center gap-3">
          {isUser && (
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={() => navigate('/user/report/create')}
              className="hidden sm:inline-flex shadow-sm"
            >
              Buat Laporan
            </Button>
          )}

          {/* Notification Bell Dropdown */}
          <NotificationDropdown />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-expanded={dropdownOpen}
            >
              <img
                src={resolveAvatarUrl(currentUser?.avatar)}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || 'User'}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-slide-up">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentUser?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser?.email}
                    </p>
                    <div className="mt-1.5">
                      <RoleBadge role={role} size="sm" />
                    </div>
                  </div>

                  <Link
                    to={getProfilePath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Profil Saya
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
