import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployeeDeduction extends Document {
  _id: mongoose.Types.ObjectId;
  employee_id: mongoose.Types.ObjectId;
  deduction_type_id: mongoose.Types.ObjectId;
  amount: number;
  effective_from: Date;
  effective_to?: Date;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeDeductionSchema = new Schema<IEmployeeDeduction>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    deduction_type_id: {
      type: Schema.Types.ObjectId,
      ref: 'DeductionType',
      required: [true, 'Deduction type ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    effective_from: {
      type: Date,
      required: [true, 'Effective from date is required'],
    },
    effective_to: {
      type: Date,
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
employeeDeductionSchema.index({ employee_id: 1 });
employeeDeductionSchema.index({ deduction_type_id: 1 });
employeeDeductionSchema.index({ employee_id: 1, is_active: 1 });

const EmployeeDeduction = mongoose.model<IEmployeeDeduction>('EmployeeDeduction', employeeDeductionSchema);

export default EmployeeDeduction;
