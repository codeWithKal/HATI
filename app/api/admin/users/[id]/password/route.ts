import { NextResponse } from 'next/server';
import { requireUserManagerApi } from '@/lib/auth';
import { resetUserPassword } from '@/lib/user-management';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  try {
    const { id } = await params;
    const { password, confirmPassword } = await request.json();
    if (!password || password !== confirmPassword) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    await resetUserPassword(access.user!, id, String(password));
    return NextResponse.json({ success: true, message: 'Password reset. Existing sessions for this user are now invalid.' });
  } catch (error: any) {
    const message = error.message || 'Unable to reset password.';
    return NextResponse.json({ error: message }, { status: /permission|only/i.test(message) ? 403 : 400 });
  }
}
