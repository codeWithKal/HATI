import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const avatarDirectory = path.join(process.cwd(), 'public', 'uploads', 'avatars');
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export async function saveAvatar(file: File): Promise<string> {
  if (!file.size || file.size > MAX_AVATAR_BYTES) throw new Error('Choose an image smaller than 2 MB.');
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = file.type.toLowerCase();
  let extension: string | null = null;
  if (mime === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) extension = 'jpg';
  if (mime === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = 'png';
  if (mime === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') extension = 'webp';
  if (!extension) throw new Error('Use a valid JPG, PNG, or WebP image.');
  await mkdir(avatarDirectory, { recursive: true });
  const fileName = `${randomUUID()}.${extension}`;
  await writeFile(path.join(avatarDirectory, fileName), bytes, { flag: 'wx', mode: 0o644 });
  return `/uploads/avatars/${fileName}`;
}

export async function removeAvatar(url: string | null | undefined) {
  if (!url?.startsWith('/uploads/avatars/')) return;
  const fileName = path.basename(url);
  await rm(path.join(avatarDirectory, fileName), { force: true });
}
