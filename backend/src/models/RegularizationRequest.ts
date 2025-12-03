import mongoose, { Document, Schema } from 'mongoose';

export interface IRegularizationRequest extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  attendanceDate: Date;
  attendanceSummaryId?: mongoose.Types.ObjectId;
  reason: string;
  requestedChanges: Array<{
    type: 'add_punch' | 'modify_punch' | 'delete_punch' | 'adjust_time';
    logId?: mongoose.Types.ObjectId;
    newTimestamp?: Date;
    newPunchStatus?: number;
    note?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNote?: string;
  created_by: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const regularizationRequestSchema = new Schema<IRegularizationRequest>(
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
    attendanceSummaryId: {
      type: Schema.Types.ObjectId,
      ref: 'AttendanceSummary',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [1000, 'Reason must be less than 1000 characters'],
    },
    requestedChanges: [
      {
        type: {
          type: String,
          enum: ['add_punch', 'modify_punch', 'delete_punch', 'adjust_time'],
          required: true,
        },
        logId: {
          type: Schema.Types.ObjectId,
          ref: 'AttendanceLog',
        },
        newTimestamp: {
          type: Date,
        },
        newPunchStatus: {
          type: Number,
          enum: [0, 1], // 0 = IN, 1 = OUT
        },
        note: {
          type: String,
          trim: true,
          maxlength: [500, 'Note must be less than 500 characters'],
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review note must be less than 1000 characters'],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
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
regularizationRequestSchema.index({ employeeId: 1, attendanceDate: -1 });
regularizationRequestSchema.index({ status: 1, createdAt: -1 });
regularizationRequestSchema.index({ employeeId: 1, status: 1 });

const RegularizationRequest = mongoose.model<IRegularizationRequest>(
  'RegularizationRequest',
  regularizationRequestSchema
);

export default RegularizationRequest;


