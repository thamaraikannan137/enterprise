import AttendanceLog from '../models/AttendanceLog.ts';
import AttendanceSummary from '../models/AttendanceSummary.ts';
import Shift from '../models/Shift.ts';
import HolidayCalendar from '../models/HolidayCalendar.ts';
import type { IAttendanceLog } from '../models/AttendanceLog.ts';

interface InOutPair {
  inTime: Date;
  outTime: Date;
  totalDuration: number; // in hours
}

class AttendanceCalculationService {
  // Convert hours to HH:MM format
  private hoursToHHMM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 60) {
      return `${h + 1}h 0m`;
    }
    return `${h}h ${m}m`;
  }

  // Convert hours to HH:MM format for breaks
  private hoursToBreakHHMM(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  // Pair IN/OUT logs
  pairInOutLogs(logs: IAttendanceLog[]): InOutPair[] {
    // Sort logs by timestamp
    const sortedLogs = logs.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Filter out deleted logs
    const activeLogs = sortedLogs.filter((log) => !log.isDeleted);

    // Pair IN with OUT
    const pairs: InOutPair[] = [];
    let currentIn: IAttendanceLog | null = null;

    for (const log of activeLogs) {
      if (log.punchStatus === 0) {
        // IN
        if (currentIn) {
          // Previous IN without OUT - create pair with null OUT (will be handled later)
          pairs.push({
            inTime: new Date(currentIn.timestamp),
            outTime: new Date(currentIn.timestamp), // Temporary, will be updated
            totalDuration: 0,
          });
        }
        currentIn = log;
      } else if (log.punchStatus === 1) {
        // OUT
        if (currentIn) {
          const inTime = new Date(currentIn.timestamp);
          const outTime = new Date(log.timestamp);
          const duration = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60);

          pairs.push({
            inTime,
            outTime,
            totalDuration: duration,
          });
          currentIn = null;
        } else {
          // OUT without IN - anomaly
          pairs.push({
            inTime: new Date(log.timestamp),
            outTime: new Date(log.timestamp),
            totalDuration: 0,
          });
        }
      }
    }

    // Handle remaining IN without OUT
    if (currentIn) {
      pairs.push({
        inTime: new Date(currentIn.timestamp),
        outTime: new Date(currentIn.timestamp),
        totalDuration: 0,
      });
    }

    // Filter out invalid pairs (same time or negative duration)
    return pairs.filter(
      (pair) =>
        pair.inTime.getTime() !== pair.outTime.getTime() && pair.totalDuration >= 0
    );
  }

  // Calculate hours
  calculateHours(pairs: InOutPair[]): {
    grossHours: number;
    effectiveHours: number;
    breakHours: number;
  } {
    // Filter valid pairs (both IN and OUT exist and duration > 0)
    const validPairs = pairs.filter(
      (p) => p.inTime && p.outTime && p.totalDuration > 0
    );

    if (validPairs.length === 0) {
      return { grossHours: 0, effectiveHours: 0, breakHours: 0 };
    }

    // First IN and Last OUT
    const firstPair = validPairs[0];
    const lastPair = validPairs[validPairs.length - 1];
    if (!firstPair || !lastPair) {
      return { grossHours: 0, effectiveHours: 0, breakHours: 0 };
    }

    const firstIn = firstPair.inTime;
    const lastOut = lastPair.outTime;

    // Gross Hours = Last OUT - First IN
    const grossHours = (lastOut.getTime() - firstIn.getTime()) / (1000 * 60 * 60);

    // Effective Hours = Sum of all pair durations
    const effectiveHours = validPairs.reduce((sum, pair) => sum + pair.totalDuration, 0);

    // Break Hours = Gross - Effective
    const breakHours = Math.max(0, grossHours - effectiveHours);

    return { grossHours, effectiveHours, breakHours };
  }

  // Detect late arrival
  detectLateArrival(
    firstIn: Date,
    shiftStartTime: string | undefined,
    gracePeriod: number = 0
  ): {
    isLate: boolean;
    lateMinutes: number;
    message: string;
  } {
    if (!shiftStartTime) {
      return { isLate: false, lateMinutes: 0, message: 'On time' };
    }
    const [hours, minutes] = shiftStartTime.split(':').map(Number);
    const shiftStart = new Date(firstIn);
    shiftStart.setHours(hours || 0, minutes || 0, 0, 0);

    const arrivalTime = new Date(firstIn);
    const lateMinutes = (arrivalTime.getTime() - shiftStart.getTime()) / (1000 * 60);

    const isLate = lateMinutes > gracePeriod;

    const h = Math.floor(Math.abs(lateMinutes) / 60);
    const m = Math.floor(Math.abs(lateMinutes) % 60);
    const message = isLate
      ? `${h}:${m.toString().padStart(2, '0')}:${Math.floor((Math.abs(lateMinutes) % 1) * 60)
          .toString()
          .padStart(2, '0')} late`
      : 'On time';

    return { isLate, lateMinutes, message };
  }

  // Determine attendance status
  determineAttendanceStatus(
    effectiveHours: number,
    shift: any
  ): 'present' | 'half-day' | 'absent' {
    if (!shift) {
      return effectiveHours >= 8 ? 'present' : effectiveHours >= 4 ? 'half-day' : 'absent';
    }

    if (effectiveHours >= shift.presentHours) {
      return 'present';
    } else if (effectiveHours >= shift.halfDayHours) {
      return 'half-day';
    } else {
      return 'absent';
    }
  }

  // Detect anomalies
  detectAnomalies(pairs: InOutPair[], totalEntries: number): string[] {
    const anomalies: string[] = [];

    // Missing clock-out (pairs with 0 duration)
    const missingOut = pairs.filter((p) => p.totalDuration === 0);
    if (missingOut.length > 0) {
      anomalies.push('Missing clock-out detected');
    }

    // Short punches (< 5 minutes)
    pairs.forEach((pair, index) => {
      if (pair.totalDuration > 0 && pair.totalDuration < 0.083) {
        // 5 minutes
        anomalies.push(`Short punch detected at pair ${index + 1} (${pair.totalDuration.toFixed(2)}h)`);
      }
    });

    // Multiple rapid punches
    if (totalEntries > 20) {
      anomalies.push('Excessive number of punches');
    }

    // No valid pairs
    const validPairs = pairs.filter((p) => p.totalDuration > 0);
    if (validPairs.length === 0 && totalEntries > 0) {
      anomalies.push('No valid in-out pairs');
    }

    return anomalies;
  }

  // Process daily attendance and create/update summary
  async processDailyAttendance(employeeId: string, date: Date): Promise<any> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get all logs for the day
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

    // Get employee's shift (for now, get default shift or first active shift)
    const shift = await Shift.findOne({ isActive: true }).lean();

    // Check if holiday
    const holiday = await HolidayCalendar.findOne({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      isActive: true,
    }).lean();

    // Pair logs
    const pairs = this.pairInOutLogs(logs as unknown as IAttendanceLog[]);

    // Calculate hours
    const { grossHours, effectiveHours, breakHours } = this.calculateHours(pairs);

    // Detect anomalies
    const anomalies = this.detectAnomalies(pairs, logs.length);

    // Determine status
    let dayType = 0; // working day
    if (holiday) {
      dayType = 1; // holiday
    }

    let attendanceDayStatus = 2; // absent
    if (logs.length > 0) {
      const status = this.determineAttendanceStatus(effectiveHours, shift);
      attendanceDayStatus = status === 'present' ? 1 : status === 'half-day' ? 3 : 2;
    }

    // Detect late arrival
    let isArrivedLate = false;
    let lateArrivalDifference = 0;
    let arrivalMessage = '';
    if (logs.length > 0 && shift) {
      const firstIn = logs.find((log) => log.punchStatus === 0);
      if (firstIn) {
        const lateInfo = this.detectLateArrival(
          new Date(firstIn.timestamp),
          shift.startTime,
          0
        );
        isArrivedLate = lateInfo.isLate;
        lateArrivalDifference = lateInfo.lateMinutes / 60;
        arrivalMessage = lateInfo.message;
      }
    }

    // Find first and last logs
    const firstLog = logs.length > 0 && logs[0] ? new Date(logs[0].timestamp) : undefined;
    const lastLogEntry = logs.length > 0 ? logs[logs.length - 1] : undefined;
    const lastLog = lastLogEntry ? new Date(lastLogEntry.timestamp) : undefined;
    const firstIn = logs.find((log) => log.punchStatus === 0)
      ? new Date(logs.find((log) => log.punchStatus === 0)!.timestamp)
      : undefined;
    const lastOut = logs
      .filter((log) => log.punchStatus === 1)
      .pop()
      ? new Date(logs.filter((log) => log.punchStatus === 1).pop()!.timestamp)
      : undefined;

    // Check for missing OUT
    const isInMissing = logs.filter((log) => log.punchStatus === 0).length >
      logs.filter((log) => log.punchStatus === 1).length;

    // Create or update summary
    const summaryData: any = {
      employeeId,
      attendanceDate: startDate,
      shiftId: shift?._id,
      shiftPolicyName: shift?.name,
      shiftStartTime: shift
        ? new Date(`${date.toISOString().split('T')[0]}T${shift.startTime}:00`)
        : new Date(startDate),
      shiftEndTime: shift
        ? new Date(`${date.toISOString().split('T')[0]}T${shift.endTime}:00`)
        : new Date(startDate),
      shiftSlotStartTime: startDate,
      shiftSlotEndTime: endDate,
      shiftDuration: shift?.effectiveDuration || 8,
      shiftEffectiveDuration: shift?.effectiveDuration || 8,
      shiftBreakDuration: shift?.breakDuration || 1,
      halfDayDuration: shift?.halfDayDuration || 4,
      dynamicShiftTimings: false,
      isAutoAssignedShift: false,
      dayType,
      attendanceDayStatus,
      firstLogOfTheDay: firstLog,
      firstInOfTheDay: firstIn,
      lastLogOfTheDay: lastLog,
      lastOutOfTheDay: lastOut,
      arrivalTime: firstIn,
      clockOutTime: lastOut,
      totalEffectiveHours: effectiveHours,
      effectiveHoursInHHMM: this.hoursToHHMM(effectiveHours),
      totalGrossHours: grossHours,
      grossHoursInHHMM: this.hoursToHHMM(grossHours),
      totalBreakDuration: breakHours,
      breakDurationInHHMM: this.hoursToBreakHHMM(breakHours),
      validInOutPairs: pairs.map((p) => ({
        inTime: p.inTime,
        outTime: p.outTime,
        totalDuration: p.totalDuration,
      })),
      leaveDayStatuses: [],
      leaveDayDuration: 0,
      isFirstHalfLeave: false,
      leaveDetails: [],
      isInMissing,
      isArrivedLate,
      lateArrivalDifference,
      arrivalMessage,
      isAnomalyDetected: anomalies.length > 0,
      isFullyWorkedOnWorkingRemotelyDay: false,
      hasLocation: logs.some((log) => log.hasAddress),
      isRemoteClockIn: logs.some((log) => log.isRemoteClockIn),
      pendingRegularization: false,
      systemGenerated: true,
      deductionSource: [],
      penaltiesCount: 0,
      totalTimeEntries: logs.length,
      timeEntries: logs.map((log) => ({
        actualTimestamp: log.actualTimestamp || log.timestamp,
        adjustedTimestamp: log.adjustedTimestamp || null,
        originalPunchStatus: log.originalPunchStatus ?? log.punchStatus,
        modifiedPunchStatus: log.modifiedPunchStatus ?? log.punchStatus,
        punchStatus: log.punchStatus,
        attendanceLogSource: log.attendanceLogSource ?? 1,
        attendanceLogSourceIdentifier: log.attendanceLogSourceIdentifier || null,
        premiseId: log.premiseId || 0,
        premiseName: log.premiseName || 'Web Clock In',
        pairSubSequentLogs: log.pairSubSequentLogs || false,
        locationAddress: log.locationAddress || null,
        hasAddress: log.hasAddress || false,
        ipAddress: log.ipAddress || null,
        manualClockinType: log.manualClockinType ?? 1,
        isAdjusted: log.isAdjusted || false,
        isDeleted: log.isDeleted || false,
        isManuallyAdded: log.isManuallyAdded || false,
        timestamp: log.timestamp,
        note: log.note || null,
        attachmentId: log.attachmentId || null,
        attachment: (log as any).attachment || null,
      })),
    };

    // Upsert summary
    const summary = await AttendanceSummary.findOneAndUpdate(
      { employeeId, attendanceDate: startDate },
      summaryData,
      { upsert: true, new: true }
    );

    return summary.toObject();
  }
}

export default new AttendanceCalculationService();

