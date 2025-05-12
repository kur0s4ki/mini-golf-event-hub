"use client"

import React from "react"

export default function VerticalLeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-black overflow-hidden" style={{ width: '1080px', height: '1920px', maxWidth: '100vw', maxHeight: '100vh' }}>
      {children}
    </div>
  )
}
