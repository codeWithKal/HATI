import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { saveContentImage } from '@/lib/content-image-storage';

const permissions = new Set(['products', 'staff', 'news']);

export async function POST(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!permissions.has(section)) return NextResponse.json({ error: 'Unsupported image section.' }, { status: 404 });
  const unauthorized = await requireAdminApi(section);
  if (unauthorized) return unauthorized;
  try {
    const form = await request.formData();
    const file = form.get('imageFile');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
    return NextResponse.json({ image: await saveContentImage(file) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to upload image.' }, { status: 400 });
  }
}
