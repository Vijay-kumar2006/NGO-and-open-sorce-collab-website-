import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get('projectId');

  const where = projectId ? { projectId } : {};

  const pipelines = await prisma.pipeline.findMany({
    where,
    include: {
      tasks: true,
      project: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ pipelines });
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { name, description, projectId } = await request.json();
    if (!name || !projectId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        description: description || '',
        projectId
      }
    });

    return NextResponse.json({ pipeline }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create pipeline', error: error.message }, { status: 500 });
  }
}
