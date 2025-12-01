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

  // Family fields are now directly on the Employee model
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FamilyDetailsFormData>({
    resolver: zodResolver(familyDetailsSchema),
    defaultValues: {
      father_dob: employee.father_dob ? new Date(employee.father_dob).toISOString().split('T')[0] : '',
      mother_dob: employee.mother_dob ? new Date(employee.mother_dob).toISOString().split('T')[0] : '',
      spouse_gender: employee.spouse_gender,
      spouse_dob: employee.spouse_dob ? new Date(employee.spouse_dob).toISOString().split('T')[0] : '',
      kid1_name: employee.kid1_name || '',
      kid1_gender: employee.kid1_gender,
      kid1_dob: employee.kid1_dob ? new Date(employee.kid1_dob).toISOString().split('T')[0] : '',
      kid2_name: employee.kid2_name || '',
      kid2_gender: employee.kid2_gender,
      kid2_dob: employee.kid2_dob ? new Date(employee.kid2_dob).toISOString().split('T')[0] : '',
    },
  });

  useEffect(() => {
    reset({
      father_dob: employee.father_dob ? new Date(employee.father_dob).toISOString().split('T')[0] : '',
      mother_dob: employee.mother_dob ? new Date(employee.mother_dob).toISOString().split('T')[0] : '',
      spouse_gender: employee.spouse_gender,
      spouse_dob: employee.spouse_dob ? new Date(employee.spouse_dob).toISOString().split('T')[0] : '',
      kid1_name: employee.kid1_name || '',
      kid1_gender: employee.kid1_gender,
      kid1_dob: employee.kid1_dob ? new Date(employee.kid1_dob).toISOString().split('T')[0] : '',
      kid2_name: employee.kid2_name || '',
      kid2_gender: employee.kid2_gender,
      kid2_dob: employee.kid2_dob ? new Date(employee.kid2_dob).toISOString().split('T')[0] : '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: FamilyDetailsFormData) => {
    try {
      // Update employee with family information
      // Family fields are now directly on the Employee model
      const updateData: any = {
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
      };

      // Remove undefined and empty string values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await employeeService.updateEmployee(employeeId, updateData);
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="father_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Father's DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="mother_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Mother's DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="spouse_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Spouse DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="kid1_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Kid 1 Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="kid1_dob"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth type="date" label="Kid 1 DOB" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Controller
                name="kid2_name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} fullWidth label="Kid 2 Name" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        <div><div className="text-sm font-medium text-gray-500 mb-1">Father's DOB</div><div className="text-base text-gray-900">{employee.father_dob ? new Date(employee.father_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Mother's DOB</div><div className="text-base text-gray-900">{employee.mother_dob ? new Date(employee.mother_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Spouse Gender</div><div className="text-base text-gray-900">{employee.spouse_gender ? employee.spouse_gender.charAt(0).toUpperCase() + employee.spouse_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Spouse DOB</div><div className="text-base text-gray-900">{employee.spouse_dob ? new Date(employee.spouse_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 Name</div><div className="text-base text-gray-900">{employee.kid1_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 Gender</div><div className="text-base text-gray-900">{employee.kid1_gender ? employee.kid1_gender.charAt(0).toUpperCase() + employee.kid1_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 1 DOB</div><div className="text-base text-gray-900">{employee.kid1_dob ? new Date(employee.kid1_dob).toLocaleDateString() : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 Name</div><div className="text-base text-gray-900">{employee.kid2_name || '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 Gender</div><div className="text-base text-gray-900">{employee.kid2_gender ? employee.kid2_gender.charAt(0).toUpperCase() + employee.kid2_gender.slice(1) : '-'}</div></div>
        <div><div className="text-sm font-medium text-gray-500 mb-1">Kid 2 DOB</div><div className="text-base text-gray-900">{employee.kid2_dob ? new Date(employee.kid2_dob).toLocaleDateString() : '-'}</div></div>
      </div>
    </EditableCard>
  );
};

