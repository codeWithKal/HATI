import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

const COOKIE = 'hati_admin_session';
const MAX_AGE = 60 * 60 * 12;
const secret = () => {
  const value = process.env.AUTH_SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SESSION_SECRET must be configured in production');
  return 'development-only-hati-session-secret';
};

export type AdminRole = 'super_admin' | 'admin' | 'editor';
export type AdminUser = { id: string; email: string; name: string; role: AdminRole; profileImage: string | null; permissions: string[]; authVersion: number };
type Session = AdminUser & { exp: number };
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function createSessionToken(user: AdminUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    if (session.exp < Date.now() / 1000 || !session.id) return null;
    const rows = await query<RowDataPacket[]>(
      'SELECT id, email, name, role, profile_image, permissions, auth_version, is_active FROM users WHERE id = ? LIMIT 1',
      [session.id],
    );
    const current = rows[0];
    if (!current || !current.is_active || Number(current.auth_version) !== Number(session.authVersion)) return null;
    const rawPermissions = current.permissions;
    const permissions = Array.isArray(rawPermissions)
      ? rawPermissions.map(String)
      : typeof rawPermissions === 'string'
        ? JSON.parse(rawPermissions)
        : [];
    if (!['super_admin', 'admin', 'editor'].includes(current.role)) return null;
    return {
      id: String(current.id),
      email: current.email,
      name: current.name,
      role: current.role,
      profileImage: current.profile_image || null,
      permissions: Array.isArray(permissions) ? permissions : [],
      authVersion: Number(current.auth_version),
    };
  } catch {
    return null;
  }
}

export async function requireAdminApi(permission?: string) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  if (user.role === 'super_admin' || user.role === 'admin' || !permission || user.permissions.includes(permission)) return null;
  return NextResponse.json({ error: 'You do not have permission for this module.' }, { status: 403 });
}

export async function requireUserManagerApi() {
  const user = await getAdminSession();
  if (user && ['super_admin', 'admin'].includes(user.role)) return { user, response: null };
  if (!user) return { user: null, response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  return { user: null, response: NextResponse.json({ error: 'User management permission required' }, { status: 403 }) };
}

export async function requireSuperAdminApi() {
  const user = await getAdminSession();
  if (user?.role === 'super_admin') return { user, response: null };
  if (!user) return { user: null, response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  return { user: null, response: NextResponse.json({ error: 'Super Admin permission required' }, { status: 403 }) };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}
