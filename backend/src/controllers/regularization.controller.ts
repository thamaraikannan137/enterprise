import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.ts';
import regularizationService from '../services/regularizationService.ts';
import { sendSuccess } from '../utils/response.ts';
import { BadRequestError } from '../utils/errors.ts';

class RegularizationController {
  // Create regularization request
  async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const { employeeId, attendanceDate, reason, requestedChanges } = req.body;

      if (!employeeId || !attendanceDate || !reason) {
        throw new BadRequestError('Employee ID, attendance date, and reason are required');
      }

      const request = await regularizationService.createRequest({
        employeeId,
        attendanceDate: new Date(attendanceDate),
        reason,
        requestedChanges: requestedChanges || [],
        created_by: userId,
      });

      sendSuccess(res, 'Regularization request created successfully', request, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all requests
  async getRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId, status, startDate, endDate, limit, skip } = req.query;

      const filters: any = {};
      if (employeeId) filters.employeeId = employeeId as string;
      if (status) filters.status = status as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (limit) filters.limit = parseInt(limit as string);
      if (skip) filters.skip = parseInt(skip as string);

      const result = await regularizationService.getRequests(filters);
      sendSuccess(res, 'Regularization requests retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  // Get request by ID
  async getRequestById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const request = await regularizationService.getRequestById(id);
      sendSuccess(res, 'Regularization request retrieved successfully', request);
    } catch (error) {
      next(error);
    }
  }

  // Update request
  async updateRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User ID is required');
      }

      const { id } = req.params;
      const { reason, requestedChanges } = req.body;

      const request = await regularizationService.updateRequest(id, { reason, requestedChanges }, userId);
      sendSuccess(res, 'Regularization request updated successfully', request);
    } catch (error) {
      next(error);
    }
  }

  // Approve request
  async approveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        throw new BadRequestError('Admin ID is required');
      }

      const { id } = req.params;
      const { reviewNote } = req.body;

      const request = await regularizationService.approveRequest(id, adminId, reviewNote);
      sendSuccess(res, 'Regularization request approved successfully', request);
    } catch (error) {
      next(error);
    }
  }

  // Reject request
  async rejectRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        throw new BadRequestError('Admin ID is required');
      }

      const { id } = req.params;
      const { reviewNote } = req.body;

      if (!reviewNote) {
        throw new BadRequestError('Review note is required for rejection');
      }

      const request = await regularizationService.rejectRequest(id, adminId, reviewNote);
      sendSuccess(res, 'Regularization request rejected successfully', request);
    } catch (error) {
      next(error);
    }
  }
}

export default new RegularizationController();


