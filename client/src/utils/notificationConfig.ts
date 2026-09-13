/**
 * Ant Design Notification base configuration
 * Used by NotificationProvider for consistent notification styling
 */
export const NOTIFICATION_BASE_CONFIG = {
  placement: "bottomRight" as const,
  duration: 3,
  className: "custom-notification",
  style: {
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  },
  showProgress: false,
  pauseOnHover: false,
} as const;
