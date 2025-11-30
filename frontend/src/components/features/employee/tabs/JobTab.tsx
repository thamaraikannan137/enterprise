import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { Add, Close } from '@mui/icons-material';
import { TextField, Select, MenuItem, FormControl, InputLabel, IconButton, FormHelperText } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { updateEmployee, fetchEmployeeWithDetails } from '../../../../store/slices/employeeSlice';
import { useEmployeeList } from '../../../../hooks/useEmployeeList';
import { useToast } from '../../../../contexts/ToastContext';
import { EditableCard } from './sections/EditableCard';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { LegalEntity, BusinessUnit } from '../../../../types/organization';

// Mock data - TODO: Replace with actual API calls
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

interface JobTabProps {
  employee: EmployeeWithDetails;
}

const jobInfoSchema = z.object({
  designation: z.string().min(1, 'Designation is required').max(100, 'Designation must be less than 100 characters'),
  department: z.string().min(1, 'Department is required').max(100, 'Department must be less than 100 characters'),
  reporting_to: z.string().optional().or(z.literal('')),
  employee_code: z.string().optional().or(z.literal('')),
  hire_date: z.string().optional().or(z.literal('')),
  joining_date: z.string().optional().or(z.literal('')),
  time_type: z.enum(['full_time', 'contract']).optional(),
  location: z.string().optional().or(z.literal('')),
  business_unit: z.string().optional().or(z.literal('')),
  legal_entity: z.string().optional().or(z.literal('')),
  work_location: z.string().optional().or(z.literal('')),
  employment_type: z.string().optional().or(z.literal('')),
  worker_type: z.string().optional().or(z.literal('')),
  probation_policy: z.string().optional().or(z.literal('')),
  notice_period: z.string().optional().or(z.literal('')),
  secondary_job_titles: z.array(z.string()).optional(),
  termination_date: z.string().optional().or(z.literal('')),
});

type JobInfoFormData = z.infer<typeof jobInfoSchema>;

