import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getCareers, getBenefits, saveCareer } from '@/lib/repositories';

export async function GET(request: Request) {
  try {
    let careers = await getCareers();
    const publicRequest = new URL(request.url).searchParams.get('public') === '1';
    if (publicRequest) {
      const today = new Date().toISOString().slice(0, 10);
      careers = careers.filter((career: any) => career.isActive && career.vacancyStatus === 'open' && (!career.applicationDeadline || career.applicationDeadline >= today));
    } else {
      const unauthorized = await requireAdminApi('careers');
      if (unauthorized) return unauthorized;
    }
    const benefits = await getBenefits();
    return NextResponse.json({ careers, benefits });
  } catch (error: any) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('careers');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const career = await saveCareer(data);
    return NextResponse.json(career, { status: 201 });
  } catch (error: any) {
    console.error('Error saving career:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
