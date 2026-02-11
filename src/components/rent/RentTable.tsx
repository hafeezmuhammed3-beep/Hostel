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
import { Tenant, Payment, Bed, Room } from "@prisma/client";
import { format } from "date-fns";

type TenantWithBed = Tenant & {
    bed: (Bed & { room: Room }) | null;
    payments: Payment[]; // Filtered by month in parent or API
};

export interface RentTableProps {
    tenants: TenantWithBed[];
    selectedMonth: string;
}

export function RentTable({ tenants, selectedMonth }: RentTableProps) {
    // We process tenants to determine their status for the selected month
    const rentData = tenants.map((tenant) => {
        // Find payment for the selected month
        const payment = tenant.payments.find((p) => p.month === selectedMonth);

        // Default values if no payment record exists yet
        const rentDue = tenant.rentAmount;
        const paid = payment ? payment.amountPaid : 0;
        const balance = rentDue - paid;
        let status = payment ? payment.status : "PENDING";
        const lastPaymentDate = payment ? payment.date : null;

        if (!payment && balance <= 0) status = "PAID"; // Edge case if rent is 0?
        if (balance > 0 && paid > 0) status = "PARTIAL";

        return {
            tenant,
            rentDue,
            paid,
            balance,
            status,
            lastPaymentDate,
        };
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Rent Due</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Payment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rentData.map((item) => (
                        <TableRow key={item.tenant.id}>
                            <TableCell className="font-medium">{item.tenant.name}</TableCell>
                            <TableCell>
                                {item.tenant.bed ? (
                                    <Badge variant="secondary">
                                        {item.tenant.bed.room.roomNumber} - {item.tenant.bed.bedNumber}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground italic">Unassigned</span>
                                )}
                            </TableCell>
                            <TableCell>₹{item.rentDue}</TableCell>
                            <TableCell className="text-green-600 font-semibold">₹{item.paid}</TableCell>
                            <TableCell className="text-red-500 font-semibold">₹{item.balance}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    item.status === "PAID" ? "default" :
                                        item.status === "PARTIAL" ? "secondary" : "destructive" // destructive for PENDING
                                }>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {item.lastPaymentDate ? format(new Date(item.lastPaymentDate), "dd MMM yyyy") : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                    {rentData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                No active tenants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
