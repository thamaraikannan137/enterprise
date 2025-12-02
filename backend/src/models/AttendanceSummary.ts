import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceSummary extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  attendanceDate: Date; // Date only (no time)
  
  // Shift Information
  shiftId?: mongoose.Types.ObjectId;
  shiftPolicyName?: string;
  shiftStartTime: Date;
  shiftEndTime: Date;
  shiftSlotStartTime: Date;
  shiftSlotEndTime: Date;
  shiftDuration: number; // in hours
  shiftEffectiveDuration: number; // in hours
  shiftBreakDuration: number; // in hours
  halfDayDuration: number; // in hours
  dynamicShiftTimings: boolean;
  isAutoAssignedShift: boolean;
  
  // Day Classification
  dayType: number; // 0 = working day, 1 = holiday, 2 = weekend
  attendanceDayStatus: number; // 1 = present, 2 = absent, 3 = half-day
  
  // Time Calculations
  firstLogOfTheDay?: Date;
  firstInOfTheDay?: Date;
  lastLogOfTheDay?: Date;
  lastOutOfTheDay?: Date;
  arrivalTime?: Date;
  clockOutTime?: Date;
  
  // Hours
  totalEffectiveHours: number;
  effectiveHoursInHHMM: string; // "8h 21m"
  totalGrossHours: number;
  grossHoursInHHMM: string; // "9h 17m"
  totalBreakDuration: number;
  breakDurationInHHMM: string; // "0:56"
  
  // Valid In-Out Pairs
  validInOutPairs: Array<{
    inTime: Date;
    outTime: Date;
    totalDuration: number; // in hours
  }>;
  
  // Leave Integration
  leaveDayStatuses: number[];
  leaveDayDuration: number;
  isFirstHalfLeave: boolean;
  leaveDetails: Array<{
    leaveTypeId: mongoose.Types.ObjectId;
    duration: number;
  }>;
  
  // Status Flags
  isInMissing: boolean;
  isArrivedLate: boolean;
  lateArrivalDifference: number; // in hours
  arrivalMessage?: string; // "0:10:17 late"
  isAnomalyDetected: boolean;
  isFullyWorkedOnWorkingRemotelyDay: boolean;
  hasLocation: boolean;
  isRemoteClockIn: boolean;
  
  // Regularization
  pendingRegularization: boolean;
  regularizationRequestId?: mongoose.Types.ObjectId;
  systemGenerated: boolean;
  
  // Penalties & Deductions
  deductionSource: string[];
  penaltyCauseNote?: string;
  penaltiesCount: number;
  
  // Metadata
  totalTimeEntries: number;
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSummarySchema = new Schema<IAttendanceSummary>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      index: true,
    },
    attendanceDate: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    shiftId: {
      type: Schema.Types.ObjectId,
      ref: 'Shift',
    },
    shiftPolicyName: {
      type: String,
      trim: true,
    },
    shiftStartTime: {
      type: Date,
    },
    shiftEndTime: {
      type: Date,
    },
    shiftSlotStartTime: {
      type: Date,
    },
    shiftSlotEndTime: {
      type: Date,
    },
    shiftDuration: {
      type: Number,
      default: 0,
    },
    shiftEffectiveDuration: {
      type: Number,
      default: 0,
    },
    shiftBreakDuration: {
      type: Number,
      default: 0,
    },
    halfDayDuration: {
      type: Number,
      default: 0,
    },
    dynamicShiftTimings: {
      type: Boolean,
      default: false,
    },
    isAutoAssignedShift: {
      type: Boolean,
      default: false,
    },
    dayType: {
      type: Number,
      default: 0, // 0 = working day, 1 = holiday, 2 = weekend
    },
    attendanceDayStatus: {
      type: Number,
      default: 2, // 1 = present, 2 = absent, 3 = half-day
    },
    firstLogOfTheDay: {
      type: Date,
    },
    firstInOfTheDay: {
      type: Date,
    },
    lastLogOfTheDay: {
      type: Date,
    },
    lastOutOfTheDay: {
      type: Date,
    },
    arrivalTime: {
      type: Date,
    },
    clockOutTime: {
      type: Date,
    },
    totalEffectiveHours: {
      type: Number,
      default: 0,
    },
    effectiveHoursInHHMM: {
      type: String,
      default: '0h 0m',
    },
    totalGrossHours: {
      type: Number,
      default: 0,
    },
    grossHoursInHHMM: {
      type: String,
      default: '0h 0m',
    },
    totalBreakDuration: {
      type: Number,
      default: 0,
    },
    breakDurationInHHMM: {
      type: String,
      default: '0:00',
    },
    validInOutPairs: [
      {
        inTime: {
          type: Date,
          required: true,
        },
        outTime: {
          type: Date,
          required: true,
        },
        totalDuration: {
          type: Number,
          required: true,
        },
      },
    ],
    leaveDayStatuses: [{
      type: Number,
    }],
    leaveDayDuration: {
      type: Number,
      default: 0,
    },
    isFirstHalfLeave: {
      type: Boolean,
      default: false,
    },
    leaveDetails: [
      {
        leaveTypeId: {
          type: Schema.Types.ObjectId,
          ref: 'LeaveType',
        },
        duration: {
          type: Number,
        },
      },
    ],
    isInMissing: {
      type: Boolean,
      default: false,
    },
    isArrivedLate: {
      type: Boolean,
      default: false,
    },
    lateArrivalDifference: {
      type: Number,
      default: 0,
    },
    arrivalMessage: {
      type: String,
      trim: true,
    },
    isAnomalyDetected: {
      type: Boolean,
      default: false,
    },
    isFullyWorkedOnWorkingRemotelyDay: {
      type: Boolean,
      default: false,
    },
    hasLocation: {
      type: Boolean,
      default: false,
    },
    isRemoteClockIn: {
      type: Boolean,
      default: false,
    },
    pendingRegularization: {
      type: Boolean,
      default: false,
    },
    regularizationRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'RegularizationRequest',
    },
    systemGenerated: {
      type: Boolean,
      default: false,
    },
    deductionSource: [{
      type: String,
    }],
    penaltyCauseNote: {
      type: String,
      trim: true,
    },
    penaltiesCount: {
      type: Number,
      default: 0,
    },
    totalTimeEntries: {
      type: Number,
      default: 0,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes
attendanceSummarySchema.index({ employeeId: 1, attendanceDate: -1 }, { unique: true });
attendanceSummarySchema.index({ attendanceDate: 1, attendanceDayStatus: 1 });
attendanceSummarySchema.index({ employeeId: 1, pendingRegularization: 1 });

const AttendanceSummary = mongoose.model<IAttendanceSummary>(
  'AttendanceSummary',
  attendanceSummarySchema
);

export default AttendanceSummary;

