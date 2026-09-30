import { useState, type InputHTMLAttributes } from "react";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { inputClass } from "../../utils/inputClass";

type CustomInputPassowrdProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  error?: string;
};

// Note: Use only for Text Based Inputs
const CustomInputPassword = ({
  icon,
  error,
  className,
  ...props
}: CustomInputPassowrdProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
        type={showPassword ? "text" : "password"}
        className={`${Icon && "pl-10"} pr-10 ${inputClass(error)} ${className}`}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-gray-100 cursor-pointer"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default CustomInputPassword;
