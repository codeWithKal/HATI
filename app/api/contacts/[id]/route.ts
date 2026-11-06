import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveContact, deleteContact } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('contacts');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const contact = await saveContact({ ...data, id });
    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('contacts');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteContact(id);
    return NextResponse.json({ success: true, message: 'Contact deleted' });
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
