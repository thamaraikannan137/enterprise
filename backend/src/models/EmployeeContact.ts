import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeContact extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  contact_type: 'primary' | 'secondary' | 'emergency';
  phone?: string;
  alternate_phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_current: boolean;
  valid_from: Date;
  valid_to?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeContactSchema = new Schema<IEmployeeContact>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    contact_type: {
      type: String,
      enum: ['primary', 'secondary', 'emergency'],
      required: [true, 'Contact type is required'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone must be less than 20 characters'],
    },
    alternate_phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Alternate phone must be less than 20 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    address_line1: {
      type: String,
      trim: true,
      maxlength: [255, 'Address line 1 must be less than 255 characters'],
    },
    address_line2: {
      type: String,
      trim: true,
      maxlength: [255, 'Address line 2 must be less than 255 characters'],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City must be less than 100 characters'],
    },
    postal_code: {
      type: String,
      trim: true,
      maxlength: [20, 'Postal code must be less than 20 characters'],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country must be less than 100 characters'],
    },
    is_current: {
      type: Boolean,
      default: true,
      required: true,
    },
    valid_from: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    valid_to: {
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
employeeContactSchema.index({ employee_id: 1 });
employeeContactSchema.index({ employee_id: 1, is_current: 1 });

const EmployeeContact = mongoose.model<IEmployeeContact>('EmployeeContact', employeeContactSchema);

export default EmployeeContact;
