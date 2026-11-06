import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getTenders, getTenderInfo, saveTender } from '@/lib/repositories';

export async function GET() {
  try {
    const tenders = await getTenders();
    const tenderInfo = await getTenderInfo();
    return NextResponse.json({ tenders, tenderInfo });
  } catch (error: any) {
    console.error('Error fetching tenders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('tenders');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const tender = await saveTender(data);
    return NextResponse.json(tender, { status: 201 });
  } catch (error: any) {
    console.error('Error saving tender:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
