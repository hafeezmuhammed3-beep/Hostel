import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                beds: {
                    include: {
                        tenant: true,
                    }
                },
            },
            orderBy: {
                roomNumber: 'asc',
            },
        });
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { roomNumber, capacity, pricePerBed } = body;

        // Check if room already exists
        const existingRoom = await prisma.room.findUnique({
            where: { roomNumber },
        });

        if (existingRoom) {
            return NextResponse.json({ error: 'Room number already exists' }, { status: 400 });
        }

        const room = await prisma.room.create({
            data: {
                roomNumber,
                capacity: parseInt(capacity),
                pricePerBed: parseFloat(pricePerBed),
                beds: {
                    create: Array.from({ length: parseInt(capacity) }).map((_, index) => ({
                        bedNumber: `${roomNumber}-${index + 1}`,
                    })),
                },
            },
            include: {
                beds: true,
            },
        });

        return NextResponse.json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }
}
