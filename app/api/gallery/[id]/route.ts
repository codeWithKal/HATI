import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveGalleryItem, deleteGalleryItem } from '@/lib/repositories';
import { removeGalleryUpload, saveGalleryImage } from '@/lib/gallery-storage';
import { query } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('gallery');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    if (request.headers.get('content-type')?.includes('application/json')) {
      const data = await request.json();
      const current = await query<RowDataPacket[]>('SELECT image, category FROM gallery WHERE id = ?', [id]);
      if (!current[0]) return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
      const item = await saveGalleryItem({ id, image: data.image || current[0].image, category: data.category || current[0].category });
      if (item.image !== current[0].image) {
        const references = await query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM gallery WHERE image = ?', [current[0].image]);
        if (!Number(references[0].total)) await removeGalleryUpload(current[0].image);
      }
      return NextResponse.json(item);
    }
    const form = await request.formData();
    const file = form.get('imageFile');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to replace the current one.' }, { status: 400 });
    const current = await query<RowDataPacket[]>('SELECT image, category FROM gallery WHERE id = ?', [id]);
    if (!current[0]) return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
    const image = await saveGalleryImage(file);
    try {
      const item = await saveGalleryItem({ id, image, category: String(form.get('category') || current[0].category) });
      const references = await query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM gallery WHERE image = ?', [current[0].image]);
      if (!Number(references[0].total)) await removeGalleryUpload(current[0].image);
      return NextResponse.json(item);
    } catch (error) {
      await removeGalleryUpload(image);
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to replace gallery image.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('gallery');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const current = await query<RowDataPacket[]>('SELECT image FROM gallery WHERE id = ?', [id]);
    await deleteGalleryItem(id);
    if (current[0]) {
      const references = await query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM gallery WHERE image = ?', [current[0].image]);
      if (!Number(references[0].total)) await removeGalleryUpload(current[0].image);
    }
    return NextResponse.json({ success: true, message: 'Gallery item deleted' });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
