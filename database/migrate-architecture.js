require('@next/env').loadEnvConfig(process.cwd());

const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const MIGRATION_VERSION = '2026-11-02-architecture-v3';
const CONFIG_DIR = path.join(process.cwd(), 'config');
const STAT_SECTIONS = ['home', 'projects', 'gallery', 'staff'];
const STATIC_TABLES = [
  'home_hero',
  'home_cta',
  'home_learn_more',
  'section_stats',
  'benefits',
  'tender_info',
  'tender_info_paragraphs',
];

function optionValue(name) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function writeJsonConfig(filename, value) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  const destination = path.join(CONFIG_DIR, filename);
  const temporary = `${destination}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o644 });
  fs.renameSync(temporary, destination);
  const saved = JSON.parse(fs.readFileSync(destination, 'utf8'));
  if (JSON.stringify(saved) !== JSON.stringify(value)) {
    throw new Error(`Config export verification failed for ${filename}`);
  }
  return destination;
}

function translations(row, prefix) {
  return {
    en: row[`${prefix}_en`] ?? '',
    am: row[`${prefix}_am`] ?? '',
    om: row[`${prefix}_om`] ?? '',
  };
}

function existingConfig(filename, fallback) {
  const filepath = path.join(CONFIG_DIR, filename);
  return fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath, 'utf8')) : fallback;
}

function statFromRow(row) {
  return {
    id: String(row.id),
    ...(row.icon ? { icon: row.icon } : {}),
    value: String(row.value),
    label: translations(row, 'label'),
  };
}

async function tableExists(connection, table) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS item_count FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [table]
  );
  return Number(rows[0].item_count) > 0;
}

async function columnExists(connection, table, column) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS item_count FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return Number(rows[0].item_count) > 0;
}

async function readStaticConfig(connection) {
  // Retain already-exported configuration if a previous run was interrupted
  // after one or more source tables had been removed.
  const exported = {
    home: existingConfig('home.json', {}),
    stats: existingConfig('stats.json', Object.fromEntries(STAT_SECTIONS.map((section) => [section, []]))),
    benefits: existingConfig('career-benefits.json', []),
    tenderInfo: existingConfig('tender-info.json', []),
  };
  if (await tableExists(connection, 'home_hero')) {
    const [rows] = await connection.execute('SELECT * FROM home_hero ORDER BY id');
    if (rows.length > 1) throw new Error('home_hero has multiple rows; refusing to discard content the app does not currently expose.');
    const row = rows[0];
    exported.home = exported.home || {};
    exported.home.hero = row ? {
      id: String(row.id),
      title: translations(row, 'title'),
      subtitle: translations(row, 'subtitle'),
      badge: translations(row, 'badge'),
      cta: translations(row, 'cta'),
      secondaryCta: translations(row, 'secondary_cta'),
    } : null;
  }

  if (await tableExists(connection, 'home_cta')) {
    const [rows] = await connection.execute('SELECT * FROM home_cta ORDER BY id');
    if (rows.length > 1) throw new Error('home_cta has multiple rows; refusing to discard content the app does not currently expose.');
    const row = rows[0];
    exported.home = exported.home || {};
    exported.home.cta = row ? {
      id: String(row.id),
      badge: translations(row, 'badge'),
      title: translations(row, 'title'),
      description: translations(row, 'description'),
      button: translations(row, 'button'),
    } : null;
  }

  if (await tableExists(connection, 'home_learn_more')) {
    const [rows] = await connection.execute('SELECT * FROM home_learn_more ORDER BY id');
    if (rows.length > 1) throw new Error('home_learn_more has multiple rows; refusing to discard content the app does not currently expose.');
    const row = rows[0];
    exported.home = exported.home || {};
    exported.home.learnMore = row ? { id: String(row.id), text: translations(row, 'text') } : null;
  }

  if (await tableExists(connection, 'section_stats')) {
    const [rows] = await connection.execute('SELECT * FROM section_stats ORDER BY section, sort_order, id');
    const stats = Object.fromEntries(STAT_SECTIONS.map((section) => [section, []]));
    for (const row of rows) {
      if (!stats[row.section]) throw new Error(`Unknown statistics section: ${row.section}`);
      stats[row.section].push(statFromRow(row));
    }
    exported.stats = stats;
  }

  if (await tableExists(connection, 'benefits')) {
    const [rows] = await connection.execute('SELECT * FROM benefits ORDER BY sort_order, id');
    exported.benefits = rows.map((row) => ({
      id: String(row.id),
      icon: row.icon,
      title: translations(row, 'title'),
      description: translations(row, 'description'),
    }));
  }

  if (await tableExists(connection, 'tender_info')) {
    const [infoRows] = await connection.execute('SELECT * FROM tender_info ORDER BY id');
    const paragraphRows = await tableExists(connection, 'tender_info_paragraphs')
      ? (await connection.execute('SELECT * FROM tender_info_paragraphs ORDER BY tender_info_id, sort_order, id'))[0]
      : [];
    const previousInfo = new Map(exported.tenderInfo.map((row) => [Number(row.id), row]));
    const paragraphMap = new Map();
    for (const paragraph of paragraphRows) {
      const parentId = Number(paragraph.tender_info_id);
      if (!paragraphMap.has(parentId)) paragraphMap.set(parentId, []);
      paragraphMap.get(parentId).push({
        en: paragraph.content_en ?? '',
        am: paragraph.content_am ?? '',
        om: paragraph.content_om ?? '',
      });
    }
    exported.tenderInfo = infoRows.map((row) => ({
      id: String(row.id),
      title: translations(row, 'title'),
      paragraphs: paragraphMap.get(Number(row.id)) || previousInfo.get(Number(row.id))?.paragraphs || [],
    }));
    const knownIds = new Set(infoRows.map((row) => Number(row.id)));
    if (paragraphRows.some((row) => !knownIds.has(Number(row.tender_info_id)))) {
      throw new Error('Found tender information paragraphs without a parent; refusing to remove their source tables.');
    }
  } else if (await tableExists(connection, 'tender_info_paragraphs')) {
    const [orphaned] = await connection.execute(
      'SELECT COUNT(*) AS item_count FROM tender_info_paragraphs'
    );
    if (Number(orphaned[0].item_count)) {
      throw new Error('Tender paragraphs remain without their parent table and exported config; refusing to discard them.');
    }
  }

  return exported;
}

function persistConfigs(exported) {
  writeJsonConfig('home.json', exported.home);
  writeJsonConfig('stats.json', exported.stats);
  writeJsonConfig('career-benefits.json', exported.benefits);
  writeJsonConfig('tender-info.json', exported.tenderInfo);
}

function numericValue(value, fieldName) {
  const matches = String(value ?? '').match(/[0-9][0-9,]*(?:\.[0-9]+)?/g);
  if (!matches || matches.length !== 1) throw new Error(`Cannot safely parse ${fieldName}: ${value}`);
  const normalized = matches[0].replaceAll(',', '');
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) throw new Error(`Invalid ${fieldName}: ${value}`);
  return Number(normalized);
}

function sameLocalizedName(product, inventory) {
  const fields = [
    ['name_en', 'material_name_en'],
    ['name_am', 'material_name_am'],
    ['name_om', 'material_name_om'],
  ];
  return fields.every(([productField, inventoryField]) =>
    String(product[productField] ?? '').normalize('NFC').trim() ===
    String(inventory[inventoryField] ?? '').normalize('NFC').trim()
  );
}

async function ensureProductColumns(connection) {
  const columns = [
    ['price_etb', 'DECIMAL(12,2) NULL'],
    ['stock_m3', 'DECIMAL(12,3) NULL'],
    ['sort_order', 'INT NOT NULL DEFAULT 0'],
  ];
  for (const [column, definition] of columns) {
    if (!(await columnExists(connection, 'products', column))) {
      await connection.execute(`ALTER TABLE products ADD COLUMN \`${column}\` ${definition}`);
    }
  }

  const [indexes] = await connection.execute(
    `SELECT COUNT(*) AS item_count FROM information_schema.statistics
     WHERE table_schema = DATABASE() AND table_name = 'products' AND index_name = 'idx_products_sort'`
  );
  if (Number(indexes[0].item_count) === 0) {
    await connection.execute('ALTER TABLE products ADD INDEX idx_products_sort (sort_order, id)');
  }

  const [constraints] = await connection.execute(
    `SELECT constraint_name FROM information_schema.table_constraints
     WHERE constraint_schema = DATABASE() AND table_name = 'products' AND constraint_type = 'CHECK'`
  );
  const names = new Set(constraints.map((row) => row.constraint_name));
  if (!names.has('chk_products_price_nonnegative')) {
    await connection.execute(
      'ALTER TABLE products ADD CONSTRAINT chk_products_price_nonnegative CHECK (price_etb IS NULL OR price_etb >= 0)'
    );
  }
  if (!names.has('chk_products_stock_nonnegative')) {
    await connection.execute(
      'ALTER TABLE products ADD CONSTRAINT chk_products_stock_nonnegative CHECK (stock_m3 IS NULL OR stock_m3 >= 0)'
    );
  }
}

