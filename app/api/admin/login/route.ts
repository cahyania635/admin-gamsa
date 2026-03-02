import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi!' },
        { status: 400 }
      );
    }

    const database = getDB();
    const snapshot = await database.ref('admin').once('value');
    const adminData = snapshot.val();

    if (
      adminData &&
      adminData.username === username &&
      adminData.password === password
    ) {
      const token = Buffer.from(
        JSON.stringify({ user: 'admin', ts: Date.now() })
      ).toString('base64');

      return NextResponse.json({
        success: true,
        message: 'Login berhasil!',
        token,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Username atau Password salah!' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
