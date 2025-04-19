import axios from "axios";

// For user service (authentication, user profiles)
export const userApiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api/user",
  withCredentials: true,
});

// For message service (chat functionality)
export const messageApiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api/message",
  withCredentials: true,
});

// Legacy client for backward compatibility
export const axiosInstance = userApiClient;
