import { useFormContext, Controller } from 'react-hook-form';
import { MuiInput } from '../../common';
import { useEmployeeList } from '../../../hooks/useEmployeeList';
import { CircularProgress, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';

export const JobInfoTab = () => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const { employees, loading: employeesLoading } = useEmployeeList({
    status: 'active',
    limit: 100,
  });

  const reportingToValue = watch('reporting_to');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide the employee's job details. Fields marked with * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Designation */}
        <MuiInput
          {...register('designation')}
          type="text"
          label="Designation"
          placeholder="e.g., Lead Engineer, Senior Developer"
          error={errors.designation?.message as string}
          required
        />

        {/* Department */}
        <MuiInput
          {...register('department')}
          type="text"
          label="Department"
          placeholder="e.g., Engineering, HR, Finance"
          error={errors.department?.message as string}
          required
        />

        {/* Reporting To */}
        <div className="md:col-span-2">
          <FormControl fullWidth error={!!errors.reporting_to}>
            <InputLabel shrink>Reporting To (Manager)</InputLabel>
            <Controller
              name="reporting_to"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  value={field.value || ''}
                  className="mt-2"
                  disabled={employeesLoading}
                  endAdornment={
                    employeesLoading ? (
                      <CircularProgress size={20} className="mr-2" />
                    ) : null
                  }
                >
                  <MenuItem value="">
                    <em className="text-gray-400">No Manager (Top Level)</em>
                  </MenuItem>
                  {employees.map((employee) => {
                    const fullName = `${employee.first_name} ${employee.last_name}`;
                    const designation = (employee as any).designation || '';
                    const displayText = `${fullName}${designation ? ` (${designation})` : ''} - ${employee.employee_code}`;
                    return (
                      <MenuItem key={employee.id} value={employee.id}>
                        {displayText}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            />
            {errors.reporting_to && (
              <FormHelperText>{errors.reporting_to.message as string}</FormHelperText>
            )}
            {employeesLoading && (
              <FormHelperText>Loading employees...</FormHelperText>
            )}
            {!employeesLoading && employees.length === 0 && (
              <FormHelperText className="text-gray-500">
                No active employees found. This employee will be top-level.
              </FormHelperText>
            )}
          </FormControl>
        </div>

        {/* Display Selected Manager Info */}
        {reportingToValue && (
          <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Selected Manager:</span>{' '}
              {(() => {
                const selectedEmployee = employees.find(emp => emp.id === reportingToValue);
                if (selectedEmployee) {
                  const designation = (selectedEmployee as any).designation || 'N/A';
                  return `${selectedEmployee.first_name} ${selectedEmployee.last_name} (${designation}) - ${selectedEmployee.employee_code}`;
                }
                return 'Loading...';
              })()}
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> The employee code will be automatically generated upon creation.
          If no manager is selected, this employee will be considered a top-level employee.
        </p>
      </div>
    </div>
  );
};

