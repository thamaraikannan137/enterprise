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

interface AddressesSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const addressesSchema = z.object({
  current_address_line1: z.string().max(255).optional().or(z.literal('')),
  current_address_line2: z.string().max(255).optional().or(z.literal('')),
  current_city: z.string().max(100).optional().or(z.literal('')),
  current_state: z.string().max(100).optional().or(z.literal('')),
  current_postal_code: z.string().max(20).optional().or(z.literal('')),
  current_country: z.string().max(100).optional().or(z.literal('')),
  permanent_address_line1: z.string().max(255).optional().or(z.literal('')),
  permanent_address_line2: z.string().max(255).optional().or(z.literal('')),
  permanent_city: z.string().max(100).optional().or(z.literal('')),
  permanent_state: z.string().max(100).optional().or(z.literal('')),
  permanent_postal_code: z.string().max(20).optional().or(z.literal('')),
  permanent_country: z.string().max(100).optional().or(z.literal('')),
});

type AddressesFormData = z.infer<typeof addressesSchema>;

export const AddressesSection = ({ employee, employeeId }: AddressesSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  // Address fields are now directly on the Employee model
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AddressesFormData>({
    resolver: zodResolver(addressesSchema),
    defaultValues: {
      current_address_line1: employee.current_address_line1 || '',
      current_address_line2: employee.current_address_line2 || '',
      current_city: employee.current_city_address || employee.current_city || '',
      current_state: employee.current_state || '',
      current_postal_code: employee.current_postal_code || '',
      current_country: employee.current_country || '',
      permanent_address_line1: employee.permanent_address_line1 || '',
      permanent_address_line2: employee.permanent_address_line2 || '',
      permanent_city: employee.permanent_city || '',
      permanent_state: employee.permanent_state || '',
      permanent_postal_code: employee.permanent_postal_code || '',
      permanent_country: employee.permanent_country || '',
    },
  });

  useEffect(() => {
    reset({
      current_address_line1: employee.current_address_line1 || '',
      current_address_line2: employee.current_address_line2 || '',
      current_city: employee.current_city_address || employee.current_city || '',
      current_state: employee.current_state || '',
      current_postal_code: employee.current_postal_code || '',
      current_country: employee.current_country || '',
      permanent_address_line1: employee.permanent_address_line1 || '',
      permanent_address_line2: employee.permanent_address_line2 || '',
      permanent_city: employee.permanent_city || '',
      permanent_state: employee.permanent_state || '',
      permanent_postal_code: employee.permanent_postal_code || '',
      permanent_country: employee.permanent_country || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: AddressesFormData) => {
    try {
      // Update employee with address information
      // Address fields are now directly on the Employee model
      const updateData: any = {
        current_address_line1: data.current_address_line1 || undefined,
        current_address_line2: data.current_address_line2 || undefined,
        current_city_address: data.current_city || undefined,
        current_state: data.current_state || undefined,
        current_postal_code: data.current_postal_code || undefined,
        current_country: data.current_country || undefined,
        permanent_address_line1: data.permanent_address_line1 || undefined,
        permanent_address_line2: data.permanent_address_line2 || undefined,
        permanent_city: data.permanent_city || undefined,
        permanent_state: data.permanent_state || undefined,
        permanent_postal_code: data.permanent_postal_code || undefined,
        permanent_country: data.permanent_country || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await employeeService.updateEmployee(employeeId, updateData);
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Addresses saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save addresses');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Addresses"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      onSave={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      modalMaxWidth="lg"
      editContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Current Address</h4>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Controller
                    name="current_address_line1"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Address Line 1" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Controller
                    name="current_address_line2"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Address Line 2" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="current_city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="City" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="current_state"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="State" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Controller
                    name="current_postal_code"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Postal Code" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Controller
                    name="current_country"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Country" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Permanent Address</h4>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Controller
                    name="permanent_address_line1"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Address Line 1" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                  <Controller
                    name="permanent_address_line2"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Address Line 2" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="permanent_city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="City" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="permanent_state"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="State" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Controller
                    name="permanent_postal_code"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Postal Code" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <Controller
                    name="permanent_country"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Country" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </form>
      }
    >
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Current Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 1</div><div className="text-base text-gray-900">{employee.current_address_line1 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 2</div><div className="text-base text-gray-900">{employee.current_address_line2 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">City</div><div className="text-base text-gray-900">{employee.current_city_address || employee.current_city || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">State</div><div className="text-base text-gray-900">{employee.current_state || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Postal Code</div><div className="text-base text-gray-900">{employee.current_postal_code || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Country</div><div className="text-base text-gray-900">{employee.current_country || '-'}</div></div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Permanent Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 1</div><div className="text-base text-gray-900">{employee.permanent_address_line1 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 2</div><div className="text-base text-gray-900">{employee.permanent_address_line2 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">City</div><div className="text-base text-gray-900">{employee.permanent_city || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">State</div><div className="text-base text-gray-900">{employee.permanent_state || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Postal Code</div><div className="text-base text-gray-900">{employee.permanent_postal_code || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Country</div><div className="text-base text-gray-900">{employee.permanent_country || '-'}</div></div>
          </div>
        </div>
      </div>
    </EditableCard>
  );
};

