import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { createEmployee } from '../store/slices/employeeSlice';
import { EmployeeCreateForm } from '../components/forms/EmployeeCreateForm';
import { MuiButton } from '../components/common';
import { employeeRelatedService } from '../services/employeeRelatedService';
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
      // Step 1: Create employee (without email/mobile as they're not in Employee model)
      const { email, mobile_number, ...employeeData } = data.employee;
      const employee = await dispatch(createEmployee(employeeData)).unwrap();
      const employeeId = employee.id;

      // Step 2: Create related data in parallel (where possible)
      const promises: Promise<any>[] = [];

      // Create primary contact with email and mobile_number if provided
      if (email || mobile_number) {
        promises.push(
          employeeRelatedService.createContact({
            employee_id: employeeId,
            contact_type: 'primary',
            email: email || undefined,
            phone: mobile_number || undefined,
            is_current: true,
            valid_from: new Date().toISOString(),
          })
        );
      }

      // Create additional contacts
      if (data.contacts && data.contacts.length > 0) {
        data.contacts.forEach((contact) => {
          promises.push(
            employeeRelatedService.createContact({
              ...contact,
              employee_id: employeeId,
            })
          );
        });
      }

      // Create compensation
      if (data.compensation) {
        promises.push(
          employeeRelatedService.createCompensation({
            ...data.compensation,
            employee_id: employeeId,
          })
        );
      }

      // Create documents
      if (data.documents && data.documents.length > 0) {
        data.documents.forEach((doc) => {
          if (doc.document_name && doc.file_path) {
            promises.push(
              employeeRelatedService.createDocument({
                ...doc,
                employee_id: employeeId,
              })
            );
          }
        });
      }

      // Create work pass
      if (data.workPass) {
        promises.push(
          employeeRelatedService.createWorkPass({
            ...data.workPass,
            employee_id: employeeId,
          })
        );
      }

      // Create qualifications
      if (data.qualifications && data.qualifications.length > 0) {
        data.qualifications.forEach((qual) => {
          if (qual.degree && qual.institution && qual.completion_year) {
            promises.push(
              employeeRelatedService.createQualification({
                ...qual,
                employee_id: employeeId,
              })
            );
          }
        });
      }

      // Create certifications
      if (data.certifications && data.certifications.length > 0) {
        data.certifications.forEach((cert) => {
          if (cert.certification_name && cert.issue_date) {
            promises.push(
              employeeRelatedService.createCertification({
                ...cert,
                employee_id: employeeId,
              })
            );
          }
        });
      }

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

