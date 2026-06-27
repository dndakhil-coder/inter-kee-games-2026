import React, { useState } from 'react';

function Login({ onLogin, apiUrl }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-raptor opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-whale opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-scale-in">
          <h1 className="text-5xl font-bold text-white mb-2">🎛️</h1>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-raptor via-blue-whale to-green-fighter mb-2">
            Admin Access
          </h2>
          <p className="text-xl text-gray-400">Inter Kee Games 2026</p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-gray-700 backdrop-blur-xl bg-card-bg p-8 shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-blue-whale focus:ring-2 focus:ring-blue-whale/20 transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-blue-whale focus:ring-2 focus:ring-blue-whale/20 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-raptor/20 border border-red-raptor/50 rounded-lg animate-slide-up">
                <p className="text-red-300 text-sm font-semibold">⚠ {error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-whale to-red-raptor hover:from-blue-whale/90 hover:to-red-raptor/90 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> Signing in...
                </>
              ) : (
                <>
                  🔐 Admin Login
                </>
              )}
            </button>
          </form>

          {/* Demo Note */}
          <div className="mt-8 p-4 bg-slate-700/50 border border-gray-600 rounded-lg">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-3">Demo Admin Credentials:</p>
            <div className="space-y-2 text-sm font-mono">
              <p className="text-gray-300">
                <span className="text-blue-whale">Username:</span>
                <span className="text-gray-400 ml-2">admin</span>
              </p>
              <p className="text-gray-300">
                <span className="text-green-fighter">Password:</span>
                <span className="text-gray-400 ml-2">admin</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Secure Admin Panel • Inter Kee Games 2026
        </p>
      </div>
    </div>
  );
}

export default Login;
