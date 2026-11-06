import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const root = path.join(process.cwd(), 'public', 'images', 'gallery', 'uploads');

export async function saveGalleryImage(file: File) {
  if (!file.size || file.size > 8 * 1024 * 1024) throw new Error('Choose an image smaller than 8 MB.');
  const data = Buffer.from(await file.arrayBuffer());
  const mime = file.type.toLowerCase();
  const extension = mime === 'image/jpeg' && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff ? 'jpg'
    : mime === 'image/png' && data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png'
    : mime === 'image/webp' && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : null;
  if (!extension) throw new Error('Use a valid JPG, PNG, or WebP image.');
  await mkdir(root, { recursive: true });
  const name = `${randomUUID()}.${extension}`;
  await writeFile(path.join(root, name), data, { flag: 'wx', mode: 0o644 });
  return `/images/gallery/uploads/${name}`;
}

export async function removeGalleryUpload(url: string) {
  const match = url.match(/^\/images\/gallery\/uploads\/([0-9a-f-]{36}\.(?:jpg|png|webp))$/);
  if (!match) return;
  await rm(path.join(root, match[1]), { force: true });
}
