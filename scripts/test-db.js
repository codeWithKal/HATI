require('@next/env').loadEnvConfig(process.cwd());
const mysql = require('mysql2/promise');

async function testDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });
  try {
    const expectedTables = ['users', 'admin_audit_log', 'products', 'product_images', 'services', 'projects', 'careers', 'career_requirements', 'job_applications', 'application_documents', 'application_status_history', 'application_notes', 'certifications', 'gallery', 'contacts', 'business_hours', 'staff', 'tenders', 'content_features', 'news', 'schema_migrations'];
    const [tableRows] = await connection.execute(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()'
    );
    const tables = new Set(tableRows.map((row) => row.table_name));
    const missing = expectedTables.filter((name) => !tables.has(name));
    if (missing.length) throw new Error(`Missing expected tables: ${missing.join(', ')}`);
    const obsolete = ['inventory', 'benefits', 'section_stats', 'home_hero', 'home_cta', 'home_learn_more', 'home_why_choose', 'tender_info', 'tender_info_paragraphs'].filter((name) => tables.has(name));
    if (obsolete.length) throw new Error(`Legacy tables remain after migration: ${obsolete.join(', ')}`);

    const [products] = await connection.execute('SELECT id, price_etb, stock_m3 FROM products ORDER BY sort_order, id');
    if (products.some((product) => (product.price_etb !== null && Number(product.price_etb) < 0) || (product.stock_m3 !== null && Number(product.stock_m3) < 0))) {
      throw new Error('Found a negative product price or stock quantity.');
    }
    const migratedInventory = products.filter((product) => product.price_etb !== null || product.stock_m3 !== null);
    const expectedInventory = [[4945, 450], [3105, 380], [3795, 520]];
    if (migratedInventory.length !== expectedInventory.length || expectedInventory.some(([price, stock]) =>
      !migratedInventory.some((product) => Number(product.price_etb) === price && Number(product.stock_m3) === stock)
    )) throw new Error('Migrated product prices or stock quantities do not match the pre-migration inventory.');
    const [features] = await connection.execute('SELECT section, COUNT(*) AS count FROM content_features GROUP BY section');
    if (!features.some((row) => row.section === 'home')) throw new Error('Home features were not preserved.');
    const [budgetColumn] = await connection.execute(
      `SELECT data_type, numeric_precision, numeric_scale FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'tenders' AND column_name = 'budget'`
    );
    if (!budgetColumn.length || budgetColumn[0].data_type !== 'decimal' || Number(budgetColumn[0].numeric_scale) !== 2) {
      throw new Error('Tender budgets must use a two-decimal monetary type.');
    }
    const [imageRows] = await connection.execute('SELECT COUNT(*) AS count FROM product_images');
    if (Number(imageRows[0].count) !== 11) throw new Error(`Expected all 11 existing product images, found ${imageRows[0].count}.`);
    const [orphanImages] = await connection.execute('SELECT COUNT(*) AS count FROM product_images i LEFT JOIN products p ON p.id=i.product_id WHERE p.id IS NULL');
    if (Number(orphanImages[0].count)) throw new Error('Orphaned product image relationship found.');

    const [userRows] = await connection.execute('SELECT password_hash, role, is_active, auth_version FROM users');
    if (userRows.some((row) => !/^\$2[aby]\$/.test(row.password_hash))) throw new Error('A user password is not stored as a bcrypt hash.');
    if (userRows.some((row) => !['super_admin', 'admin', 'editor'].includes(row.role) || Number(row.auth_version) < 1)) throw new Error('User role or session version is invalid.');
    if (!userRows.some((row) => row.role === 'super_admin' && Boolean(row.is_active))) throw new Error('At least one active Super Admin must remain.');

    await connection.beginTransaction();
    const [created] = await connection.execute(
      `INSERT INTO products (name_en, description_en, category, image, price_etb, stock_m3)
       VALUES ('Architecture test', 'Temporary verification row', 'test', '/test.jpg', 12.50, 3.125)`
    );
    await connection.execute('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)', [created.insertId, '/test-1.jpg', 0]);
    const [joined] = await connection.execute('SELECT p.price_etb, p.stock_m3, i.image_url FROM products p JOIN product_images i ON i.product_id=p.id WHERE p.id=?', [created.insertId]);
    if (joined.length !== 1 || Number(joined[0].price_etb) !== 12.5 || Number(joined[0].stock_m3) !== 3.125) throw new Error('Product pricing, stock, or image relationship CRUD failed.');
    await connection.rollback();

    console.log(`Database architecture verified: ${products.length} products, ${imageRows[0].count} ordered product images, ${userRows.length} bcrypt accounts.`);
  } finally {
    await connection.end();
  }
}

testDatabase().catch((error) => {
  console.error('Database validation failed:', error.message);
  process.exitCode = 1;
});
