import Room from '../model/room.model.js';
import User from '../model/user.model.js';

// Store active rooms and their socket connections
const activeRooms = new Map();

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room socket event
    socket.on('join-room', async (data) => {
      const { roomCode, playerName } = data;
      
      try {
        // Find the room
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if room is full
        if (room.players.length >= room.maxPlayers) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }

        // Check if room is still waiting for players
        if (room.status !== 'waiting') {
          socket.emit('error', { message: 'Room is not accepting new players' });
          return;
        }

        // Check if name is already taken in this room
        const nameExists = room.players.some(player => 
          player.name.toLowerCase() === playerName.toLowerCase()
        );
        if (nameExists) {
          socket.emit('error', { message: 'Name already taken in this room' });
          return;
        }

        // Join socket room
        socket.join(roomCode.toUpperCase());
        
        // Store socket info
        if (!activeRooms.has(roomCode.toUpperCase())) {
          activeRooms.set(roomCode.toUpperCase(), new Map());
        }
        activeRooms.get(roomCode.toUpperCase()).set(socket.id, {
          playerName,
          socketId: socket.id
        });

        // Create user for the joining player
        const newUser = new User({
          name: playerName,
          roomCode: roomCode,
          isInRoom: true
        });
        await newUser.save();

        // Add player to room
        room.players.push({
          user: newUser._id,
          name: playerName,
          isHost: false
        });

        await room.save();

        // Emit updated room data to all players in the room
        io.to(roomCode.toUpperCase()).emit('room-updated', {
          roomCode: room.roomCode,
          hostName: room.hostName,
          round: room.round,
          players: room.players,
          maxPlayers: room.maxPlayers,
          status: room.status,
          createdAt: room.createdAt
        });

        // Send success message to the joining player
        socket.emit('joined-room', {
          message: 'Successfully joined room',
          roomCode: room.roomCode,
          playerName: playerName
        });

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    // Create room socket event
    socket.on('create-room', async (data) => {
      const { name, round } = data;
      
      try {
        // Validate input
        if (!name || !round) {
          socket.emit('error', { message: 'Name and round are required' });
          return;
        }

        if (round < 1 || round > 10) {
          socket.emit('error', { message: 'Round must be between 1 and 10' });
          return;
        }

        // Create user for the host
        const hostUser = new User({
          name: name,
          isInRoom: true
        });
        await hostUser.save();

        // Create room
        const room = new Room({
          host: hostUser._id,
          hostName: name,
          round: round,
          players: [{
            user: hostUser._id,
            name: name,
            isHost: true
          }]
        });

        await room.save();

        // Update user with room code
        hostUser.roomCode = room.roomCode;
        await hostUser.save();

        // Join socket room
        socket.join(room.roomCode);
        
        // Store socket info
        activeRooms.set(room.roomCode, new Map());
        activeRooms.get(room.roomCode).set(socket.id, {
          playerName: name,
          socketId: socket.id,
          isHost: true
        });

        // Send room data to the host
        socket.emit('room-created', {
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
        socket.emit('error', { message: 'Error creating room' });
      }
    });

    // Start game socket event
    socket.on('start-game', async (data) => {
      const { roomCode } = data;
      
      try {
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is the host
        const isHost = room.players.some(player => 
          player.user.toString() === data.userId && player.isHost
        );

        if (!isHost) {
          socket.emit('error', { message: 'Only the host can start the game' });
          return;
        }

        // Check if room has minimum players (at least 2)
        if (room.players.length < 2) {
          socket.emit('error', { message: 'Need at least 2 players to start the game' });
          return;
        }

        // Update room status
        room.status = 'playing';
        room.startedAt = new Date();
        await room.save();

        // Emit game started to all players in the room
        io.to(roomCode.toUpperCase()).emit('game-started', {
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
        socket.emit('error', { message: 'Error starting game' });
      }
    });

    // Get room details socket event
    socket.on('get-room', async (data) => {
      const { roomCode } = data;
      
      try {
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() })
          .populate('players.user', 'name');

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        socket.emit('room-details', {
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
        socket.emit('error', { message: 'Error getting room details' });
      }
    });

    // Leave room socket event
    socket.on('leave-room', async (data) => {
      const { roomCode, playerName } = data;
      
      try {
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
        if (room) {
          // Remove player from room
          room.players = room.players.filter(player => player.name !== playerName);
          await room.save();

          // Remove from active rooms
          if (activeRooms.has(roomCode.toUpperCase())) {
            activeRooms.get(roomCode.toUpperCase()).delete(socket.id);
            if (activeRooms.get(roomCode.toUpperCase()).size === 0) {
              activeRooms.delete(roomCode.toUpperCase());
            }
          }

          // Leave socket room
          socket.leave(roomCode.toUpperCase());

          // Emit updated room data to remaining players
          io.to(roomCode.toUpperCase()).emit('room-updated', {
            roomCode: room.roomCode,
            hostName: room.hostName,
            round: room.round,
            players: room.players,
            maxPlayers: room.maxPlayers,
            status: room.status,
            createdAt: room.createdAt
          });

          socket.emit('left-room', { message: 'Successfully left room' });
        }
      } catch (error) {
        console.error('Error leaving room:', error);
        socket.emit('error', { message: 'Error leaving room' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      // Find and remove user from any active rooms
      for (const [roomCode, players] of activeRooms.entries()) {
        if (players.has(socket.id)) {
          const playerInfo = players.get(socket.id);
          players.delete(socket.id);
          
          if (players.size === 0) {
            activeRooms.delete(roomCode);
          } else {
            // Update room in database
            try {
              const room = await Room.findOne({ roomCode });
              if (room) {
                room.players = room.players.filter(player => player.name !== playerInfo.playerName);
                await room.save();

                // Emit updated room data to remaining players
                io.to(roomCode).emit('room-updated', {
                  roomCode: room.roomCode,
                  hostName: room.hostName,
                  round: room.round,
                  players: room.players,
                  maxPlayers: room.maxPlayers,
                  status: room.status,
                  createdAt: room.createdAt
                });
              }
            } catch (error) {
              console.error('Error updating room on disconnect:', error);
            }
          }
          break;
        }
      }
    });
  });
};
