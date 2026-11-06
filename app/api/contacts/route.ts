import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getContacts, getBusinessHours, saveContact } from '@/lib/repositories';

export async function GET() {
  try {
    const contacts = await getContacts();
    const businessHours = await getBusinessHours();
    return NextResponse.json({ contacts, businessHours });
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('contacts');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const contact = await saveContact(data);
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
