"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function MonthSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default to current month if not present
    const currentMonth = new Date().toISOString().slice(0, 7);
    const selectedMonth = searchParams.get("month") || currentMonth;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMonth = e.target.value;
        router.push(`/rent?month=${newMonth}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Month:</span>
            <Input
                type="month"
                value={selectedMonth}
                onChange={handleChange}
                className="w-auto"
            />
        </div>
    );
}