export const JobTab = ({
  employee,
}: JobTabProps) => {
  const dispatch = useAppDispatch();
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
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
      hire_date: employee.hire_date ? (typeof employee.hire_date === 'string' ? employee.hire_date.split('T')[0] : new Date(employee.hire_date).toISOString().split('T')[0]) : '',
      joining_date: (employee as any).joining_date ? (typeof (employee as any).joining_date === 'string' ? (employee as any).joining_date.split('T')[0] : new Date((employee as any).joining_date).toISOString().split('T')[0]) : '',
      time_type: (employee as any).time_type || 'full_time',
      location: (employee as any).location || '',
      business_unit: (employee as any).business_unit || '',
      legal_entity: (employee as any).legal_entity || '',
      work_location: (employee as any).work_location || '',
      employment_type: (employee as any).employment_type || '',
      worker_type: (employee as any).worker_type || '',
      probation_policy: (employee as any).probation_policy || '',
      notice_period: (employee as any).notice_period || '',
      secondary_job_titles: (employee as any).secondary_job_titles || [],
      termination_date: employee.termination_date ? (typeof employee.termination_date === 'string' ? employee.termination_date.split('T')[0] : new Date(employee.termination_date).toISOString().split('T')[0]) : '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: 'secondary_job_titles',
  });

  useEffect(() => {
    reset({
      designation: employee.designation || '',
      department: employee.department || '',
      reporting_to: employee.reporting_to || '',
      employee_code: employee.employee_code || '',
      hire_date: employee.hire_date ? (typeof employee.hire_date === 'string' ? employee.hire_date.split('T')[0] : new Date(employee.hire_date).toISOString().split('T')[0]) : '',
      joining_date: (employee as any).joining_date ? (typeof (employee as any).joining_date === 'string' ? (employee as any).joining_date.split('T')[0] : new Date((employee as any).joining_date).toISOString().split('T')[0]) : '',
      time_type: (employee as any).time_type || 'full_time',
      location: (employee as any).location || '',
      business_unit: (employee as any).business_unit || '',
      legal_entity: (employee as any).legal_entity || '',
      work_location: (employee as any).work_location || '',
      employment_type: (employee as any).employment_type || '',
      worker_type: (employee as any).worker_type || '',
      probation_policy: (employee as any).probation_policy || '',
      notice_period: (employee as any).notice_period || '',
      secondary_job_titles: (employee as any).secondary_job_titles || [],
      termination_date: employee.termination_date ? (typeof employee.termination_date === 'string' ? employee.termination_date.split('T')[0] : new Date(employee.termination_date).toISOString().split('T')[0]) : '',
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
          hire_date: data.hire_date && data.hire_date.trim() !== '' ? data.hire_date : (null as any),
          joining_date: data.joining_date && data.joining_date.trim() !== '' ? data.joining_date : (null as any),
          time_type: data.time_type || (null as any),
          location: data.location && data.location.trim() !== '' ? data.location : (null as any),
          termination_date: data.termination_date && data.termination_date.trim() !== '' ? data.termination_date : (null as any),
          // Additional fields - using type assertion as they may not be in the type definition yet
          business_unit: data.business_unit && data.business_unit.trim() !== '' ? data.business_unit : (null as any),
          legal_entity: data.legal_entity && data.legal_entity.trim() !== '' ? data.legal_entity : (null as any),
          work_location: data.work_location && data.work_location.trim() !== '' ? data.work_location : (null as any),
          employment_type: data.employment_type && data.employment_type.trim() !== '' ? data.employment_type : (null as any),
          worker_type: data.worker_type && data.worker_type.trim() !== '' ? data.worker_type : (null as any),
          probation_policy: data.probation_policy && data.probation_policy.trim() !== '' ? data.probation_policy : (null as any),
          notice_period: data.notice_period && data.notice_period.trim() !== '' ? data.notice_period : (null as any),
          secondary_job_titles: data.secondary_job_titles && data.secondary_job_titles.length > 0 ? data.secondary_job_titles : (null as any),
        } as any,
      })).unwrap();
      
      // Refetch employee details to update the UI immediately
      if (employeeId) {
        await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      }
      
      showSuccess('Job information saved successfully!');
      setIsEditMode(false);
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
      hire_date: employee.hire_date ? (typeof employee.hire_date === 'string' ? employee.hire_date.split('T')[0] : new Date(employee.hire_date).toISOString().split('T')[0]) : '',
      joining_date: (employee as any).joining_date ? (typeof (employee as any).joining_date === 'string' ? (employee as any).joining_date.split('T')[0] : new Date((employee as any).joining_date).toISOString().split('T')[0]) : '',
      time_type: (employee as any).time_type || 'full_time',
      location: (employee as any).location || '',
      business_unit: (employee as any).business_unit || '',
      legal_entity: (employee as any).legal_entity || '',
      work_location: (employee as any).work_location || '',
      employment_type: (employee as any).employment_type || '',
      worker_type: (employee as any).worker_type || '',
      probation_policy: (employee as any).probation_policy || '',
      notice_period: (employee as any).notice_period || '',
      secondary_job_titles: (employee as any).secondary_job_titles || [],
      termination_date: employee.termination_date ? (typeof employee.termination_date === 'string' ? employee.termination_date.split('T')[0] : new Date(employee.termination_date).toISOString().split('T')[0]) : '',
    });
    setIsEditMode(false);
  };

  const getReportingManagerName = () => {
    if (!employee.reporting_to) return '-';
    
    // Check if reporting_to is a populated object (from backend)
    if (typeof employee.reporting_to === 'object' && employee.reporting_to !== null) {
      const reportingTo = employee.reporting_to as any;
      const name = `${reportingTo.first_name || ''} ${reportingTo.last_name || ''}`.trim();
      const designation = reportingTo.designation ? ` (${reportingTo.designation})` : '';
      return name ? `${name}${designation}` : '-';
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
      return name ? `${name}${designation}` : '-';
    }
    
    // If still not found, return the ID or a fallback
    return reportingToId || '-';
  };

  const getDisplayValue = (value: any, fallback: string = '-') => {
    if (value === null || value === undefined || value === '') return fallback;
    return value;
  };

  const getLegalEntityName = (id: string | undefined) => {
    if (!id) return '-';
    const entity = MOCK_LEGAL_ENTITIES.find(e => e.id === id);
    return entity ? entity.entity_name : '-';
  };

  const getBusinessUnitName = (id: string | undefined) => {
    if (!id) return '-';
    const unit = MOCK_BUSINESS_UNITS.find(u => u.id === id);
    return unit ? unit.name : '-';
  };

  const getWorkerTypeLabel = (value: string | undefined) => {
    if (!value) return '-';
    const type = WORKER_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getProbationPolicyName = (id: string | undefined) => {
    if (!id) return '-';
    const policy = PROBATION_POLICIES.find(p => p.id === id);
    return policy ? policy.name : '-';
  };

  const getProbationPolicyDuration = (id: string | undefined) => {
    if (!id) return '-';
    const policy = PROBATION_POLICIES.find(p => p.id === id);
    return policy ? policy.duration : '-';
  };

  const getNoticePeriodName = (id: string | undefined) => {
    if (!id) return '-';
    const period = NOTICE_PERIODS.find(p => p.id === id);
    return period ? period.name : '-';
  };

  const getNoticePeriodDuration = (id: string | undefined) => {
    if (!id) return '-';
    const period = NOTICE_PERIODS.find(p => p.id === id);
    return period ? period.duration : '-';
  };

  return (
    <div className="space-y-6">
      {import.meta.env.DEV && <DevTool control={control} />}
        <EditableCard
        title="Job Information"
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        modalMaxWidth="lg"
        editContent={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Employment Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Joining Date */}
                <div>
                <Controller
                  name="joining_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Joining Date"
                      type="date"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                        required
                      />
                    )}
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
                  <Controller
                    name="designation"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Job Title"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                        required
                    />
                  )}
                />
                </div>

                {/* Time Type */}
                <div>
                <Controller
                  name="time_type"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Time Type</InputLabel>
                      <Select
                          {...field}
                        value={field.value || 'full_time'}
                        label="Time Type"
                      >
                        <MenuItem value="full_time">Full Time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                      </Select>
                      {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                </div>
              </div>
            </div>

            {/* Organisational Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Legal Entity */}
                <div>
                <Controller
                    name="legal_entity"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Legal Entity</InputLabel>
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
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </div>

                {/* Business Unit */}
                <div>
                <Controller
                  name="business_unit"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Business Unit</InputLabel>
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
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </div>

                {/* Department */}
                <div>
                <Controller
                    name="department"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Department</InputLabel>
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
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </div>

                {/* Location */}
                <div>
                <Controller
                    name="location"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Location</InputLabel>
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
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </div>

                {/* Worker Type */}
                <div>
                <Controller
                    name="worker_type"
                  control={control}
                  render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error} required>
                        <InputLabel shrink>Worker Type</InputLabel>
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
                      {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                </div>

                {/* Reporting Manager */}
                <div>
                  <Controller
                    name="reporting_to"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel shrink>Reporting Manager</InputLabel>
                        <Select
                        {...field}
                          displayEmpty
                          value={field.value || ''}
                          label="Reporting Manager"
                          disabled={managerOptionsLoading}
                        >
                          <MenuItem value="">
                            <em className="text-gray-400">No Manager</em>
                          </MenuItem>
                          {managerOptions.map((manager) => {
                            const fullName = `${manager.first_name} ${manager.last_name}`;
                            const designation = (manager as any).designation || '';
                            return (
                              <MenuItem key={manager.id} value={manager.id}>
                                {fullName}{designation ? ` (${designation})` : ''}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
            </div>
              </div>
            </div>

            {/* Employment Terms Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Probation Policy */}
            <div>
                  <Controller
                    name="probation_policy"
                    control={control}
                    render={({ field, fieldState }) => {
                      const selectedPolicy = PROBATION_POLICIES.find(p => p.id === field.value);
                      return (
                        <FormControl fullWidth error={!!fieldState.error} required>
                          <InputLabel shrink>Probation Policy</InputLabel>
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
                          {fieldState.error && (
                            <FormHelperText>{fieldState.error.message}</FormHelperText>
                          )}
                          {selectedPolicy && (
                            <FormHelperText className="text-gray-600 mt-1">
                              Duration: {selectedPolicy.duration}
                            </FormHelperText>
                          )}
                        </FormControl>
                      );
                    }}
                  />
                </div>

                {/* Notice Period */}
                <div>
                  <Controller
                    name="notice_period"
                    control={control}
                    render={({ field, fieldState }) => {
                      const selectedPeriod = NOTICE_PERIODS.find(p => p.id === field.value);
                      return (
                        <FormControl fullWidth error={!!fieldState.error} required>
                          <InputLabel shrink>Notice Period</InputLabel>
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
                          {fieldState.error && (
                            <FormHelperText>{fieldState.error.message}</FormHelperText>
                          )}
                          {selectedPeriod && (
                            <FormHelperText className="text-gray-600 mt-1">
                              Duration: {selectedPeriod.duration}
                            </FormHelperText>
                          )}
                        </FormControl>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        }
        >
        <div className="space-y-6">
            {/* Employment Details Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Joining Date
                </div>
                <div className="text-base text-gray-900">
                    {(employee as any).joining_date 
                      ? new Date((employee as any).joining_date).toLocaleDateString() 
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Secondary Job Titles
                  </div>
                  <div className="text-base text-gray-900">
                    {(employee as any).secondary_job_titles && (employee as any).secondary_job_titles.length > 0
                      ? (employee as any).secondary_job_titles.join(', ')
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Job Title
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue(employee.designation)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Time Type
                </div>
                <div className="text-base text-gray-900">
                    {(employee as any).time_type === 'full_time' ? 'Full Time' : (employee as any).time_type === 'contract' ? 'Contract' : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Organisational Details Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Legal Entity
                </div>
                <div className="text-base text-gray-900">
                    {getLegalEntityName((employee as any).legal_entity)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Business Unit
                </div>
                <div className="text-base text-gray-900">
                    {getBusinessUnitName((employee as any).business_unit)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Department
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue(employee.department)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue((employee as any).location)}</div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Worker Type
                  </div>
                  <div className="text-base text-gray-900">
                    {getWorkerTypeLabel((employee as any).worker_type)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Reporting Manager
                  </div>
                  <div className="text-base text-gray-900">{getReportingManagerName()}</div>
                </div>
              </div>
            </div>

            {/* Employment Terms Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Probation Policy
                </div>
                <div className="text-base text-gray-900">
                    {getProbationPolicyName((employee as any).probation_policy)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {getProbationPolicyDuration((employee as any).probation_policy)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Notice Period
                </div>
                <div className="text-base text-gray-900">
                    {getNoticePeriodName((employee as any).notice_period)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {getNoticePeriodDuration((employee as any).notice_period)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EditableCard>
    </div>
  );
};

