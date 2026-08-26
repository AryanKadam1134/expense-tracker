import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiRes from "./ApiRes";

export const asyncHandler = (func: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((error: any) => {
      const statusCode = error.statusCode;

      res
        .status(statusCode || 500)
        .json(new ApiRes(statusCode, null, error.message));
    });
  };
};
