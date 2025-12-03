export interface AttendanceSummary {
  id: string;
  employeeId: string;
  attendanceDate: string;
  shiftId?: string;
  shiftPolicyName?: string;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftSlotStartTime: string;
  shiftSlotEndTime: string;
  shiftDuration: number;
  shiftEffectiveDuration: number;
  shiftBreakDuration: number;
  halfDayDuration: number;
  dynamicShiftTimings: boolean;
  isAutoAssignedShift: boolean;
  dayType: number;
  attendanceDayStatus: number;
  firstLogOfTheDay?: string;
  firstInOfTheDay?: string;
  lastLogOfTheDay?: string;
  lastOutOfTheDay?: string;
  arrivalTime?: string;
  clockOutTime?: string;
  totalEffectiveHours: number;
  effectiveHoursInHHMM: string;
  totalGrossHours: number;
  grossHoursInHHMM: string;
  totalBreakDuration: number;
  breakDurationInHHMM: string;
  validInOutPairs: Array<{
    inTime: string;
    outTime: string;
    totalDuration: number;
  }>;
  leaveDayStatuses: number[];
  leaveDayDuration: number;
  isFirstHalfLeave: boolean;
  leaveDetails: Array<{
    leaveTypeId: string;
    duration: number;
  }>;
  isInMissing: boolean;
  isArrivedLate: boolean;
  lateArrivalDifference: number;
  arrivalMessage?: string;
  isAnomalyDetected: boolean;
  isFullyWorkedOnWorkingRemotelyDay: boolean;
  hasLocation: boolean;
  isRemoteClockIn: boolean;
  pendingRegularization: boolean;
  regularizationRequestId?: string;
  systemGenerated: boolean;
  deductionSource: string[];
  penaltyCauseNote?: string;
  penaltiesCount: number;
  totalTimeEntries: number;
  created_by?: string;
  createdAt: string;
  updatedAt: string;
}


