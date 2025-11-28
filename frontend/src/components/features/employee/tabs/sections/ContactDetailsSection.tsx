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

  // Get primary contact
  const primaryContact = employee.contacts?.find(c => c.contact_type === 'primary') || employee.contacts?.[0];

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      work_email: (primaryContact as any)?.work_email || '',
      personal_email: (primaryContact as any)?.personal_email || '',
      mobile_number: primaryContact?.phone || '',
      work_number: (primaryContact as any)?.work_number || '',
      residence_number: (primaryContact as any)?.residence_number || '',
      emergency_contact_number: (primaryContact as any)?.emergency_contact_number || '',
      emergency_contact_name: (primaryContact as any)?.emergency_contact_name || '',
      linkedin_id: (primaryContact as any)?.linkedin_id || '',
    },
  });

  useEffect(() => {
    const contact = employee.contacts?.find(c => c.contact_type === 'primary') || employee.contacts?.[0];
    reset({
      work_email: (contact as any)?.work_email || '',
      personal_email: (contact as any)?.personal_email || '',
      mobile_number: contact?.phone || '',
      work_number: (contact as any)?.work_number || '',
      residence_number: (contact as any)?.residence_number || '',
      emergency_contact_number: (contact as any)?.emergency_contact_number || '',
      emergency_contact_name: (contact as any)?.emergency_contact_name || '',
      linkedin_id: (contact as any)?.linkedin_id || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: ContactDetailsFormData) => {
    try {
      if (primaryContact) {
        // Update existing contact
        const updateData: Partial<CreateEmployeeContactInput> = {
          ...(data.work_email && { work_email: data.work_email }),
          ...(data.personal_email && { personal_email: data.personal_email }),
          ...(data.mobile_number && { phone: data.mobile_number }),
          ...(data.work_number && { work_number: data.work_number }),
          ...(data.residence_number && { residence_number: data.residence_number }),
          ...(data.emergency_contact_number && { emergency_contact_number: data.emergency_contact_number }),
          ...(data.emergency_contact_name && { emergency_contact_name: data.emergency_contact_name }),
          ...(data.linkedin_id && { linkedin_id: data.linkedin_id }),
        };
        await employeeRelatedService.updateContact(primaryContact.id, updateData);
      } else {
        // Create new primary contact
        const createData: CreateEmployeeContactInput = {
          employee_id: employeeId,
          contact_type: 'primary',
          ...(data.work_email && { work_email: data.work_email }),
          ...(data.personal_email && { personal_email: data.personal_email }),
          ...(data.mobile_number && { phone: data.mobile_number }),
          ...(data.work_number && { work_number: data.work_number }),
          ...(data.residence_number && { residence_number: data.residence_number }),
          ...(data.emergency_contact_number && { emergency_contact_number: data.emergency_contact_number }),
          ...(data.emergency_contact_name && { emergency_contact_name: data.emergency_contact_name }),
          ...(data.linkedin_id && { linkedin_id: data.linkedin_id }),
          is_current: true,
          valid_from: new Date().toISOString(),
        };
        await employeeRelatedService.createContact(createData);
      }
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
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="work_email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="email" label="Work Email" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="personal_email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="email" label="Personal Email" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="mobile_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Mobile Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="work_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Work Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="residence_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Residence Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="emergency_contact_number"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="tel" label="Emergency Contact Number" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="emergency_contact_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Emergency Contact Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
        <div><div className="text-sm font-medium text-gray-500 mb-1">Work Email</div><div className="text-base text-gray-900">{(primaryContact as any)?.work_email || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Personal Email</div><div className="text-base text-gray-900">{(primaryContact as any)?.personal_email || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Mobile Number</div><div className="text-base text-gray-900">{primaryContact?.phone || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Work Number</div><div className="text-base text-gray-900">{(primaryContact as any)?.work_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Residence Number</div><div className="text-base text-gray-900">{(primaryContact as any)?.residence_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Emergency Contact Number</div><div className="text-base text-gray-900">{(primaryContact as any)?.emergency_contact_number || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Emergency Contact Name</div><div className="text-base text-gray-900">{(primaryContact as any)?.emergency_contact_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">LinkedIn ID</div><div className="text-base text-gray-900">{(primaryContact as any)?.linkedin_id || '-'}</div></div>
      </div>
    </EditableCard>
  );
};

