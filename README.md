# Raja Mantri Chor Sipahi Game

An online multiplayer implementation of the traditional Indian game "Raja, Mantri, Chor, Sipahi" built with React, Node.js, Socket.IO, and MongoDB.

## Game Rules

- Each round, four players are randomly assigned roles: Raja, Mantri, Chor, Sipahi
- Point system: Raja (1000), Police/Sipahi (500), Mantri (800 if not guessed correctly), Chor (0 if caught, 800 if escaping)
- Roles are hidden except Sipahi, who reveals themselves and must guess the Chor among the remaining three
- After each guess, points are distributed and the next round begins
- Game continues for several rounds until a set score or time limit is reached

## Tech Stack

- **Frontend:** React, Zustand, Socket.IO, Axios
- **Backend:** Node.js, Express, Socket.IO, MongoDB
- **Database:** MongoDB Atlas

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB Atlas connection string

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
raja-mantri-game/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── package.json       # Root package.json
└── README.md         # This file
```

## Features

- Real-time multiplayer gameplay
- User authentication
- Game room management
- Role assignment and guessing
- Score tracking and leaderboards
- In-game chat
- Responsive design

## Deployment

- Frontend: Deploy to Vercel or Netlify
- Backend: Deploy to Railway, Render, or similar platform
- Database: MongoDB Atlas

