import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// PUT — Update data siswa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nama, password } = await request.json();

    const database = getDB();
    const snapshot = await database.ref('users/' + id).once('value');
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData: Record<string, string> = {};
    if (nama) updateData.nama = nama;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await database.ref('users/' + id).update(updateData);

    return NextResponse.json({
      message: 'Data siswa berhasil diupdate',
      data: { no_absen: id, ...updateData },
    });
  } catch (error) {
    console.error('Update siswa error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data siswa' },
      { status: 500 }
    );
  }
}

// DELETE — Hapus siswa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const database = getDB();
    const snapshot = await database.ref('users/' + id).once('value');
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    await database.ref('users/' + id).remove();

    return NextResponse.json({
      message: 'Siswa berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete siswa error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus siswa' },
      { status: 500 }
    );
  }
}
