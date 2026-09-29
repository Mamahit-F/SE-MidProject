import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  MapPin,
  FileText,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reportApi } from '../../api/reportApi';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { BUILDINGS, BUILDING_LABELS, REPORT_CATEGORIES } from '../../utils/constants';

export const CreateReportPage = () => {
  const { currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    building: '',
    room: '',
    category: '',
    description: '',
    imageUrl: '',
    urgency: 'MEDIUM',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};

    if (!formData.building) {
      errs.building = 'Pilih gedung atau lokasi.';
    }

    if (!formData.room || !formData.room.trim()) {
      errs.room =
        formData.building === 'OTHER'
          ? 'Tuliskan lokasi spesifik untuk pilihan "Lainnya".'
          : 'Ruangan atau lokasi spesifik wajib diisi.';
    } else if (formData.room.trim().length > 150) {
      errs.room = 'Ruangan / Lokasi Spesifik maksimal 150 karakter.';
    }

    if (!formData.category) {
      errs.category = 'Pilih kategori masalah kebersihan.';
    }

    if (!formData.description || !formData.description.trim()) {
      errs.description = 'Keterangan masalah kebersihan wajib diisi.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Berikan keterangan lebih jelas (minimal 10 karakter).';
    }

    if (!formData.imageUrl) {
      errs.imageUrl = 'Foto bukti area kotor wajib dilampirkan.';
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
    if (!validateForm()) {
      toastError('Form Belum Lengkap', 'Silakan periksa kembali field yang bertanda merah.');
      return;
    }

    setIsSubmitting(true);
    try {
      const buildingLabel = BUILDING_LABELS[formData.building] || formData.building;
      const finalLocation =
        formData.building === 'OTHER'
          ? formData.room.trim()
          : `${buildingLabel} - ${formData.room.trim()}`;

      const payload = {
        building: formData.building,
        room: formData.room.trim(),
        location: finalLocation,
        category: formData.category,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        urgency: formData.urgency,
      };

      const createdReport = await reportApi.create(payload, currentUser);

      success(
        'Laporan Berhasil Diajukan!',
        `Laporan #${createdReport.id} berhasil dibuat dan saat ini berstatus "Menunggu Verifikasi" Admin.`
      );

      navigate(`/user/reports/${createdReport.id}`);
    } catch (err) {
      toastError('Gagal Mengirim Laporan', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="text-slate-600"
        >
          Kembali
        </Button>
        <span className="text-xs text-slate-400 font-medium">Form Pengaduan</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Formulir Pengaduan Kebersihan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Buat Laporan Kebersihan Baru
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            Isi formulir berikut dengan teliti. Laporan Anda akan diperiksa dan diverifikasi oleh Admin sebelum ditugaskan kepada Petugas Kebersihan.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* 1. Gedung / Lokasi & 2. Ruangan / Lokasi Spesifik */}
          <div className="space-y-4">
            <Select
              label="Gedung / Lokasi"
              name="building"
              value={formData.building}
              onChange={handleChange}
              options={BUILDINGS}
              placeholder="Pilih gedung atau lokasi"
              error={errors.building}
              required
            />

            <Input
              label="Ruangan / Lokasi Spesifik"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder={
                formData.building === 'OTHER'
                  ? 'Contoh: lokasi yang tidak tersedia dalam daftar, misalnya area taman belakang'
                  : 'Contoh: 301, Lobby, Toilet, Tempat Parkir GK1'
              }
              error={errors.room}
              maxLength={150}
              helperText={
                formData.building === 'OTHER'
                  ? 'ⓘ Tuliskan lokasi spesifik yang tidak tersedia dalam daftar.'
                  : undefined
              }
              required
            />
          </div>

          {/* 3. Kategori Masalah & Tingkat Urgensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Masalah"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={REPORT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              placeholder="-- Pilih Kategori --"
              error={errors.category}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tingkat Urgensi Masalah
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'LOW', label: 'Biasa', color: 'peer-checked:border-slate-500 peer-checked:bg-slate-50 peer-checked:text-slate-900' },
                  { key: 'MEDIUM', label: 'Sedang', color: 'peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-900' },
                  { key: 'HIGH', label: 'Mendesak', color: 'peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-900' },
                ].map((item) => (
                  <label key={item.key} className="cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={item.key}
                      checked={formData.urgency === item.key}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className={`p-2.5 text-center text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 transition-all ${item.color}`}>
                      {item.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Deskripsi Masalah */}
          <Textarea
            label="Deskripsi Masalah"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Jelaskan kondisi kotor secara spesifik (Contoh: Ada tumpahan cairan teh manis di lantai koridor depan pintu A203 yang membuat lantai licin dan lengket)."
            error={errors.description}
            rows={4}
            maxLength={500}
            helperText="Berikan informasi detail untuk mempermudah pemeriksaan Admin dan persiapan alat petugas."
            required
          />

          {/* 5. Upload Foto Bukti */}
          <div className="pt-2">
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, imageUrl: url }));
                if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: '' }));
              }}
              error={errors.imageUrl}
              label="Foto Bukti Kondisi"
              helperText="Pastikan foto menunjukkan kondisi area yang perlu dibersihkan dengan jelas (Maks. 5 MB)."
              required
            />
          </div>

          {/* Guidelines Box */}
          <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Setelah dikirim, laporan Anda akan berstatus <strong className="text-amber-800 font-bold">"Menunggu Verifikasi"</strong>. Admin akan memeriksa laporan terlebih dahulu sebelum meneruskannya menjadi tugas aktif bagi Petugas Kebersihan.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={Send}
              className="w-full sm:w-auto shadow-md shadow-emerald-600/20 font-bold"
            >
              Kirim Laporan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
