import React from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn";

const variants = {
  default:
    "text-white bg-[#174936] hover:bg-[#103b2b] border border-transparent shadow-sm hover:shadow-md",
  red: "text-white bg-rose-600 hover:bg-rose-700 border border-transparent shadow-sm",
  green:
    "text-[#24533d] bg-[#eaf3ec] hover:bg-[#dcebe0] border border-[#d8e7dc]",
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

const CustomButton = ({
  icon,
  loading,
  name,
  variant = "default",
  size = "mid",
  className = "",
  ...props
}: CustomButtonProps) => {
  const Icon = (loading && Loader2) || icon;

  return (
    <button
      {...props}
      className={cn(
        className,
        "rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a98a] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size].text,
        sizes[size].padding,
        Icon && cn("flex items-center justify-center", sizes[size].gap),
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
};

export default CustomButton;
