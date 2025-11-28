import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Grid } from '@mui/material';
import { useAppDispatch } from '../../../../../store';
import { updateEmployee, fetchEmployeeWithDetails } from '../../../../../store/slices/employeeSlice';
import { useToast } from '../../../../../contexts/ToastContext';
import { EditableCard } from './EditableCard';
import type { EmployeeWithDetails } from '../../../../../types/employee';

interface PrimaryDetailsSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const primaryDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  middle_name: z.string().max(100).optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(100),
  display_name: z.string().max(100).optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  blood_group: z.string().max(10).optional().or(z.literal('')),
  marriage_date: z.string().optional().or(z.literal('')),
  physically_handicapped: z.boolean().optional(),
  actual_dob: z.string().optional().or(z.literal('')),
  birth_place: z.string().max(200).optional().or(z.literal('')),
  nationality: z.string().max(100).optional().or(z.literal('')),
  current_city: z.string().max(100).optional().or(z.literal('')),
  current_state: z.string().max(100).optional().or(z.literal('')),
});

type PrimaryDetailsFormData = z.infer<typeof primaryDetailsSchema>;

export const PrimaryDetailsSection = ({ employee, employeeId }: PrimaryDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<PrimaryDetailsFormData>({
    resolver: zodResolver(primaryDetailsSchema),
    defaultValues: {
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      display_name: (employee as any).display_name || '',
      gender: (employee.gender as 'male' | 'female' | 'other') || 'male',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      marital_status: (employee.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
      blood_group: (employee as any).blood_group || '',
      marriage_date: (employee as any).marriage_date?.split('T')[0] || '',
      physically_handicapped: (employee as any).physically_handicapped || false,
      actual_dob: (employee as any).actual_dob?.split('T')[0] || '',
      birth_place: (employee as any).birth_place || '',
      nationality: employee.nationality || '',
      current_city: (employee as any).current_city || '',
      current_state: (employee as any).current_state || '',
    },
  });

  useEffect(() => {
    reset({
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      display_name: (employee as any).display_name || '',
      gender: (employee.gender as 'male' | 'female' | 'other') || 'male',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      marital_status: (employee.marital_status as 'single' | 'married' | 'divorced' | 'widowed') || 'single',
      blood_group: (employee as any).blood_group || '',
      marriage_date: (employee as any).marriage_date?.split('T')[0] || '',
      physically_handicapped: (employee as any).physically_handicapped || false,
      actual_dob: (employee as any).actual_dob?.split('T')[0] || '',
      birth_place: (employee as any).birth_place || '',
      nationality: employee.nationality || '',
      current_city: (employee as any).current_city || '',
      current_state: (employee as any).current_state || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: PrimaryDetailsFormData) => {
    try {
      const updateData: Record<string, any> = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        date_of_birth: data.date_of_birth || undefined,
        ...(data.middle_name && { middle_name: data.middle_name.trim() }),
        ...(data.display_name && { display_name: data.display_name.trim() }),
        ...(data.gender && { gender: data.gender }),
        ...(data.marital_status && { marital_status: data.marital_status }),
        ...(data.blood_group && { blood_group: data.blood_group.trim() }),
        ...(data.marriage_date && { marriage_date: data.marriage_date }),
        ...(data.physically_handicapped !== undefined && { physically_handicapped: data.physically_handicapped }),
        ...(data.actual_dob && { actual_dob: data.actual_dob }),
        ...(data.birth_place && { birth_place: data.birth_place.trim() }),
        ...(data.nationality && { nationality: data.nationality.trim() }),
        ...(data.current_city && { current_city: data.current_city.trim() }),
        ...(data.current_state && { current_state: data.current_state.trim() }),
      };

      await dispatch(updateEmployee({ id: employeeId, data: updateData })).unwrap();
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Primary details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save primary details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Primary Details"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      onSave={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      editContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="first_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="First Name" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="middle_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Middle Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="last_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Last Name" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="display_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Display Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="gender"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select SelectProps={{ native: true }} label="Gender" error={!!fieldState.error}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="marital_status"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select SelectProps={{ native: true }} label="Marital Status" error={!!fieldState.error}>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="blood_group"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Blood Group" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="marriage_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Marriage Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="physically_handicapped"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    SelectProps={{ native: true }}
                    label="Physically Handicapped"
                    value={field.value ? 'yes' : 'no'}
                    onChange={(e) => field.onChange(e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="actual_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Actual DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="birth_place"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Birth Place" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="nationality"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Nationality" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="current_city"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Current City/District" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="current_state"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Current State" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div><div className="text-sm font-medium text-gray-500 mb-1">First Name</div><div className="text-base text-gray-900">{employee.first_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Middle Name</div><div className="text-base text-gray-900">{employee.middle_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Last Name</div><div className="text-base text-gray-900">{employee.last_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Display Name</div><div className="text-base text-gray-900">{(employee as any).display_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Gender</div><div className="text-base text-gray-900">{employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Date of Birth</div><div className="text-base text-gray-900">{employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Marital Status</div><div className="text-base text-gray-900">{employee.marital_status ? employee.marital_status.charAt(0).toUpperCase() + employee.marital_status.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Blood Group</div><div className="text-base text-gray-900">{(employee as any).blood_group || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Marriage Date</div><div className="text-base text-gray-900">{(employee as any).marriage_date ? new Date((employee as any).marriage_date).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Physically Handicapped</div><div className="text-base text-gray-900">{(employee as any).physically_handicapped !== undefined ? ((employee as any).physically_handicapped ? 'Yes' : 'No') : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Actual DOB</div><div className="text-base text-gray-900">{(employee as any).actual_dob ? new Date((employee as any).actual_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Birth Place</div><div className="text-base text-gray-900">{(employee as any).birth_place || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Nationality</div><div className="text-base text-gray-900">{employee.nationality || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Current City/District</div><div className="text-base text-gray-900">{(employee as any).current_city || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Current State</div><div className="text-base text-gray-900">{(employee as any).current_state || '-'}</div></div>
      </div>
    </EditableCard>
  );
};

