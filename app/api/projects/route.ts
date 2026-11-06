import { requireAdminApi } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getProjects, getProjectStats, saveProject } from '@/lib/repositories';

export async function GET() {
  try {
    const projects = await getProjects();
    const stats = await getProjectStats();
    return NextResponse.json({ projects, stats });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi('projects');
  if (unauthorized) return unauthorized;
  try {
    const data = await request.json();
    const project = await saveProject(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error saving project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
