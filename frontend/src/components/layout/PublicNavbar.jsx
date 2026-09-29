import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Menu, X, ArrowRight, LogIn, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, role } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'STAFF') return '/staff/dashboard';
    return '/user/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Uclean
              </span>
              <span className="block text-[10px] text-slate-400 -mt-1 font-medium tracking-wide uppercase">
                Facility Care System
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Masalah & Solusi
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Cara Kerja
            </a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Fitur
            </a>
            <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Alur Status
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(getDashboardPath())}
                icon={ArrowRight}
                iconPosition="right"
              >
                Masuk Dashboard ({role})
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/login')}
                  icon={LogIn}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/user/report/create')}
                  icon={PlusCircle}
                >
                  Laporkan Sekarang
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-lg">
          <a
            href="#problem"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Masalah & Solusi
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Cara Kerja
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Fitur
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Alur Status
          </a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
              >
                Buka Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Login Masuk
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/user/report/create');
                  }}
                >
                  Laporkan Sekarang
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Uclean
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Sistem informasi pelaporan kebersihan dan pemeliharaan fasilitas gedung terintegrasi. Memastikan setiap sudut kampus dan gedung selalu bersih, higienis, dan nyaman.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login Akun</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Registrasi Pengguna Baru</Link></li>
              <li><Link to="/user/report/create" className="hover:text-emerald-400 transition-colors">Buat Laporan Baru</Link></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Panduan Penggunaan</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Pusat Bantuan</h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Biro Pemeliharaan Fasilitas & Manajemen Gedung
            </p>
            <p className="text-xs text-slate-400">Email: helpdesk@kebersihan.id</p>
            <p className="text-xs text-slate-400">Hotline: (021) 8888-CLEAN</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Sistem Pelaporan Kebersihan. Tugas Mid Software Engineering.</p>
          <p>Dirancang dengan React, Vite, Tailwind CSS & REST API Architecture</p>
        </div>
      </div>
    </footer>
  );
};
