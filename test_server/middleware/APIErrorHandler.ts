import { APIError } from "@/libs/APIError";
import type { Request, Response, NextFunction } from "express";
import type { APIErrorBody } from "@/types/api/APIErrorBody";
import { logger } from "@/libs/logger";

export const APIErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  let errorBody: APIErrorBody = {
    message: "Internal Server Error",
  };

  res.statusCode = 500;

  if (err instanceof APIError) {
    res.statusCode = err.code;
    errorBody.message = err.message;
  }

  res.statusMessage = errorBody.message;
  res.json(errorBody);
};
