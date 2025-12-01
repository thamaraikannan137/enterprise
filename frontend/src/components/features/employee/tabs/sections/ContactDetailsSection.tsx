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

interface ContactDetailsSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const contactDetailsSchema = z.object({
  work_email: z.string().email('Invalid email').optional().or(z.literal('')),
  personal_email: z.string().email('Invalid email').optional().or(z.literal('')),
  mobile_number: z.string().max(20).optional().or(z.literal('')),
  work_number: z.string().max(20).optional().or(z.literal('')),
  residence_number: z.string().max(20).optional().or(z.literal('')),
  emergency_contact_number: z.string().max(20).optional().or(z.literal('')),
  emergency_contact_name: z.string().max(100).optional().or(z.literal('')),
  linkedin_id: z.string().max(255).optional().or(z.literal('')),
});

type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;

export const ContactDetailsSection = ({ employee, employeeId }: ContactDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  // Contact information is now directly on the Employee model
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      work_email: employee.work_email || '',
      personal_email: employee.personal_email || '',
      mobile_number: employee.mobile_number || '',
      work_number: employee.work_number || '',
      residence_number: employee.residence_number || '',
      emergency_contact_number: employee.emergency_contact_number || '',
      emergency_contact_name: employee.emergency_contact_name || '',
      linkedin_id: employee.linkedin_id || '',
    },
  });

  useEffect(() => {
    reset({
      work_email: employee.work_email || '',
      personal_email: employee.personal_email || '',
      mobile_number: employee.mobile_number || '',
      work_number: employee.work_number || '',
      residence_number: employee.residence_number || '',
      emergency_contact_number: employee.emergency_contact_number || '',
      emergency_contact_name: employee.emergency_contact_name || '',
      linkedin_id: employee.linkedin_id || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: ContactDetailsFormData) => {
    try {
      // Update employee with contact information
      // Contact fields are now directly on the Employee model
      const updateData = {
        work_email: data.work_email || undefined,
        personal_email: data.personal_email || undefined,
        mobile_number: data.mobile_number || undefined,
        work_number: data.work_number || undefined,
        residence_number: data.residence_number || undefined,
        emergency_contact_number: data.emergency_contact_number || undefined,
        emergency_contact_name: data.emergency_contact_name || undefined,
        linkedin_id: data.linkedin_id || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await employeeService.updateEmployee(employeeId, updateData);
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Contact details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save contact details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Contact Details"
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
                name="work_email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="email" label="Work Email" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="personal_email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="email" label="Personal Email" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="mobile_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Mobile Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="work_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Work Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="residence_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Residence Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="emergency_contact_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Emergency Contact Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="emergency_contact_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Emergency Contact Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="linkedin_id"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="LinkedIn ID" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div><div className="text-sm font-medium text-gray-500 mb-1">Work Email</div><div className="text-base text-gray-900">{employee.work_email || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Personal Email</div><div className="text-base text-gray-900">{employee.personal_email || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Mobile Number</div><div className="text-base text-gray-900">{employee.mobile_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Work Number</div><div className="text-base text-gray-900">{employee.work_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Residence Number</div><div className="text-base text-gray-900">{employee.residence_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Emergency Contact Number</div><div className="text-base text-gray-900">{employee.emergency_contact_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Emergency Contact Name</div><div className="text-base text-gray-900">{employee.emergency_contact_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">LinkedIn ID</div><div className="text-base text-gray-900">{employee.linkedin_id || '-'}</div></div>
      </div>
    </EditableCard>
  );
};

