import { query } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import homeConfig from '@/config/home.json';
import statsConfig from '@/config/stats.json';
import careerBenefits from '@/config/career-benefits.json';
import tenderInfoConfig from '@/config/tender-info.json';
import bcrypt from 'bcryptjs';

const tVal = (obj: any, lang: string, fallback = '') => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[lang] !== undefined ? obj[lang] : (obj.en || fallback);
};

const formatDate = (date: any): string => {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return String(date);
};

type StatsSection = 'home' | 'projects' | 'gallery' | 'staff';
const getSectionStats = (section: StatsSection, includeIcon = true) =>
  statsConfig[section].map((stat) => ({
    ...stat,
    id: String(stat.id),
    ...(!includeIcon ? { icon: undefined } : {}),
  }));

// ---------------- PRODUCTS ----------------
export async function getProducts() {
  const products = await query<RowDataPacket[]>('SELECT * FROM products ORDER BY id ASC');
  const images = await query<RowDataPacket[]>('SELECT * FROM product_images ORDER BY product_id ASC, sort_order ASC');
  
  const imageMap = new Map<number, string[]>();
  for (const img of images) {
    const list = imageMap.get(img.product_id) || [];
    list.push(img.image_url);
    imageMap.set(img.product_id, list);
  }

  return products.map((p) => ({
    id: String(p.id),
    name: { en: p.name_en, am: p.name_am, om: p.name_om },
    description: { en: p.description_en, am: p.description_am, om: p.description_om },
    category: p.category,
    image: p.image,
    images: imageMap.get(p.id) || (p.image ? [p.image] : []),
    priceEtb: p.price_etb === null ? null : Number(p.price_etb),
    stockM3: p.stock_m3 === null ? null : Number(p.stock_m3),
  }));
}

export async function getProductById(id: string | number) {
  const products = await query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
  if (!products.length) return null;
  const p = products[0];
  const images = await query<RowDataPacket[]>('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [p.id]);

  return {
    id: String(p.id),
    name: { en: p.name_en, am: p.name_am, om: p.name_om },
    description: { en: p.description_en, am: p.description_am, om: p.description_om },
    category: p.category,
    image: p.image,
    images: images.length ? images.map((i) => i.image_url) : (p.image ? [p.image] : []),
    priceEtb: p.price_etb === null ? null : Number(p.price_etb),
    stockM3: p.stock_m3 === null ? null : Number(p.stock_m3),
  };
}

export async function saveProduct(product: any) {
  const name_en = tVal(product.name, 'en');
  const name_am = tVal(product.name, 'am');
  const name_om = tVal(product.name, 'om');
  const description_en = tVal(product.description, 'en');
  const description_am = tVal(product.description, 'am');
  const description_om = tVal(product.description, 'om');
  const category = product.category || 'materials';
  const image = product.image || (Array.isArray(product.images) && product.images[0]) || '';
  const priceEtb = product.priceEtb == null || product.priceEtb === '' ? null : Number(product.priceEtb);
  const stockM3 = product.stockM3 == null || product.stockM3 === '' ? null : Number(product.stockM3);

  let productId = Number(product.id);
  if (productId) {
    await query(
      `UPDATE products 
       SET name_en = ?, name_am = ?, name_om = ?, description_en = ?, description_am = ?, description_om = ?, category = ?, image = ?,
           price_etb = IF(?, ?, price_etb), stock_m3 = IF(?, ?, stock_m3)
       WHERE id = ?`,
      [name_en, name_am, name_om, description_en, description_am, description_om, category, image,
        Object.hasOwn(product, 'priceEtb'), priceEtb, Object.hasOwn(product, 'stockM3'), stockM3, productId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO products (name_en, name_am, name_om, description_en, description_am, description_om, category, image, price_etb, stock_m3)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_am, name_om, description_en, description_am, description_om, category, image, priceEtb, stockM3]
    );
    productId = result.insertId;
  }

  if (Array.isArray(product.images)) {
    await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    let order = 0;
    for (const imgUrl of product.images) {
      await query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)', [
        productId,
        imgUrl,
        order++,
      ]);
    }
  }

  return getProductById(productId);
}

