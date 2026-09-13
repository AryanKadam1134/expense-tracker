import { type ReactNode } from "react";
import { message as antdMessage, notification } from "antd";

import { NotificationContext } from "./useNotify";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  // Ant Design Notification
  const [api, contextHolder] = notification.useNotification();

  const [messageApi, messageContextHolder] = antdMessage.useMessage();

  const baseConfig = {
    placement: "bottomRight" as const,
    duration: 3,
    className: "custom-notification",
    style: {
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    },
    showProgress: false,
    pauseOnHover: false,
  };

  const buildConfig = (message: string, description: string | undefined, icon: ReactNode | null, config: Record<string, unknown>) => {
    const finalConfig: Record<string, unknown> = { ...baseConfig, ...config, message };
    if (description) finalConfig.description = description;
    if (icon) finalConfig.icon = icon;
    return finalConfig as Parameters<typeof api.success>[0];
  };

  const buildMessageContent = (msg: string, icon: ReactNode | null) => (
    <span className="flex items-center gap-2">
      {icon && <span className="flex">{icon}</span>}
      {msg}
    </span>
  );

  // Enhanced notification methods with optional storage
  const notify = {
    // Toast notifications with optional storage
    success: (message: string, description?: string, icon: ReactNode | null = null, config: Record<string, unknown> = {}) => {
      api.success(buildConfig(message, description, icon, config));
    },

    error: (message: string, description?: string, icon: ReactNode | null = null, config: Record<string, unknown> = {}) => {
      api.error(buildConfig(message, description, icon, config));
    },

    warning: (message: string, description?: string, icon: ReactNode | null = null, config: Record<string, unknown> = {}) => {
      api.warning(buildConfig(message, description, icon, config));
    },

    info: (message: string, description?: string, icon: ReactNode | null = null, config: Record<string, unknown> = {}) => {
      api.info(buildConfig(message, description, icon, config));
    },

    open: (message: string, description?: string, icon: ReactNode | null = null, config: Record<string, unknown> = {}) => {
      api.open(buildConfig(message, description, icon, config));
    },

    // Simple messages with optional storage
    msgSuccess: (msg: string, icon: ReactNode | null = null, duration: number = 2) => {
      messageApi.open({
        type: "success",
        content: buildMessageContent(msg, icon),
        duration,
      });
    },

    msgError: (msg: string, icon: ReactNode | null = null, duration: number = 2) => {
      messageApi.open({
        type: "error",
        content: buildMessageContent(msg, icon),
        duration,
      });
    },

    msgWarning: (msg: string, icon: ReactNode | null = null, duration: number = 2) => {
      messageApi.open({
        type: "warning",
        content: buildMessageContent(msg, icon),
        duration,
      });
    },

    msgInfo: (msg: string, icon: ReactNode | null = null, duration: number = 2) => {
      messageApi.open({
        type: "info",
        content: buildMessageContent(msg, icon),
        duration,
      });
    },
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}
      {messageContextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
