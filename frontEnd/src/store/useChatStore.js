import { create } from "zustand";
import toast from "react-hot-toast";
import { messageApiClient } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      console.log("Fetching users from:", `${messageApiClient.defaults.baseURL}/users`);
      const res = await messageApiClient.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading users");
      console.error("Error fetching users:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      console.log("Fetching messages from:", `${messageApiClient.defaults.baseURL}/${userId}`);
      const res = await messageApiClient.get(`/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error loading messages");
      console.error("Error fetching messages:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      console.log("Sending message to:", `${messageApiClient.defaults.baseURL}/send/${selectedUser.id}`);
      
      // Handle different message types
      let messageToSend = messageData;
      if (messageData.type === 'audio') {
        messageToSend = {
          type: 'audio',
          content: messageData.audioUrl,
          timestamp: new Date().toISOString()
        };
      } else if (messageData.image) {
        messageToSend = {
          type: 'image',
          content: messageData.image,
          text: messageData.text,
          timestamp: new Date().toISOString()
        };
      } else {
        messageToSend = {
          type: 'text',
          content: messageData.text,
          timestamp: new Date().toISOString()
        };
      }

      const res = await messageApiClient.post(`/send/${selectedUser.id}`, messageToSend);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending message");
      console.error("Error sending message:", error);
      if (error.response) {
        console.log("Error response:", error.response.status, error.response.data);
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not available for message subscription");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.sender_id === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage]
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] });
  }
}));
