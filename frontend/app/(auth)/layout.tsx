import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "..(auth)/global.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Microservices Dashboard",
    description: "Frontend for microservices architecture",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <AuthProvider>
                        <div className="flex min-h-screen flex-col">
                            <Header />
                            <div className="flex flex-1">
                                <Sidebar />
                                <main className="flex-1 p-6 md:p-8">{children}</main>
                            </div>
                        </div>
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

