import { axiosInstance } from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  roomCode: null,
  room: null,
  round: null, // <-- Add this line

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/create-room", roomData);
      
      set({
        user: response.data.room.players[0],
        roomCode: response.data.room.roomCode,
        room: response.data.room,
        round: response.data.room.round, // <-- Add this line
        loading: false
      });
      
      toast.success("Room created successfully!");
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create room";
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  joinRoom: async (roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/join-room", roomData);
      
      set({
        user: response.data.room.players.find(p => p.name === roomData.name),
        roomCode: response.data.room.roomCode,
        room: response.data.room,
        loading: false
      });
      
      toast.success("Successfully joined room!");
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to join room";
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  getRoom: async (roomCode) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/room/${roomCode}`);
      
      set({
        room: response.data.room,
        roomCode: response.data.room.roomCode,
        round: response.data.room.round, // <-- Add this line
        loading: false
      });
      
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to get room details";
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  startGame: async (roomCode, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/start-game", { roomCode, userId });
      
      set({
        room: response.data.room,
        loading: false
      });
      
      toast.success("Game started!");
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to start game";
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  updateScores: async (roomCode, scores) => {
  try {
    const response = await axiosInstance.post(`/room/${roomCode}/update-scores`, { scores });
    // Optionally update local state with response
    set({ room: response.data.room });
    return response.data.room;
  } catch (error) {
    toast.error("Failed to update scores");
    throw error;
  }
},

  clearError: () => set({ error: null }),
  clearRoom: () => set({ room: null, roomCode: null, user: null })
}));
