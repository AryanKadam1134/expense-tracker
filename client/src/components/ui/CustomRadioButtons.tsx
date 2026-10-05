import type { InputHTMLAttributes, ReactNode } from "react";

import type { SelectOption } from "../../types/components.types";

type CustomRadioButtonsProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  options?: SelectOption[];
  error?: ReactNode;
  className?: string;
};

const CustomRadioButtons = ({
  options = [],
  error,
  className = "",
  ...props
}: CustomRadioButtonsProps) => {
  return (
    <div className={`flex items-center gap-4 mt-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-1">
          <input
            id={String(option.value)}
            type="radio"
            value={String(option.value)}
            className="accent-blue-500 dark:accent-blue-400 cursor-pointer"
            {...props}
          />

          <label
            htmlFor={String(option.value)}
            className="text-light-text-primary dark:text-dark-text-primary cursor-pointer"
          >
            {option.label}
            <span className="mt-1">{error}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default CustomRadioButtons;
