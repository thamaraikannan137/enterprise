import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  employee_code: string;
  // Primary Details
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name?: string;
  gender?: 'male' | 'female' | 'other';
  date_of_birth: Date;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  blood_group?: string;
  marriage_date?: Date;
  physically_handicapped?: boolean;
  actual_dob?: Date;
  birth_place?: string;
  nationality?: string;
  current_city?: string;
  current_state?: string;
  profile_photo_path?: string;
  
  // Contact Details
  work_email?: string;
  personal_email?: string;
  mobile_number?: string;
  work_number?: string;
  residence_number?: string;
  emergency_contact_number?: string;
  emergency_contact_name?: string;
  linkedin_id?: string;
  
  // Current Address
  current_address_line1?: string;
  current_address_line2?: string;
  current_city_address?: string;
  current_postal_code?: string;
  current_country?: string;
  
  // Permanent Address
  permanent_address_line1?: string;
  permanent_address_line2?: string;
  permanent_city?: string;
  permanent_postal_code?: string;
  permanent_country?: string;
  
  // Family Details
  father_dob?: Date;
  mother_dob?: Date;
  spouse_gender?: 'male' | 'female' | 'other';
  spouse_dob?: Date;
  kid1_name?: string;
  kid1_gender?: 'male' | 'female' | 'other';
  kid1_dob?: Date;
  kid2_name?: string;
  kid2_gender?: 'male' | 'female' | 'other';
  kid2_dob?: Date;
  
  // Previous Experience
  total_experience?: number; // in years
  relevant_experience?: number; // in years
  organization1_name?: string;
  organization1_start_date?: Date;
  organization1_end_date?: Date;
  organization1_designation?: string;
  organization1_reason_for_leaving?: string;
  organization2_name?: string;
  organization2_start_date?: Date;
  organization2_end_date?: Date;
  organization2_designation?: string;
  organization2_reason_for_leaving?: string;
  
  // Education Details
  // PG details
  pg_degree?: string;
  pg_specialization?: string;
  pg_grade?: string;
  pg_university?: string;
  pg_completion_year?: number;
  // Graduation details
  graduation_degree?: string;
  graduation_specialization?: string;
  graduation_grade?: string;
  graduation_college?: string;
  graduation_completion_year?: number;
  // Inter/12th details
  inter_grade?: string;
  inter_school?: string;
  inter_completion_year?: number;
  
  // Identity Details
  aadhar_number?: string;
  pan_number?: string;
  uan_number?: string;
  driving_license_number?: string;
  passport_name?: string;
  passport_number?: string;
  passport_valid_upto?: Date;
  visa_type?: string;
  
  // Skills & Interests
  professional_summary?: string;
  languages_read?: string[];
  languages_write?: string[];
  languages_speak?: string[];
  special_academic_achievements?: string;
  certifications_details?: string;
  hobbies?: string;
  interests?: string;
  professional_institution_member?: boolean;
  professional_institution_details?: string;
  social_organization_member?: boolean;
  social_organization_details?: string;
  insigma_hire_date?: Date;
  
  created_by?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employee_code: {
      type: String,
      required: [true, 'Employee code is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Employee code must be less than 50 characters'],
    },
    // Primary Details
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [100, 'First name must be less than 100 characters'],
    },
    middle_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Middle name must be less than 100 characters'],
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [100, 'Last name must be less than 100 characters'],
    },
    display_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name must be less than 100 characters'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    date_of_birth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    marital_status: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
    },
    blood_group: {
      type: String,
      trim: true,
      maxlength: [10, 'Blood group must be less than 10 characters'],
    },
    marriage_date: {
      type: Date,
    },
    physically_handicapped: {
      type: Boolean,
      default: false,
    },
    actual_dob: {
      type: Date,
    },
    birth_place: {
      type: String,
      trim: true,
      maxlength: [200, 'Birth place must be less than 200 characters'],
    },
    nationality: {
      type: String,
      trim: true,
      maxlength: [100, 'Nationality must be less than 100 characters'],
    },
    current_city: {
      type: String,
      trim: true,
      maxlength: [100, 'Current city must be less than 100 characters'],
    },
    current_state: {
      type: String,
      trim: true,
      maxlength: [100, 'Current state must be less than 100 characters'],
    },
    profile_photo_path: {
      type: String,
      trim: true,
      maxlength: [500, 'Profile photo path must be less than 500 characters'],
    },
    
    // Contact Details
    work_email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Work email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    personal_email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, 'Personal email must be less than 255 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    mobile_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Mobile number must be less than 20 characters'],
    },
    work_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Work number must be less than 20 characters'],
    },
    residence_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Residence number must be less than 20 characters'],
    },
    emergency_contact_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Emergency contact number must be less than 20 characters'],
    },
    emergency_contact_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Emergency contact name must be less than 100 characters'],
    },
    linkedin_id: {
      type: String,
      trim: true,
      maxlength: [255, 'LinkedIn ID must be less than 255 characters'],
    },
    
    // Current Address
    current_address_line1: {
      type: String,
      trim: true,
      maxlength: [255, 'Current address line 1 must be less than 255 characters'],
    },
    current_address_line2: {
      type: String,
      trim: true,
      maxlength: [255, 'Current address line 2 must be less than 255 characters'],
    },
    current_city_address: {
      type: String,
      trim: true,
      maxlength: [100, 'Current city must be less than 100 characters'],
    },
    current_postal_code: {
      type: String,
      trim: true,
      maxlength: [20, 'Current postal code must be less than 20 characters'],
    },
    current_country: {
      type: String,
      trim: true,
      maxlength: [100, 'Current country must be less than 100 characters'],
    },
    
    // Permanent Address
    permanent_address_line1: {
      type: String,
      trim: true,
      maxlength: [255, 'Permanent address line 1 must be less than 255 characters'],
    },
    permanent_address_line2: {
      type: String,
      trim: true,
      maxlength: [255, 'Permanent address line 2 must be less than 255 characters'],
    },
    permanent_city: {
      type: String,
      trim: true,
      maxlength: [100, 'Permanent city must be less than 100 characters'],
    },
    permanent_postal_code: {
      type: String,
      trim: true,
      maxlength: [20, 'Permanent postal code must be less than 20 characters'],
    },
    permanent_country: {
      type: String,
      trim: true,
      maxlength: [100, 'Permanent country must be less than 100 characters'],
    },
    
    // Family Details
    father_dob: {
      type: Date,
    },
    mother_dob: {
      type: Date,
    },
    spouse_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    spouse_dob: {
      type: Date,
    },
    kid1_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Kid 1 name must be less than 100 characters'],
    },
    kid1_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    kid1_dob: {
      type: Date,
    },
    kid2_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Kid 2 name must be less than 100 characters'],
    },
    kid2_gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    kid2_dob: {
      type: Date,
    },
    
    // Previous Experience
    total_experience: {
      type: Number,
      min: [0, 'Total experience must be positive'],
    },
    relevant_experience: {
      type: Number,
      min: [0, 'Relevant experience must be positive'],
    },
    organization1_name: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 1 name must be less than 255 characters'],
    },
    organization1_start_date: {
      type: Date,
    },
    organization1_end_date: {
      type: Date,
    },
    organization1_designation: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 1 designation must be less than 255 characters'],
    },
    organization1_reason_for_leaving: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason for leaving must be less than 500 characters'],
    },
    organization2_name: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 2 name must be less than 255 characters'],
    },
    organization2_start_date: {
      type: Date,
    },
    organization2_end_date: {
      type: Date,
    },
    organization2_designation: {
      type: String,
      trim: true,
      maxlength: [255, 'Organization 2 designation must be less than 255 characters'],
    },
    organization2_reason_for_leaving: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason for leaving must be less than 500 characters'],
    },
    
    // Education Details
    pg_degree: {
      type: String,
      trim: true,
      maxlength: [255, 'PG degree must be less than 255 characters'],
    },
    pg_specialization: {
      type: String,
      trim: true,
      maxlength: [255, 'PG specialization must be less than 255 characters'],
    },
    pg_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'PG grade must be less than 50 characters'],
    },
    pg_university: {
      type: String,
      trim: true,
      maxlength: [255, 'PG university must be less than 255 characters'],
    },
    pg_completion_year: {
      type: Number,
      min: [1900, 'PG completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'PG completion year must be realistic'],
    },
    graduation_degree: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation degree must be less than 255 characters'],
    },
    graduation_specialization: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation specialization must be less than 255 characters'],
    },
    graduation_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'Graduation grade must be less than 50 characters'],
    },
    graduation_college: {
      type: String,
      trim: true,
      maxlength: [255, 'Graduation college must be less than 255 characters'],
    },
    graduation_completion_year: {
      type: Number,
      min: [1900, 'Graduation completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Graduation completion year must be realistic'],
    },
    inter_grade: {
      type: String,
      trim: true,
      maxlength: [50, 'Inter grade must be less than 50 characters'],
    },
    inter_school: {
      type: String,
      trim: true,
      maxlength: [255, 'Inter school must be less than 255 characters'],
    },
    inter_completion_year: {
      type: Number,
      min: [1900, 'Inter completion year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Inter completion year must be realistic'],
    },
    
    // Identity Details
    aadhar_number: {
      type: String,
      trim: true,
      maxlength: [20, 'Aadhar number must be less than 20 characters'],
    },
    pan_number: {
      type: String,
      trim: true,
      maxlength: [20, 'PAN number must be less than 20 characters'],
    },
    uan_number: {
      type: String,
      trim: true,
      maxlength: [20, 'UAN number must be less than 20 characters'],
    },
    driving_license_number: {
      type: String,
      trim: true,
      maxlength: [50, 'Driving license number must be less than 50 characters'],
    },
    passport_name: {
      type: String,
      trim: true,
      maxlength: [100, 'Passport name must be less than 100 characters'],
    },
    passport_number: {
      type: String,
      trim: true,
      maxlength: [50, 'Passport number must be less than 50 characters'],
    },
    passport_valid_upto: {
      type: Date,
    },
    visa_type: {
      type: String,
      trim: true,
      maxlength: [100, 'Visa type must be less than 100 characters'],
    },
    
    // Skills & Interests
    professional_summary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Professional summary must be less than 2000 characters'],
    },
    languages_read: [{
      type: String,
      trim: true,
    }],
    languages_write: [{
      type: String,
      trim: true,
    }],
    languages_speak: [{
      type: String,
      trim: true,
    }],
    special_academic_achievements: {
      type: String,
      trim: true,
      maxlength: [1000, 'Special academic achievements must be less than 1000 characters'],
    },
    certifications_details: {
      type: String,
      trim: true,
      maxlength: [1000, 'Certifications details must be less than 1000 characters'],
    },
    hobbies: {
      type: String,
      trim: true,
      maxlength: [500, 'Hobbies must be less than 500 characters'],
    },
    interests: {
      type: String,
      trim: true,
      maxlength: [500, 'Interests must be less than 500 characters'],
    },
    professional_institution_member: {
      type: Boolean,
      default: false,
    },
    professional_institution_details: {
      type: String,
      trim: true,
      maxlength: [500, 'Professional institution details must be less than 500 characters'],
    },
    social_organization_member: {
      type: Boolean,
      default: false,
    },
    social_organization_details: {
      type: String,
      trim: true,
      maxlength: [500, 'Social organization details must be less than 500 characters'],
    },
    insigma_hire_date: {
      type: Date,
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
employeeSchema.index({ employee_code: 1 }, { unique: true });
employeeSchema.index({ first_name: 1, last_name: 1 });
employeeSchema.index({ work_email: 1 });
employeeSchema.index({ personal_email: 1 });
employeeSchema.index({ mobile_number: 1 });

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
