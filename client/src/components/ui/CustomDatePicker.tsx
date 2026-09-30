import { type InputHTMLAttributes } from "react";

import { type LucideIcon } from "lucide-react";

import { inputClass } from "../../utils/inputClass";

type CustomDatePickerProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  error?: string;
};

const CustomDatePicker = ({
  icon,
  error,
  className = "",
  ...props
}: CustomDatePickerProps) => {
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
        type="date"
        onClick={(e) => e.currentTarget.showPicker()}
        className={`${Icon && "pl-10"} ${inputClass(error)} ${className} [&::-webkit-calendar-picker-indicator]:hidden appearance-none`}
      />
    </div>
  );
};

export default CustomDatePicker;
