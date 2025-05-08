import { create } from "zustand";
import { userApiClient, authApiClient } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// API Gateway URL for WebSocket connection
const API_GATEWAY_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      console.log("Checking auth with:", `${authApiClient.defaults.baseURL}/check`);
      const res = await authApiClient.get("/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
      } else if (error.request) {
        console.log("Error request:", error.request);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("Signing up with:", `${authApiClient.defaults.baseURL}/signup`);
      const res = await authApiClient.post("/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
      }
      toast.error(error?.response?.data?.message || "Error during signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Logging in with:", `${authApiClient.defaults.baseURL}/login`);
      const res = await authApiClient.post("/login", data);
      
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        get().connectSocket();
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
        toast.error(error.response.data.message || "Error during login");
      } else if (error.request) {
        console.log("Error request:", error.request);
        toast.error("Network error during login");
      } else {
        toast.error("Error during login");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await authApiClient.post("/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Error during logout");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await userApiClient.post("/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    try {
      const socket = io(import.meta.env.MODE === "development" ? "http://localhost:5002" : "/socket", {
      
        query: {
          userId: authUser.id,
        },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        path: '/socket.io/',
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });
      
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("userOnline", (userId) => {
        set((state) => ({
          onlineUsers: [...state.onlineUsers, userId]
        }));
      });

      socket.on("userOffline", (userId) => {
        set((state) => ({
          onlineUsers: state.onlineUsers.filter(id => id !== userId)
        }));
      });

      socket.on("getOnlineUsers", (users) => {
        set({ onlineUsers: users });
      });

      socket.connect();
      set({ socket });
    } catch (error) {
      console.error("Error connecting socket:", error);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }
}));
