import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveInventory, deleteInventory } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('inventory');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const item = await saveInventory({ ...data, id });
    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('inventory');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteInventory(id);
    return NextResponse.json({ success: true, message: 'Inventory item deleted' });
  } catch (error: any) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
