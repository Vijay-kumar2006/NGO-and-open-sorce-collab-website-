import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get('projectId');

  const where = projectId ? { projectId } : {};

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: true,
      project: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ tasks });
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);

    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { title, description, projectId, pipelineId, tags } = await request.json();

    if (!title || !projectId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const similarTasks = await prisma.task.findMany({
      where: {
        projectId,
        title: { contains: title, mode: 'insensitive' }
      },
      take: 5
    });

    if (similarTasks.length > 0) {
      return NextResponse.json(
        { message: 'Similar tasks found', similarTasks },
        { status: 409 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: 'open',
        tags: tags || [],
        projectId,
        pipelineId: pipelineId || null
      }
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create task', error: error.message }, { status: 500 });
  }
}
