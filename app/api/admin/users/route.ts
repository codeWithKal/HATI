import { NextResponse } from 'next/server';
import { requireUserManagerApi } from '@/lib/auth';
import { createUser, listUsers } from '@/lib/user-management';

export async function GET() {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  return NextResponse.json({ users: await listUsers() });
}

export async function POST(request: Request) {
  const access = await requireUserManagerApi();
  if (access.response) return access.response;
  try {
    const user = await createUser(access.user!, await request.json());
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    const status = /permission|role|Admins may only/i.test(error.message) ? 403 : 400;
    return NextResponse.json({ error: error.message || 'Unable to create account.' }, { status });
  }
}
