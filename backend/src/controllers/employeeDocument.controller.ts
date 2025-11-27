import type { Request, Response, NextFunction } from 'express';
import { employeeDocumentService } from '../services/employeeDocumentService.ts';
import { sendSuccess } from '../utils/response.ts';
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

export const employeeDocumentController = {
  // Create document
  async createDocument(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;

      // Check if file was uploaded
      if (req.file) {
        // File path relative to uploads folder
        filePath = `uploads/documents/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const document = await employeeDocumentService.createDocument(
        req.body,
        filePath,
        fileName
      );
      sendSuccess(res, 'Document created successfully', document, 201);
    } catch (error) {
      // If error occurs and file was uploaded, delete the file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/documents', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  },

  // Get employee documents
  async getEmployeeDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await employeeDocumentService.getEmployeeDocuments(
        req.params.employeeId!,
        req.query
      );
      sendSuccess(res, 'Documents retrieved successfully', documents);
    } catch (error) {
      next(error);
    }
  },

  // Get document by ID
  async getDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.getDocumentById(req.params.id!);
      sendSuccess(res, 'Document retrieved successfully', document);
    } catch (error) {
      next(error);
    }
  },

  // Update document
  async updateDocument(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      let filePath: string | undefined;
      let fileName: string | undefined;

      // Check if file was uploaded
      if (req.file) {
        filePath = `uploads/documents/${req.file.filename}`;
        fileName = req.file.originalname;
      }

      const result = await employeeDocumentService.updateDocument(
        req.params.id!,
        req.body,
        filePath,
        fileName
      );

      // Delete old file if new file was uploaded
      if (result.oldFilePath && req.file) {
        try {
          const fullOldPath = path.join(__dirname, '../../', result.oldFilePath);
          await fs.unlink(fullOldPath);
        } catch (unlinkError) {
          console.error('Failed to delete old file:', unlinkError);
        }
      }

      sendSuccess(res, 'Document updated successfully', result.document);
    } catch (error) {
      // If error occurs and new file was uploaded, delete the new file
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../../uploads/documents', req.file.filename);
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  },

  // Delete document
  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeDocumentService.deleteDocument(req.params.id!);
      
      // Delete physical file if it exists
      if (result.filePath) {
        try {
          const fullFilePath = path.join(__dirname, '../../', result.filePath);
          await fs.unlink(fullFilePath);
        } catch (unlinkError) {
          console.error('Failed to delete physical file:', unlinkError);
        }
      }

      sendSuccess(res, 'Document deleted successfully', { message: result.message });
    } catch (error) {
      next(error);
    }
  },

  // Get expiring documents
  async getExpiringDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const documents = await employeeDocumentService.getExpiringDocuments(daysThreshold);
      sendSuccess(res, 'Expiring documents retrieved successfully', documents);
    } catch (error) {
      next(error);
    }
  },
};

