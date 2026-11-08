import { Request, Response, NextFunction, RequestHandler } from "express";

type ErrorRecord = Record<string, unknown>;

const isErrorRecord = (value: unknown): value is ErrorRecord =>
  typeof value === "object" && value !== null;

const getMessages = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(getMessages);
  if (typeof value === "string") return [value];
  if (!isErrorRecord(value) || typeof value.message !== "string") return [];
  return [value.message];
};

export const asynchandler = (func: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((error: unknown) => {
      const errorRecord = isErrorRecord(error) ? error : {};
      const errorFields = isErrorRecord(errorRecord.errors)
        ? errorRecord.errors
        : {};
      const validationErrors = Object.fromEntries(
        Object.entries(errorFields).flatMap(([field, value]) => {
          const messages = getMessages(value);
          return messages.length ? [[field, messages]] : [];
        }),
      );

      const duplicateErrors =
        errorRecord.code === 11000
          ? Object.fromEntries(
              Object.entries(
                isErrorRecord(errorRecord.keyValue) ? errorRecord.keyValue : {},
              )
                .filter(([field]) => field !== "owner")
                .map(([field]) => [field, [`${field} is already in use.`]]),
            )
          : {};

      const errors = { ...duplicateErrors, ...validationErrors };

      const errorName =
        typeof errorRecord.name === "string" ? errorRecord.name : "";
      const statusCode =
        typeof errorRecord.statusCode === "number"
          ? errorRecord.statusCode
          : errorRecord.code === 11000
            ? 409
            : ["ValidationError", "CastError"].includes(errorName)
              ? 400
              : [
                    "JsonWebTokenError",
                    "TokenExpiredError",
                    "NotBeforeError",
                  ].includes(errorName)
                ? 401
                : 500;
      const message =
        error instanceof Error ? error.message : "Something went wrong!";

      res.status(statusCode).json({
        statusCode,
        message,
        errors,
      });
    });
  };
};
