import { NextResponse } from 'next/server';
import { getAdminSession, requireAdminApi } from '@/lib/auth';
import { addApplicationNote } from '@/lib/job-applications';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Invalid application.' }, { status: 400 });
  const actor = await getAdminSession();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    const body = String((await request.json()).body || '').trim();
    await addApplicationNote(actor, id, body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to save note.' }, { status: 400 });
  }
}
