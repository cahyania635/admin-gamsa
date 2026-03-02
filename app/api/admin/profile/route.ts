import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/firebase-admin';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

// GET — Ambil data admin (tanpa password)
export async function GET() {
  try {
    const database = getDB();
    const snapshot = await database.ref('admin').once('value');
    const adminData = snapshot.val();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Data admin tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: adminData.username || '',
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data admin' },
      { status: 500 }
    );
  }
}

// PUT — Update username dan/atau password admin
export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newUsername, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Password saat ini wajib diisi untuk verifikasi' },
        { status: 400 }
      );
    }

    const database = getDB();
    const snapshot = await database.ref('admin').once('value');
    const adminData = snapshot.val();

    if (!adminData) {
      return NextResponse.json(
        { error: 'Data admin tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify current password — support both hashed and plain text (migration)
    let passwordValid = false;
    if (adminData.password.startsWith('$2a$') || adminData.password.startsWith('$2b$')) {
      passwordValid = await bcrypt.compare(currentPassword, adminData.password);
    } else {
      passwordValid = adminData.password === currentPassword;
    }

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Password saat ini salah!' },
        { status: 401 }
      );
    }

    // Build update data
    const updateData: Record<string, string> = {};

    if (newUsername && newUsername.trim()) {
      updateData.username = newUsername.trim();
    }

    if (newPassword && newPassword.trim()) {
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang diubah' },
        { status: 400 }
      );
    }

    // If only username changed, also hash the current plain password for migration
    if (!updateData.password && !(adminData.password.startsWith('$2a$') || adminData.password.startsWith('$2b$'))) {
      updateData.password = await bcrypt.hash(adminData.password, 10);
    }

    await database.ref('admin').update(updateData);

    return NextResponse.json({
      message: 'Profil admin berhasil diupdate',
      data: { username: updateData.username || adminData.username },
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate profil admin' },
      { status: 500 }
    );
  }
}
