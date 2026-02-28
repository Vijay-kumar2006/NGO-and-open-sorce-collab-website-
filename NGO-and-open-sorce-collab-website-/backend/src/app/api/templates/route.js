import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const templates = await prisma.template.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ templates });
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { name, description, tasks } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name,
        description: description || '',
        tasks: {
          create: (tasks || []).map((task) => ({
            title: task.title,
            description: task.description || '',
            tags: task.tags || []
          }))
        }
      },
      include: { tasks: true }
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create template', error: error.message }, { status: 500 });
  }
}
