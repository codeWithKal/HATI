import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import { pool, query } from '@/lib/db';
import type { AdminUser } from '@/lib/auth';

export const APPLICATION_STATUSES = ['new', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type StoredApplicationDocument = {
  documentType: 'resume' | 'supporting' | 'certificate';
  originalName: string;
  storageName: string;
  mimeType: string;
  fileSize: number;
};

async function auditApplication(connection: PoolConnection, actor: AdminUser, application: RowDataPacket, action: string, details: Record<string, unknown>) {
  await connection.execute(`INSERT INTO admin_audit_log
    (actor_user_id, actor_name, actor_email, target_name, target_email, action, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)`, [Number(actor.id), actor.name, actor.email, application.full_name, application.email, action,
    JSON.stringify({ referenceNo: application.reference_no, ...details })]);
}

export async function createApplication(input: Record<string, string>, documents: StoredApplicationDocument[]) {
  const email = input.email.trim().toLowerCase();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [jobs] = await connection.execute<RowDataPacket[]>(`SELECT id FROM careers
      WHERE id = ? AND is_active = TRUE AND vacancy_status = 'open'
        AND (application_deadline IS NULL OR application_deadline >= CURRENT_DATE) FOR UPDATE`, [input.careerId]);
    if (!jobs.length) throw new Error('This vacancy is no longer accepting applications.');
    const [exists] = await connection.execute<RowDataPacket[]>('SELECT id FROM job_applications WHERE career_id = ? AND email = ? LIMIT 1', [input.careerId, email]);
    if (exists.length) throw new Error('An application from this email already exists for this vacancy.');

    const year = new Date().getFullYear();
    let reference = '';
    let insertedId = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      reference = `HATI-${year}-${randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`;
      const [result] = await connection.execute<any>(`INSERT INTO job_applications
        (reference_no, career_id, full_name, email, phone, address, portfolio_url, education, field_of_study,
         experience_years, previous_employer, cover_letter)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reference, input.careerId, input.fullName, email, input.phone, input.address, input.portfolioUrl || null,
        input.education, input.fieldOfStudy, Number(input.experienceYears), input.previousEmployer || null, input.coverLetter]);
      insertedId = result.insertId;
      break;
    }
    for (const document of documents) {
      await connection.execute(`INSERT INTO application_documents
        (application_id, document_type, original_name, storage_name, mime_type, file_size)
        VALUES (?, ?, ?, ?, ?, ?)`, [insertedId, document.documentType, document.originalName, document.storageName, document.mimeType, document.fileSize]);
    }
    await connection.execute(`INSERT INTO application_status_history
      (application_id, previous_status, new_status, actor_name, note) VALUES (?, NULL, 'new', 'Candidate', 'Application submitted')`, [insertedId]);
    await connection.commit();
    return { id: String(insertedId), referenceNo: reference };
  } catch (error: any) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new Error('An application from this email already exists for this vacancy.');
    throw error;
  } finally { connection.release(); }
}

const baseSelect = `SELECT a.id, a.reference_no AS referenceNo, a.full_name AS fullName, a.email, a.phone,
  a.status, a.submitted_at AS submittedAt, a.assigned_reviewer_id AS assignedReviewerId,
  a.interview_at AS interviewAt, c.id AS careerId, c.title_en AS positionTitle, c.department_en AS department,
  u.name AS reviewerName FROM job_applications a JOIN careers c ON c.id = a.career_id
  LEFT JOIN users u ON u.id = a.assigned_reviewer_id`;

export async function listApplications(filters: URLSearchParams) {
  const where: string[] = [];
  const values: unknown[] = [];
  const search = filters.get('search')?.trim();
  if (search) { where.push('(a.reference_no LIKE ? OR a.full_name LIKE ? OR a.email LIKE ? OR a.phone LIKE ?)'); values.push(...Array(4).fill(`%${search}%`)); }
  const careerId = filters.get('careerId');
  if (careerId && /^\d+$/.test(careerId)) { where.push('a.career_id = ?'); values.push(Number(careerId)); }
  const status = filters.get('status');
  if (status && status !== 'all' && APPLICATION_STATUSES.includes(status as ApplicationStatus)) { where.push('a.status = ?'); values.push(status); }
  const reviewer = filters.get('reviewerId');
  if (reviewer === 'unassigned') where.push('a.assigned_reviewer_id IS NULL');
  else if (reviewer && /^\d+$/.test(reviewer)) { where.push('a.assigned_reviewer_id = ?'); values.push(Number(reviewer)); }
  const from = filters.get('from');
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) { where.push('a.submitted_at >= ?'); values.push(`${from} 00:00:00`); }
  const to = filters.get('to');
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) { where.push('a.submitted_at < DATE_ADD(?, INTERVAL 1 DAY)'); values.push(to); }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const page = Math.max(1, Number(filters.get('page')) || 1);
  const pageSize = Math.min(50, Math.max(5, Number(filters.get('pageSize')) || 20));
  const [countRows, rows, statusRows, careers, reviewers] = await Promise.all([
    query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM job_applications a JOIN careers c ON c.id = a.career_id ${clause}`, values as any[]),
    query<RowDataPacket[]>(`${baseSelect} ${clause} ORDER BY a.submitted_at DESC, a.id DESC LIMIT ? OFFSET ?`, [...values, pageSize, (page - 1) * pageSize] as any[]),
    query<RowDataPacket[]>('SELECT status, COUNT(*) AS total FROM job_applications GROUP BY status'),
    query<RowDataPacket[]>('SELECT id, title_en AS title FROM careers ORDER BY title_en'),
    query<RowDataPacket[]>("SELECT id, name, email, role FROM users WHERE is_active = TRUE AND role IN ('super_admin','admin','editor') ORDER BY name"),
  ]);
  const stats = Object.fromEntries(APPLICATION_STATUSES.map((entry) => [entry, 0])) as Record<ApplicationStatus, number>;
  let total = 0;
  for (const row of statusRows) { stats[row.status as ApplicationStatus] = Number(row.total); total += Number(row.total); }
  return { applications: rows, total: Number(countRows[0].total), page, pageSize, totalPages: Math.ceil(Number(countRows[0].total) / pageSize), stats: { total, ...stats }, careers, reviewers };
}

