import { PrismaClient } from '@prisma/client'

async function main() {
    const prisma = new PrismaClient()

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
    .finally(async () => {
        // Note: Prisma 7 might not have $disconnect dependening on generator settings, 
        // but usually it's good practice.
    })
