# Sistem Pelaporan Kebersihan Fasilitas Gedung (Frontend)

Aplikasi web modern, responsif, accessible, dan scalable untuk pelaporan dan manajemen penanganan masalah kebersihan fasilitas kampus / gedung secara cepat, transparan, dan terstruktur.

Dibangun dengan standar Software Engineering modern menggunakan pendekatan SDLC Prototyping yang siap diintegrasikan langsung dengan backend **Spring Boot REST API**.

---

## 🚀 Tech Stack

- **React 19** + **Vite** (JavaScript + JSX)
- **React Router v7** (Declarative role-based routing)
- **Tailwind CSS v3** (Facility management cleanliness theme)
- **Lucide React** (Iconography modern & konsisten)
- **Axios** (Centralized API client dengan JWT Interceptors)
- **Context API** (`AuthContext` & `ToastContext`)
- **Modern Form Validation & UX** (Drag & Drop image upload, camera picker, skeleton loaders, confirmation modals, timeline stepper)

---

## 👥 3 Peran Pengguna (Role-Based Access)

### 1. USER / PELAPOR
- Registrasi & Login akun pelapor
- Dashboard personal ringkasan laporan
- **Buat Laporan Kebersihan** (Drag & drop / kamera smartphone, pilih lokasi ruangan, kategori, urgensi, deskripsi, preview foto)
- **Riwayat Laporan** (Desktop table, mobile card view, filter status, search lokasi/ID)
- **Detail Laporan & Status Timeline** (Menunggu → Diproses → Ditangani)
- Profil akun & edit informasi kontak

### 2. PETUGAS KEBERSIHAN (STAFF)
- Dashboard operasional & peringatan laporan mendesak (*Urgent*)
- Daftar antrean pekerjaan pembersihan fasilitas
- Detail laporan lengkap (foto bukti, lokasi, pelapor, waktu)
- Ubah status: **[Mulai Proses]** (menjadi Diproses) & **[Selesaikan]** (menjadi Ditangani) dengan modal konfirmasi dan catatan lapangan
- Profil petugas & divisi area shift

### 3. ADMINISTRATOR (ADMIN)
- Dashboard monitoring & analitik sistem (Grafik distribusi status, tren mingguan, area paling sering bermasalah)
- Manajemen seluruh laporan (Audit terpusat & admin status override)
- **Manajemen Pengguna** (Tambah pengguna baru, edit, filter role, aktivasi/nonaktifkan akun)
- **Data Petugas Kebersihan** (Pantau beban kerja tugas per petugas, shift area, kontak operasional)
- Profil admin & utilitas reset data simulasi SDLC

---

## ⚡ Akun Demo & Fast Role Switcher (Prototype SDLC)

Tersedia bar navigasi demo di bagian atas layar (*SDLC Fast Switcher*) serta tombol preset 1-klik di halaman Login untuk mempermudah evaluasi:

| Peran (Role) | Email Login | Username | Password |
| :--- | :--- | :--- | :--- |
| **Pelapor (User)** | `user@kebersihan.id` | `budi_santoso` | `password123` |
| **Petugas (Staff)** | `staff@kebersihan.id` | `rudi_petugas` | `password123` |
| **Admin** | `admin@kebersihan.id` | `admin_utama` | `password123` |

---

## 📁 Struktur Arsitektur Frontend

```text
src/
├── api/                   # Service layer REST API
│   ├── axiosClient.js     # Axios instance, baseURL, JWT interceptors
│   ├── authApi.js         # Autentikasi & profil
│   ├── reportApi.js       # CRUD & status laporan
│   ├── userApi.js         # Manajemen pengguna
│   ├── staffApi.js        # Operasional petugas
│   └── adminApi.js        # Statistik & analitik admin
├── mock/                  # Persistent Local Storage database simulasi
│   ├── initialData.js     # Mock dataset realistis awal
│   └── mockStorage.js     # Engine simulasi CRUD async
├── context/               # State global modular
│   ├── AuthContext.jsx    # Session & fast demo role switch
│   └── ToastContext.jsx   # Toast notifications UI
├── components/            # Reusable UI Primitives
│   ├── layout/            # AppLayout, Navbar, Sidebar, MobileDrawer, PublicLayout
│   └── ui/                # Button, Input, Modal, Badge, StatusTimeline, ImageUpload, SimpleChart...
├── pages/
│   ├── public/            # LandingPage, LoginPage, RegisterPage
│   ├── user/              # UserDashboard, CreateReportPage, UserReportsPage, UserReportDetailPage, UserProfilePage
│   ├── staff/             # StaffDashboard, StaffReportsPage, StaffReportDetailPage, StaffProfilePage
│   ├── admin/             # AdminDashboard, AdminReportsPage, AdminReportDetailPage, AdminUsersPage, AdminStaffPage, AdminProfilePage
│   └── error/             # ForbiddenPage (403), NotFoundPage (404)
├── routes/                # ProtectedRoute, RoleBasedRoute, AppRoutes
└── utils/                 # Formatters & Constants
```

---

## 🔌 Integrasi dengan Spring Boot REST API

Ketika backend Spring Boot telah siap:
1. Buka file `.env`
2. Ubah `VITE_USE_MOCK_API=false`
3. Sesuaikan `VITE_API_BASE_URL=http://localhost:8080/api`

Arsitektur service layer telah dirancang 100% decoupling sehingga komponen UI tidak perlu dimodifikasi sama sekali saat beralih dari mode prototype ke live Spring Boot API.

---

## 🛠️ Cara Menjalankan

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev

# 4. Build produksi
npm run build
```
