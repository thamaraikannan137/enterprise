import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  table_name: string;
  record_id: string;
  action: 'insert' | 'update' | 'delete';
  old_values?: object;
  new_values?: object;
  changed_by: mongoose.Types.ObjectId;
  changed_at: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    table_name: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
      maxlength: [100, 'Table name must be less than 100 characters'],
    },
    record_id: {
      type: String,
      required: [true, 'Record ID is required'],
    },
    action: {
      type: String,
      enum: ['insert', 'update', 'delete'],
      required: [true, 'Action is required'],
    },
    old_values: {
      type: Schema.Types.Mixed,
    },
    new_values: {
      type: Schema.Types.Mixed,
    },
    changed_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Changed by is required'],
    },
    changed_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
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
auditLogSchema.index({ table_name: 1, record_id: 1 });
auditLogSchema.index({ changed_by: 1 });
auditLogSchema.index({ changed_at: -1 });
auditLogSchema.index({ table_name: 1, changed_at: -1 });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;
