import type { Request, Response, NextFunction } from 'express';
import { qualificationService } from '../services/qualificationService.ts';
import { sendSuccess } from '../utils/response.ts';

export const qualificationController = {
  // Create qualification
  async createQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.createQualification(req.body);
      sendSuccess(res, qualification, 'Qualification created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee qualifications
  async getEmployeeQualifications(req: Request, res: Response, next: NextFunction) {
    try {
      const qualifications = await qualificationService.getEmployeeQualifications(
        req.params.employeeId,
        req.query
      );
      sendSuccess(res, qualifications, 'Qualifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get qualification by ID
  async getQualificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.getQualificationById(req.params.id);
      sendSuccess(res, qualification, 'Qualification retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Update qualification
  async updateQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const qualification = await qualificationService.updateQualification(req.params.id, req.body);
      sendSuccess(res, qualification, 'Qualification updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // Delete qualification
  async deleteQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await qualificationService.deleteQualification(req.params.id);
      sendSuccess(res, result, 'Qualification deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // Verify qualification
  async verifyQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (status !== 'verified' && status !== 'rejected') {
        return res.status(400).json({ message: 'Status must be verified or rejected' });
      }
      const qualification = await qualificationService.verifyQualification(req.params.id, status);
      sendSuccess(res, qualification, 'Qualification verification updated successfully');
    } catch (error) {
      next(error);
    }
  },
};

