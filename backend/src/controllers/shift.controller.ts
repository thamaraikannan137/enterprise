import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.ts';
import shiftService from '../services/shiftService.ts';
import { sendSuccess } from '../utils/response.ts';
import { BadRequestError } from '../utils/errors.ts';

class ShiftController {
  async createShift(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const shift = await shiftService.createShift({
        ...req.body,
        created_by: userId,
      });
      sendSuccess(res, 'Shift created successfully', shift, 201);
    } catch (error) {
      next(error);
    }
  }

  async getShifts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive, locationId } = req.query;
      const filters: any = {};
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (locationId) filters.locationId = locationId as string;

      const shifts = await shiftService.getShifts(filters);
      sendSuccess(res, 'Shifts retrieved successfully', shifts);
    } catch (error) {
      next(error);
    }
  }

  async getShiftById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const shift = await shiftService.getShiftById(id);
      sendSuccess(res, 'Shift retrieved successfully', shift);
    } catch (error) {
      next(error);
    }
  }

  async updateShift(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const shift = await shiftService.updateShift(id, req.body);
      sendSuccess(res, 'Shift updated successfully', shift);
    } catch (error) {
      next(error);
    }
  }

  async deleteShift(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await shiftService.deleteShift(id);
      sendSuccess(res, 'Shift deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }
}

export default new ShiftController();

