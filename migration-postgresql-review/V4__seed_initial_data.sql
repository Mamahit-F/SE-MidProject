-- Seed Users (password: password123 for all dev accounts)
INSERT INTO users (id, full_name, username, email, password, role, status, phone, department, avatar, created_at)
VALUES 
(1, 'Budi Santoso', 'budi_santoso', 'user@kebersihan.id', '$2a$10$IGw6.z.z77k5b2WBZtEuJu5QCW/GoEVcNYiXc/LdLKDTcVNxxivwi', 'USER', 'ACTIVE', '081234567890', 'Fakultas Teknik / Mahasiswa', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', NOW()),
(2, 'Ani Wijaya', 'ani_wijaya', 'ani@kebersihan.id', '$2a$10$IGw6.z.z77k5b2WBZtEuJu5QCW/GoEVcNYiXc/LdLKDTcVNxxivwi', 'USER', 'ACTIVE', '081298765432', 'Fakultas Ekonomi / Dosen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', NOW()),
(3, 'Rudi Hermawan', 'rudi_petugas', 'staff@kebersihan.id', '$2a$10$IGw6.z.z77k5b2WBZtEuJu5QCW/GoEVcNYiXc/LdLKDTcVNxxivwi', 'STAFF', 'ACTIVE', '082155551234', 'Divisi Kebersihan Gedung A & B', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', NOW()),
(4, 'Agus Prasetyo', 'agus_petugas', 'staff2@kebersihan.id', '$2a$10$IGw6.z.z77k5b2WBZtEuJu5QCW/GoEVcNYiXc/LdLKDTcVNxxivwi', 'STAFF', 'ACTIVE', '082166667890', 'Divisi Kebersihan Gedung C & Luar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', NOW()),
(5, 'Super Administrator', 'admin_utama', 'admin@kebersihan.id', '$2a$10$IGw6.z.z77k5b2WBZtEuJu5QCW/GoEVcNYiXc/LdLKDTcVNxxivwi', 'ADMIN', 'ACTIVE', '081122334455', 'Biro Fasilitas & Manajemen Gedung', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', NOW());

-- Seed Sample Reports with all 5 status states
INSERT INTO reports (id, reporter_id, title, location, category, description, urgency, status, rejection_reason, notes, assigned_staff_id, created_at, approved_at, processed_at, resolved_at)
VALUES
(1, 1, 'Tumpahan Minuman & Sampah Plastik di Koridor', 'Gedung A - Lantai 2 (Ruang Kuliah A201 - A208)', 'Lobi & Koridor', 'Terdapat tumpahan kopi manis yang lengket di depan pintu masuk Ruang A204 dan beberapa gelas plastik berserakan.', 'HIGH', 'PENDING_VERIFICATION', NULL, NULL, NULL, NOW() - INTERVAL '2 hours', NULL, NULL, NULL),
(2, 2, 'Papan Tulis Penuh Coretan & Penghapus Berdebu', 'Gedung A - Lantai 3 (Laboratorium Komputer)', 'Ruang Kelas / Kuliah', 'Papan tulis di lab A302 belum dibersihkan dan penghapus sudah berdebu tebal.', 'MEDIUM', 'APPROVED', NULL, NULL, NULL, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours', NULL, NULL),
(3, 2, 'Wastafel Mampet & Genangan Air di Toilet Pria', 'Gedung C - Lantai 1 (Toilet Utama Pria & Wanita)', 'Toilet / Kamar Mandi', 'Wastafel nomor 2 tersumbat tisu dan air meluap hingga membasahi lantai toilet pria.', 'HIGH', 'PROCESSING', NULL, 'Petugas sedang membersihkan sumbatan wastafel dan mengeringkan lantai toilet.', 3, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', NULL),
(4, 1, 'Tempat Sampah Organik & Anorganik Penuh Meluap', 'Gedung B - Lantai 1 (Kantin & Area Terbuka)', 'Kantin / Food Court', 'Tempat sampah di area makan barat kantin sudah meluap karena jam makan siang.', 'MEDIUM', 'RESOLVED', NULL, 'Sudah disterilkan dengan disinfektan dan diganti kantong sampah tebal 60L.', 4, NOW() - INTERVAL '24 hours', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '22 hours', NOW() - INTERVAL '20 hours'),
(5, 1, 'Foto Tidak Jelas dan Lokasi Tidak Lengkap', 'Area Parkir Barat', 'Lainnya', 'Ada kotoran di sudut dekat parkir motor.', 'LOW', 'REJECTED', 'Foto tidak jelas dan deskripsi lokasi kurang spesifik untuk ditindaklanjuti petugas.', NULL, NULL, NOW() - INTERVAL '12 hours', NULL, NULL, NULL);

-- Seed Sample Report Images
INSERT INTO report_images (id, report_id, file_name, file_path, file_type, file_size, created_at)
VALUES
(1, 1, 'tumpahan_kopi.jpg', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80', 'image/jpeg', 358400, NOW() - INTERVAL '2 hours'),
(2, 2, 'papan_tulis.jpg', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80', 'image/jpeg', 421000, NOW() - INTERVAL '5 hours'),
(3, 3, 'wastafel_mampet.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80', 'image/jpeg', 512000, NOW() - INTERVAL '6 hours'),
(4, 4, 'tempat_sampah.jpg', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80', 'image/jpeg', 298000, NOW() - INTERVAL '24 hours'),
(5, 5, 'foto_buram.jpg', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80', 'image/jpeg', 180000, NOW() - INTERVAL '12 hours');

-- Synchronize PostgreSQL Identity Sequences after manual ID inserts
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('reports', 'id'), COALESCE((SELECT MAX(id) FROM reports), 1));
SELECT setval(pg_get_serial_sequence('report_images', 'id'), COALESCE((SELECT MAX(id) FROM report_images), 1));
