-- HATI MySQL Relational Database Schema
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS hati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hati_db;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'admin',
  profile_image VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  permissions JSON NULL,
  auth_version INT UNSIGNED NOT NULL DEFAULT 1,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_users_role_active (role, is_active, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_audit_log (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255) DEFAULT '',
  name_om VARCHAR(255) DEFAULT '',
  description_en TEXT NOT NULL,
  description_am TEXT,
  description_om TEXT,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  price_etb DECIMAL(12,2) NULL,
  stock_m3 DECIMAL(12,3) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_products_sort (sort_order, id),
  CONSTRAINT chk_products_price_nonnegative CHECK (price_etb IS NULL OR price_etb >= 0),
  CONSTRAINT chk_products_stock_nonnegative CHECK (stock_m3 IS NULL OR stock_m3 >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Product Images (Relational 1-to-many)
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  KEY idx_product_images_parent_order (product_id, sort_order),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255) DEFAULT '',
  name_om VARCHAR(255) DEFAULT '',
  description_en TEXT NOT NULL,
  description_am TEXT,
  description_om TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  description_en TEXT,
  description_am TEXT,
  description_om TEXT,
  location_en VARCHAR(255),
  location_am VARCHAR(255) DEFAULT '',
  location_om VARCHAR(255) DEFAULT '',
  start_date DATE,
  end_date DATE NULL,
  status VARCHAR(50) DEFAULT 'ongoing',
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Careers Table
CREATE TABLE IF NOT EXISTS careers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  location_en VARCHAR(255),
  location_am VARCHAR(255) DEFAULT '',
  location_om VARCHAR(255) DEFAULT '',
  type_en VARCHAR(100),
  type_am VARCHAR(100) DEFAULT '',
  type_om VARCHAR(100) DEFAULT '',
  department_en VARCHAR(100),
  department_am VARCHAR(100) DEFAULT '',
  department_om VARCHAR(100) DEFAULT '',
  experience_en VARCHAR(100),
  experience_am VARCHAR(100) DEFAULT '',
  experience_om VARCHAR(100) DEFAULT '',
  posted DATE,
  is_active BOOLEAN DEFAULT TRUE,
  description_en TEXT,
  description_am TEXT,
  description_om TEXT,
  responsibilities_en TEXT,
  responsibilities_am TEXT,
  responsibilities_om TEXT,
  qualifications_en TEXT,
  qualifications_am TEXT,
  qualifications_om TEXT,
  skills_en TEXT,
  skills_am TEXT,
  skills_om TEXT,
  application_deadline DATE NULL,
  vacancies SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  vacancy_status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Career Requirements (Relational 1-to-many)
CREATE TABLE IF NOT EXISTS career_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  career_id INT NOT NULL,
  requirement_en TEXT NOT NULL,
  requirement_am TEXT,
  requirement_om TEXT,
  sort_order INT DEFAULT 0,
  KEY idx_career_requirements_parent_order (career_id, sort_order),
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_applications (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_documents (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_status_history (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_notes (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  issuer_en VARCHAR(255) NOT NULL,
  issuer_am VARCHAR(255) DEFAULT '',
  issuer_om VARCHAR(255) DEFAULT '',
  year INT NOT NULL,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  KEY idx_certifications_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'projects',
  sort_order INT DEFAULT 0,
  KEY idx_gallery_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  details_en TEXT NOT NULL,
  details_am TEXT,
  details_om TEXT,
  badge_en VARCHAR(100),
  badge_am VARCHAR(100) DEFAULT '',
  badge_om VARCHAR(100) DEFAULT '',
  badge_icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  KEY idx_contacts_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Business Hours Table
CREATE TABLE IF NOT EXISTS business_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_en VARCHAR(100) NOT NULL,
  day_am VARCHAR(100) DEFAULT '',
  day_om VARCHAR(100) DEFAULT '',
  hours_en VARCHAR(100) NOT NULL,
  hours_am VARCHAR(100) DEFAULT '',
  hours_om VARCHAR(100) DEFAULT '',
  is_open BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  KEY idx_business_hours_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255) DEFAULT '',
  name_om VARCHAR(255) DEFAULT '',
  position_en VARCHAR(255) NOT NULL,
  position_am VARCHAR(255) DEFAULT '',
  position_om VARCHAR(255) DEFAULT '',
  department_en VARCHAR(255),
  department_am VARCHAR(255) DEFAULT '',
  department_om VARCHAR(255) DEFAULT '',
  bio_en TEXT,
  bio_am TEXT,
  bio_om TEXT,
  experience VARCHAR(50),
  avatar VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(100),
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_staff_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Tenders Table
CREATE TABLE IF NOT EXISTS tenders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  description_en TEXT,
  description_am TEXT,
  description_om TEXT,
  budget DECIMAL(21,2) NOT NULL DEFAULT 0,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'open',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_tenders_budget_nonnegative CHECK (budget >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Reusable editorial features. `section` distinguishes home features from
-- other curated feature groups without coupling content to page-specific tables.
CREATE TABLE IF NOT EXISTS content_features (
  section VARCHAR(50) NOT NULL,
  id INT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  description_en TEXT NOT NULL,
  description_am TEXT,
  description_om TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (section, id),
  KEY idx_content_features_order (section, sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. News Table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) DEFAULT '',
  title_om VARCHAR(255) DEFAULT '',
  excerpt_en TEXT,
  excerpt_am TEXT,
  excerpt_om TEXT,
  content_en LONGTEXT,
  content_am LONGTEXT,
  content_om LONGTEXT,
  author VARCHAR(255) DEFAULT 'Admin',
  date DATE,
  category VARCHAR(100) DEFAULT 'company',
  image VARCHAR(500) DEFAULT '',
  read_time VARCHAR(50) DEFAULT '3 min read',
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_news_date_id (date, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Applied architecture migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
