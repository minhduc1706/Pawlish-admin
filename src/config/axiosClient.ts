import axios from "axios";
import { setAccessToken, logout, setUser } from "../redux/auth/authSlice";
import { AppStore } from "../store";
import { logoutThunk } from "@/redux/auth/authThunk";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

export let storeRef: AppStore | null = null;

export const setStore = (store: AppStore) => {
  storeRef = store;
};

apiClient.interceptors.request.use((config) => {
  if (storeRef) {
    const token = storeRef.getState().auth.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token?: string, error?: Error) => void)[] = [];

const onRefreshed = (token?: string, error?: Error) => {
  refreshSubscribers.forEach((callback) => callback(token, error));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.error?.message?.toLowerCase().includes("token expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            "http://localhost:4000/api/v1/auth/refresh-token",
            {},
            { withCredentials: true }
          );
          const newAccessToken = res.data.accessToken;

          if (storeRef) {
            storeRef.dispatch(setAccessToken(newAccessToken));
            const user = res.data.user;
            if (user) {
              storeRef.dispatch(setUser(user));
            }
          }

          onRefreshed(newAccessToken);
          isRefreshing = false;

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          const errorInstance =
            refreshError instanceof Error
              ? refreshError
              : new Error("Unexpected error occurred");

          onRefreshed(undefined, errorInstance);

          if (storeRef) {
            storeRef.dispatch(logout());
            storeRef.dispatch(logoutThunk());
          }
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token, error) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    return Promise.reject(error);
  }
);


export default apiClient;
