import { type TextareaHTMLAttributes } from "react";

import { inputClass } from "../../utils/inputClass";

type CustomTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

// Note: Use only for Text Based Inputs
const CustomTextArea = ({
  error,
  className = "",
  ...props
}: CustomTextAreaProps) => {
  return (
    <textarea {...props} className={`${inputClass(error)} ${className}`} />
  );
};

export default CustomTextArea;
