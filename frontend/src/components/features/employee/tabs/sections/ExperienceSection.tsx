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

interface ExperienceSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const experienceSchema = z.object({
  total_experience: z.number().min(0).optional(),
  relevant_experience: z.number().min(0).optional(),
  organization1_name: z.string().max(255).optional().or(z.literal('')),
  organization1_start_date: z.string().optional().or(z.literal('')),
  organization1_end_date: z.string().optional().or(z.literal('')),
  organization1_designation: z.string().max(255).optional().or(z.literal('')),
  organization1_reason_for_leaving: z.string().max(500).optional().or(z.literal('')),
  organization2_name: z.string().max(255).optional().or(z.literal('')),
  organization2_start_date: z.string().optional().or(z.literal('')),
  organization2_end_date: z.string().optional().or(z.literal('')),
  organization2_designation: z.string().max(255).optional().or(z.literal('')),
  organization2_reason_for_leaving: z.string().max(500).optional().or(z.literal('')),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export const ExperienceSection = ({ employee, employeeId }: ExperienceSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const experience = employee.experience;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      total_experience: experience?.total_experience || undefined,
      relevant_experience: experience?.relevant_experience || undefined,
      organization1_name: experience?.organization1_name || '',
      organization1_start_date: experience?.organization1_start_date?.split('T')[0] || '',
      organization1_end_date: experience?.organization1_end_date?.split('T')[0] || '',
      organization1_designation: experience?.organization1_designation || '',
      organization1_reason_for_leaving: experience?.organization1_reason_for_leaving || '',
      organization2_name: experience?.organization2_name || '',
      organization2_start_date: experience?.organization2_start_date?.split('T')[0] || '',
      organization2_end_date: experience?.organization2_end_date?.split('T')[0] || '',
      organization2_designation: experience?.organization2_designation || '',
      organization2_reason_for_leaving: experience?.organization2_reason_for_leaving || '',
    },
  });

  useEffect(() => {
    reset({
      total_experience: experience?.total_experience || undefined,
      relevant_experience: experience?.relevant_experience || undefined,
      organization1_name: experience?.organization1_name || '',
      organization1_start_date: experience?.organization1_start_date?.split('T')[0] || '',
      organization1_end_date: experience?.organization1_end_date?.split('T')[0] || '',
      organization1_designation: experience?.organization1_designation || '',
      organization1_reason_for_leaving: experience?.organization1_reason_for_leaving || '',
      organization2_name: experience?.organization2_name || '',
      organization2_start_date: experience?.organization2_start_date?.split('T')[0] || '',
      organization2_end_date: experience?.organization2_end_date?.split('T')[0] || '',
      organization2_designation: experience?.organization2_designation || '',
      organization2_reason_for_leaving: experience?.organization2_reason_for_leaving || '',
    });
  }, [experience, reset]);

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      await employeeRelatedService.createOrUpdateExperience(employeeId, {
        ...(data.total_experience !== undefined && { total_experience: data.total_experience }),
        ...(data.relevant_experience !== undefined && { relevant_experience: data.relevant_experience }),
        ...(data.organization1_name && { organization1_name: data.organization1_name.trim() }),
        ...(data.organization1_start_date && { organization1_start_date: data.organization1_start_date }),
        ...(data.organization1_end_date && { organization1_end_date: data.organization1_end_date }),
        ...(data.organization1_designation && { organization1_designation: data.organization1_designation.trim() }),
        ...(data.organization1_reason_for_leaving && { organization1_reason_for_leaving: data.organization1_reason_for_leaving.trim() }),
        ...(data.organization2_name && { organization2_name: data.organization2_name.trim() }),
        ...(data.organization2_start_date && { organization2_start_date: data.organization2_start_date }),
        ...(data.organization2_end_date && { organization2_end_date: data.organization2_end_date }),
        ...(data.organization2_designation && { organization2_designation: data.organization2_designation.trim() }),
        ...(data.organization2_reason_for_leaving && { organization2_reason_for_leaving: data.organization2_reason_for_leaving.trim() }),
      });
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Experience details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save experience details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Previous Experience"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
      onSave={handleSubmit(onSubmit)}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      modalMaxWidth="lg"
      editContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="total_experience"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="number" label="Total Experience (years)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="relevant_experience"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="number" label="Relevant Experience (years)" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Most Recent Organization</h4>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization1_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Organization Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization1_start_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization1_end_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="organization1_designation"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Designation" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="organization1_reason_for_leaving"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Reason for Leaving" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <h4 className="text-md font-semibold text-gray-700 mb-3">2nd Most Recent Organization</h4>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization2_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Organization Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization2_start_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="organization2_end_date"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="organization2_designation"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Designation" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="organization2_reason_for_leaving"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Reason for Leaving" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><div className="text-sm font-medium text-gray-500 mb-1">Total Experience</div><div className="text-base text-gray-900">{experience?.total_experience !== undefined ? `${experience.total_experience} years` : '-'}</div></div>
          <div><div className="text-sm font-medium text-gray-500 mb-1">Relevant Experience</div><div className="text-base text-gray-900">{experience?.relevant_experience !== undefined ? `${experience.relevant_experience} years` : '-'}</div></div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Most Recent Organization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Organization Name</div><div className="text-base text-gray-900">{experience?.organization1_name || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Start Date</div><div className="text-base text-gray-900">{experience?.organization1_start_date ? new Date(experience.organization1_start_date).toLocaleDateString() : '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">End Date</div><div className="text-base text-gray-900">{experience?.organization1_end_date ? new Date(experience.organization1_end_date).toLocaleDateString() : '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Designation</div><div className="text-base text-gray-900">{experience?.organization1_designation || '-'}</div></div>
            <div className="md:col-span-2"><div className="text-sm font-medium text-gray-500 mb-1">Reason for Leaving</div><div className="text-base text-gray-900">{experience?.organization1_reason_for_leaving || '-'}</div></div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">2nd Most Recent Organization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Organization Name</div><div className="text-base text-gray-900">{experience?.organization2_name || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Start Date</div><div className="text-base text-gray-900">{experience?.organization2_start_date ? new Date(experience.organization2_start_date).toLocaleDateString() : '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">End Date</div><div className="text-base text-gray-900">{experience?.organization2_end_date ? new Date(experience.organization2_end_date).toLocaleDateString() : '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Designation</div><div className="text-base text-gray-900">{experience?.organization2_designation || '-'}</div></div>
            <div className="md:col-span-2"><div className="text-sm font-medium text-gray-500 mb-1">Reason for Leaving</div><div className="text-base text-gray-900">{experience?.organization2_reason_for_leaving || '-'}</div></div>
          </div>
        </div>
      </div>
    </EditableCard>
  );
};

