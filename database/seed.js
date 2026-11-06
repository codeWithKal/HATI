require('@next/env').loadEnvConfig(process.cwd());
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const { ADMIN_SEED_EMAIL: email, ADMIN_SEED_NAME: name, ADMIN_SEED_PASSWORD: password } = process.env;
    if (!email && !name && !password) {
      console.log('No admin bootstrap credentials supplied; existing database users and content were left unchanged.');
      return;
    }
    if (!email || !name || !password || password.length < 12) {
      throw new Error('Set ADMIN_SEED_EMAIL, ADMIN_SEED_NAME, and ADMIN_SEED_PASSWORD (at least 12 characters).');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      'INSERT IGNORE INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, name, passwordHash, 'super_admin']
    );
    console.log('Admin bootstrap checked. Existing accounts were not overwritten.');
  } finally {
    await connection.end();
  }
}

seed().catch((error) => {
  console.error('Admin bootstrap failed:', error.message);
  process.exitCode = 1;
});
