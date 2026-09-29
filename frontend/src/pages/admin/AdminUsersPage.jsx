import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Power,
  Mail,
  User,
  Building,
  Phone,
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { RoleBadge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal, ConfirmationModal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateOnly } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

export const AdminUsersPage = () => {
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: ROLES.USER,
    phone: '',
    department: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers({
        role: roleFilter,
        search: searchQuery,
      });
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      role: ROLES.USER,
      phone: '',
      department: '',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      department: user.department || '',
    });
    setEditModalOpen(true);
  };

  const handleOpenToggle = (user) => {
    setSelectedUser(user);
    setToggleModalOpen(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username) {
      toastError('Validasi Gagal', 'Harap lengkapi semua field wajib.');
      return;
    }

    setIsSubmitting(true);
    try {
      await userApi.create(formData);
      success('Pengguna Ditambahkan', `Akun untuk ${formData.name} berhasil dibuat.`);
      setAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      toastError('Gagal Menambahkan', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await userApi.update(selectedUser.id, formData);
      success('Data Diperbarui', `Informasi akun ${formData.name} berhasil disimpan.`);
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toastError('Gagal Memperbarui', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const updated = await userApi.toggleStatus(selectedUser.id);
      success(
        'Status Akun Diubah',
        `Akun ${selectedUser.name} kini berstatus ${updated.status}.`
      );
      setToggleModalOpen(false);
      fetchUsers();
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
            Manajemen Pengguna Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data akun Pelapor, Petugas Kebersihan, dan Administrator
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={handleOpenAdd}
          className="bg-purple-600 hover:bg-purple-700 shadow-sm"
        >
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { key: 'ALL', label: 'Semua Role' },
                { key: ROLES.USER, label: 'Pelapor (User)' },
                { key: ROLES.STAFF, label: 'Petugas (Staff)' },
                { key: ROLES.ADMIN, label: 'Administrator' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRoleFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === tab.key
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, email, username..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Cari
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <TableSkeleton rows={5} cols={6} />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="Tidak Ada Pengguna Ditemukan"
          description="Tidak ada data pengguna yang sesuai dengan filter saat ini."
          actionText="Tambah Pengguna"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3">Pengguna</th>
                  <th scope="col" className="px-3 py-3.5">Kontak & Departemen</th>
                  <th scope="col" className="px-3 py-3.5">Peran (Role)</th>
                  <th scope="col" className="px-3 py-3.5">Status</th>
                  <th scope="col" className="px-3 py-3.5">Terdaftar</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-xs">
                      <p className="font-medium text-slate-800">{user.email}</p>
                      <p className="text-slate-500 mt-0.5">{user.department || user.phone || '-'}</p>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} size="sm" />
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-slate-400" />
                        )}
                        {user.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDateOnly(user.createdAt)}
                    </td>

                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleOpenEdit(user)}
                          title="Edit Pengguna"
                        >
                          Edit
                        </Button>
                        <Button
                          variant={user.status === 'ACTIVE' ? 'ghost' : 'secondary'}
                          size="sm"
                          icon={Power}
                          onClick={() => handleOpenToggle(user)}
                          className={user.status === 'ACTIVE' ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600'}
                          title={user.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {user.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Pengguna Baru"
        subtitle="Buat akun baru untuk Pelapor, Petugas Kebersihan, atau Admin"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Ahmad Faisal"
            required
            icon={User}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="ahmad_faisal"
              required
            />
            <Input
              label="Alamat Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmad@kebersihan.id"
              required
              icon={Mail}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Peran / Hak Akses"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: ROLES.USER, label: 'Pelapor (User)' },
                { value: ROLES.STAFF, label: 'Petugas Kebersihan (Staff)' },
                { value: ROLES.ADMIN, label: 'Super Administrator' },
              ]}
              required
            />
            <Input
              label="Nomor Telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              icon={Phone}
            />
          </div>

          <Input
            label="Departemen / Fakultas / Divisi"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Contoh: Biro Pemeliharaan Sarana"
            icon={Building}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Simpan Pengguna
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit User */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Data Pengguna"
        subtitle={`Perbarui informasi akun ${selectedUser?.name}`}
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input
            label="Nama Lengkap"
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
            <Select
              label="Peran / Hak Akses"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: ROLES.USER, label: 'Pelapor (User)' },
                { value: ROLES.STAFF, label: 'Petugas Kebersihan (Staff)' },
                { value: ROLES.ADMIN, label: 'Super Administrator' },
              ]}
              required
            />
          </div>

          <Input
            label="Departemen / Fakultas / Divisi"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            icon={Building}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmation Toggle Status */}
      <ConfirmationModal
        isOpen={toggleModalOpen}
        onClose={() => setToggleModalOpen(false)}
        onConfirm={handleConfirmToggleStatus}
        isLoading={isSubmitting}
        title={
          selectedUser?.status === 'ACTIVE'
            ? 'Nonaktifkan Akun Pengguna?'
            : 'Aktifkan Kembali Akun Pengguna?'
        }
        message={`Apakah Anda yakin ingin ${
          selectedUser?.status === 'ACTIVE' ? 'menonaktifkan' : 'mengaktifkan kembali'
        } akun atas nama ${selectedUser?.name}?`}
        confirmText={
          selectedUser?.status === 'ACTIVE' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'
        }
        variant={selectedUser?.status === 'ACTIVE' ? 'danger' : 'success'}
      />
    </div>
  );
};
