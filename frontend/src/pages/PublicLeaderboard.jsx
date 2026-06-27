import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function PublicLeaderboard({ apiUrl }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall');
  const [socket, setSocket] = useState(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const [highlightTeam, setHighlightTeam] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Team configuration with colors and logos
  const teamConfig = {
    'RED': { color: 'red-raptor', emoji: '🦖', name: 'Red Raptors', light: 'bg-red-raptor/10', border: 'border-red-raptor' },
    'BLUE': { color: 'blue-whale', emoji: '🐋', name: 'Blue Marine Whales', light: 'bg-blue-whale/10', border: 'border-blue-whale' },
    'GREEN': { color: 'green-fighter', emoji: '🥋', name: 'Kee Green Fighters', light: 'bg-green-fighter/10', border: 'border-green-fighter' },
  };

  useEffect(() => {
    // Connect to WebSocket
    const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, { reconnection: true });

    newSocket.on('connect', () => {
      setLiveConnected(true);
      console.log('✓ Live connection established');
    });

    // LIVE update when results change
    newSocket.on('result-updated', (data) => {
      setHighlightTeam(null);
      setLeaderboard(data.leaderboard);
      if (data.gameId === selectedGame) {
        fetchGameResults(data.gameId);
      }
      // Trigger highlight animation
      data.leaderboard.forEach(team => {
        setHighlightTeam(team.name);
        setTimeout(() => setHighlightTeam(null), 1000);
      });
    });

    newSocket.on('leaderboard-updated', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    newSocket.on('disconnect', () => {
      setLiveConnected(false);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, [selectedGame]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchLeaderboard(), fetchGames()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${apiUrl}/leaderboard`);
      if (response.ok) {
        setLeaderboard(await response.json());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch(`${apiUrl}/games`);
      if (response.ok) {
        const gamesData = await response.json();
        setGames(gamesData);
        if (gamesData.length > 0 && !selectedGame) {
          setSelectedGame(gamesData[0].id);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchGameResults = async (gameId) => {
    try {
      const response = await fetch(`${apiUrl}/results/${gameId}`);
      if (response.ok) {
        setGameResults(await response.json());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getMedal = (position) => {
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return medals[position] || '';
  };

  const getTeamConfig = (teamName) => {
    const key = Object.keys(teamConfig).find(k => teamConfig[k].name === teamName || k === teamName);
    return teamConfig[key] || { color: 'gray', emoji: '⚽', name: teamName, light: 'bg-gray-500/10', border: 'border-gray-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <p className="text-gray-400 text-lg">Loading Inter Kee Games 2026...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-red-raptor opacity-5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-whale opacity-5 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce">🏆</div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-raptor via-blue-whale to-green-fighter">
                  Inter Kee Games 2026
                </h1>
                <p className="text-gray-400 text-sm">Live Sports Scoreboard</p>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${liveConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-semibold text-gray-300">
                {liveConnected ? '🔴 LIVE' : '⚫ OFFLINE'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {['overall', 'games'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === tab
                  ? 'border-blue-whale text-blue-whale'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'overall' ? '📊 Overall Standings' : '🎮 Game Results'}
            </button>
          ))}
        </div>

        {/* Overall Standings Tab */}
        {activeTab === 'overall' && (
          <div className="animate-slide-up space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Final Standings</h2>

            {/* Podium View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[2, 1, 3].map((position) => {
                const team = leaderboard[position - 1];
                if (!team) return null;
                const config = getTeamConfig(team.name);
                const isHighlighted = highlightTeam === team.name;

                return (
                  <div
                    key={team.id}
                    onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                    className={`transform transition-all duration-500 cursor-pointer ${
                      isHighlighted ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`rounded-2xl border-2 overflow-hidden backdrop-blur-xl transition-all duration-300 ${
                        config.border
                      } ${config.light} ${
                        expandedTeam === team.id ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      style={{
                        borderColor: isHighlighted ? '#FFD700' : undefined,
                        boxShadow: isHighlighted ? '0 0 20px rgba(255, 215, 0, 0.5)' : undefined,
                      }}
                    >
                      {/* Podium Number */}
                      <div className="text-center pt-4">
                        <div className="text-6xl mb-2">{getMedal(position)}</div>
                        <div className="text-2xl font-bold text-gray-300">
                          {position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'}
                        </div>
                      </div>

                      {/* Team Info */}
                      <div className="p-6 text-center">
                        <div className="text-4xl mb-3">{config.emoji}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                          {team.totalPoints}
                        </div>
                        <p className="text-gray-400 text-sm mt-2">Points</p>
                      </div>

                      {/* Expanded Details */}
                      {expandedTeam === team.id && (
                        <div className="px-6 pb-6 space-y-3 border-t border-gray-600/50 pt-4 animate-scale-in">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Games Played:</span>
                            <span className="text-white font-semibold">12</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Avg Points:</span>
                            <span className="text-white font-semibold">{Math.round(team.totalPoints / 12)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Win Rate:</span>
                            <span className="text-white font-semibold">67%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Leaderboard Table */}
            <div className="rounded-2xl overflow-hidden border border-gray-700 backdrop-blur-xl bg-card-bg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-gray-400 font-semibold">Team</th>
                    <th className="px-6 py-4 text-right text-gray-400 font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {leaderboard.map((team, index) => {
                    const config = getTeamConfig(team.name);
                    return (
                      <tr
                        key={team.id}
                        className={`hover:bg-slate-700/50 transition-colors duration-300 ${
                          highlightTeam === team.name ? 'bg-yellow-500/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getMedal(index + 1)}</span>
                            <span className="text-lg font-bold text-gray-300">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{config.emoji}</span>
                            <span className="font-semibold text-white">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                            {team.totalPoints}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Game Results Tab */}
        {activeTab === 'games' && (
          <div className="animate-slide-up space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Game Results</h2>

            {/* Game Selector */}
            <div className="flex gap-4 flex-wrap">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedGame === game.id
                      ? 'bg-blue-whale text-white ring-2 ring-blue-whale/50'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>

            {/* Results Display */}
            {gameResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
                {[
                  { pos: 'first', medal: '🥇', label: '1st Place', key: 'firstPlaceTeam', points: 'firstPlacePoints' },
                  { pos: 'second', medal: '🥈', label: '2nd Place', key: 'secondPlaceTeam', points: 'secondPlacePoints' },
                  { pos: 'third', medal: '🥉', label: '3rd Place', key: 'thirdPlaceTeam', points: 'thirdPlacePoints' },
                ].map(({ pos, medal, label, key, points }) => {
                  const teamName = gameResults[0]?.[key];
                  const config = getTeamConfig(teamName);
                  return (
                    <div key={pos} className="group cursor-pointer">
                      <div
                        className={`rounded-2xl border-2 p-8 text-center backdrop-blur-xl transition-all duration-300 ${
                          config.border
                        } ${config.light} hover:scale-105 transform`}
                      >
                        <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                          {medal}
                        </div>
                        <p className="text-gray-400 text-sm font-semibold uppercase mb-3">{label}</p>
                        <h3 className="text-2xl font-bold text-white mb-3">{teamName || 'N/A'}</h3>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                          +{gameResults[0]?.[points] || 0}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">Points Awarded</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-gray-700">
                <p className="text-gray-400 text-lg">⏳ No results yet for this game</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Inter Kee Games 2026 • Live Scoreboard • {liveConnected ? '✓ All systems operational' : '⚠ Connection pending'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLeaderboard;
