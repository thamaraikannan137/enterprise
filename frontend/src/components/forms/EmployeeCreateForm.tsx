import { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MuiButton } from '../common';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { JobInfoTab } from './tabs/JobInfoTab';
import type { CreateEmployeeWithDetailsInput } from '../../types/employeeRelated';

// Extended validation schema with all fields
const employeeCreateSchema = z.object({
  // Personal Information
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  middle_name: z.string().max(100, 'Middle name must be less than 100 characters').optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  mobile_number: z.string().min(1, 'Mobile number is required').max(20, 'Mobile number must be less than 20 characters'),
  profile_photo_path: z.string().max(500, 'Profile photo path must be less than 500 characters').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'terminated']).optional(),
  
  // Job Information
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters'),
  department: z.string().min(1, 'Department is required').max(100, 'Department must be less than 100 characters'),
  reporting_to: z.string().optional().or(z.literal('')),
  joining_date: z.string().min(1, 'Joining date is required'),
  time_type: z.enum(['full_time', 'contract']),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
});
type EmployeeCreateFormInputs = z.infer<typeof employeeCreateSchema>;

interface EmployeeCreateFormProps {
  onSubmit: (data: CreateEmployeeWithDetailsInput) => Promise<void>;
  isLoading?: boolean;
}

const TABS = [
  { label: 'Personal Info', key: 'personal' },
  { label: 'Job Info', key: 'job' },
];

export const EmployeeCreateForm = ({ onSubmit, isLoading = false }: EmployeeCreateFormProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const uploadPhotoRef = useRef<(() => Promise<void>) | null>(null);

  const methods = useForm<EmployeeCreateFormInputs>({
    resolver: zodResolver(employeeCreateSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      email: '',
      mobile_number: '',
      profile_photo_path: '',
      status: 'active',
      designation: '',
      department: '',
      reporting_to: '',
      joining_date: '',
      time_type: 'full_time',
      location: '',
    },
  });

  const { handleSubmit, trigger, formState: { errors, isValid } } = methods;

  const getTabValidationFields = (tabIndex: number): string[] => {
    switch (tabIndex) {
      case 0: // Personal Info
        return ['first_name', 'last_name', 'date_of_birth', 'email', 'mobile_number'];
      case 1: // Job Info
        return ['designation', 'department', 'joining_date', 'time_type', 'location'];
      default:
        return [];
    }
  };

  const handleFormSubmit = async (data: EmployeeCreateFormInputs) => {
    try {
      console.log('Form submitted with data:', data);
      console.log('Form errors:', errors);
      console.log('Form is valid:', isValid);

      // Validate all required fields before proceeding
      const requiredFields = [
        'first_name', 'last_name', 'date_of_birth', 'email', 
        'mobile_number', 'designation', 'department', 'joining_date', 'time_type', 'location'
      ];
      
      const validationResult = await trigger(requiredFields as any);
      console.log('Validation result:', validationResult);
      
      if (!validationResult) {
        console.error('Form validation failed. Errors:', errors);
        // Navigate to first tab with errors
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0];
          if (['first_name', 'last_name', 'date_of_birth', 'email', 'mobile_number'].includes(firstErrorField)) {
            setActiveTab(0);
          } else if (['designation', 'department', 'joining_date', 'time_type', 'location'].includes(firstErrorField)) {
            setActiveTab(1);
          }
        }
        return; // Don't proceed if validation fails
      }

      // Prepare employee data (email and mobile_number will be used to create contact)
      const employeeData = {
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        email: data.email,
        mobile_number: data.mobile_number,
        designation: data.designation,
        department: data.department,
        joining_date: data.joining_date,
        time_type: data.time_type,
        location: data.location,
        ...(data.middle_name && { middle_name: data.middle_name }),
        ...(data.profile_photo_path && { profile_photo_path: data.profile_photo_path }),
        ...(data.status && { status: data.status }),
        ...(data.reporting_to && { reporting_to: data.reporting_to }),
      };

      // Prepare related data (contacts are created from email/mobile_number in EmployeeCreatePage)
      // Since we removed those tabs, we don't include optional related data here
      const relatedData: CreateEmployeeWithDetailsInput = {
        employee: employeeData,
      };
      
      console.log('Calling onSubmit with:', relatedData);
      await onSubmit(relatedData);
      console.log('onSubmit completed successfully');
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
      throw error;
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getTabValidationFields(activeTab);
    
    // If on Personal Info tab (tab 0), upload profile photo if selected
    if (activeTab === 0 && uploadPhotoRef.current) {
      try {
        await uploadPhotoRef.current();
      } catch (error: any) {
        console.error('Failed to upload profile photo - full error:', error);
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to upload profile photo. Please try again.';
        alert(errorMessage);
        // Don't proceed if upload fails
        return;
      }
    }
    
    if (fieldsToValidate.length > 0) {
      const isValidTab = await trigger(fieldsToValidate as any);
      
      if (isValidTab) {
        setActiveTab(Math.min(activeTab + 1, TABS.length - 1));
      }
    } else {
      setActiveTab(Math.min(activeTab + 1, TABS.length - 1));
    }
  };

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(handleFormSubmit, (errors) => {
          console.error('Form validation errors:', errors);
          // Navigate to first tab with errors
          const errorFields = Object.keys(errors);
          if (errorFields.length > 0) {
            const firstErrorField = errorFields[0];
            if (['first_name', 'last_name', 'date_of_birth', 'email', 'mobile_number'].includes(firstErrorField)) {
              setActiveTab(0);
            } else if (['designation', 'department', 'joining_date', 'time_type', 'location'].includes(firstErrorField)) {
              setActiveTab(1);
            }
          }
        })} 
        className="space-y-6"
      >
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {/* Step 1 */}
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    activeTab === 0 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : activeTab > 0
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}>
                    {activeTab > 0 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-semibold">1</span>
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    activeTab === 0 ? 'text-blue-600' : activeTab > 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    Personal Info
                  </span>
                </div>

                {/* Connector Line */}
                <div className={`w-16 h-0.5 ${
                  activeTab > 0 ? 'bg-green-500' : 'bg-gray-300'
                }`} />

                {/* Step 2 */}
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    activeTab === 1 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : activeTab < 1
                      ? 'bg-gray-100 border-gray-300 text-gray-500'
                      : 'bg-green-500 border-green-500 text-white'
                  }`}>
                    {activeTab > 1 ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-semibold">2</span>
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    activeTab === 1 ? 'text-blue-600' : activeTab < 1 ? 'text-gray-500' : 'text-green-600'
                  }`}>
                    Job Info
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[400px]">
            {activeTab === 0 && <PersonalInfoTab uploadPhotoRef={uploadPhotoRef} />}
            {activeTab === 1 && <JobInfoTab />}
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
              {activeTab === 0 && (
                <MuiButton
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                </MuiButton>
              )}
              {activeTab === 1 && (
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
