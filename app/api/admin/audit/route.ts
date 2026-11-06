import { NextResponse } from 'next/server';
import { requireUserManagerApi } from '@/lib/auth';
import { listAuditEvents } from '@/lib/user-management';

export async function GET() {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  return NextResponse.json({ events: await listAuditEvents(100) });
}
