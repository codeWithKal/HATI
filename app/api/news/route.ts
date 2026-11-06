import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getNews, saveNews } from '@/lib/repositories';

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('news');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const article = await saveNews(data);
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Error saving news article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
