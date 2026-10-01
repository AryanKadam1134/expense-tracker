import type { InputHTMLAttributes } from "react";

export default function CustomCheckbox({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`accent-blue-500 dark:accent-blue-400 cursor-pointer ${className}`}
    />
  );
}
