import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeQualification extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  degree: string;
  major?: string;
  institution: string;
  completion_year: number;
  document_id?: mongoose.Types.ObjectId;
  verification_status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const employeeQualificationSchema = new Schema<IEmployeeQualification>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      maxlength: [255, 'Degree must be less than 255 characters'],
    },
    major: {
      type: String,
      trim: true,
      maxlength: [255, 'Major must be less than 255 characters'],
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
      maxlength: [255, 'Institution must be less than 255 characters'],
    },
    completion_year: {
      type: Number,
      required: [true, 'Completion year is required'],
      min: [1900, 'Completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Completion year must be realistic'],
    },
    document_id: {
      type: Schema.Types.ObjectId,
      ref: 'EmployeeDocument',
    },
    verification_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
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
employeeQualificationSchema.index({ employee_id: 1 });
employeeQualificationSchema.index({ verification_status: 1 });

const EmployeeQualification = mongoose.model<IEmployeeQualification>('EmployeeQualification', employeeQualificationSchema);

export default EmployeeQualification;
