import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors.ts";

export type ValidationSchema = (data: {
  body?: any;
  query?: any;
  params?: any;
}) => { success: boolean; errors?: string[] };

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        throw new ValidationError(JSON.stringify(result.errors || ["Validation failed"]));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
