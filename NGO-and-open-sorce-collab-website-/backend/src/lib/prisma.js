import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Basic environment validation to fail fast in production
if (process.env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!process.env.REDIS_URL) missing.push('REDIS_URL');

  if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    throw new Error('Missing required environment variables: ' + missing.join(', '));
  }
}
