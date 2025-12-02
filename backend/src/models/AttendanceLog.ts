import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceLog extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  // Punch Details
  punchType: 'web' | 'gps' | 'biometric';
  event: 'IN' | 'OUT';
  timestamp: Date;
  actualTimestamp: Date; // Original timestamp
  adjustedTimestamp?: Date; // If manually adjusted
  
  // Punch Status
  originalPunchStatus: number; // 0 = IN, 1 = OUT
  modifiedPunchStatus?: number; // If changed
  punchStatus: number; // Final status (0 = IN, 1 = OUT)
  
  // Location Data
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  locationAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    countryCode: string;
    zip: string;
    freeFormAddress?: string;
  };
  hasAddress: boolean;
  premiseId?: mongoose.Types.ObjectId; // Reference to Location
  premiseName?: string;
  
  // Source & Validation
  attendanceLogSource: number; // 0 = biometric, 1 = web, 2 = GPS
  attendanceLogSourceIdentifier?: string;
  ipAddress?: string;
  isRemoteClockIn: boolean;
  
  // Adjustment Flags
  isAdjusted: boolean;
  isDeleted: boolean;
  isManuallyAdded: boolean;
  manualClockinType: number; // 0 = normal, 1 = manual, 2 = adjustment
  pairSubSequentLogs: boolean; // For biometric corrections
  
  // Metadata
  note?: string;
  attachmentId?: mongoose.Types.ObjectId;
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceLogSchema = new Schema<IAttendanceLog>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      index: true,
    },
    punchType: {
      type: String,
      enum: ['web', 'gps', 'biometric'],
      required: [true, 'Punch type is required'],
    },
    event: {
      type: String,
      enum: ['IN', 'OUT'],
      required: [true, 'Event type is required'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      index: true,
    },
    actualTimestamp: {
      type: Date,
      required: [true, 'Actual timestamp is required'],
    },
    adjustedTimestamp: {
      type: Date,
    },
    originalPunchStatus: {
      type: Number,
      required: true,
      enum: [0, 1], // 0 = IN, 1 = OUT
    },
    modifiedPunchStatus: {
      type: Number,
      enum: [0, 1],
    },
    punchStatus: {
      type: Number,
      required: true,
      enum: [0, 1], // 0 = IN, 1 = OUT
    },
    geoLocation: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    locationAddress: {
      addressLine1: {
        type: String,
        trim: true,
      },
      addressLine2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      countryCode: {
        type: String,
        trim: true,
      },
      zip: {
        type: String,
        trim: true,
      },
      freeFormAddress: {
        type: String,
        trim: true,
      },
    },
    hasAddress: {
      type: Boolean,
      default: false,
    },
    premiseId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    premiseName: {
      type: String,
      trim: true,
    },
    attendanceLogSource: {
      type: Number,
      required: true,
      enum: [0, 1, 2], // 0 = biometric, 1 = web, 2 = GPS
    },
    attendanceLogSourceIdentifier: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    isRemoteClockIn: {
      type: Boolean,
      default: false,
    },
    isAdjusted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isManuallyAdded: {
      type: Boolean,
      default: false,
    },
    manualClockinType: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], // 0 = normal, 1 = manual, 2 = adjustment
    },
    pairSubSequentLogs: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note must be less than 500 characters'],
    },
    attachmentId: {
      type: Schema.Types.ObjectId,
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
attendanceLogSchema.index({ employeeId: 1, timestamp: -1 });
attendanceLogSchema.index({ employeeId: 1, createdAt: -1 });
attendanceLogSchema.index({ timestamp: 1 });

const AttendanceLog = mongoose.model<IAttendanceLog>('AttendanceLog', attendanceLogSchema);

export default AttendanceLog;

