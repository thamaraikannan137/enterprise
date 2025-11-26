import type { Request, Response, NextFunction } from 'express';
import { allowanceService } from '../services/allowanceService.ts';
import { sendSuccess } from '../utils/response.ts';

export const allowanceController = {
  // AllowanceType endpoints
  async createAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.createAllowanceType(req.body);
      sendSuccess(res, allowanceType, 'Allowance type created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllAllowanceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceTypes = await allowanceService.getAllAllowanceTypes(req.query);
      sendSuccess(res, allowanceTypes, 'Allowance types retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getAllowanceTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.getAllowanceTypeById(req.params.id);
      sendSuccess(res, allowanceType, 'Allowance type retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.updateAllowanceType(req.params.id, req.body);
      sendSuccess(res, allowanceType, 'Allowance type updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await allowanceService.deleteAllowanceType(req.params.id);
      sendSuccess(res, result, 'Allowance type deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // EmployeeAllowance endpoints
  async createEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.createEmployeeAllowance(req.body);
      sendSuccess(res, allowance, 'Employee allowance created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeAllowances(req: Request, res: Response, next: NextFunction) {
    try {
      const allowances = await allowanceService.getEmployeeAllowances(req.params.employeeId, req.query);
      sendSuccess(res, allowances, 'Employee allowances retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeAllowanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.getEmployeeAllowanceById(req.params.id);
      sendSuccess(res, allowance, 'Employee allowance retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.updateEmployeeAllowance(req.params.id, req.body);
      sendSuccess(res, allowance, 'Employee allowance updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await allowanceService.deleteEmployeeAllowance(req.params.id);
      sendSuccess(res, result, 'Employee allowance deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

