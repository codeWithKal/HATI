import { NextResponse } from 'next/server';
import { requireUserManagerApi, requireSuperAdminApi } from '@/lib/auth';
import { findUser, removeUser, updateUser } from '@/lib/user-management';
import { removeAvatar } from '@/lib/avatar-storage';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  const { id } = await params;
  const user = await findUser(id);
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'User not found.' }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  try {
    const { id } = await params;
    const user = await updateUser(access.user!, id, await request.json());
    return NextResponse.json({ user });
  } catch (error: any) {
    const message = error.message || 'Unable to update account.';
    const status = /permission|role|Super Admin|own role|Admins may only/i.test(message) ? 403 : /not found/i.test(message) ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const access = await requireSuperAdminApi();
  if (access.response) return access.response;
  try {
    const { id } = await params;
    const current = await findUser(id);
    if (!current) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    await removeUser(access.user!, id);
    await removeAvatar(current.profileImage).catch(() => undefined);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const message = error.message || 'Unable to delete account.';
    return NextResponse.json({ error: message }, { status: /Super Admin|delete your own/i.test(message) ? 403 : 400 });
  }
}