export async function deleteProduct(id: string | number) {
  await query('DELETE FROM products WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- SERVICES ----------------
export async function getServices() {
  const services = await query<RowDataPacket[]>('SELECT * FROM services ORDER BY id ASC');
  return services.map((s) => ({
    id: String(s.id),
    name: { en: s.name_en, am: s.name_am, om: s.name_om },
    description: { en: s.description_en, am: s.description_am, om: s.description_om },
    isActive: Boolean(s.is_active),
  }));
}

export async function saveService(service: any) {
  const name_en = tVal(service.name, 'en');
  const name_am = tVal(service.name, 'am');
  const name_om = tVal(service.name, 'om');
  const description_en = tVal(service.description, 'en');
  const description_am = tVal(service.description, 'am');
  const description_om = tVal(service.description, 'om');
  const isActive = service.isActive !== false;

  let serviceId = Number(service.id);
  if (serviceId) {
    await query(
      `UPDATE services 
       SET name_en = ?, name_am = ?, name_om = ?, description_en = ?, description_am = ?, description_om = ?, is_active = ? 
       WHERE id = ?`,
      [name_en, name_am, name_om, description_en, description_am, description_om, isActive, serviceId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO services (name_en, name_am, name_om, description_en, description_am, description_om, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_am, name_om, description_en, description_am, description_om, isActive]
    );
    serviceId = result.insertId;
  }

  return { id: String(serviceId), name: service.name, description: service.description, isActive };
}

export async function deleteService(id: string | number) {
  await query('DELETE FROM services WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- PROJECTS & STATS ----------------
export async function getProjects() {
  const projects = await query<RowDataPacket[]>('SELECT * FROM projects ORDER BY id ASC');
  return projects.map((p) => ({
    id: String(p.id),
    title: { en: p.title_en, am: p.title_am, om: p.title_om },
    description: { en: p.description_en, am: p.description_am, om: p.description_om },
    location: { en: p.location_en, am: p.location_am, om: p.location_om },
    startDate: formatDate(p.start_date),
    endDate: p.end_date ? formatDate(p.end_date) : null,
    status: p.status,
    image: p.image,
    isActive: Boolean(p.is_active),
  }));
}

export async function getProjectStats() {
  return getSectionStats('projects');
}

export async function saveProject(project: any) {
  const title_en = tVal(project.title, 'en');
  const title_am = tVal(project.title, 'am');
  const title_om = tVal(project.title, 'om');
  const description_en = tVal(project.description, 'en');
  const description_am = tVal(project.description, 'am');
  const description_om = tVal(project.description, 'om');
  const location_en = tVal(project.location, 'en');
  const location_am = tVal(project.location, 'am');
  const location_om = tVal(project.location, 'om');
  const startDate = project.startDate || null;
  const endDate = project.endDate || null;
  const status = project.status || 'ongoing';
  const image = project.image || '🏗️';
  const isActive = project.isActive !== false;

  let projectId = Number(project.id);
  if (projectId) {
    await query(
      `UPDATE projects 
       SET title_en = ?, title_am = ?, title_om = ?, description_en = ?, description_am = ?, description_om = ?,
           location_en = ?, location_am = ?, location_om = ?, start_date = ?, end_date = ?, status = ?, image = ?, is_active = ?
       WHERE id = ?`,
      [title_en, title_am, title_om, description_en, description_am, description_om, location_en, location_am, location_om, startDate, endDate, status, image, isActive, projectId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO projects (title_en, title_am, title_om, description_en, description_am, description_om, location_en, location_am, location_om, start_date, end_date, status, image, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_am, title_om, description_en, description_am, description_om, location_en, location_am, location_om, startDate, endDate, status, image, isActive]
    );
    projectId = result.insertId;
  }

  return { id: String(projectId), ...project };
}

export async function deleteProject(id: string | number) {
  await query('DELETE FROM projects WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- CAREERS & BENEFITS ----------------
export async function getCareers() {
  const careers = await query<RowDataPacket[]>(`SELECT c.*,
    (SELECT COUNT(*) FROM job_applications a WHERE a.career_id = c.id) AS application_count
    FROM careers c ORDER BY c.id ASC`);
  const requirements = await query<RowDataPacket[]>('SELECT * FROM career_requirements ORDER BY career_id ASC, sort_order ASC');

  const reqMap = new Map<number, { en: string[]; am: string[]; om: string[] }>();
  for (const r of requirements) {
    const existing = reqMap.get(r.career_id) || { en: [], am: [], om: [] };
    if (r.requirement_en) existing.en.push(r.requirement_en);
    if (r.requirement_am) existing.am.push(r.requirement_am);
    if (r.requirement_om) existing.om.push(r.requirement_om);
    reqMap.set(r.career_id, existing);
  }

  return careers.map((c) => ({
    id: String(c.id),
    title: { en: c.title_en, am: c.title_am, om: c.title_om },
    location: { en: c.location_en, am: c.location_am, om: c.location_om },
    type: { en: c.type_en, am: c.type_am, om: c.type_om },
    department: { en: c.department_en, am: c.department_am, om: c.department_om },
    experience: { en: c.experience_en, am: c.experience_am, om: c.experience_om },
    posted: formatDate(c.posted),
    isActive: Boolean(c.is_active),
    description: { en: c.description_en, am: c.description_am, om: c.description_om },
    responsibilities: { en: c.responsibilities_en || '', am: c.responsibilities_am || '', om: c.responsibilities_om || '' },
    qualifications: { en: c.qualifications_en || '', am: c.qualifications_am || '', om: c.qualifications_om || '' },
    skills: { en: c.skills_en || '', am: c.skills_am || '', om: c.skills_om || '' },
    applicationDeadline: formatDate(c.application_deadline) || null,
    vacancies: Number(c.vacancies || 1), vacancyStatus: c.vacancy_status || 'open',
    applicationCount: Number(c.application_count || 0),
    requirements: reqMap.get(c.id) || { en: [], am: [], om: [] },
  }));
}

export async function getBenefits() {
  return careerBenefits;
}

export async function saveCareer(career: any) {
  const title_en = tVal(career.title, 'en');
  const title_am = tVal(career.title, 'am');
  const title_om = tVal(career.title, 'om');
  const location_en = tVal(career.location, 'en');
  const location_am = tVal(career.location, 'am');
  const location_om = tVal(career.location, 'om');
  const type_en = tVal(career.type, 'en');
  const type_am = tVal(career.type, 'am');
  const type_om = tVal(career.type, 'om');
  const department_en = tVal(career.department, 'en');
  const department_am = tVal(career.department, 'am');
  const department_om = tVal(career.department, 'om');
  const experience_en = tVal(career.experience, 'en');
  const experience_am = tVal(career.experience, 'am');
  const experience_om = tVal(career.experience, 'om');
  const posted = career.posted || new Date().toISOString().split('T')[0];
  const isActive = career.isActive !== false;
  const description_en = tVal(career.description, 'en');
  const description_am = tVal(career.description, 'am');
  const description_om = tVal(career.description, 'om');
  const responsibilities_en = tVal(career.responsibilities, 'en');
  const responsibilities_am = tVal(career.responsibilities, 'am');
  const responsibilities_om = tVal(career.responsibilities, 'om');
  const qualifications_en = tVal(career.qualifications, 'en');
  const qualifications_am = tVal(career.qualifications, 'am');
  const qualifications_om = tVal(career.qualifications, 'om');
  const skills_en = tVal(career.skills, 'en');
  const skills_am = tVal(career.skills, 'am');
  const skills_om = tVal(career.skills, 'om');
  const applicationDeadline = career.applicationDeadline || null;
  const vacancies = Math.min(999, Math.max(1, Number(career.vacancies) || 1));
  const vacancyStatus = career.vacancyStatus === 'closed' ? 'closed' : 'open';

  let careerId = Number(career.id);
  if (careerId) {
    await query(
      `UPDATE careers 
       SET title_en = ?, title_am = ?, title_om = ?, location_en = ?, location_am = ?, location_om = ?,
           type_en = ?, type_am = ?, type_om = ?, department_en = ?, department_am = ?, department_om = ?,
           experience_en = ?, experience_am = ?, experience_om = ?, posted = ?, is_active = ?,
           description_en = ?, description_am = ?, description_om = ?,
           responsibilities_en = ?, responsibilities_am = ?, responsibilities_om = ?,
           qualifications_en = ?, qualifications_am = ?, qualifications_om = ?,
           skills_en = ?, skills_am = ?, skills_om = ?, application_deadline = ?, vacancies = ?, vacancy_status = ?
       WHERE id = ?`,
      [title_en, title_am, title_om, location_en, location_am, location_om, type_en, type_am, type_om, department_en, department_am, department_om, experience_en, experience_am, experience_om, posted, isActive, description_en, description_am, description_om, responsibilities_en, responsibilities_am, responsibilities_om, qualifications_en, qualifications_am, qualifications_om, skills_en, skills_am, skills_om, applicationDeadline, vacancies, vacancyStatus, careerId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO careers (title_en, title_am, title_om, location_en, location_am, location_om, type_en, type_am, type_om, department_en, department_am, department_om, experience_en, experience_am, experience_om, posted, is_active, description_en, description_am, description_om, responsibilities_en, responsibilities_am, responsibilities_om, qualifications_en, qualifications_am, qualifications_om, skills_en, skills_am, skills_om, application_deadline, vacancies, vacancy_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_am, title_om, location_en, location_am, location_om, type_en, type_am, type_om, department_en, department_am, department_om, experience_en, experience_am, experience_om, posted, isActive, description_en, description_am, description_om, responsibilities_en, responsibilities_am, responsibilities_om, qualifications_en, qualifications_am, qualifications_om, skills_en, skills_am, skills_om, applicationDeadline, vacancies, vacancyStatus]
    );
    careerId = result.insertId;
  }

  if (career.requirements) {
    await query('DELETE FROM career_requirements WHERE career_id = ?', [careerId]);
    const reqEn = career.requirements.en || [];
    const reqAm = career.requirements.am || [];
    const reqOm = career.requirements.om || [];
    const maxLen = Math.max(reqEn.length, reqAm.length, reqOm.length);
    for (let i = 0; i < maxLen; i++) {
      await query(
        'INSERT INTO career_requirements (career_id, requirement_en, requirement_am, requirement_om, sort_order) VALUES (?, ?, ?, ?, ?)',
        [careerId, reqEn[i] || '', reqAm[i] || '', reqOm[i] || '', i]
      );
    }
  }

  return { id: String(careerId), ...career };
}

export async function deleteCareer(id: string | number) {
  const applications = await query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM job_applications WHERE career_id = ?', [id]);
  if (Number(applications[0]?.total) > 0) throw new Error('This vacancy has applications. Close or unpublish it to preserve the application history.');
  await query('DELETE FROM careers WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- CERTIFICATIONS ----------------
export async function getCertifications() {
  const certs = await query<RowDataPacket[]>('SELECT * FROM certifications ORDER BY sort_order ASC, id ASC');
  return certs.map((c) => ({
    id: Number(c.id),
    title: { en: c.title_en, am: c.title_am, om: c.title_om },
    issuer: { en: c.issuer_en, am: c.issuer_am, om: c.issuer_om },
    year: Number(c.year),
    image: c.image,
  }));
}

// ---------------- GALLERY & STATS ----------------
export async function getGallery() {
  const gallery = await query<RowDataPacket[]>('SELECT * FROM gallery ORDER BY sort_order ASC, id ASC');
  return gallery.map((g) => ({
    id: Number(g.id),
    image: g.image,
    category: g.category,
  }));
}

export async function getGalleryStats() {
  return getSectionStats('gallery');
}

export async function saveGalleryItem(item: any) {
  let id = Number(item.id);
  if (id) {
    await query('UPDATE gallery SET image = ?, category = ? WHERE id = ?', [item.image, item.category || 'projects', id]);
  } else {
    const result = await query<ResultSetHeader>('INSERT INTO gallery (image, category) VALUES (?, ?)', [item.image, item.category || 'projects']);
    id = result.insertId;
  }
  return { id, image: item.image, category: item.category || 'projects' };
}

export async function deleteGalleryItem(id: string | number) {
  await query('DELETE FROM gallery WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- CONTACTS & BUSINESS HOURS ----------------
export async function getContacts() {
  const contacts = await query<RowDataPacket[]>('SELECT * FROM contacts ORDER BY sort_order ASC, id ASC');
  return contacts.map((c) => ({
    id: String(c.id),
    type: c.type,
    icon: c.icon,
    title: { en: c.title_en, am: c.title_am, om: c.title_om },
    details: { en: c.details_en, am: c.details_am, om: c.details_om },
    badge: { en: c.badge_en, am: c.badge_am, om: c.badge_om },
    badgeIcon: c.badge_icon,
    isActive: Boolean(c.is_active),
  }));
}

export async function getBusinessHours() {
  const hours = await query<RowDataPacket[]>('SELECT * FROM business_hours ORDER BY sort_order ASC, id ASC');
  return hours.map((h) => ({
    id: String(h.id),
    day: { en: h.day_en, am: h.day_am, om: h.day_om },
    hours: { en: h.hours_en, am: h.hours_am, om: h.hours_om },
    isOpen: Boolean(h.is_open),
  }));
}

export async function saveContact(contact: any) {
  const title_en = tVal(contact.title, 'en');
  const title_am = tVal(contact.title, 'am');
  const title_om = tVal(contact.title, 'om');
  const details_en = tVal(contact.details, 'en');
  const details_am = tVal(contact.details, 'am');
  const details_om = tVal(contact.details, 'om');
  const badge_en = tVal(contact.badge, 'en');
  const badge_am = tVal(contact.badge, 'am');
  const badge_om = tVal(contact.badge, 'om');
  const type = contact.type || 'general';
  const icon = contact.icon || 'MapPin';
  const badgeIcon = contact.badgeIcon || '';
  const isActive = contact.isActive !== false;

  let contactId = Number(contact.id);
  if (contactId) {
    await query(
      `UPDATE contacts 
       SET type = ?, icon = ?, title_en = ?, title_am = ?, title_om = ?,
           details_en = ?, details_am = ?, details_om = ?,
           badge_en = ?, badge_am = ?, badge_om = ?, badge_icon = ?, is_active = ?
       WHERE id = ?`,
      [type, icon, title_en, title_am, title_om, details_en, details_am, details_om, badge_en, badge_am, badge_om, badgeIcon, isActive, contactId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO contacts (type, icon, title_en, title_am, title_om, details_en, details_am, details_om, badge_en, badge_am, badge_om, badge_icon, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, icon, title_en, title_am, title_om, details_en, details_am, details_om, badge_en, badge_am, badge_om, badgeIcon, isActive]
    );
    contactId = result.insertId;
  }

  return { id: String(contactId), ...contact };
}

export async function deleteContact(id: string | number) {
  await query('DELETE FROM contacts WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- STAFF & STATS ----------------
export async function getStaff() {
  const staff = await query<RowDataPacket[]>('SELECT * FROM staff ORDER BY sort_order ASC, id ASC');
  return staff.map((s) => ({
    id: String(s.id),
    name: { en: s.name_en, am: s.name_am, om: s.name_om },
    position: { en: s.position_en, am: s.position_am, om: s.position_om },
    department: { en: s.department_en, am: s.department_am, om: s.department_om },
    bio: { en: s.bio_en, am: s.bio_am, om: s.bio_om },
    experience: s.experience,
    avatar: s.avatar,
    email: s.email,
    phone: s.phone,
    image: s.image,
    isActive: Boolean(s.is_active),
  }));
}

export async function getStaffStats() {
  return getSectionStats('staff');
}

export async function saveStaff(member: any) {
  const name_en = tVal(member.name, 'en');
  const name_am = tVal(member.name, 'am');
  const name_om = tVal(member.name, 'om');
  const position_en = tVal(member.position, 'en');
  const position_am = tVal(member.position, 'am');
  const position_om = tVal(member.position, 'om');
  const department_en = tVal(member.department, 'en');
  const department_am = tVal(member.department, 'am');
  const department_om = tVal(member.department, 'om');
  const bio_en = tVal(member.bio, 'en');
  const bio_am = tVal(member.bio, 'am');
  const bio_om = tVal(member.bio, 'om');
  const experience = String(member.experience || '');
  const avatar = member.avatar || '';
  const email = member.email || '';
  const phone = member.phone || '';
  const image = member.image || '';
  const isActive = member.isActive !== false;

  let memberId = Number(member.id);
  if (memberId) {
    await query(
      `UPDATE staff 
       SET name_en = ?, name_am = ?, name_om = ?, position_en = ?, position_am = ?, position_om = ?,
           department_en = ?, department_am = ?, department_om = ?, bio_en = ?, bio_am = ?, bio_om = ?,
           experience = ?, avatar = ?, email = ?, phone = ?, image = IF(?, ?, image), is_active = ?
       WHERE id = ?`,
      [name_en, name_am, name_om, position_en, position_am, position_om, department_en, department_am, department_om, bio_en, bio_am, bio_om, experience, avatar, email, phone, Object.hasOwn(member, 'image'), image, isActive, memberId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO staff (name_en, name_am, name_om, position_en, position_am, position_om, department_en, department_am, department_om, bio_en, bio_am, bio_om, experience, avatar, email, phone, image, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_am, name_om, position_en, position_am, position_om, department_en, department_am, department_om, bio_en, bio_am, bio_om, experience, avatar, email, phone, image, isActive]
    );
    memberId = result.insertId;
  }

  return { id: String(memberId), ...member };
}

export async function deleteStaff(id: string | number) {
  await query('DELETE FROM staff WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- TENDERS & INFO ----------------
export async function getTenders() {
  const tenders = await query<RowDataPacket[]>('SELECT * FROM tenders ORDER BY id ASC');
  return tenders.map((t) => ({
    id: String(t.id),
    title: { en: t.title_en, am: t.title_am, om: t.title_om },
    description: { en: t.description_en, am: t.description_am, om: t.description_om },
    budget: Number(t.budget),
    deadline: formatDate(t.deadline),
    status: t.status,
    isActive: Boolean(t.is_active),
  }));
}

export async function getTenderInfo() {
  return tenderInfoConfig;
}

export async function saveTender(tender: any) {
  const title_en = tVal(tender.title, 'en');
  const title_am = tVal(tender.title, 'am');
  const title_om = tVal(tender.title, 'om');
  const description_en = tVal(tender.description, 'en');
  const description_am = tVal(tender.description, 'am');
  const description_om = tVal(tender.description, 'om');
  const budget = Number(tender.budget) || 0;
  const deadline = tender.deadline || null;
  const status = tender.status || 'open';
  const isActive = tender.isActive !== false;

  let tenderId = Number(tender.id);
  if (tenderId) {
    await query(
      `UPDATE tenders 
       SET title_en = ?, title_am = ?, title_om = ?, description_en = ?, description_am = ?, description_om = ?,
           budget = ?, deadline = ?, status = ?, is_active = ?
       WHERE id = ?`,
      [title_en, title_am, title_om, description_en, description_am, description_om, budget, deadline, status, isActive, tenderId]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO tenders (title_en, title_am, title_om, description_en, description_am, description_om, budget, deadline, status, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_am, title_om, description_en, description_am, description_om, budget, deadline, status, isActive]
    );
    tenderId = result.insertId;
  }

  return { id: String(tenderId), ...tender };
}

export async function deleteTender(id: string | number) {
  await query('DELETE FROM tenders WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- INVENTORY ----------------
export async function getInventory() {
  const items = await query<RowDataPacket[]>(`SELECT id, name_en, name_am, name_om, price_etb, stock_m3
    FROM products WHERE price_etb IS NOT NULL OR stock_m3 IS NOT NULL ORDER BY sort_order ASC, id ASC`);
  return items.map((inv) => ({
    id: Number(inv.id),
    materialName: { en: inv.name_en, am: inv.name_am, om: inv.name_om },
    price_in_m3: { en: `${Number(inv.price_etb || 0).toLocaleString('en-US')} ETB`, am: `${Number(inv.price_etb || 0).toLocaleString('en-US')} ብር`, om: `Qarshii ${Number(inv.price_etb || 0).toLocaleString('en-US')}` },
    stokeRemaining_in_m3: { en: `${Number(inv.stock_m3 || 0).toLocaleString('en-US')} m³`, am: `${Number(inv.stock_m3 || 0).toLocaleString('en-US')} ሜ³`, om: `${Number(inv.stock_m3 || 0).toLocaleString('en-US')} m³` },
  }));
}

export async function saveInventory(item: any) {
  const numeric = (value: any) => {
    const parsed = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(parsed) || parsed < 0) throw new Error('Price and stock must be non-negative numbers');
    return parsed;
  };
  const price = numeric(tVal(item.price_in_m3, 'en'));
  const stock = numeric(tVal(item.stokeRemaining_in_m3, 'en'));
  let id = Number(item.id);
  if (id) {
    await query(
      `UPDATE products SET name_en = ?, name_am = ?, name_om = ?, price_etb = ?, stock_m3 = ? WHERE id = ?`,
      [tVal(item.materialName, 'en'), tVal(item.materialName, 'am'), tVal(item.materialName, 'om'), price, stock, id]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO products (name_en, name_am, name_om, description_en, description_am, description_om, category, image, price_etb, stock_m3)
       VALUES (?, ?, ?, '', '', '', 'materials', '', ?, ?)`,
      [tVal(item.materialName, 'en'), tVal(item.materialName, 'am'), tVal(item.materialName, 'om'), price, stock]
    );
    id = result.insertId;
  }

  return { id, ...(await getInventory()).find((row) => row.id === id) };
}

export async function deleteInventory(id: string | number) {
  await query('UPDATE products SET price_etb = NULL, stock_m3 = NULL WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- NEWS ----------------
export async function getNews() {
  const news = await query<RowDataPacket[]>('SELECT * FROM news ORDER BY date DESC, id DESC');
  return news.map((n) => ({
    id: String(n.id),
    title: { en: n.title_en, am: n.title_am, om: n.title_om },
    excerpt: { en: n.excerpt_en, am: n.excerpt_am, om: n.excerpt_om },
    content: { en: n.content_en, am: n.content_am, om: n.content_om },
    author: n.author,
    date: formatDate(n.date),
    category: n.category,
    image: typeof n.image === 'string' && n.image.startsWith('📰') ? '' : n.image,
    readTime: n.read_time,
    isActive: Boolean(n.is_active),
    featured: Boolean(n.featured),
  }));
}

export async function saveNews(article: any) {
  const title_en = tVal(article.title, 'en');
  const title_am = tVal(article.title, 'am');
  const title_om = tVal(article.title, 'om');
  const excerpt_en = tVal(article.excerpt, 'en');
  const excerpt_am = tVal(article.excerpt, 'am');
  const excerpt_om = tVal(article.excerpt, 'om');
  const content_en = tVal(article.content, 'en');
  const content_am = tVal(article.content, 'am');
  const content_om = tVal(article.content, 'om');
  const author = article.author || 'Admin';
  const date = article.date || new Date().toISOString().split('T')[0];
  const category = article.category || 'company';
  const image = article.image || '';
  const readTime = article.readTime || '3 min read';
  const isActive = article.isActive !== false;
  const featured = Boolean(article.featured);

  let id = Number(article.id);
  if (id) {
    await query(
      `UPDATE news 
       SET title_en = ?, title_am = ?, title_om = ?, excerpt_en = ?, excerpt_am = ?, excerpt_om = ?,
           content_en = ?, content_am = ?, content_om = ?, author = ?, date = ?, category = ?,
           image = ?, read_time = ?, is_active = ?, featured = ?
       WHERE id = ?`,
      [title_en, title_am, title_om, excerpt_en, excerpt_am, excerpt_om, content_en, content_am, content_om, author, date, category, image, readTime, isActive, featured, id]
    );
  } else {
    const result = await query<ResultSetHeader>(
      `INSERT INTO news (title_en, title_am, title_om, excerpt_en, excerpt_am, excerpt_om, content_en, content_am, content_om, author, date, category, image, read_time, is_active, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_am, title_om, excerpt_en, excerpt_am, excerpt_om, content_en, content_am, content_om, author, date, category, image, readTime, isActive, featured]
    );
    id = result.insertId;
  }

  return { id: String(id), ...article };
}

export async function deleteNews(id: string | number) {
  await query('DELETE FROM news WHERE id = ?', [id]);
  return { success: true };
}

// ---------------- HOME CONTENT ----------------
export async function getHomeData() {
  const whyRows = await query<RowDataPacket[]>('SELECT * FROM content_features WHERE section = ? ORDER BY sort_order ASC, id ASC', ['home']);
  const whyChoose = whyRows.map((w) => ({
    id: String(w.id),
    icon: w.icon,
    title: { en: w.title_en, am: w.title_am, om: w.title_om },
    description: { en: w.description_en, am: w.description_am, om: w.description_om },
  }));

  return {
    hero: homeConfig.hero,
    stats: getSectionStats('home', false),
    whyChoose,
    cta: homeConfig.cta,
    learnMore: homeConfig.learnMore,
  };
}

// ---------------- AUTH ----------------
export async function authenticateUser(email: string, password: string) {
  const users = await query<RowDataPacket[]>(`SELECT id, email, name, role, profile_image, permissions, auth_version, password_hash
    FROM users WHERE email = ? AND is_active = TRUE`, [email]);
  if (!users.length) return null;
  if (!(await bcrypt.compare(password, users[0].password_hash))) return null;
  await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [users[0].id]);
  let permissions = users[0].permissions || [];
  if (typeof permissions === 'string') permissions = JSON.parse(permissions);
  return {
    id: String(users[0].id),
    email: users[0].email,
    name: users[0].name,
    role: users[0].role,
    profileImage: users[0].profile_image || null,
    permissions: Array.isArray(permissions) ? permissions : [],
    authVersion: Number(users[0].auth_version),
  };
}
