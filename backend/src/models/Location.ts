import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  timezone: string;
  country: string;
  state: string;
  address: string;
  city: string;
  zip_code: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: [200, 'Name must be less than 200 characters'],
    },
    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
      trim: true,
      maxlength: [100, 'Timezone must be less than 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country must be less than 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State must be less than 100 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [500, 'Address must be less than 500 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City must be less than 100 characters'],
    },
    zip_code: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
      maxlength: [20, 'Zip code must be less than 20 characters'],
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
locationSchema.index({ name: 1 });
locationSchema.index({ country: 1, state: 1 });

const Location = mongoose.model<ILocation>('Location', locationSchema);

export default Location;






