import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { findUser, updateOwnProfile } from '@/lib/user-management';

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  return NextResponse.json({ user: await findUser(user.id) });
}

export async function PATCH(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const updated = await updateOwnProfile(user, await request.json());
    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update profile.' }, { status: error.code === 'ER_DUP_ENTRY' ? 409 : 400 });
  }
}
