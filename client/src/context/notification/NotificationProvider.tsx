import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import ToastContainer from "../../components/common/ToastContainer";
import type {
  NotifyContextType,
  ToastInput,
  ToastItem,
  ToastPosition,
  ToastType,
} from "../../types/notification.types";
import { NotificationContext } from "./useNotify";

const TOAST_EXIT_DURATION = 220;
const positions: ToastPosition[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
];

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const closingToasts = useRef(new Set<number>());
  const remaining = useRef(new Map<number, number>());
  const startedAt = useRef(new Map<number, number>());
  const pausedToasts = useRef(new Set<number>());

  const clearTimer = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: number) => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      closingToasts.current.delete(id);
      pausedToasts.current.delete(id);
      remaining.current.delete(id);
      startedAt.current.delete(id);
      clearTimer(id);
    },
    [clearTimer],
  );

  const closeToast = useCallback(
    (id: number) => {
      if (closingToasts.current.has(id)) return;
      closingToasts.current.add(id);
      pausedToasts.current.delete(id);
      remaining.current.delete(id);
      startedAt.current.delete(id);
      clearTimer(id);
      setToasts((current) =>
        current.map((toast) =>
          toast.id === id ? { ...toast, isClosing: true } : toast,
        ),
      );
      timers.current.set(
        id,
        setTimeout(() => removeToast(id), TOAST_EXIT_DURATION),
      );
    },
    [clearTimer, removeToast],
  );

  const pauseToast = useCallback(
    (id: number) => {
      if (closingToasts.current.has(id) || pausedToasts.current.has(id)) return;
      if (!timers.current.has(id)) return;
      const elapsed = Date.now() - (startedAt.current.get(id) ?? Date.now());
      const timeLeft = Math.max((remaining.current.get(id) ?? 0) - elapsed, 0);
      clearTimer(id);
      remaining.current.set(id, timeLeft);
      pausedToasts.current.add(id);
    },
    [clearTimer],
  );

  const resumeToast = useCallback(
    (id: number) => {
      if (!pausedToasts.current.has(id)) return;
      pausedToasts.current.delete(id);
      const timeLeft = remaining.current.get(id) ?? 0;
      if (timeLeft <= 0) {
        closeToast(id);
        return;
      }
      startedAt.current.set(id, Date.now());
      timers.current.set(id, setTimeout(() => closeToast(id), timeLeft));
    },
    [closeToast],
  );

  const showToast = useCallback(
    (input: ToastInput, defaultType: ToastType = "info") => {
      const options = typeof input === "string" ? { title: input } : input;
      const id = ++nextId.current;
      const {
        title,
        description,
        duration = 3000,
        position = "topRight",
        icon = null,
      } = options;
      const toast: ToastItem = {
        id,
        type: options.type ?? defaultType,
        title,
        description,
        duration,
        position,
        icon,
      };

      setToasts((current) => [...current, toast]);
      if (duration > 0) {
        remaining.current.set(id, duration);
        startedAt.current.set(id, Date.now());
        timers.current.set(id, setTimeout(() => closeToast(id), duration));
      }
      return id;
    },
    [closeToast],
  );

  const notify = useMemo<NotifyContextType["notify"]>(
    () => ({
      show: (options) => showToast(options),
      success: (options) => showToast(options, "success"),
      error: (options) => showToast(options, "error"),
      warning: (options) => showToast(options, "warning"),
      info: (options) => showToast(options, "info"),
    }),
    [showToast],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {positions.map((position) => (
        <ToastContainer
          key={position}
          position={position}
          toasts={toasts.filter((toast) => toast.position === position)}
          onRemove={closeToast}
          onPause={pauseToast}
          onResume={resumeToast}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export const NotificationsProvider = NotificationProvider;
