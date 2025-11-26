import mongoose, { Document, Schema } from 'mongoose';

export interface IDeductionType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  is_mandatory: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deductionTypeSchema = new Schema<IDeductionType>(
  {
    name: {
      type: String,
      required: [true, 'Deduction type name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    is_mandatory: {
      type: Boolean,
      default: false,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
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
deductionTypeSchema.index({ name: 1 }, { unique: true });
deductionTypeSchema.index({ is_active: 1 });

const DeductionType = mongoose.model<IDeductionType>('DeductionType', deductionTypeSchema);

export default DeductionType;
