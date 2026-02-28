import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import redis from '@/lib/redis';
import logger from '@/lib/logger';

const CACHE_TTL = 30;

export async function GET() {
  let cached = null;
  try {
    cached = await redis.get('dashboard:summary');
  } catch (e) {
    logger.warn('Redis get failed: ' + (e?.message || e));
  }
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  // Use lightweight queries and _count for task counts to reduce payload and latency
  const activeProjects = await prisma.project.findMany({
    where: { status: 'active' },
    include: {
      owner: { select: { name: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { updatedAt: 'desc' },
    take: 6
  });

  const activeAssignments = await prisma.task.findMany({
    where: { status: { in: ['assigned', 'review'] } },
    include: {
      assignee: true,
      project: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  const recentContributions = await prisma.task.findMany({
    where: { status: 'completed' },
    include: {
      assignee: true,
      project: true
    },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  const response = {
    activeProjects: activeProjects.map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      owner: project.owner?.name || 'Unknown',
      taskCount: project._count?.tasks || 0
    })),
    activeAssignments: activeAssignments.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      assignee: task.assignee?.name || 'Unassigned',
      project: task.project?.title || 'Unknown'
    })),
    recentContributions: recentContributions.map((task) => ({
      id: task.id,
      title: task.title,
      assignee: task.assignee?.name || 'Unassigned',
      project: task.project?.title || 'Unknown',
      completedAt: task.updatedAt
    }))
  };

  try {
    await redis.set('dashboard:summary', JSON.stringify(response), 'EX', CACHE_TTL);
  } catch (e) {
    logger.warn('Redis set failed: ' + (e?.message || e));
  }

  return NextResponse.json(response);
}
