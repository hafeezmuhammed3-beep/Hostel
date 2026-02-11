import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

async function main() {
    // We need to initialize the adapter like in the main app since we're using Prisma 7 with SQLite
    const dbPath = path.join(process.cwd(), 'dev.db')
    const adapter = new PrismaLibSql({
        url: `file:${dbPath}`
    })

    const prisma = new PrismaClient({ adapter })

    console.log('Cleaning up existing users...')
    await prisma.user.deleteMany()

    console.log('Seeding users...')

    const admin = await prisma.user.create({
        data: {
            email: 'admin@hostel.com',
            password: 'adminpassword123', // In a real app, hash this!
            name: 'Admin User',
            role: 'ADMIN'
        }
    })

    const staff = await prisma.user.create({
        data: {
            email: 'staff@hostel.com',
            password: 'staffpassword123',
            name: 'Staff Member',
            role: 'STAFF'
        }
    })

    console.log({ admin, staff })
    console.log('Seeding finished successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
