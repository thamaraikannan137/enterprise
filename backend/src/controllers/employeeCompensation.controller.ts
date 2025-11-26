import type { Request, Response, NextFunction } from 'express';
import { employeeCompensationService } from '../services/employeeCompensationService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeCompensationController = {
  // Create compensation
  async createCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.createCompensation(req.body);
      sendSuccess(res, compensation, 'Compensation created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee compensations
  async getEmployeeCompensations(req: Request, res: Response, next: NextFunction) {
    try {
      const compensations = await employeeCompensationService.getEmployeeCompensations(req.params.employeeId);
      sendSuccess(res, compensations, 'Compensations retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get current compensation
  async getCurrentCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.getCurrentCompensation(req.params.employeeId);
      sendSuccess(res, compensation, 'Current compensation retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get compensation by ID
  async getCompensationById(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.getCompensationById(req.params.id);
      sendSuccess(res, compensation, 'Compensation retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Update compensation
  async updateCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const compensation = await employeeCompensationService.updateCompensation(req.params.id, req.body);
      sendSuccess(res, compensation, 'Compensation updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // Delete compensation
  async deleteCompensation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeCompensationService.deleteCompensation(req.params.id);
      sendSuccess(res, result, 'Compensation deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

