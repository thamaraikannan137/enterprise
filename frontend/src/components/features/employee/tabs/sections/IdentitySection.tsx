import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Grid } from '@mui/material';
import { useAppDispatch } from '../../../../../store';
import { fetchEmployeeWithDetails } from '../../../../../store/slices/employeeSlice';
import { employeeService } from '../../../../../services/employeeService';
import { useToast } from '../../../../../contexts/ToastContext';
import { EditableCard } from './EditableCard';
import type { EmployeeWithDetails } from '../../../../../types/employee';

interface IdentitySectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const identitySchema = z.object({
  aadhar_number: z.string().max(20).optional().or(z.literal('')),
  pan_number: z.string().max(20).optional().or(z.literal('')),
  uan_number: z.string().max(20).optional().or(z.literal('')),
  driving_license_number: z.string().max(50).optional().or(z.literal('')),
  passport_name: z.string().max(100).optional().or(z.literal('')),
  passport_number: z.string().max(50).optional().or(z.literal('')),
  passport_valid_upto: z.string().optional().or(z.literal('')),
  visa_type: z.string().max(100).optional().or(z.literal('')),
});

type IdentityFormData = z.infer<typeof identitySchema>;

export const IdentitySection = ({ employee, employeeId }: IdentitySectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  // Identity fields are now directly on the Employee model
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      aadhar_number: employee.aadhar_number || '',
      pan_number: employee.pan_number || '',
      uan_number: employee.uan_number || '',
      driving_license_number: employee.driving_license_number || '',
      passport_name: employee.passport_name || '',
      passport_number: employee.passport_number || '',
      passport_valid_upto: employee.passport_valid_upto ? new Date(employee.passport_valid_upto).toISOString().split('T')[0] : '',
      visa_type: employee.visa_type || '',
    },
  });

  useEffect(() => {
    reset({
      aadhar_number: employee.aadhar_number || '',
      pan_number: employee.pan_number || '',
      uan_number: employee.uan_number || '',
      driving_license_number: employee.driving_license_number || '',
      passport_name: employee.passport_name || '',
      passport_number: employee.passport_number || '',
      passport_valid_upto: employee.passport_valid_upto ? new Date(employee.passport_valid_upto).toISOString().split('T')[0] : '',
      visa_type: employee.visa_type || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: IdentityFormData) => {
    try {
      // Update employee with identity information
      // Identity fields are now directly on the Employee model
      const updateData: any = {
        ...(data.aadhar_number && { aadhar_number: data.aadhar_number.trim() }),
        ...(data.pan_number && { pan_number: data.pan_number.trim() }),
        ...(data.uan_number && { uan_number: data.uan_number.trim() }),
        ...(data.driving_license_number && { driving_license_number: data.driving_license_number.trim() }),
        ...(data.passport_name && { passport_name: data.passport_name.trim() }),
        ...(data.passport_number && { passport_number: data.passport_number.trim() }),
        ...(data.passport_valid_upto && { passport_valid_upto: data.passport_valid_upto }),
        ...(data.visa_type && { visa_type: data.visa_type.trim() }),
      };

      // Remove undefined and empty string values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await employeeService.updateEmployee(employeeId, updateData);
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Identity details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save identity details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Identity Details"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      onSave={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      editContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="aadhar_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Aadhar Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="pan_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="PAN No." error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="uan_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="UAN Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="driving_license_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Driving License No. (Local/International)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="passport_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Name as on Passport" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="passport_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Passport No." error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="passport_valid_upto"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Passport Valid Upto" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="visa_type"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Visa Type (If any)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div><div className="text-sm font-medium text-gray-500 mb-1">Aadhar Number</div><div className="text-base text-gray-900">{employee.aadhar_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">PAN No.</div><div className="text-base text-gray-900">{employee.pan_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">UAN Number</div><div className="text-base text-gray-900">{employee.uan_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Driving License No.</div><div className="text-base text-gray-900">{employee.driving_license_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Name as on Passport</div><div className="text-base text-gray-900">{employee.passport_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Passport No.</div><div className="text-base text-gray-900">{employee.passport_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Passport Valid Upto</div><div className="text-base text-gray-900">{employee.passport_valid_upto ? new Date(employee.passport_valid_upto).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Visa Type</div><div className="text-base text-gray-900">{employee.visa_type || '-'}</div></div>
      </div>
    </EditableCard>
  );
};

