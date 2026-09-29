import React, { useState } from 'react';
import { User, Mail, Phone, Building, ShieldCheck, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockStorage } from '../../mock/mockStorage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/Modal';
import { formatDateOnly, resolveAvatarUrl } from '../../utils/formatters';
import { ProfilePhotoUploader } from '../../components/profile/ProfilePhotoUploader';

export const AdminProfilePage = () => {
  const { currentUser, role, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || 'Biro Fasilitas & Manajemen Gedung',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      success('Profil Diperbarui', 'Data profil administrator berhasil disimpan.');
    } catch (err) {
      toastError('Gagal Memperbarui', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = async () => {
    setResetLoading(true);
    try {
      await mockStorage.resetToDefaults();
      success('Database Demo Direset', 'Semua data laporan dan pengguna telah dikembalikan ke kondisi awal.');
      setResetModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      toastError('Gagal Reset', err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profil Administrator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informasi akun tingkat pengawas, foto profil, dan utilitas pemeliharaan sistem
        </p>
      </div>

      {/* Profile Photo Uploader */}
      <ProfilePhotoUploader subtitle="Foto identitas administrator sistem (Maks 5 MB - JPG, PNG, WEBP)" />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-800 to-indigo-700 text-white flex flex-col sm:flex-row items-center gap-5">
          <img
            src={resolveAvatarUrl(currentUser?.avatar)}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/80 shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold">{currentUser?.name}</h2>
            <p className="text-xs text-purple-200 font-mono">@{currentUser?.username}</p>
            <div className="pt-1">
              <RoleBadge role={role} size="md" />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Administrator"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Email Sistem"
              name="email"
              value={currentUser?.email || ''}
              disabled
              helperText="Email administrator utama sistem."
              icon={Mail}
            />

            <Input
              label="Nomor Kontak Darurat"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              icon={Phone}
            />

            <Input
              label="Biro / Departemen Pengawasan"
              name="department"
              value={formData.department}
              onChange={handleChange}
              icon={Building}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Hak akses super admin aktif sejak: {formatDateOnly(currentUser?.createdAt)}
            </span>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={Save}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>

      {/* SDLC Maintenance Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-600" />
          <h4 className="text-sm font-bold text-slate-900">Utilitas Reset Database Simulasi (SDLC Prototyping)</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Jika Anda ingin membersihkan seluruh data laporan percobaan dan mengembalikan data mock ke kondisi awal yang segar, Anda dapat menekan tombol di bawah.
        </p>
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={() => setResetModalOpen(true)}
            className="text-amber-700 hover:bg-amber-100 border-amber-300"
          >
            Reset Database Simulasi ke Awal
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetData}
        isLoading={resetLoading}
        title="Reset Seluruh Data Simulasi?"
        message="Tindakan ini akan mengembalikan semua laporan, status pengerjaan, dan pengguna ke data default awal prototype."
        confirmText="Ya, Reset Data"
        variant="warning"
      />
    </div>
  );
};
