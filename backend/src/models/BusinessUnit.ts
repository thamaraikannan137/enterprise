import mongoose, { Document, Schema } from 'mongoose';

export interface IBusinessUnit extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessUnitSchema = new Schema<IBusinessUnit>(
  {
    name: {
      type: String,
      required: [true, 'Business unit name is required'],
      trim: true,
      maxlength: [200, 'Name must be less than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be less than 1000 characters'],
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
businessUnitSchema.index({ name: 1 });

const BusinessUnit = mongoose.model<IBusinessUnit>('BusinessUnit', businessUnitSchema);

export default BusinessUnit;

