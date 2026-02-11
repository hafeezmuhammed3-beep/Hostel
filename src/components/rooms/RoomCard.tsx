"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble } from "lucide-react";
import { Room, Bed, Tenant } from "@prisma/client";

interface RoomWithBeds extends Room {
    beds: (Bed & { tenant: Tenant | null })[];
}

interface RoomCardProps {
    room: RoomWithBeds;
}

export function RoomCard({ room }: RoomCardProps) {
    const totalBeds = room.capacity;
    const occupiedBeds = room.beds.filter((bed) => bed.isOccupied).length;
    const availableBeds = totalBeds - occupiedBeds;

    let statusColor = "bg-green-500";
    let statusText = "Available";

    if (availableBeds === 0) {
        statusColor = "bg-red-500";
        statusText = "Full";
    } else if (occupiedBeds > 0) {
        statusColor = "bg-yellow-500";
        statusText = "Partial";
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Room {room.roomNumber}</CardTitle>
                <Badge className={statusColor}>{statusText}</Badge>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <BedDouble className="w-4 h-4" /> Capacity
                        </span>
                        <span>{totalBeds} Beds</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" /> Occupied
                        </span>
                        <span>{occupiedBeds} / {totalBeds}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-lg font-semibold">₹{room.pricePerBed} <span className="text-sm font-normal text-muted-foreground">/ bed</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
