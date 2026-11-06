# HATI

HATI is a Next.js application backed by MariaDB/MySQL. Dynamic editorial and business records are stored in the database through `lib/repositories.ts`; static multilingual content is stored in `config/`.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set a unique `DB_PASSWORD` and `AUTH_SESSION_SECRET`.
3. Start MariaDB with `docker compose up -d db`.
4. For an existing database, follow the backup and migration instructions below.
5. To create an administrator on a fresh install, set `ADMIN_SEED_EMAIL`, `ADMIN_SEED_NAME`, and a unique `ADMIN_SEED_PASSWORD` of at least 12 characters, then run `npm run db:seed`. This command does not overwrite existing accounts or content.

## Recruitment applications

Before adding recruitment fields and tables to an existing database, create a protected database dump and verify it is non-empty:

```sh
umask 077
docker exec hati-mysql sh -c 'mariadb-dump --user=root --password="$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers --events --databases hati_db' > /tmp/hati_db_before_recruitment.sql
test -s /tmp/hati_db_before_recruitment.sql
npm run db:migrate-recruitment -- --backup /tmp/hati_db_before_recruitment.sql
```

The migration keeps current vacancies and requirements, adds deadline/publish fields, and creates application, private document, status-history, and internal-note tables. The migration is additive, so a code rollback can leave the new fields and tables in place without losing new applications. To restore the exact pre-migration database snapshot, stop application writes first; this also removes any data submitted since the backup, so export that new data before restoring if it must be retained:

```sh
docker exec -i hati-mysql sh -c 'mariadb --user=root --password="$MYSQL_ROOT_PASSWORD"' < /tmp/hati_db_before_recruitment.sql
```

Application documents are stored outside `public/` under `storage/private/applications/` and must be on persistent storage with backups in production. The project has no configured mail transport; candidate notifications beyond the on-page reference receipt require an SMTP/provider integration and a verified sender address.
6. Start the app with `npm run dev`.

## Existing database migration

Make a full logical backup before migration:

```sh
umask 077
docker exec hati-mysql sh -c 'mariadb-dump --user=root --password="$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers --events --databases hati_db' > /tmp/hati_db_before_architecture_refactor.sql
test -s /tmp/hati_db_before_architecture_refactor.sql
```

Run the repeatable, backup-gated migration:

```sh
npm run db:migrate -- --backup /tmp/hati_db_before_architecture_refactor.sql
npm run db:migrate-users -- --backup /tmp/hati_db_before_user_management.sql
npm run db:test
```

It exports static content, transfers numeric inventory to products, migrates passwords to bcrypt, verifies preserved records and relationships, and drops legacy tables only after checks pass. See [database/ARCHITECTURE.md](database/ARCHITECTURE.md) for the resulting schema, table mapping, and restore details.

The user-management schema upgrade is separately backup-gated. Take a fresh dump before applying it; it extends the existing `users` table and creates the account audit log without replacing users or password hashes.

## Validation

- `npm run db:test` checks migrated product values, image links, bcrypt hashes, table structure, and a transactional product/image insert.
- `npm run test:api` checks public endpoints, authentication, and admin CRUD routes. It creates and removes a temporary admin and temporary records; run it while the app is available at `http://127.0.0.1:3000`.
- `npm run test:user-management` exercises account creation, role/module limits, profile and avatar handling, password changes and resets, session invalidation, deactivation, deletion, and audit events. It uses temporary accounts and removes them afterward.
- `npm run build` creates a production build.
- `npm run lint` is configured as an ESLint command, but this repository currently has no ESLint configuration or declared ESLint dependency.

Production deployments must set `DB_PASSWORD` and a random `AUTH_SESSION_SECRET`; the app refuses to start in production without them.
