import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeCertification extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  certification_name: string;
  certification_type: 'new' | 'renewal';
  issue_date: Date;
  expiry_date?: Date;
  ownership: 'company' | 'employee';
  document_id?: mongoose.Types.ObjectId;
  is_active: boolean;
  reminder_sent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeCertificationSchema = new Schema<IEmployeeCertification>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    certification_name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
      maxlength: [255, 'Certification name must be less than 255 characters'],
    },
    certification_type: {
      type: String,
      enum: ['new', 'renewal'],
      required: [true, 'Certification type is required'],
    },
    issue_date: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    expiry_date: {
      type: Date,
    },
    ownership: {
      type: String,
      enum: ['company', 'employee'],
      required: [true, 'Ownership is required'],
    },
    document_id: {
      type: Schema.Types.ObjectId,
      ref: 'EmployeeDocument',
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    reminder_sent: {
      type: Boolean,
      default: false,
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
employeeCertificationSchema.index({ employee_id: 1 });
employeeCertificationSchema.index({ expiry_date: 1 });
employeeCertificationSchema.index({ employee_id: 1, is_active: 1 });

const EmployeeCertification = mongoose.model<IEmployeeCertification>('EmployeeCertification', employeeCertificationSchema);

export default EmployeeCertification;
