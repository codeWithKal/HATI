require('@next/env').loadEnvConfig(process.cwd());
const fs = require('node:fs');
const mysql = require('mysql2/promise');

const VERSION = '2026-11-02-recruitment-v1';
function argument(name) {
  const inline = process.argv.find((entry) => entry.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const backup = argument('backup');
  if (!backup || !fs.existsSync(backup) || !fs.statSync(backup).size) {
    throw new Error('A verified non-empty backup is required: pass --backup /path/to/hati_db.sql.');
  }
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const [applied] = await db.execute('SELECT version FROM schema_migrations WHERE version = ?', [VERSION]);
    if (applied.length) { console.log(`${VERSION} already applied.`); return; }
    const [careerRows] = await db.execute("SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'careers'");
    if (!Number(careerRows[0].total)) throw new Error('Expected existing careers table is missing.');
    const [existingColumns] = await db.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'careers'");
    const columns = new Set(existingColumns.map((row) => row.column_name));
    const additions = [
      ['application_deadline', 'DATE NULL'], ['vacancies', 'SMALLINT UNSIGNED NOT NULL DEFAULT 1'],
      ['vacancy_status', "ENUM('open','closed') NOT NULL DEFAULT 'open'"],
      ['responsibilities_en', 'TEXT NULL'], ['responsibilities_am', 'TEXT NULL'], ['responsibilities_om', 'TEXT NULL'],
      ['qualifications_en', 'TEXT NULL'], ['qualifications_am', 'TEXT NULL'], ['qualifications_om', 'TEXT NULL'],
      ['skills_en', 'TEXT NULL'], ['skills_am', 'TEXT NULL'], ['skills_om', 'TEXT NULL'],
    ];
    for (const [name, type] of additions) if (!columns.has(name)) await db.execute(`ALTER TABLE careers ADD COLUMN \`${name}\` ${type}`);
    await db.query(`CREATE TABLE IF NOT EXISTS job_applications (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      reference_no VARCHAR(32) NOT NULL UNIQUE,
      career_id INT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(254) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      address VARCHAR(500) NOT NULL,
      portfolio_url VARCHAR(2048) NULL,
      education VARCHAR(255) NOT NULL,
      field_of_study VARCHAR(255) NOT NULL,
      experience_years DECIMAL(5,2) NOT NULL,
      previous_employer VARCHAR(255) NULL,
      cover_letter TEXT NOT NULL,
      status ENUM('new','under_review','shortlisted','interview_scheduled','accepted','rejected','withdrawn') NOT NULL DEFAULT 'new',
      assigned_reviewer_id INT NULL,
      interview_at DATETIME NULL,
      interview_feedback TEXT NULL,
      submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_job_applications_career_submitted (career_id, submitted_at, id),
      KEY idx_job_applications_status_submitted (status, submitted_at, id),
      UNIQUE KEY uq_job_application_candidate (career_id, email),
      KEY idx_job_applications_reviewer_status (assigned_reviewer_id, status, submitted_at),
      CONSTRAINT fk_job_applications_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE RESTRICT,
      CONSTRAINT fk_job_applications_reviewer FOREIGN KEY (assigned_reviewer_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await db.query(`CREATE TABLE IF NOT EXISTS application_documents (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      application_id BIGINT UNSIGNED NOT NULL,
      document_type ENUM('resume','supporting','certificate') NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      storage_name VARCHAR(100) NOT NULL UNIQUE,
      mime_type VARCHAR(100) NOT NULL,
      file_size INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_application_documents_parent (application_id, id),
      CONSTRAINT fk_application_documents_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await db.query(`CREATE TABLE IF NOT EXISTS application_status_history (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      application_id BIGINT UNSIGNED NOT NULL,
      previous_status VARCHAR(32) NULL,
      new_status VARCHAR(32) NOT NULL,
      actor_user_id INT NULL,
      actor_name VARCHAR(255) NOT NULL,
      note TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_application_history_parent (application_id, created_at, id),
      CONSTRAINT fk_application_history_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
      CONSTRAINT fk_application_history_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await db.query(`CREATE TABLE IF NOT EXISTS application_notes (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      application_id BIGINT UNSIGNED NOT NULL,
      author_user_id INT NULL,
      author_name VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_application_notes_parent (application_id, created_at, id),
      CONSTRAINT fk_application_notes_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
      CONSTRAINT fk_application_notes_author FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    await db.execute('INSERT INTO schema_migrations (version) VALUES (?)', [VERSION]);
    console.log('Recruitment schema migrated. Existing careers and requirements were preserved.');
  } finally { await db.end(); }
}
main().catch((error) => { console.error('Recruitment migration failed:', error.message); process.exitCode = 1; });
