# Inter Kee Games 2026 - Live Scoreboard Deployment Guide

## 🎯 Project Overview
- **Frontend**: React + Tailwind CSS on Vercel (FREE)
- **Backend**: Node.js/Express API
- **Database**: PostgreSQL
- **Real-time**: Socket.io for live updates
- **Total Cost**: FREE (Vercel) + ~$5-10/month (Railway/Render for backend)

---

## 🚀 Local Development Setup

### 1. Prerequisites
```bash
# Install Node.js (v18+)
# https://nodejs.org/

# Install PostgreSQL
# https://www.postgresql.org/download/
```

### 2. Backend Setup

```bash
cd scoreboard-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database details
# DATABASE_URL=postgresql://user:password@localhost:5432/scoreboard_db
```

### 3. Database Setup

```bash
# Create database
createdb scoreboard_db

# Run schema
psql scoreboard_db < database.sql

# Verify tables created
psql scoreboard_db
\dt  # List tables
\q   # Exit
```

### 4. Start Backend

```bash
# Development
npm run dev

# Production
npm start

# Should output:
# Server running on port 3001
# WebSocket ready for live updates
```

### 5. Frontend Setup

```bash
cd scoreboard-frontend

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env.local

# Start development
npm run dev

# Should open at http://localhost:5173
```

---

## 📋 Project Structure

```
scoreboard-frontend/
├── src/
│   ├── pages/
│   │   ├── PublicLeaderboard.jsx  (No login needed)
│   │   ├── AdminDashboard.jsx     (Admin only)
│   │   └── Login.jsx              (Admin login)
│   ├── App.jsx                    (Routing)
│   └── index.css                  (Tailwind)
├── package.json
├── tailwind.config.js
└── vercel.json

scoreboard-backend/
├── server.js                      (Express + Socket.io)
├── database.sql                   (Schema)
├── package.json
└── .env.example
```

---

## 🌐 Deployment to Vercel + Railway

### Step 1: Deploy Backend to Railway.app

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select this repository
5. Set environment variables:
   ```
   DATABASE_URL = your_postgresql_connection_string
   PORT = 3001
   FRONTEND_URL = https://yourdomain.com
   JWT_SECRET = your-secret-key-change-this
   ```
6. Deploy!
7. Get your backend URL: `https://api.railway.app` (example)

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Login with GitHub
3. Click "New Project"
4. Select the repository
5. Set environment variables:
   ```
   REACT_APP_API_URL = https://api.railway.app/api
   ```
6. Deploy!
7. Get your frontend URL: `https://yourdomain.vercel.app`

### Step 3: Connect Your Domain

**If you already own a domain:**

1. Update DNS records to point to Vercel:
   - Add CNAME or A record in your domain registrar
   - Point to Vercel's servers

2. In Vercel dashboard:
   - Project Settings → Domains
   - Add your domain
   - Verify DNS

---

## 🔧 Admin Access

**Demo Credentials:**
- Username: `admin`
- Password: `admin`

**Access:**
- Admin Login: `https://yourdomain.com/admin/login`
- Admin Dashboard: `https://yourdomain.com/admin/dashboard`
- Public Leaderboard: `https://yourdomain.com/` (no login needed)

---

## 📊 How It Works

### Public Users (No Login)
1. Visit `https://yourdomain.com`
2. See live leaderboard with real-time updates
3. Click team cards to see details
4. Switch between "Overall Standings" and "Game Results" tabs
5. Auto-updates when admin makes changes (via Socket.io)

### Admin Panel
1. Login at `https://yourdomain.com/admin/login`
2. Select a game from dropdown
3. Choose 1st, 2nd, 3rd place teams
4. Click "Update Result"
5. All users see instant updates (live!)

---

## ⚡ Real-time Live Tracking

**How it works:**

1. Admin fills form and clicks "Update Result"
2. Backend receives data and:
   - Calculates points based on game category
   - Stores in database
   - Broadcasts via Socket.io to all connected users
3. Frontend receives broadcast instantly:
   - Leaderboard updates smoothly
   - Yellow highlight animation on changed teams
   - Game results tab shows new results

**No page refresh needed!** ✨

---

## 📱 Features

### Public Leaderboard
- ✅ Real-time live updates (Socket.io)
- ✅ Podium view (1st, 2nd, 3rd place)
- ✅ Full leaderboard table
- ✅ Individual game results
- ✅ Team details on click
- ✅ Live indicator (connected/offline)
- ✅ Beautiful Tailwind UI
- ✅ Smooth animations and transitions
- ✅ Mobile responsive

### Admin Dashboard
- ✅ Form to update game results
- ✅ Point system reference
- ✅ Recent updates history
- ✅ Team list
- ✅ Success/error messages
- ✅ Logout button
- ✅ Beautiful admin UI

---

## 🎨 Customization

### Change Team Names/Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'red-raptor': '#DC143C',      // Red Raptors
  'blue-whale': '#003DA5',      // Blue Marine Whales
  'green-fighter': '#22C55E',   // Kee Green Fighters
}
```

### Add More Games

1. Update `database.sql` with new games
2. Run migrations
3. Games auto-appear in dropdown

### Modify Points System

Edit `database.sql` - modify `point_system` table:
```sql
INSERT INTO point_system (category, first_place, second_place, third_place)
VALUES ('new_category', 100, 60, 40);
```

---

## 🐛 Troubleshooting

### "Connection refused" error
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check port 3001 is not blocked

### "Socket.io connection timeout"
- Backend might not be running
- Check FRONTEND_URL in backend .env
- Check CORS settings in server.js

### Points not updating
- Check admin auth token
- Verify JWT_SECRET matches frontend
- Check database connection

### Real-time not working
- Check Socket.io is connected (green dot in header)
- Check browser console for errors
- Verify backend is serving Socket.io

---

## 📚 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Socket.io Client
- React Router

**Backend:**
- Express.js
- Socket.io
- PostgreSQL
- JWT Auth
- Node.js

---

## 🔐 Security Notes

**Change in Production:**
1. `JWT_SECRET` - Use strong random key
2. `Admin credentials` - Create real users
3. `CORS origin` - Only allow your domain
4. `Database URL` - Use strong password

---

## 📞 Support

For issues:
1. Check console errors (F12)
2. Check server logs
3. Verify environment variables
4. Check database connection

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Domain configured
- [ ] Environment variables set
- [ ] Database created and migrated
- [ ] Admin can login
- [ ] Public leaderboard works
- [ ] Real-time updates working
- [ ] Custom domain HTTPS enabled

---

## 🎊 You're All Set!

Your Inter Kee Games 2026 Live Scoreboard is ready! 🏆

**Access Points:**
- Public: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin/login`
- Backend: `https://api.railway.app`

Enjoy! 🎉
