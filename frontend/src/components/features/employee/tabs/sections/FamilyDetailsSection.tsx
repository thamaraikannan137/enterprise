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

interface FamilyDetailsSectionProps {
  employee: EmployeeWithDetails;
  employeeId: string;
}

const familyDetailsSchema = z.object({
  father_dob: z.string().optional().or(z.literal('')),
  mother_dob: z.string().optional().or(z.literal('')),
  spouse_gender: z.enum(['male', 'female', 'other']).optional(),
  spouse_dob: z.string().optional().or(z.literal('')),
  kid1_name: z.string().max(100).optional().or(z.literal('')),
  kid1_gender: z.enum(['male', 'female', 'other']).optional(),
  kid1_dob: z.string().optional().or(z.literal('')),
  kid2_name: z.string().max(100).optional().or(z.literal('')),
  kid2_gender: z.enum(['male', 'female', 'other']).optional(),
  kid2_dob: z.string().optional().or(z.literal('')),
});

type FamilyDetailsFormData = z.infer<typeof familyDetailsSchema>;

export const FamilyDetailsSection = ({ employee, employeeId }: FamilyDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const family = employee.family;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FamilyDetailsFormData>({
    resolver: zodResolver(familyDetailsSchema),
    defaultValues: {
      father_dob: family?.father_dob?.split('T')[0] || '',
      mother_dob: family?.mother_dob?.split('T')[0] || '',
      spouse_gender: family?.spouse_gender,
      spouse_dob: family?.spouse_dob?.split('T')[0] || '',
      kid1_name: family?.kid1_name || '',
      kid1_gender: family?.kid1_gender,
      kid1_dob: family?.kid1_dob?.split('T')[0] || '',
      kid2_name: family?.kid2_name || '',
      kid2_gender: family?.kid2_gender,
      kid2_dob: family?.kid2_dob?.split('T')[0] || '',
    },
  });

  useEffect(() => {
    reset({
      father_dob: family?.father_dob?.split('T')[0] || '',
      mother_dob: family?.mother_dob?.split('T')[0] || '',
      spouse_gender: family?.spouse_gender,
      spouse_dob: family?.spouse_dob?.split('T')[0] || '',
      kid1_name: family?.kid1_name || '',
      kid1_gender: family?.kid1_gender,
      kid1_dob: family?.kid1_dob?.split('T')[0] || '',
      kid2_name: family?.kid2_name || '',
      kid2_gender: family?.kid2_gender,
      kid2_dob: family?.kid2_dob?.split('T')[0] || '',
    });
  }, [family, reset]);

  const onSubmit = async (data: FamilyDetailsFormData) => {
    try {
      await employeeRelatedService.createOrUpdateFamily(employeeId, {
        ...(data.father_dob && { father_dob: data.father_dob }),
        ...(data.mother_dob && { mother_dob: data.mother_dob }),
        ...(data.spouse_gender && { spouse_gender: data.spouse_gender }),
        ...(data.spouse_dob && { spouse_dob: data.spouse_dob }),
        ...(data.kid1_name && { kid1_name: data.kid1_name.trim() }),
        ...(data.kid1_gender && { kid1_gender: data.kid1_gender }),
        ...(data.kid1_dob && { kid1_dob: data.kid1_dob }),
        ...(data.kid2_name && { kid2_name: data.kid2_name.trim() }),
        ...(data.kid2_gender && { kid2_gender: data.kid2_gender }),
        ...(data.kid2_dob && { kid2_dob: data.kid2_dob }),
      });
      await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      showSuccess('Family details saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      showError(error?.message || 'Failed to save family details');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditMode(false);
  };

  return (
    <EditableCard
      title="Family Details"
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
                name="father_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Father's DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="mother_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Mother's DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="spouse_gender"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select SelectProps={{ native: true }} label="Spouse Gender" error={!!fieldState.error}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="spouse_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Spouse DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid1_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Kid 1 Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid1_gender"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select SelectProps={{ native: true }} label="Kid 1 Gender" error={!!fieldState.error}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid1_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Kid 1 DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid2_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Kid 2 Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid2_gender"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth select SelectProps={{ native: true }} label="Kid 2 Gender" error={!!fieldState.error}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="kid2_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Kid 2 DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
          </Grid>
        </form>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div><div className="text-sm font-medium text-gray-500 mb-1">Father's DOB</div><div className="text-base text-gray-900">{family?.father_dob ? new Date(family.father_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Mother's DOB</div><div className="text-base text-gray-900">{family?.mother_dob ? new Date(family.mother_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Spouse Gender</div><div className="text-base text-gray-900">{family?.spouse_gender ? family.spouse_gender.charAt(0).toUpperCase() + family.spouse_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Spouse DOB</div><div className="text-base text-gray-900">{family?.spouse_dob ? new Date(family.spouse_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 Name</div><div className="text-base text-gray-900">{family?.kid1_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 Gender</div><div className="text-base text-gray-900">{family?.kid1_gender ? family.kid1_gender.charAt(0).toUpperCase() + family.kid1_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 DOB</div><div className="text-base text-gray-900">{family?.kid1_dob ? new Date(family.kid1_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 Name</div><div className="text-base text-gray-900">{family?.kid2_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 Gender</div><div className="text-base text-gray-900">{family?.kid2_gender ? family.kid2_gender.charAt(0).toUpperCase() + family.kid2_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 DOB</div><div className="text-base text-gray-900">{family?.kid2_dob ? new Date(family.kid2_dob).toLocaleDateString() : '-'}</div></div>
      </div>
    </EditableCard>
  );
};

