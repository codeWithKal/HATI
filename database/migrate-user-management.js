require('@next/env').loadEnvConfig(process.cwd());
const fs = require('node:fs');
const mysql = require('mysql2/promise');

const VERSION = '2026-11-02-user-management-v1';
const option = (name) => {
  const inline = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

async function main() {
  const backup = option('backup');
  if (!backup || !fs.existsSync(backup) || fs.statSync(backup).size === 0) {
    throw new Error('A verified, non-empty pre-migration backup is required. Pass --backup /path/to/hati_db.sql.');
  }
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const [migrations] = await db.execute('SELECT version FROM schema_migrations WHERE version = ?', [VERSION]);
    if (migrations.length) {
      console.log(`${VERSION} is already applied.`);
      return;
    }
    const [columns] = await db.execute(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users'`
    );
    const existing = new Set(columns.map((row) => row.column_name));
    if (!existing.has('email') || !existing.has('password_hash') || !existing.has('role')) {
      throw new Error('The expected users table is missing required authentication columns.');
    }

    // Widen role before mapping current admins to the initial Super Admin role.
    await db.execute("ALTER TABLE users MODIFY role VARCHAR(30) NOT NULL DEFAULT 'admin'");
    await db.execute("UPDATE users SET role = 'super_admin' WHERE role = 'admin'");
    await db.execute("UPDATE users SET role = 'editor' WHERE role NOT IN ('super_admin', 'admin', 'editor')");
    await db.execute("ALTER TABLE users MODIFY role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'admin'");

    const additions = [
      ['profile_image', 'VARCHAR(500) NULL'],
      ['is_active', 'BOOLEAN NOT NULL DEFAULT TRUE'],
      ['permissions', 'JSON NULL'],
      ['auth_version', 'INT UNSIGNED NOT NULL DEFAULT 1'],
      ['last_login', 'TIMESTAMP NULL'],
      ['updated_at', 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'],
    ];
    for (const [name, definition] of additions) {
      if (!existing.has(name)) await db.execute(`ALTER TABLE users ADD COLUMN \`${name}\` ${definition}`);
    }

    const [indexes] = await db.execute(
      `SELECT COUNT(*) AS total FROM information_schema.statistics
       WHERE table_schema = DATABASE() AND table_name = 'users' AND index_name = 'idx_users_role_active'`
    );
    if (Number(indexes[0].total) === 0) await db.execute('ALTER TABLE users ADD INDEX idx_users_role_active (role, is_active, id)');

    await db.execute(`CREATE TABLE IF NOT EXISTS admin_audit_log (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      actor_user_id INT NULL,
      actor_name VARCHAR(255) NOT NULL,
      actor_email VARCHAR(255) NOT NULL,
      target_user_id INT NULL,
      target_name VARCHAR(255) NOT NULL,
      target_email VARCHAR(255) NOT NULL,
      action VARCHAR(64) NOT NULL,
      details JSON NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_admin_audit_created (created_at, id),
      KEY idx_admin_audit_target (target_user_id, created_at),
      CONSTRAINT fk_admin_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_admin_audit_target FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    const [invalid] = await db.execute("SELECT COUNT(*) AS total FROM users WHERE role NOT IN ('super_admin','admin','editor') OR password_hash NOT LIKE '$2%'");
    if (Number(invalid[0].total)) throw new Error('User role or bcrypt hash validation failed; investigate before continuing.');
    await db.execute('INSERT INTO schema_migrations (version) VALUES (?)', [VERSION]);
    console.log(`Migrated ${columns.length ? 'existing users in place' : 'users'}; preserved password hashes and records. Current admin accounts were promoted to Super Admin.`);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error('User-management migration failed:', error.message);
  process.exitCode = 1;
});
