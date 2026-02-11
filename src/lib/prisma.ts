import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
    // Since we removed 'url' from the schema, we provide it here
    // Prisma will use the DATABASE_URL you set in Vercel
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
