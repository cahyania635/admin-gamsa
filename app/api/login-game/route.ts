import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Username dan password wajib diisi!' },
        { status: 400 }
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
        });
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Password Salah!',
        });
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Nomor Absen tidak ditemukan!',
      });
    }
  } catch (error) {
    console.error('Login game error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
