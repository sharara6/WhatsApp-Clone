import { create } from "zustand";
import { userApiClient } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Base URLs for the services
const USER_SERVICE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/user";
const MESSAGE_SERVICE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/message";

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
      const res = await userApiClient.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await userApiClient.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Error during signup");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await userApiClient.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Error during login");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await userApiClient.post("/auth/logout");
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
      const res = await userApiClient.post("/auth/update-profile", data);
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
      // Connect to the message service socket
      const socket = io(MESSAGE_SERVICE_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
      });
      
      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });
      
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } catch (error) {
      console.error("Error connecting to socket:", error);
    }
  },
  
  disconnectSocket: () => {
    if (get().socket?.connected) {
      try {
        get().socket.disconnect();
      } catch (error) {
        console.error("Error disconnecting socket:", error);
      }
    }
  },
}));
