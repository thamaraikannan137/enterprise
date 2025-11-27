import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { updateEmployee, fetchEmployeeWithDetails } from '../../../../store/slices/employeeSlice';
import { useEmployeeList } from '../../../../hooks/useEmployeeList';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface JobTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

const jobInfoSchema = z.object({
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters'),
  department: z.string().min(1, 'Department is required').max(100, 'Department must be less than 100 characters'),
  reporting_to: z.string().optional().or(z.literal('')),
  employee_code: z.string().optional().or(z.literal('')),
  hire_date: z.string().min(1, 'Hire date is required'),
  termination_date: z.string().optional().or(z.literal('')),
});

type JobInfoFormData = z.infer<typeof jobInfoSchema>;

export const JobTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: JobTabProps) => {
  const dispatch = useAppDispatch();
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const { employees: managerOptions, loading: managerOptionsLoading } = useEmployeeList({ 
    status: 'active', 
    limit: 100,
    excludeId: employee.id 
  });

  // Use employee.id if available, otherwise fall back to URL param
  const employeeId = employee?.id || employeeIdFromUrl;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<JobInfoFormData>({
    resolver: zodResolver(jobInfoSchema),
    mode: 'onChange',
    defaultValues: {
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date.split('T')[0],
      termination_date: employee.termination_date?.split('T')[0] || '',
    },
  });

  useEffect(() => {
    reset({
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date.split('T')[0],
      termination_date: employee.termination_date?.split('T')[0] || '',
    });
  }, [employee, reset]);

  const onSubmit = async (data: JobInfoFormData) => {
    // Validate employee ID
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      console.error('Employee ID is missing:', { employeeId, employeeIdFromUrl, employee });
      return;
    }

    try {
      await dispatch(updateEmployee({
        id: employeeId,
        data: {
          designation: data.designation,
          department: data.department,
          reporting_to: data.reporting_to && data.reporting_to.trim() !== '' ? data.reporting_to : (null as any),
          hire_date: data.hire_date,
          termination_date: data.termination_date && data.termination_date.trim() !== '' ? data.termination_date : (null as any),
        },
      })).unwrap();
      
      // Refetch employee details to update the UI immediately
      if (employeeId) {
        await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      }
      
      showSuccess('Job information saved successfully!');
      onEditModeChange(false);
    } catch (error: any) {
      console.error('Failed to update employee:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save job information. Please try again.';
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    reset({
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date.split('T')[0],
      termination_date: employee.termination_date?.split('T')[0] || '',
    });
    onEditModeChange(false);
  };

  const getReportingManagerName = () => {
    if (!employee.reporting_to) return 'No Manager';
    
    // Check if reporting_to is a populated object (from backend)
    if (typeof employee.reporting_to === 'object' && employee.reporting_to !== null) {
      const reportingTo = employee.reporting_to as any;
      const name = `${reportingTo.first_name || ''} ${reportingTo.last_name || ''}`.trim();
      const designation = reportingTo.designation ? ` (${reportingTo.designation})` : '';
      return name ? `${name}${designation}` : 'Unknown Manager';
    }
    
    // If reporting_to is a string ID, try to find it in managerOptions
    const reportingToId = typeof employee.reporting_to === 'string' ? employee.reporting_to : String(employee.reporting_to);
    
    // If managerOptions is still loading, show loading state
    if (managerOptionsLoading) {
      return 'Loading...';
    }
    
    const manager = managerOptions.find(m => m.id === reportingToId);
    if (manager) {
      return `${manager.first_name} ${manager.last_name}${manager.designation ? ` (${manager.designation})` : ''}`;
    }
    
    // If not found in managerOptions, check if there's a reportingToEmployee property
    if ((employee as any).reportingToEmployee) {
      const reportingTo = (employee as any).reportingToEmployee;
      const name = `${reportingTo.first_name || ''} ${reportingTo.last_name || ''}`.trim();
      const designation = reportingTo.designation ? ` (${reportingTo.designation})` : '';
      return name ? `${name}${designation}` : 'Unknown Manager';
    }
    
    // If still not found, return the ID or a fallback
    return reportingToId || 'Unknown Manager';
  };

  return (
    <div className="space-y-6">
      {import.meta.env.DEV && <DevTool control={control} />}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Information</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid size={4}>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Designation"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="department"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Department"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="reporting_to"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Reporting To</InputLabel>
                      <Select
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : String(value));
                        }}
                        label="Reporting To"
                      >
                        <MenuItem value="">No Manager</MenuItem>
                        {managerOptions.map((manager) => {
                          const name = `${manager.first_name} ${manager.last_name}`;
                          const display = `${name}${(manager as any).designation ? ` (${(manager as any).designation})` : ''} - ${manager.employee_code}`;
                          return (
                            <MenuItem key={manager.id} value={manager.id}>
                              {display}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {fieldState.error && (
                        <div className="text-xs text-red-500 mt-1 ml-3">
                          {fieldState.error.message}
                        </div>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="employee_code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Employee Number"
                      disabled
                      variant="outlined"
                      helperText="Employee code cannot be changed"
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="hire_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hire Date"
                      type="date"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="termination_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Termination Date"
                      type="date"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <div className="flex gap-2">
              <MuiButton
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Save
              </MuiButton>
              <MuiButton
                type="button"
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </MuiButton>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Designation
              </div>
              <div className="text-base text-gray-900">{employee.designation || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Department
              </div>
              <div className="text-base text-gray-900">{employee.department || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Reporting To
              </div>
              <div className="text-base text-gray-900">{getReportingManagerName()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Employee Number
              </div>
              <div className="text-base text-gray-900">{employee.employee_code}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                Hire Date
              </div>
              <div className="text-base text-gray-900">
                {new Date(employee.hire_date).toLocaleDateString()}
              </div>
            </div>
            {employee.termination_date && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Termination Date
                </div>
                <div className="text-base text-gray-900">
                  {new Date(employee.termination_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        )}
      </MuiCard>
    </div>
  );
};

