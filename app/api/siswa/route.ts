import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET — List semua siswa
export async function GET() {
  try {
    const database = getDB();
    const snapshot = await database.ref('users').once('value');
    const data = snapshot.val();

    if (!data) {
      return NextResponse.json({ siswa: [] });
    }

    const siswa = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    return NextResponse.json({ siswa });
  } catch (error) {
    console.error('Get siswa error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data siswa' },
      { status: 500 }
    );
  }
}

// POST — Tambah siswa baru
export async function POST(request: NextRequest) {
  try {
    const { no_absen, nama, password } = await request.json();

    if (!no_absen || !nama || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi (no_absen, nama, password)' },
        { status: 400 }
      );
    }

    const database = getDB();
    const existing = await database.ref('users/' + no_absen).once('value');
    if (existing.exists()) {
      return NextResponse.json(
        { error: 'Nomor absen sudah terdaftar!' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await database.ref('users/' + no_absen).set({
      no_absen,
      nama,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'Siswa berhasil ditambahkan', data: { no_absen, nama } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create siswa error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan siswa' },
      { status: 500 }
    );
  }
}
