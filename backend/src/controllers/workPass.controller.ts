import type { Request, Response, NextFunction } from 'express';
import { workPassService } from '../services/workPassService.ts';
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
      
      // Delete physical files if they exist
      if (result.filePaths && result.filePaths.length > 0) {
        for (const filePath of result.filePaths) {
          try {
            const fullFilePath = path.join(__dirname, '../../', filePath);
            await fs.unlink(fullFilePath);
          } catch (unlinkError) {
            console.error('Failed to delete physical file:', unlinkError);
          }
        }
      }

      sendSuccess(res, 'Work pass deleted successfully', { message: result.message });
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
  async addWorkPassDocument(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;

      // Check if file was uploaded
      if (req.file) {
        // File path relative to uploads folder
        filePath = `uploads/workpasses/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const document = await workPassService.addWorkPassDocument(
        req.body,
        filePath,
        fileName
      );
      sendSuccess(res, 'Work pass document added successfully', document, 201);
    } catch (error) {
      // If error occurs and file was uploaded, delete the file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/workpasses', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
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
      
      // Delete physical file if it exists
      if (result.filePath) {
        try {
          const fullFilePath = path.join(__dirname, '../../', result.filePath);
          await fs.unlink(fullFilePath);
        } catch (unlinkError) {
          console.error('Failed to delete physical file:', unlinkError);
        }
      }

      sendSuccess(res, 'Work pass document deleted successfully', { message: result.message });
    } catch (error) {
      next(error);
    }
  },
};

