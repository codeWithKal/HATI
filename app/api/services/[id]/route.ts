import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveService, deleteService } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('services');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const service = await saveService({ ...data, id });
    return NextResponse.json(service);
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('services');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteService(id);
    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
