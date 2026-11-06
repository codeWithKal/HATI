import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { removeAvatar, saveAvatar } from '@/lib/avatar-storage';
import { findUser, setUserImage } from '@/lib/user-management';

export async function POST(request: Request) {
  const actor = await getAdminSession();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  let newImage: string | null = null;
  let persisted = false;
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 2.2 * 1024 * 1024) return NextResponse.json({ error: 'Choose an image smaller than 2 MB.' }, { status: 413 });
    const form = await request.formData();
    const file = form.get('avatar');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select an image file.' }, { status: 400 });
    newImage = await saveAvatar(file);
    const oldImage = await setUserImage(actor, actor.id, newImage);
    persisted = true;
    await removeAvatar(oldImage).catch(() => undefined);
    return NextResponse.json({ user: await findUser(actor.id) });
  } catch (error: any) {
    if (newImage && !persisted) await removeAvatar(newImage);
    return NextResponse.json({ error: error.message || 'Image upload failed.' }, { status: 400 });
  }
}

export async function DELETE() {
  const actor = await getAdminSession();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const oldImage = await setUserImage(actor, actor.id, null);
    await removeAvatar(oldImage);
    return NextResponse.json({ user: await findUser(actor.id) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to remove image.' }, { status: 400 });
  }
}
