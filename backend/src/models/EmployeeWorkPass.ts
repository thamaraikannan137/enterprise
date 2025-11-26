import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeWorkPass extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  status: 'new' | 'renewal' | 'cancelled';
  work_permit_number?: string;
  fin_number?: string;
  application_date?: Date;
  issuance_date?: Date;
  expiry_date?: Date;
  medical_date?: Date;
  is_current: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeWorkPassSchema = new Schema<IEmployeeWorkPass>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    status: {
      type: String,
      enum: ['new', 'renewal', 'cancelled'],
      required: [true, 'Status is required'],
    },
    work_permit_number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      maxlength: [50, 'Work permit number must be less than 50 characters'],
    },
    fin_number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      maxlength: [50, 'FIN number must be less than 50 characters'],
    },
    application_date: {
      type: Date,
    },
    issuance_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
    medical_date: {
      type: Date,
    },
    is_current: {
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
employeeWorkPassSchema.index({ employee_id: 1 });
employeeWorkPassSchema.index({ employee_id: 1, is_current: 1 });
employeeWorkPassSchema.index({ expiry_date: 1 });
employeeWorkPassSchema.index({ work_permit_number: 1 }, { unique: true, sparse: true });
employeeWorkPassSchema.index({ fin_number: 1 }, { unique: true, sparse: true });

const EmployeeWorkPass = mongoose.model<IEmployeeWorkPass>('EmployeeWorkPass', employeeWorkPassSchema);

export default EmployeeWorkPass;
