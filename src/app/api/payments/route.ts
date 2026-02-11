import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tenantId, amountPaid, date, month, notes } = body;

        // Fetch tenant to get rent amount
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        // Check if a payment record exists for this month
        let payment = await prisma.payment.findFirst({
            where: {
                tenantId,
                month,
            },
        });

        const paidAmount = parseFloat(amountPaid);
        const rentDue = tenant.rentAmount;

        if (payment) {
            // Update existing record
            const newTotalPaid = payment.amountPaid + paidAmount;
            let status = "PARTIAL";
            if (newTotalPaid >= rentDue) {
                status = "PAID";
            }

            payment = await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    amountPaid: newTotalPaid,
                    status,
                    date: new Date(date), // Update last payment date
                    notes: notes ? `${payment.notes ? payment.notes + '; ' : ''}${notes}` : payment.notes,
                },
            });
        } else {
            // Create new record
            let status = "PARTIAL";
            if (paidAmount >= rentDue) {
                status = "PAID";
            } else if (paidAmount === 0) {
                status = "PENDING";
            }

            payment = await prisma.payment.create({
                data: {
                    tenantId,
                    amountDue: rentDue,
                    amountPaid: paidAmount,
                    date: new Date(date),
                    month,
                    status,
                    notes,
                },
            });
        }

        return NextResponse.json(payment);
    } catch (error) {
        console.error('Error recording payment:', error);
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }
}
