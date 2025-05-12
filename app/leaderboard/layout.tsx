"use client"

import React from "react"

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-black">
      {children}
    </div>
  )
}
