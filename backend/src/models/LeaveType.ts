import mongoose, { Document, Schema } from 'mongoose';

export interface ILeaveType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  max_days_per_year: number;
  is_paid: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leaveTypeSchema = new Schema<ILeaveType>(
  {
    name: {
      type: String,
      required: [true, 'Leave type name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    max_days_per_year: {
      type: Number,
      required: [true, 'Max days per year is required'],
      min: [0, 'Max days per year must be positive'],
    },
    is_paid: {
      type: Boolean,
      default: true,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
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
leaveTypeSchema.index({ name: 1 }, { unique: true });
leaveTypeSchema.index({ is_active: 1 });

const LeaveType = mongoose.model<ILeaveType>('LeaveType', leaveTypeSchema);

export default LeaveType;
