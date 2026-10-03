import { useEffect, useMemo, useState, type ReactNode } from "react";

import { v4 as uuidv4 } from "uuid";

import { authEndpoints } from "../../services/auth.service";

import { AuthContext } from "./useAuth";
import { useNotify } from "../notification";

import useApi from "../../hooks/useApi";

import type { GoogleAuth, Login, User } from "../../types/api.types";

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

  const config = useMemo(() => {
    return {
      headers: {
        "x-device-id": deviceId,
      },
    };
  }, [deviceId]);

  const googleAuth = (body: GoogleAuth) => {
    callApi("googleAuth", () => authEndpoints.googleAuth(body, config), {
      onSuccess: (res) => {
        setUser(res.data);
      },
    });
  };

  const login = async (payload: Login) => {
    const data = await callApi(
      "login",
      () => authEndpoints.login(payload, config),
      {
        onSuccess: (res) => {
          setUser(res.data);
          setError(null);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error?.message : "Login failed!";
          notify.error(errorMessage);
          setError(errorMessage);
        },
      },
    );

    return data?.success;
  };

  const logout = () => {
    callApi("logout", () => authEndpoints.logout(), {
      onSuccess: () => setUser(null),
    });
  };

  useEffect(() => {
    const refreshSession = () => {
      callApi("refreshSession", () => authEndpoints.refreshSession(config), {
        onSuccess: (res) => {
          setUser(res.data);
        },
      });
    };

    refreshSession();
  }, [callApi, config, deviceId]);

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
