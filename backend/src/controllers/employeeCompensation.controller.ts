import type { Request, Response, NextFunction } from 'express';
import { employeeCompensationService } from '../services/employeeCompensationService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeCompensationController = {
  // Create compensation
  async createCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.createCompensation(req.body);
      sendSuccess(res, 'Compensation created successfully', compensation, 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee compensations
  async getEmployeeCompensations(req: Request, res: Response, next: NextFunction) {
    try {
      const compensations = await employeeCompensationService.getEmployeeCompensations(req.params.employeeId!);
      sendSuccess(res, 'Compensations retrieved successfully', compensations);
    } catch (error) {
      next(error);
    }
  },

  // Get current compensation
  async getCurrentCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.getCurrentCompensation(req.params.employeeId!);
      sendSuccess(res, 'Current compensation retrieved successfully', compensation);
    } catch (error) {
      next(error);
    }
  },

  // Get compensation by ID
  async getCompensationById(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.getCompensationById(req.params.id!);
      sendSuccess(res, 'Compensation retrieved successfully', compensation);
    } catch (error) {
      next(error);
    }
  },

  // Update compensation
  async updateCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.updateCompensation(req.params.id!, req.body);
      sendSuccess(res, 'Compensation updated successfully', compensation);
    } catch (error) {
      next(error);
    }
  },

  // Delete compensation
  async deleteCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeCompensationService.deleteCompensation(req.params.id!);
      sendSuccess(res, 'Compensation deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },
};

