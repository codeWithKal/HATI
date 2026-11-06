import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { saveNews, deleteNews } from '@/lib/repositories';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('news');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const data = await request.json();
    const article = await saveNews({ ...data, id });
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error updating news article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdminApi('news');
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await deleteNews(id);
    return NextResponse.json({ success: true, message: 'News article deleted' });
  } catch (error: any) {
    console.error('Error deleting news article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
