import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { updateEmployee } from '../../../../store/slices/employeeSlice';
import { useEmployeeList } from '../../../../hooks/useEmployeeList';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface JobTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const JobTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: JobTabProps) => {
  const dispatch = useAppDispatch();
  const { employees: managerOptions } = useEmployeeList({ 
    status: 'active', 
    limit: 100,
    excludeId: employee.id 
  });

  const [jobData, setJobData] = useState({
    designation: employee.designation || '',
    department: employee.department || '',
    reporting_to: employee.reporting_to || '',
    employee_code: employee.employee_code || '',
    hire_date: employee.hire_date.split('T')[0],
    termination_date: employee.termination_date?.split('T')[0] || '',
  });

  useEffect(() => {
    setJobData({
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date.split('T')[0],
      termination_date: employee.termination_date?.split('T')[0] || '',
    });
  }, [employee]);

  const handleSave = async () => {
    try {
      await dispatch(updateEmployee({
        id: employee.id,
        data: {
          designation: jobData.designation,
          department: jobData.department,
          reporting_to: jobData.reporting_to || undefined,
          hire_date: jobData.hire_date,
          termination_date: jobData.termination_date || undefined,
        },
      })).unwrap();
      onEditModeChange(false);
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleCancel = () => {
    setJobData({
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date.split('T')[0],
      termination_date: employee.termination_date?.split('T')[0] || '',
    });
    onEditModeChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  const getReportingManagerName = () => {
    if (!employee.reporting_to) return 'No Manager';
    const manager = managerOptions.find(m => m.id === employee.reporting_to);
    if (manager) {
      return `${manager.first_name} ${manager.last_name}${manager.designation ? ` (${manager.designation})` : ''}`;
    }
    return 'Loading...';
  };

  return (
    <div className="space-y-6">
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
          <div className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={jobData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={jobData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reporting To</InputLabel>
                  <Select
                    value={jobData.reporting_to || ''}
                    onChange={(e) => handleChange('reporting_to', e.target.value)}
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
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Number"
                  value={jobData.employee_code}
                  disabled
                  variant="outlined"
                  helperText="Employee code cannot be changed"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  type="date"
                  value={jobData.hire_date}
                  onChange={(e) => handleChange('hire_date', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Termination Date"
                  type="date"
                  value={jobData.termination_date}
                  onChange={(e) => handleChange('termination_date', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <div className="flex gap-2">
              <MuiButton
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </MuiButton>
              <MuiButton
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </MuiButton>
            </div>
          </div>
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

