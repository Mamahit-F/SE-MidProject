import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoHome = () => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'STAFF') navigate('/staff/dashboard');
    else if (role === 'USER') navigate('/user/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-card">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Kode 403: Akses Ditolak
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-4 mb-2">
          Anda Tidak Memiliki Izin
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Halaman ini khusus untuk peran tertentu. Akun Anda saat ini tidak memiliki otorisasi untuk membuka modul ini.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button variant="primary" icon={Home} onClick={handleGoHome}>
            Ke Dashboard Saya
          </Button>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-card">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">
          404
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Tautan yang Anda tuju tidak tersedia atau telah dipindahkan ke alamat lain.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
            Halaman Utama
          </Button>
        </div>
      </div>
    </div>
  );
};
