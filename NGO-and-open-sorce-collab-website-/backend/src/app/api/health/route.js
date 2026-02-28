import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import redis from '@/lib/redis';

export async function GET() {
  // Basic checks: DB and Redis
  let dbOk = false;
  let redisOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    console.warn('DB health check failed', e?.message || e);
  }

  try {
    const pong = await redis.ping();
    if (pong === 'PONG') redisOk = true;
  } catch (e) {
    console.warn('Redis health check failed', e?.message || e);
  }

  return NextResponse.json({ ok: dbOk && redisOk, dbOk, redisOk });
}
