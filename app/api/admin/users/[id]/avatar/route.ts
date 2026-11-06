import { NextResponse } from 'next/server';
import { requireUserManagerApi } from '@/lib/auth';
import { removeAvatar, saveAvatar } from '@/lib/avatar-storage';
import { findUser, setUserImage } from '@/lib/user-management';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  let newImage: string | null = null;
  let persisted = false;
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 2.2 * 1024 * 1024) return NextResponse.json({ error: 'Choose an image smaller than 2 MB.' }, { status: 413 });
    const { id } = await params;
    const form = await request.formData();
    const file = form.get('avatar');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select an image file.' }, { status: 400 });
    newImage = await saveAvatar(file);
    const oldImage = await setUserImage(access.user!, id, newImage);
    persisted = true;
    await removeAvatar(oldImage).catch(() => undefined);
    return NextResponse.json({ user: await findUser(id) });
  } catch (error: any) {
    if (newImage && !persisted) await removeAvatar(newImage);
    const message = error.message || 'Image upload failed.';
    return NextResponse.json({ error: message }, { status: /permission|manage/i.test(message) ? 403 : 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  try {
    const { id } = await params;
    const oldImage = await setUserImage(access.user!, id, null);
    await removeAvatar(oldImage);
    return NextResponse.json({ user: await findUser(id) });
  } catch (error: any) {
    const message = error.message || 'Unable to remove image.';
    return NextResponse.json({ error: message }, { status: /permission|manage/i.test(message) ? 403 : 400 });
  }
}
