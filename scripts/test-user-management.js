require('@next/env').loadEnvConfig(process.cwd());
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { randomUUID, randomBytes } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const testId = randomUUID();
const managerEmail = `user-manager-test-${testId}@example.invalid`;
const editorEmail = `user-editor-test-${testId}@example.invalid`;
const superEmail = `user-super-test-${testId}@example.invalid`;
const secondaryEmail = `user-secondary-super-test-${testId}@example.invalid`;
const managerPassword = randomBytes(18).toString('base64url') + '2';
const superPassword = randomBytes(18).toString('base64url') + '4';
const initialPassword = 'EditorInitialPass28!';
const changedPassword = 'EditorChangedPass38!';
const resetPassword = 'EditorResetPass48!';
let db;
let editorImagePath = null;

function assert(condition, message) { if (!condition) throw new Error(message); }

async function api(pathname, method = 'GET', body, cookie = '', expected = [200], multipart = false) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: { ...(cookie ? { cookie } : {}), ...(body && !multipart ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  assert(expected.includes(response.status), `${method} ${pathname} expected ${expected.join('/')} but got ${response.status}: ${data.error || ''}`);
  const rawCookie = response.headers.get('set-cookie');
  return { data, cookie: rawCookie ? rawCookie.split(';', 1)[0] : cookie, response };
}

async function login(email, password) {
  const result = await api('/api/auth/login', 'POST', { email, password }, '', [200]);
  assert(result.data.user && !('password_hash' in result.data.user) && !('password' in result.data.user), 'Login exposed password data.');
  assert(result.cookie.includes('hati_admin_session='), 'Login did not issue a session cookie.');
  return { ...result, cookie: result.cookie };
}

async function main() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const managerHash = await bcrypt.hash(managerPassword, 10);
    await db.execute('INSERT INTO users (email,name,password_hash,role,is_active,auth_version) VALUES (?,?,?,\'admin\',TRUE,1)', [managerEmail, 'Temporary User Manager', managerHash]);
    const superHash = await bcrypt.hash(superPassword, 10);
    await db.execute('INSERT INTO users (email,name,password_hash,role,is_active,auth_version) VALUES (?,?,?,\'super_admin\',TRUE,1)', [superEmail, 'Temporary Super Admin', superHash]);
    const [originalSuper] = await db.execute("SELECT id FROM users WHERE role='super_admin' AND is_active=TRUE AND email NOT IN (?,?) ORDER BY id LIMIT 1", [superEmail, secondaryEmail]);
    assert(originalSuper.length > 0, 'No pre-existing active Super Admin was found.');

    const anonymous = await api('/api/admin/users', 'GET', undefined, '', [401]);
    void anonymous;
    const manager = await login(managerEmail, managerPassword);
    const superAdmin = await login(superEmail, superPassword);
    await api(`/api/admin/users/${originalSuper[0].id}`, 'PATCH', { role: 'admin' }, manager.cookie, [403]);
    await api(`/api/admin/users/${manager.data.user.id}`, 'PATCH', { role: 'super_admin' }, manager.cookie, [403]);
    const addedSuper = await api('/api/admin/users', 'POST', { name: 'Temporary Secondary Super', email: secondaryEmail, role: 'super_admin', password: initialPassword, isActive: true }, superAdmin.cookie, [201]);
    assert(addedSuper.data.user.role === 'super_admin', 'Super Admin could not assign the authorized role.');
    await api(`/api/admin/users/${addedSuper.data.user.id}`, 'DELETE', undefined, superAdmin.cookie, [200]);

    const created = await api('/api/admin/users', 'POST', {
      name: 'Temporary Editor', email: editorEmail, role: 'editor', permissions: ['products'],
      password: initialPassword, isActive: true,
    }, manager.cookie, [201]);
    const editorId = String(created.data.user.id);
    assert(created.data.user.role === 'editor' && created.data.user.permissions.includes('products'), 'Editor role or module permissions were not persisted.');
    assert(!('password_hash' in created.data.user), 'User creation response exposed a password hash.');

    await api('/api/admin/users', 'POST', { name: 'Should Not Elevate', email: `elevate-${testId}@example.invalid`, role: 'admin', password: initialPassword }, manager.cookie, [403]);
    const list = await api('/api/admin/users', 'GET', undefined, manager.cookie);
    assert(!list.data.users.some((entry) => 'password_hash' in entry || 'password' in entry), 'User listing exposed password data.');

    let editor = await login(editorEmail, initialPassword);
    await api('/api/admin/users', 'GET', undefined, editor.cookie, [403]);
    await api('/api/services', 'POST', { name: { en: 'Forbidden' }, description: { en: 'test' } }, editor.cookie, [403]);
    const product = await api('/api/products', 'POST', { name: { en: 'User permission test' }, description: { en: 'temporary' }, category: 'test', image: '/test.jpg' }, editor.cookie, [201]);
    await api(`/api/products/${product.data.id}`, 'DELETE', undefined, editor.cookie, [200]);

    const profile = await api('/api/account/profile', 'PATCH', { name: 'Updated Temporary Editor', email: editorEmail }, editor.cookie);
    assert(profile.data.user.name === 'Updated Temporary Editor', 'Self profile update failed.');

    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lR0AAAAASUVORK5CYII=', 'base64');
    const uploadForm = new FormData();
    uploadForm.set('avatar', new Blob([png], { type: 'image/png' }), 'avatar.png');
    const avatar = await api('/api/account/avatar', 'POST', uploadForm, editor.cookie, [200], true);
    editorImagePath = avatar.data.user.profileImage;
    assert(editorImagePath && editorImagePath.startsWith('/uploads/avatars/'), 'Avatar upload was not saved to application storage.');
    const staticImage = await fetch(`${baseUrl}${editorImagePath}`);
    assert(staticImage.status === 200, 'Uploaded avatar is not served by Next.js static storage.');
    await api('/api/account/avatar', 'DELETE', undefined, editor.cookie, [200]);
    editorImagePath = null;

    const oldEditorCookie = editor.cookie;
    const passwordChange = await api('/api/account/password', 'POST', { currentPassword: initialPassword, newPassword: changedPassword, confirmPassword: changedPassword }, editor.cookie);
    editor = { ...editor, cookie: passwordChange.cookie };
    await api('/api/account/profile', 'GET', undefined, oldEditorCookie, [401]);
    await api('/api/auth/login', 'POST', { email: editorEmail, password: initialPassword }, '', [401]);
    editor = await login(editorEmail, changedPassword);

    await api(`/api/admin/users/${editorId}/password`, 'POST', { password: resetPassword, confirmPassword: resetPassword }, manager.cookie);
    await api('/api/account/profile', 'GET', undefined, editor.cookie, [401]);
    await api('/api/auth/login', 'POST', { email: editorEmail, password: changedPassword }, '', [401]);
    editor = await login(editorEmail, resetPassword);

    await api(`/api/admin/users/${editorId}`, 'PATCH', { role: 'admin' }, manager.cookie, [403]);
    await api(`/api/admin/users/${editorId}`, 'PATCH', { permissions: ['services'] }, manager.cookie);
    await api('/api/products', 'POST', { name: { en: 'Forbidden again' }, description: { en: 'test' }, category: 'test' }, editor.cookie, [403]);
    const service = await api('/api/services', 'POST', { name: { en: 'Allowed module' }, description: { en: 'temporary' } }, editor.cookie, [201]);
    await api(`/api/services/${service.data.id}`, 'DELETE', undefined, editor.cookie, [200]);

    const elevated = await api(`/api/admin/users/${editorId}`, 'PATCH', { role: 'admin' }, superAdmin.cookie);
    assert(elevated.data.user.role === 'admin', 'Super Admin role update failed.');
    await api(`/api/admin/users/${editorId}`, 'PATCH', { isActive: false }, superAdmin.cookie);
    await api('/api/account/profile', 'GET', undefined, editor.cookie, [401]);
    await api('/api/auth/login', 'POST', { email: editorEmail, password: resetPassword }, '', [401]);

    const audit = await api('/api/admin/audit', 'GET', undefined, manager.cookie);
    const actions = audit.data.events.filter((event) => event.targetEmail === editorEmail).map((event) => event.action);
    for (const action of ['user.created', 'user.profile_updated', 'user.picture_changed', 'user.picture_removed', 'user.password_changed', 'user.password_reset', 'user.deactivated']) {
      assert(actions.includes(action), `Audit entry missing: ${action}`);
    }
    assert(actions.includes('user.role_changed'), 'Audit entry missing: user.role_changed');
    assert(!JSON.stringify(audit.data.events).includes(initialPassword), 'Audit log contains a password.');
    await api(`/api/admin/users/${editorId}`, 'DELETE', undefined, superAdmin.cookie, [200]);
    console.log('User-management verification passed: account CRUD, role limits, module access, profile, avatar upload/removal, password change/reset session invalidation, deactivation, and audit events.');
  } finally {
    if (db) {
      if (editorImagePath) await fs.rm(path.join(process.cwd(), 'public', editorImagePath), { force: true }).catch(() => undefined);
      await db.execute('DELETE FROM admin_audit_log WHERE actor_email IN (?,?,?,?) OR target_email IN (?,?,?,?)', [managerEmail, editorEmail, superEmail, secondaryEmail, managerEmail, editorEmail, superEmail, secondaryEmail]);
      await db.execute('DELETE FROM users WHERE email IN (?,?,?,?)', [managerEmail, editorEmail, superEmail, secondaryEmail]);
      await db.end();
    }
  }
}

main().catch((error) => {
  console.error('User-management verification failed:', error.message);
  process.exitCode = 1;
});
