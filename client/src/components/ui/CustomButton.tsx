import React from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

const variants = {
  default: "text-white bg-blue-400 hover:bg-blue-500 border border-transparent",
  red: "text-white bg-red-400 hover:bg-red-500 border border-transparent",
  green: "text-white bg-green-400 hover:bg-green-500 border border-transparent",
} as const;

const sizes = {
  "extra-small": {
    icon: 12,
    text: "text-xs",
    padding: "px-2 py-1",
    gap: "gap-1",
  },
  small: {
    icon: 14,
    text: "text-sm",
    padding: "px-3 py-1.5",
    gap: "gap-1.5",
  },
  mid: {
    icon: 16,
    text: "text-base",
    padding: "px-4 py-1.5",
    gap: "gap-1.5",
  },
  large: {
    icon: 18,
    text: "text-lg",
    padding: "px-5 py-2",
    gap: "gap-2",
  },
} as const;

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ElementType;
  loading?: boolean;
  name: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export default function CustomButton({
  icon,
  loading,
  name,
  variant = "default",
  size = "mid",
  ...props
}: CustomButtonProps) {
  const Icon = (loading && Loader2) || icon;

  return (
    <button
      {...props}
      className={cn(
        "rounded-md transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size].text,
        sizes[size].padding,
        Icon && cn("flex items-center", sizes[size].gap),
        loading ? "cursor-progress" : "cursor-pointer",
      )}
    >
      {Icon && (
        <Icon
          size={sizes[size].icon}
          className={cn("shrink-0", loading && "animate-spin")}
        />
      )}
      {name}
    </button>
  );
}
