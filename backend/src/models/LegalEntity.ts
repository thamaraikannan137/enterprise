import mongoose, { Document, Schema } from 'mongoose';

export interface ILegalEntity extends Document {
  _id: mongoose.Types.ObjectId;
  entity_name: string;
  legal_name: string;
  other_business_name?: string;
  company_identification_number?: string;
  federal_employer_id?: string;
  state_registration_number?: string;
  date_of_incorporation: Date;
  business_type: string;
  industry_type: string;
  nature_of_business_code?: string;
  currency: string;
  financial_year: string;
  // Contact Details
  website?: string;
  email?: string;
  phone?: string;
  // Registered Address
  street_1: string;
  street_2?: string;
  city: string;
  state: string;
  zip_code?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const legalEntitySchema = new Schema<ILegalEntity>(
  {
    entity_name: {
      type: String,
      required: [true, 'Entity name is required'],
      trim: true,
      maxlength: [200, 'Entity name must be less than 200 characters'],
    },
    legal_name: {
      type: String,
      required: [true, 'Legal name is required'],
      trim: true,
      maxlength: [200, 'Legal name must be less than 200 characters'],
    },
    other_business_name: {
      type: String,
      trim: true,
      maxlength: [200, 'Other business name must be less than 200 characters'],
    },
    company_identification_number: {
      type: String,
      trim: true,
      maxlength: [50, 'Company identification number must be less than 50 characters'],
    },
    federal_employer_id: {
      type: String,
      trim: true,
      maxlength: [50, 'Federal employer ID must be less than 50 characters'],
    },
    state_registration_number: {
      type: String,
      trim: true,
      maxlength: [50, 'State registration number must be less than 50 characters'],
    },
    date_of_incorporation: {
      type: Date,
      required: [true, 'Date of incorporation is required'],
    },
    business_type: {
      type: String,
      required: [true, 'Business type is required'],
      trim: true,
      maxlength: [100, 'Business type must be less than 100 characters'],
    },
    industry_type: {
      type: String,
      required: [true, 'Industry type is required'],
      trim: true,
      maxlength: [100, 'Industry type must be less than 100 characters'],
    },
    nature_of_business_code: {
      type: String,
      trim: true,
      maxlength: [200, 'Nature of business code must be less than 200 characters'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      maxlength: [50, 'Currency must be less than 50 characters'],
    },
    financial_year: {
      type: String,
      required: [true, 'Financial year is required'],
      trim: true,
      maxlength: [100, 'Financial year must be less than 100 characters'],
    },
    // Contact Details
    website: {
      type: String,
      trim: true,
      maxlength: [255, 'Website must be less than 255 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone must be less than 20 characters'],
    },
    // Registered Address
    street_1: {
      type: String,
      required: [true, 'Street address line 1 is required'],
      trim: true,
      maxlength: [255, 'Street address line 1 must be less than 255 characters'],
    },
    street_2: {
      type: String,
      trim: true,
      maxlength: [255, 'Street address line 2 must be less than 255 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City must be less than 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State must be less than 100 characters'],
    },
    zip_code: {
      type: String,
      trim: true,
      maxlength: [20, 'Zip code must be less than 20 characters'],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country must be less than 100 characters'],
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
legalEntitySchema.index({ entity_name: 1 });
legalEntitySchema.index({ legal_name: 1 });
legalEntitySchema.index({ company_identification_number: 1 });

const LegalEntity = mongoose.model<ILegalEntity>('LegalEntity', legalEntitySchema);

export default LegalEntity;






