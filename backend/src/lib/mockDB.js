// Mock database for testing when MongoDB is not available
let rooms = [];
let users = [];
let roomIdCounter = 1;
let userIdCounter = 1;

export const mockRoom = {
  create: async (roomData) => {
    const room = {
      _id: `room_${roomIdCounter++}`,
      roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...roomData,
      createdAt: new Date()
    };
    rooms.push(room);
    return room;
  },
  
  findOne: async (query) => {
    if (query.roomCode) {
      return rooms.find(room => room.roomCode === query.roomCode);
    }
    return null;
  },
  
  findByIdAndUpdate: async (id, update) => {
    const roomIndex = rooms.findIndex(room => room._id === id);
    if (roomIndex !== -1) {
      rooms[roomIndex] = { ...rooms[roomIndex], ...update };
      return rooms[roomIndex];
    }
    return null;
  }
};

export const mockUser = {
  create: async (userData) => {
    const user = {
      _id: `user_${userIdCounter++}`,
      ...userData,
      createdAt: new Date()
    };
    users.push(user);
    return user;
  },
  
  findById: async (id) => {
    return users.find(user => user._id === id);
  }
};

export const clearMockData = () => {
  rooms = [];
  users = [];
  roomIdCounter = 1;
  userIdCounter = 1;
};
