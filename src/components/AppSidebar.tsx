"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BedDouble, Users, IndianRupee, Receipt, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Rooms & Beds", href: "/rooms", icon: BedDouble },
    { name: "Tenants", href: "/tenants", icon: Users },
    { name: "Rent Tracker", href: "/rent", icon: IndianRupee },
    { name: "Expenses", href: "/expenses", icon: Receipt },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === "/login") return null;

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="w-64 bg-card border-r h-screen hidden md:flex flex-col">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-primary">HostelMgr</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
