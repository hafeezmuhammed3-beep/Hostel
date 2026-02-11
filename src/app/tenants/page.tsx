import { prisma } from "@/lib/prisma";
import { AddTenantDialog } from "@/components/tenants/AddTenantDialog";
import { TenantList } from "@/components/tenants/TenantList";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
    const [tenants, rooms] = await Promise.all([
        prisma.tenant.findMany({
            include: {
                bed: {
                    include: {
                        room: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.room.findMany({
            include: {
                beds: { // Include beds to check occupancy
                    include: {
                        tenant: true
                    }
                }
            },
            orderBy: {
                roomNumber: "asc",
            }
        }),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
                <AddTenantDialog rooms={rooms} />
            </div>

            <TenantList tenants={tenants} />
        </div>
    );
}
