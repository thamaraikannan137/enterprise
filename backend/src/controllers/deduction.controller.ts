import type { Request, Response, NextFunction } from 'express';
import { deductionService } from '../services/deductionService.ts';
import { sendSuccess } from '../utils/response.ts';

export const deductionController = {
  // DeductionType endpoints
  async createDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.createDeductionType(req.body);
      sendSuccess(res, 'Deduction type created successfully', deductionType, 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllDeductionTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionTypes = await deductionService.getAllDeductionTypes(req.query);
      sendSuccess(res, 'Deduction types retrieved successfully', deductionTypes);
    } catch (error) {
      next(error);
    }
  },

  async getDeductionTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.getDeductionTypeById(req.params.id!);
      sendSuccess(res, 'Deduction type retrieved successfully', deductionType);
    } catch (error) {
      next(error);
    }
  },

  async updateDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.updateDeductionType(req.params.id!, req.body);
      sendSuccess(res, 'Deduction type updated successfully', deductionType);
    } catch (error) {
      next(error);
    }
  },

  async deleteDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deductionService.deleteDeductionType(req.params.id!);
      sendSuccess(res, 'Deduction type deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  async bulkCreateDeductionTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionTypes = await deductionService.bulkCreateDeductionTypes(req.body);
      sendSuccess(
        res,
        `${deductionTypes.length} deduction type(s) created successfully`,
        deductionTypes,
        201
      );
    } catch (error) {
      next(error);
    }
  },

  // EmployeeDeduction endpoints
  async createEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.createEmployeeDeduction(req.body);
      sendSuccess(res, 'Employee deduction created successfully', deduction, 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const deductions = await deductionService.getEmployeeDeductions(req.params.employeeId!, req.query);
      sendSuccess(res, 'Employee deductions retrieved successfully', deductions);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeDeductionById(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.getEmployeeDeductionById(req.params.id!);
      sendSuccess(res, 'Employee deduction retrieved successfully', deduction);
    } catch (error) {
      next(error);
    }
  },

  async updateEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.updateEmployeeDeduction(req.params.id!, req.body);
      sendSuccess(res, 'Employee deduction updated successfully', deduction);
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deductionService.deleteEmployeeDeduction(req.params.id!);
      sendSuccess(res, 'Employee deduction deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },
};

