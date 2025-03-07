import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, registerApi } from "../../api/authApi";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Login failed. Please tr y again.");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await logoutApi();
});
