import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth';
import { query } from '@/lib/db';
import { readApplicationDocument } from '@/lib/application-storage';
import type { RowDataPacket } from 'mysql2/promise';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string; documentId: string }> }) {
  const denied = await requireAdminApi('job_applications');
  if (denied) return denied;
  const { id, documentId } = await params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(documentId)) return NextResponse.json({ error: 'Invalid document reference.' }, { status: 400 });
  const docs = await query<RowDataPacket[]>('SELECT original_name, storage_name, mime_type FROM application_documents WHERE id = ? AND application_id = ? LIMIT 1', [documentId, id]);
  if (!docs[0]) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  try {
    const bytes = await readApplicationDocument(docs[0].storage_name);
    const disposition = new URL(request.url).searchParams.get('download') === '1' ? 'attachment' : 'inline';
    const safeName = String(docs[0].original_name).replace(/["\r\n]/g, '_');
    return new Response(bytes, { headers: {
      'Content-Type': docs[0].mime_type, 'Content-Length': String(bytes.byteLength),
      'Content-Disposition': `${disposition}; filename="${safeName}"`,
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    } });
  } catch { return NextResponse.json({ error: 'The stored document could not be read.' }, { status: 404 }); }
}
