import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeFamily extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  father_dob?: Date;
  mother_dob?: Date;
  spouse_gender?: 'male' | 'female' | 'other';
  spouse_dob?: Date;
  kid1_name?: string;
  kid1_gender?: 'male' | 'female' | 'other';
  kid1_dob?: Date;
  kid2_name?: string;
  kid2_gender?: 'male' | 'female' | 'other';
  kid2_dob?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeFamilySchema = new Schema<IEmployeeFamily>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
      unique: true,
    },
    father_dob: {
      type: Date,
    },
    mother_dob: {
      type: Date,
    },
    spouse_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    spouse_dob: {
      type: Date,
    },
    kid1_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Kid 1 name must be less than 100 characters'],
    },
    kid1_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    kid1_dob: {
      type: Date,
    },
    kid2_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Kid 2 name must be less than 100 characters'],
    },
    kid2_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    kid2_dob: {
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

employeeFamilySchema.index({ employee_id: 1 }, { unique: true });

const EmployeeFamily = mongoose.model<IEmployeeFamily>('EmployeeFamily', employeeFamilySchema);

export default EmployeeFamily;

