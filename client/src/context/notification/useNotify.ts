import { createContext, useContext } from "react";
import type { NotifyContextType } from "../../types/notification.types";

export const NotificationContext = createContext<NotifyContextType | null>(null);

export const useNotify = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotify must be used within a NotificationProvider");
  }

  return context;
};
