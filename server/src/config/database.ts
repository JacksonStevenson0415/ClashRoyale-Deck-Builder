// This file creates a single Prisma Client instance that we reuse
// across the entire application. This is called the "singleton pattern."
//
// Why? Creating a new database connection for every request is slow
// and wasteful. Instead, we create ONE connection and share it everywhere.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export default prisma;