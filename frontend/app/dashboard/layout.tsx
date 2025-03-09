import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

// IMPORTANT: Remove the authentication check for now
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
        </div>
    )
}