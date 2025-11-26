import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeCompensation extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  basic_salary: number;
  ot_hourly_rate?: number;
  effective_from: Date;
  effective_to?: Date;
  is_current: boolean;
  approved_by?: mongoose.Types.ObjectId;
  approved_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeCompensationSchema = new Schema<IEmployeeCompensation>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    basic_salary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary must be positive'],
    },
    ot_hourly_rate: {
      type: Number,
      min: [0, 'OT hourly rate must be positive'],
    },
    effective_from: {
      type: Date,
      required: [true, 'Effective from date is required'],
    },
    effective_to: {
      type: Date,
    },
    is_current: {
      type: Boolean,
      default: true,
      required: true,
    },
    approved_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approved_at: {
      type: Date,
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
employeeCompensationSchema.index({ employee_id: 1 });
employeeCompensationSchema.index({ employee_id: 1, is_current: 1 });

const EmployeeCompensation = mongoose.model<IEmployeeCompensation>('EmployeeCompensation', employeeCompensationSchema);

export default EmployeeCompensation;
