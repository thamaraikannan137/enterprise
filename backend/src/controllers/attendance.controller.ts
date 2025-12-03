import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.ts';
import attendanceService from '../services/attendanceService.ts';
import { sendSuccess } from '../utils/response.ts';
import { BadRequestError } from '../utils/errors.ts';

class AttendanceController {
  // Clock In
  async clockIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { employeeId, note, locationAddress, ipAddress } = req.body;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      // Get IP address from request if not provided
      const clientIp = ipAddress || req.ip || req.socket.remoteAddress;

      const attendanceLog = await attendanceService.clockIn(
        {
          employeeId,
          note,
          locationAddress,
          ipAddress: clientIp,
        },
        userId
      );

      sendSuccess(res, 'Clocked in successfully', attendanceLog, 201);
    } catch (error) {
      next(error);
    }
  }

  // Clock Out
  async clockOut(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { employeeId, note, locationAddress, ipAddress } = req.body;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      // Get IP address from request if not provided
      const clientIp = ipAddress || req.ip || req.socket.remoteAddress;

      const attendanceLog = await attendanceService.clockOut(
        {
          employeeId,
          note,
          locationAddress,
          ipAddress: clientIp,
        },
        userId
      );

      sendSuccess(res, 'Clocked out successfully', attendanceLog, 201);
    } catch (error) {
      next(error);
    }
  }

  // Get current status
  async getCurrentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      const status = await attendanceService.getCurrentStatus(employeeId);
      sendSuccess(res, 'Status retrieved successfully', status);
    } catch (error) {
      next(error);
    }
  }

  // Get today's attendance
  async getTodayAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      const logs = await attendanceService.getTodayAttendance(employeeId);
      sendSuccess(res, 'Today\'s attendance retrieved successfully', logs);
    } catch (error) {
      next(error);
    }
  }

  // Get attendance logs
  async getAttendanceLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate, limit, skip } = req.query;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      const filters: any = {};
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }
      if (limit) {
        filters.limit = parseInt(limit as string);
      }
      if (skip) {
        filters.skip = parseInt(skip as string);
      }

      const result = await attendanceService.getAttendanceLogs(employeeId, filters);
      sendSuccess(res, 'Attendance logs retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  // Get monthly attendance
  async getMonthlyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { year, month } = req.query;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      const currentYear = year ? parseInt(year as string) : new Date().getFullYear();
      const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;

      const result = await attendanceService.getMonthlyAttendance(employeeId, currentYear, currentMonth);
      sendSuccess(res, 'Monthly attendance retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  // Get attendance summary for a date
  async getAttendanceSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { date } = req.query;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      if (!date) {
        throw new BadRequestError('Date is required');
      }

      const summary = await attendanceService.getAttendanceSummary(employeeId, new Date(date as string));
      sendSuccess(res, 'Attendance summary retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }

  // Get attendance summaries for a date range (similar to Keka format)
  async getAttendanceSummaryRange(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      if (!employeeId) {
        throw new BadRequestError('Employee ID is required');
      }

      if (!startDate || !endDate) {
        throw new BadRequestError('Start date and end date are required');
      }

      const summaries = await attendanceService.getAttendanceSummaryRange(
        employeeId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      // Return array directly (matches Keka format)
      sendSuccess(res, 'Attendance summaries retrieved successfully', summaries);
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();

