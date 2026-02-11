"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tenant, Bed, Room } from "@prisma/client";
import { format } from "date-fns";

type TenantWithBed = Tenant & {
    bed: (Bed & { room: Room }) | null;
};

interface TenantListProps {
    tenants: TenantWithBed[];
}

export function TenantList({ tenants }: TenantListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Room / Bed</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Rent</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell className="font-medium">{tenant.name}</TableCell>
                            <TableCell>
                                {tenant.bed ? (
                                    <Badge variant="secondary">
                                        {tenant.bed.room.roomNumber} - {tenant.bed.bedNumber}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground italic">Unassigned</span>
                                )}
                            </TableCell>
                            <TableCell>{tenant.contact}</TableCell>
                            <TableCell>₹{tenant.rentAmount}</TableCell>
                            <TableCell>{format(new Date(tenant.joinDate), "dd MMM yyyy")}</TableCell>
                            <TableCell>
                                <Badge variant={tenant.isActive ? "default" : "destructive"}>
                                    {tenant.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    {tenants.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                No tenants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
