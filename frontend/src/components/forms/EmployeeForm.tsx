import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MuiButton, MuiInput, FileUpload } from '../common';
import { useEmployeeList } from '../../hooks/useEmployeeList';
import { employeeService } from '../../services/employeeService';
import { getImageUrl } from '../../utils/imageUtils';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import type {
  Employee,
  CreateEmployeeInput,
  EmployeeGender,
  EmployeeMaritalStatus,
  EmployeeStatus,
} from '../../types/employee';

// Define validation schema matching backend validation
const employeeSchema = z.object({
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
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters').optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required').max(100, 'Department must be less than 100 characters').optional().or(z.literal('')),
  reporting_to: z.string().optional().or(z.literal('')),
  hire_date: z.string().min(1, 'Hire date is required'),
  termination_date: z.string().optional().or(z.literal('')),
});

type EmployeeFormInputs = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  defaultValues?: Partial<EmployeeFormInputs>;
  onSubmit: (data: CreateEmployeeInput) => Promise<void>;
  isEdit?: boolean;
}

export const EmployeeForm = ({ defaultValues, onSubmit, isEdit = false }: EmployeeFormProps) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { employees: managerOptions, loading: managersLoading } = useEmployeeList({
    status: 'active',
    limit: 100,
    excludeId: isEdit && defaultValues ? undefined : undefined, // Could exclude current employee if editing
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormInputs>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues || {
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
    },
  });

  const profilePhotoPath = watch('profile_photo_path');
  
  // Convert relative path to full URL for display
  const profilePhotoUrl = useMemo(() => {
    if (!profilePhotoPath) return undefined;
    return getImageUrl(profilePhotoPath);
  }, [profilePhotoPath]);

  const handleFormSubmit = async (data: EmployeeFormInputs) => {
    // Clean up empty strings to undefined
    const cleanedData: CreateEmployeeInput = {
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      nationality: data.nationality,
      marital_status: data.marital_status,
      hire_date: data.hire_date,
      ...(data.middle_name && { middle_name: data.middle_name }),
      ...(data.profile_photo_path && { profile_photo_path: data.profile_photo_path }),
      ...(data.status && { status: data.status }),
      ...(data.designation && { designation: data.designation }),
      ...(data.department && { department: data.department }),
      ...(data.reporting_to && { reporting_to: data.reporting_to }),
      ...(data.termination_date && { termination_date: data.termination_date }),
    };
    
    await onSubmit(cleanedData);
    if (!isEdit) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">
        {isEdit ? 'Edit Employee' : 'Create New Employee'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <MuiInput
          {...register('first_name')}
          type="text"
          label="First Name"
          placeholder="Enter first name"
          error={errors.first_name?.message}
          required
        />

        {/* Middle Name */}
        <MuiInput
          {...register('middle_name')}
          type="text"
          label="Middle Name"
          placeholder="Enter middle name (optional)"
          error={errors.middle_name?.message}
        />

        {/* Last Name */}
        <MuiInput
          {...register('last_name')}
          type="text"
          label="Last Name"
          placeholder="Enter last name"
          error={errors.last_name?.message}
          required
        />

        {/* Date of Birth */}
        <MuiInput
          {...register('date_of_birth')}
          type="date"
          label="Date of Birth"
          error={errors.date_of_birth?.message}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Nationality */}
        <MuiInput
          {...register('nationality')}
          type="text"
          label="Nationality"
          placeholder="Enter nationality"
          error={errors.nationality?.message}
          required
        />

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <Controller
            name="marital_status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            )}
          />
          {errors.marital_status && (
            <p className="mt-1 text-sm text-red-600">{errors.marital_status.message}</p>
          )}
        </div>

        {/* Designation */}
        {isEdit && (
          <MuiInput
            {...register('designation')}
            type="text"
            label="Designation"
            placeholder="Enter designation"
            error={errors.designation?.message}
          />
        )}

        {/* Department */}
        {isEdit && (
          <MuiInput
            {...register('department')}
            type="text"
            label="Department"
            placeholder="Enter department"
            error={errors.department?.message}
          />
        )}

        {/* Reporting To */}
        {isEdit && (
          <div className="md:col-span-2">
            <FormControl fullWidth>
              <InputLabel shrink>Reporting To (Manager)</InputLabel>
              <Controller
                name="reporting_to"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    value={field.value || ''}
                    className="mt-2"
                    disabled={managersLoading}
                    endAdornment={
                      managersLoading ? (
                        <CircularProgress size={20} className="mr-2" />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em className="text-gray-400">No Manager (Top Level)</em>
                    </MenuItem>
                    {managerOptions.map((manager) => {
                      const fullName = `${manager.first_name} ${manager.last_name}`;
                      const designation = (manager as any).designation || '';
                      const displayText = `${fullName}${designation ? ` (${designation})` : ''} - ${manager.employee_code}`;
                      return (
                        <MenuItem key={manager.id} value={manager.id}>
                          {displayText}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
            </FormControl>
          </div>
        )}

        {/* Hire Date */}
        <MuiInput
          {...register('hire_date')}
          type="date"
          label="Hire Date"
          error={errors.hire_date?.message}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Termination Date */}
        <MuiInput
          {...register('termination_date')}
          type="date"
          label="Termination Date (optional)"
          error={errors.termination_date?.message}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Status (only show in edit mode) */}
        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        )}

        {/* Profile Photo Upload */}
        <div className="md:col-span-2">
          <FileUpload
            label="Profile Photo (optional)"
            accept="image/*"
            maxSize={5}
            value={profilePhotoUrl || profilePhotoPath || undefined}
            onChange={(file, previewUrl) => {
              if (!file) {
                setValue('profile_photo_path', '', { shouldValidate: true });
              }
            }}
            onUpload={async (file) => {
              setUploadingPhoto(true);
              try {
                const filePath = await employeeService.uploadProfilePhoto(file);
                setValue('profile_photo_path', filePath, { shouldValidate: true });
                return filePath;
              } catch (error) {
                console.error('Profile photo upload failed:', error);
                throw error;
              } finally {
                setUploadingPhoto(false);
              }
            }}
            error={errors.profile_photo_path?.message}
            disabled={uploadingPhoto}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <MuiButton
          type="submit"
          className="flex-1"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEdit ? 'Update Employee' : 'Create Employee'}
        </MuiButton>
        <MuiButton
          type="button"
          variant="outlined"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </MuiButton>
      </div>
    </form>
  );
};

