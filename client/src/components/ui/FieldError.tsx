type FieldErrorProps = {
  error?: string;
};

const FieldError = ({ error }: FieldErrorProps) => {
  return (
    error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
  );
};

export default FieldError;
