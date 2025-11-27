import type { Request, Response, NextFunction } from 'express';
import { qualificationService } from '../services/qualificationService.ts';
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

export const qualificationController = {
  // Create qualification
  async createQualification(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;

      // Check if file was uploaded
      if (req.file) {
        // File path relative to uploads folder
        filePath = `uploads/qualifications/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const qualification = await qualificationService.createQualification(
        req.body,
        filePath,
        fileName
      );
      sendSuccess(res, 'Qualification created successfully', qualification, 201);
    } catch (error) {
      // If error occurs and file was uploaded, delete the file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/qualifications', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          // Log error but don't throw - main error is more important
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
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
  async updateQualification(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;
      let oldFilePath: string | null = null;

      // Check if file was uploaded
      if (req.file) {
        filePath = `uploads/qualifications/${req.file.filename}`;
        fileName = req.file.originalname;

        // Get existing qualification to find old file path
        const existingQual = await qualificationService.getQualificationById(req.params.id!);
        if (existingQual.document_id) {
          const document = await EmployeeDocument.findById(existingQual.document_id);
          if (document && document.file_path) {
            oldFilePath = document.file_path;
          }
        }
      }

      const qualification = await qualificationService.updateQualification(
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

      sendSuccess(res, 'Qualification updated successfully', qualification);
    } catch (error) {
      // If error occurs and new file was uploaded, delete the new file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/qualifications', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  },

  // Delete qualification
  async deleteQualification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await qualificationService.deleteQualification(req.params.id!);
      
      // Delete physical file if it exists
      if (result.filePath) {
        try {
          const fullFilePath = path.join(__dirname, '../../', result.filePath);
          await fs.unlink(fullFilePath);
        } catch (unlinkError) {
          // Log error but don't throw - qualification deletion was successful
          console.error('Failed to delete physical file:', unlinkError);
        }
      }

      sendSuccess(res, 'Qualification deleted successfully', { message: result.message });
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