export async function getApplication(id: string | number) {
  const [rows, documents, history, notes] = await Promise.all([
    query<RowDataPacket[]>(`SELECT a.id, a.reference_no AS referenceNo, a.full_name AS fullName, a.email, a.phone,
      a.status, a.submitted_at AS submittedAt, a.assigned_reviewer_id AS assignedReviewerId, u.name AS reviewerName,
      a.address, a.portfolio_url AS portfolioUrl, a.education, a.field_of_study AS fieldOfStudy,
      a.experience_years AS experienceYears, a.previous_employer AS previousEmployer, a.cover_letter AS coverLetter,
      a.interview_feedback AS interviewFeedback, a.updated_at AS updatedAt, c.title_am AS positionTitleAm, c.title_om AS positionTitleOm,
      c.location_en AS location, c.type_en AS employmentType, c.description_en AS jobDescription, c.application_deadline AS applicationDeadline
      FROM job_applications a JOIN careers c ON c.id = a.career_id
      LEFT JOIN users u ON u.id = a.assigned_reviewer_id WHERE a.id = ? LIMIT 1`, [id]),
    query<RowDataPacket[]>('SELECT id, document_type AS documentType, original_name AS originalName, mime_type AS mimeType, file_size AS fileSize, created_at AS createdAt FROM application_documents WHERE application_id = ? ORDER BY id', [id]),
    query<RowDataPacket[]>('SELECT id, previous_status AS previousStatus, new_status AS newStatus, actor_name AS actorName, note, created_at AS createdAt FROM application_status_history WHERE application_id = ? ORDER BY created_at, id', [id]),
    query<RowDataPacket[]>('SELECT id, author_name AS authorName, body, created_at AS createdAt, updated_at AS updatedAt FROM application_notes WHERE application_id = ? ORDER BY created_at DESC, id DESC', [id]),
  ]);
  if (!rows[0]) return null;
  return { ...rows[0], documents, history, notes };
}

