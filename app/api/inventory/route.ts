import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getInventory, saveInventory } from '@/lib/repositories';

export async function GET() {
  try {
    const inventory = await getInventory();
    return NextResponse.json(inventory);
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('inventory');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const item = await saveInventory(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('Error saving inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
