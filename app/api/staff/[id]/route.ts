import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveStaff, deleteStaff } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('staff');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const member = await saveStaff({ ...data, id });
    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('staff');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteStaff(id);
    return NextResponse.json({ success: true, message: 'Staff member deleted' });
  } catch (error: any) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
