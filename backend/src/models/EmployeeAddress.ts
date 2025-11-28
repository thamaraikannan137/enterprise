import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeAddress extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  home_town?: string;
  current_city?: string;
  current_state?: string;
  current_pincode?: string;
  permanent_city?: string;
  permanent_state?: string;
  permanent_pincode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeAddressSchema = new Schema<IEmployeeAddress>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    home_town: {
      type: String,
      trim: true,
      maxlength: [100, 'Home town must be less than 100 characters'],
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
    current_pincode: {
      type: String,
      trim: true,
      maxlength: [20, 'Current pincode must be less than 20 characters'],
    },
    permanent_city: {
      type: String,
      trim: true,
      maxlength: [100, 'Permanent city must be less than 100 characters'],
    },
    permanent_state: {
      type: String,
      trim: true,
      maxlength: [100, 'Permanent state must be less than 100 characters'],
    },
    permanent_pincode: {
      type: String,
      trim: true,
      maxlength: [20, 'Permanent pincode must be less than 20 characters'],
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

employeeAddressSchema.index({ employee_id: 1 }, { unique: true });

const EmployeeAddress = mongoose.model<IEmployeeAddress>('EmployeeAddress', employeeAddressSchema);

export default EmployeeAddress;

