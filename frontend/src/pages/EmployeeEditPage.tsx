import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchEmployeeById,
  updateEmployee,
  clearError,
} from '../store/slices/employeeSlice';
import { EmployeeForm } from '../components/forms';
import { MuiButton } from '../components/common';
import type { UpdateEmployeeInput } from '../types/employee';

export const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentEmployee, loading, error } = useAppSelector(
    (state) => state.employee
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  const handleSubmit = async (data: UpdateEmployeeInput) => {
    if (!id) return;

    try {
      await dispatch(updateEmployee({ id, data })).unwrap();
      navigate(`/employees/${id}`);
    } catch (error) {
      console.error('Failed to update employee:', error);
      // Error is handled by Redux state
    }
  };

  if (loading && !currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading employee...</div>
        </div>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Employee not found</p>
          <MuiButton onClick={() => navigate('/employees')}>
            Back to Employees
          </MuiButton>
        </div>
      </div>
    );
  }

  // Convert employee to form default values
  const defaultValues = {
    first_name: currentEmployee.first_name,
    middle_name: currentEmployee.middle_name || '',
    last_name: currentEmployee.last_name,
    date_of_birth: currentEmployee.date_of_birth.split('T')[0], // Extract date part
    gender: currentEmployee.gender,
    nationality: currentEmployee.nationality,
    marital_status: currentEmployee.marital_status,
    profile_photo_path: currentEmployee.profile_photo_path || '',
    status: currentEmployee.status,
    designation: (currentEmployee as any).designation || '',
    department: (currentEmployee as any).department || '',
    reporting_to: (currentEmployee as any).reporting_to || '',
    hire_date: currentEmployee.hire_date.split('T')[0], // Extract date part
    termination_date: currentEmployee.termination_date
      ? currentEmployee.termination_date.split('T')[0]
      : '',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <EmployeeForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
};