export async function updateApplication(actor: AdminUser, id: string | number, input: any) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT status, reference_no, full_name, email FROM job_applications WHERE id = ? FOR UPDATE', [id]);
    if (!rows[0]) throw new Error('Application not found.');
    const previous = rows[0].status as ApplicationStatus;
    const status = input.status === undefined ? previous : String(input.status) as ApplicationStatus;
    if (!APPLICATION_STATUSES.includes(status)) throw new Error('Select a valid application status.');
    let reviewerId: number | null | undefined;
    if (input.assignedReviewerId !== undefined) {
      reviewerId = input.assignedReviewerId === null || input.assignedReviewerId === '' ? null : Number(input.assignedReviewerId);
      if (reviewerId !== null) {
        if (!Number.isInteger(reviewerId) || reviewerId < 1) throw new Error('Select a valid reviewer.');
        const [reviewers] = await connection.execute<RowDataPacket[]>('SELECT id FROM users WHERE id = ? AND is_active = TRUE', [reviewerId]);
        if (!reviewers.length) throw new Error('Reviewer account is inactive or unavailable.');
      }
    }
    const interviewAt = input.interviewAt === undefined ? undefined : input.interviewAt ? new Date(input.interviewAt) : null;
    if (interviewAt instanceof Date && Number.isNaN(interviewAt.valueOf())) throw new Error('Enter a valid interview date and time.');
    const interviewFeedback = input.interviewFeedback === undefined ? undefined : String(input.interviewFeedback).slice(0, 20000);
    const changedFields = [status !== previous ? 'status' : null, reviewerId !== undefined ? 'assignedReviewer' : null,
      input.interviewAt !== undefined ? 'interviewAt' : null, interviewFeedback !== undefined ? 'interviewFeedback' : null].filter(Boolean);
    await connection.execute(`UPDATE job_applications SET status = ?,
      assigned_reviewer_id = IF(? = 1, ?, assigned_reviewer_id),
      interview_at = IF(? = 1, ?, interview_at),
      interview_feedback = IF(? = 1, ?, interview_feedback) WHERE id = ?`,
    [status, reviewerId === undefined ? 0 : 1, reviewerId ?? null, input.interviewAt === undefined ? 0 : 1, interviewAt ?? null,
      interviewFeedback === undefined ? 0 : 1, interviewFeedback ?? null, id]);
    if (status !== previous) await connection.execute(`INSERT INTO application_status_history
      (application_id, previous_status, new_status, actor_user_id, actor_name, note)
      VALUES (?, ?, ?, ?, ?, ?)`, [id, previous, status, Number(actor.id), actor.name, String(input.statusNote || '').trim().slice(0, 2000) || null]);
    if (changedFields.length) await auditApplication(connection, actor, rows[0], 'job_application.review_updated', { fields: changedFields });
    if (input.note !== undefined) {
      const body = String(input.note).trim();
      if (body.length < 2 || body.length > 10000) throw new Error('Internal notes must be between 2 and 10,000 characters.');
      await connection.execute('INSERT INTO application_notes (application_id, author_user_id, author_name, body) VALUES (?, ?, ?, ?)', [id, Number(actor.id), actor.name, body]);
      await auditApplication(connection, actor, rows[0], 'job_application.note_added', {});
    }
    await connection.commit();
    return getApplication(id);
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function addApplicationNote(actor: AdminUser, applicationId: string | number, body: string) {
  const note = body.trim();
  if (note.length < 2 || note.length > 10000) throw new Error('Internal notes must be between 2 and 10,000 characters.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [applications] = await connection.execute<RowDataPacket[]>('SELECT reference_no, full_name, email FROM job_applications WHERE id = ? FOR UPDATE', [applicationId]);
    if (!applications[0]) throw new Error('Application not found.');
    await connection.execute('INSERT INTO application_notes (application_id, author_user_id, author_name, body) VALUES (?, ?, ?, ?)', [applicationId, Number(actor.id), actor.name, note]);
    await auditApplication(connection, actor, applications[0], 'job_application.note_added', {});
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function updateApplicationNote(actor: AdminUser, applicationId: string | number, noteId: string | number, body: string) {
  const note = body.trim();
  if (note.length < 2 || note.length > 10000) throw new Error('Internal notes must be between 2 and 10,000 characters.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [applications] = await connection.execute<RowDataPacket[]>('SELECT reference_no, full_name, email FROM job_applications WHERE id = ?', [applicationId]);
    if (!applications[0]) throw new Error('Application not found.');
    const [result] = await connection.execute<any>('UPDATE application_notes SET body = ? WHERE id = ? AND application_id = ? AND (author_user_id = ? OR ? IN (\'admin\', \'super_admin\'))', [note, noteId, applicationId, actor.id, actor.role]);
    if (!result.affectedRows) throw new Error('Note not found or you are not allowed to edit it.');
    await auditApplication(connection, actor, applications[0], 'job_application.note_updated', {});
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
