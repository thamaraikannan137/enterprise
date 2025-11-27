import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { MuiCard, MuiButton, FileUpload } from '../../../common';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { updateEmployee, fetchEmployeeWithDetails } from '../../../../store/slices/employeeSlice';
import { employeeService } from '../../../../services/employeeService';
import { getImageUrl } from '../../../../utils/imageUtils';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface AboutTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

const personalInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  middle_name: z.string().max(100, 'Middle name must be less than 100 characters').optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.string().min(1, 'Nationality is required').max(100, 'Nationality must be less than 100 characters'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed']),
  profile_photo_path: z.string().optional().or(z.literal('')),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const AboutTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: AboutTabProps) => {
  const dispatch = useAppDispatch();
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const employeeId = employee?.id || employeeIdFromUrl;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: (employee.gender as 'male' | 'female' | 'other') || 'male',
      nationality: employee.nationality || '',
      marital_status: (employee.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
      profile_photo_path: employee.profile_photo_path || '',
    },
  });

  const profilePhotoPath = watch('profile_photo_path');

  useEffect(() => {
    reset({
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: (employee.gender as 'male' | 'female' | 'other') || 'male',
      nationality: employee.nationality || '',
      marital_status: (employee.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
      profile_photo_path: employee.profile_photo_path || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }

    // Prepare the update payload - ensure proper formatting
    const updateData: Record<string, any> = {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      // Keep date in YYYY-MM-DD format (backend's isValidDate accepts this)
      date_of_birth: data.date_of_birth || undefined,
      gender: data.gender,
      nationality: data.nationality.trim(),
      marital_status: data.marital_status,
    };

    // Only include middle_name if it's not empty
    if (data.middle_name && data.middle_name.trim()) {
      updateData.middle_name = data.middle_name.trim();
    }

    // Only include profile_photo_path if it's not empty
    if (data.profile_photo_path && data.profile_photo_path.trim()) {
      updateData.profile_photo_path = data.profile_photo_path.trim();
    }

    try {
      await dispatch(updateEmployee({
        id: employeeId,
        data: updateData,
      })).unwrap();
      
      if (employeeId) {
        await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      }
      
      showSuccess('Employee information saved successfully!');
      onEditModeChange(false);
    } catch (error: any) {
      console.error('Failed to update employee:', error);
      console.error('Error response:', error?.response?.data);
      console.log('Update data sent:', updateData);
      
      // Extract validation errors from response
      let errorMessage = 'Failed to save employee information. Please try again.';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // The backend sends validation errors as JSON string in message
        if (errorData.message) {
          try {
            // Try to parse if it's a JSON string (validation errors)
            const parsed = JSON.parse(errorData.message);
            if (Array.isArray(parsed)) {
              errorMessage = `Validation errors: ${parsed.join(', ')}`;
            } else {
              errorMessage = errorData.message;
            }
          } catch {
            // If not JSON, use the message directly
            errorMessage = errorData.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = `Validation errors: ${errorData.errors.join(', ')}`;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    reset({
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: (employee.gender as 'male' | 'female' | 'other') || 'male',
      nationality: employee.nationality || '',
      marital_status: (employee.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
      profile_photo_path: employee.profile_photo_path || '',
    });
    onEditModeChange(false);
  };

  return (
    <div className="space-y-6">
      {import.meta.env.DEV && <DevTool control={control} />}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid size={4}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="middle_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Middle Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={2}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Gender"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      SelectProps={{ native: true }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={2}>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nationality"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="marital_status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Marital Status"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      SelectProps={{ native: true }}
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={4}>
                <FileUpload
                  label="Profile Photo (optional)"
                  accept="image/*"
                  maxSize={5}
                  value={profilePhotoPath ? getImageUrl(profilePhotoPath) : undefined}
                  onChange={(file) => {
                    if (!file) {
                      setValue('profile_photo_path', '');
                    }
                  }}
                  onUpload={async (file) => {
                    try {
                      const filePath = await employeeService.uploadProfilePhoto(file);
                      setValue('profile_photo_path', filePath);
                      showSuccess('Profile photo uploaded successfully!');
                      return filePath;
                    } catch (error: any) {
                      console.error('Profile photo upload failed:', error);
                      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to upload profile photo. Please try again.';
                      showError(errorMessage);
                      throw error;
                    }
                  }}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>
            <div className="flex gap-2">
              <MuiButton
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Save
              </MuiButton>
              <MuiButton
                type="button"
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </MuiButton>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">First Name</div>
              <div className="text-base text-gray-900">{employee.first_name}</div>
            </div>
            {employee.middle_name && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Middle Name</div>
                <div className="text-base text-gray-900">{employee.middle_name}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Last Name</div>
              <div className="text-base text-gray-900">{employee.last_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Date of Birth</div>
              <div className="text-base text-gray-900">
                {new Date(employee.date_of_birth).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Gender</div>
              <div className="text-base text-gray-900 capitalize">{employee.gender}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Nationality</div>
              <div className="text-base text-gray-900">{employee.nationality}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Marital Status</div>
              <div className="text-base text-gray-900 capitalize">{employee.marital_status}</div>
            </div>
          </div>
        )}
      </MuiCard>
    </div>
  );
};
