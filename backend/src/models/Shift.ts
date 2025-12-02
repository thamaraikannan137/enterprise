import mongoose, { Document, Schema } from 'mongoose';

export interface IShift extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  startTime: string; // "14:00" (HH:mm format)
  endTime: string; // "23:00"
  breakDuration: number; // in hours
  effectiveDuration: number; // in hours
  halfDayDuration: number; // in hours
  presentHours: number; // Minimum hours for "Present"
  halfDayHours: number; // Minimum hours for "Half Day"
  isActive: boolean;
  locationId?: mongoose.Types.ObjectId; // Optional: shift for specific location
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const shiftSchema = new Schema<IShift>(
  {
    name: {
      type: String,
      required: [true, 'Shift name is required'],
      trim: true,
      maxlength: [100, 'Shift name must be less than 100 characters'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
    },
    breakDuration: {
      type: Number,
      required: [true, 'Break duration is required'],
      min: [0, 'Break duration must be positive'],
    },
    effectiveDuration: {
      type: Number,
      required: [true, 'Effective duration is required'],
      min: [0, 'Effective duration must be positive'],
    },
    halfDayDuration: {
      type: Number,
      required: [true, 'Half day duration is required'],
      min: [0, 'Half day duration must be positive'],
    },
    presentHours: {
      type: Number,
      required: [true, 'Present hours is required'],
      min: [0, 'Present hours must be positive'],
    },
    halfDayHours: {
      type: Number,
      required: [true, 'Half day hours is required'],
      min: [0, 'Half day hours must be positive'],
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
shiftSchema.index({ isActive: 1 });
shiftSchema.index({ locationId: 1, isActive: 1 });

const Shift = mongoose.model<IShift>('Shift', shiftSchema);

export default Shift;

