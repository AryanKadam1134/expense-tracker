class ApiError extends Error {
  statusCode: number;
  message: string;
  errors: Record<string, unknown>;
  success: boolean;

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong!",
    errors: Record<string, unknown> = {},
    success: boolean = false,
    stack: string = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = statusCode < 400 || success;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