async function migrateInventory(connection) {
  if (!(await tableExists(connection, 'inventory'))) {
    return { rows: 0, productIds: [] };
  }

  await ensureProductColumns(connection);
  const [products] = await connection.execute('SELECT * FROM products ORDER BY id');
  const [inventoryRows] = await connection.execute('SELECT * FROM inventory ORDER BY sort_order, id');
  const migrated = [];

  for (const inventory of inventoryRows) {
    const matches = products.filter((product) => sameLocalizedName(product, inventory));
    if (matches.length !== 1) {
      throw new Error(`Inventory item ${inventory.id} matched ${matches.length} products by all three localized names; no inventory rows were dropped.`);
    }
    const product = matches[0];
    const prices = [
      numericValue(inventory.price_in_m3_en, `inventory ${inventory.id} English price`),
      numericValue(inventory.price_in_m3_am, `inventory ${inventory.id} Amharic price`),
      numericValue(inventory.price_in_m3_om, `inventory ${inventory.id} Afaan Oromoo price`),
    ];
    const stock = [
      numericValue(inventory.stock_remaining_in_m3_en, `inventory ${inventory.id} English stock`),
      numericValue(inventory.stock_remaining_in_m3_am, `inventory ${inventory.id} Amharic stock`),
      numericValue(inventory.stock_remaining_in_m3_om, `inventory ${inventory.id} Afaan Oromoo stock`),
    ];
    if (!prices.every((value) => value === prices[0]) || !stock.every((value) => value === stock[0])) {
      throw new Error(`Inventory item ${inventory.id} has conflicting translations for numeric price or stock; source table retained.`);
    }
    if (prices[0] < 0 || stock[0] < 0) throw new Error(`Inventory item ${inventory.id} has negative price or stock.`);

    if (product.price_etb !== null && Number(product.price_etb) !== prices[0]) {
      throw new Error(`Product ${product.id} already has a different price; refusing to overwrite it.`);
    }
    if (product.stock_m3 !== null && Number(product.stock_m3) !== stock[0]) {
      throw new Error(`Product ${product.id} already has a different stock value; refusing to overwrite it.`);
    }

    await connection.execute(
      `UPDATE products
       SET price_etb = COALESCE(price_etb, ?),
           stock_m3 = COALESCE(stock_m3, ?),
           sort_order = ?,
           updated_at = GREATEST(updated_at, ?)
       WHERE id = ?`,
      [prices[0], stock[0], inventory.sort_order, inventory.updated_at, product.id]
    );
    migrated.push({ productId: Number(product.id), price: prices[0], stock: stock[0] });
  }

  const [images] = await connection.execute(
    `SELECT COUNT(*) AS invalid_count FROM product_images images
     LEFT JOIN products products ON products.id = images.product_id
     WHERE products.id IS NULL`
  );
  if (Number(images[0].invalid_count) !== 0) {
    throw new Error('Product image rows contain missing product references; inventory was retained.');
  }

  const [verificationRows] = await connection.execute(
    `SELECT id, price_etb, stock_m3 FROM products WHERE id IN (${migrated.map(() => '?').join(',') || 'NULL'})`,
    migrated.map((row) => row.productId)
  );
  const verified = new Map(verificationRows.map((row) => [Number(row.id), row]));
  for (const row of migrated) {
    const saved = verified.get(row.productId);
    if (!saved || Number(saved.price_etb) !== row.price || Number(saved.stock_m3) !== row.stock) {
      throw new Error(`Product ${row.productId} numeric inventory verification failed; source table retained.`);
    }
  }

  return { rows: inventoryRows.length, productIds: migrated.map((row) => row.productId) };
}

