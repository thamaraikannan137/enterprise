import mongoose, { Document, Schema } from 'mongoose';

export interface IHolidayCalendar extends Document {
  _id: mongoose.Types.ObjectId;
  date: Date; // Date only
  name: string;
  type: 'National' | 'Regional' | 'Company';
  isActive: boolean;
  locationId?: mongoose.Types.ObjectId; // Optional: location-specific holiday
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const holidayCalendarSchema = new Schema<IHolidayCalendar>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true,
      maxlength: [100, 'Holiday name must be less than 100 characters'],
    },
    type: {
      type: String,
      enum: ['National', 'Regional', 'Company'],
      required: [true, 'Holiday type is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
holidayCalendarSchema.index({ date: 1 });
holidayCalendarSchema.index({ date: 1, locationId: 1 });

const HolidayCalendar = mongoose.model<IHolidayCalendar>('HolidayCalendar', holidayCalendarSchema);

export default HolidayCalendar;


