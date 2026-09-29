import React, { useState } from 'react';
import { User, Mail, Phone, Building, Calendar, Wrench, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/Badge';
import { formatDateOnly, resolveAvatarUrl } from '../../utils/formatters';
import { ProfilePhotoUploader } from '../../components/profile/ProfilePhotoUploader';

export const StaffProfilePage = () => {
  const { currentUser, role, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || 'Divisi Kebersihan Gedung A & B',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      success('Profil Diperbarui', 'Data profil petugas berhasil disimpan.');
    } catch (err) {
      toastError('Gagal Memperbarui', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profil Petugas Kebersihan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informasi identitas, foto profil, dan kontak operasional petugas
        </p>
      </div>

      {/* Profile Photo Uploader */}
      <ProfilePhotoUploader subtitle="Foto identitas resmi petugas kebersihan (Maks 5 MB - JPG, PNG, WEBP)" />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Profile Card Header */}
        <div className="p-6 bg-gradient-to-r from-teal-700 to-emerald-600 text-white flex flex-col sm:flex-row items-center gap-5">
          <img
            src={resolveAvatarUrl(currentUser?.avatar)}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/80 shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold">{currentUser?.name}</h2>
            <p className="text-xs text-teal-100 font-mono">@{currentUser?.username}</p>
            <div className="pt-1">
              <RoleBadge role={role} size="md" />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Petugas"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Alamat Email Sistem"
              name="email"
              value={currentUser?.email || ''}
              disabled
              helperText="Email resmi penugasan sistem."
              icon={Mail}
            />

            <Input
              label="Nomor Telepon / WhatsApp Petugas"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              icon={Phone}
            />

            <Input
              label="Divisi / Area Tanggung Jawab"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Contoh: Divisi Kebersihan Gedung A"
              icon={Building}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Mulai bertugas sejak: {formatDateOnly(currentUser?.createdAt)}
            </span>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={Save}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
