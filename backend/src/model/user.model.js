import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomCode: { type: String },
  isInRoom: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
