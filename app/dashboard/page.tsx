'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [totalSiswa, setTotalSiswa] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/siswa')
      .then((res) => res.json())
      .then((data) => {
        setTotalSiswa(data.siswa?.length || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Selamat datang di panel admin GAMSA</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Siswa Card */}
        <div className="group relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/10 rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Total Siswa</p>
            <p className="text-3xl font-bold text-white mt-1">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-slate-700/50 rounded-lg animate-pulse"></span>
              ) : (
                totalSiswa
              )}
            </p>
          </div>
        </div>

        {/* Firebase Status Card */}
        <div className="group relative bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Database</p>
            <p className="text-xl font-bold text-white mt-1">Firebase RT</p>
            <p className="text-emerald-400 text-xs mt-1">● Connected</p>
          </div>
        </div>

        {/* API Status Card */}
        <div className="group relative bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/10 rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Game API</p>
            <p className="text-xl font-bold text-white mt-1">/api/login-game</p>
            <p className="text-violet-400 text-xs mt-1">● Active</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/dashboard/siswa"
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Kelola Data Siswa</p>
              <p className="text-slate-400 text-sm">Tambah, edit, atau hapus data siswa</p>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 bg-slate-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-300 font-medium">Pengaturan</p>
              <p className="text-slate-500 text-sm">Segera hadir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
