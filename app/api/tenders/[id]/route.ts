import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveTender, deleteTender } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('tenders');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const tender = await saveTender({ ...data, id });
    return NextResponse.json(tender);
  } catch (error: any) {
    console.error('Error updating tender:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('tenders');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteTender(id);
    return NextResponse.json({ success: true, message: 'Tender deleted' });
  } catch (error: any) {
    console.error('Error deleting tender:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
