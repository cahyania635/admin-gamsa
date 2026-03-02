'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Siswa {
  id: string;
  no_absen: string;
  nama: string;
  password: string;
}

export default function SiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');
  const [formData, setFormData] = useState({ no_absen: '', nama: '', password: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Success message
  const [successMsg, setSuccessMsg] = useState('');

  async function fetchSiswa() {
    try {
      const res = await fetch('/api/siswa');
      const data = await res.json();
      setSiswaList(data.siswa || []);
    } catch {
      console.error('Failed to fetch siswa');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSiswa();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  function openAddModal() {
    setModalMode('add');
    setFormData({ no_absen: '', nama: '', password: '' });
    setFormError('');
    setShowModal(true);
  }

  function openEditModal(siswa: Siswa) {
    setModalMode('edit');
    setEditId(siswa.id);
    setFormData({ no_absen: siswa.no_absen, nama: siswa.nama, password: '' });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/siswa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Gagal menambah siswa');
          return;
        }
        setSuccessMsg('Siswa berhasil ditambahkan!');
      } else {
        const updateBody: Record<string, string> = { nama: formData.nama };
        if (formData.password) updateBody.password = formData.password;

        const res = await fetch(`/api/siswa/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || 'Gagal mengupdate siswa');
          return;
        }
        setSuccessMsg('Data siswa berhasil diupdate!');
      }
      setShowModal(false);
      fetchSiswa();
    } catch {
      setFormError('Terjadi kesalahan koneksi');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/siswa/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Siswa berhasil dihapus!');
        fetchSiswa();
      }
    } catch {
      console.error('Delete failed');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  }

  const filtered = siswaList.filter(
    (s) =>
      s.nama?.toLowerCase().includes(search.toLowerCase()) ||
      s.no_absen?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Data Siswa</h1>
          <p className="text-slate-400 mt-1">Kelola data siswa dari Firebase</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Siswa
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau no. absen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">No</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">No. Absen</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-slate-700/50 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-slate-500">
                        {search ? 'Tidak ada siswa yang cocok dengan pencarian' : 'Belum ada data siswa'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-white/5 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-mono font-medium">
                        {siswa.no_absen}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{siswa.nama}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm font-mono">{'•'.repeat(8)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(siswa)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(siswa.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02]">
            <p className="text-sm text-slate-500">
              Menampilkan {filtered.length} dari {siswaList.length} siswa
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'add' ? 'Tambah Siswa' : 'Edit Siswa'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">No. Absen</label>
                <input
                  type="text"
                  value={formData.no_absen}
                  onChange={(e) => setFormData({ ...formData, no_absen: e.target.value })}
                  disabled={modalMode === 'edit'}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan nomor absen"
                  required={modalMode === 'add'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Masukkan nama siswa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password {modalMode === 'edit' && <span className="text-slate-500">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Masukkan password"
                  required={modalMode === 'add'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/25 font-medium transition-all disabled:opacity-50"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hapus Siswa?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Siswa dengan No. Absen <span className="text-white font-mono font-medium">{deleteId}</span> akan dihapus permanen dari database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  {deleteLoading ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
