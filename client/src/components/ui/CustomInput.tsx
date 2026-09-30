import { type InputHTMLAttributes } from "react";

import { type LucideIcon } from "lucide-react";

import { inputClass } from "../../utils/inputClass";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  error?: string;
};

// Note: Use only for Text Based Inputs
const CustomInput = ({
  icon,
  error,
  className = "",
  ...props
}: CustomInputProps) => {
  const Icon = icon;

  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        />
      )}

      <input
        {...props}
        className={`${Icon && "pl-10"} ${inputClass(error)} ${className}`}
      />
    </div>
  );
};

export default CustomInput;
