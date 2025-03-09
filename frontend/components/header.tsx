"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard" className="text-xl font-bold">
                        Microservices Dashboard
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Button size="sm" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}