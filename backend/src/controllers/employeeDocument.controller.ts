import type { Request, Response, NextFunction } from 'express';
import { employeeDocumentService } from '../services/employeeDocumentService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeDocumentController = {
  // Create document
  async createDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.createDocument(req.body);
      sendSuccess(res, document, 'Document created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get employee documents
  async getEmployeeDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await employeeDocumentService.getEmployeeDocuments(
        parseInt(req.params.employeeId),
        req.query
      );
      sendSuccess(res, documents, 'Documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get document by ID
  async getDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.getDocumentById(parseInt(req.params.id));
      sendSuccess(res, document, 'Document retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Update document
  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.updateDocument(parseInt(req.params.id), req.body);
      sendSuccess(res, document, 'Document updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // Delete document
  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeDocumentService.deleteDocument(parseInt(req.params.id));
      sendSuccess(res, result, 'Document deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get expiring documents
  async getExpiringDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 30;
      const documents = await employeeDocumentService.getExpiringDocuments(daysThreshold);
      sendSuccess(res, documents, 'Expiring documents retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};

