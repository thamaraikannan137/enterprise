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

interface EducationSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const educationSchema = z.object({
  pg_degree: z.string().max(255).optional().or(z.literal('')),
  pg_specialization: z.string().max(255).optional().or(z.literal('')),
  pg_grade: z.string().max(50).optional().or(z.literal('')),
  pg_university: z.string().max(255).optional().or(z.literal('')),
  pg_completion_year: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  graduation_degree: z.string().max(255).optional().or(z.literal('')),
  graduation_specialization: z.string().max(255).optional().or(z.literal('')),
  graduation_grade: z.string().max(50).optional().or(z.literal('')),
  graduation_college: z.string().max(255).optional().or(z.literal('')),
  graduation_completion_year: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  inter_grade: z.string().max(50).optional().or(z.literal('')),
  inter_school: z.string().max(255).optional().or(z.literal('')),
  inter_completion_year: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

export const EducationSection = ({ employee, employeeId }: EducationSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const education = employee.educationDetail;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      pg_degree: education?.pg_degree || '',
      pg_specialization: education?.pg_specialization || '',
      pg_grade: education?.pg_grade || '',
      pg_university: education?.pg_university || '',
      pg_completion_year: education?.pg_completion_year || undefined,
      graduation_degree: education?.graduation_degree || '',
      graduation_specialization: education?.graduation_specialization || '',
      graduation_grade: education?.graduation_grade || '',
      graduation_college: education?.graduation_college || '',
      graduation_completion_year: education?.graduation_completion_year || undefined,
      inter_grade: education?.inter_grade || '',
      inter_school: education?.inter_school || '',
      inter_completion_year: education?.inter_completion_year || undefined,
    },
  });

  useEffect(() => {
    reset({
      pg_degree: education?.pg_degree || '',
      pg_specialization: education?.pg_specialization || '',
      pg_grade: education?.pg_grade || '',
      pg_university: education?.pg_university || '',
      pg_completion_year: education?.pg_completion_year || undefined,
      graduation_degree: education?.graduation_degree || '',
      graduation_specialization: education?.graduation_specialization || '',
      graduation_grade: education?.graduation_grade || '',
      graduation_college: education?.graduation_college || '',
      graduation_completion_year: education?.graduation_completion_year || undefined,
      inter_grade: education?.inter_grade || '',
      inter_school: education?.inter_school || '',
      inter_completion_year: education?.inter_completion_year || undefined,
    });
  }, [education, reset]);

  const onSubmit = async (data: EducationFormData) => {
    try {
      await employeeRelatedService.createOrUpdateEducationDetail(employeeId, {
        ...(data.pg_degree && { pg_degree: data.pg_degree.trim() }),
        ...(data.pg_specialization && { pg_specialization: data.pg_specialization.trim() }),
        ...(data.pg_grade && { pg_grade: data.pg_grade.trim() }),
        ...(data.pg_university && { pg_university: data.pg_university.trim() }),
        ...(data.pg_completion_year && { pg_completion_year: data.pg_completion_year }),
        ...(data.graduation_degree && { graduation_degree: data.graduation_degree.trim() }),
        ...(data.graduation_specialization && { graduation_specialization: data.graduation_specialization.trim() }),
        ...(data.graduation_grade && { graduation_grade: data.graduation_grade.trim() }),
        ...(data.graduation_college && { graduation_college: data.graduation_college.trim() }),
        ...(data.graduation_completion_year && { graduation_completion_year: data.graduation_completion_year }),
        ...(data.inter_grade && { inter_grade: data.inter_grade.trim() }),
        ...(data.inter_school && { inter_school: data.inter_school.trim() }),
        ...(data.inter_completion_year && { inter_completion_year: data.inter_completion_year }),
      });
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Education details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save education details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Education Details"
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
              <h4 className="text-md font-semibold text-gray-700 mb-3">PG (Pursuing or Passed)</h4>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="pg_degree"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Degree" placeholder="NA if not applicable" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="pg_specialization"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Specialization" placeholder="NA if not applicable" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="pg_grade"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Grade / Percentage" placeholder="NA if not applicable" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Controller
                    name="pg_university"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="University & City" placeholder="NA if not applicable" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Controller
                    name="pg_completion_year"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth type="number" label="Year of Completion" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Graduation</h4>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="graduation_degree"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Degree" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="graduation_specialization"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Specialization" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="graduation_grade"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Grade / Percentage" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Controller
                    name="graduation_college"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="College & City" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Controller
                    name="graduation_completion_year"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth type="number" label="Year of Completion" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">Inter/12th</h4>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="inter_grade"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="Grade / Percentage" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="inter_school"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth label="College / School & City" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Controller
                    name="inter_completion_year"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField {...field} fullWidth type="number" label="Year of Completion" error={!!fieldState.error} helperText={fieldState.error?.message} />
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
          <h4 className="text-md font-semibold text-gray-700 mb-3">PG (Pursuing or Passed)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Degree</div><div className="text-base text-gray-900">{education?.pg_degree || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Specialization</div><div className="text-base text-gray-900">{education?.pg_specialization || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Grade / Percentage</div><div className="text-base text-gray-900">{education?.pg_grade || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">University & City</div><div className="text-base text-gray-900">{education?.pg_university || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Year of Completion</div><div className="text-base text-gray-900">{education?.pg_completion_year || '-'}</div></div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Graduation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Degree</div><div className="text-base text-gray-900">{education?.graduation_degree || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Specialization</div><div className="text-base text-gray-900">{education?.graduation_specialization || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Grade / Percentage</div><div className="text-base text-gray-900">{education?.graduation_grade || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">College & City</div><div className="text-base text-gray-900">{education?.graduation_college || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Year of Completion</div><div className="text-base text-gray-900">{education?.graduation_completion_year || '-'}</div></div>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-3">Inter/12th</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><div className="text-sm font-medium text-gray-500 mb-1">Grade / Percentage</div><div className="text-base text-gray-900">{education?.inter_grade || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">College / School & City</div><div className="text-base text-gray-900">{education?.inter_school || '-'}</div></div>
            <div><div className="text-sm font-medium text-gray-500 mb-1">Year of Completion</div><div className="text-base text-gray-900">{education?.inter_completion_year || '-'}</div></div>
          </div>
        </div>
      </div>
    </EditableCard>
  );
};

