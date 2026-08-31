import React from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

const variants = {
  default: "text-white bg-blue-400 hover:bg-blue-500 border border-transparent",
  red: "text-white bg-red-400 hover:bg-red-500 border border-transparent",
  green: "text-white bg-green-400 hover:bg-green-500 border border-transparent",
} as const;

const sizes = {
  "extra-small": { icon: 12, text: "text-xs" },
  small: { icon: 14, text: "text-sm" },
  mid: { icon: 16, text: "text-md" },
  large: { icon: 18, text: "text-lg" },
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
        "px-4 py-1.5",
        "rounded-md transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size].text,
        Icon && "flex items-center gap-1.5",
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
