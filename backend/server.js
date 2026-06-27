const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/scoreboard'
});

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES ============

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Demo users - replace with actual database check
    const validUsers = {
      'admin': { password: 'admin', role: 'admin', id: 1 },
      'user': { password: 'user', role: 'user', id: 2 }
    };

    const user = validUsers[username];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ GAMES ROUTES ============

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// ============ TEAMS ROUTES ============

app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// ============ LEADERBOARD ROUTES ============

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, COALESCE(SUM(rp.points), 0) as totalPoints
      FROM teams t
      LEFT JOIN result_points rp ON t.id = rp.team_id
      GROUP BY t.id, t.name
      ORDER BY totalPoints DESC
    `);
    res.json(result.rows);
    
    // Broadcast to all connected clients
    io.emit('leaderboard-updated', result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ============ RESULTS ROUTES ============

app.post('/api/results', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update results' });
  }

  const { gameId, firstPlaceTeam, secondPlaceTeam, thirdPlaceTeam } = req.body;

  try {
    // Get game details to know points category
    const gameResult = await pool.query(
      'SELECT points_category FROM games WHERE id = $1',
      [gameId]
    );

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const pointsCategory = gameResult.rows[0].points_category;
    
    // Get points for this category
    const pointsResult = await pool.query(
      'SELECT first_place, second_place, third_place FROM point_system WHERE category = $1',
      [pointsCategory]
    );

    if (pointsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Point system not found' });
    }

    const { first_place, second_place, third_place } = pointsResult.rows[0];

    // Clear previous results for this game
    await pool.query('DELETE FROM game_results WHERE game_id = $1', [gameId]);

    // Insert new results
    const insertResult = await pool.query(`
      INSERT INTO game_results (game_id, first_place_team, second_place_team, third_place_team)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [gameId, firstPlaceTeam, secondPlaceTeam, thirdPlaceTeam]);

    // Insert points for each team
    await pool.query(
      'DELETE FROM result_points WHERE game_id = $1',
      [gameId]
    );

    await pool.query(`
      INSERT INTO result_points (game_id, team_id, points)
      VALUES ($1, $2, $3), ($1, $4, $5), ($1, $6, $7)
    `, [gameId, firstPlaceTeam, first_place, secondPlaceTeam, second_place, thirdPlaceTeam, third_place]);

    // Fetch updated leaderboard
    const leaderboardResult = await pool.query(`
      SELECT t.id, t.name, COALESCE(SUM(rp.points), 0) as totalPoints
      FROM teams t
      LEFT JOIN result_points rp ON t.id = rp.team_id
      GROUP BY t.id, t.name
      ORDER BY totalPoints DESC
    `);

    // Broadcast LIVE UPDATE to all connected clients
    io.emit('result-updated', {
      gameId,
      result: insertResult.rows[0],
      leaderboard: leaderboardResult.rows
    });

    res.json({ success: true, data: insertResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update result' });
  }
});

app.get('/api/results/:gameId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM game_results WHERE game_id = $1',
      [req.params.gameId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// ============ WEBSOCKET EVENTS ============

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current leaderboard on connect
  pool.query(`
    SELECT t.id, t.name, COALESCE(SUM(rp.points), 0) as totalPoints
    FROM teams t
    LEFT JOIN result_points rp ON t.id = rp.team_id
    GROUP BY t.id, t.name
    ORDER BY totalPoints DESC
  `).then(result => {
    socket.emit('leaderboard-updated', result.rows);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket ready for live updates`);
});
