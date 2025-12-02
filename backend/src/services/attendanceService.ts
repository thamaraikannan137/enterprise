import AttendanceLog from '../models/AttendanceLog.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, BadRequestError } from '../utils/errors.ts';
import type { IAttendanceLog } from '../models/AttendanceLog.ts';

interface ClockInOutData {
  employeeId: string;
  note?: string;
  locationAddress?: {
    latitude: number;
    longitude: number;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    zip?: string;
    freeFormAddress?: string;
  };
  ipAddress?: string;
}

class AttendanceService {
  // Get the last punch status for an employee
  private async getLastPunchStatus(employeeId: string): Promise<'IN' | 'OUT' | null> {
    const lastLog = await AttendanceLog.findOne({
      employeeId,
      isDeleted: false,
    })
      .sort({ timestamp: -1 })
      .select('punchStatus event')
      .lean();

    if (!lastLog) {
      return null;
    }

    return lastLog.event;
  }

  // Clock In
  async clockIn(data: ClockInOutData, userId?: string) {
    const { employeeId, note, locationAddress, ipAddress } = data;

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Check if already clocked in
    const lastStatus = await this.getLastPunchStatus(employeeId);
    if (lastStatus === 'IN') {
      throw new BadRequestError('You are already clocked in. Please clock out first.');
    }

    const now = new Date();
    const hasAddress = !!(locationAddress?.latitude && locationAddress?.longitude);

    const attendanceLog = await AttendanceLog.create({
      employeeId,
      punchType: 'web',
      event: 'IN',
      timestamp: now,
      actualTimestamp: now,
      originalPunchStatus: 0, // IN
      punchStatus: 0, // IN
      attendanceLogSource: 1, // Web
      hasAddress,
      locationAddress: hasAddress ? locationAddress : undefined,
      geoLocation: hasAddress
        ? {
            latitude: locationAddress!.latitude,
            longitude: locationAddress!.longitude,
          }
        : undefined,
      ipAddress: ipAddress || undefined,
      isRemoteClockIn: !hasAddress, // If no location, consider it remote
      isAdjusted: false,
      isDeleted: false,
      isManuallyAdded: false,
      manualClockinType: 1, // Manual web clock-in
      pairSubSequentLogs: false,
      note: note || undefined,
      created_by: userId ? userId : undefined,
    });

    return attendanceLog.toObject();
  }

  // Clock Out
  async clockOut(data: ClockInOutData, userId?: string) {
    const { employeeId, note, locationAddress, ipAddress } = data;

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Check if already clocked out or never clocked in
    const lastStatus = await this.getLastPunchStatus(employeeId);
    if (lastStatus === 'OUT' || lastStatus === null) {
      throw new BadRequestError('You are not clocked in. Please clock in first.');
    }

    const now = new Date();
    const hasAddress = !!(locationAddress?.latitude && locationAddress?.longitude);

    const attendanceLog = await AttendanceLog.create({
      employeeId,
      punchType: 'web',
      event: 'OUT',
      timestamp: now,
      actualTimestamp: now,
      originalPunchStatus: 1, // OUT
      punchStatus: 1, // OUT
      attendanceLogSource: 1, // Web
      hasAddress,
      locationAddress: hasAddress ? locationAddress : undefined,
      geoLocation: hasAddress
        ? {
            latitude: locationAddress!.latitude,
            longitude: locationAddress!.longitude,
          }
        : undefined,
      ipAddress: ipAddress || undefined,
      isRemoteClockIn: !hasAddress,
      isAdjusted: false,
      isDeleted: false,
      isManuallyAdded: false,
      manualClockinType: 1, // Manual web clock-out
      pairSubSequentLogs: false,
      note: note || undefined,
      created_by: userId ? userId : undefined,
    });

    return attendanceLog.toObject();
  }

  // Get today's attendance logs for an employee
  async getTodayAttendance(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await AttendanceLog.find({
      employeeId,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
      isDeleted: false,
    })
      .sort({ timestamp: 1 })
      .lean();

    return logs;
  }

