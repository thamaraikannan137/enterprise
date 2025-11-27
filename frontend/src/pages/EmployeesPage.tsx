import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployees } from '../store/slices/employeeSlice';
import { EmployeeList } from '../components/features/employee/EmployeeList';
import { useToast } from '../contexts/ToastContext';
import type { Employee } from '../types/employee';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showError } = useToast();
  const { employees, loading, error } = useAppSelector((state) => state.employee);

  useEffect(() => {
    // Fetch employees with reasonable limit - DataTable will handle client-side pagination and filtering
    // Using 100 as default limit to avoid rate limiting issues
    const loadEmployees = async () => {
      try {
        await dispatch(fetchEmployees({ page: 1, limit: 10 })).unwrap();
      } catch (err: any) {
        // Handle rate limit errors specifically
        if (err?.response?.status === 429 || err?.message?.includes('Too many requests')) {
          showError('Too many requests. Please wait a moment and try again.');
        } else {
          const errorMessage = err?.message || 'Failed to load employees. Please try again.';
          showError(errorMessage);
        }
      }
    };
    loadEmployees();
  }, [dispatch, showError]);

  const handleEmployeeClick = (employee: Employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleCreateClick = () => {
    navigate('/employees/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <EmployeeList
        employees={employees}
        loading={loading}
        onEmployeeClick={handleEmployeeClick}
        onCreateClick={handleCreateClick}
      />
    </div>
  );
};

