"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, Calendar, BookOpen, Bell, Home, Settings, BarChart } from "lucide-react"

const routes = [
    {
        name: "Dashboard",
        path: "/",
        icon: <Home className="h-5 w-5" />,
    },
    {
        name: "Users",
        path: "/users",
        icon: <Users className="h-5 w-5" />,
    },
    {
        name: "Events",
        path: "/events",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        name: "Bookings",
        path: "/bookings",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        name: "Notifications",
        path: "/notifications",
        icon: <Bell className="h-5 w-5" />,
    },
    {
        name: "Analytics",
        path: "/analytics",
        icon: <BarChart className="h-5 w-5" />,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: <Settings className="h-5 w-5" />,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
            <div className="flex flex-col gap-2 p-4">
                {routes.map((route) => (
                    <Button
                        key={route.path}
                        variant="ghost"
                        className={cn(
                            "flex items-center justify-start gap-2 px-3",
                            pathname === route.path && "bg-muted font-medium",
                        )}
                        asChild
                    >
                        <Link href={route.path}>
                            {route.icon}
                            {route.name}
                        </Link>
                    </Button>
                ))}
            </div>
        </aside>
    )
}

