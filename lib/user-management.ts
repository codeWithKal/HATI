import bcrypt from 'bcryptjs';
import type { RowDataPacket, PoolConnection } from 'mysql2/promise';
import { pool, query } from '@/lib/db';
import type { AdminRole, AdminUser } from '@/lib/auth';
import { USER_MODULES, type UserModule } from '@/lib/user-permissions';

export type ManagedUser = {
  id: string; name: string; email: string; role: AdminRole; profileImage: string | null;
  isActive: boolean; permissions: string[]; createdAt: string; updatedAt: string; lastLogin: string | null;
};

function parsePermissions(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter((entry) => USER_MODULES.includes(entry as UserModule));
  if (typeof value === 'string') {
    try { return parsePermissions(JSON.parse(value)); } catch { return []; }
  }
  return [];
}

function dateString(value: unknown): string {
  if (!value) return '';
  return value instanceof Date ? value.toISOString() : String(value);
}

function serializeUser(row: RowDataPacket): ManagedUser {
  return {
    id: String(row.id), name: row.name, email: row.email, role: row.role,
    profileImage: row.profile_image || null, isActive: Boolean(row.is_active),
    permissions: parsePermissions(row.permissions), createdAt: dateString(row.created_at),
    updatedAt: dateString(row.updated_at), lastLogin: row.last_login ? dateString(row.last_login) : null,
  };
}

export async function listUsers(): Promise<ManagedUser[]> {
  const rows = await query<RowDataPacket[]>(`SELECT id, name, email, role, profile_image, is_active,
    permissions, created_at, updated_at, last_login FROM users ORDER BY created_at DESC, id DESC`);
  return rows.map(serializeUser);
}

export async function findUser(id: number | string): Promise<ManagedUser | null> {
  const rows = await query<RowDataPacket[]>(`SELECT id, name, email, role, profile_image, is_active,
    permissions, created_at, updated_at, last_login FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? serializeUser(rows[0]) : null;
}

function assertRoleAllowed(actor: AdminUser, role: AdminRole) {
  if (!['super_admin', 'admin', 'editor'].includes(role)) throw new Error('Invalid role.');
  if (actor.role === 'admin' && role !== 'editor') throw new Error('Admins may only assign the Editor/Staff role.');
  if (actor.role !== 'super_admin' && actor.role !== 'admin') throw new Error('You cannot manage user roles.');
}

function validateIdentity(name: unknown, email: unknown) {
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (cleanName.length < 2 || cleanName.length > 255) throw new Error('Name must be between 2 and 255 characters.');
  if (cleanEmail.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid email address.');
  return { name: cleanName, email: cleanEmail };
}

function validatePermissions(role: AdminRole, raw: unknown, actor: AdminUser): string[] {
  const requested = parsePermissions(raw);
  if (role !== 'editor') {
    if (requested.length) throw new Error('Module permissions apply to Editor/Staff accounts only.');
    return [];
  }
  if (actor.role !== 'super_admin' && actor.role !== 'admin') throw new Error('You cannot assign module permissions.');
  if (Array.isArray(raw) && raw.some((entry) => !USER_MODULES.includes(String(entry) as UserModule))) throw new Error('One or more module permissions are invalid.');
  return [...new Set(requested)];
}

async function audit(connection: PoolConnection, actor: AdminUser, target: { id?: number | string; name: string; email: string }, action: string, details: Record<string, unknown> = {}) {
  await connection.execute(`INSERT INTO admin_audit_log
    (actor_user_id, actor_name, actor_email, target_user_id, target_name, target_email, action, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [Number(actor.id), actor.name, actor.email, target.id ? Number(target.id) : null, target.name, target.email, action, JSON.stringify(details)]);
}

async function lockTarget(connection: PoolConnection, id: string | number) {
  const [rows] = await connection.execute<RowDataPacket[]>('SELECT id, name, email, role, is_active FROM users WHERE id = ? FOR UPDATE', [id]);
  if (!rows[0]) throw new Error('User not found.');
  return rows[0];
}

async function assertSuperAdminRemains(connection: PoolConnection, target: RowDataPacket) {
  if (target.role !== 'super_admin' || !target.is_active) return;
  const [rows] = await connection.execute<RowDataPacket[]>(`SELECT id FROM users
    WHERE role = 'super_admin' AND is_active = TRUE FOR UPDATE`);
  if (rows.length <= 1) throw new Error('The last active Super Admin cannot be deactivated, demoted, or deleted.');
}

export async function createUser(actor: AdminUser, input: any) {
  const { name, email } = validateIdentity(input.name, input.email);
  const role = String(input.role || 'editor') as AdminRole;
  assertRoleAllowed(actor, role);
  const permissions = validatePermissions(role, input.permissions, actor);
  const password = String(input.password || '');
  if (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password)) throw new Error('Password must be at least 12 characters and include a number.');
  const hash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<any>(`INSERT INTO users
      (name, email, password_hash, role, profile_image, is_active, permissions)
      VALUES (?, ?, ?, ?, NULL, ?, ?)`, [name, email, hash, role, input.isActive !== false, JSON.stringify(permissions)]);
    await audit(connection, actor, { id: result.insertId, name, email }, 'user.created', { role, isActive: input.isActive !== false });
    await connection.commit();
    return findUser(result.insertId);
  } catch (error: any) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new Error('An account with this email already exists.');
    throw error;
  } finally { connection.release(); }
}

