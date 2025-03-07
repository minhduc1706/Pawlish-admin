import { User } from "../../interfaces/User";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
}
