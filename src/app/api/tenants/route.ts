import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                bed: {
                    include: {
                        room: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(tenants);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, contact, emergencyContact, idProof, institute, deposit, rentAmount, joinDate, bedId } = body;

        // Use a transaction to ensure atomicity (create tenant + update bed)
        const tenant = await prisma.$transaction(async (tx) => {
            // 1. Create the tenant
            const newTenant = await tx.tenant.create({
                data: {
                    name,
                    contact,
                    emergencyContact,
                    idProof,
                    institute,
                    deposit: parseFloat(deposit),
                    rentAmount: parseFloat(rentAmount),
                    joinDate: new Date(joinDate),
                },
            });

            // 2. If bed is assigned, update the bed
            if (bedId) {
                const bed = await tx.bed.findUnique({ where: { id: bedId } });
                if (bed && bed.isOccupied) {
                    throw new Error('Selected bed is already occupied');
                }

                await tx.bed.update({
                    where: { id: bedId },
                    data: {
                        isOccupied: true,
                        tenantId: newTenant.id
                    }
                });
            }

            return newTenant;
        });

        return NextResponse.json(tenant);
    } catch (error) {
        console.error('Error creating tenant:', error);
        if (error instanceof Error && error.message === 'Selected bed is already occupied') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
    }
}
