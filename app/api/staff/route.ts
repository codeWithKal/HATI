import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getStaff, getStaffStats, saveStaff } from '@/lib/repositories';

export async function GET() {
  try {
    const staff = await getStaff();
    const stats = await getStaffStats();
    return NextResponse.json({ staff, stats });
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('staff');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const member = await saveStaff(data);
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('Error saving staff member:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
