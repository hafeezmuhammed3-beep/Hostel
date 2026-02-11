import { AddRoomDialog } from "@/components/rooms/AddRoomDialog";
import { RoomCard } from "@/components/rooms/RoomCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
    const rooms = await prisma.room.findMany({
        include: {
            beds: {
                include: {
                    tenant: true
                }
            }
        },
        orderBy: {
            roomNumber: "asc"
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Rooms & Beds</h1>
                <AddRoomDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>

            {rooms.length === 0 && (
                <div className="text-center text-muted-foreground mt-10">
                    No rooms found. Add a room to get started.
                </div>
            )}
        </div>
    );
}
