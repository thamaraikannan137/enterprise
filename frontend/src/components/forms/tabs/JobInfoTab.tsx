import { useState } from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { MuiInput } from '../../common';
import { useEmployeeList } from '../../../hooks/useEmployeeList';
import { 
  CircularProgress, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  Chip,
  IconButton,
  TextField,
  Grid
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import type { LegalEntity, BusinessUnit } from '../../../types/organization';

// Mock data for probation policies and notice periods
// TODO: Replace with actual API calls when available
const PROBATION_POLICIES = [
  { id: 'probation-india', name: 'Probation-India', duration: '3 Months' },
  { id: 'probation-singapore', name: 'Probation-Singapore', duration: '6 Months' },
  { id: 'probation-us', name: 'Probation-US', duration: '90 Days' },
];

const NOTICE_PERIODS = [
  { id: 'notice-india', name: 'India - Notice period', duration: '60 Days' },
  { id: 'notice-singapore', name: 'Singapore - Notice period', duration: '30 Days' },
  { id: 'notice-us', name: 'US - Notice period', duration: '2 Weeks' },
];

const WORKER_TYPES = [
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'intern', label: 'Intern' },
];

// Mock data for legal entities and business units
// TODO: Replace with actual API calls when available
const MOCK_LEGAL_ENTITIES: LegalEntity[] = [
  { id: '1', entity_name: 'Golden Bolt- India', legal_name: 'Golden Bolt India Private Limited', date_of_incorporation: '2020-01-01', business_type: 'Private Limited', industry_type: 'Technology', currency: 'INR', financial_year: '2024', street_1: '123 Tech Park', city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { id: '2', entity_name: 'Golden Bolt- Singapore', legal_name: 'Golden Bolt Singapore Pte Ltd', date_of_incorporation: '2021-01-01', business_type: 'Private Limited', industry_type: 'Technology', currency: 'SGD', financial_year: '2024', street_1: '456 Business Hub', city: 'Singapore', state: 'Singapore', country: 'Singapore' },
];

const MOCK_BUSINESS_UNITS: BusinessUnit[] = [
  { id: '1', name: 'Business Development', description: 'Business Development Unit', status: 'active' },
  { id: '2', name: 'Engineering', description: 'Engineering Unit', status: 'active' },
  { id: '3', name: 'Sales', description: 'Sales Unit', status: 'active' },
  { id: '4', name: 'Marketing', description: 'Marketing Unit', status: 'active' },
];

const MOCK_DEPARTMENTS = [
  'content',
  'Engineering',
  'HR',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
];

const MOCK_LOCATIONS = [
  'Hyderabad',
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Singapore',
  'Remote',
];

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'secondary_job_titles',
  });

  const reportingToValue = watch('reporting_to');
  const probationPolicyValue = watch('probation_policy');
  const noticePeriodValue = watch('notice_period');

  const selectedProbationPolicy = PROBATION_POLICIES.find(p => p.id === probationPolicyValue);
  const selectedNoticePeriod = NOTICE_PERIODS.find(p => p.id === noticePeriodValue);

  return (
    <div className="space-y-8">
      {/* Employment Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Joining Date */}
          <div>
            <MuiInput
              {...register('joining_date')}
              type="date"
              label="Joining Date"
              error={errors.joining_date?.message as string}
              required
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0], // Prevent future dates
              }}
            />
          </div>

          {/* Secondary Job Titles */}
          <div>
            <div className="mb-2">
              <button
                type="button"
                onClick={() => append('')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Add fontSize="small" />
                Add secondary job title
              </button>
            </div>
            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                      name={`secondary_job_titles.${index}`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          placeholder="Enter secondary job title"
                          variant="outlined"
                        />
                      )}
                    />
                    <IconButton
                      size="small"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Title (Designation) */}
          <div>
            <MuiInput
              {...register('designation')}
              type="text"
              label="Job Title"
              placeholder="e.g., Filmmaker, Lead Engineer"
              error={errors.designation?.message as string}
              required
            />
          </div>

          {/* Time Type */}
          <div>
            <FormControl fullWidth error={!!errors.time_type} required>
              <InputLabel shrink>Time Type</InputLabel>
              <Controller
                name="time_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || 'full_time'}
                    label="Time Type"
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                  </Select>
                )}
              />
              {errors.time_type && (
                <FormHelperText>{errors.time_type.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </div>

      {/* Organisational Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisational Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Legal Entity */}
          <div>
            <FormControl fullWidth error={!!errors.legal_entity} required>
              <InputLabel shrink>Legal Entity</InputLabel>
              <Controller
                name="legal_entity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Legal Entity"
                  >
                    {MOCK_LEGAL_ENTITIES.map((entity) => (
                      <MenuItem key={entity.id} value={entity.id}>
                        {entity.entity_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.legal_entity && (
                <FormHelperText>{errors.legal_entity.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Business Unit */}
          <div>
            <FormControl fullWidth error={!!errors.business_unit} required>
              <InputLabel shrink>Business Unit</InputLabel>
              <Controller
                name="business_unit"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Business Unit"
                  >
                    {MOCK_BUSINESS_UNITS.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.business_unit && (
                <FormHelperText>{errors.business_unit.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Department */}
          <div>
            <FormControl fullWidth error={!!errors.department} required>
              <InputLabel shrink>Department</InputLabel>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Department"
                  >
                    {MOCK_DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.department && (
                <FormHelperText>{errors.department.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Location */}
          <div>
            <FormControl fullWidth error={!!errors.location} required>
              <InputLabel shrink>Location</InputLabel>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Location"
                  >
                    {MOCK_LOCATIONS.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.location && (
                <FormHelperText>{errors.location.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Worker Type */}
          <div>
            <FormControl fullWidth error={!!errors.worker_type} required>
              <InputLabel shrink>Worker Type</InputLabel>
              <Controller
                name="worker_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Worker Type"
                  >
                    {WORKER_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.worker_type && (
                <FormHelperText>{errors.worker_type.message as string}</FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Reporting Manager */}
          <div>
            <FormControl fullWidth error={!!errors.reporting_to}>
              <InputLabel shrink>Reporting Manager</InputLabel>
              <Controller
                name="reporting_to"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    value={field.value || ''}
                    label="Reporting Manager"
                    disabled={employeesLoading}
                    endAdornment={
                      employeesLoading ? (
                        <CircularProgress size={20} className="mr-2" />
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em className="text-gray-400">No Manager</em>
                    </MenuItem>
                    {employees.map((employee) => {
                      const fullName = `${employee.first_name} ${employee.last_name}`;
                      const designation = (employee as any).designation || '';
                      return (
                        <MenuItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            {employee.profile_photo_path && (
                              <img
                                src={employee.profile_photo_path}
                                alt={fullName}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span>{fullName}{designation ? ` (${designation})` : ''}</span>
                          </div>
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
            </FormControl>
            
            {/* Display Selected Manager */}
            {reportingToValue && (
              <div className="mt-2">
                <Controller
                  name="reporting_to"
                  control={control}
                  render={({ field }) => {
                    const selectedEmployee = employees.find(emp => emp.id === reportingToValue);
                    if (selectedEmployee) {
                      const designation = (selectedEmployee as any).designation || '';
                      return (
                        <Chip
                          label={`${selectedEmployee.first_name} ${selectedEmployee.last_name}${designation ? ` (${designation})` : ''}`}
                          onDelete={() => field.onChange('')}
                          deleteIcon={<Close />}
                          avatar={
                            selectedEmployee.profile_photo_path ? (
                              <img
                                src={selectedEmployee.profile_photo_path}
                                alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : undefined
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employment Terms Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Probation Policy */}
          <div>
            <FormControl fullWidth error={!!errors.probation_policy} required>
              <InputLabel shrink>Probation Policy</InputLabel>
              <Controller
                name="probation_policy"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Probation Policy"
                  >
                    {PROBATION_POLICIES.map((policy) => (
                      <MenuItem key={policy.id} value={policy.id}>
                        {policy.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.probation_policy && (
                <FormHelperText>{errors.probation_policy.message as string}</FormHelperText>
              )}
              {selectedProbationPolicy && (
                <FormHelperText className="text-gray-600 mt-1">
                  Duration: {selectedProbationPolicy.duration}
                </FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Notice Period */}
          <div>
            <FormControl fullWidth error={!!errors.notice_period} required>
              <InputLabel shrink>Notice Period</InputLabel>
              <Controller
                name="notice_period"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    label="Notice Period"
                  >
                    {NOTICE_PERIODS.map((period) => (
                      <MenuItem key={period.id} value={period.id}>
                        {period.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.notice_period && (
                <FormHelperText>{errors.notice_period.message as string}</FormHelperText>
              )}
              {selectedNoticePeriod && (
                <FormHelperText className="text-gray-600 mt-1">
                  Duration: {selectedNoticePeriod.duration}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};
