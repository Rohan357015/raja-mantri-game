import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomCode: { 
    type: String, 
    unique: true, 
    required: true,
    uppercase: true
  },
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hostName: {
    type: String,
    required: true
  },
  round: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  players: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    isHost: { type: Boolean, default: false }
  }],
  maxPlayers: {
    type: Number,
    default: 4
  },
  status: { 
    type: String, 
    enum: ['waiting', 'playing', 'finished'], 
    default: 'waiting' 
  },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date }
});

// Generate unique room code before saving
roomSchema.pre('save', function(next) {
  if (this.isNew && !this.roomCode) {
    // Generate a simple room code without database check for now
    this.roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.model('Room', roomSchema);