async function ensureContentFeatures(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS content_features (
      section VARCHAR(50) NOT NULL,
      id INT NOT NULL,
      icon VARCHAR(100) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      title_am VARCHAR(255) NOT NULL DEFAULT '',
      title_om VARCHAR(255) NOT NULL DEFAULT '',
      description_en TEXT NOT NULL,
      description_am TEXT,
      description_om TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      PRIMARY KEY (section, id),
      KEY idx_content_features_order (section, sort_order, id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function migrateTenderBudget(connection) {
  if (!(await tableExists(connection, 'tenders')) || !(await columnExists(connection, 'tenders', 'budget'))) return;
  const [negative] = await connection.execute('SELECT COUNT(*) AS item_count FROM tenders WHERE budget < 0');
  if (Number(negative[0].item_count)) throw new Error('Negative tender budgets found; refusing the monetary type migration.');
  const [columns] = await connection.execute(
    `SELECT data_type FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'tenders' AND column_name = 'budget'`
  );
  if (columns[0].data_type.toLowerCase() !== 'decimal') {
    await connection.execute('ALTER TABLE tenders MODIFY budget DECIMAL(21,2) NOT NULL DEFAULT 0');
  }
  const [constraints] = await connection.execute(
    `SELECT COUNT(*) AS item_count FROM information_schema.table_constraints
     WHERE constraint_schema = DATABASE() AND table_name = 'tenders'
       AND constraint_name = 'chk_tenders_budget_nonnegative'`
  );
  if (Number(constraints[0].item_count) === 0) {
    await connection.execute('ALTER TABLE tenders ADD CONSTRAINT chk_tenders_budget_nonnegative CHECK (budget >= 0)');
  }
}

async function migrateHomeFeatures(connection) {
  if (!(await tableExists(connection, 'home_why_choose'))) return 0;
  await ensureContentFeatures(connection);
  const [rows] = await connection.execute('SELECT * FROM home_why_choose ORDER BY sort_order, id');
  for (const row of rows) {
    await connection.execute(
      `INSERT INTO content_features
        (section, id, icon, title_en, title_am, title_om, description_en, description_am, description_om, sort_order)
       VALUES ('home', ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE icon = VALUES(icon), title_en = VALUES(title_en),
         title_am = VALUES(title_am), title_om = VALUES(title_om),
         description_en = VALUES(description_en), description_am = VALUES(description_am),
         description_om = VALUES(description_om), sort_order = VALUES(sort_order)`,
      [row.id, row.icon, row.title_en, row.title_am, row.title_om,
        row.description_en, row.description_am, row.description_om, row.sort_order]
    );
  }

  const [verification] = await connection.execute(
    'SELECT COUNT(*) AS item_count FROM content_features WHERE section = ?',
    ['home']
  );
  if (Number(verification[0].item_count) < rows.length) {
    throw new Error('Home features were not fully copied; legacy table retained.');
  }
  return rows.length;
}

async function countRows(connection, table) {
  const [rows] = await connection.execute(`SELECT COUNT(*) AS item_count FROM \`${table}\``);
  return Number(rows[0].item_count);
}

async function migratePasswords(connection) {
  if (!(await columnExists(connection, 'users', 'password_hash'))) {
    await connection.execute('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL');
  }
  const hasLegacyPassword = await columnExists(connection, 'users', 'password');
  const [users] = await connection.execute(
    `SELECT id, ${hasLegacyPassword ? 'password' : 'NULL AS password'}, password_hash FROM users ORDER BY id`
  );

  for (const user of users) {
    let hash = user.password_hash;
    if (!hash || !/^\$2[aby]\$/.test(hash)) {
      if (!hasLegacyPassword || !user.password) {
        throw new Error(`User ${user.id} has no usable password source; refusing to change the users table.`);
      }
      hash = await bcrypt.hash(user.password, 12);
    }
    if (hasLegacyPassword && user.password && !(await bcrypt.compare(user.password, hash))) {
      throw new Error(`User ${user.id} password-hash verification failed; legacy password column retained.`);
    }
    await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
  }

  const [verifiedUsers] = await connection.execute('SELECT password_hash FROM users');
  if (verifiedUsers.some((user) => !/^\$2[aby]\$/.test(user.password_hash || ''))) {
    throw new Error('Some user passwords are not bcrypt hashes; legacy column retained.');
  }

  await connection.execute('ALTER TABLE users MODIFY password_hash VARCHAR(255) NOT NULL');
  if (hasLegacyPassword) await connection.execute('ALTER TABLE users DROP COLUMN password');
  return users.length;
}

async function validateForeignKeys(connection) {
  const checks = [
    ['product_images', 'product_id', 'products', 'id'],
    ['career_requirements', 'career_id', 'careers', 'id'],
  ];
  for (const [child, foreignKey, parent, primaryKey] of checks) {
    const [rows] = await connection.execute(
      `SELECT COUNT(*) AS orphan_count FROM \`${child}\` child
       LEFT JOIN \`${parent}\` parent ON parent.\`${primaryKey}\` = child.\`${foreignKey}\`
       WHERE parent.\`${primaryKey}\` IS NULL`
    );
    if (Number(rows[0].orphan_count) !== 0) {
      throw new Error(`Found ${rows[0].orphan_count} orphan rows in ${child}; no legacy tables were dropped.`);
    }
  }
}

async function migrate() {
  const backupPath = optionValue('backup');
  const exportOnly = process.argv.includes('--export-only');
  if (!backupPath || !fs.existsSync(backupPath) || fs.statSync(backupPath).size === 0) {
    throw new Error('A non-empty pre-migration backup is required. Pass --backup /path/to/hati_db.sql.');
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hati_db',
  });

  try {
    const [alreadyApplied] = await connection.execute(
      'SELECT COUNT(*) AS item_count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?',
      ['schema_migrations']
    );
    if (Number(alreadyApplied[0].item_count) > 0) {
      const [applied] = await connection.execute(
        'SELECT version FROM schema_migrations WHERE version = ?',
        [MIGRATION_VERSION]
      );
      if (applied.length) {
        console.log(`Migration ${MIGRATION_VERSION} is already applied.`);
        return;
      }
    }

    const exported = await readStaticConfig(connection);
    persistConfigs(exported);
    console.log(`Exported static configuration files: ${Object.keys(exported).join(', ') || 'none'}.`);
    if (exportOnly) return;

    const before = {};
    for (const table of ['products', 'product_images', 'careers', 'career_requirements', 'tenders', 'projects', 'services', 'staff', 'news', 'contacts', 'business_hours', 'certifications']) {
      if (await tableExists(connection, table)) before[table] = await countRows(connection, table);
    }

    await migratePasswords(connection);
    const homeFeatures = await migrateHomeFeatures(connection);
    const inventory = await migrateInventory(connection);
    await migrateTenderBudget(connection);
    await validateForeignKeys(connection);

    for (const [table, expected] of Object.entries(before)) {
      if (await countRows(connection, table) !== expected) {
        throw new Error(`Row count changed unexpectedly in ${table}; legacy tables were retained.`);
      }
    }

    // The checked backup, exported configs, verified hashes, numeric product values,
    // and foreign-key checks are all complete before dropping source tables.
    const dropOrder = [
      'tender_info_paragraphs',
      'tender_info',
      'inventory',
      'benefits',
      'home_hero',
      'home_cta',
      'home_learn_more',
      'section_stats',
      'home_why_choose',
    ];
    for (const table of dropOrder) {
      if (await tableExists(connection, table)) await connection.execute(`DROP TABLE \`${table}\``);
    }

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await connection.execute('INSERT IGNORE INTO schema_migrations (version) VALUES (?)', [MIGRATION_VERSION]);

    console.log(`Migrated ${inventory.rows} inventory rows into products: ${inventory.productIds.join(', ') || 'none'}.`);
    console.log(`Copied ${homeFeatures} home features to content_features; configuration and referential checks passed.`);
    console.log('Architecture migration complete. The original backup remains available at the supplied path.');
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error('Database architecture migration failed:', error.message);
  process.exitCode = 1;
});
