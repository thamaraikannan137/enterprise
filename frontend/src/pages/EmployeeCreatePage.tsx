import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { createEmployee } from '../store/slices/employeeSlice';
import { EmployeeCreateForm } from '../components/forms/EmployeeCreateForm';
import { MuiButton } from '../components/common';
import { employeeJobInfoService } from '../services/employeeJobInfoService';
import type { CreateEmployeeWithDetailsInput } from '../types/employeeRelated';

export const EmployeeCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.employee);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateEmployeeWithDetailsInput) => {
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Full data received from form:', JSON.stringify(data, null, 2));
      console.log('Employee data:', JSON.stringify(data.employee, null, 2));
      
      // Step 1: Create employee with all personal information
      // Map email to work_email (the form uses 'email' but backend expects 'work_email')
      // Remove job-related fields as they will go to EmployeeJobInfo
      const { 
        email, 
        designation,
        department,
        joining_date,
        time_type,
        location,
        legal_entity,
        business_unit,
        worker_type,
        probation_policy,
        notice_period,
        reporting_to,
        secondary_job_titles,
        status,
        ...restEmployeeData 
      } = data.employee;
      
      console.log('Extracted job fields:', {
        designation,
        department,
        joining_date,
        time_type,
        location,
      });
      
      const employeeData: any = {
        ...restEmployeeData,
        // Map email to work_email if email is provided
        work_email: email,
        // mobile_number is already in the correct field name
        mobile_number: data.employee.mobile_number,
      };
      
      const employee = await dispatch(createEmployee(employeeData)).unwrap();
      const employeeId = employee.id;

      // Step 2: Create EmployeeJobInfo with job-related fields
      const promises: Promise<any>[] = [];

      // Extract job-related fields and create EmployeeJobInfo
      // Use the extracted variables from the destructuring above
      // Ensure required fields are present and not empty strings
      if (!designation || designation.trim() === '') {
        throw new Error('Designation is required');
      }
      if (!department || department.trim() === '') {
        throw new Error('Department is required');
      }
      if (!joining_date || joining_date.trim() === '') {
        throw new Error('Joining date is required');
      }
      if (!time_type) {
        throw new Error('Time type is required');
      }
      if (!location || location.trim() === '') {
        throw new Error('Location is required');
      }

      const jobInfoData: any = {
        employee_id: employeeId,
        designation: designation.trim(),
        department: department.trim(),
        joining_date: joining_date.trim(),
        time_type: time_type,
        location: location.trim(),
        status: status || 'active',
        is_current: true,
        effective_from: new Date().toISOString(),
      };

      // Add optional fields if they exist
      if (legal_entity) {
        jobInfoData.legal_entity = legal_entity;
      }
      if (business_unit) {
        jobInfoData.business_unit = business_unit;
      }
      if (worker_type) {
        jobInfoData.worker_type = worker_type;
      }
      if (probation_policy) {
        jobInfoData.probation_policy = probation_policy;
      }
      if (notice_period) {
        jobInfoData.notice_period = notice_period;
      }
      if (reporting_to) {
        jobInfoData.reporting_to = reporting_to;
      }
      if (secondary_job_titles && secondary_job_titles.length > 0) {
        jobInfoData.secondary_job_titles = secondary_job_titles;
      }

      console.log('Creating EmployeeJobInfo with data:', JSON.stringify(jobInfoData, null, 2));
      console.log('Field values:', {
        designation: designation,
        department: department,
        joining_date: joining_date,
        time_type: time_type,
        location: location,
      });
      
      promises.push(employeeJobInfoService.createJobInfo(jobInfoData));

      // Note: Contact information is now part of Employee model, so no separate contact creation needed
      // Note: Compensation, documents, work pass, qualifications, and certifications are not collected
      // in the create form and should be added later from the employee profile page if needed

      // Wait for all related data to be created
      await Promise.allSettled(promises);

      // Navigate to employee profile
      navigate(`/employees/${employeeId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create employee';
      setSubmitError(errorMessage);
      console.error('Failed to create employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <MuiButton
            variant="outlined"
            onClick={() => navigate('/employees')}
            disabled={loading}
          >
            ← Back to Employees
          </MuiButton>
        </div>

        {/* Error Display */}
        {(error || submitError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || submitError}
          </div>
        )}

        {/* Form */}
        <EmployeeCreateForm onSubmit={handleSubmit} isLoading={loading || isSubmitting} />
      </div>
    </div>
  );
};

