import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeJobInfo extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  designation: string;
  department: string;
  reporting_to?: mongoose.Types.ObjectId;
  hire_date?: Date;
  joining_date?: Date;
  termination_date?: Date;
  status: 'active' | 'inactive' | 'terminated';
  time_type?: 'full_time' | 'contract';
  location?: string;
  legal_entity?: string;
  business_unit?: string;
  worker_type?: string;
  probation_policy?: string;
  notice_period?: string;
  secondary_job_titles?: string[];
  is_current: boolean;
  effective_from: Date;
  effective_to?: Date;
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const employeeJobInfoSchema = new Schema<IEmployeeJobInfo>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [100, 'Designation must be less than 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department must be less than 100 characters'],
    },
    reporting_to: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      validate: {
        validator: function(this: IEmployeeJobInfo, value: mongoose.Types.ObjectId | null) {
          if (!value) return true;
          // Prevent self-reference
          return !this.employee_id || !value.equals(this.employee_id);
        },
        message: 'Employee cannot report to themselves',
      },
    },
    hire_date: {
      type: Date,
    },
    joining_date: {
      type: Date,
    },
    termination_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
      required: true,
    },
    time_type: {
      type: String,
      enum: ['full_time', 'contract'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location must be less than 200 characters'],
    },
    legal_entity: {
      type: String,
      trim: true,
      maxlength: [100, 'Legal entity must be less than 100 characters'],
    },
    business_unit: {
      type: String,
      trim: true,
      maxlength: [100, 'Business unit must be less than 100 characters'],
    },
    worker_type: {
      type: String,
      trim: true,
      maxlength: [50, 'Worker type must be less than 50 characters'],
    },
    probation_policy: {
      type: String,
      trim: true,
      maxlength: [100, 'Probation policy must be less than 100 characters'],
    },
    notice_period: {
      type: String,
      trim: true,
      maxlength: [100, 'Notice period must be less than 100 characters'],
    },
    secondary_job_titles: [{
      type: String,
      trim: true,
      maxlength: [100, 'Secondary job title must be less than 100 characters'],
    }],
    is_current: {
      type: Boolean,
      default: true,
      required: true,
    },
    effective_from: {
      type: Date,
      required: [true, 'Effective from date is required'],
      default: Date.now,
    },
    effective_to: {
      type: Date,
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
employeeJobInfoSchema.index({ employee_id: 1 });
employeeJobInfoSchema.index({ employee_id: 1, is_current: 1 });
employeeJobInfoSchema.index({ designation: 1 });
employeeJobInfoSchema.index({ department: 1 });
employeeJobInfoSchema.index({ status: 1 });
employeeJobInfoSchema.index({ reporting_to: 1 });

const EmployeeJobInfo = mongoose.model<IEmployeeJobInfo>('EmployeeJobInfo', employeeJobInfoSchema);

export default EmployeeJobInfo;





