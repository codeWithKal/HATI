import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/repositories';

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching home data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
