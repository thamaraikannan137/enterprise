import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeSkills extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  professional_summary?: string;
  languages_read?: string[];
  languages_write?: string[];
  languages_speak?: string[];
  special_academic_achievements?: string;
  certifications_details?: string;
  hobbies?: string;
  interests?: string;
  professional_institution_member?: boolean;
  professional_institution_details?: string;
  social_organization_member?: boolean;
  social_organization_details?: string;
  insigma_hire_date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSkillsSchema = new Schema<IEmployeeSkills>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    professional_summary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Professional summary must be less than 2000 characters'],
    },
    languages_read: [{
      type: String,
      trim: true,
    }],
    languages_write: [{
      type: String,
      trim: true,
    }],
    languages_speak: [{
      type: String,
      trim: true,
    }],
    special_academic_achievements: {
      type: String,
      trim: true,
      maxlength: [1000, 'Special academic achievements must be less than 1000 characters'],
    },
    certifications_details: {
      type: String,
      trim: true,
      maxlength: [1000, 'Certifications details must be less than 1000 characters'],
    },
    hobbies: {
      type: String,
      trim: true,
      maxlength: [500, 'Hobbies must be less than 500 characters'],
    },
    interests: {
      type: String,
      trim: true,
      maxlength: [500, 'Interests must be less than 500 characters'],
    },
    professional_institution_member: {
      type: Boolean,
      default: false,
    },
    professional_institution_details: {
      type: String,
      trim: true,
      maxlength: [500, 'Professional institution details must be less than 500 characters'],
    },
    social_organization_member: {
      type: Boolean,
      default: false,
    },
    social_organization_details: {
      type: String,
      trim: true,
      maxlength: [500, 'Social organization details must be less than 500 characters'],
    },
    insigma_hire_date: {
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

employeeSkillsSchema.index({ employee_id: 1 }, { unique: true });

const EmployeeSkills = mongoose.model<IEmployeeSkills>('EmployeeSkills', employeeSkillsSchema);

export default EmployeeSkills;

