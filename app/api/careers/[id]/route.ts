import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveCareer, deleteCareer } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('careers');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const career = await saveCareer({ ...data, id });
    return NextResponse.json(career);
  } catch (error: any) {
    console.error('Error updating career:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('careers');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteCareer(id);
    return NextResponse.json({ success: true, message: 'Career deleted' });
  } catch (error: any) {
    const status = /applications/.test(error.message || '') ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
