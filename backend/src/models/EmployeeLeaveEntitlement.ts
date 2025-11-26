import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeLeaveEntitlement extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  leave_type_id: mongoose.Types.ObjectId;
  entitled_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const employeeLeaveEntitlementSchema = new Schema<IEmployeeLeaveEntitlement>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    leave_type_id: {
      type: Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: [true, 'Leave type ID is required'],
    },
    entitled_days: {
      type: Number,
      required: [true, 'Entitled days is required'],
      min: [0, 'Entitled days must be positive'],
    },
    used_days: {
      type: Number,
      default: 0,
      required: true,
      min: [0, 'Used days must be positive'],
    },
    remaining_days: {
      type: Number,
      required: [true, 'Remaining days is required'],
      min: [0, 'Remaining days must be positive'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be after 2000'],
      max: [2100, 'Year must be before 2100'],
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
employeeLeaveEntitlementSchema.index({ employee_id: 1 });
employeeLeaveEntitlementSchema.index({ leave_type_id: 1 });
employeeLeaveEntitlementSchema.index({ employee_id: 1, leave_type_id: 1, year: 1 }, { unique: true });

const EmployeeLeaveEntitlement = mongoose.model<IEmployeeLeaveEntitlement>('EmployeeLeaveEntitlement', employeeLeaveEntitlementSchema);

export default EmployeeLeaveEntitlement;
