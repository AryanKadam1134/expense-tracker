import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { GoogleAuth, Login, User } from "../../types/api.types";

export interface AuthContextType {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  authLoading: boolean;
  googleAuth: (body: GoogleAuth) => void;
  login: (payload: Login) => Promise<boolean | undefined>;
  setUser: Dispatch<SetStateAction<User | null>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
