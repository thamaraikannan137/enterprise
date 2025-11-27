import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { updateEmployee } from '../../../../store/slices/employeeSlice';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface AboutTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const AboutTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: AboutTabProps) => {
  const dispatch = useAppDispatch();
  const [personalData, setPersonalData] = useState({
    first_name: employee.first_name || '',
    middle_name: employee.middle_name || '',
    last_name: employee.last_name || '',
    date_of_birth: employee.date_of_birth?.split('T')[0] || '',
    gender: employee.gender || 'male',
    nationality: employee.nationality || '',
    marital_status: employee.marital_status || 'single',
    profile_photo_path: employee.profile_photo_path || '',
  });

  useEffect(() => {
    setPersonalData({
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: employee.gender || 'male',
      nationality: employee.nationality || '',
      marital_status: employee.marital_status || 'single',
      profile_photo_path: employee.profile_photo_path || '',
    });
  }, [employee]);

  const handleSave = async () => {
    try {
      await dispatch(updateEmployee({
        id: employee.id,
        data: {
          first_name: personalData.first_name,
          last_name: personalData.last_name,
          date_of_birth: personalData.date_of_birth,
          gender: personalData.gender,
          nationality: personalData.nationality,
          marital_status: personalData.marital_status,
          ...(personalData.middle_name && { middle_name: personalData.middle_name }),
          ...(personalData.profile_photo_path && { profile_photo_path: personalData.profile_photo_path }),
        },
      })).unwrap();
      onEditModeChange(false);
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleCancel = () => {
    setPersonalData({
      first_name: employee.first_name || '',
      middle_name: employee.middle_name || '',
      last_name: employee.last_name || '',
      date_of_birth: employee.date_of_birth?.split('T')[0] || '',
      gender: employee.gender || 'male',
      nationality: employee.nationality || '',
      marital_status: employee.marital_status || 'single',
      profile_photo_path: employee.profile_photo_path || '',
    });
    onEditModeChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
                  label="First Name"
                  value={personalData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={personalData.middle_name}
                  onChange={(e) => handleChange('middle_name', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={personalData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={personalData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={personalData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={personalData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Marital Status"
                  value={personalData.marital_status}
                  onChange={(e) => handleChange('marital_status', e.target.value)}
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profile Photo URL"
                  value={personalData.profile_photo_path}
                  onChange={(e) => handleChange('profile_photo_path', e.target.value)}
                  variant="outlined"
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
              <div className="text-sm font-medium text-gray-500 mb-1">First Name</div>
              <div className="text-base text-gray-900">{employee.first_name}</div>
            </div>
            {employee.middle_name && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Middle Name</div>
                <div className="text-base text-gray-900">{employee.middle_name}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Last Name</div>
              <div className="text-base text-gray-900">{employee.last_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Date of Birth</div>
              <div className="text-base text-gray-900">
                {new Date(employee.date_of_birth).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Gender</div>
              <div className="text-base text-gray-900 capitalize">{employee.gender}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Nationality</div>
              <div className="text-base text-gray-900">{employee.nationality}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Marital Status</div>
              <div className="text-base text-gray-900 capitalize">{employee.marital_status}</div>
            </div>
          </div>
        )}
      </MuiCard>
    </div>
  );
};

