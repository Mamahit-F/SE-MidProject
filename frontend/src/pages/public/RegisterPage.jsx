import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, UserPlus, User, Mail, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: 'Mahasiswa / Civitas Kampus',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'Kosong', color: 'bg-slate-200' };
    if (pwd.length < 6) return { score: 1, text: 'Terlalu Pendek', color: 'bg-rose-500' };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 2, text: 'Cukup', color: 'bg-amber-500' };
    return { score: 3, text: 'Kuat & Aman', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!formData.username.trim()) {
      errs.username = 'Username wajib diisi.';
    } else if (formData.username.length < 3) {
      errs.username = 'Username minimal 3 karakter.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errs.username = 'Username hanya boleh huruf, angka, dan garis bawah (_).';
    }

    if (!formData.email.trim()) {
      errs.email = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Format alamat email tidak valid.';
    }

    if (!formData.password) {
      errs.password = 'Kata sandi wajib diisi.';
    } else if (formData.password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await register(formData);
      success('Registrasi Berhasil', `Selamat datang di Uclean, ${user.name}!`);
      navigate('/user/dashboard');
    } catch (err) {
      toastError('Gagal Mendaftar', err.message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Sparkles className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Pengguna Baru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar untuk mulai melaporkan dan memantau kebersihan fasilitas gedung
          </p>
        </div>

        {/* Register Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              error={errors.name}
              icon={User}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="budi_santoso"
                error={errors.username}
                required
              />

              <Input
                label="Alamat Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="budi@domain.com"
                error={errors.email}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Kata Sandi"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 karakter"
                  error={errors.password}
                  icon={Lock}
                  required
                />
                {formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Kekuatan sandi:</span>
                      <span className="font-semibold text-slate-700">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Konfirmasi Sandi"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi kata sandi"
                error={errors.confirmPassword}
                icon={Lock}
                required
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                icon={UserPlus}
                className="w-full"
              >
                Buat Akun Pelapor
              </Button>
            </div>
          </form>

          <div className="text-center pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Sudah memiliki akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
