"use client"

import { Inter } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import BadgeListener from "@/components/badge-listener"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <body className={`${inter.className} h-full`}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main className="h-full">
                            {children}
                        </main>
                        <BadgeListener />
                        <Toaster />
                    </ThemeProvider>
                </QueryClientProvider>
            </body>
        </html>
    )
}