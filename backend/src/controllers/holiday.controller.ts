import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.ts';
import holidayService from '../services/holidayService.ts';
import { sendSuccess } from '../utils/response.ts';
import { BadRequestError } from '../utils/errors.ts';

class HolidayController {
  async createHoliday(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const holiday = await holidayService.createHoliday({
        ...req.body,
        date: new Date(req.body.date),
        created_by: userId,
      });
      sendSuccess(res, 'Holiday created successfully', holiday, 201);
    } catch (error) {
      next(error);
    }
  }

  async getHolidays(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year, locationId, isActive } = req.query;
      const filters: any = {};
      if (year) filters.year = parseInt(year as string);
      if (locationId) filters.locationId = locationId as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const holidays = await holidayService.getHolidays(filters);
      sendSuccess(res, 'Holidays retrieved successfully', holidays);
    } catch (error) {
      next(error);
    }
  }

  async getHolidayById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const holiday = await holidayService.getHolidayById(id);
      sendSuccess(res, 'Holiday retrieved successfully', holiday);
    } catch (error) {
      next(error);
    }
  }

  async updateHoliday(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: any = { ...req.body };
      if (req.body.date) {
        updateData.date = new Date(req.body.date);
      }
      const holiday = await holidayService.updateHoliday(id, updateData);
      sendSuccess(res, 'Holiday updated successfully', holiday);
    } catch (error) {
      next(error);
    }
  }

  async deleteHoliday(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await holidayService.deleteHoliday(id);
      sendSuccess(res, 'Holiday deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }
}

export default new HolidayController();


