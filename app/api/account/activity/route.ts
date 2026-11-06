import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { listOwnAuditEvents } from '@/lib/user-management';

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  return NextResponse.json({ events: await listOwnAuditEvents(user.id) });
}
