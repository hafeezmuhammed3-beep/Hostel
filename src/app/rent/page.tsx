import { prisma } from "@/lib/prisma";
import { RentTable } from "@/components/rent/RentTable";
import { AddPaymentDialog } from "@/components/rent/AddPaymentDialog";
import { MonthSelector } from "@/components/rent/MonthSelector";

export const dynamic = "force-dynamic";

interface RentPageProps {
    searchParams: Promise<{ month?: string }>;
}

export default async function RentPage({ searchParams }: RentPageProps) {
    const resolvedSearchParams = await searchParams;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const selectedMonth = resolvedSearchParams.month || currentMonth;

    // Fetch tenants who are active OR have payment records for this month
    const tenants = await prisma.tenant.findMany({
        where: {
            OR: [
                { isActive: true },
                { payments: { some: { month: selectedMonth } } },
            ],
        },
        include: {
            bed: {
                include: {
                    room: true
                }
            },
            payments: {
                where: { month: selectedMonth },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    // For the add payment dialog, we might want all active tenants
    // (We can just use limits or separate query if list is too huge, but reusing 'tenants' 
    // might exclude some inactive ones who strictly want to pay old dues unless they have a record for this month. 
    // Let's rely on the list we fetched which includes active ones.)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Rent Tracker</h1>
                <div className="flex items-center gap-4">
                    <MonthSelector />
                    <AddPaymentDialog tenants={tenants} />
                </div>
            </div>

            <RentTable tenants={tenants} selectedMonth={selectedMonth} />
        </div>
    );
}
