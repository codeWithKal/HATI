import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getGallery, getGalleryStats, saveGalleryItem } from '@/lib/repositories';
import { removeGalleryUpload, saveGalleryImage } from '@/lib/gallery-storage';
import { query } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';

export async function GET() {
  try {
    const gallery = await getGallery();
    const stats = await getGalleryStats();
    return NextResponse.json({ gallery, stats });
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('gallery');
  if (unauthorized) return unauthorized;
  try {
    if (request.headers.get('content-type')?.includes('application/json')) {
      const data = await request.json();
      if (typeof data.image !== 'string' || !data.image.trim() || data.image.length > 500) throw new Error('A valid image path is required.');
      const item = await saveGalleryItem(data);
      return NextResponse.json(item, { status: 201 });
    }
    const form = await request.formData();
    const file = form.get('imageFile');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
    const image = await saveGalleryImage(file);
    try {
      const item = await saveGalleryItem({ image, category: String(form.get('category') || 'projects') });
      return NextResponse.json(item, { status: 201 });
    } catch (error) {
      await removeGalleryUpload(image);
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to save gallery image.' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApi('gallery');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const id = Number(data.id);
    const category = String(data.category || '').trim();
    if (!Number.isInteger(id) || id < 1 || category.length > 100) throw new Error('Choose a valid category.');
    const rows = await query<RowDataPacket[]>('SELECT image FROM gallery WHERE id = ?', [id]);
    if (!rows[0]) return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
    await saveGalleryItem({ id, image: rows[0].image, category: category || 'projects' });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update gallery image.' }, { status: 400 });
  }
}
