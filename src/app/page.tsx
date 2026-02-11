import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, BedDouble, Wallet, Receipt, TrendingUp, AlertCircle } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);

  const [rooms, tenants, payments, expenses] = await Promise.all([
    prisma.room.findMany({
      include: { beds: true }
    }),
    prisma.tenant.findMany({
      where: { isActive: true }
    }),
    prisma.payment.findMany({
      where: { month: currentMonth }
    }),
    prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })
  ]);

  // Operational Stats
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, room) => acc + room.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, room) => acc + room.beds.filter(b => b.isOccupied).length, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : "0";
  const activeTenants = tenants.length;

  // Financial Stats (Current Month)
  // Rent Due: Sum of rentAmount for all active tenants. 
  // NOTE: This assumes all active tenants owe rent for this month. 
  // Refinements could check if they joined this month (pro-rated) etc.

  const monthlyRentDue = tenants.reduce((acc, t) => acc + t.rentAmount, 0);

  const rentCollected = payments.reduce((acc, p) => acc + p.amountPaid, 0);

  // Pending is tricky. Simple version: Due - Collected (Aggregate). 
  // Per-tenant pending is more accurate but aggregate gives a rough idea.
  // We can calculate actual pending by summing (TenantRent - Paid) for each tenant.
  // Let's stick to Aggregate for the top-level card for simplicity, 
  // or refined calculation: Sum(max(0, tenant.rent - paidByTenant)).
  // But we have `payments` list.

  // Better Pending Calc:
  let totalPending = 0;
  tenants.forEach(tenant => {
    const payment = payments.find(p => p.tenantId === tenant.id);
    const paid = payment ? payment.amountPaid : 0;
    const due = tenant.rentAmount; // Assuming full rent
    if (due > paid) {
      totalPending += (due - paid);
    }
  });

  const totalExpenses = expenses.reduce((acc, e) => e.amount, 0);
  const currentMonthNet = rentCollected - totalExpenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Operational Overview */}
      <h2 className="text-xl font-semibold tracking-tight">Operational Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Rooms"
          value={totalRooms}
          icon={BedDouble}
          description={`${totalBeds} total beds`}
        />
        <StatsCard
          title="Active Tenants"
          value={activeTenants}
          icon={Users}
          description="Currently residing"
        />
        <StatsCard
          title="Occupancy"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          description={`${occupiedBeds} occupied / ${availableBeds} available`}
        />
        <StatsCard
          title="Available Beds"
          value={availableBeds}
          icon={BedDouble}
          description="Ready for allocation"
        />
      </div>

      {/* Financial Overview */}
      <h2 className="text-xl font-semibold tracking-tight mt-6">Financial Overview ({now.toLocaleString('default', { month: 'long', year: 'numeric' })})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Rent Due"
          value={`₹${monthlyRentDue.toLocaleString()}`}
          icon={Wallet}
          description="Expected revenue"
        />
        <StatsCard
          title="Rent Collected"
          value={`₹${rentCollected.toLocaleString()}`}
          icon={Wallet}
          className="text-green-600"
          description="Received so far"
        />
        <StatsCard
          title="Pending Rent"
          value={`₹${totalPending.toLocaleString()}`}
          icon={AlertCircle}
          className="text-yellow-600"
          description="To be collected"
        />
        <StatsCard
          title="Net Income"
          value={`₹${currentMonthNet.toLocaleString()}`}
          icon={Wallet}
          description={`Expenses: ₹${totalExpenses.toLocaleString()}`}
        />
      </div>
    </div>
  );
}
