import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { User } from "../../types/types";

export interface AuthContextType {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  authLoading: boolean;
  googleAuth: (
    credentialResponse: { credential: string },
    rememberMe: boolean,
  ) => void;
  login: (payload: {
    userCredential: string;
    password: string;
  }) => Promise<boolean | undefined>;
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
