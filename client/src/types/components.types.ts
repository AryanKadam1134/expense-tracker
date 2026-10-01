import type { FocusEventHandler, ReactNode } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  id?: string;
  options: SelectOption[];
  selectedOptions?: SelectOption[];
  placeholder?: string;
  isSelected: (value: SelectOption["value"]) => boolean;
  onSelect: (value: SelectOption["value"]) => void;
  multiple?: boolean;
  allowClear?: boolean;
  onClear?: () => void;
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onBlur?: FocusEventHandler<HTMLDivElement>;
}
