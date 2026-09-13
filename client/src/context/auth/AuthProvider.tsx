import { useEffect, useState, type ReactNode } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";
import type { Login, User } from "../../types/types";

import { AuthContext } from "./useAuth";
import { useNotify } from "../notification";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotify();

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [deviceId] = useState(() => {
    let storedDeviceId = localStorage.getItem("deviceId");

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }

    return storedDeviceId;
  });

  const googleAuth = async (
    credentialResponse: { credential: string },
    rememberMe: boolean,
  ) => {
    try {
      const res = await authEndpoints.googleAuth(
        { credential: credentialResponse.credential, rememberMe },
        {
          headers: {
            "x-device-id": deviceId,
          },
        },
      );

      const apiResponse = res.data;
      const data = apiResponse.data;

      if (apiResponse.success) {
        setUser(data?.user);
      }

      console.log("Login with Google succesfull:", data);
    } catch (error) {
      console.error("Error Login with Google: ", error);
    }
  };

  const login = async (payload: Login) => {
    try {
      const res = await authEndpoints.login(payload);
      const apiResponse = res.data;
      const data = apiResponse.data;
      const success = apiResponse.success;

      if (success) {
        setUser(data?.user);
      }

      setError(null);
      return success;

      // console.log("Login succesfull:", data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed!";
      console.error("Error while login: ", error);
      notify.msgError(errorMessage);
      setError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authEndpoints.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await authEndpoints.refreshSession();

        const apiResponse = res.data;
        const data = apiResponse.data;

        if (apiResponse.success) {
          setUser(data?.user);
        }

        console.log("Session restored: ", data);
      } catch (error) {
        console.error("Error restoring session: ", error);
      } finally {
        setAuthLoading(false);
      }
    };

    refreshSession();
  }, [deviceId]);

  const value = {
    error,
    setError,
    user,
    authLoading,
    googleAuth,
    login,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
