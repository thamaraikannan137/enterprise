import mongoose, { Document, Schema } from 'mongoose';

export interface IAllowanceType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  is_taxable: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const allowanceTypeSchema = new Schema<IAllowanceType>(
  {
    name: {
      type: String,
      required: [true, 'Allowance type name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    is_taxable: {
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
allowanceTypeSchema.index({ name: 1 }, { unique: true });
allowanceTypeSchema.index({ is_active: 1 });

const AllowanceType = mongoose.model<IAllowanceType>('AllowanceType', allowanceTypeSchema);

export default AllowanceType;
