import React, { useState, useEffect } from 'react';

function AdminDashboard({ onLogout, apiUrl }) {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [results, setResults] = useState({ first: '', second: '', third: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState([]);

  const teamConfig = {
    'RED': { emoji: '🦖', name: 'Red Raptors', color: 'red-raptor' },
    'BLUE': { emoji: '🐋', name: 'Blue Marine Whales', color: 'blue-whale' },
    'GREEN': { emoji: '🥋', name: 'Kee Green Fighters', color: 'green-fighter' },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, teamsRes] = await Promise.all([
        fetch(`${apiUrl}/games`),
        fetch(`${apiUrl}/teams`)
      ]);

      if (gamesRes.ok && teamsRes.ok) {
        setGames(await gamesRes.json());
        setTeams(await teamsRes.json());
      }
    } catch (err) {
      showMessage('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedGame || !results.first || !results.second || !results.third) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          gameId: selectedGame,
          firstPlaceTeam: results.first,
          secondPlaceTeam: results.second,
          thirdPlaceTeam: results.third,
        })
      });

      if (response.ok) {
        showMessage('✓ Result updated successfully!', 'success');
        
        const game = games.find(g => g.id === parseInt(selectedGame));
        const timestamp = new Date().toLocaleTimeString();
        setRecentUpdates([
          { time: timestamp, game: game?.name, status: 'Updated' },
          ...recentUpdates.slice(0, 4)
        ]);

        setSelectedGame('');
        setResults({ first: '', second: '', third: '' });
      } else {
        showMessage('Error updating result', 'error');
      }
    } catch (err) {
      showMessage('Failed to update result', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getTeamEmoji = (teamId) => {
    const team = teams.find(t => t.id === parseInt(teamId));
    const key = Object.keys(teamConfig).find(k => teamConfig[k].name === team?.name);
    return teamConfig[key]?.emoji || '⚽';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === parseInt(teamId));
    return team?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚙️</div>
          <p className="text-gray-400">Loading admin panel...</p>
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
              <div className="text-4xl">🎛️</div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-raptor via-blue-whale to-green-fighter">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm">Inter Kee Games 2026</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-red-raptor hover:bg-red-raptor/80 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-700 backdrop-blur-xl bg-card-bg p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📝</span> Update Game Results
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Game Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Select Game
                  </label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-whale focus:ring-2 focus:ring-blue-whale/20 transition"
                  >
                    <option value="">-- Choose a game --</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.name} ({game.pointsCategory})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Positions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { pos: 'first', label: '🥇 1st Place', key: 'first' },
                    { pos: 'second', label: '🥈 2nd Place', key: 'second' },
                    { pos: 'third', label: '🥉 3rd Place', key: 'third' },
                  ].map(({ pos, label, key }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        {label}
                      </label>
                      <select
                        value={results[key]}
                        onChange={(e) => setResults({ ...results, [key]: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-green-fighter focus:ring-2 focus:ring-green-fighter/20 transition"
                      >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {getTeamEmoji(team.id)} {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-whale to-green-fighter hover:from-blue-whale/90 hover:to-green-fighter/90 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? '⏳ Updating...' : '✓ Update Result'}
                </button>
              </form>

              {/* Message Display */}
              {message.text && (
                <div className={`mt-6 p-4 rounded-lg animate-slide-up ${
                  message.type === 'success'
                    ? 'bg-green-fighter/20 border border-green-fighter/50 text-green-300'
                    : 'bg-red-raptor/20 border border-red-raptor/50 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Point System */}
            <div className="rounded-2xl border border-gray-700 backdrop-blur-xl bg-card-bg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Point System
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-gray-400 font-semibold">Major Games</p>
                  <p className="text-yellow-400">100 - 60 - 40</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-gray-400 font-semibold">Minor Games</p>
                  <p className="text-yellow-400">60 - 40 - 25</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-gray-400 font-semibold">Special Events</p>
                  <p className="text-yellow-400">40 - 25 - 15</p>
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="rounded-2xl border border-gray-700 backdrop-blur-xl bg-card-bg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span> Recent Updates
              </h3>
              <div className="space-y-2">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((update, index) => (
                    <div key={index} className="p-3 bg-slate-700/50 rounded-lg text-sm animate-slide-up">
                      <p className="text-gray-400">{update.game}</p>
                      <p className="text-green-400 font-semibold">{update.status}</p>
                      <p className="text-gray-500 text-xs">{update.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No updates yet</p>
                )}
              </div>
            </div>

            {/* Teams Info */}
            <div className="rounded-2xl border border-gray-700 backdrop-blur-xl bg-card-bg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span> Teams
              </h3>
              <div className="space-y-2">
                {teams.map(team => {
                  const key = Object.keys(teamConfig).find(k => teamConfig[k].name === team.name);
                  const config = teamConfig[key] || { emoji: '⚽', name: team.name };
                  return (
                    <div key={team.id} className="p-2 bg-slate-700/50 rounded-lg flex items-center gap-2">
                      <span className="text-xl">{config.emoji}</span>
                      <span className="text-gray-300 font-semibold">{team.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
