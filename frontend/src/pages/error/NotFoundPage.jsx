import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
          Tautan atau URL yang Anda tuju tidak tersedia atau telah dipindahkan ke alamat lain.
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
