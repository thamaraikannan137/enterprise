import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkPassDocument extends Document {
  _id: mongoose.Types.ObjectId;
  work_pass_id: mongoose.Types.ObjectId;
  document_id: mongoose.Types.ObjectId;
  document_category: 'application' | 'medical' | 'issuance' | 'appointment' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const workPassDocumentSchema = new Schema<IWorkPassDocument>(
  {
    work_pass_id: {
      type: Schema.Types.ObjectId,
      ref: 'EmployeeWorkPass',
      required: [true, 'Work pass ID is required'],
    },
    document_id: {
      type: Schema.Types.ObjectId,
      ref: 'EmployeeDocument',
      required: [true, 'Document ID is required'],
    },
    document_category: {
      type: String,
      enum: ['application', 'medical', 'issuance', 'appointment', 'other'],
      required: [true, 'Document category is required'],
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
workPassDocumentSchema.index({ work_pass_id: 1 });
workPassDocumentSchema.index({ document_id: 1 });

const WorkPassDocument = mongoose.model<IWorkPassDocument>('WorkPassDocument', workPassDocumentSchema);

export default WorkPassDocument;
