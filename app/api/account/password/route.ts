import { NextResponse } from 'next/server';
import { changeOwnPassword } from '@/lib/user-management';
import { createSessionToken, getAdminSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const { currentPassword, newPassword, confirmPassword } = await request.json();
    if (!newPassword || newPassword !== confirmPassword) return NextResponse.json({ error: 'New passwords do not match.' }, { status: 400 });
    const updated = await changeOwnPassword(user, String(currentPassword || ''), String(newPassword));
    const response = NextResponse.json({ user: updated, message: 'Password updated.' });
    if (updated) setSessionCookie(response, createSessionToken(updated));
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update password.' }, { status: 400 });
  }
}
