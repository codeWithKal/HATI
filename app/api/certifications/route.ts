import { NextResponse } from 'next/server';
import { getCertifications } from '@/lib/repositories';

export async function GET() {
  try {
    const certs = await getCertifications();
    return NextResponse.json(certs);
  } catch (error: any) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
