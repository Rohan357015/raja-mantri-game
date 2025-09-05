import { mockRoom, mockUser } from '../lib/mockDB.js';

// Store io instance for real-time updates
let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

// Create a new room with host name and round selection
export const createRoom = async (req, res) => {
  const { name, round } = req.body;

  try {
    // Validate input
    if (!name || !round) {
      return res.status(400).json({ message: 'Name and round are required' });
    }

    if (round < 1 || round > 10) {
      return res.status(400).json({ message: 'Round must be between 1 and 10' });
    }

    // Create user for the host
    const hostUser = await mockUser.create({
      name: name,
      isInRoom: true
    });

    // Create room
    const room = await mockRoom.create({
      host: hostUser._id,
      hostName: name,
      round: round,
      players: [{
        user: hostUser._id,
        name: name,
        isHost: true
      }],
      maxPlayers: 4,
      status: 'waiting'
    });

    // Update user with room code
    hostUser.roomCode = room.roomCode;
    hostUser.isInRoom = true;

    // Emit real-time update if socket is available
    if (ioInstance) {
      ioInstance.emit('room-created', {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status
      });
    }

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status
      }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ 
      message: 'Error creating room',
      error: error.message
    });
  }
};

// Join an existing room with room code
export const joinRoom = async (req, res) => {
  const { roomCode, name } = req.body;

  try {
    // Validate input
    if (!roomCode || !name) {
      return res.status(400).json({ message: 'Room code and name are required' });
    }

    // Find room by room code
    const room = await mockRoom.findOne({ roomCode: roomCode.toUpperCase() });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Check if room is still waiting for players
    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Room is not accepting new players' });
    }

    // Check if name is already taken in this room
    const nameExists = room.players.some(player => player.name.toLowerCase() === name.toLowerCase());
    if (nameExists) {
      return res.status(400).json({ message: 'Name already taken in this room' });
    }

    // Create user for the joining player
    const newUser = await mockUser.create({
      name: name,
      roomCode: roomCode,
      isInRoom: true
    });

    // Add player to room
    room.players.push({
      user: newUser._id,
      name: name,
      isHost: false
    });

    // Emit real-time update to all players in the room
    if (ioInstance) {
      ioInstance.to(roomCode.toUpperCase()).emit('room-updated', {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status,
        createdAt: room.createdAt
      });
    }

    res.status(200).json({
      message: 'Successfully joined room',
      room: {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status
      }
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Error joining room' });
  }
};

// Get room details
export const getRoom = async (req, res) => {
  const { roomCode } = req.params;

  try {
    const room = await mockRoom.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({
      room: {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status,
        createdAt: room.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({ message: 'Error getting room details' });
  }
};

// Start the game (only host can start)
export const startGame = async (req, res) => {
  const { roomCode, userId } = req.body;

  try {
    const room = await mockRoom.findOne({ roomCode: roomCode.toUpperCase() });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is the host
    const isHost = room.players.some(player => 
      player.user.toString() === userId && player.isHost
    );

    if (!isHost) {
      return res.status(403).json({ message: 'Only the host can start the game' });
    }

    // Check if room has minimum players (at least 2)
    if (room.players.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 players to start the game' });
    }

    // Update room status
    room.status = 'playing';
    room.startedAt = new Date();

    // Emit real-time update to all players in the room
    if (ioInstance) {
      ioInstance.to(roomCode.toUpperCase()).emit('game-started', {
        message: 'Game started successfully',
        room: {
          roomCode: room.roomCode,
          hostName: room.hostName,
          round: room.round,
          players: room.players,
          maxPlayers: room.maxPlayers,
          status: room.status,
          startedAt: room.startedAt
        }
      });
    }

    res.status(200).json({
      message: 'Game started successfully',
      room: {
        roomCode: room.roomCode,
        hostName: room.hostName,
        round: room.round,
        players: room.players,
        maxPlayers: room.maxPlayers,
        status: room.status,
        startedAt: room.startedAt
      }
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ message: 'Error starting game' });
  }
};
