import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeIdentity extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: Date;
  visa_type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeIdentitySchema = new Schema<IEmployeeIdentity>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    aadhar_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Aadhar number must be less than 20 characters'],
    },
    pan_number: {
      type: String,
      trim: true,
      maxlength: [20, 'PAN number must be less than 20 characters'],
    },
    uan_number: {
      type: String,
      trim: true,
      maxlength: [20, 'UAN number must be less than 20 characters'],
    },
    driving_license_number: {
      type: String,
      trim: true,
      maxlength: [50, 'Driving license number must be less than 50 characters'],
    },
    passport_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Passport name must be less than 100 characters'],
    },
    passport_number: {
      type: String,
      trim: true,
      maxlength: [50, 'Passport number must be less than 50 characters'],
    },
    passport_valid_upto: {
      type: Date,
    },
    visa_type: {
      type: String,
      trim: true,
      maxlength: [100, 'Visa type must be less than 100 characters'],
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

employeeIdentitySchema.index({ employee_id: 1 }, { unique: true });

const EmployeeIdentity = mongoose.model<IEmployeeIdentity>('EmployeeIdentity', employeeIdentitySchema);

export default EmployeeIdentity;

