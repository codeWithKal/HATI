# Database architecture

## Runtime schema

The schema is defined in `database/schema.sql`. All tables use InnoDB and `utf8mb4` so Amharic and Afaan Oromoo text is retained.

| Table | Purpose |
| --- | --- |
| `users` | Admin identities with bcrypt `password_hash`, profile image, active status, role, module permissions, login timestamps, and session version. Hashes are never included in API responses. |
| `admin_audit_log` | Actor/target snapshots and non-sensitive details for account, role, status, picture, and password events. |
| `products` | Multilingual products plus `price_etb DECIMAL(12,2)` and `stock_m3 DECIMAL(12,3)`. |
| `product_images` | Ordered product gallery; `product_id` references `products.id` with cascade delete. |
| `services` | Independent multilingual service catalog. |
| `projects` | Independent multilingual projects and lifecycle fields. |
| `careers` | Career posts. |
| `career_requirements` | Ordered multilingual requirements; `career_id` references `careers.id` with cascade delete. |
| `job_applications` | Candidate profile, vacancy reference, workflow status, reviewer, and interview details; vacancy deletion is restricted while applications exist. |
| `application_documents` | Private file metadata; documents are stored outside `public/` and accessed only through an authorized route. |
| `application_status_history` | Append-only application status transitions with actor and timestamp. |
| `application_notes` | Internal reviewer notes, visible only to authorized application managers. |
| `certifications` | Independent certification records. |
| `gallery` | General gallery images and categories. |
| `contacts` | Contact methods and localized details. |
| `business_hours` | Localized opening schedule. |
| `staff` | Staff profiles. |
| `tenders` | Tender opportunities with `budget DECIMAL(21,2)`. |
| `content_features` | Reusable localized features keyed by `(section, id)`; current database section is `home`. |
| `news` | Multilingual news articles. |
| `schema_migrations` | Applied migration versions and timestamps. |

Frequently ordered relationships use composite indexes, including product images, career requirements, features, gallery, staff, contacts, certifications, and news. Prices and stock are numeric and constrained to non-negative values. Product and career child rows have foreign keys with cascade behavior.

## Consolidated and removed data

| Previous data | New location |
| --- | --- |
| `inventory` price/stock and matching names | `products.price_etb`, `products.stock_m3`; multilingual product names remain in `products`. |
| `home_why_choose` | `content_features` with `section = 'home'`. |
| `benefits` | `config/career-benefits.json` because there is no benefits administration workflow. |
| `section_stats` | `config/stats.json`; these statistics were static. |
| `home_hero`, `home_cta`, `home_learn_more` | `config/home.json`. |
| `tender_info`, `tender_info_paragraphs` | `config/tender-info.json`. |

The migration removes those nine old tables after export and validation. Independent entities such as products and product images, careers and requirements, services, projects, tenders, users, and staff remain separate.

## Backup and restore

Before changing an existing database, make and verify a logical backup:

```sh
umask 077
docker exec hati-mysql sh -c 'mariadb-dump --user=root --password="$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers --events --databases hati_db' > /tmp/hati_db_before_architecture_refactor.sql
test -s /tmp/hati_db_before_architecture_refactor.sql
```

The migration requires that non-empty backup path:

```sh
npm run db:migrate -- --backup /tmp/hati_db_before_architecture_refactor.sql
```

To restore the original snapshot, stop application writes first, then import the dump into MariaDB:

```sh
docker exec -i hati-mysql sh -c 'mariadb --user=root --password="$MYSQL_ROOT_PASSWORD"' < /tmp/hati_db_before_architecture_refactor.sql
```

Keep the backup in a protected location until the migrated site has been accepted. Do not run the architecture migration against a fresh/empty production database; apply `database/schema.sql` for new installations.

## Security

Set `DB_PASSWORD` and a random `AUTH_SESSION_SECRET` in the deployment environment. Admin sessions use a signed, HttpOnly, SameSite=Lax cookie and are checked against the current active user and session version on every protected request. User management extends the existing `users` table. The backup-gated migration adds profile, status, role, permissions, session-version fields, and an audit log without replacing user records or password hashes. Apply it with `npm run db:migrate-users -- --backup /path/to/verified-backup.sql`.

Super Admins can manage all accounts and roles. Admins can manage Editor/Staff accounts but cannot grant elevated roles. Editors can reach only modules in their stored `permissions` array; write APIs enforce those permissions. Deactivating or resetting a password increments `auth_version`, invalidating existing sessions. The last active Super Admin cannot be demoted, deactivated, or deleted. Validated avatars are stored under `public/uploads/avatars/`.

Recruitment adds `application_deadline`, `vacancies`, `vacancy_status`, and localized description fields to the existing `careers` table. The repeatable, backup-gated migration is `npm run db:migrate-recruitment -- --backup /path/to/verified-backup.sql`. It is additive, so a code rollback can leave its fields and tables in place. Restoring the old full snapshot removes applications submitted after that backup; export those records and private files first if they must be retained. Applications are unique by vacancy and normalized email. Private CVs and supporting documents are stored under `storage/private/applications/`; provide persistent storage and include it in encrypted backups for deployment. Status transitions, reviewer changes, internal notes, and note edits are recorded in recruitment history or the admin audit log.
