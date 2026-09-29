import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { User, Wrench, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const DemoAccountBanner = () => {
  const { currentUser, role, switchDemoUser } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSwitch = (targetRole) => {
    const user = switchDemoUser(targetRole);
    success(
      'Beralih Akun (Prototype)',
      `Sekarang login sebagai ${user.name} (${targetRole})`
    );

    if (targetRole === ROLES.USER) {
      navigate('/user/dashboard');
    } else if (targetRole === ROLES.STAFF) {
      navigate('/staff/dashboard');
    } else if (targetRole === ROLES.ADMIN) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
          <Zap className="w-3 h-3 text-emerald-400" />
          SDLC Prototype Mode
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="text-slate-300">
          Sedang Login:{' '}
          <strong className="text-white">
            {currentUser ? `${currentUser.name} (${role})` : 'Belum Login'}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-[11px] hidden md:inline">Cepat Ganti Aktor:</span>
        <button
          type="button"
          onClick={() => handleSwitch(ROLES.USER)}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 text-[11px] font-medium ${
            role === ROLES.USER
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Login sebagai Pelapor (User)"
        >
          <User className="w-3 h-3" />
          Pelapor
        </button>

        <button
          type="button"
          onClick={() => handleSwitch(ROLES.STAFF)}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 text-[11px] font-medium ${
            role === ROLES.STAFF
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Login sebagai Petugas Kebersihan (Staff)"
        >
          <Wrench className="w-3 h-3" />
          Petugas
        </button>

        <button
          type="button"
          onClick={() => handleSwitch(ROLES.ADMIN)}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 text-[11px] font-medium ${
            role === ROLES.ADMIN
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Login sebagai Super Admin"
        >
          <ShieldCheck className="w-3 h-3" />
          Admin
        </button>
      </div>
    </div>
  );
};
