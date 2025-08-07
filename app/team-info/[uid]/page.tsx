"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Trophy, Users, Clock } from "lucide-react";

// Define types for team info data
interface GameScore {
  gameId: number;
  gameName: string;
  points: number;
}

interface Player {
  id: number;
  badgeId: string;
  badgeActivated: boolean;
  displayName: string;
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  points: number;
  scores: GameScore[];
}

interface TeamInfo {
  currentPlayerId: number;
  team: {
    id: number;
    name: string;
    playerCount: number;
    points: number;
    session: {
      id: number;
      timestamp: string;
      duration: number;
      status: string;
    };
    gamePlay: {
      id: number;
      description: string;
      duration: number;
    };
    language: {
      id: number;
      code: string;
      name: string;
    };
  };
  players: Player[];
}

export default function TeamInfoPage({ params }: { params: { uid: string } }) {
  const router = useRouter();
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown for normal view
  const [errorTimeLeft, setErrorTimeLeft] = useState(5); // 5 seconds countdown for error view

  // Fetch team info data
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        console.log(`Fetching team info for UID: ${params.uid}`);
        const response = await fetch(`http://172.16.10.201:8000/api/players/team-player-info/${params.uid}`);

        // Handle HTTP errors
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error("Impossible de charger les informations de l'équipe. Veuillez réessayer.");
        }

        const data = await response.json();
        console.log("API response:", data);

        // Check if the response is empty or doesn't have the expected structure
        if (!data) {
          console.error("Empty response from API");
          throw new Error("Aucune information trouvée pour cet identifiant.");
        }

        if (!data.team || !data.players) {
          console.error("Invalid response structure:", data);
          throw new Error("Aucune information d'équipe trouvée pour cet identifiant.");
        }

        if (data.players.length === 0) {
          console.error("No players found in team");
          throw new Error("Aucun joueur trouvé dans cette équipe.");
        }

        // If we got here, the data is valid
        setTeamInfo(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching team info:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Impossible de charger les informations de l'équipe. Veuillez réessayer.");
        }
        setTeamInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, [params.uid]);

  // Function to get dynamic gradient based on time left
  const getCountdownGradient = (timeLeft: number) => {
    const percentage = (timeLeft / 30) * 100;
    return `linear-gradient(90deg, #FFD166 ${percentage}%, #1E293B ${percentage}%)`;
  };

  // Handle redirects for all cases
  useEffect(() => {
    if (loading) return; // Don't set up redirects while loading

    // If there's an error or no team info, redirect after 5 seconds
    if (error || (!teamInfo && !error)) {
      console.log("Setting up error redirect timer");
      const errorTimer = setInterval(() => {
        setErrorTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(errorTimer);
            router.push("/leaderboard/vertical");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(errorTimer);
    }
    // Otherwise, redirect after 30 seconds of normal viewing
    else if (teamInfo) {
      console.log("Setting up normal redirect timer");
      const normalTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(normalTimer);
            router.push("/leaderboard/vertical");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(normalTimer);
    }
  }, [loading, error, teamInfo, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="text-2xl font-bold font-badtyp animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <div className="text-3xl font-bold font-badtyp text-[#E76F51] mb-4">Oops!</div>
        <div className="text-2xl font-bold font-badtyp mb-8 text-center px-4">{error}</div>
        <div className="text-lg font-badtyp text-[#94A3B8] animate-pulse">
          Retour au classement dans {errorTimeLeft} secondes...
        </div>
      </div>
    );
  }

  // Show error message if no team info is found
  if (!teamInfo && !loading && !error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <div className="text-3xl font-bold font-badtyp text-[#E76F51] mb-4">Oops!</div>
        <div className="text-2xl font-bold font-badtyp mb-8 text-center px-4">
          Aucune information d'équipe trouvée pour cet identifiant.
        </div>
        <div className="text-lg font-badtyp text-[#94A3B8] animate-pulse">
          Retour au classement dans {errorTimeLeft} secondes...
        </div>
      </div>
    );
  }

  // Safety check - don't render the main content if teamInfo is null
  if (!teamInfo) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      {/* HEADER - Responsive height using vh units */}
      <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-1 sm:py-2 bg-gradient-to-r from-[#229954] via-[#6B43A9] to-[#FFD166] shadow-lg z-30" style={{ height: '8vh' }}>
        <div className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white flex items-center gap-2">
          <Flag className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FFD166]" /> MINI <span className="text-[#FFD166]">Golf</span>
        </div>
        <div className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#FFD166]" /> ÉQUIPE
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full flex flex-col pt-1 sm:pt-2" style={{ height: '84vh', maxHeight: '84vh' }}>
        {/* Team name and info */}
        <div className="w-full px-3 sm:px-4 md:px-6 py-1 sm:py-2" style={{ flex: '0 0 auto' }}>
          <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-3 md:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div>
                <h1 className="font-badtyp text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#FFD166]">
                  {teamInfo.team.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8]" />
                  <span className="font-badtyp text-[#94A3B8] text-sm sm:text-base">
                    {teamInfo.team.playerCount} {teamInfo.team.playerCount > 1 ? "joueurs" : "joueur"}
                  </span>
                </div>
              </div>
              <div className="bg-[#0F172A] px-3 py-2 rounded-lg">
                <div className="font-badtyp text-sm sm:text-base text-[#94A3B8]">SCORE TOTAL</div>
                <div className="font-badtyp text-xl sm:text-2xl md:text-3xl text-[#FFD166]">
                  {teamInfo.team.points}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players scores table - Redesigned with games in rows and players in columns */}
        <div className="w-full px-3 sm:px-4 md:px-6 py-1 sm:py-2" style={{ flex: '0 0 auto' }}>
          <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-3 md:p-4 h-full">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="bg-[#0F172A] p-2 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD166]" />
              </div>
              <h2 className="font-badtyp text-xl sm:text-2xl text-white">SCORES PAR JEUX</h2>
            </div>

            {/* Game scores grid - Calculate dynamic grid columns based on player count */}
            <div className="grid grid-cols-1 gap-4">
              {/* Display all 7 games */}
              {(() => {
                // Define all 7 games that should be displayed
                const allGames = [
                  "Pinball",
                  "Roller Skate",
                  "Plinko",
                  "Spiral",
                  "Fortress",
                  "Skee Ball",
                  "Skycraper"
                ];

                return (
                  <>
                    {/* Header row with player names */}
                    <div
                      className={`grid gap-2 border-b-2 border-[#475569] pb-2`}
                      style={{
                        gridTemplateColumns: `minmax(100px, 2fr) ${teamInfo.players.map(() => '1fr').join(' ')}`
                      }}
                    >
                      <div className="font-badtyp text-sm sm:text-base text-[#94A3B8] flex items-center">PARCOURS</div>
                      {teamInfo.players.map((player) => (
                        <div key={player.id} className="font-badtyp text-sm sm:text-base text-[#94A3B8] text-center flex flex-col items-center">
                          <div className="truncate w-full text-center">{player.displayName}</div>
                          {player.id === teamInfo.currentPlayerId && (
                            <div className="w-2 h-2 rounded-full bg-[#FFD166] animate-pulse mt-1"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Game rows */}
                    {allGames.map((gameName, gameIndex) => (
                      <div
                        key={gameIndex}
                        className={`grid gap-2 py-3 rounded-lg ${gameIndex % 2 === 0 ? 'bg-[#2C3E50]/50' : 'bg-[#1E293B]'}`}
                        style={{
                          gridTemplateColumns: `minmax(100px, 2fr) ${teamInfo.players.map(() => '1fr').join(' ')}`
                        }}
                      >
                        {/* Game name */}
                        <div className="font-badtyp text-sm sm:text-base text-white flex items-center">
                          <div className="truncate">{gameName}</div>
                        </div>

                        {/* Player scores for this game */}
                        {teamInfo.players.map((player) => {
                          const scoreObj = player.scores.find(s => s.gameName === gameName);
                          const points = scoreObj ? scoreObj.points : 0;

                          // Find highest score for this game among all players
                          const allScoresForGame = teamInfo.players
                            .map(p => p.scores.find(s => s.gameName === gameName)?.points || 0)
                            .filter(s => s > 0);

                          const highestScore = allScoresForGame.length > 0 ? Math.max(...allScoresForGame) : 0;
                          const isHighestScore = points > 0 && points === highestScore;
                          const isCurrentPlayer = player.id === teamInfo.currentPlayerId;

                          return (
                            <div key={player.id} className="font-badtyp text-sm sm:text-base text-white text-center">
                              <div
                                className={`rounded-md py-1 px-1 mx-auto ${points > 0 ? (isHighestScore ? 'bg-[#FFD166]/20' : 'bg-[#0F172A]/50') : ''}
                                            ${isCurrentPlayer ? 'border border-[#FFD166]/50' : ''}`}
                                style={{ width: '80%', minWidth: '24px' }}
                              >
                                {points > 0 ? points : '-'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Total scores row */}
                    <div
                      className="grid gap-2 py-3 rounded-lg bg-[#0F172A]/80 border-t-2 border-[#475569]"
                      style={{
                        gridTemplateColumns: `minmax(100px, 2fr) ${teamInfo.players.map(() => '1fr').join(' ')}`
                      }}
                    >
                      <div className="font-badtyp text-sm sm:text-base text-[#FFD166] flex items-center">
                        <div className="truncate">TOTAL</div>
                      </div>

                      {/* Total scores for each player */}
                      {teamInfo.players.map((player) => {
                        const highestPoints = Math.max(...teamInfo.players.map(p => p.points));
                        const isHighestTotal = player.points === highestPoints;
                        const isCurrentPlayer = player.id === teamInfo.currentPlayerId;

                        return (
                          <div key={player.id} className="font-badtyp text-sm sm:text-base text-[#FFD166] text-center">
                            <div
                              className={`rounded-md py-1 px-1 mx-auto bg-[#0F172A]
                                          ${isHighestTotal ? 'border-2 border-[#FFD166]' : ''}
                                          ${isCurrentPlayer ? 'shadow-[0_0_8px_rgba(255,209,102,0.5)]' : ''}`}
                              style={{ width: '80%', minWidth: '24px' }}
                            >
                              {player.points}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Player rankings section - Takes all available space */}
        <div className="w-full px-3 sm:px-4 md:px-6 py-1 sm:py-2" style={{ flex: '1 0 0' }}>
          <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-3 md:p-4 h-full">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="bg-[#0F172A] p-2 rounded-full">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD166]" />
              </div>
              <h2 className="font-badtyp text-xl sm:text-2xl text-white">CLASSEMENT JOUEURS</h2>
            </div>

            {/* Sort players by total score and display ranking */}
            <div className="h-[calc(100%-40px)] flex flex-col">
              {/* Calculate dynamic height for each player row based on number of players */}
              <div
                className="grid grid-cols-1 h-full"
                style={{
                  gap: "8px",
                  gridTemplateRows: `repeat(${teamInfo.players.length}, 1fr)`
                }}
              >
                {[...teamInfo.players]
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => {
                    const isCurrentPlayer = player.id === teamInfo.currentPlayerId;
                    const rankColors = ["#FFD166", "#94A3B8", "#CD7F32", "#475569"];
                    const rankColor = rankColors[index] || rankColors[3];

                    // Calculate percentage of max score
                    const maxScore = Math.max(...teamInfo.players.map(p => p.points));
                    const scorePercentage = maxScore > 0 ? Math.round((player.points / maxScore) * 100) : 0;

                    return (
                      <div
                        key={player.id}
                        className={`flex flex-col sm:flex-row gap-2 p-2 rounded-lg ${isCurrentPlayer ? 'bg-[#FFD166]/10' : 'bg-[#2C3E50]/50'} h-full`}
                      >
                        {/* Rank and name */}
                        <div className="flex items-center gap-2 w-full sm:w-1/4">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: rankColor }}
                          >
                            <span className="font-badtyp text-white text-sm">{index + 1}</span>
                          </div>
                          <div className="font-badtyp text-white text-lg truncate">
                            {player.displayName}
                          </div>
                        </div>

                        {/* Score bar */}
                        <div className="flex-grow flex items-center">
                          <div className="w-full bg-[#1E293B] h-6 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#229954] to-[#FFD166] h-full rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${scorePercentage}%` }}
                            >
                              <span className="text-sm font-bold text-black">{player.points}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - Countdown timer */}
      <div className="w-full px-3 sm:px-4 md:px-6 py-1 sm:py-2" style={{ height: '8vh', flex: '0 0 auto' }}>
        <div className="bg-[#1E293B] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.2)] sm:shadow-[0_12px_0_rgba(0,0,0,0.2)] p-2 sm:p-3 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8]" />
              <span className="font-badtyp text-sm sm:text-base text-[#94A3B8]">
                Retour au classement dans
              </span>
            </div>
            <div className="relative w-24 sm:w-32 h-6 sm:h-8 bg-[#0F172A] rounded-md overflow-hidden">
              <div
                className="h-full"
                style={{ background: getCountdownGradient(timeLeft) }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-badtyp text-white">
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
