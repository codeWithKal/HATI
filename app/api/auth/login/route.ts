import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/repositories';
import { createSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await authenticateUser(String(email).trim().toLowerCase(), String(password));
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({ user, message: 'Login successful' });
    setSessionCookie(response, createSessionToken(user));
    return response;
  } catch (error: any) {
    console.error('Login failed due to an internal authentication error.');
    return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 500 });
  }
}
