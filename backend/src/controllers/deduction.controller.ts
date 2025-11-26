import type { Request, Response, NextFunction } from 'express';
import { deductionService } from '../services/deductionService.ts';
import { sendSuccess } from '../utils/response.ts';

export const deductionController = {
  // DeductionType endpoints
  async createDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.createDeductionType(req.body);
      sendSuccess(res, deductionType, 'Deduction type created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllDeductionTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionTypes = await deductionService.getAllDeductionTypes(req.query);
      sendSuccess(res, deductionTypes, 'Deduction types retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getDeductionTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.getDeductionTypeById(req.params.id);
      sendSuccess(res, deductionType, 'Deduction type retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionType = await deductionService.updateDeductionType(req.params.id, req.body);
      sendSuccess(res, deductionType, 'Deduction type updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteDeductionType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deductionService.deleteDeductionType(req.params.id);
      sendSuccess(res, result, 'Deduction type deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // EmployeeDeduction endpoints
  async createEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.createEmployeeDeduction(req.body);
      sendSuccess(res, deduction, 'Employee deduction created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const deductions = await deductionService.getEmployeeDeductions(req.params.employeeId, req.query);
      sendSuccess(res, deductions, 'Employee deductions retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeDeductionById(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.getEmployeeDeductionById(req.params.id);
      sendSuccess(res, deduction, 'Employee deduction retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const deduction = await deductionService.updateEmployeeDeduction(req.params.id, req.body);
      sendSuccess(res, deduction, 'Employee deduction updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployeeDeduction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deductionService.deleteEmployeeDeduction(req.params.id);
      sendSuccess(res, result, 'Employee deduction deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

