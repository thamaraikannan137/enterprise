import type { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/auditService.ts';
import { sendSuccess } from '../utils/response.ts';

export const auditController = {
  // Create audit log
  async createAuditLog(req: Request, res: Response, next: NextFunction) {
    try {
      const auditLog = await auditService.createAuditLog(req.body);
      sendSuccess(res, auditLog, 'Audit log created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  // Get audit logs
  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await auditService.getAuditLogs(req.query);
      sendSuccess(res, result, 'Audit logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get record audit history
  async getRecordAuditHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { tableName, recordId } = req.params;
      const logs = await auditService.getRecordAuditHistory(tableName, recordId);
      sendSuccess(res, logs, 'Record audit history retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  // Get user audit logs
  async getUserAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await auditService.getUserAuditLogs(req.params.userId, req.query);
      sendSuccess(res, result, 'User audit logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};

