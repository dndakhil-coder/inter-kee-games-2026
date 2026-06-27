# 🏆 Inter Kee Games 2026 - Live Scoreboard

A **beautiful, real-time sports scoreboard** with live tracking. Admin updates scores → Users see it INSTANTLY!

![Scoreboard Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![Tech](https://img.shields.io/badge/Tech-React%2BNode.js-blue)

---

## ⚡ Quick Features

✅ **Real-time Live Updates** - Scores update instantly across all users  
✅ **Public Leaderboard** - No login needed to view standings  
✅ **Admin Panel** - Secure login to update results  
✅ **Beautiful UI** - Tailwind CSS with smooth animations  
✅ **Mobile Responsive** - Works on all devices  
✅ **Three Teams** - Red Raptors, Blue Marine Whales, Kee Green Fighters  
✅ **14 Games** - Football, Cricket, Basketball, Badminton, etc.  
✅ **Smart Scoring** - Different points for different games  

---

## 🚀 Quick Start (5 minutes)

### 1. Clone & Install

```bash
# Backend
cd scoreboard-backend
npm install

# Frontend
cd ../scoreboard-frontend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb scoreboard_db

# Run schema
psql scoreboard_db < ../scoreboard-backend/database.sql
```

### 3. Setup Environment

```bash
# Backend
cd scoreboard-backend
cp .env.example .env
# Edit .env with your database URL

# Frontend
cd ../scoreboard-frontend
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env.local
```

### 4. Run Everything

```bash
# Terminal 1 - Backend
cd scoreboard-backend
npm run dev

# Terminal 2 - Frontend
cd scoreboard-frontend
npm run dev
```

### 5. Open in Browser

- **Public**: http://localhost:5173
- **Admin**: http://localhost:5173/admin/login (admin/admin)

---

## 🎯 How to Use

### For Regular Users
1. Open the website (no login needed)
2. See live leaderboard with all teams
3. Click on teams to see details
4. Switch tabs to see game results
5. Scores update live as admin makes changes!

### For Admin
1. Go to `/admin/login`
2. Login with `admin`/`admin`
3. Select a game
4. Choose 1st, 2nd, 3rd place teams
5. Click "Update Result"
6. All users see it instantly! 🚀

---

## 📊 Points System

| Games | 1st | 2nd | 3rd |
|-------|-----|-----|-----|
| Football, Cricket, Basketball, Volleyball | 100 | 60 | 40 |
| Badminton, Table Tennis, Bowling | 60 | 40 | 25 |
| Free Throw, Penalty, Rummy, Chess, etc. | 40 | 25 | 15 |

---

## 🌐 Deploy to Production

### Frontend (Vercel - FREE)
```bash
# Push to GitHub
git push origin main

# Go to vercel.com
# Connect your repo
# Deploy! (it's automatic)
```

### Backend (Railway - $5-10/month)
```bash
# Go to railway.app
# Connect your GitHub repo
# Set environment variables
# Deploy!
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps.

---

## 📁 Project Structure

```
scoreboard-frontend/
├── src/pages/
│   ├── PublicLeaderboard.jsx  ← What everyone sees
│   ├── AdminDashboard.jsx     ← Admin updates scores
│   └── Login.jsx              ← Admin login
├── tailwind.config.js
└── package.json

scoreboard-backend/
├── server.js                  ← Express + Socket.io
├── database.sql               ← Schema
└── package.json
```

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Tailwind CSS |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Database | PostgreSQL |
| Auth | JWT |
| Hosting | Vercel + Railway |

---

## 🎨 Customize

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'red-raptor': '#DC143C',
  'blue-whale': '#003DA5',
  'green-fighter': '#22C55E',
}
```

### Add Games
Edit `database.sql` and add to games table.

### Change Admin Password
Update in `server.js` authentication function.

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| Connection refused | Check PostgreSQL is running |
| Socket.io offline | Check backend is running on port 3001 |
| Points not updating | Check admin token, verify JWT_SECRET |
| CORS errors | Check FRONTEND_URL in backend .env |

---

## 📞 Need Help?

1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup
2. Check console errors (F12 in browser)
3. Check backend logs
4. Verify all environment variables are set

---

## 📝 Features Included

- ✅ Public leaderboard (no auth needed)
- ✅ Admin panel with login
- ✅ Real-time score updates (Socket.io)
- ✅ Smooth animations and transitions
- ✅ Beautiful responsive design (Tailwind)
- ✅ Point system with 3 categories
- ✅ 14 pre-loaded games
- ✅ 3 teams with colors and emojis
- ✅ Live connection indicator
- ✅ Recent updates history

---

## 🚀 Ready to Deploy?

1. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Get your domain ready
3. Deploy to Vercel (frontend)
4. Deploy to Railway (backend)
5. Connect custom domain
6. Share the link!

---

## 📜 License

Open source - feel free to use and modify!

---

## 🎊 Enjoy Your Scoreboard!

**Inter Kee Games 2026** 🏆

Let the games begin! ⚡
