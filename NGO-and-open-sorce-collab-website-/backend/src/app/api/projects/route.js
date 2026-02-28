import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import redis from '@/lib/redis';
import logger from '@/lib/logger';
import { getAuthUser } from '@/lib/auth';

const CACHE_TTL = 60;

export async function GET(request) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const tag = url.searchParams.get('tag');
  const search = url.searchParams.get('search');

  const cacheKey = `projects:${status || 'all'}:${tag || 'all'}:${search || 'all'}`;

  let cached = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (e) {
    logger.warn('Redis get failed: ' + (e?.message || e));
  }
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const where = {};

  if (status) {
    where.status = status;
  }

  if (tag) {
    where.tags = { has: tag };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Prefer a lightweight query and use Prisma's _count to avoid loading full task arrays
  const projects = await prisma.project.findMany({
    where,
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const response = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    tags: project.tags,
    createdAt: project.createdAt,
    owner: project.owner ? { id: project.owner.id, name: project.owner.name, email: project.owner.email } : null,
    taskCount: project._count?.tasks || 0
  }));

  // Safely set cache (don't crash if Redis is unavailable)
  try {
    await redis.set(cacheKey, JSON.stringify({ projects: response }), 'EX', CACHE_TTL);
  } catch (e) {
    logger.warn('Redis set failed: ' + (e?.message || e));
  }

  return NextResponse.json({ projects: response });
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);

    if (!user || user.role !== 'NGO') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { title, description, status, tags } = await request.json();

    if (!title || !description || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status,
        tags: tags || [],
        ownerId: user.id
      }
    });

    await redis.del('projects:all:all:all');

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create project', error: error.message }, { status: 500 });
  }
}
