import { createContext, useContext, type ReactNode } from "react";

export interface NotifyContextType {
  notify: {
    success: (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
    error: (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
    warning: (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
    info: (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
    open: (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
    msgSuccess: (msg: string, icon?: ReactNode | null, duration?: number) => void;
    msgError: (msg: string, icon?: ReactNode | null, duration?: number) => void;
    msgWarning: (msg: string, icon?: ReactNode | null, duration?: number) => void;
    msgInfo: (msg: string, icon?: ReactNode | null, duration?: number) => void;
  };
}

export const NotificationContext = createContext<NotifyContextType | null>(null);

export const useNotify = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotify must be used within an NotificationsProvider");
  }

  return context;
};
