import axios from "axios";

// API Gateway URL
const API_GATEWAY_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

// For user service (authentication, user profiles)
export const userApiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${API_GATEWAY_URL}/api/users` : "/api/users",
  withCredentials: true,
});

// For authentication endpoints
export const authApiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${API_GATEWAY_URL}/api/auth` : "/api/auth",
  withCredentials: true,
});

// For message service (chat functionality)
export const messageApiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${API_GATEWAY_URL}/api/messages` : "/api/messages",
  withCredentials: true,
});

// Legacy client for backward compatibility
export const axiosInstance = userApiClient;
