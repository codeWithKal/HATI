import { NextResponse } from 'next/server';
import { getAdminSession, requireAdminApi } from '@/lib/auth';
import { updateApplicationNote } from '@/lib/job-applications';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  const { id, noteId } = await params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(noteId)) return NextResponse.json({ error: 'Invalid note reference.' }, { status: 400 });
  const actor = await getAdminSession();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  try {
    await updateApplicationNote(actor, id, noteId, String((await request.json()).body || ''));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update note.' }, { status: 400 });
  }
}
