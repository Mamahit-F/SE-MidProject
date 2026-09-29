import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Users,
  Wrench,
  Check,
  Building,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleReportCTA = () => {
    if (isAuthenticated) {
      navigate('/user/report/create');
    } else {
      navigate('/login?redirect=/user/report/create');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sistem Pelaporan Fasilitas & Kebersihan Gedung</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Laporkan masalah kebersihan dengan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  cepat dan mudah.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Jaga kenyamanan dan kebersihan gedung kampus/kantor secara bersama-sama. Ambil foto bukti, pilih lokasi ruangan, dan pantau proses penanganan oleh petugas secara transparan hingga selesai.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleReportCTA}
                  icon={Camera}
                  className="w-full sm:w-auto shadow-md shadow-emerald-600/20"
                >
                  Laporkan Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  Login ke Sistem
                </Button>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">&lt; 30 mnt</p>
                  <p className="text-xs text-slate-500">Respon Penanganan</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Transparansi Status</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">3 Level</p>
                  <p className="text-xs text-slate-500">User, Petugas, Admin</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Card / Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob */}
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-emerald-200/50 rounded-full filter blur-3xl -z-10" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-teal-200/50 rounded-full filter blur-3xl -z-10" />

                {/* Main Visual Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Live Reporting Preview
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                      alt="Kebersihan Fasilitas Gedung"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                      📍 Gedung A - Lantai 2 (Ruang Kuliah)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">Tumpahan Minuman & Sampah</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                        Diproses
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-sky-500 h-full w-2/3" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Petugas Rudi Hermawan sedang mengepel dan membersihkan area koridor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Tantangan di Lapangan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Mengapa Sistem Pelaporan Digital Ini Diperlukan?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Cara pelaporan manual seringkali lambat, sulit dilacak, dan menyebabkan fasilitas kotor terbengkalai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Masalah Tidak Segera Terlihat</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Petugas kebersihan tidak bisa mengawasi seluruh ruangan secara simultan, sehingga tumpahan atau sampah menumpuk lama.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Pelaporan Manual Lambat</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mencari petugas secara tatap muka atau mencatat di buku manual memakan waktu dan seringkali hilang tanpa jejak tindak lanjut.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Solusi Uclean</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Foto dalam 5 detik dari smartphone, petugas langsung menerima notifikasi tugas, dan admin memonitor SLA secara real-time.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Langkah Sederhana
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              Bagaimana Cara Kerja Sistem Ini?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Hanya perlu 3 langkah mudah dari menemukan masalah hingga fasilitas kembali bersih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 relative">
              <span className="absolute -top-4 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                1
              </span>
              <div className="w-12 h-12 rounded-xl bg-slate-700 text-emerald-400 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Foto & Pilih Lokasi</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ambil foto kondisi kotor lewat smartphone, tentukan gedung & lantai ruangan, lalu kirim laporan seketika.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 relative">
              <span className="absolute -top-4 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                2
              </span>
              <div className="w-12 h-12 rounded-xl bg-slate-700 text-sky-400 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Petugas Menangani</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Petugas kebersihan menerima laporan, mengubah status menjadi "Diproses", dan menuju lokasi untuk pembersihan.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 relative">
              <span className="absolute -top-4 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
                3
              </span>
              <div className="w-12 h-12 rounded-xl bg-slate-700 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Selesai & Terverifikasi</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Status diperbarui menjadi "Ditangani", pelapor dapat melihat konfirmasi dan riwayat penanganan lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Fitur Utama
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
            Dirancang Lengkap untuk Seluruh Pengguna Gedung
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <Smartphone className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">Mobile-First Responsiveness</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dapat diakses nyaman melalui browser smartphone, tablet, maupun laptop dengan navigasi drawer adaptif.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <Users className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">3 Hak Akses Peran (Role)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pemisahan akses aman untuk Pelapor, Petugas Kebersihan, dan Super Admin sesuai tanggung jawab.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <Clock className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">Live Status Timeline</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pantau perjalanan laporan mulai dari Menunggu, Diproses oleh siapa, hingga waktu selesai.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <Camera className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">Upload Foto & Drag-Drop</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dukungan kamera langsung dari smartphone atau drag & drop file dari komputer dengan validasi otomatis.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <BarChart3 className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">Monitoring & Analisis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dashboard admin menampilkan grafik tren laporan mingguan dan area gedung yang sering membutuhkan perhatian.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <h4 className="text-base font-semibold text-slate-900">REST API Ready</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Frontend modular siap dikoneksikan ke backend Spring Boot REST API tanpa mengubah kode komponen.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW SECTION */}
      <section id="workflow" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Alur Status Laporan
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              Siklus Penanganan yang Terstruktur
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-slate-800 border border-amber-500/30 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-amber-400 text-sm mb-1">Status: Menunggu</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Laporan masuk dari pengguna dan berada di antrean petugas kebersihan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-slate-800 border border-sky-500/30 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg mb-3">
                <Wrench className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-sky-400 text-sm mb-1">Status: Diproses</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Petugas mengonfirmasi dan sedang melakukan tindakan pembersihan di lokasi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-slate-800 border border-emerald-500/30 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-emerald-400 text-sm mb-1">Status: Ditangani</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pekerjaan selesai dan fasilitas telah bersih kembali untuk digunakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Temukan area gedung yang perlu dibersihkan?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Bantu kami menjaga lingkungan kampus dan gedung selalu bersih, higienis, dan sehat untuk semua orang.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleReportCTA}
                icon={Camera}
                className="bg-white text-emerald-800 hover:bg-slate-100 font-semibold"
              >
                Buat Laporan Sekarang
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/register')}
                className="text-white hover:bg-emerald-700 border border-emerald-500"
              >
                Daftar Akun Baru
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
