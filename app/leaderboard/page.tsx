"use client"

import React, { useEffect, useState } from "react"
import { Flag, Trophy, Calendar, Clock, Users, Star } from "lucide-react"
import { fetchLeaderboardData, LeaderboardData, TeamScore } from "@/lib/leaderboardService"

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchLeaderboardData()
        setLeaderboardData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching leaderboard data:", err)
        setError("Failed to load leaderboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading && !leaderboardData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white font-badtyp text-4xl animate-pulse">
          Loading Leaderboard...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-red-500 font-badtyp text-4xl">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-12 py-5 bg-gradient-to-r from-[#229954] via-[#6B43A9] to-[#FFD166] shadow-lg z-30" style={{ flex: '0 0 auto' }}>
        <div className="font-badtyp text-4xl text-white flex items-center gap-3">
          <Flag className="w-8 h-8 text-[#FFD166]" /> MINI <span className="text-[#FFD166]">Golf</span>
        </div>
        <div className="font-badtyp text-4xl text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-[#FFD166]" /> LEADERBOARD
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full overflow-y-auto p-6 flex flex-col gap-8">
        {/* CURRENT GAMES SECTION */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-[#FFD166]" />
            <h2 className="font-badtyp text-3xl text-white">CURRENT GAMES</h2>
          </div>
          <div className="bg-[#1E293B] rounded-xl border-4 border-white shadow-[0_8px_0_rgba(0,0,0,0.2)] p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#475569]">
                  <th className="py-3 px-4 text-left font-badtyp text-[#94A3B8] text-xl">TEAM</th>
                  <th className="py-3 px-4 text-center font-badtyp text-[#94A3B8] text-xl">PLAYERS</th>
                  <th className="py-3 px-4 text-center font-badtyp text-[#94A3B8] text-xl">SCORE</th>
                  <th className="py-3 px-4 text-right font-badtyp text-[#94A3B8] text-xl">TIME LEFT</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData?.currentGames.map((team, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-[#2C3E50]/30" : ""}>
                    <td className="py-4 px-4 font-badtyp text-white text-2xl">{team.teamName}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-5 h-5 text-[#94A3B8]" />
                        <span className="font-badtyp text-white text-xl">{team.numberOfPlayers}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-badtyp text-[#FFD166] text-2xl">{team.score}</td>
                    <td className="py-4 px-4 text-right font-badtyp text-white text-xl">
                      {team.timeLeft ? formatTime(team.timeLeft) : "--:--"}
                    </td>
                  </tr>
                ))}
                {leaderboardData?.currentGames.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center font-badtyp text-[#94A3B8] text-xl">
                      No active games at the moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP TEAMS SECTIONS */}
        <div className="grid grid-cols-1 gap-8">
          {/* TOP TEAMS OF THE DAY */}
          <TopTeamsSection 
            title="TOP TEAMS OF THE DAY" 
            icon={<Calendar className="w-8 h-8 text-[#FFD166]" />} 
            teams={leaderboardData?.topTeamsDay || []} 
          />
          
          {/* TOP TEAMS OF THE MONTH */}
          <TopTeamsSection 
            title="TOP TEAMS OF THE MONTH" 
            icon={<Calendar className="w-8 h-8 text-[#E76F51]" />} 
            teams={leaderboardData?.topTeamsMonth || []} 
          />
          
          {/* TOP TEAMS OF THE YEAR */}
          <TopTeamsSection 
            title="TOP TEAMS OF THE YEAR" 
            icon={<Trophy className="w-8 h-8 text-[#26A69A]" />} 
            teams={leaderboardData?.topTeamsYear || []} 
          />
        </div>
      </div>
    </div>
  )
}

interface TopTeamsSectionProps {
  title: string
  icon: React.ReactNode
  teams: TeamScore[]
}

function TopTeamsSection({ title, icon, teams }: TopTeamsSectionProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="font-badtyp text-3xl text-white">{title}</h2>
      </div>
      <div className="bg-[#1E293B] rounded-xl border-4 border-white shadow-[0_8px_0_rgba(0,0,0,0.2)] p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#475569]">
              <th className="py-3 px-4 text-center font-badtyp text-[#94A3B8] text-xl">RANK</th>
              <th className="py-3 px-4 text-left font-badtyp text-[#94A3B8] text-xl">TEAM</th>
              <th className="py-3 px-4 text-center font-badtyp text-[#94A3B8] text-xl">PLAYERS</th>
              <th className="py-3 px-4 text-right font-badtyp text-[#94A3B8] text-xl">SCORE</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-[#2C3E50]/30" : ""}>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center">
                    {index === 0 ? (
                      <div className="w-8 h-8 rounded-full bg-[#FFD166] flex items-center justify-center">
                        <Star className="w-5 h-5 text-black" />
                      </div>
                    ) : (
                      <span className="font-badtyp text-white text-xl">{index + 1}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-badtyp text-white text-2xl">{team.teamName}</td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-[#94A3B8]" />
                    <span className="font-badtyp text-white text-xl">{team.numberOfPlayers}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-badtyp text-[#FFD166] text-2xl">{team.score}</td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center font-badtyp text-[#94A3B8] text-xl">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
