import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

export interface ToastOptions {
  title: string;
  type?: ToastType;
  description?: string;
  duration?: number;
  position?: ToastPosition;
  icon?: ReactNode | null;
}

export type ToastInput = string | ToastOptions;

export interface ToastItem extends ToastOptions {
  id: number;
  type: ToastType;
  isClosing?: boolean;
}

export type ToastMethod = (options: ToastInput) => number;

export interface NotifyContextType {
  notify: {
    show: (options: ToastInput) => number;
    success: ToastMethod;
    error: ToastMethod;
    warning: ToastMethod;
    info: ToastMethod;
  };
}

export interface ToastContainerProps {
  position: ToastPosition;
  toasts: ToastItem[];
  onRemove: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
}
