type ErrorRecord = Record<string, unknown>;
type FieldError = [field: string, message: string];

const isErrorRecord = (value: unknown): value is ErrorRecord =>
  typeof value === "object" && value !== null;

const getErrorBody = (error: unknown): ErrorRecord => {
  if (!isErrorRecord(error)) return {};
  if (isErrorRecord(error.errors)) return error;
  return isErrorRecord(error.cause) ? error.cause : {};
};

const getErrorMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (!isErrorRecord(value)) return undefined;

  if (typeof value.message === "string") return value.message;
  return getErrorMessage(value.properties);
};

const normalizeFieldErrors = (error: unknown): FieldError[] => {
  const errorBody = getErrorBody(error);
  const errors = isErrorRecord(errorBody.errors) ? errorBody.errors : {};

  return Object.entries(errors).flatMap(([field, messages]) => {
    const message = Array.isArray(messages)
      ? messages
          .map(getErrorMessage)
          .filter((value): value is string => Boolean(value))
          .join(", ")
      : getErrorMessage(messages);

    return message ? [[field, message]] : [];
  });
};

const getFieldErrorMessage = (error: unknown): string | undefined => {
  if (!isErrorRecord(error)) return undefined;
  if (typeof error.message === "string") return error.message;

  const messages = Object.values(error).flatMap((value) => {
    const message = getFieldErrorMessage(value);
    return message ? [message] : [];
  });

  return [...new Set(messages)].join(", ") || undefined;
};

export { normalizeFieldErrors, getFieldErrorMessage };
