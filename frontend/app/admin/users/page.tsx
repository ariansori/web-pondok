'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  Check,
  Power,
  RefreshCw,
  AlertCircle,
  Key,
} from 'lucide-react';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { getStoredAuth, isSuperAdmin } from '@/lib/auth';

interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: 'superadmin' | 'admin';
  email_verified?: boolean | number;
  two_factor_enabled?: boolean | number;
  aktif?: boolean | number;
  created_at?: string;
}

const FALLBACK_USERS: AdminUser[] = [
  {
    id: 1,
    nama: 'Super Admin Al-Fatich',
    email: 'pondokputraaf@gmail.com',
    role: 'superadmin',
    email_verified: true,
    two_factor_enabled: true,
    aktif: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    nama: 'Admin Redaksi Konten',
    email: 'admin@alfatich.ponpes.id',
    role: 'admin',
    email_verified: true,
    two_factor_enabled: true,
    aktif: true,
    created_at: '2026-01-15T08:30:00Z',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(FALLBACK_USERS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resetPassUser, setResetPassUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'admin' as 'superadmin' | 'admin',
  });

  const [newPassword, setNewPassword] = useState('');

  const currentUser = getStoredAuth();
  const isSuper = isSuperAdmin(currentUser || undefined);

  useEffect(() => {
    fetchUsers()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setUsers(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ nama: '', email: '', password: '', role: 'admin' });
    setModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ nama: user.nama, email: user.email, password: '', role: user.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingUser) {
      try {
        await updateUser(editingUser.id, { nama: formData.nama, role: formData.role });
      } catch {}
      setUsers(prev =>
        prev.map(u => u.id === editingUser.id ? { ...u, nama: formData.nama, role: formData.role } : u)
      );
    } else {
      if (!formData.password) { setLoading(false); return; }
      let newUser: AdminUser = {
        id: Date.now(),
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        email_verified: true,
        two_factor_enabled: true,
        aktif: true,
        created_at: new Date().toISOString(),
      };
      try {
        const res = await createUser(formData);
        if (res?.data?.id) newUser = { ...newUser, id: res.data.id };
      } catch {}
      setUsers(prev => [newUser, ...prev]);
    }
    setLoading(false);
    setModalOpen(false);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = !Boolean(user.aktif);
    try { await updateUser(user.id, { aktif: newStatus }); } catch {}
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, aktif: newStatus } : u));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser || !newPassword) return;
    setLoading(true);
    try { await updateUser(resetPassUser.id, { password: newPassword }); } catch {}
    setLoading(false);
    setResetPassUser(null);
    setNewPassword('');
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.id === 1) { alert('Akun Superadmin Utama tidak dapat dihapus.'); return; }
    if (!confirm(`Hapus akun "${user.nama}" secara permanen?`)) return;
    try { await deleteUser(user.id); } catch {}
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const filtered = users.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isSuper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Dibatasi</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Halaman Manajemen Admin hanya dapat diakses oleh <strong>Super Admin</strong>.
          Silakan hubungi Super Admin untuk mendapatkan akses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Manajemen Admin & Hak Akses
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola akun admin, atur peran, dan kontrol hak akses CMS.{' '}
            <span className="text-amber-600 font-bold">Fitur eksklusif Super Admin.</span>
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Tambah Admin Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Admin', value: users.length, icon: Users, color: 'text-blue-700 bg-blue-50' },
          { label: 'Super Admin', value: users.filter(u => u.role === 'superadmin').length, icon: ShieldCheck, color: 'text-amber-700 bg-amber-50' },
          { label: 'Admin Aktif', value: users.filter(u => Boolean(u.aktif)).length, icon: UserCheck, color: 'text-green-700 bg-green-50' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-[11px] text-gray-500 font-bold uppercase">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau email admin..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-green-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Peran</th>
                <th className="px-5 py-4">Status Akun</th>
                <th className="px-5 py-4">2FA</th>
                <th className="px-5 py-4">Bergabung</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50/60 transition-colors ${!user.aktif ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        user.role === 'superadmin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.nama}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Mail size={9} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit ${
                      user.role === 'superadmin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'superadmin' ? <ShieldCheck size={10} /> : <UserCheck size={10} />}
                      {user.role === 'superadmin' ? 'Super Admin' : 'Admin Konten'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      Boolean(user.aktif) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {Boolean(user.aktif) ? '● Aktif' : '○ Nonaktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-bold flex items-center gap-1 ${
                      Boolean(user.two_factor_enabled) ? 'text-green-700' : 'text-gray-400'
                    }`}>
                      {Boolean(user.two_factor_enabled) ? <Check size={11} /> : <X size={11} />}
                      {Boolean(user.two_factor_enabled) ? '2FA Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '-'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => { setResetPassUser(user); setNewPassword(''); }}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        title="Reset Password"
                      >
                        <Key size={14} />
                      </button>
                      {user.id !== 1 && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              Boolean(user.aktif)
                                ? 'text-gray-500 hover:bg-yellow-50 hover:text-yellow-700'
                                : 'text-gray-400 hover:bg-green-50 hover:text-green-700'
                            }`}
                            title={Boolean(user.aktif) ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Create / Edit ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {editingUser ? 'Edit Akun Admin' : 'Tambah Admin Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama lengkap admin"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Mail size={11} /> Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@aktif.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              )}

              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Lock size={11} /> Password Awal *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Peran / Role *</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as 'superadmin' | 'admin' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-600"
                >
                  <option value="admin">Admin Konten</option>
                  <option value="superadmin">Super Admin (Akses Penuh)</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  ⚠️ Super Admin memiliki akses penuh termasuk manajemen akun admin lain.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  {loading ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Buat Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Key size={18} className="text-green-700" />
                Reset Password
              </h3>
              <button onClick={() => setResetPassUser(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-yellow-800">
              <p className="font-bold">Mereset password untuk:</p>
              <p>{resetPassUser.nama} — {resetPassUser.email}</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password Baru *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Password baru minimal 8 karakter"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold flex items-center gap-2"
                >
                  {loading ? <RefreshCw size={13} className="animate-spin" /> : <Lock size={13} />}
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
