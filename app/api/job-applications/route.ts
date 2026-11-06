import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { createApplication, listApplications } from '@/lib/job-applications';
import { removeApplicationDocument, saveApplicationDocument } from '@/lib/application-storage';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  try {
    return NextResponse.json(await listApplications(new URL(request.url).searchParams), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unable to load job applications.' }, { status: 500 });
  }
}

function field(form: FormData, name: string, max: number) {
  const value = String(form.get(name) ?? '').trim();
  if (!value || value.length > max) throw new Error(`${name} is required and must be no longer than ${max} characters.`);
  return value;
}

export async function POST(request: Request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 25 * 1024 * 1024) return NextResponse.json({ error: 'Application uploads must total less than 25 MB.' }, { status: 413 });
  const stored: string[] = [];
  try {
    const form = await request.formData();
    const fullName = field(form, 'fullName', 255);
    const email = field(form, 'email', 254).toLowerCase();
    const phone = field(form, 'phone', 40);
    const address = field(form, 'address', 500);
    const education = field(form, 'education', 255);
    const fieldOfStudy = field(form, 'fieldOfStudy', 255);
    const coverLetter = field(form, 'coverLetter', 15000);
    const experienceYears = field(form, 'experienceYears', 8);
    const careerId = field(form, 'careerId', 12);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
    if (!/^[0-9+().\s-]{6,40}$/.test(phone)) throw new Error('Enter a valid phone number.');
    if (!/^\d+$/.test(careerId)) throw new Error('Select a valid job vacancy.');
    const years = Number(experienceYears);
    if (!Number.isFinite(years) || years < 0 || years > 80) throw new Error('Experience must be between 0 and 80 years.');
    const portfolioUrl = String(form.get('portfolioUrl') || '').trim();
    if (portfolioUrl) { try { const url = new URL(portfolioUrl); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); } catch { throw new Error('Enter a valid portfolio URL.'); } }
    const resume = form.get('resume');
    if (!(resume instanceof File) || !resume.size) throw new Error('A PDF resume is required.');
    const supporting = form.getAll('supporting').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const certificates = form.getAll('certificate').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (supporting.length + certificates.length > 4) throw new Error('Upload no more than four supporting documents.');
    if ([resume, ...supporting, ...certificates].reduce((total, file) => total + file.size, 0) > 20 * 1024 * 1024) throw new Error('Application documents must total less than 20 MB.');

    const docs = [];
    const resumeDoc = await saveApplicationDocument(resume, 'resume'); stored.push(resumeDoc.storageName); docs.push({ documentType: 'resume' as const, ...resumeDoc });
    for (const file of supporting) { const doc = await saveApplicationDocument(file, 'supporting'); stored.push(doc.storageName); docs.push({ documentType: 'supporting' as const, ...doc }); }
    for (const file of certificates) { const doc = await saveApplicationDocument(file, 'certificate'); stored.push(doc.storageName); docs.push({ documentType: 'certificate' as const, ...doc }); }
    const application = await createApplication({
      careerId, fullName, email, phone, address, education, fieldOfStudy, experienceYears: String(years), coverLetter,
      portfolioUrl, previousEmployer: String(form.get('previousEmployer') || '').trim().slice(0, 255),
    }, docs);
    return NextResponse.json({ referenceNo: application.referenceNo, message: 'Your application has been received.' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    await Promise.all(stored.map(removeApplicationDocument));
    const status = error.code === 'ER_DUP_ENTRY' ? 409 : 400;
    if (/already exists|no longer accepting/.test(error.message || '')) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error.message && !error.code) return NextResponse.json({ error: error.message }, { status });
    return NextResponse.json({ error: 'Unable to submit the application. Please try again.' }, { status: 500 });
  }
}
