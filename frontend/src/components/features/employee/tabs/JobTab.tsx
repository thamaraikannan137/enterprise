import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { Add, Close } from '@mui/icons-material';
import { TextField, Select, MenuItem, FormControl, InputLabel, IconButton, FormHelperText } from '@mui/material';
import { useAppDispatch } from '../../../../store';
import { fetchEmployeeWithDetails } from '../../../../store/slices/employeeSlice';
import { employeeJobInfoService } from '../../../../services/employeeJobInfoService';
import { useEmployeeList } from '../../../../hooks/useEmployeeList';
import { useToast } from '../../../../contexts/ToastContext';
import { EditableCard } from './sections/EditableCard';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { LegalEntity, BusinessUnit } from '../../../../types/organization';
import type { EmployeeJobInfo } from '../../../../types/employeeJobInfo';

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
  const [currentJobInfo, setCurrentJobInfo] = useState<EmployeeJobInfo | null>(null);
  const [loadingJobInfo, setLoadingJobInfo] = useState(true);
  const { employees: managerOptions, loading: managerOptionsLoading } = useEmployeeList({ 
    status: 'active', 
    limit: 100,
    excludeId: employee.id 
  });

  // Use employee.id if available, otherwise fall back to URL param
  const employeeId = employee?.id || employeeIdFromUrl;

  // Fetch current job info
  useEffect(() => {
    const fetchCurrentJobInfo = async () => {
      if (!employeeId) return;
      
      try {
        setLoadingJobInfo(true);
        const jobInfo = await employeeJobInfoService.getCurrentJobInfo(employeeId);
        setCurrentJobInfo(jobInfo);
      } catch (error: any) {
        console.error('Failed to fetch current job info:', error);
        // If 404, that's okay - no job info exists yet
        if (error?.response?.status !== 404) {
          showError('Failed to load job information');
        }
      } finally {
        setLoadingJobInfo(false);
      }
    };

    fetchCurrentJobInfo();
  }, [employeeId, showError]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<JobInfoFormData>({
    resolver: zodResolver(jobInfoSchema),
    mode: 'onChange',
    defaultValues: {
      designation: currentJobInfo?.designation || '',
      department: currentJobInfo?.department || '',
      reporting_to: (() => {
        const reportingTo = currentJobInfo?.reporting_to;
        if (!reportingTo) return '';
        // If it's an object, extract the ID
        if (typeof reportingTo === 'object' && reportingTo !== null) {
          return (reportingTo as any).id || (reportingTo as any)._id || '';
        }
        // If it's already a string, return it
        return typeof reportingTo === 'string' ? reportingTo : String(reportingTo);
      })(),
      employee_code: employee.employee_code || '',
      hire_date: currentJobInfo?.hire_date ? (typeof currentJobInfo.hire_date === 'string' ? currentJobInfo.hire_date.split('T')[0] : new Date(currentJobInfo.hire_date).toISOString().split('T')[0]) : '',
      joining_date: currentJobInfo?.joining_date ? (typeof currentJobInfo.joining_date === 'string' ? currentJobInfo.joining_date.split('T')[0] : new Date(currentJobInfo.joining_date).toISOString().split('T')[0]) : '',
      time_type: currentJobInfo?.time_type || 'full_time',
      location: currentJobInfo?.location || '',
      business_unit: currentJobInfo?.business_unit || '',
      legal_entity: currentJobInfo?.legal_entity || '',
      work_location: '',
      employment_type: '',
      worker_type: currentJobInfo?.worker_type || '',
      probation_policy: currentJobInfo?.probation_policy || '',
      notice_period: currentJobInfo?.notice_period || '',
      secondary_job_titles: currentJobInfo?.secondary_job_titles || [],
      termination_date: currentJobInfo?.termination_date ? (typeof currentJobInfo.termination_date === 'string' ? currentJobInfo.termination_date.split('T')[0] : new Date(currentJobInfo.termination_date).toISOString().split('T')[0]) : '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: 'secondary_job_titles',
  });

  useEffect(() => {
    if (currentJobInfo) {
      // Extract reporting_to ID if it's an object
      const getReportingToId = () => {
        const reportingTo = currentJobInfo.reporting_to;
        if (!reportingTo) return '';
        if (typeof reportingTo === 'object' && reportingTo !== null) {
          return (reportingTo as any).id || (reportingTo as any)._id || '';
        }
        return typeof reportingTo === 'string' ? reportingTo : String(reportingTo);
      };

      reset({
        designation: currentJobInfo.designation || '',
        department: currentJobInfo.department || '',
        reporting_to: getReportingToId(),
        employee_code: employee.employee_code || '',
        hire_date: currentJobInfo.hire_date ? (typeof currentJobInfo.hire_date === 'string' ? currentJobInfo.hire_date.split('T')[0] : new Date(currentJobInfo.hire_date).toISOString().split('T')[0]) : '',
        joining_date: currentJobInfo.joining_date ? (typeof currentJobInfo.joining_date === 'string' ? currentJobInfo.joining_date.split('T')[0] : new Date(currentJobInfo.joining_date).toISOString().split('T')[0]) : '',
        time_type: currentJobInfo.time_type || 'full_time',
        location: currentJobInfo.location || '',
        business_unit: currentJobInfo.business_unit || '',
        legal_entity: currentJobInfo.legal_entity || '',
        work_location: '',
        employment_type: '',
        worker_type: currentJobInfo.worker_type || '',
        probation_policy: currentJobInfo.probation_policy || '',
        notice_period: currentJobInfo.notice_period || '',
        secondary_job_titles: currentJobInfo.secondary_job_titles || [],
        termination_date: currentJobInfo.termination_date ? (typeof currentJobInfo.termination_date === 'string' ? currentJobInfo.termination_date.split('T')[0] : new Date(currentJobInfo.termination_date).toISOString().split('T')[0]) : '',
      });
    }
  }, [currentJobInfo, employee.employee_code, reset]);

  const onSubmit = async (data: JobInfoFormData) => {
    // Validate employee ID
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      console.error('Employee ID is missing:', { employeeId, employeeIdFromUrl, employee });
      return;
    }

    try {
      const jobInfoData: any = {
        designation: data.designation.trim(),
        department: data.department.trim(),
        ...(data.reporting_to && data.reporting_to.trim() !== '' && { reporting_to: data.reporting_to.trim() }),
        ...(data.hire_date && data.hire_date.trim() !== '' && { hire_date: data.hire_date }),
        ...(data.joining_date && data.joining_date.trim() !== '' && { joining_date: data.joining_date }),
        ...(data.time_type && { time_type: data.time_type }),
        ...(data.location && data.location.trim() !== '' && { location: data.location.trim() }),
        ...(data.business_unit && data.business_unit.trim() !== '' && { business_unit: data.business_unit.trim() }),
        ...(data.legal_entity && data.legal_entity.trim() !== '' && { legal_entity: data.legal_entity.trim() }),
        ...(data.worker_type && data.worker_type.trim() !== '' && { worker_type: data.worker_type.trim() }),
        ...(data.probation_policy && data.probation_policy.trim() !== '' && { probation_policy: data.probation_policy.trim() }),
        ...(data.notice_period && data.notice_period.trim() !== '' && { notice_period: data.notice_period.trim() }),
        ...(data.secondary_job_titles && data.secondary_job_titles.length > 0 && { secondary_job_titles: data.secondary_job_titles }),
        ...(data.termination_date && data.termination_date.trim() !== '' && { termination_date: data.termination_date }),
        status: currentJobInfo?.status || 'active',
        is_current: true,
      };

      if (currentJobInfo) {
        // Update existing job info
        await employeeJobInfoService.updateJobInfo(currentJobInfo.id, jobInfoData);
      } else {
        // Create new job info
        await employeeJobInfoService.createJobInfo({
          employee_id: employeeId,
          ...jobInfoData,
        });
      }
      
      // Refetch job info and employee details
      const updatedJobInfo = await employeeJobInfoService.getCurrentJobInfo(employeeId);
      setCurrentJobInfo(updatedJobInfo);
      
      if (employeeId) {
        await dispatch(fetchEmployeeWithDetails(employeeId)).unwrap();
      }
      
      showSuccess('Job information saved successfully!');
      setIsEditMode(false);
    } catch (error: any) {
      console.error('Failed to save job info:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save job information. Please try again.';
      showError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (currentJobInfo) {
      // Extract reporting_to ID if it's an object
      const getReportingToId = () => {
        const reportingTo = currentJobInfo.reporting_to;
        if (!reportingTo) return '';
        if (typeof reportingTo === 'object' && reportingTo !== null) {
          return (reportingTo as any).id || (reportingTo as any)._id || '';
        }
        return typeof reportingTo === 'string' ? reportingTo : String(reportingTo);
      };

      reset({
        designation: currentJobInfo.designation || '',
        department: currentJobInfo.department || '',
        reporting_to: getReportingToId(),
        employee_code: employee.employee_code || '',
        hire_date: currentJobInfo.hire_date ? (typeof currentJobInfo.hire_date === 'string' ? currentJobInfo.hire_date.split('T')[0] : new Date(currentJobInfo.hire_date).toISOString().split('T')[0]) : '',
        joining_date: currentJobInfo.joining_date ? (typeof currentJobInfo.joining_date === 'string' ? currentJobInfo.joining_date.split('T')[0] : new Date(currentJobInfo.joining_date).toISOString().split('T')[0]) : '',
        time_type: currentJobInfo.time_type || 'full_time',
        location: currentJobInfo.location || '',
        business_unit: currentJobInfo.business_unit || '',
        legal_entity: currentJobInfo.legal_entity || '',
        work_location: '',
        employment_type: '',
        worker_type: currentJobInfo.worker_type || '',
        probation_policy: currentJobInfo.probation_policy || '',
        notice_period: currentJobInfo.notice_period || '',
        secondary_job_titles: currentJobInfo.secondary_job_titles || [],
        termination_date: currentJobInfo.termination_date ? (typeof currentJobInfo.termination_date === 'string' ? currentJobInfo.termination_date.split('T')[0] : new Date(currentJobInfo.termination_date).toISOString().split('T')[0]) : '',
      });
    }
    setIsEditMode(false);
  };

  const getReportingManagerName = () => {
    // Check if reporting_to is a populated object (from backend)
    if (currentJobInfo?.reportingToEmployee) {
      const reportingTo = currentJobInfo.reportingToEmployee;
      const name = `${reportingTo.first_name || ''} ${reportingTo.last_name || ''}`.trim();
      const designation = reportingTo.designation ? ` (${reportingTo.designation})` : '';
      return name ? `${name}${designation}` : '-';
    }
    
    // Check if reporting_to is an object (not just an ID string)
    const reportingToValue = currentJobInfo?.reporting_to;
    if (!reportingToValue) return '-';
    
    if (typeof reportingToValue === 'object' && reportingToValue !== null) {
      // It's a populated object
      const reportingTo = reportingToValue as any;
      const name = `${reportingTo.first_name || ''} ${reportingTo.last_name || ''}`.trim();
      const designation = reportingTo.designation ? ` (${reportingTo.designation})` : '';
      return name ? `${name}${designation}` : '-';
    }
    
    // If reporting_to is a string ID, try to find it in managerOptions
    const reportingToId = typeof reportingToValue === 'string' ? reportingToValue : String(reportingToValue);
    
    // If managerOptions is still loading, show loading state
    if (managerOptionsLoading) {
      return 'Loading...';
    }
    
    const manager = managerOptions.find(m => m.id === reportingToId);
    if (manager) {
      return `${manager.first_name} ${manager.last_name}${manager.designation ? ` (${manager.designation})` : ''}`;
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

  if (loadingJobInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading job information...</div>
      </div>
    );
  }

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
                    {currentJobInfo?.joining_date 
                      ? new Date(currentJobInfo.joining_date).toLocaleDateString() 
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Secondary Job Titles
                  </div>
                  <div className="text-base text-gray-900">
                    {currentJobInfo?.secondary_job_titles && currentJobInfo.secondary_job_titles.length > 0
                      ? currentJobInfo.secondary_job_titles.join(', ')
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Job Title
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue(currentJobInfo?.designation)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Time Type
                </div>
                <div className="text-base text-gray-900">
                    {currentJobInfo?.time_type === 'full_time' ? 'Full Time' : currentJobInfo?.time_type === 'contract' ? 'Contract' : '-'}
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
                    {getLegalEntityName(currentJobInfo?.legal_entity)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Business Unit
                </div>
                <div className="text-base text-gray-900">
                    {getBusinessUnitName(currentJobInfo?.business_unit)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Department
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue(currentJobInfo?.department)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </div>
                  <div className="text-base text-gray-900">{getDisplayValue(currentJobInfo?.location)}</div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Worker Type
                  </div>
                  <div className="text-base text-gray-900">
                    {getWorkerTypeLabel(currentJobInfo?.worker_type)}
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
                    {getProbationPolicyName(currentJobInfo?.probation_policy)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {getProbationPolicyDuration(currentJobInfo?.probation_policy)}
                  </div>
                </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">
                    Notice Period
                </div>
                <div className="text-base text-gray-900">
                    {getNoticePeriodName(currentJobInfo?.notice_period)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duration: {getNoticePeriodDuration(currentJobInfo?.notice_period)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EditableCard>
    </div>
  );
};

