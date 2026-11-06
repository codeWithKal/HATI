import { NextResponse } from 'next/server';
import { getAdminSession, requireAdminApi } from '@/lib/auth';
import { getApplication, updateApplication } from '@/lib/job-applications';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Invalid application.' }, { status: 400 });
  const application = await getApplication(id);
  if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  return NextResponse.json({ application }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Invalid application.' }, { status: 400 });
  try {
    const actor = await getAdminSession();
    if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    const result = await updateApplication(actor, id, await request.json());
    return NextResponse.json({ application: result }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unable to update application.' }, { status: 400 });
  }
}
