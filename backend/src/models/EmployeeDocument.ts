import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeDocument extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  document_type: 'passport' | 'certificate' | 'work_pass' | 'qualification' | 'other';
  document_name: string;
  file_path: string;
  issue_date?: Date;
  expiry_date?: Date;
  is_active: boolean;
  uploaded_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeDocumentSchema = new Schema<IEmployeeDocument>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    document_type: {
      type: String,
      enum: ['passport', 'certificate', 'work_pass', 'qualification', 'other'],
      required: [true, 'Document type is required'],
    },
    document_name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
      maxlength: [255, 'Document name must be less than 255 characters'],
    },
    file_path: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
      maxlength: [500, 'File path must be less than 500 characters'],
    },
    issue_date: {
      type: Date,
    },
    expiry_date: {
      type: Date,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    uploaded_at: {
      type: Date,
      default: Date.now,
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
employeeDocumentSchema.index({ employee_id: 1 });
employeeDocumentSchema.index({ employee_id: 1, document_type: 1 });
employeeDocumentSchema.index({ expiry_date: 1 });

const EmployeeDocument = mongoose.model<IEmployeeDocument>('EmployeeDocument', employeeDocumentSchema);

export default EmployeeDocument;
