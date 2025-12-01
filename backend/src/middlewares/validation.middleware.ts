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
      console.log('Validation middleware - Path:', req.path);
      console.log('Validation middleware - Body:', JSON.stringify(req.body, null, 2));
      
      const result = schema({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      console.log('Validation result:', result);

      if (!result.success) {
        console.log('Validation failed with errors:', result.errors);
        throw new ValidationError(JSON.stringify(result.errors || ["Validation failed"]));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
