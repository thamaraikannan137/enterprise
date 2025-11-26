import type { Request, Response, NextFunction } from 'express';
import { allowanceService } from '../services/allowanceService.ts';
import { sendSuccess } from '../utils/response.ts';

export const allowanceController = {
  // AllowanceType endpoints
  async createAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.createAllowanceType(req.body);
      sendSuccess(res, 'Allowance type created successfully', allowanceType, 201);
    } catch (error) {
      next(error);
    }
  },

  async getAllAllowanceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceTypes = await allowanceService.getAllAllowanceTypes(req.query);
      sendSuccess(res, 'Allowance types retrieved successfully', allowanceTypes);
    } catch (error) {
      next(error);
    }
  },

  async getAllowanceTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.getAllowanceTypeById(req.params.id!);
      sendSuccess(res, 'Allowance type retrieved successfully', allowanceType);
    } catch (error) {
      next(error);
    }
  },

  async updateAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceType = await allowanceService.updateAllowanceType(req.params.id!, req.body);
      sendSuccess(res, 'Allowance type updated successfully', allowanceType);
    } catch (error) {
      next(error);
    }
  },

  async deleteAllowanceType(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await allowanceService.deleteAllowanceType(req.params.id!);
      sendSuccess(res, 'Allowance type deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  async bulkCreateAllowanceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const allowanceTypes = await allowanceService.bulkCreateAllowanceTypes(req.body);
      sendSuccess(
        res,
        `${allowanceTypes.length} allowance type(s) created successfully`,
        allowanceTypes,
        201
      );
    } catch (error) {
      next(error);
    }
  },

  // EmployeeAllowance endpoints
  async createEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.createEmployeeAllowance(req.body);
      sendSuccess(res, 'Employee allowance created successfully', allowance, 201);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeAllowances(req: Request, res: Response, next: NextFunction) {
    try {
      const allowances = await allowanceService.getEmployeeAllowances(req.params.employeeId!, req.query);
      sendSuccess(res, 'Employee allowances retrieved successfully', allowances);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeAllowanceById(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.getEmployeeAllowanceById(req.params.id!);
      sendSuccess(res, 'Employee allowance retrieved successfully', allowance);
    } catch (error) {
      next(error);
    }
  },

  async updateEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const allowance = await allowanceService.updateEmployeeAllowance(req.params.id!, req.body);
      sendSuccess(res, 'Employee allowance updated successfully', allowance);
    } catch (error) {
      next(error);
    }
  },

  async deleteEmployeeAllowance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await allowanceService.deleteEmployeeAllowance(req.params.id!);
      sendSuccess(res, 'Employee allowance deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },
};

