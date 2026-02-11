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
import { Room, Bed, Tenant } from "@prisma/client";

interface RoomWithBeds extends Room {
    beds: (Bed & { tenant: Tenant | null })[];
}

interface AddTenantDialogProps {
    rooms: RoomWithBeds[];
}

export function AddTenantDialog({ rooms }: AddTenantDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        emergencyContact: "",
        idProof: "",
        institute: "",
        deposit: "",
        rentAmount: "",
        joinDate: new Date().toISOString().split('T')[0],
    });

    const [selectedRoomId, setSelectedRoomId] = useState<string>("");
    const [selectedBedId, setSelectedBedId] = useState<string>("");

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    const availableBeds = selectedRoom?.beds.filter(b => !b.isOccupied) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/tenants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    bedId: selectedBedId || undefined,
                }),
            });

            if (res.ok) {
                setOpen(false);
                setFormData({
                    name: "",
                    contact: "",
                    emergencyContact: "",
                    idProof: "",
                    institute: "",
                    deposit: "",
                    rentAmount: "",
                    joinDate: new Date().toISOString().split('T')[0],
                });
                setSelectedRoomId("");
                setSelectedBedId("");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to create tenant");
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
                    <Plus className="w-4 h-4" /> Add Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Tenant</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Phone Number</Label>
                                <Input id="contact" required value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="emergency">Emergency Contact</Label>
                                <Input id="emergency" required value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="institute">Institute/Company</Label>
                                <Input id="institute" value={formData.institute} onChange={e => setFormData({ ...formData, institute: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deposit">Deposit Amount</Label>
                                <Input id="deposit" type="number" required value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rent">Rent Amount</Label>
                                <Input id="rent" type="number" required value={formData.rentAmount} onChange={e => setFormData({ ...formData, rentAmount: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="joinDate">Joining Date</Label>
                            <Input id="joinDate" type="date" required value={formData.joinDate} onChange={e => setFormData({ ...formData, joinDate: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Assign Room</Label>
                                <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map(room => (
                                            <SelectItem key={room.id} value={room.id}>
                                                Room {room.roomNumber} ({room.beds.filter(b => !b.isOccupied).length} beds free)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assign Bed</Label>
                                <Select value={selectedBedId} onValueChange={setSelectedBedId} disabled={!selectedRoomId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Bed" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBeds.map(bed => (
                                            <SelectItem key={bed.id} value={bed.id}>{bed.bedNumber}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
