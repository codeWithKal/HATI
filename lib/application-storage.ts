import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const root = path.join(process.cwd(), 'storage', 'private', 'applications');
const maxDocumentBytes = 5 * 1024 * 1024;
const safeName = (name: string) => name.replace(/[\\/\0-\x1f\x7f]/g, '_').replace(/[^\p{L}\p{N}._ ()-]/gu, '').slice(0, 240) || 'document';

export async function saveApplicationDocument(file: File, kind: 'resume' | 'supporting' | 'certificate') {
  if (!file.size || file.size > maxDocumentBytes) throw new Error('Each application document must be smaller than 5 MB.');
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type.toLowerCase();
  const pdf = mime === 'application/pdf' && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  const jpeg = mime === 'image/jpeg' && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png = mime === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (kind === 'resume' ? !pdf : !pdf && !jpeg && !png) {
    throw new Error(kind === 'resume' ? 'Resume must be a valid PDF file.' : 'Supporting documents must be PDF, JPG, or PNG files.');
  }
  await mkdir(root, { recursive: true, mode: 0o700 });
  const storageName = `${randomUUID()}${pdf ? '.pdf' : jpeg ? '.jpg' : '.png'}`;
  await writeFile(path.join(root, storageName), buffer, { flag: 'wx', mode: 0o600 });
  return { storageName, originalName: safeName(file.name), mimeType: pdf ? 'application/pdf' : jpeg ? 'image/jpeg' : 'image/png', fileSize: buffer.length };
}

export async function readApplicationDocument(storageName: string) {
  if (!/^[0-9a-f-]{36}\.(pdf|jpg|png)$/.test(storageName)) throw new Error('Invalid document reference.');
  return readFile(path.join(root, storageName));
}

export async function removeApplicationDocument(storageName: string) {
  if (!/^[0-9a-f-]{36}\.(pdf|jpg|png)$/.test(storageName)) return;
  await rm(path.join(root, storageName), { force: true });
}
