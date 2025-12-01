import type { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors.ts";
import { sendError } from "../utils/response.ts";
import logger from "../config/logger.ts";
import { HTTP_STATUS } from "../config/constants.ts";
import mongoose from "mongoose";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    logger.error(`Mongoose ValidationError: ${errors.join(', ')}`, {
      path: req.path,
      method: req.method,
      errors,
    });
    return sendError(res, JSON.stringify(errors), HTTP_STATUS.VALIDATION_ERROR);
  }

  // Check if it's an operational error (expected application error)
  if (err instanceof AppError && err.isOperational) {
    logger.error(`AppError: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    return sendError(res, err.message, err.statusCode);
  }

  // Programming or unexpected errors - log full details but hide from client
  logger.error(`Unexpected Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    name: err.name,
  });

  // Don't expose internal error details to client in production
  const errorMessage = 
    process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred" 
      : err.message;

  return sendError(
    res,
    "An unexpected error occurred",
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorMessage
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return sendError(res, `Route ${req.path} not found`, HTTP_STATUS.NOT_FOUND);
};
