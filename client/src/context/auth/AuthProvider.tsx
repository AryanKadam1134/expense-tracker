import { useEffect, useState, type ReactNode } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";

import { AuthContext } from "./useAuth";
import { useNotify } from "../notification";

import useApi from "../../hooks/useApi";

import type { Login, User } from "../../types/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotify();
  const { loading, callApi } = useApi({
    googleAuth: false,
    login: false,
    logout: false,
    refreshSession: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const authLoading = loading.refreshSession;

  const [deviceId] = useState(() => {
    let storedDeviceId = localStorage.getItem("deviceId");

    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem("deviceId", storedDeviceId);
    }

    return storedDeviceId;
  });

  const googleAuth = (
    credentialResponse: { credential: string },
    rememberMe: boolean,
  ) => {
    callApi(
      "googleAuth",
      () =>
        authEndpoints.googleAuth(
          { credential: credentialResponse.credential, rememberMe },
          {
            headers: {
              "x-device-id": deviceId,
            },
          },
        ),
      {
        onSuccess: (res) => {
          setUser(res.data);
        },
        onError: (error) => console.error("Error Login with Google: ", error),
      },
    );
  };

  const login = async (payload: Login) => {
    const data = await callApi("login", () => authEndpoints.login(payload), {
      onSuccess: (res) => {
        setUser(res.data);
        setError(null);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed!";
        console.error("Error while login: ", error);
        notify.msgError(errorMessage);
        setError(errorMessage);
      },
    });

    return data?.success;
  };

  const logout = () => {
    callApi("logout", () => authEndpoints.logout(), {
      onSuccess: () => setUser(null),
      onError: (error) => console.error("Error logging out: ", error),
    });
  };

  useEffect(() => {
    const refreshSession = () => {
      callApi("refreshSession", () => authEndpoints.refreshSession(), {
        onSuccess: (res) => {
          setUser(res.data);
        },
        onError: (error) => console.error("Error restoring session: ", error),
      });
    };

    refreshSession();
  }, [callApi, deviceId]);

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
