import type { Request, Response, NextFunction } from 'express';
import { employeeDocumentService } from '../services/employeeDocumentService.ts';
import { sendSuccess } from '../utils/response.ts';

export const employeeDocumentController = {
  // Create document
  async createDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.createDocument(req.body);
      sendSuccess(res, 'Document created successfully', document, 201);
    } catch (error) {
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
  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const document = await employeeDocumentService.updateDocument(req.params.id!, req.body);
      sendSuccess(res, 'Document updated successfully', document);
    } catch (error) {
      next(error);
    }
  },

  // Delete document
  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeDocumentService.deleteDocument(req.params.id!);
      sendSuccess(res, 'Document deleted successfully', result);
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

