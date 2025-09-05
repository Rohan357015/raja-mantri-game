import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { setupSocketHandlers } from './lib/socketHandlers.js';
import { setSocketIO } from './controller/auth.controller.js';
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;

// Setup socket handlers
setupSocketHandlers(io);

// Pass io instance to controller for real-time updates
setSocketIO(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
