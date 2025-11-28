import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeContact extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  contact_type: 'primary' | 'secondary' | 'emergency' | 'work' | 'personal' | 'emergency_contact';
  phone?: string;
  alternate_phone?: string;
  email?: string;
  work_email?: string;
  personal_email?: string;
  work_number?: string;
  residence_number?: string;
  emergency_contact_number?: string;
  emergency_contact_name?: string;
  linkedin_id?: string;
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
      enum: ['primary', 'secondary', 'emergency', 'work', 'personal', 'emergency_contact'],
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
    work_email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Work email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    personal_email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Personal email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    work_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Work number must be less than 20 characters'],
    },
    residence_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Residence number must be less than 20 characters'],
    },
    emergency_contact_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Emergency contact number must be less than 20 characters'],
    },
    emergency_contact_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Emergency contact name must be less than 100 characters'],
    },
    linkedin_id: {
      type: String,
      trim: true,
      maxlength: [255, 'LinkedIn ID must be less than 255 characters'],
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
