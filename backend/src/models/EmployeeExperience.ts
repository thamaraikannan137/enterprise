import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeExperience extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  total_experience?: number; // in years
  relevant_experience?: number; // in years
  organization1_name?: string;
  organization1_start_date?: Date;
  organization1_end_date?: Date;
  organization1_designation?: string;
  organization1_reason_for_leaving?: string;
  organization2_name?: string;
  organization2_start_date?: Date;
  organization2_end_date?: Date;
  organization2_designation?: string;
  organization2_reason_for_leaving?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeExperienceSchema = new Schema<IEmployeeExperience>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    total_experience: {
      type: Number,
      min: [0, 'Total experience must be positive'],
    },
    relevant_experience: {
      type: Number,
      min: [0, 'Relevant experience must be positive'],
    },
    organization1_name: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 1 name must be less than 255 characters'],
    },
    organization1_start_date: {
      type: Date,
    },
    organization1_end_date: {
      type: Date,
    },
    organization1_designation: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 1 designation must be less than 255 characters'],
    },
    organization1_reason_for_leaving: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason for leaving must be less than 500 characters'],
    },
    organization2_name: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 2 name must be less than 255 characters'],
    },
    organization2_start_date: {
      type: Date,
    },
    organization2_end_date: {
      type: Date,
    },
    organization2_designation: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 2 designation must be less than 255 characters'],
    },
    organization2_reason_for_leaving: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason for leaving must be less than 500 characters'],
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

employeeExperienceSchema.index({ employee_id: 1 }, { unique: true });

const EmployeeExperience = mongoose.model<IEmployeeExperience>('EmployeeExperience', employeeExperienceSchema);

export default EmployeeExperience;