  // Get current status (IN or OUT)
  async getCurrentStatus(employeeId: string) {
    const lastLog = await AttendanceLog.findOne({
      employeeId,
      isDeleted: false,
    })
      .sort({ timestamp: -1 })
      .lean();

    if (!lastLog) {
      return {
        status: null,
        lastPunchTime: null,
        message: 'No attendance record found',
      };
    }

    return {
      status: lastLog.event, // 'IN' or 'OUT'
      lastPunchTime: lastLog.timestamp,
      message: lastLog.event === 'IN' ? 'Currently clocked in' : 'Currently clocked out',
    };
  }

  // Get attendance logs with filters
  async getAttendanceLogs(employeeId: string, filters: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {
      employeeId,
      isDeleted: false,
    };

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};
      if (filters.startDate) {
        query.timestamp.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.timestamp.$lte = filters.endDate;
      }
    }

    const logs = await AttendanceLog.find(query)
      .sort({ timestamp: -1 })
      .limit(filters.limit || 50)
      .skip(filters.skip || 0)
      .lean();

    const total = await AttendanceLog.countDocuments(query);

    return {
      logs,
      total,
      limit: filters.limit || 50,
      skip: filters.skip || 0,
    };
  }

  // Get monthly attendance summary
  async getMonthlyAttendance(employeeId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const logs = await AttendanceLog.find({
      employeeId,
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
      isDeleted: false,
    })
      .sort({ timestamp: 1 })
      .lean();

    // Group logs by date
    const dailyLogs: { [key: string]: any[] } = {};
    logs.forEach((log) => {
      const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
      if (dateKey) {
        if (!dailyLogs[dateKey]) {
          dailyLogs[dateKey] = [];
        }
        dailyLogs[dateKey].push(log);
      }
    });

    // Process each day to determine status
    const dailyStatus: { [key: string]: any } = {};
    Object.keys(dailyLogs).forEach((dateKey) => {
      const dayLogs = dailyLogs[dateKey];
      if (!dayLogs || dayLogs.length === 0) {
        dailyStatus[dateKey] = {
          status: 'absent',
          totalHours: '0.00',
          punchCount: 0,
          firstIn: null,
          lastOut: null,
        };
        return;
      }

      const inLogs = dayLogs.filter((log) => log.punchStatus === 0);
      const outLogs = dayLogs.filter((log) => log.punchStatus === 1);

      // Determine status
      let status = 'absent';
      if (inLogs.length > 0 && outLogs.length > 0) {
        status = 'present';
      } else if (inLogs.length > 0 || outLogs.length > 0) {
        status = 'partial';
      }

      // Calculate hours if we have pairs
      let totalHours = 0;
      if (inLogs.length > 0 && outLogs.length > 0 && inLogs[0] && outLogs[outLogs.length - 1]) {
        const firstIn = new Date(inLogs[0].timestamp);
        const lastOut = new Date(outLogs[outLogs.length - 1].timestamp);
        totalHours = (lastOut.getTime() - firstIn.getTime()) / (1000 * 60 * 60);
      }

      dailyStatus[dateKey] = {
        status,
        totalHours: totalHours.toFixed(2),
        punchCount: dayLogs.length,
        firstIn: inLogs[0]?.timestamp || null,
        lastOut: outLogs[outLogs.length - 1]?.timestamp || null,
      };
    });

    return {
      year,
      month,
      dailyStatus,
      totalDays: Object.keys(dailyStatus).length,
    };
  }

  // Get attendance summary for a specific date
  async getAttendanceSummary(employeeId: string, date: Date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // Try to get existing summary
    const AttendanceSummary = (await import('../models/AttendanceSummary.ts')).default;
    let summary = await AttendanceSummary.findOne({
      employeeId,
      attendanceDate: startDate,
    }).lean();

    // If no summary exists, calculate it
    if (!summary) {
      const attendanceCalculationService = (await import('./attendanceCalculationService.ts')).default;
      summary = await attendanceCalculationService.processDailyAttendance(employeeId, date);
    }

    // Ensure id field is set
    if (summary && !summary.id && summary._id) {
      summary.id = summary._id.toString();
    }

    return summary;
  }
}

export default new AttendanceService();

