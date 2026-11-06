require('@next/env').loadEnvConfig(process.cwd());
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { randomUUID, randomBytes } = require('node:crypto');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const email = `api-test-${randomUUID()}@example.invalid`;
const password = randomBytes(24).toString('base64url');
let cookie = '';

async function request(path, method = 'GET', body, expected = [200, 201]) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!expected.includes(response.status)) {
    const detail = await response.text();
    throw new Error(`${method} ${path}: expected ${expected.join('/')} but got ${response.status}: ${detail}`);
  }
  const setCookie = response.headers.get('set-cookie');
  if (setCookie && path === '/api/auth/login') cookie = setCookie.split(';', 1)[0];
  if (response.status === 204) return null;
  const content = await response.text();
  return content ? JSON.parse(content) : null;
}

async function crud(path, payload) {
  const created = await request(path, 'POST', payload, [201]);
  const id = created.id;
  if (id === undefined || id === null) throw new Error(`POST ${path} did not return an id`);
  try {
    if (path === '/api/products') {
      const fetched = await request(`${path}/${id}`);
      if (fetched.id !== String(id) || JSON.stringify(fetched.images) !== JSON.stringify(payload.images)) {
        throw new Error('Product gallery readback did not preserve image order.');
      }
    }
    await request(`${path}/${id}`, 'PUT', payload, [200]);
  } finally {
    await request(`${path}/${id}`, 'DELETE', undefined, [200]);
    if (path === '/api/inventory') await request(`/api/products/${id}`, 'DELETE', undefined, [200]);
  }
}

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)', [email, 'Temporary API Test', hash, 'admin']);
    const unauthorized = await fetch(`${baseUrl}/api/services`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: { en: 'Blocked' } }) });
    if (unauthorized.status !== 401) throw new Error(`Unauthenticated write returned ${unauthorized.status}, expected 401`);

    const login = await request('/api/auth/login', 'POST', { email, password });
    if (!login.user || login.user.password_hash || login.user.password) throw new Error('Login response leaked password data or omitted the user.');
    if (!cookie) throw new Error('Login response did not set the HttpOnly session cookie.');
    const session = await request('/api/auth/session');
    if (session.user?.email !== email) throw new Error('Signed session did not validate.');

    const trans = { en: 'API test', am: 'ሙከራ', om: 'Qorannoo' };
    await crud('/api/products', { name: trans, description: trans, category: 'test', image: '/test.jpg', images: ['/test-1.jpg', '/test-2.jpg'], priceEtb: 22.5, stockM3: 4.125 });
    await crud('/api/services', { name: trans, description: trans });
    await crud('/api/projects', { title: trans, description: trans, location: trans, status: 'ongoing', image: '/test.jpg' });
    await crud('/api/careers', { title: trans, location: trans, type: trans, department: trans, experience: trans, description: trans, requirements: { en: ['Test'], am: ['ሙከራ'], om: ['Qorannoo'] } });
    await crud('/api/tenders', { title: trans, description: trans, budget: 25, deadline: '2030-01-01', status: 'open' });
    await crud('/api/staff', { name: trans, position: trans, department: trans, bio: trans, email: email });
    await crud('/api/contacts', { type: 'test', icon: 'MapPin', title: trans, details: trans, badge: trans });
    await crud('/api/gallery', { image: '/test-gallery.jpg', category: 'test' });
    await crud('/api/news', { title: trans, excerpt: trans, content: trans, author: 'test', date: '2030-01-01', category: 'test', image: '/test-news.jpg' });
    await crud('/api/inventory', { materialName: trans, price_in_m3: { en: '20 ETB', am: '20 ብር', om: 'Qarshii 20' }, stokeRemaining_in_m3: { en: '3 m³', am: '3 ሜ³', om: '3 m³' } });
    await request('/api/auth/logout', 'POST', {});
    cookie = '';
    const afterLogout = await request('/api/auth/session');
    if (afterLogout.user) throw new Error('Logout did not invalidate the session cookie.');
    console.log('Authenticated API CRUD verified for products/images, inventory, services, projects, careers/requirements, tenders, staff, contacts, gallery, and news.');
  } finally {
    await db.execute('DELETE FROM users WHERE email = ?', [email]);
    await db.end();
  }
}

run().catch((error) => {
  console.error('API verification failed:', error.message);
  process.exitCode = 1;
});
