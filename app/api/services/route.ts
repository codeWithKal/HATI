import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getServices, saveService } from '@/lib/repositories';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('services');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const service = await saveService(data);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error('Error saving service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
