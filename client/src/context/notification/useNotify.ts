import { createContext, useContext, type ReactNode } from "react";

// Notification method types - DRY approach
export type ToastMethod = (message: string, description?: string, icon?: ReactNode | null, config?: Record<string, unknown>) => void;
export type MessageMethod = (msg: string, icon?: ReactNode | null, duration?: number) => void;

export interface NotifyContextType {
  notify: {
    // Toast notifications
    success: ToastMethod;
    error: ToastMethod;
    warning: ToastMethod;
    info: ToastMethod;
    open: ToastMethod;
    // Simple messages
    msgSuccess: MessageMethod;
    msgError: MessageMethod;
    msgWarning: MessageMethod;
    msgInfo: MessageMethod;
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
