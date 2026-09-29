import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ROLES } from '../../utils/constants';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email atau username wajib diisi.';
    }
    if (!password) {
      errs.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 4) {
      errs.password = 'Kata sandi minimal 4 karakter.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login({ identifier, password });
      success('Login Berhasil', `Selamat datang kembali, ${user.name}!`);

      // Determine redirect path
      const redirectUrl = new URLSearchParams(location.search).get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (user.role === ROLES.ADMIN) {
        navigate('/admin/dashboard');
      } else if (user.role === ROLES.STAFF) {
        navigate('/staff/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      toastError('Gagal Masuk', err.message || 'Kredensial tidak valid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sistem Pelaporan Fasilitas & Kebersihan Gedung
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email atau Username"
              name="identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: '' });
              }}
              placeholder="Contoh: user@kebersihan.id"
              error={errors.identifier}
              icon={Mail}
              required
            />

            <Input
              label="Kata Sandi"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Masukkan kata sandi..."
              error={errors.password}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={LogIn}
              className="w-full mt-2"
            >
              Masuk ke Aplikasi
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