export async function updateUser(actor: AdminUser, id: number | string, input: any) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const current = await lockTarget(connection, id);
    if (String(actor.id) === String(id) && input.role !== undefined) throw new Error('Change your own role through another Super Admin.');
    if (String(actor.id) === String(id) && input.isActive === false) throw new Error('You cannot deactivate your own account.');
    if (actor.role === 'admin' && current.role !== 'editor') throw new Error('Admins may only manage Editor/Staff accounts.');
    const name = input.name === undefined ? current.name : validateIdentity(input.name, current.email).name;
    const email = input.email === undefined ? current.email : validateIdentity(current.name, input.email).email;
    const role = input.role === undefined ? current.role as AdminRole : String(input.role) as AdminRole;
    assertRoleAllowed(actor, role);
    if (actor.role === 'admin' && role !== 'editor') throw new Error('Admins may not grant elevated roles.');
    const permissions = input.permissions === undefined ? undefined : validatePermissions(role, input.permissions, actor);
    const isActive = input.isActive === undefined ? Boolean(current.is_active) : Boolean(input.isActive);
    if (current.role === 'super_admin' && (role !== 'super_admin' || !isActive)) await assertSuperAdminRemains(connection, current);
    const roleChanged = role !== current.role;
    const statusChanged = isActive !== Boolean(current.is_active);
    const permissionValue = permissions === undefined ? null : JSON.stringify(permissions);
    await connection.execute(`UPDATE users SET name = ?, email = ?, role = ?, is_active = ?,
      permissions = IF(? = 1, ?, IF(? <> 'editor', NULL, permissions)), auth_version = auth_version + ? WHERE id = ?`,
    [name, email, role, isActive, permissions === undefined ? 0 : 1, permissionValue, role, statusChanged || roleChanged ? 1 : 0, id]);
    const target = { id, name, email };
    if (roleChanged) await audit(connection, actor, target, 'user.role_changed', { from: current.role, to: role });
    if (statusChanged) await audit(connection, actor, target, isActive ? 'user.activated' : 'user.deactivated');
    if (name !== current.name || email !== current.email || (permissions && !roleChanged)) {
      await audit(connection, actor, target, 'user.profile_updated', { fields: [
        ...(name !== current.name ? ['name'] : []), ...(email !== current.email ? ['email'] : []), ...(permissions ? ['permissions'] : []),
      ] });
    }
    await connection.commit();
    return findUser(id);
  } catch (error: any) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new Error('An account with this email already exists.');
    throw error;
  } finally { connection.release(); }
}

