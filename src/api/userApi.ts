import apiClient from "../config/axiosClient";
import type { UpdateUserData } from "../interfaces/User";

export const fetchUsersApi = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserByIdApi = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const updateUserApi = async ({
  userId,
  data,
}: {
  userId: string;
  data: UpdateUserData;
}) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const blockUserApi = async (userId: string) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, {
      status: "block",
    }); 
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

export const deleteUserApi = async (userId: string) => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
    return userId;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
