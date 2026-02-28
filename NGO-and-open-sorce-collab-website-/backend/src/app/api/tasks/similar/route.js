import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get('projectId');
  const query = url.searchParams.get('q');

  if (!projectId || !query) {
    return NextResponse.json({ message: 'projectId and q are required' }, { status: 400 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      title: { contains: query, mode: 'insensitive' }
    },
    take: 10
  });

  return NextResponse.json({ tasks });
}
