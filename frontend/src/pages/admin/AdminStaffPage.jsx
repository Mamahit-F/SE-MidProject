import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  Search,
  Phone,
  Building,
  Edit2,
  Power,
  Mail,
  User,
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import { reportApi } from '../../api/reportApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal, ConfirmationModal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ROLES, REPORT_STATUS } from '../../utils/constants';

export const AdminStaffPage = () => {
  const { success, error: toastError } = useToast();

  const [staffList, setStaffList] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: ROLES.STAFF,
    phone: '',
    department: 'Divisi Kebersihan Gedung',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [staffData, allReports] = await Promise.all([
        userApi.getUsers({ role: ROLES.STAFF, search: searchQuery }),
        reportApi.getAll(),
      ]);
      setStaffList(staffData || []);
      setReports(allReports || []);
    } catch (err) {
      console.error('Failed to load staff list:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const getStaffHandledCount = (staffId) => {
    return reports.filter((r) => r.assignedStaffId === staffId).length;
  };

  const getStaffResolvedCount = (staffId) => {
    return reports.filter(
      (r) => r.assignedStaffId === staffId && r.status === REPORT_STATUS.DITANGANI
    ).length;
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      role: ROLES.STAFF,
      phone: '',
      department: 'Divisi Kebersihan Gedung A & B',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      username: staff.username,
      email: staff.email,
      role: ROLES.STAFF,
      phone: staff.phone || '',
      department: staff.department || '',
    });
    setEditModalOpen(true);
  };

  const handleOpenToggle = (staff) => {
    setSelectedStaff(staff);
    setToggleModalOpen(true);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username) {
      toastError('Form Belum Lengkap', 'Harap isi semua field wajib.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userApi.create({ ...formData, role: ROLES.STAFF });
      success('Petugas Ditambahkan', `Petugas ${formData.name} berhasil didaftarkan.`);
      setAddModalOpen(false);
      fetchData();
    } catch (err) {
      toastError('Gagal Menambahkan Petugas', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    setIsSubmitting(true);
    try {
      await userApi.update(selectedStaff.id, formData);
      success('Data Petugas Diperbarui', `Informasi untuk ${formData.name} berhasil disimpan.`);
      setEditModalOpen(false);
      fetchData();
    } catch (err) {
      toastError('Gagal Memperbarui', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedStaff) return;

    setIsSubmitting(true);
    try {
      const updated = await userApi.toggleStatus(selectedStaff.id);
      success(
        'Status Petugas Diubah',
        `Akun petugas ${selectedStaff.name} kini ${updated.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`
      );
      setToggleModalOpen(false);
      fetchData();
    } catch (err) {
      toastError('Gagal Mengubah Status', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Petugas Kebersihan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola petugas operasional dan pantau beban kerja penanganan fasilitas
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={handleOpenAdd}
          className="bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          Tambah Petugas Baru
        </Button>
      </div>

      {/* Search Input Card */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama petugas, divisi, email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Staff Grid Cards */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <TableSkeleton rows={4} cols={5} />
        </div>
      ) : staffList.length === 0 ? (
        <EmptyState
          title="Belum Ada Petugas Kebersihan"
          description="Tambahkan data petugas kebersihan pertama untuk mulai mendistribusikan laporan."
          actionText="Tambah Petugas"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staffList.map((staff) => {
            const handled = getStaffHandledCount(staff.id);
            const resolved = getStaffResolvedCount(staff.id);

            return (
              <Card key={staff.id} className="overflow-hidden hover:border-teal-300 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'}
                        alt={staff.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{staff.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">@{staff.username}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        staff.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {staff.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{staff.department || 'Divisi Kebersihan Umum'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{staff.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                  </div>

                  {/* Performance stats mini box */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Ditugaskan</p>
                      <p className="text-sm font-bold text-slate-900">{handled} Laporan</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700">Tuntas</p>
                      <p className="text-sm font-bold text-emerald-700">{resolved} Selesai</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleOpenEdit(staff)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={staff.status === 'ACTIVE' ? 'ghost' : 'secondary'}
                      size="sm"
                      icon={Power}
                      onClick={() => handleOpenToggle(staff)}
                      className={
                        staff.status === 'ACTIVE'
                          ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                          : 'text-emerald-600'
                      }
                    >
                      {staff.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Add Staff */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Petugas Kebersihan Baru"
        subtitle="Daftarkan akun petugas operasional gedung baru"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <Input
            label="Nama Lengkap Petugas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Dedi Setiawan"
            required
            icon={User}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="dedi_petugas"
              required
            />
            <Input
              label="Alamat Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="dedi@kebersihan.id"
              required
              icon={Mail}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nomor Telepon / WA"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              icon={Phone}
            />
            <Input
              label="Divisi / Area Shift"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Divisi Gedung A & C"
              icon={Building}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              Simpan Petugas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Staff */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Data Petugas"
        subtitle={`Perbarui informasi akun ${selectedStaff?.name}`}
      >
        <form onSubmit={handleUpdateStaff} className="space-y-4">
          <Input
            label="Nama Lengkap Petugas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            icon={User}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nomor Telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
            />
            <Input
              label="Divisi / Area Shift"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              icon={Building}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Toggle Status */}
      <ConfirmationModal
        isOpen={toggleModalOpen}
        onClose={() => setToggleModalOpen(false)}
        onConfirm={handleConfirmToggle}
        isLoading={isSubmitting}
        title={
          selectedStaff?.status === 'ACTIVE'
            ? 'Nonaktifkan Petugas?'
            : 'Aktifkan Kembali Petugas?'
        }
        message={`Apakah Anda yakin ingin ${
          selectedStaff?.status === 'ACTIVE' ? 'menonaktifkan' : 'mengaktifkan kembali'
        } akun petugas atas nama ${selectedStaff?.name}?`}
        confirmText={
          selectedStaff?.status === 'ACTIVE' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'
        }
        variant={selectedStaff?.status === 'ACTIVE' ? 'danger' : 'success'}
      />
    </div>
  );
};
