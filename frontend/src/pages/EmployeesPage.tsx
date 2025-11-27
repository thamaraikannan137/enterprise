import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchEmployees } from '../store/slices/employeeSlice';
import { EmployeeList } from '../components/features/employee';
import type { Employee } from '../types/employee';

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employee);

  useEffect(() => {
    // Fetch all employees - DataTable will handle client-side pagination and filtering
    dispatch(fetchEmployees({ page: 1, limit: 1000 }));
  }, [dispatch]);

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

