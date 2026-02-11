"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tenant } from "@prisma/client";

interface AddPaymentDialogProps {
    tenants: Tenant[];
}

export function AddPaymentDialog({ tenants }: AddPaymentDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        tenantId: "",
        amountPaid: "",
        date: new Date().toISOString().split('T')[0],
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setOpen(false);
                setFormData({
                    tenantId: "",
                    amountPaid: "",
                    date: new Date().toISOString().split('T')[0],
                    month: new Date().toISOString().slice(0, 7),
                    notes: "",
                });
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to record payment");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Tenant</Label>
                            <Select value={formData.tenantId} onValueChange={(val) => setFormData({ ...formData, tenantId: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Tenant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenants.map(tenant => (
                                        <SelectItem key={tenant.id} value={tenant.id}>
                                            {tenant.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="month">Month</Label>
                                <Input id="month" type="month" required value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Payment Date</Label>
                                <Input id="date" type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount Paid</Label>
                            <Input id="amount" type="number" required value={formData.amountPaid} onChange={e => setFormData({ ...formData, amountPaid: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
