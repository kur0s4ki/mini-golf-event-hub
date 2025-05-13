"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Flag, Trophy, Calendar, Clock, Users } from "lucide-react"
import { fetchLeaderboardData, LeaderboardData, TeamScore } from "@/lib/leaderboardService"

// Function to generate dynamic gradient based on time left
const getDynamicGradient = (timeLeft: number, initialDuration: number): string => {
  // Use initial duration as maxTime, default to 1 if duration is 0 or undefined
  const maxTime = initialDuration > 0 ? initialDuration : 1;

  // Calculate percentage of time left
  const percentage = Math.min(100, (timeLeft / maxTime) * 100);

  if (percentage >= 66) {
    // Green to yellow-green gradient (lots of time left)
    return 'linear-gradient(to right, #22c55e, #84cc16)';
  } else if (percentage >= 33) {
    // Yellow-green to yellow-orange gradient (medium time left)
    return 'linear-gradient(to right, #84cc16, #FFD166)';
  } else {
    // Orange to red gradient (little time left)
    return 'linear-gradient(to right, #FFD166, #ef4444)';
  }
};

export default function VerticalLeaderboardPage() {
  const router = useRouter()
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

    // Set up polling to refresh data every second
    const intervalId = setInterval(fetchData, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Pas besoin de formater le temps car nous utilisons une barre de progression

  if (loading && !leaderboardData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white font-badtyp text-4xl animate-pulse">
          Chargement...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-red-500 font-badtyp text-4xl">
          Erreur de chargement
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* HEADER - Responsive height using vh units */}
      <div className="w-full flex items-center justify-between px-3 sm:px-6 md:px-12 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-[#229954] via-[#6B43A9] to-[#FFD166] shadow-lg z-30" style={{ height: '10vh' }}>
        <div className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white flex items-center gap-2 sm:gap-3">
          <Flag className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FFD166]" /> MINI <span className="text-[#FFD166]">Golf</span>
        </div>
        <div className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white flex items-center gap-2 sm:gap-3">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FFD166]" /> CLASSEMENT
        </div>
      </div>

      {/* MAIN CONTENT - Responsive heights using vh units */}
      <div className="w-full flex flex-col" style={{ height: '90vh' }}>
        {/* TOP TEAMS SECTIONS - Responsive height */}
        <div className="w-full px-3 sm:px-4 md:px-6 pt-2 sm:pt-3 md:pt-4 pb-1 sm:pb-2" style={{ height: '35vh' }}>
          <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-3 md:p-4 h-full">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 h-full">
              {/* TOP TEAMS OF THE DAY */}
              <TopTeamsCompactSection
                title="TOP JOUR"
                icon={<Calendar className="w-full h-full text-[#FFD166]" />}
                teams={leaderboardData?.topTeamsDay.slice(0, 3) || []}
                accentColor="#FFD166"
              />

              {/* TOP TEAMS OF THE MONTH */}
              <TopTeamsCompactSection
                title="TOP MOIS"
                icon={<Calendar className="w-full h-full text-[#E76F51]" />}
                teams={leaderboardData?.topTeamsMonth.slice(0, 3) || []}
                accentColor="#E76F51"
              />

              {/* TOP TEAMS OF THE YEAR */}
              <TopTeamsCompactSection
                title="TOP ANNÉE"
                icon={<Trophy className="w-full h-full text-[#26A69A]" />}
                teams={leaderboardData?.topTeamsYear.slice(0, 3) || []}
                accentColor="#26A69A"
              />
            </div>
          </div>
        </div>

        {/* CURRENT GAMES SECTION - Responsive height */}
        <div className="w-full px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6" style={{ height: '47vh' }}>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-1 sm:px-2 py-1 sm:py-2 md:py-3" style={{ height: '8vh' }}>
            <div className="bg-[#1E293B] p-1 sm:p-2 md:p-3 rounded-full">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FFD166]" />
            </div>
            <h2 className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">EQUIPES EN COURS</h2>
          </div>

          <div style={{ height: 'calc(100% - 8vh)' }}>
            <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-4 md:p-6 h-full">
              {leaderboardData?.currentGames.length === 0 ? (
                <div className="py-8 text-center font-badtyp text-[#94A3B8] text-3xl h-full flex items-center justify-center">
                  No active games
                </div>
              ) : (
                <div className="grid grid-cols-1 h-full overflow-hidden">
                  {/* Calculer dynamiquement la taille des éléments en fonction du nombre d'équipes */}
                  <div
                    className="grid grid-cols-1 h-full"
                    style={{
                      gap: "16px",
                      gridTemplateRows: `repeat(${Math.min(5, leaderboardData?.currentGames?.length || 0)}, 1fr)`
                    }}
                  >
                    {leaderboardData?.currentGames.slice(0, 5).map((team, index) => {
                      // Responsive text sizes using Tailwind's responsive classes
                      const textSizeClass = "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
                      const subtextSizeClass = "text-base sm:text-lg md:text-xl lg:text-2xl";
                      const paddingClass = "p-2 sm:p-3 md:p-4 lg:p-6";
                      const iconSize = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16";
                      const borderSize = index === 0 ? 'border-l-4 sm:border-l-6 md:border-l-8 border-[#FFD166]' : '';

                      return (
                        <div
                          key={index}
                          className={`${paddingClass} rounded-lg sm:rounded-xl ${index % 2 === 0 ? "bg-[#2C3E50]/50" : "bg-[#1E293B]"} flex items-center ${borderSize}`}
                        >
                          {/* Team info - Left side */}
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4" style={{ width: '35%' }}>
                            <div className={`${iconSize} rounded-full bg-[#475569] flex items-center justify-center flex-shrink-0`}>
                              <span className={`font-badtyp text-white ${subtextSizeClass}`}>{index + 1}</span>
                            </div>
                            <div className="min-w-0">
                              <div className={`font-badtyp text-white ${textSizeClass} break-words line-clamp-2`}>{team.teamName}</div>
                            </div>
                          </div>

                          {/* Progress bar - Middle */}
                          <div className="flex-1 px-2 sm:px-3 md:px-4">
                            {team.timeLeft !== undefined && team.initialDuration !== undefined ? (
                              <div className="h-8 sm:h-10 md:h-12 lg:h-14 relative w-full">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="font-badtyp text-white text-sm sm:text-base md:text-lg lg:text-xl z-10 font-bold">
                                    {Math.floor(team.timeLeft / 60)}:{(team.timeLeft % 60).toString().padStart(2, '0')}
                                  </div>
                                </div>
                                <div className="w-full h-full bg-[#1E293B] rounded-md sm:rounded-lg overflow-hidden border border-[#475569]">
                                  <div
                                    className={`h-full rounded-md sm:rounded-lg ${index === 0 ? 'leaderboard-progress-pulse' : ''}`}
                                    style={{
                                      // Use initialDuration for width calculation, default to 1 to avoid division by zero
                                      width: `${Math.min(100, ((team.timeLeft ?? 0) / (team.initialDuration > 0 ? team.initialDuration : 1)) * 100)}%`,
                                      // Remove transition for instant updates
                                      // transition: 'width 1s ease-in-out',
                                      // Dynamic gradient based on time left relative to initial duration
                                      background: getDynamicGradient(team.timeLeft, team.initialDuration)
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <div className={`font-badtyp text-[#94A3B8] ${subtextSizeClass} text-center`}>--:--</div>
                            )}
                          </div>

                          {/* Score - Right side */}
                          <div style={{ width: '12%' }} className="text-right">
                            <div className={`font-badtyp text-[#FFD166] ${textSizeClass} ${index === 0 ? 'leaderboard-score-pulse' : ''}`}>{team.score}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom info section - animated text with responsive height and click handler */}
        <div className="w-full flex justify-center items-center" style={{ height: '8vh' }}>
          <div
            className="font-badtyp text-[#FFD166] text-lg sm:text-xl md:text-2xl lg:text-3xl animate-pulse flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer hover:text-white transition-colors"
            onClick={() => router.push('/team-info/UID005')} // Hardcoded UID for simulation (Miguel from LOS POTOS)
          >
            <span className="inline-block animate-bounce text-xl sm:text-2xl md:text-3xl lg:text-4xl">↓</span>
            <span>Badge pour plus d'informations</span>
            <span className="inline-block animate-bounce text-xl sm:text-2xl md:text-3xl lg:text-4xl">↓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TopTeamsSectionProps {
  title: string
  icon: React.ReactNode
  teams: TeamScore[]
  accentColor: string
}

function TopTeamsCompactSection({ title, icon, teams, accentColor }: TopTeamsSectionProps) {
  // Exactly 3 teams for fixed layout - fill with empty placeholders if needed
  let displayTeams = teams.slice(0, 3);

  // Fill with empty placeholders if less than 3 teams
  while (displayTeams.length < 3) {
    displayTeams.push({ teamName: "---", numberOfPlayers: 0, score: 0 });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Responsive title section */}
      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2" style={{ height: '15%' }}>
        <div className="bg-[#2C3E50] p-1 sm:p-2 rounded-full">
          <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8">{icon}</div>
        </div>
        <h2 className="font-badtyp text-base sm:text-xl md:text-2xl text-white">{title}</h2>
      </div>

      {/* Responsive content with equal distribution */}
      <div className="grid grid-cols-1 grid-rows-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4" style={{ height: '85%' }}>
        {teams.length === 0 ? (
          <div className="py-2 sm:py-4 text-center font-badtyp text-[#94A3B8] text-sm sm:text-base md:text-lg">
            Aucune donnée
          </div>
        ) : (
          <>
            {displayTeams.map((team, index) => {
              // Different styling for 1st, 2nd, and 3rd place
              let medalColor = "";
              let position = "";

              if (index === 0) {
                medalColor = "#FFD166"; // Gold
                position = "1";
              } else if (index === 1) {
                medalColor = "#94A3B8"; // Silver
                position = "2";
              } else if (index === 2) {
                medalColor = "#CD7F32"; // Bronze
                position = "3";
              }

              // For placeholder teams, use a muted style
              const isPlaceholder = team.teamName === "---";
              const borderWidth = isPlaceholder ? '2px sm:4px solid transparent' : `2px sm:4px solid ${index === 0 ? accentColor : medalColor}`;

              return (
                <div
                  key={index}
                  className={`p-1 sm:p-2 md:p-3 lg:p-4 rounded-md sm:rounded-lg ${isPlaceholder ? 'bg-[#1E293B]/50' : 'bg-[#2C3E50]/50'} flex items-center justify-between ${index === 0 && !isPlaceholder ? 'animate-pulse-slow' : ''} h-full`}
                  style={{ borderLeft: borderWidth }}
                >
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <div
                      className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: isPlaceholder ? '#1E293B' : medalColor }}
                    >
                      <span className="font-badtyp text-white text-xs sm:text-sm">{position}</span>
                    </div>
                    <div>
                      <div className={`font-badtyp ${isPlaceholder ? 'text-[#475569]' : 'text-white'} text-sm sm:text-base md:text-lg lg:text-xl`}>{team.teamName}</div>
                      {!isPlaceholder && (
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#94A3B8]" />
                          <span className="font-badtyp text-[#94A3B8] text-xs sm:text-sm">{team.numberOfPlayers}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isPlaceholder && (
                    <div
                      className={`font-badtyp text-sm sm:text-base md:text-xl lg:text-2xl px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${index === 0 ? 'leaderboard-score-pulse' : ''}`}
                      style={{ color: accentColor, backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      {team.score}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  )
}
