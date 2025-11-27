import type { Request, Response, NextFunction } from 'express';
import { certificationService } from '../services/certificationService.ts';
import { sendSuccess } from '../utils/response.ts';
import EmployeeDocument from '../models/EmployeeDocument.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extend Request type to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const certificationController = {
  // Create certification
  async createCertification(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;

      // Check if file was uploaded
      if (req.file) {
        // File path relative to uploads folder
        filePath = `uploads/certifications/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const certification = await certificationService.createCertification(
        req.body,
        filePath,
        fileName
      );
      sendSuccess(res, 'Certification created successfully', certification, 201);
    } catch (error) {
      // If error occurs and file was uploaded, delete the file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/certifications', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          // Log error but don't throw - main error is more important
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  },

  // Get employee certifications
  async getEmployeeCertifications(req: Request, res: Response, next: NextFunction) {
    try {
      const certifications = await certificationService.getEmployeeCertifications(
        req.params.employeeId!,
        req.query
      );
      sendSuccess(res, 'Certifications retrieved successfully', certifications);
    } catch (error) {
      next(error);
    }
  },

  // Get certification by ID
  async getCertificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const certification = await certificationService.getCertificationById(req.params.id!);
      sendSuccess(res, 'Certification retrieved successfully', certification);
    } catch (error) {
      next(error);
    }
  },

  // Update certification
  async updateCertification(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;
      let oldFilePath: string | null = null;

      // Check if file was uploaded
      if (req.file) {
        filePath = `uploads/certifications/${req.file.filename}`;
        fileName = req.file.originalname;

        // Get existing certification to find old file path
        const existingCert = await certificationService.getCertificationById(req.params.id!);
        if (existingCert.document_id) {
          const document = await EmployeeDocument.findById(existingCert.document_id);
          if (document && document.file_path) {
            oldFilePath = document.file_path;
          }
        }
      }

      const certification = await certificationService.updateCertification(
        req.params.id!,
        req.body,
        filePath,
        fileName
      );

      // Delete old file if new file was uploaded
      if (oldFilePath && req.file) {
        try {
          const fullOldPath = path.join(__dirname, '../../', oldFilePath);
          await fs.unlink(fullOldPath);
        } catch (unlinkError) {
          // Log error but don't throw - update was successful
          console.error('Failed to delete old file:', unlinkError);
        }
      }

      sendSuccess(res, 'Certification updated successfully', certification);
    } catch (error) {
      // If error occurs and new file was uploaded, delete the new file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/certifications', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  },

  // Delete certification
  async deleteCertification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await certificationService.deleteCertification(req.params.id!);
      
      // Delete physical file if it exists
      if (result.filePath) {
        try {
          const fullFilePath = path.join(__dirname, '../../', result.filePath);
          await fs.unlink(fullFilePath);
        } catch (unlinkError) {
          // Log error but don't throw - certification deletion was successful
          console.error('Failed to delete physical file:', unlinkError);
        }
      }

      sendSuccess(res, 'Certification deleted successfully', { message: result.message });
    } catch (error) {
      next(error);
    }
  },

  // Get expiring certifications
  async getExpiringCertifications(req: Request, res: Response, next: NextFunction) {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const certifications = await certificationService.getExpiringCertifications(daysThreshold);
      sendSuccess(res, 'Expiring certifications retrieved successfully', certifications);
    } catch (error) {
      next(error);
    }
  },
};

