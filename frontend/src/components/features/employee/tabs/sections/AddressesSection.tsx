import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Grid } from '@mui/material';
import { useAppDispatch } from '../../../../../store';
import { fetchEmployeeWithDetails } from '../../../../../store/slices/employeeSlice';
import { employeeRelatedService } from '../../../../../services/employeeRelatedService';
import { useToast } from '../../../../../contexts/ToastContext';
import { EditableCard } from './EditableCard';
import type { EmployeeWithDetails } from '../../../../../types/employee';
import type { CreateEmployeeContactInput } from '../../../../../types/employeeRelated';

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

  const currentAddress = employee.contacts?.find(c => c.is_current && c.contact_type === 'primary');
  const permanentAddress = employee.contacts?.find(c => !c.is_current && c.contact_type === 'primary');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AddressesFormData>({
    resolver: zodResolver(addressesSchema),
    defaultValues: {
      current_address_line1: currentAddress?.address_line1 || '',
      current_address_line2: currentAddress?.address_line2 || '',
      current_city: currentAddress?.city || '',
      current_state: currentAddress?.country || '',
      current_postal_code: currentAddress?.postal_code || '',
      current_country: currentAddress?.country || '',
      permanent_address_line1: permanentAddress?.address_line1 || '',
      permanent_address_line2: permanentAddress?.address_line2 || '',
      permanent_city: permanentAddress?.city || '',
      permanent_state: permanentAddress?.country || '',
      permanent_postal_code: permanentAddress?.postal_code || '',
      permanent_country: permanentAddress?.country || '',
    },
  });

  useEffect(() => {
    const current = employee.contacts?.find(c => c.is_current && c.contact_type === 'primary');
    const permanent = employee.contacts?.find(c => !c.is_current && c.contact_type === 'primary');
    reset({
      current_address_line1: current?.address_line1 || '',
      current_address_line2: current?.address_line2 || '',
      current_city: current?.city || '',
      current_state: current?.country || '',
      current_postal_code: current?.postal_code || '',
      current_country: current?.country || '',
      permanent_address_line1: permanent?.address_line1 || '',
      permanent_address_line2: permanent?.address_line2 || '',
      permanent_city: permanent?.city || '',
      permanent_state: permanent?.country || '',
      permanent_postal_code: permanent?.postal_code || '',
      permanent_country: permanent?.country || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: AddressesFormData) => {
    try {
      // Update or create current address
      if (currentAddress) {
        await employeeRelatedService.updateContact(currentAddress.id, {
          address_line1: data.current_address_line1,
          address_line2: data.current_address_line2,
          city: data.current_city,
          postal_code: data.current_postal_code,
          country: data.current_country,
        });
      } else if (data.current_address_line1 || data.current_city) {
        await employeeRelatedService.createContact({
          employee_id: employeeId,
          contact_type: 'primary',
          address_line1: data.current_address_line1,
          address_line2: data.current_address_line2,
          city: data.current_city,
          postal_code: data.current_postal_code,
          country: data.current_country,
          is_current: true,
          valid_from: new Date().toISOString(),
        });
      }

      // Update or create permanent address
      if (permanentAddress) {
        await employeeRelatedService.updateContact(permanentAddress.id, {
          address_line1: data.permanent_address_line1,
          address_line2: data.permanent_address_line2,
          city: data.permanent_city,
          postal_code: data.permanent_postal_code,
          country: data.permanent_country,
        });
      } else if (data.permanent_address_line1 || data.permanent_city) {
        await employeeRelatedService.createContact({
          employee_id: employeeId,
          contact_type: 'primary',
          address_line1: data.permanent_address_line1,
          address_line2: data.permanent_address_line2,
          city: data.permanent_city,
          postal_code: data.permanent_postal_code,
          country: data.permanent_country,
          is_current: false,
          valid_from: new Date().toISOString(),
        });
      }

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
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 1</div><div className="text-base text-gray-900">{currentAddress?.address_line1 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 2</div><div className="text-base text-gray-900">{currentAddress?.address_line2 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">City</div><div className="text-base text-gray-900">{currentAddress?.city || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Postal Code</div><div className="text-base text-gray-900">{currentAddress?.postal_code || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Country</div><div className="text-base text-gray-900">{currentAddress?.country || '-'}</div></div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Permanent Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 1</div><div className="text-base text-gray-900">{permanentAddress?.address_line1 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Address Line 2</div><div className="text-base text-gray-900">{permanentAddress?.address_line2 || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">City</div><div className="text-base text-gray-900">{permanentAddress?.city || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Postal Code</div><div className="text-base text-gray-900">{permanentAddress?.postal_code || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Country</div><div className="text-base text-gray-900">{permanentAddress?.country || '-'}</div></div>
          </div>
        </div>
      </div>
    </EditableCard>
  );
};

