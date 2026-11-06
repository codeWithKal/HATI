require('@next/env').loadEnvConfig(process.cwd());
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { randomUUID, randomBytes } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const email = `recruitment-test-${randomUUID()}@example.invalid`;
const password = randomBytes(18).toString('base64url') + '2';
let cookie = '';
let careerId = null;
let applicationReference = null;
let galleryIds = [];
let db;

function assert(value, message) { if (!value) throw new Error(message); }
async function request(url, method = 'GET', body, statuses = [200], multipart = false, auth = true) {
  const response = await fetch(`${base}${url}`, { method, headers: { ...(auth && cookie ? { cookie } : {}), ...(body && !multipart ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}) });
  const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
  assert(statuses.includes(response.status), `${method} ${url}: ${response.status} (expected ${statuses.join('/')}) ${data?.error || ''}`);
  if (response.status === 200 || response.status === 201) return { response, data };
  return { response, data };
}

async function main() {
  db = await mysql.createConnection({ host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT) || 3306, user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'hati_db' });
  const hash = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO users (email,name,password_hash,role,is_active) VALUES (?,?,?,\'admin\',TRUE)', [email, 'Recruitment Verification Admin', hash]);
  try {
    const login = await request('/api/auth/login', 'POST', { email, password }, [200], false, false);
    cookie = login.response.headers.get('set-cookie').split(';', 1)[0];
    assert(login.data.user && !login.data.user.password_hash, 'Authentication exposed sensitive password data.');
    await request('/api/careers', 'GET', undefined, [200]);
    await request('/api/careers', 'GET', undefined, [401], false, false);

    const gallery = await request('/api/gallery');
    assert(gallery.data.gallery.length >= 1, 'Existing gallery records are missing.');
    for (const item of gallery.data.gallery) {
      const res = await fetch(`${base}${item.image}`);
      assert(res.ok, `Stored gallery image ${item.image} could not be served (${res.status}).`);
    }
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lR0AAAAASUVORK5CYII=', 'base64');
    const upload = new FormData(); upload.set('imageFile', new Blob([png], { type: 'image/png' }), 'gallery.png'); upload.set('category', 'test');
    const addedGallery = await request('/api/gallery', 'POST', upload, [201], true); galleryIds.push(addedGallery.data.id);
    assert((await fetch(`${base}${addedGallery.data.image}`)).ok, 'Uploaded gallery image did not remain accessible.');
    const replaced = await request(`/api/gallery/${addedGallery.data.id}`, 'PUT', upload, [200], true);
    assert((await fetch(`${base}${replaced.data.image}`)).ok && (await fetch(`${base}${addedGallery.data.image}`)).status === 404, 'Gallery image replacement did not preserve new content and remove the unused managed file.');
    const duplicateRef = await request('/api/gallery', 'POST', { image: replaced.data.image, category: 'test' }, [201]); galleryIds.push(duplicateRef.data.id);
    await request(`/api/gallery/${galleryIds[0]}`, 'DELETE');
    assert((await fetch(`${base}${replaced.data.image}`)).ok, 'Deleting one shared gallery reference removed a still-referenced file.');
    await request(`/api/gallery/${galleryIds[1]}`, 'DELETE');
    assert((await fetch(`${base}${replaced.data.image}`)).status === 404, 'Unreferenced uploaded gallery file was not removed.'); galleryIds = [];

    const deadline = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    const trans = { en: 'Recruitment test position', am: 'የሙከራ ስራ', om: 'Hojii qorannoo' };
    const createdCareer = await request('/api/careers', 'POST', { title: trans, location: trans, type: trans, department: trans, experience: trans, description: trans, applicationDeadline: deadline, vacancies: 2, vacancyStatus: 'open', isActive: true, requirements: { en: ['Degree'], am: ['ዲግሪ'], om: ['Digirii'] } }, [201]);
    careerId = createdCareer.data.id;
    const publicCareers = await request('/api/careers?public=1');
    assert(publicCareers.data.careers.some((job) => job.id === String(careerId)), 'Active vacancy is not in the public Careers API.');

    const form = new FormData();
    for (const [key, value] of Object.entries({ careerId: String(careerId), fullName: 'Candidate Verification', email: `candidate-${randomUUID()}@example.invalid`, phone: '+251 911 123 456', address: 'Addis Ababa', education: 'BSc', fieldOfStudy: 'Civil Engineering', experienceYears: '3.5', coverLetter: 'I am interested in this position.' })) form.set(key, value);
    form.set('resume', new Blob([Buffer.from('%PDF-1.4\nTest CV\n%%EOF')], { type: 'application/pdf' }), 'candidate-cv.pdf');
    form.set('supporting', new Blob([png], { type: 'image/png' }), 'certificate.png');
    const submitted = await request('/api/job-applications', 'POST', form, [201], true, false);
    applicationReference = submitted.data.referenceNo;
    assert(/^HATI-\d{4}-[A-F0-9]{10}$/.test(applicationReference), 'Application reference number is invalid.');
    const duplicate = new FormData(); for (const [key, value] of Object.entries({ careerId: String(careerId), fullName: 'Candidate Verification', email: form.get('email'), phone: '+251 911 123 456', address: 'Addis Ababa', education: 'BSc', fieldOfStudy: 'Civil Engineering', experienceYears: '3.5', coverLetter: 'Duplicate attempt.' })) duplicate.set(key, value);
    duplicate.set('resume', new Blob([Buffer.from('%PDF-1.4\nTest CV\n%%EOF')], { type: 'application/pdf' }), 'candidate-cv.pdf');
    await request('/api/job-applications', 'POST', duplicate, [409], true, false);
    await request('/api/job-applications', 'GET', undefined, [401], false, false);
    const list = await request('/api/job-applications?search=Candidate%20Verification&careerId=' + careerId);
    const candidate = list.data.applications.find((entry) => entry.referenceNo === applicationReference);
    assert(candidate?.status === 'new', 'New application is not visible in the admin list.');
    const details = await request(`/api/job-applications/${candidate.id}`);
    assert(details.data.application.documents.length === 2 && details.data.application.history[0].newStatus === 'new', 'Application documents or initial history were not saved.');
    assert(details.data.application.documents.every((document) => !document.storageName), 'Private document paths were exposed in application JSON.');
    await request(`/api/job-applications/${candidate.id}/documents/${details.data.application.documents[0].id}`, 'GET', undefined, [401], false, false);
    const document = await request(`/api/job-applications/${candidate.id}/documents/${details.data.application.documents[0].id}?download=1`);
    assert(document.response.headers.get('content-disposition').startsWith('attachment'), 'Document download headers are missing.');
    const updated = await request(`/api/job-applications/${candidate.id}`, 'PATCH', { status: 'under_review', assignedReviewerId: Number(login.data.user.id), interviewAt: new Date(Date.now() + 3 * 86400000).toISOString(), interviewFeedback: 'Initial screening notes.' });
    assert(updated.data.application.history.length === 2, 'Status history did not preserve the prior state.');
    await request(`/api/job-applications/${candidate.id}/notes`, 'POST', { body: 'Confidential internal note.' }, [201]);
    const reviewed = await request(`/api/job-applications/${candidate.id}`);
    assert(reviewed.data.application.notes[0].body === 'Confidential internal note.', 'Internal review note was not persisted.');
    await request(`/api/job-applications/${candidate.id}/notes/${reviewed.data.application.notes[0].id}`, 'PATCH', { body: 'Updated internal review note.' });
    const audit = await request('/api/admin/audit');
    const candidateAudit = audit.data.events.filter((event) => event.targetEmail === form.get('email')).map((event) => event.action);
    assert(['job_application.review_updated', 'job_application.note_added', 'job_application.note_updated'].every((action) => candidateAudit.includes(action)), 'Recruitment audit log missed a review, note, or note edit event.');
    assert(!JSON.stringify(audit.data.events).includes('Updated internal review note.'), 'Private note contents leaked into the general audit log.');
    const historyResponse = await request('/api/job-applications?status=under_review&reviewerId=' + login.data.user.id + '&from=' + new Date(Date.now() - 86400000).toISOString().slice(0, 10));
    assert(historyResponse.data.applications.some((entry) => entry.referenceNo === applicationReference), 'Application status/reviewer/date filters did not return the record.');

    const closed = await request(`/api/careers/${careerId}`, 'PUT', { ...createdCareer.data, vacancyStatus: 'closed' });
    assert(closed.data.vacancyStatus === 'closed', 'Vacancy could not be closed.');
    const publicAfterClose = await request('/api/careers?public=1');
    assert(!publicAfterClose.data.careers.some((job) => job.id === String(careerId)), 'Closed vacancy still appears as accepting applications.');
    const retry = new FormData(); for (const [key, value] of Object.entries({ careerId: String(careerId), fullName: 'Second Candidate', email: `second-${randomUUID()}@example.invalid`, phone: '1234567', address: 'Addis Ababa', education: 'BSc', fieldOfStudy: 'Civil', experienceYears: '1', coverLetter: 'Application after close.' })) retry.set(key, value);
    retry.set('resume', new Blob([Buffer.from('%PDF-1.4\nTest CV\n%%EOF')], { type: 'application/pdf' }), 'cv.pdf');
    await request('/api/job-applications', 'POST', retry, [409], true, false);
    await request(`/api/careers/${careerId}`, 'DELETE', undefined, [409]);
    console.log('Recruitment/gallery verification passed: existing image paths, shared upload cleanup, public vacancy rules, application/document persistence, duplicate prevention, private document access, reviewer/status history, internal notes, filters, and vacancy close behavior.');
  } finally {
    if (applicationReference) {
      const [docs] = await db.execute('SELECT storage_name FROM application_documents d JOIN job_applications a ON a.id=d.application_id WHERE a.reference_no = ?', [applicationReference]);
      await Promise.all(docs.map((doc) => fs.rm(path.join(process.cwd(), 'storage/private/applications', doc.storage_name), { force: true }).catch(() => undefined)));
      await db.execute('DELETE FROM job_applications WHERE reference_no = ?', [applicationReference]);
    }
    for (const id of galleryIds) await db.execute('DELETE FROM gallery WHERE id = ?', [id]);
    if (careerId) await db.execute('DELETE FROM careers WHERE id = ?', [careerId]);
    await db.execute('DELETE FROM users WHERE email = ?', [email]);
    await db.end();
  }
}
main().catch((error) => { console.error('Recruitment verification failed:', error.message); process.exitCode = 1; });
