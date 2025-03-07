import axios from "axios";
import apiClient from "../config/axiosClient";
import type { LoginResponse } from "../interfaces/User";

export const loginApi = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Network error. Please try again.");
  }
};

export const registerApi = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Network error. Please try again.");
  }
};

export const logoutApi = async () => {
  return await apiClient.post("/auth/logout", {}, { withCredentials: true });
};
