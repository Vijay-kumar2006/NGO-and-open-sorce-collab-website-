import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      assignee: true,
      project: true
    }
  });

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const task = await prisma.task.findUnique({ where: { id: params.id } });

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    if (user.role !== 'NGO' && user.id !== task.assigneeId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const data = {};

    if (payload.status) {
      data.status = payload.status;
    }

    if (payload.assigneeId) {
      data.assigneeId = payload.assigneeId;
    }

    if (payload.status === 'assigned' && !payload.assigneeId) {
      data.assigneeId = user.id;
    }

    const updated = await prisma.task.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update task', error: error.message }, { status: 500 });
  }
}
