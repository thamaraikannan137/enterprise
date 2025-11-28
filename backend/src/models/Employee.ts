import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: Date;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  display_name?: string;
  blood_group?: string;
  marriage_date?: Date;
  physically_handicapped?: boolean;
  actual_dob?: Date;
  birth_place?: string;
  current_city?: string;
  current_state?: string;
  profile_photo_path?: string;
  status: 'active' | 'inactive' | 'terminated';
  designation: string;
  department: string;
  reporting_to?: mongoose.Types.ObjectId;
  hire_date?: Date;
  joining_date?: Date;
  time_type?: 'full_time' | 'contract';
  location?: string;
  termination_date?: Date;
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employee_code: {
      type: String,
      required: [true, 'Employee code is required'], // Auto-generated in service
      unique: true,
      trim: true,
      maxlength: [50, 'Employee code must be less than 50 characters'],
    },
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [100, 'First name must be less than 100 characters'],
    },
    middle_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Middle name must be less than 100 characters'],
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [100, 'Last name must be less than 100 characters'],
    },
    date_of_birth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    nationality: {
      type: String,
      trim: true,
      maxlength: [100, 'Nationality must be less than 100 characters'],
    },
    marital_status: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
    },
    display_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name must be less than 100 characters'],
    },
    blood_group: {
      type: String,
      trim: true,
      maxlength: [10, 'Blood group must be less than 10 characters'],
    },
    marriage_date: {
      type: Date,
    },
    physically_handicapped: {
      type: Boolean,
      default: false,
    },
    actual_dob: {
      type: Date,
    },
    birth_place: {
      type: String,
      trim: true,
      maxlength: [200, 'Birth place must be less than 200 characters'],
    },
    current_city: {
      type: String,
      trim: true,
      maxlength: [100, 'Current city must be less than 100 characters'],
    },
    current_state: {
      type: String,
      trim: true,
      maxlength: [100, 'Current state must be less than 100 characters'],
    },
    profile_photo_path: {
      type: String,
      trim: true,
      maxlength: [500, 'Profile photo path must be less than 500 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'terminated'],
      default: 'active',
      required: true,
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
        validator: function(this: IEmployee, value: mongoose.Types.ObjectId | null) {
          // Allow null (optional field)
          if (!value) return true;
          // Prevent self-reference
          return !this._id || !value.equals(this._id);
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
    time_type: {
      type: String,
      enum: ['full_time', 'contract'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location must be less than 200 characters'],
    },
    termination_date: {
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
employeeSchema.index({ employee_code: 1 }, { unique: true });
employeeSchema.index({ status: 1 });
employeeSchema.index({ first_name: 1, last_name: 1 });
employeeSchema.index({ designation: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ reporting_to: 1 });

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
