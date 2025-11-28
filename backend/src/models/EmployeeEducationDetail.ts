import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeEducationDetail extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  // PG details
  pg_degree?: string;
  pg_specialization?: string;
  pg_grade?: string;
  pg_university?: string;
  pg_completion_year?: number;
  // Graduation details
  graduation_degree?: string;
  graduation_specialization?: string;
  graduation_grade?: string;
  graduation_college?: string;
  graduation_completion_year?: number;
  // Inter/12th details
  inter_grade?: string;
  inter_school?: string;
  inter_completion_year?: number;
  createdAt: Date;
  updatedAt: Date;
}

const employeeEducationDetailSchema = new Schema<IEmployeeEducationDetail>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    pg_degree: {
      type: String,
      trim: true,
      maxlength: [255, 'PG degree must be less than 255 characters'],
    },
    pg_specialization: {
      type: String,
      trim: true,
      maxlength: [255, 'PG specialization must be less than 255 characters'],
    },
    pg_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'PG grade must be less than 50 characters'],
    },
    pg_university: {
      type: String,
      trim: true,
      maxlength: [255, 'PG university must be less than 255 characters'],
    },
    pg_completion_year: {
      type: Number,
      min: [1900, 'PG completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'PG completion year must be realistic'],
    },
    graduation_degree: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation degree must be less than 255 characters'],
    },
    graduation_specialization: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation specialization must be less than 255 characters'],
    },
    graduation_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'Graduation grade must be less than 50 characters'],
    },
    graduation_college: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation college must be less than 255 characters'],
    },
    graduation_completion_year: {
      type: Number,
      min: [1900, 'Graduation completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Graduation completion year must be realistic'],
    },
    inter_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'Inter grade must be less than 50 characters'],
    },
    inter_school: {
      type: String,
      trim: true,
      maxlength: [255, 'Inter school must be less than 255 characters'],
    },
    inter_completion_year: {
      type: Number,
      min: [1900, 'Inter completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Inter completion year must be realistic'],
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

employeeEducationDetailSchema.index({ employee_id: 1 }, { unique: true });

const EmployeeEducationDetail = mongoose.model<IEmployeeEducationDetail>('EmployeeEducationDetail', employeeEducationDetailSchema);

export default EmployeeEducationDetail;

