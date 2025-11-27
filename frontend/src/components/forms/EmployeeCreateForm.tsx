import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Tabs, Tab, LinearProgress } from '@mui/material';
import { MuiButton } from '../common';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { JobInfoTab } from './tabs/JobInfoTab';
import { ContactInfoTab } from './tabs/ContactInfoTab';
import { CompensationTab } from './tabs/CompensationTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { WorkPassTab } from './tabs/WorkPassTab';
import { QualificationsCertificationsTab } from './tabs/QualificationsCertificationsTab';
import type { CreateEmployeeWithDetailsInput } from '../../types/employeeRelated';

// Extended validation schema with all fields
const employeeCreateSchema = z.object({
  // Personal Information
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  middle_name: z.string().max(100, 'Middle name must be less than 100 characters').optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  nationality: z.string().min(1, 'Nationality is required').max(100, 'Nationality must be less than 100 characters'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed'], {
    required_error: 'Marital status is required',
  }),
  profile_photo_path: z.string().max(500, 'Profile photo path must be less than 500 characters').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'terminated']).optional(),
  
  // Job Information
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters'),
  department: z.string().min(1, 'Department is required').max(100, 'Department must be less than 100 characters'),
  reporting_to: z.string().optional().or(z.literal('')),
  hire_date: z.string().min(1, 'Hire date is required'),
  termination_date: z.string().optional().or(z.literal('')),

  // Contact Information (optional)
  contacts: z.array(z.object({
    contact_type: z.enum(['primary', 'secondary', 'emergency']),
    phone: z.string().optional(),
    alternate_phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    is_current: z.boolean().optional(),
    valid_from: z.string().optional(),
    valid_to: z.string().optional(),
  })).optional(),

  // Compensation (optional)
  compensation: z.object({
    basic_salary: z.number().min(0, 'Salary must be positive').optional(),
    ot_hourly_rate: z.number().min(0, 'OT rate must be positive').optional(),
    effective_from: z.string().optional(),
    effective_to: z.string().optional(),
  }).optional(),

  // Documents (optional)
  documents: z.array(z.object({
    document_type: z.enum(['passport', 'certificate', 'work_pass', 'qualification', 'other']),
    document_name: z.string().optional(),
    file_path: z.string().optional(),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
    is_active: z.boolean().optional(),
  })).optional(),

  // Work Pass (optional)
  workPass: z.object({
    status: z.enum(['new', 'renewal', 'cancelled']).optional(),
    work_permit_number: z.string().optional(),
    fin_number: z.string().optional(),
    application_date: z.string().optional(),
    issuance_date: z.string().optional(),
    expiry_date: z.string().optional(),
    medical_date: z.string().optional(),
    is_current: z.boolean().optional(),
  }).optional(),

  // Qualifications (optional)
  qualifications: z.array(z.object({
    degree: z.string().optional(),
    major: z.string().optional(),
    institution: z.string().optional(),
    completion_year: z.number().optional(),
    verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
  })).optional(),

  // Certifications (optional)
  certifications: z.array(z.object({
    certification_name: z.string().optional(),
    certification_type: z.enum(['new', 'renewal']).optional(),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
    ownership: z.enum(['company', 'employee']).optional(),
    is_active: z.boolean().optional(),
  })).optional(),
});

type EmployeeCreateFormInputs = z.infer<typeof employeeCreateSchema>;

interface EmployeeCreateFormProps {
  onSubmit: (data: CreateEmployeeWithDetailsInput) => Promise<void>;
  isLoading?: boolean;
}

const TABS = [
  { label: 'Personal Info', key: 'personal' },
  { label: 'Job Info', key: 'job' },
  { label: 'Contact', key: 'contact' },
  { label: 'Compensation', key: 'compensation' },
  { label: 'Documents', key: 'documents' },
  { label: 'Work Pass', key: 'workPass' },
  { label: 'Qual & Cert', key: 'qualifications' },
];

