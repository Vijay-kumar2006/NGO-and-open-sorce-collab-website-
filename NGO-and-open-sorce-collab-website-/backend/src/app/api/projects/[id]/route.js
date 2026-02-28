import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import redis from '@/lib/redis';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      },
      pipelines: {
        include: { tasks: { select: { id: true, title: true, status: true } } }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const project = await prisma.project.findUnique({ where: { id: params.id } });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== user.id) {
      return NextResponse.json({ message: 'Not allowed' }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: data.title ?? project.title,
        description: data.description ?? project.description,
        status: data.status ?? project.status,
        tags: data.tags ?? project.tags
      }
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update project', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== user.id) {
      return NextResponse.json({ message: 'Not allowed' }, { status: 403 });
    }

    await prisma.project.delete({ where: { id: params.id } });
    await redis.del('projects:all:all:all');
    await redis.del('dashboard:summary');

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete project', error: error.message }, { status: 500 });
  }
}
