import type { Request, Response, NextFunction } from 'express';
import { workPassService } from '../services/workPassService.ts';
import { sendSuccess } from '../utils/response.ts';

export const workPassController = {
  // Create work pass
  async createWorkPass(req: Request, res: Response, next: NextFunction) {
    try {
      const workPass = await workPassService.createWorkPass(req.body);
      sendSuccess(res, 'Work pass created successfully', workPass, 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee work passes
  async getEmployeeWorkPasses(req: Request, res: Response, next: NextFunction) {
    try {
      const workPasses = await workPassService.getEmployeeWorkPasses(req.params.employeeId!, req.query);
      sendSuccess(res, 'Work passes retrieved successfully', workPasses);
    } catch (error) {
      next(error);
    }
  },

  // Get work pass by ID
  async getWorkPassById(req: Request, res: Response, next: NextFunction) {
    try {
      const workPass = await workPassService.getWorkPassById(req.params.id!);
      sendSuccess(res, 'Work pass retrieved successfully', workPass);
    } catch (error) {
      next(error);
    }
  },

  // Update work pass
  async updateWorkPass(req: Request, res: Response, next: NextFunction) {
    try {
      const workPass = await workPassService.updateWorkPass(req.params.id!, req.body);
      sendSuccess(res, 'Work pass updated successfully', workPass);
    } catch (error) {
      next(error);
    }
  },

  // Delete work pass
  async deleteWorkPass(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await workPassService.deleteWorkPass(req.params.id!);
      sendSuccess(res, 'Work pass deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // Get expiring work passes
  async getExpiringWorkPasses(req: Request, res: Response, next: NextFunction) {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const workPasses = await workPassService.getExpiringWorkPasses(daysThreshold);
      sendSuccess(res, 'Expiring work passes retrieved successfully', workPasses);
    } catch (error) {
      next(error);
    }
  },

  // Work Pass Document endpoints
  async addWorkPassDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await workPassService.addWorkPassDocument(req.body);
      sendSuccess(res, 'Work pass document added successfully', document, 201);
    } catch (error) {
      next(error);
    }
  },

  async getWorkPassDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await workPassService.getWorkPassDocuments(req.params.workPassId!);
      sendSuccess(res, 'Work pass documents retrieved successfully', documents);
    } catch (error) {
      next(error);
    }
  },

  async deleteWorkPassDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await workPassService.deleteWorkPassDocument(req.params.id!);
      sendSuccess(res, 'Work pass document deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },
};

