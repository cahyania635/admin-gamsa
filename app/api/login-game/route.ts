import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// 1. Buat variabel header CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 2. Tambahkan header di OPTIONS (Preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Username dan password wajib diisi!' },
        { status: 400, headers: corsHeaders } // Tambahkan header disini
      );
    }

    const database = getDB();
    const snapshot = await database.ref('users/' + username).once('value');

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const isMatch = userData.password ? await bcrypt.compare(password, userData.password) : false;

      if (isMatch) {
        return NextResponse.json({
          status: 'success',
          message: 'Login Berhasil',
          data: {
            nama: userData.nama ?? 'Siswa',
            no_absen: username,
          },
        }, { headers: corsHeaders }); // Tambahkan header disini
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Password Salah!',
        }, { headers: corsHeaders }); // Tambahkan header disini
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Nomor Absen tidak ditemukan!',
      }, { headers: corsHeaders }); // Tambahkan header disini
    }
  } catch (error) {
    console.error('Login game error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Terjadi kesalahan server' },
      { status: 500, headers: corsHeaders } // Tambahkan header disini
    );
  }
}