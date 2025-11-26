import type { Request, Response, NextFunction } from 'express';
import { certificationService } from '../services/certificationService.ts';
import { sendSuccess } from '../utils/response.ts';

export const certificationController = {
  // Create certification
  async createCertification(req: Request, res: Response, next: NextFunction) {
    try {
      const certification = await certificationService.createCertification(req.body);
      sendSuccess(res, certification, 'Certification created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee certifications
  async getEmployeeCertifications(req: Request, res: Response, next: NextFunction) {
    try {
      const certifications = await certificationService.getEmployeeCertifications(
        req.params.employeeId,
        req.query
      );
      sendSuccess(res, certifications, 'Certifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get certification by ID
  async getCertificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const certification = await certificationService.getCertificationById(req.params.id);
      sendSuccess(res, certification, 'Certification retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Update certification
  async updateCertification(req: Request, res: Response, next: NextFunction) {
    try {
      const certification = await certificationService.updateCertification(req.params.id, req.body);
      sendSuccess(res, certification, 'Certification updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // Delete certification
  async deleteCertification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await certificationService.deleteCertification(req.params.id);
      sendSuccess(res, result, 'Certification deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get expiring certifications
  async getExpiringCertifications(req: Request, res: Response, next: NextFunction) {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const certifications = await certificationService.getExpiringCertifications(daysThreshold);
      sendSuccess(res, certifications, 'Expiring certifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};

