import { type ReactNode } from "react";
import { message as antdMessage, notification } from "antd";

import {
  NotificationContext,
  type ToastMethod,
  type MessageMethod,
} from "./useNotify";
import { NOTIFICATION_BASE_CONFIG } from "../../utils/notificationConfig";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  // Ant Design Notification
  const [api, contextHolder] = notification.useNotification();

  const [messageApi, messageContextHolder] = antdMessage.useMessage();

  const buildConfig = (
    message: string,
    description: string | undefined,
    icon: ReactNode | null,
    config: Record<string, unknown>,
  ) => {
    const finalConfig: Record<string, unknown> = {
      ...NOTIFICATION_BASE_CONFIG,
      ...config,
      message,
    };
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
    success: ((message = "", description, icon = null, config = {}) => {
      api.success(buildConfig(message, description, icon, config));
    }) as ToastMethod,

    error: ((message = "", description, icon = null, config = {}) => {
      api.error(buildConfig(message, description, icon, config));
    }) as ToastMethod,

    warning: ((message = "", description, icon = null, config = {}) => {
      api.warning(buildConfig(message, description, icon, config));
    }) as ToastMethod,

    info: ((message = "", description, icon = null, config = {}) => {
      api.info(buildConfig(message, description, icon, config));
    }) as ToastMethod,

    open: ((message = "", description, icon = null, config = {}) => {
      api.open(buildConfig(message, description, icon, config));
    }) as ToastMethod,

    // Simple messages with optional storage
    msgSuccess: ((msg = "", icon = null, duration = 2) => {
      messageApi.open({
        type: "success",
        content: buildMessageContent(msg, icon),
        duration,
      });
    }) as MessageMethod,

    msgError: ((msg = "", icon = null, duration = 2) => {
      messageApi.open({
        type: "error",
        content: buildMessageContent(msg, icon),
        duration,
      });
    }) as MessageMethod,

    msgWarning: ((msg = "", icon = null, duration = 2) => {
      messageApi.open({
        type: "warning",
        content: buildMessageContent(msg, icon),
        duration,
      });
    }) as MessageMethod,

    msgInfo: ((msg = "", icon = null, duration = 2) => {
      messageApi.open({
        type: "info",
        content: buildMessageContent(msg, icon),
        duration,
      });
    }) as MessageMethod,
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {contextHolder}
      {messageContextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