export const EmployeeCreateForm = ({ onSubmit, isLoading = false }: EmployeeCreateFormProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabErrors, setTabErrors] = useState<Record<number, boolean>>({});

  const methods = useForm<EmployeeCreateFormInputs>({
    resolver: zodResolver(employeeCreateSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'male',
      nationality: '',
      marital_status: 'single',
      profile_photo_path: '',
      status: 'active',
      designation: '',
      department: '',
      reporting_to: '',
      hire_date: '',
      termination_date: '',
      contacts: [],
      compensation: undefined,
      documents: [],
      workPass: undefined,
      qualifications: [],
      certifications: [],
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const getTabValidationFields = (tabIndex: number): string[] => {
    switch (tabIndex) {
      case 0: // Personal Info
        return ['first_name', 'last_name', 'date_of_birth', 'gender', 'nationality', 'marital_status', 'hire_date'];
      case 1: // Job Info
        return ['designation', 'department', 'hire_date'];
      default:
        return []; // Other tabs are optional
    }
  };

  const handleTabChange = async (_event: React.SyntheticEvent, newValue: number) => {
    const fieldsToValidate = getTabValidationFields(activeTab);
    
    if (fieldsToValidate.length > 0) {
      const isValidTab = await trigger(fieldsToValidate as any);
      
      if (isValidTab) {
        setTabErrors(prev => ({ ...prev, [activeTab]: false }));
        setActiveTab(newValue);
      } else {
        setTabErrors(prev => ({ ...prev, [activeTab]: true }));
      }
    } else {
      setActiveTab(newValue);
    }
  };

  const handleFormSubmit = async (data: EmployeeCreateFormInputs) => {
    // Prepare employee data
    const employeeData = {
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      nationality: data.nationality,
      marital_status: data.marital_status,
      hire_date: data.hire_date,
      designation: data.designation,
      department: data.department,
      ...(data.middle_name && { middle_name: data.middle_name }),
      ...(data.profile_photo_path && { profile_photo_path: data.profile_photo_path }),
      ...(data.status && { status: data.status }),
      ...(data.reporting_to && { reporting_to: data.reporting_to }),
      ...(data.termination_date && { termination_date: data.termination_date }),
    };

    // Prepare related data
    const relatedData: CreateEmployeeWithDetailsInput = {
      employee: employeeData,
      ...(data.contacts && data.contacts.length > 0 && { contacts: data.contacts }),
      ...(data.compensation && { compensation: data.compensation }),
      ...(data.documents && data.documents.length > 0 && { documents: data.documents }),
      ...(data.workPass && { workPass: data.workPass }),
      ...(data.qualifications && data.qualifications.length > 0 && { qualifications: data.qualifications }),
      ...(data.certifications && data.certifications.length > 0 && { certifications: data.certifications }),
    };
    
    await onSubmit(relatedData);
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getTabValidationFields(activeTab);
    
    if (fieldsToValidate.length > 0) {
      const isValidTab = await trigger(fieldsToValidate as any);
      
      if (isValidTab) {
        setTabErrors(prev => ({ ...prev, [activeTab]: false }));
        setActiveTab(Math.min(activeTab + 1, TABS.length - 1));
      } else {
        setTabErrors(prev => ({ ...prev, [activeTab]: true }));
      }
    } else {
      setActiveTab(Math.min(activeTab + 1, TABS.length - 1));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {activeTab + 1} of {TABS.length}: {TABS[activeTab].label}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <LinearProgress
              variant="determinate"
              value={((activeTab + 1) / TABS.length) * 100}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </div>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: '#1976d2',
                  fontWeight: 600,
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#1976d2',
                  height: 3,
                },
              }}
            >
              {TABS.map((tab, index) => (
                <Tab
                  key={tab.key}
                  label={tab.label}
                  icon={tabErrors[index] ? <span className="text-red-500">●</span> : undefined}
                  iconPosition="end"
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <div className="p-6 min-h-[400px]">
            {activeTab === 0 && <PersonalInfoTab />}
            {activeTab === 1 && <JobInfoTab />}
            {activeTab === 2 && <ContactInfoTab />}
            {activeTab === 3 && <CompensationTab />}
            {activeTab === 4 && <DocumentsTab />}
            {activeTab === 5 && <WorkPassTab />}
            {activeTab === 6 && <QualificationsCertificationsTab />}
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              {activeTab > 0 && (
                <MuiButton
                  type="button"
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  Previous
                </MuiButton>
              )}
            </div>
            <div className="flex gap-3">
              {activeTab < TABS.length - 1 && (
                <MuiButton
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </MuiButton>
              )}
              {activeTab === TABS.length - 1 && (
                <MuiButton
                  type="submit"
                  variant="contained"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Create Employee
                </MuiButton>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
