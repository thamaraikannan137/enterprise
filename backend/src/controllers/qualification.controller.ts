import type { Request, Response, NextFunction } from 'express';
import { qualificationService } from '../services/qualificationService.ts';
import { sendSuccess } from '../utils/response.ts';

export const qualificationController = {
  // Create qualification
  async createQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.createQualification(req.body);
      sendSuccess(res, 'Qualification created successfully', qualification, 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee qualifications
  async getEmployeeQualifications(req: Request, res: Response, next: NextFunction) {
    try {
      const qualifications = await qualificationService.getEmployeeQualifications(
        req.params.employeeId!,
        req.query
      );
      sendSuccess(res, 'Qualifications retrieved successfully', qualifications);
    } catch (error) {
      next(error);
    }
  },

  // Get qualification by ID
  async getQualificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.getQualificationById(req.params.id!);
      sendSuccess(res, 'Qualification retrieved successfully', qualification);
    } catch (error) {
      next(error);
    }
  },

  // Update qualification
  async updateQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.updateQualification(req.params.id!, req.body);
      sendSuccess(res, 'Qualification updated successfully', qualification);
    } catch (error) {
      next(error);
    }
  },

  // Delete qualification
  async deleteQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await qualificationService.deleteQualification(req.params.id!);
      sendSuccess(res, 'Qualification deleted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  // Verify qualification
  async verifyQualification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      if (status !== 'verified' && status !== 'rejected') {
        res.status(400).json({ message: 'Status must be verified or rejected' });
        return;
      }
      const qualification = await qualificationService.verifyQualification(req.params.id!, status);
      sendSuccess(res, 'Qualification verification updated successfully', qualification);
    } catch (error) {
      next(error);
    }
  },
};