export async function removeUser(actor: AdminUser, id: number | string) {
  if (actor.role !== 'super_admin') throw new Error('Only a Super Admin may permanently delete accounts.');
  if (String(actor.id) === String(id)) throw new Error('You cannot delete your own account.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const current = await lockTarget(connection, id);
    await assertSuperAdminRemains(connection, current);
    await audit(connection, actor, { id, name: current.name, email: current.email }, 'user.deleted');
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function resetUserPassword(actor: AdminUser, id: number | string, password: string) {
  if (String(actor.id) === String(id)) throw new Error('Use your account settings to change your own password.');
  if (password.length < 12 || !/[a-z]/i.test(password) || !/\d/.test(password)) throw new Error('Password must be at least 12 characters and include a number.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const current = await lockTarget(connection, id);
    if (actor.role === 'admin' && current.role !== 'editor') throw new Error('Admins may only reset Editor/Staff passwords.');
    const hash = await bcrypt.hash(password, 12);
    await connection.execute('UPDATE users SET password_hash = ?, auth_version = auth_version + 1 WHERE id = ?', [hash, id]);
    await audit(connection, actor, { id, name: current.name, email: current.email }, 'user.password_reset');
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function updateOwnProfile(actor: AdminUser, input: any) {
  const { name, email } = validateIdentity(input.name, input.email);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await lockTarget(connection, actor.id);
    await connection.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, actor.id]);
    await audit(connection, actor, { id: actor.id, name, email }, 'user.profile_updated', { fields: ['name', 'email'] });
    await connection.commit();
  } catch (error: any) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new Error('An account with this email already exists.');
    throw error;
  } finally { connection.release(); }
  return findUser(actor.id);
}

export async function changeOwnPassword(actor: AdminUser, currentPassword: string, newPassword: string) {
  if (newPassword.length < 12 || !/[a-z]/i.test(newPassword) || !/\d/.test(newPassword)) throw new Error('New password must be at least 12 characters and include a number.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT password_hash FROM users WHERE id = ? FOR UPDATE', [actor.id]);
    if (!rows[0] || !(await bcrypt.compare(currentPassword, rows[0].password_hash))) throw new Error('Current password is incorrect.');
    const hash = await bcrypt.hash(newPassword, 12);
    await connection.execute('UPDATE users SET password_hash = ?, auth_version = auth_version + 1 WHERE id = ?', [hash, actor.id]);
    await audit(connection, actor, { id: actor.id, name: actor.name, email: actor.email }, 'user.password_changed');
    const [versionRows] = await connection.execute<RowDataPacket[]>('SELECT auth_version FROM users WHERE id = ?', [actor.id]);
    await connection.commit();
    const updated = await findUser(actor.id);
    if (!updated) throw new Error('Account no longer exists.');
    return { ...updated, authVersion: Number(versionRows[0].auth_version) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}

export async function setUserImage(actor: AdminUser, id: number | string, profileImage: string | null) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const current = await lockTarget(connection, id);
    if (actor.role === 'editor' && String(actor.id) !== String(id)) throw new Error('You may only update your own profile picture.');
    if (actor.role === 'admin' && current.role !== 'editor' && String(actor.id) !== String(id)) throw new Error('Admins may only manage Editor/Staff profile images.');
    await connection.execute('UPDATE users SET profile_image = ? WHERE id = ?', [profileImage, id]);
    await audit(connection, actor, { id, name: current.name, email: current.email }, profileImage ? 'user.picture_changed' : 'user.picture_removed');
    await connection.commit();
    return current.profile_image as string | null;
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function listAuditEvents(limit = 100) {
  const rows = await query<RowDataPacket[]>(`SELECT id, actor_name AS actorName, actor_email AS actorEmail,
    target_name AS targetName, target_email AS targetEmail, action, details, created_at AS createdAt
    FROM admin_audit_log ORDER BY created_at DESC, id DESC LIMIT ?`, [Math.min(Math.max(limit, 1), 200)]);
  return rows.map((row) => ({ ...row, details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details }));
}

export async function listOwnAuditEvents(userId: string | number, limit = 12) {
  const rows = await query<RowDataPacket[]>(`SELECT id, target_name AS targetName, target_email AS targetEmail,
    action, details, created_at AS createdAt FROM admin_audit_log
    WHERE actor_user_id = ? ORDER BY created_at DESC, id DESC LIMIT ?`, [userId, Math.min(Math.max(limit, 1), 50)]);
  return rows.map((row) => ({ ...row, details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details }));
}
