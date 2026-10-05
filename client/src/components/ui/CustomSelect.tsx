import type { FocusEventHandler, ReactNode, SelectHTMLAttributes } from "react";

import SelectDropdown from "./SelectDropdown";

import type { SelectOption } from "../../types/components.types";

type CustomSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "onBlur"
> & {
  placeholder?: string;
  options?: SelectOption[];
  value?: SelectOption["value"] | null;
  error?: ReactNode;
  onChange?: (
    value: SelectOption["value"] | "",
    option: SelectOption | null,
  ) => void;
  onBlur?: FocusEventHandler<HTMLDivElement>;
};

const CustomSelect = ({
  options = [],
  error,
  value,
  onChange,
  placeholder,
  className = "",
  id,
  name,
  disabled = false,
  required = false,
  onBlur,
  ...props
}: CustomSelectProps) => {
  const selectedItem =
    options.find((option) => String(option.value) === String(value)) || null;

  const handleSelect = (optionValue: SelectOption["value"]) => {
    const isSame = String(optionValue) === String(value);

    // Clicking the selected option again unselects it (unless required).
    if (isSame && required) return;

    if (isSame) {
      onChange?.("", null);
      return;
    }

    const option =
      options.find((opt) => String(opt.value) === String(optionValue)) || null;

    onChange?.(optionValue, option);
  };

  const handleClear = () => onChange?.("", null);

  return (
    <div className="relative w-full">
      <SelectDropdown
        id={id}
        options={options}
        selectedOptions={selectedItem ? [selectedItem] : []}
        placeholder={placeholder}
        isSelected={(optionValue) => String(optionValue) === String(value)}
        onSelect={handleSelect}
        allowClear={!required}
        onClear={handleClear}
        error={error}
        disabled={disabled}
        required={required}
        className={className}
        onBlur={onBlur}
      />

      <select
        {...props}
        name={name}
        value={value ?? ""}
        disabled={disabled}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
